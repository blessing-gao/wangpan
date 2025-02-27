<template>
  <div class="audio-player">
    <img v-if="isPlaying" style="width: 128px" src="/assets/音频.gif" alt="" />
    <img v-else style="width: 128px" src="/assets/音频.png" alt="" />
    <div class="audio-content">
      <!-- 音频控件 -->
      <!-- http://www.shenben.club:9000/gjq/%E5%BD%95%E9%9F%B3.mp3 -->
      <audio
        ref="audioRef"
        :src="audioSrc"
        @timeupdate="updateTime"
        @loadedmetadata="setDuration"
        @ended="handleEnd"
      ></audio>

      <!-- 播放器主体 -->
      <div class="controls">
        <!-- 左侧播放控制 -->
        <div class="left-controls">
          <el-icon :size="40" class="play-btn" @click="togglePlay">
            <VideoPlay v-if="!isPlaying" />
            <VideoPause v-else />
          </el-icon>
        </div>

        <!-- 进度条区域 -->
        <div class="progress-container">
          <div class="time-display">{{ formatTime(currentTime) }}</div>
          <el-slider
            v-model="progress"
            :max="duration"
            :format-tooltip="formatTime"
            @change="seek"
            class="progress-bar"
          />
          <div class="time-display">{{ formatTime(duration) }}</div>
        </div>

        <!-- 右侧附加功能 -->
        <div class="right-controls">
          <el-icon @click="toggleMute">
            <Headset v-if="!isMuted" />
            <Mute v-else />
          </el-icon>
          <el-slider
            v-model="volume"
            :max="1"
            :step="0.1"
            :format-tooltip="formatVolume"
            class="volume-slider"
            @input="adjustVolume"
            :disabled="volumeDisabled"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'

import {
  VideoPlay,
  VideoPause,
  Headset,
  Crop,
  Mute,
} from '@element-plus/icons-vue'

const props = defineProps({
  audioSrc: {
    type: String,
    required: true,
  },
})

const audioRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)
const volume = ref(0.5)
const isMuted = ref(false)
const volumeDisabled = ref(false)

// 格式化时间显示
const formatTime = (time) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// 格式化音量显示
const formatVolume = (value) => {
  return `${Math.round(value * 100)}%`
}

const setDuration = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration || 0
  }
}

// 播放结束时，自动将播放按钮切换为暂停状态
const handleEnd = () => {
  isPlaying.value = false
}

// 切换播放/暂停
const togglePlay = () => {
  if (!audioRef.value) return
  isPlaying.value = !isPlaying.value
  isPlaying.value ? audioRef.value.play() : audioRef.value.pause()
}

// 调整播放进度
const seek = (value) => {
  if (audioRef.value) {
    audioRef.value.currentTime = value
  }
}

// 调整音量
const adjustVolume = (value) => {
  if (audioRef.value) {
    audioRef.value.volume = value
    isMuted.value = value === 0
  }
}

// 静音切换
const toggleMute = () => {
  if (audioRef.value) {
    isMuted.value = !isMuted.value
    audioRef.value.muted = isMuted.value
    if (!isMuted.value && volume.value === 0) {
      volume.value = 0.5
    }
  }
  volumeDisabled.value = !volumeDisabled.value
}

// 更新时间
const updateTime = () => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
    progress.value = currentTime.value
    duration.value = audioRef.value.duration || 0
  }
}

// 初始化音量
onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value
  }
})

// 监听播放结束
watch(isPlaying, (playing) => {
  if (!playing && audioRef.value?.ended) {
    // 根据播放模式处理下一曲逻辑
    // 这里可以扩展播放列表管理
    isPlaying.value = false
  }
})
</script>

<style scoped>
.audio-player {
  width: 100%;
  height: 100%;
  background: #f0f5fb;
  /* padding: 12px 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
}

:deep(.el-slider__bar) {
  background-color: #de3a05;
}

:deep(.el-slider__button) {
  border-color: #de3a05;
}

.controls {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.left-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.play-btn {
  color: #de3a05;
  cursor: pointer;
  transition: transform 0.2s;
}

.play-btn:hover {
  transform: scale(1.1);
}

.progress-container {
  flex: 3;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
}

.time-display {
  min-width: 40px;
  font-size: 12px;
  color: #666;
}

.progress-bar {
  flex: 1;
}

.right-controls {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
}

.volume-slider {
  width: 100px;
}

.el-icon {
  cursor: pointer;
  transition: color 0.2s;
}

.el-icon:hover {
  color: #de3a05;
}
.audio-content {
  width: 100%;
  height: 74px;
  background-color: #fff;
  line-height: 74px;
  position: absolute;
  bottom: 0;
}
</style>
