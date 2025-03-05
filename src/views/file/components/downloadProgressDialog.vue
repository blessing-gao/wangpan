<template>
  <div class="progress-body">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <div class="card-header-left">
            <img
              style="width: 24px; margin-right: 12px"
              src="/icons/refresh.svg"
              alt=""
            />
            <div class="upload-number">正在下载（{{ downloadingCount }}）</div>
          </div>
          <div class="card-header-right">
            <div class="pause" @click="handleClear">清空</div>
            <el-icon style="cursor: pointer" @click="handleClose">
              <Close />
            </el-icon>
          </div>
        </div>
      </template>
      <div>
        <div class="prompt">
          空文件夹或文件(夹)名以“.”开头可能会被浏览器过滤，且无任何提示
        </div>
        <div
          v-for="(file, index) in downloadingFiles"
          :key="file.id"
          class="download-item"
        >
          <div class="title">
            <div class="title-left">
              <img
                :src="fileTypeIcon(file.name)"
                alt=""
                style="width: 20px; margin-right: 10px"
              />
              {{ file.name }}
            </div>
            <div class="title-right">
              <img
                v-if="downloadProgress[index]?.progress === 100"
                src="/icons/完成.svg"
                alt=""
                style="cursor: pointer; width: 15px; margin-right: 10px"
              />
              <div v-else class="title-right">
                <img
                  src="/icons/暂停.svg"
                  alt=""
                  style="cursor: pointer; width: 15px; margin-right: 10px"
                />
                <img
                  src="/icons/关闭.svg"
                  alt=""
                  style="cursor: pointer; width: 15px"
                  @click="cancelDownload(file.index)"
                />
              </div>
            </div>
          </div>
          <div class="pregress-style">
            <div class="pregress-left">
              <div class="pregress-left-left">
                {{ formatFileSize(downloadProgress[index]?.loaded) }}
              </div>
              <div class="pregress-left-right">
                /
                {{ formatFileSize(downloadProgress[index]?.total) }}
              </div>
            </div>

            <div class="pregress-right">
              {{ downloadProgress[index]?.progress }}%
            </div>
          </div>
          <el-progress
            color="#C38F5D"
            :show-text="false"
            :percentage="downloadProgress[index]?.progress"
          ></el-progress>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Refresh, Close } from '@element-plus/icons-vue'
import { fileTypeIcon } from '@/enum'
const props = defineProps({
  downloadProgress: {
    type: Array,
    default: [],
  },
  downloadingFiles: {
    type: Array,
    default: [],
  },
})

const downloadingCount = computed(() => {
  // 计算 downloadProgress 中 progress 为 100 的文件数量
  return props.downloadProgress.filter((item) => item.progress !== 100).length
})

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  else if (bytes < 1048576) return `${(bytes / 1024).toFixed(2)} KB`
  else if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(2)} MB`
  else return `${(bytes / 1073741824).toFixed(2)} GB`
}

const emits = defineEmits('cancelDownload', 'onClose', 'clear')
const cancelDownload = (id) => {
  const fileIndex = props.downloadProgress.findIndex(
    (item) => item.index === id,
  )
  console.log(props.downloadProgress)

  if (fileIndex !== -1) {
    props.downloadProgress[fileIndex].progress = 100
  }
  emits('cancelDownload', id)
}

const handleClose = () => {
  emits('onClose')
}

const handleClear = () => {
  emits('clear')
}
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
  div {
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
:deep(.el-card__body) {
  height: calc(100% - 94px);
  overflow: scroll;
  padding-top: 10px;
}
:deep(.el-card__footer) {
  height: 0;
}
.prompt {
  color: #999999;
  font-size: 14px;
  margin-bottom: 10px;
}
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.title-left {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #000000;
  letter-spacing: 0;
  line-height: 22px;
  font-weight: 400;
  display: flex;
  align-items: center;
}
.pregress-style {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.pregress-left,
.title-right {
  display: flex;
  align-items: center;
}
.pregress-left-left {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
  line-height: 18px;
  font-weight: 400;
}
.pregress-left-right {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #999999;
  letter-spacing: 0;
  line-height: 18px;
  font-weight: 400;
}
.pregress-right {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
  font-weight: 500;
}
.download-item {
  margin-bottom: 13px;
}
</style>
