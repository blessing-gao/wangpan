<template>
  <div>
    <el-button plain>
      <img src="/assets/编组 4.png" alt="" />
    </el-button>
    <div class="tag-title">全部标签</div>
    <el-input
      style="margin-bottom: 16px"
      v-model="input"
      placeholder="请输入标签名称"
    >
      <template #append>
        <el-button v-if="input && input.trim() !== ''" @click="addTag">
          添加
        </el-button>
      </template>
    </el-input>
    <div>
      <el-tag
        v-for="item in tagList"
        :key="item"
        style="margin-right: 10px; margin-bottom: 10px"
        class="mx-1"
        type="info"
        effect="plain"
      >
        {{ item }}
      </el-tag>
    </div>

    <el-button class="detail-tag" link>
      <img style="width: 12px; margin-right: 9px;" src="/icons/垃圾桶.svg" alt="" />
      <span>删除标签</span>
    </el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')

const tagList = ref(['小提琴', '编辑器', '版本', '必填', '钢琴'])

const addTag = () => {
  tagList.value.push(input.value)
  input.value = ''
}
</script>

<style lang="scss" scoped>
.el-button {
  border: 0;
  padding: 0 !important;
}
:deep(.el-input-group--append > .el-input__wrapper) {
  background-color: #f4f5f7;
  box-shadow: none;
}
:deep(.el-input-group__append) {
  background-color: #f4f5f7;
  box-shadow: none;
}
:deep(.el-input-group__append .el-button) {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #c38f5d !important;
  letter-spacing: 0;
  font-weight: 400;
}

.tag-title {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #999999;
  letter-spacing: 0;
  font-weight: 400;
  margin-top: 16px;
  margin-bottom: 8px;
}

.detail-tag {
  margin-top: 19px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #999999 !important;
  letter-spacing: 0;
  font-weight: 400;
  display: flex;
  align-items: center;
}
</style>
