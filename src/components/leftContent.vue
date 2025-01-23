<template>
  <div>
    <div class="tabs">
      <div
        class="tab-box"
        :class="isSelected == 1 ? 'active' : ''"
        @click="selectContainer(1)"
      >
        最近浏览
      </div>
      <div
        class="tab-box"
        :class="isSelected == 2 ? 'active' : ''"
        @click="selectContainer(2)"
      >
        最近编辑
      </div>
    </div>
    <div class="content">
      <div
        class="history-content-list"
        v-for="(item, index) in historyList"
        :key="index"
        @click="jumpDetail(item)"
      >
        <div style="margin-right: 16px">
          <img style="width: 24px" :src="getTypeIconSrc(item.type)" />
        </div>
        <div>
          <div class="history-content-title">{{ item.title }}</div>
          <div class="history-content-detail">
            上传者：{{ item.user }} &nbsp; {{ item.notes }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as searchApi from '@/api/search.js'

const isSelected = ref(1)

const selectContainer = (value) => {
  isSelected.value = value
  getHistoryData()
}

const historyList = ref([])

const getHistoryData = (data) => {
  historyList.value = []
  let params = {}
  searchApi
    .getBrowsingHistory(params)
    .then((res) => {
      if (data) {
        historyList.value = [
          {
            title: '2024.11.23浙江音乐学院校小提琴演出现场照片1.jpg',
            type: 'picture',
            user: '张小伞',
            notes: '你在6小时前打开过',
          },
        ]
      } else {
        historyList.value = [
          {
            title: '2024.11.23浙江音乐学院校小提琴演出现场照片2.jpg',
            type: 'picture',
            user: '张小伞',
            notes: '你在6小时前打开过',
          },
          {
            title: '2024.11.23浙江音乐学院校小提琴演出现场音频片段.mp3',
            type: 'audio',
            user: '张小伞',
            notes: '你最近打开时间 2024.12.12 17:30',
          },
        ]
      }

      console.log(historyList.value)
    })
    .catch((err) => {
      proxy.$modal.msgError(err.message)
    })
}

const getTypeIconSrc = (type) => {
  return `/icons/${type}.svg`
}

const router = useRouter()
// 跳转详情
const jumpDetail = (item) => {
  router.push({
    name: 'VideoDetail',
    query: {
      id: '123456',
    },
  })
}

// 确保在切换tab时可以被调用到接口信息
defineExpose({
  getHistoryData,
})
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
}
.tab-box {
  background: #f4f5f7;
  border-radius: 12.5px;
  padding: 4px 12px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #666666;
  letter-spacing: 0;
  font-weight: 400;
  margin-right: 19px;
  cursor: pointer;
}
.active {
  background: rgba(255, 215, 202, 0.5);
  color: #de3a05;
}

.content {
  margin-top: 24px;
}

.history-content-list {
  display: flex;
  margin-bottom: 16px;
  cursor: pointer;
}

.history-content-title {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #000000;
  letter-spacing: 0;
  line-height: 22px;
  font-weight: 500;
}

.history-content-detail {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #666666;
  letter-spacing: 0;
  line-height: 20px;
  font-weight: 400;
}
</style>
