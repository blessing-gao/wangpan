<template>
  <div class="progress-body">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <div class="card-header-left">
            <img style="width: 24px; margin-right: 12px;" src="/icons/refresh.svg" alt="">
            <div class="upload-number">正在上传（{{ uploadProgress.length }}）</div>
          </div>
          <div class="card-header-right">
            <div class="pause">全部暂停</div>
            <el-icon style="cursor: pointer;"><Close /></el-icon>
          </div>
        </div>
      </template>
      <div>
        <div class="prompt">空文件夹或文件(夹)名以“.”开头可能会被浏览器过滤，且无任何提示</div>
        <div v-for="o in 100" :key="o" class="text item">
        {{ 'List item ' + o }}
      </div>
      </div>
      
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Refresh, Close } from '@element-plus/icons-vue'
const props = defineProps({
  uploadProgress: {
    type: Array,
    default: [],
  },
})
</script>

<style scoped lang="scss">
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  padding: 22px 26px 17px 25px;
  box-sizing: border-box;
}
.progress-body {
  position: absolute;
  bottom: 2px;
  right: 0;
  width: 33.6%;
  height: 49.6%;
  z-index: 99;
}
:deep(.el-card) {
  height: 100%;
  width: 100%;
  border-radius: 12px;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  div{
    display: flex;
    align-items: center;
  }
}
.upload-number {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
  font-weight: 500;
}
.pause {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #de3a05;
  letter-spacing: 0;
  font-weight: 400;
  cursor: pointer;
  margin-right: 34px;
}
:deep(.el-card__body){
  height: calc(100% - 94px);
  overflow: scroll;
  padding-top: 10px;
}
:deep(.el-card__footer){
  height: 0;
}
.prompt{
  color: #ccc;
  font-size: 12px;
  margin-bottom: 10px;
}
</style>
