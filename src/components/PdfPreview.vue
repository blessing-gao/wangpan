<template>
  <div class="pdf-preview">
    <iframe
        :src="iframeUrl"
        frameborder="0"
        width="100%"
        height="100%"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// 通过 props 获取内容路径
const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
});

const iframeUrl = ref(null);

// 通过模拟请求或直接设定文件路径
const loadPdf = () => {
  // 假设content.path为pdf文件的URL
  iframeUrl.value = props.content.path;  // 在这里填入实际的路径或获取链接
};

onMounted(() => {
  loadPdf(); // 页面加载后设置文件路径
});
</script>

<style scoped>
.pdf-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
