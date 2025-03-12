import { Loading, Download, ZoomIn, ZoomOut } from '@element-plus/icons-vue'<template>
  <div class="file-detail">
    <div class="file-detail-header">
      <el-page-header style="width: 100%" @back="handleBack">
        <template #content>
          <span class="text-large font-600 mr-3">
            <div class="file-detail-header-left">
              <img
                  v-if="fileData.name"
                  style="width: 22px; margin-right: 12px"
                  :src="fileTypeIcon(fileData.name)"
              />
              <div class="file-detail-header-title">{{ fileData.name }}</div>
            </div>
          </span>
        </template>
        <template #extra>
          <div>
            <el-button plain v-if="props.states != 'share'" @click="handleShare">
              分享
            </el-button>
            <el-button plain :loading="status.downloading" @click="downloadFile">
              下载
            </el-button>
            <el-button
                plain
                v-if="isEdit && fileData.type == 'wps' && props.states == 'preview'"
            >
              上传新版本
            </el-button>
          </div>
        </template>
      </el-page-header>
    </div>
    <div class="file-detail-content">
      <!-- 文件预览区域 -->
      <div class="file-detail-content-left">
        <!-- 加载状态 -->
        <div v-if="status.loading" class="loading">
          <p>{{ loadingMessage }}</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="status.error" class="error-content">
          <div class="error-message">
            <p>{{ status.error }}</p>
            <el-button type="primary" @click="downloadFile" :loading="status.downloading">
              下载文件
            </el-button>
          </div>
        </div>

        <!-- 视频预览 -->
        <div v-else-if="fileData.type === 'video'" class="preview-container">
          <previewVideo :content="{ path: fileData.path }" :previewBoolean="true" />
        </div>

        <!-- PDF预览 -->
        <div v-else-if="fileData.type === 'pdf'" class="preview-container">
          <PdfPreview :filePath="fileData.path" @download="downloadFile" />
        </div>

        <!-- 图片预览 -->
        <div v-else-if="fileData.type === 'image'" class="preview-container">
          <previewImage :content="{ path: fileData.path }" />
        </div>

        <!-- 文本预览 -->
        <div v-else-if="fileData.type === 'pre'" class="preview-container">
          <TextPreview
              :filePath="fileData.path"
              :content="fileData.content"
              @download="downloadFile"
          />
        </div>

        <!-- 音频预览 -->
        <div v-else-if="fileData.type === 'audio'" class="preview-container centered">
          <audioPreview :audioSrc="fileData.path" />
        </div>

        <!-- Excel预览 -->
        <div v-else-if="fileData.type === 'excel'" class="preview-container centered">
          <ExcelPreview :file_path="fileData.path" />
        </div>

        <!-- Word预览 -->
        <div v-else-if="fileData.type === 'word'" class="preview-container centered">
          <VueOfficeDocx
              :src="fileData.path"
              style="height: 100vh; border: none; box-shadow: none"
          />
        </div>

        <!-- 演示文稿预览 (PPT 和 PPTX) -->
        <div v-else-if="['ppt', 'pptx'].includes(fileData.type)" class="preview-container centered">
          <PresentationPreview
              :filePath="fileData.path"
              :fileType="fileData.type"
              @download="downloadFile"
          />
        </div>

        <!-- Collabora Office预览 (WPS等文档) -->
        <div v-else-if="useCollaboraPreview" class="preview-container centered">
          <CollaboraPreview :content="{ path: fileData.path }" />
        </div>

        <!-- 不支持的文件类型 -->
        <div v-else class="error-content">
          <div class="error-message">
            <p>无法预览此文件类型，请下载后查看。</p>
            <el-button type="primary" @click="downloadFile" :loading="status.downloading">
              下载文件
            </el-button>
          </div>
        </div>
      </div>

      <!-- 右侧信息面板 -->
      <div class="file-detail-content-right">
        <el-tabs
            v-model="activeName"
            class="demo-tabs tabs-content"
            @tab-click="handleClick"
        >
          <el-tab-pane label="详情" name="first">
            <documentDetail ref="documentDetailRefs" :documentId="fileData.id" />
          </el-tab-pane>
          <!-- 其他标签页可根据需要添加 -->
        </el-tabs>
      </div>
    </div>

    <!-- 分享对话框 -->
    <shareDialog ref="shareDialogRefs" :id="fileData.id" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { fileTypeIcon } from '@/enum'
import { useFilePreview } from '@/utils/FilePreviewManager' // 引入文件预览管理器

// 导入预览组件
import previewVideo from './components/VideoPreview.vue'
import previewImage from './components/ImagePreview.vue'
import CollaboraPreview from './components/CollaboraPreview.vue' // 重命名后的组件
import audioPreview from './components/customizeAudio.vue'
import documentDetail from './components/documentDetail.vue'
import shareDialog from '../../components/shareDialog.vue'
import PresentationPreview from './components/PresentationPreview.vue' // 统一的PPT预览组件
import ExcelPreview from './components/ExcelPreview.vue'
import PdfPreview from './components/PdfPreview.vue' // 增强版PDF预览组件
import TextPreview from './components/TextPreview.vue' // 文本预览组件

// 导入第三方组件
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'
import '@/styles/components/fileDetail.css'

// Try to load optional components
let VueOfficePdf;
try {
  VueOfficePdf = require('@vue-office/pdf').default;
} catch (e) {
  console.warn('VueOfficePdf component could not be loaded');
}

const props = defineProps({
  states: {
    type: String,
    required: true,
  },
})

const router = useRouter()

// 使用文件预览管理器
const {
  fileData,
  status,
  loadingMessage,
  useCollaboraPreview, // 新增计算属性
  loadFileInfo,
  loadSharedFileInfo,
  downloadFile
} = useFilePreview()

// 其他状态变量
const isEdit = ref(false)
const activeName = ref('first')

// 引用元素
const documentDetailRefs = ref(null)
const shareDialogRefs = ref(null)

/**
 * 初始化文件预览
 */
const initializeFilePreview = async () => {
  if (props.states === 'preview') {
    // 预览模式 - 通过URL参数获取文件ID
    const urlParams = new URLSearchParams(window.location.search)
    const fileId = urlParams.get('id')

    if (fileId) {
      await loadFileInfo(fileId)
      nextTick(() => {
        documentDetailRefs.value?.getFileDetail()
      })
    }
  } else {
    // 分享模式 - 通过URL路径获取分享ID
    const path = window.location.href.split('/')
    const shareId = path[path.length - 1]

    await loadSharedFileInfo(shareId)
    nextTick(() => {
      documentDetailRefs.value?.getFileDetail()
    })
  }
}

// 事件处理函数
const handleClick = (tab) => {
  if (tab.props.label === '详情') {
    documentDetailRefs.value?.getFileDetail()
  }
}

const handleBack = () => {
  router.back()
}

const handleShare = () => {
  shareDialogRefs.value?.handleEdit()
}

// 页面初始化
onMounted(() => {
  initializeFilePreview()
})
</script>

<style lang="scss" scoped>
.file-detail {
  &-header {
    &-left {
      display: flex;
      align-items: center;
    }
    &-title {
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &-content {
    display: flex;
    height: calc(100vh - 60px);

    &-left {
      flex: 3;
      position: relative;
      overflow: hidden;
    }

    &-right {
      flex: 1;
      padding: 16px;
      border-left: 1px solid #eee;
      overflow-y: auto;
    }
  }
}

.preview-container {
  width: 100%;
  height: 100%;

  &.centered {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.loading, .error-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #de3a05;
  background-color: rgba(255, 255, 255, 0.7);
}

.error-message {
  text-align: center;
  padding: 24px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  max-width: 80%;
}

.error-message p {
  margin-bottom: 16px;
  font-size: 16px;
  color: #666;
}

// Element Plus 样式覆盖
:deep(.el-button:hover) {
  color: #de3a05;
  border-color: #de3a05;
}

:deep(.el-tabs__item.is-active) {
  color: #de3a05 !important;
}

:deep(.el-tabs__item:hover) {
  color: #de3a05 !important;
}

:deep(.el-tabs__active-bar) {
  background-color: #de3a05 !important;
}

:deep(.vue-office-pdf-wrapper) {
  padding-top: 0 !important;
  background-color: transparent !important;
}
</style>
