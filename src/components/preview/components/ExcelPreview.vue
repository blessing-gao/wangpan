<template>
  <div class="excel-preview">
    <vue-office-excel :src="file_path" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'

const props = defineProps({
  file_path: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.excel-preview {
  width: 100%;
  height: 100%;
}

:deep(.vue-office-excel) {
  width: 100%;
  height: 100%;
}
</style>
