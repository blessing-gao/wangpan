<template>
  <div>
    <el-form :model="form" label-position="left" label-width="120px">
      <el-form-item>
        <template #label>
          <div>大小：</div>
        </template>
        {{ form.size }}
      </el-form-item>
      <el-form-item label="创建人:">{{ form.updateBy }}</el-form-item>
      <el-form-item label="更新时间:">{{ form.updateTime }}</el-form-item>
      <el-form-item label="路径:"></el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import * as panApi from '@/api/pan.js'
import { ref, onMounted, nextTick } from 'vue'
const props = defineProps({
  documentId: {
    type: String,
    required: true,
  },
})

const form = ref({})

const getFileDetail = async () => {
  await panApi
    .providerOptions(props.documentId)
    .then((res) => {
      form.value = res.data
      form.value.size = formatSize(res.data.size)
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {})
}

const formatSize = (size) => {
  // 1 KB = 1024 bytes, 1 MB = 1024 KB, 1 GB = 1024 MB
  const KB = 1024
  const MB = KB * 1024
  const GB = MB * 1024
  const TB = GB * 1024

  // 根据字节数大小决定转换的单位
  if (size >= TB) {
    // 如果大于等于 1GB，转换为 GB
    return (size / TB).toFixed(2) + ' TB'
  } else if (size >= GB) {
    // 如果大于等于 1GB，转换为 GB
    return (size / GB).toFixed(2) + ' GB'
  } else if (size >= MB) {
    // 如果大于等于 1MB，转换为 MB
    return (size / MB).toFixed(2) + ' MB'
  } else if (size >= KB) {
    // 如果大于等于 1KB，转换为 KB
    return (size / KB).toFixed(2) + ' KB'
  } else {
    // 小于 1KB，显示为字节
    return size + ' bytes'
  }
}

onMounted(async () => {
  await nextTick()
  // await getFileDetail()
})

defineExpose({
  getFileDetail,
})
</script>

<style lang="scss" scoped>
.el-form-item {
  display: block;
}
</style>
