<template>
  <div class="image-preview">
    <el-image
        style="width: 100%; height: 95%; object-fit: contain"
        :src="content.path"
        :hide-on-click-modal="true"
        :preview-src-list="srcList"
        fit="contain"
        lazy
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  content: {
    type: Object,
    required: true,
    // Expects an object with at least a path property
  },
})

// Create a reactive array with the image path for preview functionality
const srcList = computed(() => [props.content.path])
</script>

<style scoped>
.image-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: #f5f5f5;
}
</style>
