<template>
  <div class="image-preview">
    <el-image
      style="width: 100%; height: 100%; object-fit: contain"
      :src="content.path"
      fit="contain"
      lazy
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  content: {
    type: Object,
    required: true,
  },
})
const imgUrl = ref(null)

// 通过模拟请求或直接设定文件路径
const loadPdf = () => {
  // 假设content.path为pdf文件的URL
  // iframeUrl.value = props.content.path;  // 在这里填入实际的路径或获取链接
  // imgUrl.value = 'http://www.shenben.club:9000/gjq/%E5%93%AA%E5%90%92.jpeg'
}

onMounted(() => {
  loadPdf() // 页面加载后设置文件路径
})
</script>

<style scoped>
.image-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px; /* 添加适当的内边距，避免图片靠近边缘 */
  box-sizing: border-box;
}
</style>
