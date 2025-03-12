<template>
  <div class="presentation-preview">
    <div v-if="canPreview && pptxComponentAvailable" class="preview-container">
      <component :is="presentationComponent" v-bind="componentProps"></component>
    </div>
    <div v-else class="fallback-message">
      <p>{{ previewErrorMessage }}</p>
      <el-button type="primary" @click="emitDownload" :loading="downloading">
        下载文件
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Check if VueOfficePptx component is available
const pptxComponentAvailable = ref(false);
let VueOfficePptx = null;

// Try to import the component dynamically
onMounted(async () => {
  try {
    // Attempt to dynamically import the component
    const module = await import('@vue-office/pptx');
    VueOfficePptx = module.default;
    pptxComponentAvailable.value = true;
  } catch (error) {
    console.error('无法加载PPTX预览组件:', error);
    pptxComponentAvailable.value = false;
  }
});

const props = defineProps({
  filePath: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
    validator: (value) => ['ppt', 'pptx'].includes(value)
  },
});

const emit = defineEmits(['download']);

const downloading = ref(false);

// 确定当前文件是否可以预览
const canPreview = computed(() => {
  // 目前只支持pptx的直接预览
  return props.fileType === 'pptx';
});

// 预览错误消息
const previewErrorMessage = computed(() => {
  if (!canPreview.value) {
    return '使用内置浏览器无法预览此类型的PPT文件。';
  }

  if (!pptxComponentAvailable.value) {
    return 'PPTX预览组件未正确加载，请下载后查看。';
  }

  return '无法预览此文件，请下载后查看。';
});

// 根据文件类型决定使用哪个预览组件
const presentationComponent = computed(() => {
  if (props.fileType === 'pptx' && pptxComponentAvailable.value) {
    return VueOfficePptx;
  }

  // 默认返回iframe (但通过canPreview控制显示)
  return 'iframe';
});

// 根据组件类型准备适当的props
const componentProps = computed(() => {
  if (props.fileType === 'pptx' && pptxComponentAvailable.value) {
    return {
      src: props.filePath,
      style: 'height: 100%; width: 100%; border: none; box-shadow: none'
    };
  } else {
    return {
      src: props.filePath,
      frameborder: "0",
      width: "100%",
      height: "100%",
      sandbox: "allow-scripts allow-same-origin allow-forms",
      referrerpolicy: "no-referrer"
    };
  }
});

// 触发下载事件
const emitDownload = () => {
  downloading.value = true;
  emit('download');
  // 模拟下载延迟，实际应该由外部组件控制loading状态
  setTimeout(() => {
    downloading.value = false;
  }, 1000);
};
</script>

<style scoped>
.presentation-preview {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-container {
  width: 100%;
  height: 100%;
}

.fallback-message {
  text-align: center;
  padding: 24px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  max-width: 80%;
}

.fallback-message p {
  margin-bottom: 16px;
  font-size: 16px;
  color: #666;
}
</style>
