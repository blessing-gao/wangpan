<template>
  <div>
    <el-dialog
      v-model="dialogTableVisible"
      width="41.7%"
      :modal="false"
      :show-close="false"
      @close="close"
    >
      <!-- 文件或文件夹拖拽区域 -->
      <div
        class="file-box"
        @dragenter.prevent="handleDragEnter"
        @dragover.prevent="handleDragOver"
        @drop="handleDrop"
        @click="triggerFileInput"
      >
        <div>
          <img style="width: 83px" src="/assets/upload.png" />
          <p v-if="isUploadFile">拖拽文件到这里</p>
          <p v-else>拖拽文件夹到这里</p>
        </div>
        <!-- 隐藏的文件输入框 -->
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          :webkitdirectory="!isUploadFile"
          multiple
          @change="handleFileInputChange"
        />
      </div>

      <!-- 文件列表展示 -->
      <div v-if="fileList.length" class="file-style">
        <h3 v-if="isUploadFile">已选择的文件:</h3>
        <h3 v-else>已选择的文件夹内容:</h3>
        <ul>
          <li
            v-for="(file, index) in fileList"
            :key="index"
            class="file-style-content"
          >
            <template v-if="currentParentFolder">
              {{ currentParentFolder.uniqueKey }}
            </template>
            {{ file.name }}
            <!-- 显示上传进度条 -->
            <!-- <el-progress
              style="flex: 1"
              :color="customColorMethod"
              :percentage="uploadProgress[index]?.progress"
            /> -->
            <el-button @click="removeFile(index)" style="margin-left: 10px">
              <el-icon><Close /></el-icon>
            </el-button>
          </li>
        </ul>
      </div>
      <template #footer>
        <el-button
          style="background: #de3a05; border-radius: 4px; color: #fff"
          v-if="isUploadFile"
          @click="uploadFiles"
        >
          上传文件
        </el-button>
        <el-button
          style="background: #de3a05; border-radius: 4px; color: #fff"
          v-else
          @click="uploadFolders"
        >
          上传文件夹
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, getCurrentInstance } from 'vue'
import { ElNotification } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import * as panApi from '@/api/pan.js'
import '@/styles/components/uploadFile.css'

const { proxy } = getCurrentInstance()

const props = defineProps({
  demand: {
    type: Boolean,
    required: false,
  },
  uploadParams: {
    type: Object,
    required: false,
  },
  spaceId: {
    type: String,
    required: '',
  },
})

const dialogTableVisible = ref(false)
const fileList = ref([]) // 用于存储上传的文件列表
const isUploadFile = ref(true) // 上传模式标志，true 为文件，false 为文件夹
const currentParentFolder = ref(null)
// 打开组件并指定上传模式
const handleEdit = (uploadMode = 'file', parentFolder) => {
  isUploadFile.value = uploadMode === 'file'
  dialogTableVisible.value = true
  currentParentFolder.value = parentFolder
}

const fileTypeList = ref([])

const getFileType = () => {
  panApi.getFileTypes().then((res) => {
    fileTypeList.value = res.data
  })
}

// 处理拖拽进入事件
const handleDragEnter = (e) => e.preventDefault()
const handleDragOver = (e) => e.preventDefault()

// 处理文件或文件夹放下（drop）事件
const handleDrop = (e) => {
  e.preventDefault()

  const items = Array.from(e.dataTransfer.items)
  const files = []

  items.forEach((item) => {
    if (item.kind === 'file') {
      const entry = item.webkitGetAsEntry()
      if (!isUploadFile.value && entry.isDirectory) {
        traverseDirectory(entry)
      } else if (isUploadFile.value && entry.isFile) {
        const file = item.getAsFile()
        file && files.push(file)
      }
    }
  })

  handleFiles(files)
}

const hasMaxFilesWarning = ref(false)

// 处理文件选择框的变更事件
const handleFileInputChange = (event) => {
  const files = Array.from(event.target.files)
  const validFiles = files // 取消了文件大小限制

  validFiles.forEach((file) => fileList.value.push(file))

  event.target.value = ''
}

const fileInput = ref(null)
// 触发文件输入框的点击事件
const triggerFileInput = () => {
  fileInput.value.click()
}

// 递归读取文件夹内的文件
const traverseDirectory = (entry) => {
  const dirReader = entry.createReader()
  dirReader.readEntries((entries) => {
    entries.forEach((entry) => {
      if (entry.isDirectory) {
        traverseDirectory(entry)
      } else {
        entry.file((file) => {
          fileList.value.push(file)
        })
      }
    })
  })
}

// 处理文件选择（通过拖拽选择文件）
const handleFiles = (files) => {
  files.forEach((file) => {
    fileList.value.push(file)
  })
}

const emits = defineEmits(['ok', 'close'])
const uploadProgress = ref([]) // 用于存储每个文件的上传进度

// 上传文件到服务器，每次接口调用最多包含 10 个文件
const uploadFiles = () => {
  if (fileList.value.length === 0) return

  const uploadFileBatch = async (batchFiles) => {
    const formData = new FormData()
    formData.append('demand', props.demand)
    formData.append('spaceId', props.spaceId)
    formData.append('directoryId', props.uploadParams.directoryId)
    formData.append('fileType', props.uploadParams.fileType)
    batchFiles.map((file, index) => {
      formData.append('files', file)
      uploadProgress.value.push({ fileName: file.name, progress: 0 })
    })
    return panApi.uploadFile(formData).then((res) => {})
  }

  // 分批上传文件，每次上传最多10个文件
  const batchSize = 10
  let currentBatchIndex = 0

  // 上传文件直到没有剩余文件
  const uploadNextBatch = async () => {
    const batchFiles = fileList.value.slice(
      currentBatchIndex,
      currentBatchIndex + batchSize,
    )
    if (batchFiles.length > 0) {
      await uploadFileBatch(batchFiles)
      currentBatchIndex += batchSize
      uploadNextBatch() // 递归调用上传下一个批次
    } else {
      return
    }
  }

  uploadNextBatch()
    .then(() => {
      // 在所有文件上传完成后，调用 handleClose
      handleClose()
    })
    .catch((error) => {
      console.error('上传过程中出错:', error)
      handleClose() // 也可以在出错时调用 handleClose
    })
}

// 上传文件夹到服务器
const uploadFolders = () => {
  if (fileList.value.length === 0) return

  const uploadFileBatch = async (batchFiles) => {
    const formData = new FormData()
    formData.append('demand', props.demand)
    formData.append('spaceId', props.spaceId)
    formData.append('directoryId', props.uploadParams.directoryId)
    formData.append('fileType', props.uploadParams.fileType)
    batchFiles.map((file, index) => {
      formData.append('files', file)
      uploadProgress.value.push({ fileName: file.name, progress: 0 })
    })

    return panApi.uploadFile(formData).then((res) => {})
  }

  // 分批上传文件，每次上传最多10个文件
  const batchSize = 10
  let currentBatchIndex = 0

  // 上传文件直到没有剩余文件
  const uploadNextBatch = async () => {
    const batchFiles = fileList.value.slice(
      currentBatchIndex,
      currentBatchIndex + batchSize,
    )
    if (batchFiles.length > 0) {
      await uploadFileBatch(batchFiles)
      currentBatchIndex += batchSize
      uploadNextBatch() // 递归调用上传下一个批次
    } else {
      return
    }
  }

  uploadNextBatch()

  uploadNextBatch()
    .then(() => {
      // 在所有文件上传完成后，调用 handleClose
      handleClose()
    })
    .catch((error) => {
      console.error('上传过程中出错:', error)
      handleClose() // 也可以在出错时调用 handleClose
    })
}

const removeFile = (index) => {
  fileList.value.splice(index, 1)
}

onMounted(async () => {
  await nextTick()
  getFileType()
})

const close = () => {
  fileList.value = []
  hasMaxFilesWarning.value = false
  dialogTableVisible.value = false
}

const handleClose = () => {
  fileList.value = []
  hasMaxFilesWarning.value = false
  dialogTableVisible.value = false
  emits('close')
}

defineExpose({
  handleEdit,
})
</script>
