<template>
  <div class="workbenches_style">
    <div class="first_box" style="margin-right: 4.2%">
      <div>
        <div class="title1">文件分类</div>
        <div class="">
          <el-row :gutter="12">
            <el-col
              :span="6"
              v-for="(item, index) in classifyList"
              :key="index"
            >
              <el-card shadow="never" style="cursor: pointer">
                <div class="card-content">
                  <img :src="getIconSrc(item.name)" class="card-icon" />
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
          <div
            v-for="(item, index) in historyList"
            :key="index"
            class="history-content"
            @click="handleClick(item)"
          >
            <div class="history-img">
              <img :src="item.image" :alt="item.name" />
            </div>
            <div class="history-detail">
              <div class="history-detail-title">{{ item.name }}</div>
              <div class="history-detail-synopsis">{{ item.remark }}</div>
              <div class="history-detail-time">{{ item.lastViewed }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="first_box">
      <div class="title1">最近上传</div>
      <img style="height: 76px" src="/assets/Mask group.png" />
      <div class="upload-content">
        <div
          v-for="(item, index) in uploadList"
          :key="index"
          class="upload-content-list"
          @click="handleClick(item)"
        >
          <div>
            <img
              style="width: 32px; margin-right: 16px"
              :src="getUploadIconSrc(item.type)"
            />
          </div>
          <div>
            <div class="upload-content-title">{{ item.name }}</div>
            <div class="upload-content-user">
              {{ item.uploader }} 上传于 {{ item.lastModified }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import * as homeApi from '@/api/home.js'
import { useRouter } from 'vue-router'

const { proxy } = getCurrentInstance()

const classifyList = ref()

const getClassification = async () => {
  let params = {
    org_id: 1,
    user_id: 1,
  }
  await homeApi
    .channelList(params)
    .then((res) => {
      if (!res.status) {
        proxy.$modal.msgError(res.message)
      } else {
        let data = res.data
        const result = [
          { name: '相册', size: data.photo_size, quantity: data.photo },
          { name: '视频', size: data.video_size, quantity: data.video },
          { name: '音乐', size: data.music_size, quantity: data.music },
          { name: '文档', size: data.doc_size, quantity: data.doc },
        ]
        classifyList.value = result
      }
    })
    .catch((err) => {
      proxy.$modal.msgError(err.message)
    })
}

onMounted(async () => {
  await getClassification()
  await getHistoryList()
  await getUploadList()
})

const getIconSrc = (name) => {
  if (name === '相册') {
    return '/knowledge/icons/项目.svg' // 本地图标路径
  } else if (name === '视频') {
    return '/knowledge/icons/编组 3.svg' // 本地图标路径
  } else if (name === '音乐') {
    return '/knowledge/icons/编组 4.svg' // 本地图标路径
  } else if (name === '文档') {
    return '/knowledge/icons/编组 5.svg' // 本地图标路径
  }
}

const getnameColor = (name) => {
  if (name === '相册') {
    return 'blue' // 本地图标路径
  } else if (name === '视频') {
    return 'origin' // 本地图标路径
  } else if (name === '音频') {
    return 'red' // 本地图标路径
  } else if (name === '文档') {
    return 'green' // 本地图标路径
  }
}

// const historyList = ref([
//   {
//     title: '小提琴教学第1课',
//     synopsis: '关于视频的一些介绍抱佛脚卡的肌肤大煞风景的撒了富士康地方',
//     time: '18:10',
//     img: '',
//   },
// ])

const historyList = ref([])

const getHistoryList = async () => {
  let params = {
    org_id: 1,
    user_id: 1,
  }
  await homeApi
    .getHistoryList(params)
    .then((res) => {
      if (!res.status) {
        proxy.$modal.msgError(res.message)
      } else {
        historyList.value = res.data
      }
    })
    .catch((err) => {
      proxy.$modal.msgError(err.message)
    })
}
const uploadList = ref([])

const getUploadList = async () => {
  await homeApi
    .getUploadList()
    .then((res) => {
      if (!res.status) {
        proxy.$modal.msgError(res.message)
      } else {
        uploadList.value = res.data
      }
    })
    .catch((err) => {
      proxy.$modal.msgError(err.message)
    })
}

const getUploadIconSrc = (name) => {
  return `/icons/${name}.svg`
}

const router = useRouter()
const handleClick = (item) => {
  console.log(item)
  router.push({
    name: 'VideoDetail',
    query: {
      id: '123456',
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
  width: 84%;
  height: 110px;
  padding: 0px;
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
  margin-bottom: 9px; /* 图标和标题之间的间距 */
}

.card-footer {
  margin-top: 9px;
  display: flex;
  justify-content: space-between;
}

.card-quantity {
  font-family: PingFangSC-Medium;
  font-size: 12px;
  color: #aaaaaa;
  letter-spacing: 0;
  font-weight: 500;
}

.card-size {
  font-family: PingFangSC-Medium;
  font-size: 12px;
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
}

.history-content {
  display: flex;
  margin-bottom: 24px;
  height: 78px;
  align-items: stretch;
  cursor: pointer;
}

.history-img {
  margin-right: 20px;
  background-color: #d9d9d9;
  width: 140px;
  flex: 0 0 auto;
  border-radius: 5px;
  img {
    width: 100%;
    height: auto;
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
    font-size: 12px;
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
  border-bottom: 1px solid #ccc;
  height: 64px;
  display: flex;
  align-items: center;
  padding-left: 12px;
}

.upload-content-title {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
  line-height: 22px;
  font-weight: 500;
}

.upload-content-user {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #999999;
  letter-spacing: 0;
  line-height: 20px;
  font-weight: 400;
}

.blue {
  color: #5091ff;
}
.origin {
  color: #ff890e;
}
.red {
  color: #ff605c;
}
.green {
  color: #09b9a2;
}
</style>
