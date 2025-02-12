<template>
  <div>
    <el-dialog
      title="文件夹"
      v-model="folderDialogVisible"
      width="540px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="folderForm"
        :rules="{
          name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        }"
        label-position="left"
        label-width="100px"
        @submit.prevent
      >
        <el-form-item label="文件夹名称" prop="name">
          <el-input
            v-model="folderForm.name"
            placeholder="请输入文件夹名称"
            @keyup.enter="createOrUpdateFolder"
          >
            <template
              #prepend
              v-if="currentParentFolder && currentParentFolder.parentId != 0"
            >
              {{ currentParentFolder.uniqueKey }}
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="hanldeClose">取 消</el-button>
        <el-button
          style="background: #de3a05; border-radius: 4px; color: #fff; border: 0;"
          type="primary"
          @click="createOrUpdateFolder"
        >
          确 定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance } from 'vue'
import * as panApi from '@/api/pan.js'
const { proxy } = getCurrentInstance()

const props = defineProps({
  spaceId: {
    type: String,
    required: '',
  },
})

const folderDialogVisible = ref(false)

const folderForm = reactive({
  name: '',
})

const states = ref(null)

const handleEdit = (states1, type) => {
  folderDialogVisible.value = true
  states.value = states1
  currentParentFolder.value = type
}

const currentParentFolder = ref(null)

const formRef = ref(null)
const createOrUpdateFolder = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const params = {
        name: folderForm.name,
        spaceId: props.spaceId,
        uniqueKey:
          (currentParentFolder.value
            ? currentParentFolder.value.uniqueKey
            : '') +
          '/' +
          folderForm.name,
        description: '',
      }
      if (states.value == 'create') {
        params.parentId = currentParentFolder.value
          ? currentParentFolder.value.id
          : 0
        panApi
          .createFolder(params)
          .then((res) => {
            if (res.code == 0) {
              proxy.$modal.msgSuccess('新建文件夹成功')
              hanldeClose('create')
            }
          })
          .catch((err) => {
            console.error(err)
          })
      } else {
        params.parentId =
          currentParentFolder.value.parentId == 0
            ? 0
            : currentParentFolder.value.parentId
        params.uniqueKey = currentParentFolder.value.uniqueKey
        params.id = currentParentFolder.value.id
        console.log(params)
        panApi
          .updateFolder(params)
          .then((res) => {
            console.log(res)
            if (res.code == 0) {
              proxy.$modal.msgSuccess('重命名成功')
              hanldeClose('update')
            }
          })
          .catch((err) => {
            proxy.$modal.msgWarning(err.response.data.msg)
          })
      }
    } else {
      return false
    }
  })
}

const emits = defineEmits(['onClose'])
const hanldeClose = (types) => {
  folderDialogVisible.value = false
  folderForm.name = ''
  emits(
    'onclose',
    currentParentFolder.value ? currentParentFolder.value.id : 0,
    types,
  )
  currentParentFolder.value = null
}

defineExpose({
  handleEdit,
})
</script>

<style lang="scss" scoped></style>
