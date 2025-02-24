<template>
  <div class="file-detail">
    <div class="file-detail-header">
      <el-page-header style="width: 100%" @back="handleBack">
        <template #content>
          <span class="text-large font-600 mr-3">
            <div class="file-detail-header-left">
              <img
                v-if="file_name"
                style="width: 22px; margin-right: 12px"
                :src="fileTypeIcon(file_name)"
              />
              <div class="file-detail-header-title">{{ file_name }}</div>
              <!-- <img style="width: 15px" src="/icons/常用文件.svg" alt="" /> -->
            </div>
          </span>
        </template>
        <template #extra>
          <div>
            <el-button plain @click="handleShare">分享</el-button>
            <el-button plain v-if="isEdit" @click="handleEdit">编辑</el-button>
            <el-button plain :loading="downloading" @click="downloadFiles">
              下载
            </el-button>
            <el-button plain v-if="isEdit">上传新版本</el-button>
          </div>
        </template>
      </el-page-header>
    </div>
    <div class="file-detail-content">
      <!-- 根据文件类型选择预览组件 -->
      <div class="file-detail-content-left">
        <div
          v-if="file_type === 'video'"
          style="
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
          "
        >
          <div v-if="file_path == ''" class="loading">
            <p>视频加载中...</p>
          </div>
          <previewVideo
            v-else
            :previewBoolean="true"
            :content="{ path: file_path }"
          />
        </div>
        <div v-else-if="file_type === 'pdf'" style="width: 100%; height: 100%">
          <div v-if="file_path == ''" class="loading">
            <p>加载中...</p>
          </div>
          <previewPDF v-else :content="{ path: file_path }" />
        </div>
        <div
          v-else-if="file_type === 'image'"
          style="width: 100%; height: 100%"
        >
          <previewImage :content="{ path: file_path }" />
        </div>
        <div
          v-else-if="file_type === 'audio'"
          style="
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div v-if="file_path == ''" class="loading">
            <p>音频加载中...</p>
          </div>
          <audioPreview v-else :audioSrc="file_path" />
        </div>
        <div
          v-else-if="file_type === 'excel'"
          style="
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <ExcelPreview :file_path="file_path" />
        </div>
        <div
          v-else-if="file_type === 'word'"
          style="
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div v-if="file_path == ''" class="loading">
            <p>文档加载中...</p>
          </div>
          <vue-office-docx
            v-else
            :src="file_path"
            style="width: 100%; height: 100%"
          />
        </div>
        <div v-else-if="file_type == ''" class="error-content">
          <p>
            无法预览此文件类型，请点击
            <el-button type="warning" link @click="downloadFiles">
              下载
            </el-button>
            查看
          </p>
        </div>
      </div>
      <div class="file-detail-content-right">
        <el-tabs
          v-model="activeName"
          class="demo-tabs tabs-content"
          @tab-click="handleClick"
        >
          <el-tab-pane label="详情" name="first">
            <documentDetail ref="documentDetailRefs" :documentId="id" />
          </el-tab-pane>
          <el-tab-pane label="标签" name="second">
            <fileTags />
          </el-tab-pane>
          <el-tab-pane label="总结" name="third">
            <div class="summarize">
              <el-button plain @click="handleClickSummarize">
                <img src="/assets/编组 4.png" alt="" />
              </el-button>
            </div>
            <summarize ref="summarizeRefs" />
          </el-tab-pane>
          <el-tab-pane label="评论" name="fourth">评论</el-tab-pane>
          <el-tab-pane label="动态" name="five">动态</el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <shareDialog ref="shareDialogRefs" :id="id" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fileTypeIcon, collaboraOnlineExts, compressedExts } from '@/enum'
import * as panApi from '@/api/pan.js'
import previewVideo from '../../components/VideoPreview.vue'
import previewImage from '../../components/ImagePreview.vue'
import previewPDF from '../../components/PdfPreview.vue'
import fileTags from '../../components/fileTags.vue'
import summarize from '../../components/summarize.vue'
import audioPreview from '../../components/customizeAudio.vue'
import documentDetail from '../../components/documentDetail.vue'
import shareDialog from '../../components/shareDialog.vue'
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'
import ExcelPreview from '../../components/ExcelPreview.vue'
import '@/styles/components/fileDetail.css' // 引入普通的 CSS 文件

const router = useRouter()

const file_name = ref('') // 用来存储文件名称
const file_type = ref(null) // 用来存储文件类型 (video, ppt, etc.)
const file_path = ref('') // 用来存储文件路径
const activeName = ref('first')
const summarizeRefs = ref(null)
const isEdit = ref(false)

// 获取URL中的id参数
const urlParams = new URLSearchParams(window.location.search)

const id = urlParams.get('id') // 获取id参数
// 根据id请求文件信息
const fetchFileInfo = async () => {
  if (id) {
    try {
      await panApi.providerOptions(id).then(async (res) => {
        file_name.value = res.data.name || '未知文件'
        const exts = collaboraOnlineExts.map((item) => item.ext)
        const fileExt = file_name.value.split('.').pop().toLowerCase()
        if (exts.includes(fileExt)) {
          const isExt = collaboraOnlineExts.filter((item) => {
            return item.ext === file_name.value.split('.').pop().toLowerCase()
          })
          isEdit.value = isExt[0].action == 'edit'
        }
        file_type.value = determineFileType(res.data.name)
        if (file_type.value == 'video' || file_type.value == 'audio') {
          const videoBlob = await panApi.downloadFile(id)
          file_path.value = URL.createObjectURL(videoBlob.data)

          console.log(file_path.value)
        } else {
          file_path.value = `/browser/0b27e85/cool.html?lang=zh-CN&WOPISrc=${res.data.url}`
        }
      })
    } catch (error) {
      console.error('获取文件信息失败:', error)
    }
  } else {
    console.error('URL中没有找到id参数')
  }
}

// 根据contentType判断文件类型
const determineFileType = (contentType) => {
  if (contentType.includes('mp4')) {
    return 'video'
  } else if (
    contentType.includes('ppt') ||
    contentType.includes('pdf') ||
    contentType.includes('txt')
  ) {
    return 'pdf'
  } else if (contentType.includes('png') || contentType.includes('jpg')) {
    return 'image'
  } else if (contentType.includes('mp3')) {
    return 'audio'
  } else if (
    contentType.includes('xlsx') ||
    contentType.includes('xls') ||
    contentType.includes('csv')
  ) {
    return 'excel'
  } else if (contentType.includes('docx') || contentType.includes('doc')) {
    return 'word'
  } else {
    return '' // 如果是其他类型文件，返回空字符串
  }
}

// 页面加载时获取文件信息
onMounted(() => {
  fetchFileInfo()
  documentDetailRefs.value.getFileDetail()
})

const documentDetailRefs = ref(null)

const handleClick = (value) => {
  if (value.props.label == '详情') {
    // documentDetailRefs.value.getFileDetail()
  } else if (value.props.label == '评论') {
    const params = {
      documentId: id,
    }
    panApi.commentOptions(params).then((res) => {
      console.log(res)
    })
  }
}

const handleBack = () => {
  router.back()
}

const handleClickSummarize = () => {
  summarizeRefs.value.handleEdit()
}

const downloading = ref(false)

const downloadFiles = () => {
  downloading.value = true
  panApi
    .downloadFile(id)
    .then((res) => {
      let blob = new Blob([res.data])
      let _fileNames = res.headers['content-disposition']
        .split(';')[1]
        .split('=')[1]
        .trim()
        .replace(/"/g, '')
        .split('.')
      _fileNames[0] = decodeURI(_fileNames[0])
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = _fileNames.join('.')
      link.click()
      window.URL.revokeObjectURL(link.href)
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      downloading.value = false
    })
}

const shareDialogRefs = ref(null)

const handleShare = () => {
  shareDialogRefs.value.handleEdit()
}

const handleEdit = () => {
  // 编辑
}
</script>
<style lang="scss" scoped>
.error-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
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
.loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #de3a05;
  background-color: rgba(255, 255, 255, 0.7);
  position: absolute;
}
</style>
