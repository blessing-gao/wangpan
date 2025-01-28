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
            <el-button plain>分享</el-button>
            <el-button plain>编辑</el-button>
            <el-button plain>下载</el-button>
            <el-button plain>上传新版本</el-button>
          </div>
        </template>
      </el-page-header>
    </div>
    <div class="file-detail-content">
      <!-- 根据文件类型选择预览组件 -->
      <div v-if="file_type === 'video'">
        <previewVideo :previewBoolean="true" :content="{ path: file_path }" />
      </div>
      <div v-else-if="file_type === 'pdf'">
        <previewPDF :content="{ path: file_path }" />
      </div>
      <div v-else-if="file_type === 'image'">
        <previewImage :content="{ path: file_path }" />
      </div>
      <div v-else>
        <p>无法预览此文件类型</p>
      </div>
      <div class="file-detail-content-right">
        <el-tabs
            v-model="activeName"
            class="demo-tabs tabs-content"
            @tab-click="handleClick"
        >
          <el-tab-pane label="标签" name="first">
            <fileTags />
          </el-tab-pane>
          <el-tab-pane label="总结" name="second">
            <div class="summarize">
              <el-button plain @click="handleClickSummarize">
                <img src="/assets/编组 4.png" alt="" />
              </el-button>
            </div>
            <summarize ref="summarizeRefs" />
          </el-tab-pane>
          <el-tab-pane label="评论" name="third">评论</el-tab-pane>
          <el-tab-pane label="动态" name="fourth">动态</el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getFileInfo } from '../../api/file.js'  // 引入获取文件信息的API
import previewVideo from '../../components/VideoPreview.vue'
import previewImage from '../../components/ImagePreview.vue'
import previewPDF from '../../components/PdfPreview.vue'
import fileTags from '../../components/fileTags.vue'
import summarize from '../../components/summarize.vue'
import '@/styles/components/fileDetail.css';  // 引入普通的 CSS 文件

const router = useRouter()

const file_name = ref('')  // 用来存储文件名称
const file_type = ref('')  // 用来存储文件类型 (video, ppt, etc.)
const file_path = ref('')  // 用来存储文件路径
const activeName = ref('first')
const summarizeRefs = ref(null)

// 获取URL中的id参数
const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get('id')  // 获取id参数

// 根据id请求文件信息
const fetchFileInfo = async () => {
  if (id) {
    const params = {
      bucketName: 'gjq',  // 替换为实际的存储桶名称
      objectName: id,      // 使用id作为objectName
    }

    try {
      const data = await getFileInfo(params)  // 调用API获取文件信息
      file_name.value = data.objectName || '未知文件'  // 假设返回的数据包含name字段
      file_path.value = '/preview/'+params.bucketName +"/"+data.objectName || ''  // 设定文件路径
      file_type.value = determineFileType(data.contentType)  // 根据contentType确定文件类型
    } catch (error) {
      console.error('获取文件信息失败:', error)
    }
  } else {
    console.error('URL中没有找到id参数')
  }
}

// 根据contentType判断文件类型
const determineFileType = (contentType) => {
  if (contentType.includes('video')) {
    return 'video';
  } else if (contentType.includes('pdf')) {
    return 'pdf';
  }else if (contentType.includes('image')) {
    return 'image';
  } else {
    return '';  // 如果是其他类型文件，返回空字符串
  }
}

// 页面加载时获取文件信息
onMounted(() => {
  fetchFileInfo()
})

const handleClick = (value) => {
  console.log(value.props.label)
}

const handleBack = () => {
  router.back()
}

const handleClickSummarize = () => {
  summarizeRefs.value.handleEdit()
}
</script>
