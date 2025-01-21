<template>
  <div>
    <el-form
      ref="form"
      :model="sizeForm"
      label-width="auto"
      label-position="top"
      size="default"
    >
      <el-form-item label="所有者">
        <el-checkbox v-model="sizeForm.checked" size="large">
          <template #default>
            <div class="checkbox-content" style="display: flex;">
              <div class="mast-style">{{ mastStr }}</div>
              <span>{{ sizeForm.user }}</span>
            </div>
          </template>
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="sizeForm.userName"
          size="default"
          placeholder="输入姓名"
        />
      </el-form-item>
      <el-form-item label="文件夹">
        <el-input
          v-model="sizeForm.wenjian"
          size="default"
          placeholder="输入文件夹名称"
        />
      </el-form-item>
      <el-form-item label="最近浏览">
        <el-select v-model="sizeForm.liulan" class="m-2" placeholder="Select">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="sizeForm.type" class="m-2" placeholder="请选择类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const sizeForm = reactive({
  user: '张文文',
  liulan: '最近一天',
})

const mastStr = ref('文')

const options = ref([
  {
    value: '最近一天',
    label: '最近一天',
  },
])
</script>

<style lang="scss" scoped>
:deep(.el-input) {
  height: 28px;
  font-size: 12px;
}
:deep(.el-checkbox.el-checkbox--large) {
  height: 28px;
}

.checkbox-content{
  display: flex;
  justify-content: center;
  align-items: center;
}
.mast-style{
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 10px;
  background: #FAB663;
  text-align: center;
  line-height: 18px;
  margin-right: 9px;
  color: #FFFFFF;
}
</style>
