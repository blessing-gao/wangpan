<template>
  <div class="collabora-preview">
    <iframe
        :src="content.path"
        frameborder="0"
        width="100%"
        height="100%"
        sandbox="allow-scripts allow-same-origin allow-forms"
        referrerpolicy="no-referrer"
    ></iframe>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  content: {
    type: Object,
    required: true,
    // Expects an object with at least a path property
  },
})
</script>

<style scoped>
.collabora-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
