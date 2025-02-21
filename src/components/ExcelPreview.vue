<template>
  <vue-office-excel :src="file_path" style="width: 100%; height: 100%" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import VueOfficeExcel from '@vue-office/excel'
//引入相关样式
import '@vue-office/excel/lib/index.css'

const props = defineProps({
  file_path: {
    type: String,
    required: true,
  },
})

</script>
<style lang="scss" scoped>

</style>
