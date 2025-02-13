<template>
  <div class="audio-player">
    <audio
      ref="audioElement"
      src="http://www.shenben.club:9000/gjq/%E5%BD%95%E9%9F%B3.mp3"
      @loadedmetadata="handleLoadedMetadata"
    ></audio>

    <!-- 进度条 -->
    <div class="progress-bar" @click="seek">
      <div class="progress" :style="{ width: progress + '%' }"></div>
    </div>

    <!-- 控制区域 -->
    <div class="controls">
      <button @click="togglePlay" style="display: flex; padding: 8px 0">
        <el-icon v-if="!isPlaying"><VideoPlay /></el-icon>
        <el-icon v-else><VideoPause /></el-icon>
      </button>

      <div class="time-display">
        {{ formatTime(currentTime) }} / {{ formatTime(totalDuration) }}
      </div>

      <!-- 音量控制 -->
      <div class="volume-control">
        <button @click="toggleMute" style="display: flex; padding: 8px 0">
          <!-- <i :class="isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'"></i> -->
          <el-icon v-if="!isMuted"><Microphone /></el-icon>
          <el-icon v-else><Mute /></el-icon>
        </button>
        <!-- <input
          type="range"
          v-model="volume"
          min="0"
          max="1"
          step="0.01"
          @input="updateVolume"
          class="volume"
        /> -->
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          v-model="volume"
          class="volume-slider"
          @input="updateVolume"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  VideoPlay,
  VideoPause,
  Microphone,
  Mute,
} from '@element-plus/icons-vue'

const props = defineProps({
  audioSrc: {
    type: String,
    required: true,
  },
})

const audioElement = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const totalDuration = ref(0)
const volume = ref(1)
const isMuted = ref(false)
const volumeBeforeMute = ref(1)

// 计算播放进度百分比
const progress = computed(() => {
  return (currentTime.value / totalDuration.value) * 100 || 0
})

// 初始化时设置事件监听
onMounted(() => {
  const audio = audioElement.value
  audio.addEventListener('timeupdate', () => {
    currentTime.value = audio.currentTime
  })
  audio.addEventListener('ended', () => {
    isPlaying.value = false
  })
})

const handleLoadedMetadata = () => {
  totalDuration.value = audioElement.value.duration
}

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  isPlaying.value ? audioElement.value.play() : audioElement.value.pause()
}

const seek = (e) => {
  const rect = e.target.getBoundingClientRect()
  const pos = (e.clientX - rect.left) / rect.width
  audioElement.value.currentTime = pos * totalDuration.value
}

const updateVolume = () => {
  audioElement.value.volume = volume.value
  isMuted.value = volume.value === 0
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  if (isMuted.value) {
    volumeBeforeMute.value = volume.value
    volume.value = 0
  } else {
    volume.value = volumeBeforeMute.value
  }
  updateVolume()
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.audio-player {
  width: 100%;
  max-width: 600px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.progress-bar {
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  margin: 10px 0;
  cursor: pointer;
}

.progress {
  height: 100%;
  background: #2d8cf0;
  border-radius: 2px;
  transition: width 0.1s linear;
}

.controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #666;
}

button:hover {
  color: #2d8cf0;
}

.time-display {
  font-size: 0.9em;
  color: #666;
}

.volume {
  width: 100%;
  background: #555;
  border: none;
  height: 5px;
}
.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-slider {
  width: 80px;
  height: 4px;
  background: #555;
  border-radius: 2px;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: #2d8cf0;
  border-radius: 50%;
  cursor: pointer;
}

.fas {
  font-size: 16px;
}
</style>
