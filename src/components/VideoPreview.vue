<template>
  <video
      id="media"
      ref="videoRefs"
      class="video-player"
      controls
      :src="videoSrc"
      :autoplay="playerOptions.autoPlay"
      :loop="playerOptions.loop"
      :muted="playerOptions.muted"
      :volume="playerOptions.volume"
  ></video>
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

const videoRefs = ref(null) // 视频 DOM 引用
const videoSrc = ref('') // 视频源地址

// 获取视频地址
const getVideo = () => {
  if (props.content?.path) {
    videoSrc.value = props.content.path // 使用 content.path 作为视频源地址
  }
}

onMounted(() => {
  getVideo()
})
</script>

<style lang="scss" scoped>
.video-player {
  width: 100%;
  height: 100%;
  background-color: #000;
}

:deep(video::-webkit-media-controls) {
  display: flex !important; /* 确保控制条显示 */
}
</style>
