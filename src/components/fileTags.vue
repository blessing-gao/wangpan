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
        :key="item.title"
        style="margin-right: 10px; margin-bottom: 10px"
        class="mx-1"
        type="info"
        :closable="item.closable"
        effect="plain"
        @close="handleClose(item)"
      >
        {{ item.title }}
      </el-tag>
    </div>

    <el-button class="detail-tag" link v-if="isRemove" @click="handleRemoveBtn">
      <img
        style="width: 12px; margin-right: 9px"
        src="/icons/垃圾桶.svg"
        alt=""
      />
      <span>删除标签</span>
    </el-button>
    <div v-if="!isRemove">
      <el-button class="remove-tag" link @click="handleAllRemove">
        全部删除
      </el-button>
      <el-button class="remove-tag" link @click="handleOk">确定</el-button>
      <el-button class="remove-tag" link @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance } from 'vue'
import * as detailApi from '@/api/detail.js'
const { proxy } = getCurrentInstance()

const input = ref('')

const tagList = ref(['小提琴', '编辑器', '版本', '必填', '钢琴'])

const handleTagList = () => {
  let params = {}
  detailApi
    .getTagData()
    .then((res) => {
      tagList.value = tagList.value.map((item) => {
        return {
          title: item,
          closable: false,
        }
      })
    })
    .catch((err) => {
      proxy.$modal.msgError(err.message)
    })
}

onMounted(() => {
  // handleTagList()
})

const addTag = () => {
  let params = {}
  detailApi
    .addTag(params)
    .then((res) => {
      tagList.value.push({
        title: input.value,
        closable: false,
      })
    })
    .catch((err) => {
      proxy.$modal.msgError(err.message)
    })
    .finallu(() => {
      input.value = ''
    })
}

const isRemove = ref(true)

const handleRemoveBtn = () => {
  isRemove.value = false
  tagList.value.forEach((item) => {
    item.closable = true
  })
}

const handleClose = (record) => {
  let params = {}
  detailApi
    .removeTag(params)
    .then((res) => {
      tagList.value.splice(record.item, 1)
    })
    .catch((err) => {
      proxy.$modal.msgError(err.message)
    })
}

// 全部删除
const handleAllRemove = () => {
  let params = {}
  detailApi
    .removeTag(params)
    .then((res) => {
      tagList.value = []
    })
    .catch((err) => {
      proxy.$modal.msgError(err.message)
    })
}

// 确定
const handleOk = () => {
  isRemove.value = true
}

// 取消
const handleCancel = () => {
  isRemove.value = true
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

.remove-tag {
  margin-top: 19px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #de3a05 !important;
  letter-spacing: 0;
  font-weight: 400;
}
</style>
