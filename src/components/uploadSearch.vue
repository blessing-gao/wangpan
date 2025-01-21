<template>
  <div>
    <el-dialog
      v-model="dialogTableVisible"
      width="41.7%"
      :modal="false"
      :show-close="false"
    >
      <el-upload
        class="upload-demo"
        drag
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        multiple
      >
        <img style="width: 83px" src="/assets/upload.png" />
        <div class="el-upload__text">
          <div class="text1">将图片拖至此处，快速匹配相似图片</div>
          <div class="text2">*当前仅支持jpg/jpeg/png格式，大小不超过5M</div>
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dialogTableVisible = ref(false)

const handleEdit = () => {
  dialogTableVisible.value = true
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
  background: linear-gradient(to bottom, #FFEFF0 0%, #FFFFFF 100%);
}
</style>
