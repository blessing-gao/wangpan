<template>
  <div>
    <el-dialog
      v-model="dialogTableVisible"
      width="41.7%"
      :modal="false"
      :show-close="false"
    >
      <!--  action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" -->
      <el-upload
        class="upload-demo"
        drag
        :multiple="multiple"
        :auto-upload="autoUpload"
        :on-change="handleFileChange"
        :directory="true"
        :before-upload="beforeUpload"
        :file-list="fileList"
        :http-request="customUploadMethod"
      >
        <img style="width: 83px" src="/assets/upload.png" />
        <div class="el-upload__text">
          <div class="text1">{{ uploadText }}</div>
          <div class="text2">{{ uploadLimitation }}</div>
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import * as searchApi from '@/api/search.js'

const dialogTableVisible = ref(false)
// 是否多选
const multiple = ref(false)
// 是否直接上传
const autoUpload = ref(false)
// 判断是否是搜索
const parrent = ref(false)
const uploadText = ref('将图片拖至此处，快速匹配相似图片')
const uploadLimitation = ref('*当前仅支持jpg/jpeg/png格式，大小不超过5M')

const fileList = ref([])

const handleEdit = (record) => {
  dialogTableVisible.value = true
  multiple.value = record.multiple
  autoUpload.value = record.autoUpload
  parrent.value = record.type
}

const handleFileChange = (file, fileList) => {
  console.log(file, fileList)
}

const beforeUpload = (file) => {
  console.log(file)
  return true
}

const customUploadMethod = (options) => {
  const { file, onSuccess, onError } = options
  // 创建一个 FormData 对象
  const formData = new FormData()
  formData.append('file', file)
  if (parrent.value == 'search') {
    let params = {}
    searchApi
      .uploadSearch(params, formData)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
defineExpose({
  handleEdit,
})
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  position: absolute; /* 使其相对于页面定位 */
  top: -8%; /* 距离页面顶部 7% */
  left: 50%; /* 水平居中 */
  transform: translateX(-50%); /* 使其精确居中 */
}

.text1 {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
  text-align: center;
  line-height: 28px;
  font-weight: 500;
}
.text2 {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
  letter-spacing: 0;
  text-align: center;
  line-height: 28px;
  font-weight: 400;
}

:deep(.el-upload) {
  display: flex !important;
}

:deep(.el-upload-dragger) {
  width: 98%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 288px;
  background: linear-gradient(to bottom, #ffeff0 0%, #ffffff 100%);
}
</style>
