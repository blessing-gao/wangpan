<template>
  <div>
    <el-dialog
      v-model="dialogTableVisible"
      width="45%"
      class="input-custom-dialog"
      style="margin-top: 0"
      :modal="false"
      :show-close="false"
      @close="handleClose"
    >
      <template #header>
        <el-input
          placeholder="输入并搜索文件..."
          :prefix-icon="Search"
          v-model="searchInput"
          :autofocus="true"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <img style="cursor: pointer" src="/icons/xiangji.svg" />
          </template>
        </el-input>
      </template>

      <div style="background-color: #ffffff; height: 100%;">
        <div class="advanced-search-box">
          <img style="margin-right: 12px" src="/icons/编组 14.svg" />
          <el-button link @click="clickAdvancedSearch">高级搜索</el-button>
        </div>

        <div class="history">
          <div class="history-title">最近浏览</div>
          <div style="overflow: scroll; height: calc(100% - 30px);">
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
                <!-- <img style="width: 24px" :src="getTypeIconSrc(item.type)" /> -->
              </div>
              <div>
                <div class="history-content-title">{{ item.name }}</div>
                <div class="history-content-detail">
                  上传者：{{ item.updateBy }}&nbsp;上传时间：{{
                    item.updateTime
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <advancedSearch ref="advancedSearchRefs" />
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import { fileTypeIcon, collaboraOnlineExts, compressedExts } from '@/enum'
import { useRouter } from 'vue-router'
import { ref, getCurrentInstance } from 'vue'
import * as searchApi from '@/api/search.js'

import advancedSearch from './advancedSearch.vue'

const { proxy } = getCurrentInstance()

const dialogTableVisible = ref(false)

const handleEdit = () => {
  dialogTableVisible.value = true
}

const historyList = ref([])

const getTypeIconSrc = (type) => {
  return `/icons/${type}.svg`
}

const advancedSearchRefs = ref(null)

const clickAdvancedSearch = () => {
  advancedSearchRefs.value.handleEdit()
}

const searchInput = ref('')

const handleSearch = () => {
  // proxy.$modal.msg('搜索')
  searchApi.nameSearch(searchInput.value).then((res) => {
    historyList.value = res.data
  })
}

const handleClose = () => {
  historyList.value = []
  searchInput.value = []
}

const router = useRouter()

// 跳转详情
const jumpDetail = (item) => {
  router.push({
    name: 'VideoDetail',
    query: {
      id: item.id,
    },
  })
}

defineExpose({
  handleEdit,
})
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  position: absolute; /* 使其相对于页面定位 */
  //   top: -8%; /* 距离页面顶部 7% */
  height: 59.9%;
  left: 50%; /* 水平居中 */
  transform: translateX(-50%); /* 使其精确居中 */
  box-shadow: none;
}

:deep(.el-dialog__header) {
  padding: 0;
}

:deep(.input-custom-dialog .el-input__inner) {
  height: 36px;
}

:deep(.input-custom-dialog .el-input-group__prepend) {
  border-bottom-left-radius: 18px;
  border-top-left-radius: 18px;
  background: #f4f5f7;
  padding-left: 16px;
  padding-right: 0;
  box-shadow: none;
}
:deep(.input-custom-dialog .el-input-group__append) {
  border-bottom-right-radius: 18px;
  border-top-right-radius: 18px;
  background: #f4f5f7;
  padding-right: 16px;
  padding-left: 0;
  box-shadow: none;
}

:deep(.input-custom-dialog .el-input__wrapper.is-focus) {
  box-shadow: none;
}
:deep(.input-custom-dialog .el-input__wrapper:hover) {
  box-shadow: none;
}
:deep(.input-custom-dialog .el-input__wrapper) {
  background: #f4f5f7;
  padding: 0;
  padding-left: 16px;
  box-shadow: none;
  border-bottom-left-radius: 18px;
  border-top-left-radius: 18px;
}

:deep(.el-button) {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #333333 !important;
  letter-spacing: 0;
  font-weight: 400;
}

.advanced-search-box {
  display: flex;
  align-items: center;
  margin: 21px 0;
}

.history-title {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #666666;
  letter-spacing: 0;
  font-weight: 400;
  margin-bottom: 19px;
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
.history{
  height: calc(100% - 40px);
}

:deep(.el-dialog__body){
  height: calc(100% - 57px);
}
</style>
