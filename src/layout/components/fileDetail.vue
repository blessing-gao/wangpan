<template>
  <div class="file-detail">
    <div class="file-detail-header">
      <el-page-header style="width: 100%" @back="handleBack">
        <template #content>
          <span class="text-large font-600 mr-3">
            <div class="file-detail-header-left">
              <img
                style="width: 22px; margin-right: 12px"
                src="/icons/编组 3.svg"
              />
              <div class="file-detail-header-title">{{ file_name }}</div>
              <img style="width: 15px" src="/icons/常用文件.svg" alt="" />
            </div>
          </span>
        </template>
        <template #extra>
          <div>
            <el-button plain @click="handleShare">分享</el-button>
            <el-button plain>编辑</el-button>
            <el-button plain :loading="downloading" @click="downloadFiles">
              下载
            </el-button>
            <el-button plain>上传新版本</el-button>
          </div>
        </template>
      </el-page-header>
    </div>
    <div class="file-detail-content">
      <!-- 根据文件类型选择预览组件 -->
      <div
        v-if="file_type === 'video'"
        style="
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
        "
      >
        <previewVideo :previewBoolean="true" :content="{ path: file_path }" />
      </div>
      <div v-else-if="file_type === 'pdf'" style="width: 100%; height: 100%">
        <previewPDF :content="{ path: file_path }" />
      </div>
      <div v-else-if="file_type === 'image'" style="width: 100%; height: 100%">
        <previewImage :content="{ path: file_path }" />
      </div>
      <div
        v-else-if="file_type === 'audio'"
        style="
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
        "
      >
        <audioPreview :audioSrc="file_path" />
      </div>
      <div v-else class="error-content">
        <p>
          无法预览此文件类型，请点击
          <el-button type="warning" link @click="downloadFiles">下载</el-button>
          查看
        </p>
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
import * as panApi from '@/api/pan.js'
import previewVideo from '../../components/VideoPreview.vue'
import previewImage from '../../components/ImagePreview.vue'
import previewPDF from '../../components/PdfPreview.vue'
import fileTags from '../../components/fileTags.vue'
import summarize from '../../components/summarize.vue'
import audioPreview from '../../components/customizeAudio.vue'
import documentDetail from '../../components/documentDetail.vue'
import shareDialog from '../../components/shareDialog.vue'
import '@/styles/components/fileDetail.css' // 引入普通的 CSS 文件

const router = useRouter()

const file_name = ref('') // 用来存储文件名称
const file_type = ref('') // 用来存储文件类型 (video, ppt, etc.)
const file_path = ref('') // 用来存储文件路径
const activeName = ref('first')
const summarizeRefs = ref(null)

// 获取URL中的id参数
const urlParams = new URLSearchParams(window.location.search)

const id = urlParams.get('id') // 获取id参数
// 根据id请求文件信息
const fetchFileInfo = async () => {
  if (id) {
    try {
      panApi.providerOptions(id).then((res) => {
        console.log(res)
        file_name.value = res.data.name || '未知文件'
        file_path.value = `/browser/0b27e85/cool.html?lang=zh-CN&WOPISrc=${res.data.url}`
        file_type.value = determineFileType(res.data.name)
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
  } else if (contentType.includes('ppt')) {
    return 'pdf'
  } else if (contentType.includes('png') || contentType.includes('jpg')) {
    return 'image'
  } else if (contentType.includes('mp3')) {
    return 'audio'
  } else {
    return '' // 如果是其他类型文件，返回空字符串
  }
}

// 页面加载时获取文件信息
onMounted(() => {
  fetchFileInfo()
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
</script>
<style lang="scss" scoped>
.error-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
