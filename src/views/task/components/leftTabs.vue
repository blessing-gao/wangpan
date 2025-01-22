<template>
  <div style="height: 100%">
    <div class="left-center">
      <div class="all-file">
        <img
          style="margin-right: 12px; width: 14px"
          src="/icons/编组 32.svg"
          alt=""
        />
        <span>我的任务</span>
      </div>
      <el-radio-group v-model="radio" @change="handleNodeClick">
        <el-radio-button value="我上传的">
          <template #default>
            <img
              style="margin-right: 12px; width: 14px"
              src="/icons/矩形.svg"
            />
            我上传的
          </template>
        </el-radio-button>
        <el-radio-button value="我下载的">
          <template #default>
            <img
              style="margin-right: 12px; width: 14px"
              src="/icons/常用文件.svg"
            />
            我下载的
          </template>
        </el-radio-button>
        <el-radio-button value="智能处理">
          <template #default>
            <img
              style="margin-right: 12px; width: 14px"
              src="/icons/垃圾桶.svg"
            />
            智能处理
          </template>
        </el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const radio = ref('我上传的')

const emits = defineEmits(['handleNodeClick'])

const handleNodeClick = (data) => {
  emits('handleNodeClick', data)
}
</script>

<style lang="scss" scoped>
.left-center {
  text-align: center;
  box-sizing: border-box;
  width: 160px;
  padding: 16px;
  height: 100%;
  border-right: 1px solid rgba(230, 231, 234, 1);
}

.left-center-btn {
  display: flex;
  align-items: center;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
  font-weight: 400;
  margin-bottom: 20px;
}

.all-file {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
  font-weight: 500;
  margin-bottom: 12px;
}

:deep(.el-radio-button, .el-radio-button__inner) {
  display: block !important;
  width: 100%;
}

:deep(.el-radio-button__inner) {
  border: 0 !important;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(
  .el-radio-button.is-active
    .el-radio-button__original-radio:not(:disabled)
    + .el-radio-button__inner
) {
  background-color: #f9f3ee !important;
  color: #de3a05 !important;
  box-shadow: none;
}

:deep(.el-radio-button__inner:hover) {
  color: #de3a05 !important;
  background-color: #f9f3ee !important;
}

.custom-tree-node {
  display: flex;
  align-items: centere;
}
</style>
