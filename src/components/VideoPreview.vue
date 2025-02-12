<template>
  <div>
    <video
      id="media"
      ref="videoRefs"
      class="plyr"
      controls
      crossorigin="anonymous"
      :autoplay="playerOptions.autoPlay"
      :loop="playerOptions.loop"
      :muted="playerOptions.muted"
      :volume="playerOptions.volume"
      @timeupdate="onTimeUpdate"
    >
      <source :src="videoSrc" type="video/mp4" />
      您的浏览器不支持视频标签。
    </video>

    <!-- 控制按钮 - 选择小张或小李 -->
    <div class="controls">
      <button @click="choosePerson('小张')">选择小张</button>
      <button @click="choosePerson('小李')">选择小李</button>
    </div>

    <!-- 缩略图预览容器 -->
    <div class="thumbnail-preview" v-show="isThumbnailVisible">
      <img :src="thumbnailSrc" alt="缩略图" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'

const props = defineProps({
  content: {
    type: Object,
    default: () => ({}),
  },
  previewBoolean: {
    type: Boolean,
    default: true,
  },
})

// 播放器配置
let playerOptions = reactive({
  autoPlay: true, // 自动播放
  loop: false, // 循环播放
  muted: false, // 静音
  volume: 0.3, // 默认音量大小
})

let player = null // Plyr 实例
let videoDuration = 0 // 存储视频时长
let currentPerson = '小张' // 默认选择小张
let markers = [] // 当前人物的时间段标记

// 定义小张和小李的时间段
const segments = {
  小张: [
    { start: 5, end: 6 },
    { start: 10.5, end: 14 },
    { start: 20.8, end: 30 },
  ],
  小李: [{ start: 30, end: 40 }],
}

const videoRefs = ref(null) // 视频 DOM 引用
const videoSrc = ref('') // 视频源地址

// 获取视频地址
const getVideo = () => {
  videoSrc.value = 'http://www.shenben.club:9000/gjq/test.mp4'
}

// 更新进度条上的标记
const updateMarkers = () => {
  markers = segments[currentPerson] // 获取当前人物的时间段
  const progressBar = videoRefs.value.querySelector('.plyr__progress__container')
  console.log(progressBar);
  progressBar.innerHTML = '' // 清空之前的标记

  markers.forEach((segment) => {
    const startPercent = (segment.start / videoDuration) * 100
    const endPercent = (segment.end / videoDuration) * 100

    // 创建标记
    const highlight = document.createElement('div')
    highlight.classList.add('highlight')
    highlight.style.left = `${startPercent}%`
    highlight.style.width = `${endPercent - startPercent}%`

    progressBar.appendChild(highlight)
  })
}

onMounted(() => {
  // 动态加载 Plyr.js
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/npm/plyr@3.6.2/dist/plyr.js'
  script.onload = () => {
    player = new Plyr(videoRefs.value)
    videoDuration = player.duration // 获取视频时长
    updateMarkers()
  }
  document.body.appendChild(script)

  getVideo()
})

// 监听播放时更新进度条
const onTimeUpdate = () => {
  const currentTime = player.currentTime
  const progressBar = videoRefs.value.querySelector('.plyr__progress__container')
  const progress = (currentTime / videoDuration) * 100

  // 更新进度条的当前进度
  const playProgress = document.createElement('div')
  playProgress.classList.add('blue-progress')
  playProgress.style.left = `${progress}%`
  playProgress.style.width = '2px'

  // 清除上一个进度条的标记
  const previousProgress = progressBar.querySelector('.blue-progress')
  if (previousProgress) {
    previousProgress.remove()
  }

  progressBar.appendChild(playProgress)
}

// 鼠标移动在进度条上时显示缩略图
const progressBar = ref(null)
let lastUpdateTime = 0 // 记录最后更新时间

const onMouseMove = (e) => {
  const mouseX = e.offsetX
  const timeAtMouse = (mouseX / progressBar.value.offsetWidth) * videoDuration

  // 延迟更新，避免频繁截图造成卡顿
  if (Math.abs(timeAtMouse - lastUpdateTime) > 0.1) {
    lastUpdateTime = timeAtMouse
    requestAnimationFrame(() => getThumbnail(timeAtMouse))
  }
}
const isThumbnailVisible = ref(false)
const onMouseEnter = () => {
  isThumbnailVisible.value = true // 显示缩略图
}

const onMouseLeave = () => {
  isThumbnailVisible.value = false // 隐藏缩略图
}

const thumbnailSrc = ref(null)

// 使用canvas获取视频帧缩略图
const getThumbnail = (time) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const video = videoRefs.value
  video.currentTime = time

  video.addEventListener('seeked', () => {
    // 当视频跳转到目标时间点后，绘制当前帧
    canvas.width = 120 // 缩略图宽度
    canvas.height = 80 // 缩略图高度
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // 更新缩略图图片
    thumbnailSrc.value = canvas.toDataURL()
  })
}
</script>

<style lang="scss" scoped>
@import url('https://cdn.jsdelivr.net/npm/plyr@3.6.2/dist/plyr.css');
.video-player {
  width: 100%;
  height: 100%;
  background-color: #000;
}

:deep(video::-webkit-media-controls) {
  display: flex !important; /* 确保控制条显示 */
}

.video-player {
  width: 100%;
  height: 100%;
  background-color: #000;
}

.controls {
  margin-top: 10px;
  text-align: center;
}

.controls button {
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
}

.thumbnail-preview {
  position: absolute;
  top: -80px; /* 在进度条上方显示 */
  width: 120px;
  height: 80px;
  display: none;
  border: 1px solid #ccc;
  background-color: rgba(0, 0, 0, 0.5);
}

.thumbnail-preview img {
  width: 100%;
  height: 100%;
}
</style>
