<template>
  <div class="pdf-preview-container">
    <!-- Loading State -->
    <div v-if="loading" class="pdf-loading">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <span>PDF加载中...</span>
    </div>

    <!-- PDF Viewer using PDF.js web viewer -->
    <div v-else class="pdf-viewer">
      <iframe
          ref="pdfViewer"
          :src="viewerUrl"
          class="pdf-iframe"
          frameborder="0"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Loading } from '@element-plus/icons-vue';

const props = defineProps({
  filePath: {
    type: String,
    required: true,
  }
});

const emit = defineEmits(['download']);

// State variables
const loading = ref(true);
const error = ref(null);
const pdfViewer = ref(null);
const viewerUrl = ref('');

// Configure PDF viewer URL
const configurePdfViewer = () => {
  loading.value = true;
  error.value = null;

  try {
    // Path to PDF.js web viewer
    const pdfJsViewerPath = '/pdfjs/web/viewer.html';

    // Use URL encoding to pass the PDF file path as a parameter
    const encodedPdfUrl = encodeURIComponent(props.filePath);

    // Construct the viewer URL with the file parameter
    viewerUrl.value = `${pdfJsViewerPath}?file=${encodedPdfUrl}`;

    loading.value = false;
  } catch (err) {
    console.error('配置PDF查看器失败:', err);
    error.value = '无法配置PDF查看器，请下载后查看。';
    loading.value = false;
  }
};

// Watch for changes in filePath
watch(() => props.filePath, () => {
  configurePdfViewer();
});

// Initialize
onMounted(() => {
  configurePdfViewer();
});
</script>

<style scoped>
.pdf-preview-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.pdf-loading,
.pdf-error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 24px;
  text-align: center;
  color: #666;
}

.loading-icon {
  font-size: 24px;
  margin-bottom: 16px;
  animation: rotate 1.5s linear infinite;
}

.pdf-viewer {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
