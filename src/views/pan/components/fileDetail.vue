<template>
  <div>
    <el-dialog
      v-model="centerDialogVisible"
      width="32%"
      align-center
      :show-close="false"
    >
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>详细信息</span>
            <el-icon style="cursor: pointer;" @click="handleClose"><Close size="16" /></el-icon>
          </div>
        </template>
        <div class="title">
          <img
            style="width: 24px; margin-right: 10px"
            src="/icons/文件管理.svg"
            alt=""
          />
          <div>{{ formItem.fileName }}</div>
        </div>
        <el-form :model="formItem" label-width="120px" label-position="left">
          <el-form-item label="类型">
            {{ formItem.type }}
          </el-form-item>
          <el-form-item label="位置">
            {{ formItem.filePath }}
          </el-form-item>
          <el-form-item label="大小">
            {{ formItem.size }}
          </el-form-item>
          <el-form-item label="包含">
            {{ formItem.content }}
          </el-form-item>
          <el-form-item label="创建时间">
            {{ formItem.createTime }}
          </el-form-item>
          <el-form-item label="修改时间">
            {{ formItem.modifiedTime }}
          </el-form-item>
          <el-form-item label="文件标签">
            <!-- {{ formItem.tags }} -->
            <el-tag
              v-for="item in formItem.tags.split(',')"
              :key="item"
              class="mx-1"
              effect="plain"
              type="info"
              style="margin-right: 10px"
            >
              {{ item }}
            </el-tag>
          </el-form-item>
          <el-form-item label="扫描状态">
            {{ formItem.scanStatus }}
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Close } from '@element-plus/icons-vue'

const centerDialogVisible = ref(false)
const formItem = ref({})

const handleEdit = (rows) => {
  centerDialogVisible.value = true
  formItem.value = {
    fileName: '浙江音乐学院校小提琴演出现场',
    type: '文件夹',
    filePath: '个人资源',
    size: '49.48',
    content: '2个文件夹、17个文件',
    createTime: '2024年2月16日 17:00',
    modifiedTime: '2024年2月16日 17:00',
    tags: '小提琴,编辑器,版本',
    scanStatus: '已完成',
  }
}

const handleClose = () => {
    centerDialogVisible.value = false
}

defineExpose({
  handleEdit,
})
</script>

<style lang="scss" scoped>
.detail-title {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
  font-weight: 500;
}

:deep(.el-dialog__header) {
  padding: 0;
}

:deep(.el-dialog) {
  padding: 0 !important;
}

.title {
  display: flex;
  align-items: center;
  margin-bottom: 22px;
}

:deep(.el-form-item) {
  margin-bottom: 0px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item {
  margin-bottom: 18px;
}

</style>
