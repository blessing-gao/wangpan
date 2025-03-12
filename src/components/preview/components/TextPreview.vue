<template>
  <div class="text-preview">
    <div v-if="loading" class="text-loading">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <span>文本加载中...</span>
    </div>
    <div v-else-if="error" class="text-error">
      <p>{{ error }}</p>
      <el-button type="primary" @click="$emit('download')" :loading="downloading">
        下载文件
      </el-button>
    </div>
    <div v-else-if="!textContent" class="text-empty">
      <p>文档内容为空</p>
    </div>
    <div v-else class="text-content">
      <div class="text-toolbar">
        <div class="toolbar-left">
          <el-tooltip content="增大字号">
            <el-button :disabled="fontSize >= 20" circle @click="increaseFontSize">
              <el-icon><ZoomIn /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="减小字号">
            <el-button :disabled="fontSize <= 12" circle @click="decreaseFontSize">
              <el-icon><ZoomOut /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
        <div class="toolbar-right">
          <el-tooltip content="下载文件">
            <el-button circle @click="$emit('download')" :loading="downloading">
              <el-icon><Download /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <pre
          class="text-display"
          :style="{ fontSize: `${fontSize}px` }"
          ref="textDisplayRef"
      >{{ textContent }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Loading, ZoomIn, ZoomOut, Download } from '@element-plus/icons-vue';

const props = defineProps({
  filePath: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: null,
  }
});

const emit = defineEmits(['download']);

// State variables
const textContent = ref('');
const loading = ref(true);
const error = ref(null);
const downloading = ref(false);
const fontSize = ref(14);
const textDisplayRef = ref(null);

// Fetch text content if not provided
const fetchTextContent = async () => {
  // If content is already provided, use it
  if (props.content) {
    textContent.value = props.content;
    loading.value = false;
    return;
  }

  // Otherwise, fetch from file path
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(props.filePath);

    if (!response.ok) {
      throw new Error(`获取文本内容失败: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    textContent.value = text;
  } catch (err) {
    console.error('Error loading text file:', err);
    error.value = '无法加载文本文件，请下载后查看。';
  } finally {
    loading.value = false;
  }
};

// Font size controls
const increaseFontSize = () => {
  if (fontSize.value < 20) {
    fontSize.value += 1;
  }
};

const decreaseFontSize = () => {
  if (fontSize.value > 12) {
    fontSize.value -= 1;
  }
};

// Watch for changes in filePath or content
watch(() => props.filePath, () => {
  fetchTextContent();
});

watch(() => props.content, (newValue) => {
  if (newValue !== null) {
    textContent.value = newValue;
    loading.value = false;
  }
});

// Initial load
onMounted(() => {
  fetchTextContent();
});
</script>

<style scoped>
.text-preview {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.text-loading,
.text-error,
.text-empty {
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

.text-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.text-toolbar {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f5f5f5;
}

.toolbar-left, .toolbar-right {
  display: flex;
  gap: 8px;
}

.text-display {
  flex: 1;
  overflow: auto;
  padding: 16px;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', Courier, monospace;
  line-height: 1.5;
  color: #333;
  border: none;
  background-color: #fff;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Scrollbar styles */
.text-display::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.text-display::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.text-display::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.text-display::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
