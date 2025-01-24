<template>
  <div>
    <el-dialog
      v-model="dialogTableVisible"
      width="41.7%"
      :modal="false"
      :show-close="false"
      @close="handleClose"
    >
      <!-- 文件拖拽区域 -->
      <div
        class="file-box"
        @dragenter.prevent="handleDragEnter"
        @dragover.prevent="handleDragOver"
        @drop="handleDrop"
        @click="triggerFileInput"
      >
        <div>
          <img style="width: 83px" src="/assets/upload.png" />
          <p>拖拽文件或文件夹到这里</p>
        </div>
        <!-- 隐藏的文件输入框 -->
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          multiple
          @change="handleFileInputChange"
        />
      </div>

      <!-- 文件列表展示 -->
      <div v-if="fileList.length" class="file-style">
        <h3>已选择的文件:</h3>
        <ul>
          <li
            v-for="(file, index) in fileList"
            :key="index"
            class="file-style-content"
          >
            {{ file.name }}
            <el-button @click="removeFile(index)" style="margin-left: 10px">
              <el-icon><Close /></el-icon>
            </el-button>
          </li>
        </ul>
      </div>
      <template #footer>
        <el-button
          style="background: #de3a05; border-radius: 4px; color: #fff"
          @click="uploadFiles"
        >
          批量上传
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { Close } from '@element-plus/icons-vue'
import * as panApi from '@/api/pan.js'

const dialogTableVisible = ref(false)
const fileList = ref([]) // 用于存储上传的文件列表

const handleEdit = () => {
  dialogTableVisible.value = true
}

// 处理拖拽进入事件
const handleDragEnter = (e) => {
  e.preventDefault()
}

// 处理拖拽悬停事件
const handleDragOver = (e) => {
  e.preventDefault()
}

// 处理文件放下（drop）事件
const handleDrop = (e) => {
  e.preventDefault()

  const items = Array.from(e.dataTransfer.items)
  const files = []

  items.forEach((item) => {
    if (item.kind === 'file') {
      const entry = item.webkitGetAsEntry()
      if (entry.isDirectory) {
        // 如果是文件夹，递归处理文件夹内容
        traverseDirectory(entry)
      } else {
        const file = item.getAsFile()
        if (file) {
          files.push(file)
        }
      }
    } else if (item.kind === 'string' && item.webkitGetAsEntry) {
      const entry = item.webkitGetAsEntry()
      if (entry.isDirectory) {
        // 如果是文件夹，递归处理文件夹内容
        traverseDirectory(entry)
      }
    }
  })

  // 处理文件
  handleFiles(files)
}

// 处理文件选择框的变更事件
const handleFileInputChange = (event) => {
  const files = Array.from(event.target.files)
  handleFiles(files)
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
    console.log(dirReader)

    entries.forEach((entry) => {
      if (entry.isDirectory) {
        // 如果是子文件夹，递归调用
        traverseDirectory(entry)
      } else {
        // 如果是文件，添加到文件列表
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
    // 你可以在这里做一些文件验证，如文件大小、类型等
    fileList.value.push(file)
  })
}

// 上传文件到服务器
const uploadFiles = () => {
  if (fileList.value.length === 0) return // 如果没有文件，不进行上传

  const formData = new FormData()
  formData.append('files', fileList.value)
  //   fileList.value.forEach((file) => {
  //     formData.append('file[]', file)
  //   })

  let params = {}
  panApi
    .uploadFile(params, formData)
    .then((res) => {})
    .catch((err) => {})
}

const removeFile = (index) => {
  fileList.value.splice(index, 1)
}

onMounted(async () => {
  await nextTick()
})

const handleClose = () => {
  fileList.value = []
  dialogTableVisible.value = false
}

defineExpose({
  handleEdit,
})
</script>

<style lang="scss" scoped>
.file-box {
  width: 100%;
  height: 288px;
  border: 1px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 16px;
  color: #888;
  cursor: pointer;
  background: linear-gradient(to bottom, #ffeff0 0%, #ffffff 100%);
}

.file-box p {
  margin: 0;
  padding: 0;
}

ul {
  padding: 0;
  list-style-type: none;
}

ul li {
  margin-bottom: 5px;
}

.file-style {
  max-height: 200px;
  overflow: auto;
}
.file-style-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

:deep(.file-style-content .el-button) {
  padding: 0;
  border: none;
  background-color: #ffffff !important;
}
</style>
