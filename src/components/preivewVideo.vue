<template>
  <videoPlay
    id="media"
    ref="videoRefs"
    class="video-player vjs-custom-skin"
    type="application/x-mpegURL"
    v-bind="playerOptions"
  />
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'

// import * as courseApi from '@/api/course/course-api'

import 'vue3-video-play/dist/style.css'
import { videoPlay } from 'vue3-video-play/dist'

const props = defineProps({
  content: {
    type: Object,
    default: () => {},
  },
  previewBoolean: {
    default: Boolean,
    default: true,
  },
})

let playerOptions = reactive({
  width: '100%', //播放器高度
  height: '100%', //播放器高度
  color: '#409eff', //主题色
  title: '', //视频名称
  // process.env.VUE_APP_STATIC_PREFIX +"/static/video/1759038606728617986/视频/视频.m3u8"
  muted: false, //静音
  src: '',
  webFullScreen: false,
  speedRate: ['0.75', '1.0', '1.25', '1.5', '2.0'], //播放倍速
  autoPlay: true, //自动播放
  loop: false, //循环播放
  mirror: false, //镜像画面
  ligthOff: false, //关灯模式
  volume: 0.3, //默认音量大小
  control: true, //是否显示控制
  controlBtns: [
    'audioTrack',
    'quality',
    'speedRate',
    'volume',
    'setting',
    'pip',
    'pageFullScreen',
    'fullScreen',
  ], //显示所有按钮,
})

const videoRefs = ref()
const getVideo = async () => {
  playerOptions.src =
    import.meta.env.VITE_STATIC_PREFIX +
    '/static/video/1759038606728617986/视频/视频.m3u8'
  // await courseApi
  //   .previewCourse(props.content.id)
  //   .then((res) => {
  //     if (res.code === 200) {
  //       playerOptions.src = process.env.VUE_APP_STATIC_PREFIX + res.data;
  //     }
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   });
}

onMounted(() => {
  getVideo()
})
</script>

<style lang="scss" scoped>
:deep(.video-js .vjs-big-play-button) {
  border-width: 3px;
  border-color: rgb(255, 255, 255);
  border-style: solid;
  border-radius: 50%;
  width: 70px;
  height: 60px;
  line-height: 50px;
  background-color: rgba(0, 0, 0, 0);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
