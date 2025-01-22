<template>
  <div style="height: 100%; display: flex">
    <leftTabs @handleNodeClick="handleNodeClick" />
    <div style="padding: 16px; width: 100%">
      <downloaded v-if="dataDefault == null || dataDefault == '我下载的'" />
      <uploaded v-if="dataDefault == '我上传的'" />
    </div>
  </div>
</template>

<script setup>
import leftTabs from './components/leftTabs.vue'
import uploaded from './components/uploaded.vue'
import downloaded from './components/downloaded.vue'
import { ref } from 'vue'

const dataDefault = ref('我上传的')

const handleNodeClick = (data) => {
  dataDefault.value = data
}
</script>

<style lang="scss" scoped></style>
