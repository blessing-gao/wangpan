<template>
  <div>
    <el-dialog
      v-model="dialogTableVisible"
      width="45%"
      style="margin-top: 0; padding: 10px 0 0 24px"
      :modal="false"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <template #header>
        <div class="custom-dialog">
          <el-input
            placeholder="请输入..."
            style="width: 96%"
            v-model="searchInput"
            :autofocus="true"
            @keyup.enter="handleSearch"
          >
            <template #prepend>
              <img style="cursor: pointer" src="/icons/编组 14.svg" />
            </template>
          </el-input>
        </div>
      </template>

      <el-tabs
        v-model="activeName"
        class="demo-tabs tabs-content"
        @tab-click="handleClick"
      >
        <el-tab-pane label="全部" name="first">
          <div class="left">
            <leftContent />
          </div>
          <div class="right">
            <rightContent />
          </div>
        </el-tab-pane>
        <el-tab-pane label="相册" name="second">
          <div class="left">
            <leftContent />
          </div>
          <div class="right">
            <rightContent />
          </div>
        </el-tab-pane>
        <el-tab-pane label="视频" name="third">
          <div class="left">
            <leftContent />
          </div>
          <div class="right">
            <rightContent />
          </div>
        </el-tab-pane>
        <el-tab-pane label="音频" name="fourth">
          <div class="left">
            <leftContent />
          </div>
          <div class="right">
            <rightContent />
          </div>
        </el-tab-pane>
        <el-tab-pane label="文档" name="fourth1">
          <div class="left">
            <leftContent />
          </div>
          <div class="right">
            <rightContent />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'

import leftContent from './leftContent.vue'
import rightContent from './rightContent.vue'

const { proxy } = getCurrentInstance()

const dialogTableVisible = ref(false)

const handleEdit = () => {
  dialogTableVisible.value = true
}

const activeName = ref('first')

const handleClick = () => {}

const searchInput = ref('')

const handleSearch = () => {
  proxy.$modal.msg('搜索')
}

const handleClose = () => {
  searchInput.value = ''
}

defineExpose({
  handleEdit,
})
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  position: absolute; /* 使其相对于页面定位 */
  height: 59.9%;
  left: 50%; /* 水平居中 */
  transform: translateX(-50%); /* 使其精确居中 */
}

:deep(.custom-dialog .el-input__inner) {
  height: 36px;
}

:deep(.custom-dialog .el-input-group__prepend) {
  border-bottom-left-radius: 18px;
  border-top-left-radius: 18px;
  background: #f4f5f7;
  padding-left: 16px;
  padding-right: 0;
  box-shadow: none;
}
:deep(.custom-dialog .el-input-group__append) {
  border-bottom-left-radius: 18px;
  border-top-left-radius: 18px;
  background: #f4f5f7;
  padding-right: 16px;
  padding-left: 0;
  box-shadow: none;
}

:deep(.custom-dialog .el-input__wrapper.is-focus) {
  box-shadow: none;
}
:deep(.custom-dialog .el-input__wrapper:hover) {
  box-shadow: none;
}
:deep(.custom-dialog .el-input__wrapper) {
  background: #f4f5f7;
  padding: 0;
  padding-left: 16px;
  box-shadow: none;
  border-bottom-right-radius: 18px;
  border-top-right-radius: 18px;
}

:deep(.el-dialog__headerbtn) {
  line-height: 3;
  font-size: 20px;
  color: #444;
}

.tabs-content {
  margin-top: 24px;
  height: 100%;
}

:deep(.el-dialog__body) {
  height: calc(100% - 60px);
  padding: 0;
}

:deep(.el-tabs__header) {
  margin: 0;
}

/* 修改选中标签的文字颜色和背景颜色 */
:deep(.el-tabs__item.is-active) {
  color: #de3a05; /* 修改选中标签的文字颜色 */
  background-color: transparent; /* 保持背景透明，或者可以选择其他颜色 */
  border-color: #de3a05; /* 修改边框颜色（如果有） */
}

/* 修改选项卡下划线颜色（如果存在） */
:deep(.el-tabs__active-bar) {
  background-color: #de3a05; /* 修改选中状态下的下划线颜色 */
}

/* 可选：悬停时修改文字颜色 */
:deep(.el-tabs__item:hover) {
  color: #de3a05; /* 悬停时的颜色 */
}

:deep(.el-tabs__item) {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
  line-height: 22px;
  font-weight: 500;
}
.right {
  width: 200px;
  background: rgba(244, 245, 247, 0.5);
  border-left: 1px solid rgb(244, 245, 247);
  padding: 13px 16px 0;
}

:deep(.el-tab-pane) {
  display: flex;
  width: 100%;
  height: 100%;
}

.left {
  flex: 1;
  padding-top: 10px;
}
</style>
