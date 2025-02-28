<template>
  <div class="workbenches_style">
    <div class="first_box" style="margin-right: 4.2%">
      <div>
        <div class="title1">文件分类</div>
        <div class="">
          <el-row :gutter="12" v-if="classifyList.length == 0">
            <el-col :span="6" v-for="(item, index) in 4" :key="index">
              <el-card shadow="never" style="cursor: pointer"></el-card>
            </el-col>
          </el-row>
          <el-row :gutter="12" v-if="classifyList.length != 0">
            <el-col
              :span="6"
              v-for="(item, index) in classifyList"
              :key="index"
              style="margin-bottom: 20px"
            >
              <el-card
                shadow="never"
                style="cursor: pointer"
                @click="jumpFilePath(item)"
              >
                <div class="card-content">
                  <img :src="typeIcon(item.name)" class="card-icon" />
                  <span :class="['card-title', getnameColor(item.name)]">
                    {{ item.name }}
                  </span>
                </div>
                <div class="card-footer">
                  <span class="card-quantity">{{ item.quantity }}</span>
                  <span class="card-size">{{ item.size }}</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
      <div style="width: 100%">
        <div class="title1 history-title">最近查看</div>
        <div>
          <div v-if="historyList.length == 0">
            <div
              v-for="(item, index) in 4"
              :key="index"
              class="history-content"
            >
              <div class="history-img"></div>
            </div>
          </div>
          <div v-if="historyList.length != 0">
            <div
              v-for="(item, index) in historyList"
              :key="index"
              class="history-content"
              @click="handleClick(item)"
            >
              <div class="history-img">
                <img v-if="item.url" :src="item.url" :alt="item.name" />
                <img v-else src="/icons/seat.svg" :alt="item.name" />
              </div>
              <div class="history-detail">
                <div class="history-detail-title">{{ item.name }}</div>
                <div class="history-detail-synopsis">{{ item.updateBy }}</div>
                <div class="history-detail-time">{{ item.updateTime }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="first_box">
      <div class="title1">最近上传</div>
      <!-- <img style="height: 76px" src="/assets/MaskGroup.png" /> -->
      <div class="title-img">
        <img src="/assets/WechatIMG1.jpg" style="height: 100%" alt="" />
        <img src="/assets/WechatIMG2.jpg" alt="" />
      </div>
      <div class="upload-content">
        <div v-if="uploadList.length == 0">
          <div
            v-for="(item, index) in 4"
            :key="index"
            class="upload-content-list"
            @click="handleClick(item)"
          >
            <div
              style="
                width: 32px;
                height: 32px;
                margin-right: 16px;
                background-color: #d9d9d9;
              "
            ></div>
          </div>
        </div>
        <div v-if="uploadList.length != 0">
          <div
            v-for="(item, index) in uploadList"
            :key="index"
            class="upload-content-list"
            @click="handleClick(item)"
          >
            <div>
              <img
                style="width: 32px; margin-right: 16px"
                :src="
                  fileTypeIcon(
                    item.fileType === 2
                      ? item.name.replace('zip', 'md')
                      : item.name,
                  )
                "
              />
            </div>
            <div>
              <div class="upload-content-title">{{ item.name }}</div>
              <div class="upload-content-user">
                {{ item.updateBy }} 上传于 {{ item.updateTime }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { fileTypeIcon, typeIcon } from '@/enum'
import * as homeApi from '@/api/home.js'
import { useRouter } from 'vue-router'

const { proxy } = getCurrentInstance()

const formatSize = (size) => {
  // 1 KB = 1024 bytes, 1 MB = 1024 KB, 1 GB = 1024 MB
  const KB = 1024
  const MB = KB * 1024
  const GB = MB * 1024
  const TB = GB * 1024
  if (size || size == 0) {
    // 根据字节数大小决定转换的单位
    if (size >= TB) {
      // 如果大于等于 1GB，转换为 GB
      return (size / TB).toFixed(2) + ' TB'
    } else if (size >= GB) {
      // 如果大于等于 1GB，转换为 GB
      return (size / GB).toFixed(2) + ' GB'
    } else if (size >= MB) {
      // 如果大于等于 1MB，转换为 MB
      return (size / MB).toFixed(2) + ' MB'
    } else if (size >= KB) {
      // 如果大于等于 1KB，转换为 KB
      return (size / KB).toFixed(2) + ' KB'
    } else if (size < KB) {
      // 小于 1KB，显示为字节
      return size + ' bytes'
    }
  }
}

const classifyList = ref([])

const getClassification = async () => {
  await homeApi
    .channelList()
    .then((res) => {
      let data = res.data
      const result = Object.entries(data).map(([name, { num, size }]) => ({
        name,
        size: formatSize(size),
        quantity: num,
      }))
      classifyList.value = result
    })
    .catch((err) => {
      console.error(err)
    })
}

onMounted(async () => {
  await getClassification()
  await getHistoryList()
  await getUploadList()
})

const fileTypeMap = {
  图片: 'image',
  视频: 'video',
  音频: 'audio',
  文本文件: 'word',
  word: 'word',
  excel: 'excel',
  ppt: 'ppt',
  pdf: 'pdf',
  ZIP文件: 'zip',
  其他文件: 'other',
}

const getnameColor = (name) => {
  // 将 name 转为小写，查找映射
  const lowerCaseName = name.toLowerCase()

  // 处理所有文件类型匹配
  if (fileTypeMap[name]) {
    return fileTypeMap[name]
  }

  // 如果小写 name 匹配某种类型
  if (fileTypeMap[lowerCaseName]) {
    return fileTypeMap[lowerCaseName]
  }

  // 如果没有匹配的类型，返回 undefined 或其他默认值
  return undefined
}

const historyList = ref([])

const getHistoryList = async () => {
  await homeApi
    .getHistoryList()
    .then((res) => {
      historyList.value = res.data
    })
    .catch((err) => {
      console.error(err)
    })
}
const uploadList = ref([])

const getUploadList = async () => {
  await homeApi
    .getUploadList()
    .then((res) => {
      uploadList.value = res.data
    })
    .catch((err) => {
      console.error(err)
    })
}

const router = useRouter()
const handleClick = (item) => {
  router.push({
    name: 'VideoDetail',
    query: {
      id: item.id,
    },
  })
}

// 点击需要跳转到网盘列表，并查询当前点击的类型文件
const jumpFilePath = (item) => {
  router.push({
    name: 'file',
    query: {
      name: item.name,
    },
  })
}
</script>

<style lang="scss" scoped>
.workbenches_style {
  display: flex;
  padding: 31px 2.8% 0 3%;
  justify-content: space-between;
  .first_box {
    width: 48%;
  }
  .title1 {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #333333;
    letter-spacing: 0;
    line-height: 25px;
    font-weight: 500;
    margin-bottom: 18px;
  }
}

.el-card {
  border: 0;
  background: #f4f5f7;
  width: 89%;
  height: 110px;
  padding: 0px;
  padding-bottom: 14px;
  border-radius: 8px;
}
.el-col {
  padding: 0 !important;
}

:deep(.el-card__body) {
  padding: 16px 16px 7px 16px;
}
.card-content {
  height: 100%;
  display: flex;
  flex-direction: column; /* 让图标和标题垂直排列 */
  align-items: baseline; /* 水平居中对齐 */
}

.card-title {
  line-height: 1.5; /* 设置标题的行高，避免过于紧凑 */
  font-family: PingFangSC-Medium;
  font-size: 14px;
  letter-spacing: 0;
  font-weight: 500;
}

.card-icon {
  font-size: 32px; /* 设置图标大小 */
  width: 32px;
  height: 32px;
  margin-bottom: 9px; /* 图标和标题之间的间距 */
}

.card-footer {
  margin-top: 9px;
  display: flex;
  justify-content: space-between;
}

.card-quantity {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #aaaaaa;
  letter-spacing: 0;
  font-weight: 500;
}

.card-size {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #000000;
  letter-spacing: 0;
  text-align: right;
  font-weight: 500;
}

.history-title {
  margin-top: 36px;
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color: #333333;
  letter-spacing: 0;
  font-weight: 500;
  margin-bottom: 0;
}

.history-content {
  display: flex;
  height: 78px;
  align-items: stretch;
  cursor: pointer;
  padding-bottom: 24px;
  padding-top: 24px;
  border-bottom: 1px solid rgba(231, 231, 231, 1);
}

.history-img {
  margin-right: 20px;
  background-color: rgb(252, 240, 241);
  width: 140px;
  flex: 0 0 auto;
  border-radius: 5px;
  text-align: center;
  img {
    height: 100%;
  }
}

.history-detail {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  .history-detail-title {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #000000;
    letter-spacing: 0;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 82%;
  }
  .history-detail-synopsis {
    font-family: Helvetica;
    font-size: 14px;
    width: calc(100% - 140px);
    color: #666666;
    letter-spacing: 0;
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .history-detail-time {
    font-family: Helvetica;
    font-size: 14px;
    color: #999999;
    letter-spacing: 0;
    font-weight: 400;
  }
}

.upload-content {
  margin-top: 24px;
  cursor: pointer;
}

.upload-content-list {
  border-bottom: 1px solid rgba(231, 231, 231, 1);
  height: 64px;
  display: flex;
  align-items: center;
  padding-left: 12px;
}

.upload-content-title {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
  line-height: 30x;
  font-weight: 500;
}

.upload-content-user {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #999999;
  letter-spacing: 0;
  line-height: 20px;
  font-weight: 400;
}

.image {
  color: #5091ff;
}
.video {
  color: #ff890e;
}
.audio {
  color: #ff605c;
}
.word {
  color: #0075ff;
}
.excel {
  color: #09b9a2;
}
.ppt {
  color: #ff6a38;
}
.pdf {
  color: #ff6a38;
}
.zip {
  color: #bc8585;
}
.other {
  color: #1dc1ab;
}

.title-img {
  width: 100%;
  height: 76px;
  background-color: rgb(248, 247, 248);
  display: flex;
  justify-content: space-between;
  img {
    height: 100%;
  }
}
</style>
