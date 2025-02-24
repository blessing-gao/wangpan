<template>
  <div style="height: 100%">
    <div class="content-header">搜索结果 ({{ historyList.length }})</div>

    <div v-if="historyList.length == 0" class="no-option">
      <img
        style="width: 200px; height: 150px"
        src="/icons/not-search.svg"
        alt=""
      />
      <div class="no-option-text">暂无搜索结果</div>
    </div>

    <div style="overflow: scroll; height: calc(100% - 30px)" v-else>
      <div
        class="history-content-list"
        v-for="(item, index) in historyList"
        :key="index"
        @click="jumpDetail(item)"
      >
        <div style="margin-right: 16px">
          <img
            style="width: 24px"
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
          <div
            class="history-content-title"
            v-html="highlightedName(item.name)"
          ></div>
          <div class="history-content-detail">
            上传者：{{ item.updateBy }}&nbsp;上传时间：{{ item.updateTime }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { fileTypeIcon } from '@/enum'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as searchApi from '@/api/search.js'
const props = defineProps({
  searchInput: String,
})

const historyList = ref([])

const handleSearch = async () => {
  await searchApi.nameSearch(props.searchInput).then((res) => {
    historyList.value = res.data
  })
}

defineExpose({
  handleSearch,
})

const router = useRouter()

const jumpDetail = (item) => {
  router.push({
    name: 'VideoDetail',
    query: {
      id: item.id,
    },
  })
}

const highlightedName = (name) => {
  if (!props.searchInput) return name // 如果没有输入信息，直接返回文件名

  const regex = new RegExp(`(${escapeRegExp(props.searchInput)})`, 'gi') // 生成正则表达式
  return name.replace(regex, (match) => {
    return `<span style="color: #DE3A05;">${match}</span>` // 用红色标记匹配的部分
  })
}

// 转义正则表达式中的特殊字符
const escapeRegExp = (str) => {
  return str.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&')
}
</script>

<style lang="scss" scoped>
.content-header {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #888888;
  letter-spacing: 0;
  font-weight: 500;
}
.history-content-list {
  display: flex;
  margin-bottom: 16px;
  cursor: pointer;
  margin-top: 24px;
}
.no-option {
  text-align: center;
  margin-top: 100px;
  color: #999;
}
.no-option-text {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #666666;
  letter-spacing: 0;
  text-align: center;
  line-height: 40px;
  font-weight: 400;
  margin-top: 16px;
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
  font-size: 14px;
  color: #666666;
  letter-spacing: 0;
  line-height: 20px;
  font-weight: 400;
}
</style>
