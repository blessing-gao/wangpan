<template>
  <div>
    <el-dialog
      v-model="dialogTableVisible"
      width="41.7%"
      :modal="false"
      :show-close="false"
      @close="handleClose"
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
          <p>上传文件的大小最大不能超过{{ maxSize }}MB</p>
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
            <template
              v-if="currentParentFolder && currentParentFolder.parentId != 0"
            >
              {{ currentParentFolder.uniqueKey }}
            </template>
            {{ file.name }}
            <!-- 显示上传进度条 -->
            <el-progress
              style="flex: 1"
              :color="customColorMethod"
              :percentage="uploadProgress[index]?.progress"
            />
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
import '@/styles/components/uploadFile.css' // 引入普通的 CSS 文件
const { proxy } = getCurrentInstance()

const props = defineProps({
  maxSize: {
    type: String,
    required: '0',
  },
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

const customColorMethod = (percentage) => {
  if (percentage < 30) {
    return '#909399'
  }
  if (percentage < 70) {
    return '#e6a23c'
  }
  return '#67c23a'
}

const dialogTableVisible = ref(false)
const fileList = ref([]) // 用于存储上传的文件列表
const isUploadFile = ref(true) // 上传模式标志，true 为文件，false 为文件夹
const currentParentFolder = ref(null)
// 打开组件并指定上传模式
const handleEdit = (uploadMode = 'file', parentFolder) => {
  isUploadFile.value = uploadMode === 'file'
  dialogTableVisible.value = true
  currentParentFolder.value = parentFolder
  console.log(currentParentFolder.value)
}

// 处理拖拽进入事件
const handleDragEnter = (e) => e.preventDefault()
const handleDragOver = (e) => e.preventDefault()

// 处理文件或文件夹放下（drop）事件
const handleDrop = (e) => {
  e.preventDefault()
  hasMaxFilesWarning.value = false // 重置警告状态

  const items = Array.from(e.dataTransfer.items)
  const files = []

  items.forEach((item) => {
    if (fileList.value.length >= 10) return

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

// 新增一个用于跟踪是否已显示最大文件数提示的状态
const hasMaxFilesWarning = ref(false)

// 处理文件选择框的变更事件
const handleFileInputChange = (event) => {
  const files = Array.from(event.target.files)
  const validFiles = []

  // 先过滤超大的文件
  files.forEach((file) => {
    const fileSize = file.size / 1024 / 1024
    if (fileSize > props.maxSize) {
      proxy.$modal.msgWarning(`文件 ${file.name} 大小超过限制，已跳过`)
    } else {
      validFiles.push(file)
    }
  })

  // 再处理数量限制
  const remainingSlots = 10 - fileList.value.length
  if (remainingSlots <= 0) {
    proxy.$modal.msgWarning('最多只能上传10个文件')
    event.target.value = ''
    return
  }

  const filesToAdd = validFiles.slice(0, remainingSlots)
  filesToAdd.forEach((file) => fileList.value.push(file))

  if (validFiles.length > remainingSlots) {
    proxy.$modal.msgWarning(
      `最多只能上传10个文件，已添加${filesToAdd.length}个`,
    )
  }

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
      if (fileList.value.length >= 10) return

      if (entry.isDirectory) {
        traverseDirectory(entry)
      } else {
        entry.file((file) => {
          if (fileList.value.length >= 10) {
            if (!hasMaxFilesWarning.value) {
              proxy.$modal.msgWarning('最多只能上传10个文件')
              hasMaxFilesWarning.value = true
            }
            return
          }
          fileList.value.push(file)
        })
      }
    })
  })
}

// 处理文件选择（通过拖拽选择文件）
const handleFiles = (files) => {
  const remainingSlots = 10 - fileList.value.length
  if (remainingSlots <= 0) {
    if (!hasMaxFilesWarning.value) {
      proxy.$modal.msgWarning('最多只能上传10个文件')
      hasMaxFilesWarning.value = true
    }
    return
  }

  const filesToAdd = files.slice(0, remainingSlots)
  filesToAdd.forEach((file) => {
    fileList.value.push(file)
  })

  if (files.length > remainingSlots && !hasMaxFilesWarning.value) {
    proxy.$modal.msgWarning(
      `最多只能上传10个文件，已添加${filesToAdd.length}个`,
    )
    hasMaxFilesWarning.value = true
  }
}

const emits = defineEmits(['ok', 'close'])
const uploadProgress = ref([]) // 用于存储每个文件的上传进度
// 上传文件到服务器
const uploadFiles = () => {
  if (fileList.value.length === 0) return
  const uploadPromises = fileList.value.map((file, index) => {
    const formData = new FormData()
    formData.append('demand', props.demand)
    formData.append('spaceId', props.spaceId)
    formData.append('directoryId', props.uploadParams.directoryId)
    formData.append('fileType', props.uploadParams.fileType)
    formData.append('files', file)
    uploadProgress.value.push({ fileName: file.name, progress: 0 })
    return panApi
      .uploadFile(formData, (progress) => {
        uploadProgress.value[index].progress = progress
      })
      .then((res) => {
        ElNotification({
          title: '成功',
          message: `${file.name} 上传成功`,
          type: 'success',
        })
      })
  })
  Promise.all(uploadPromises).then(() => {
    ElNotification({
      title: '全部上传完成',
      message: '所有文件上传完成',
      type: 'success',
    })
    handleClose()
  })
}

// 上传文件夹到服务器
const uploadFolders = () => {
  if (fileList.value.length === 0) return

  console.log('上传文件夹内容：', fileList.value)

  const formData = new FormData()

  fileList.value.forEach((file) => {
    // 获取文件的相对路径（webkitRelativePath），包含文件夹结构
    const relativePath = file.webkitRelativePath

    // 拼接相对路径和文件名，作为存储在服务器的对象名
    formData.append('files', file, relativePath)
  })

  const params = {
    bucketName: 'gjq', // 替换为实际的存储桶名称
    path: '/test',
  }

  // 调用上传文件夹的后端API
  fileApi
    .uploadFolder(params, formData)
    .then((res) => {
      if (res.success) {
        ElNotification({
          title: '成功',
          message: '文件夹上传成功！',
          type: 'success',
        })
        fileList.value = []
      } else {
        ElNotification({
          title: '失败',
          message: `文件夹上传失败：${res.message}`,
          type: 'error',
        })
      }
    })
    .catch((err) => {
      ElNotification({
        title: '错误',
        message: `文件夹上传出错：${err.message}`,
        type: 'error',
      })
    })
}

const removeFile = (index) => {
  fileList.value.splice(index, 1)
}

onMounted(async () => {
  await nextTick()
})

const handleClose = () => {
  fileList.value = []
  hasMaxFilesWarning.value = false // 关闭时重置警告状态
  dialogTableVisible.value = false
  emits('close')
}

defineExpose({
  handleEdit,
})
</script>
