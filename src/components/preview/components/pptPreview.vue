<template>
  <div class="ppt-viewer">
    <!-- 错误提示 -->
    <div v-if="error" class="error">Error: {{ error }}</div>

    <!-- 幻灯片容器 -->
    <div v-else-if="slides.length > 0" class="slide-container">
      <!-- 当前幻灯片 -->
      <div class="slide-wrapper">
        <canvas ref="canvasRef"></canvas>
      </div>

      <!-- 导航控制 -->
      <div class="navigation">
        <button @click="currentPage--" :disabled="currentPage === 1">
          上一页
        </button>
        <span>Page {{ currentPage }} / {{ slides.length }}</span>
        <button
          @click="currentPage++"
          :disabled="currentPage === slides.length"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
// import pptx from 'pptxjs'

const props = defineProps({
  blobUrl: {
    type: String,
    required: true,
  },
})

const canvasRef = ref(null)
const loading = ref(false)
const error = ref('')
const slides = ref([])
const currentPage = ref(1)

// 解析 Blob
const parsePPT = async () => {
  try {
    loading.value = true

    // 1. 获取 Blob 数据
    const response = await fetch(props.blobUrl)
    const blob = await response.blob()
    // 2. 转换为 ArrayBuffer
    const arrayBuffer = await blob.arrayBuffer()
    // 3. 加载 PPT
    const deck = new pptx.Presentation()
    await deck.load(arrayBuffer)

    // 4. 提取幻灯片数据
    slides.value = deck.slides

    // 5. 渲染第一页
    renderSlide(slides.value[0])
  } catch (err) {
    error.value = err.message || 'Failed to load PPT'
  } finally {
    loading.value = false
  }
}

// 渲染单页幻灯片
const renderSlide = (slide) => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  // 设置画布尺寸（按 16:9 比例）
  canvas.width = 1280
  canvas.height = 720

  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 渲染幻灯片内容
  slide.shapes.forEach((shape) => {
    // 此处根据 shape 类型（文本/图片/形状）渲染
    // 示例：绘制一个矩形
    if (shape.type === 'rect') {
      ctx.fillStyle = shape.fill || '#FFFFFF'
      ctx.fillRect(shape.x, shape.y, shape.width, shape.height)
    }
    if (shape.type === 'image') {
      const img = new Image()
      img.src = shape.data
      img.onload = () => {
        ctx.drawImage(img, shape.x, shape.y, shape.width, shape.height)
      }
    }
  })
}

// 监听页码变化
watch(currentPage, (newPage) => {
  const slide = slides.value[newPage - 1]
  renderSlide(slide)
})

// 初始化解析
onMounted(() => {
  parsePPT()
})
</script>

<style scoped>
.ppt-viewer {
  max-width: 1280px;
  margin: 0 auto;
}

.slide-container {
  position: relative;
}

.slide-wrapper {
  background: #f0f0f0;
  border: 1px solid #ddd;
}

canvas {
  width: 100%;
  height: auto;
}

.navigation {
  margin-top: 1rem;
  text-align: center;
}

button {
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
}
</style>
