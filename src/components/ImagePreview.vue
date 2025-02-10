<template>
  <div class="image-preview">
    <el-image
      style="width: 100%; height: 100%; object-fit: contain"
      :src="content.path"
      fit="contain"
      lazy
    />
  </div>
</template>

<script setup>
defineProps({
  content: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.image-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px; /* 添加适当的内边距，避免图片靠近边缘 */
  box-sizing: border-box;
}
</style>
