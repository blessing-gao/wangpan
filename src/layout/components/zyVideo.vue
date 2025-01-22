<template>
  <div class="video-detail">
    <div class="video-detail-header">
      <el-page-header style="width: 100%" @back="handleBack">
        <template #content>
          <span class="text-large font-600 mr-3">
            <div class="video-detail-header-left">
              <img
                style="width: 22px; margin-right: 12px"
                src="/icons/编组 3.svg"
              />
              <div class="video-detail-header-title">{{ file_name }}</div>
              <img style="width: 15px" src="/icons/常用文件.svg" alt="" />
            </div>
          </span>
        </template>
        <template #extra>
          <div>
            <el-button plain>分享</el-button>
            <el-button plain>编辑</el-button>
            <el-button plain>下载</el-button>
            <el-button plain>上传新版本</el-button>
          </div>
        </template>
      </el-page-header>
    </div>
    <div class="video-detail-content">
      <preivewVideo :previewBoolean="true" />
      <div class="video-detail-content-right">
        <el-tabs
          v-model="activeName"
          class="demo-tabs tabs-content"
          @tab-click="handleClick"
        >
          <el-tab-pane label="标签" name="first">
            <videoTags />
          </el-tab-pane>
          <el-tab-pane label="总结" name="second">
            <div class="summarize">
              <el-button plain @click="handleClickSummarize">
                <img src="/assets/编组 4.png" alt="" />
              </el-button>
            </div>
            <summarize ref="summarizeRefs" />
          </el-tab-pane>
          <el-tab-pane label="评论" name="third">评论</el-tab-pane>
          <el-tab-pane label="动态" name="fourth">动态</el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import preivewVideo from '../../components/preivewVideo.vue'
import videoTags from '../../components/videoTags.vue'
import summarize from '../../components/summarize.vue'

const router = useRouter()

const file_name = ref('浙江音乐学院校小提琴演出现场学院校小提琴演出现场.mov')

const activeName = ref('first')

const handleClick = (value) => {
  console.log(value.props.label)
}

const handleBack = () => {
  router.back()
}

const summarizeRefs = ref(null)

const handleClickSummarize = () => {
  summarizeRefs.value.handleEdit()
}
</script>

<style scoped>
:deep(.el-page-header .el-page-header__title) {
  display: none;
}

:deep(.el-divider--vertical) {
  display: none;
}

:deep(.el-page-header__icon) {
  margin-right: 18px;
}

.video-detail {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: black;
}

.video-detail-header {
  background-color: #fff;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-sizing: border-box;
  width: 100%;
}
.video-detail-header-left {
  display: flex;
  align-items: center;
}
.video-detail-header-title {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #000000;
  letter-spacing: 0;
  line-height: 22px;
  font-weight: 400;
  margin-right: 16px;
}

.el-button.is-plain {
  --el-button-hover-text-color: #de3a05;
  --el-button-hover-border-color: #de3a05;
}

.video-detail-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: calc(100% - 55px);
}
.video-detail-content-right {
  width: 21.1%;
  background-color: #fff;
  height: 100%;
  padding: 17px 24px 0;
  border-top: 1px solid rgba(230, 231, 234, 1);
  box-sizing: border-box;
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
  font-size: 12px;
  color: #333333;
  letter-spacing: 0;
  line-height: 22px;
  font-weight: 500;
}

:deep(.summarize .el-button) {
  border: 0;
  padding: 0 !important;
}
</style>
