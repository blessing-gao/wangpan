<template>
  <div class="video-container">
    <!-- 主视频播放器 -->
    <video ref="videoPlayer" class="plyr" crossorigin="anonymous">
      <source :src="content.path" type="video/mp4" />
      您的浏览器不支持视频标签
    </video>

    <!-- 隐藏的视频元素用于生成缩略图 -->
    <video id="hidden-video" crossorigin="anonymous" style="display: none">
      <source :src="content.path" type="video/mp4" />
    </video>

    <!-- 控制按钮 -->
    <div class="controls">
      <button @click="selectPerson('小张')">选择小张</button>
      <button @click="selectPerson('小李')">选择小李</button>
    </div>

    <!-- 缩略图预览 -->
    <div class="thumbnail-preview" :style="thumbnailPosition">
      <img :src="thumbnailSrc" alt="缩略图" />
      <div class="thumbnail-time">{{ hoverTime }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
})

// const videoSrc = ref('http://www.shenben.club:9000/gjq/test.mp4')
const segments = {
  小张: [{ start: 5, end: 6 }],
  小李: [{ start: 30, end: 40 }],
}

const videoPlayer = ref(null)
let player = null
const currentPerson = ref('小张')
const videoDuration = ref(0)
const thumbnailSrc = ref('')
const thumbnailPosition = ref({ display: 'none' })
const progressBar = ref(null)
const hoverTime = ref('00:00')

onMounted(() => {
  player = new Plyr(videoPlayer.value, {
    controls: [
      'play-large',
      'play',
      'progress',
      'current-time',
      'mute',
      'volume',
      'settings',
      'fullscreen',
    ],
    settings: ['quality', 'speed'],
    autoplay: true,
    volume: 0.3,
  })

  progressBar.value = document.querySelector('.plyr__progress')

  player.on('loadedmetadata', () => {
    videoDuration.value = player.duration
    updateMarkers()
  })
  player.on('timeupdate', updateProgressIndicator)
  setupProgressBarEvents()
})

onBeforeUnmount(() => {
  if (player) player.destroy()
})

// 进度指示器更新
const updateProgressIndicator = () => {
  const progress = (player.currentTime / videoDuration.value) * 100
  const indicator = document.querySelector('.progress-indicator')
  if (indicator) {
    indicator.style.left = `${progress}%`
  } else {
    const newIndicator = document.createElement('div')
    newIndicator.className = 'progress-indicator'
    newIndicator.style.left = `${progress}%`
    progressBar.value.appendChild(newIndicator)
  }
}

const selectPerson = (person) => {
  currentPerson.value = person
  player.currentTime = segments[person][0].start
  player.play()
  updateMarkers()
}

const updateMarkers = () => {
  const markers = segments[currentPerson.value]
  progressBar.value.innerHTML = ''

  markers.forEach((segment) => {
    const startPercent = (segment.start / videoDuration.value) * 100
    const endPercent = (segment.end / videoDuration.value) * 100

    const highlight = document.createElement('div')
    highlight.className = 'highlight'
    highlight.style.cssText = `left: ${startPercent}%; width: ${endPercent - startPercent}%`
    progressBar.value.appendChild(highlight)
  })
}

const moveindicator = ref(null)

const setupProgressBarEvents = () => {
  let hiddenVideo = document.getElementById('hidden-video')

  // 初始化隐藏视频
  hiddenVideo.src = props.content.path
  hiddenVideo.load()
  const handleMouseMove = (e) => {
    const rect = progressBar.value.getBoundingClientRect()
    const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width), 1)
    const time = percent * videoDuration.value

    thumbnailPosition.value = {
      display: 'block',
      left: `${e.clientX - rect.left}px`, // 居中显示
      top: `${rect.top - 100}px`,
    }

    const progress = (time / videoDuration.value) * 100
    moveindicator.value = document.querySelector('.progress-indicator1')
    if (moveindicator.value) {
      moveindicator.value.style.display = 'block'
      moveindicator.value.style.left = `${progress}%`
    } else {
      const newIndicator = document.createElement('div')
      newIndicator.className = 'progress-indicator1'
      newIndicator.style.left = `${progress}%`
      newIndicator.style.display = 'block'
      progressBar.value.appendChild(newIndicator)
    }
    hoverTime.value = formatTime(time)
    getThumbnail(time)
  }

  const handleClick = (e) => {
    const rect = progressBar.value.getBoundingClientRect()
    const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width), 1)
    player.currentTime = percent * videoDuration.value
  }

  progressBar.value.addEventListener('mousemove', handleMouseMove)
  progressBar.value.addEventListener('click', handleClick)
  progressBar.value.addEventListener('mouseleave', () => {
    thumbnailPosition.value.display = 'none'
    moveindicator.value.style.display = 'none'
  })
}

const getThumbnail = (time) => {
  const canvas = document.createElement('canvas')
  const hiddenVideo = document.getElementById('hidden-video')

  hiddenVideo.currentTime = time
  hiddenVideo.addEventListener(
    'seeked',
    () => {
      canvas.width = 120
      canvas.height = 80
      const ctx = canvas.getContext('2d')
      ctx.drawImage(hiddenVideo, 0, 0, canvas.width, canvas.height)
      thumbnailSrc.value = canvas.toDataURL()
    },
    { once: true },
  )
}

const formatTime = (seconds) => {
  const date = new Date(seconds * 1000)
  const mm = date.getUTCMinutes().toString().padStart(2, '0')
  const ss = date.getUTCSeconds().toString().padStart(2, '0')
  return `${mm}:${ss}`
}
</script>
<style scoped>
.video-container {
  width: 100%;
  margin: 0 auto;
  position: relative;
}

.controls {
  padding: 15px 0;
  text-align: center;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 10;
}

.controls button {
  padding: 8px 20px;
  margin: 0 10px;
  background: #00aeec;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.controls button:hover {
  opacity: 0.8;
}

.thumbnail-preview {
  position: fixed;
  width: 120px;
  height: 80px;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  display: none; /* 默认为不显示 */

  /* position: fixed;
  width: 120px;
  height: 80px;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  pointer-events: none; */
}

.thumbnail-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 深度样式穿透 */
:deep(.plyr) {
  height: 93%;
  min-height: 400px;
  background: #000;
}

:deep(.plyr__controls) {
  padding: 15px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
}

:deep(.plyr__progress--played) {
  color: #00aeec !important; /* 已播放进度颜色 */
}

:deep(.plyr__progress__buffer) {
  color: rgba(255, 255, 255, 0.25) !important; /* 缓冲进度颜色 */
}

:deep(.plyr__progress) {
  position: relative;
  height: 8px;
  background: #ccc;
}

:deep(.highlight) {
  position: absolute;
  height: 100%;
  background: rgba(255, 0, 0, 0.3);
  z-index: 2;
}
/* 新增缩略图时间显示样式 */
.thumbnail-time {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  text-align: center;
  font-size: 12px;
  padding: 2px 0;
}

:deep(.progress-indicator) {
  position: absolute;
  height: 100%;
  width: 2px;
  background: #00aeec;
  z-index: 3;
}

:deep(.progress-indicator1) {
  position: absolute;
  height: 100%;
  width: 2px;
  background: #00aeec;
  z-index: 3;
}
</style>
