<template>
  <div class="search-box">
    <div class="search-input-header">
      <div class="search_input">
        <el-input
          v-model="searchInput"
          placeholder="请输入"
          :prefix-icon="Search"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #append>
            <!-- @click="clickXiangji" -->
            <img
              style="cursor: pointer"
              src="/icons/xiangji.svg"
              v-if="searchInput == ''"
            />
          </template>
        </el-input>
      </div>
      <div class="advanced-search-box">
        <img style="margin-right: 12px" src="/icons/编组 14.svg" />
        <el-button link @click="clickAdvancedSearch">高级搜索</el-button>
      </div>
    </div>
    <div class="search-content">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="最近搜索" name="first">
          <seachContent ref="searchRefs" :searchInput="searchInput" />
        </el-tab-pane>
        <el-tab-pane label="最近编辑" name="second">
          <seachContent ref="editRefs" :searchInput="searchInput" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <uploadSearch ref="uploadSearchRef" />
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import uploadSearch from '@/components/uploadSearch.vue'
import seachContent from './components/seachContent.vue'
import useSearchStore from '@/store/modules/search'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const uploadSearchRef = ref(null)
const searchStore = useSearchStore()

// 默认从本地获取搜索内容
const searchInput = ref(searchStore.searchInput)

watch(searchInput, (newValue) => {
  searchStore.setSearchInput(newValue)
})

onMounted(() => {
  if (searchInput.value && searchInput.value != '') {
    if (activeName.value === 'first') {
      searchRefs.value.handleSearch(searchInput.value)
    } else {
      editRefs.value.handleSearch(searchInput.value)
    }
  }
})

const clickXiangji = () => {
  // 配置上传的信息
  let params = {
    multiple: false,
    autoUpload: true,
    type: 'search',
  }
  uploadSearchRef.value.handleEdit(params)
}

const searchRefs = ref(null)
const editRefs = ref(null)

const handleSearch = () => {
  if (activeName.value === 'first') {
    searchRefs.value.handleSearch(searchInput.value)
  } else {
    editRefs.value.handleSearch(searchInput.value)
  }
}

const activeName = ref('first')

const handleClick = () => {
  if (searchInput.value && searchInput.value != '') {
    if (activeName.value === 'first') {
      searchRefs.value.handleSearch(searchInput.value)
    } else {
      editRefs.value.handleSearch(searchInput.value)
    }
  }
}

const clickAdvancedSearch = () => {
  console.log('clickAdvancedSearch')
}
</script>

<style lang="scss" scoped>
.search-box {
  margin-top: 21px;
  height: calc(100% - 21px);
}
:deep(.search_input .el-input__inner) {
  height: 36px;
  cursor: pointer;
}
.search-input-header {
  display: flex;
  align-items: center;
  justify-content: center;
}
.search_input {
  width: 41.7%;
}
:deep(.search_input .el-input-group__prepend) {
  border-bottom-left-radius: 18px;
  border-top-left-radius: 18px;
  background: #f4f5f7;
  padding-left: 16px;
  padding-right: 0;
  box-shadow: none;
}
:deep(.search_input .el-input-group__append) {
  border-bottom-right-radius: 18px;
  border-top-right-radius: 18px;
  background: #f4f5f7;
  padding-right: 16px;
  padding-left: 0;
  box-shadow: none;
}

:deep(.search_input .el-input__wrapper.is-focus) {
  box-shadow: none;
}
:deep(.search_input .el-input__wrapper:hover) {
  box-shadow: none;
}
:deep(.search_input .el-input__wrapper) {
  background: #f4f5f7;
  padding: 0;
  padding-left: 16px;
  box-shadow: none;
  border-bottom-left-radius: 18px;
  border-top-left-radius: 18px;
}

.advanced-search-box {
  display: flex;
  align-items: center;
  margin: 21px;
}

.search-content {
  width: 100%;
  padding: 30px 45px;
  box-sizing: border-box;
  height: calc(100% - 83px);
}

:deep(.el-tabs__item.is-active) {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #de3a05;
  letter-spacing: 0;
  line-height: 22px;
  font-weight: 500;
}
:deep(.el-tabs__item:hover) {
  color: #de3a05;
}

:deep(.el-tabs__item) {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
  line-height: 22px;
  font-weight: 400;
}
:deep(.el-tabs) {
  height: 100%;
}
:deep(.el-tabs__content) {
  height: 100%;
}
:deep(.el-tab-pane) {
  height: 100%;
}
:deep(.el-tabs__active-bar) {
  background-color: #de3a05;
}
</style>
