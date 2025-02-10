<template>
  <el-dialog
    :model-value="visible"
    title="上传"
    @close="$emit('onClose')"
    destroy-on-close
  >
    <el-upload
      class="upload-demo"
      drag
      multiple
      :auto-upload="false"
      :on-change="handleChange"
    >
      <el-icon><UploadFilled /></el-icon>
      <!-- <el-icon class="el-icon--upload"><uploadFilled /></el-icon> -->
      <div class="el-upload__text">
        拖拽文件或者
        <em>点击上传文件</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          上传文件的大小最大不能超过{{ maxSize }}MB
        </div>
        <div class="el-upload__tip" v-if="demand">
          只能上传需求文档，非需求文档无法解析
        </div>
      </template>
    </el-upload>
    <template #footer>
      <el-button @click="hanldeClose">取 消</el-button>
      <el-button type="primary" @click="handleUpload">上 传</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'

const props =defineProps({
  visible: {
    type: Boolean,
    required: false,
  },
  demand: {
    type: Boolean,
    required: false,
  },
  maxSize: {
    type: String,
    required: '0',
  },
})

const targetFileList = ref([])

const handleChange = (file, fileList) => {
  let fileSize = file.size / 1024 / 1024
  console.log();
  
  if (fileSize > props.maxSize) {
    ElMessage.warning(`文件大小不能超过${props.maxSize}MB`)
    fileList.splice(fileList.findIndex((item) => item.uid === file.uid))
    targetFileList.value = fileList
  } else {
    targetFileList.value = fileList
  }
}

const emits = defineEmits(['ok', 'close'])
const handleUpload = () => {
  emits('ok', targetFileList.value)
}

const hanldeClose = () => {
  emits('close')
  targetFileList.value = []
}
</script>
