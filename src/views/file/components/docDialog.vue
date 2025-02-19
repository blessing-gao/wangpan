<template>
  <div>
    <el-dialog
      title="文件"
      v-model="docDialogVisible"
      width="540px"
      destroy-on-close
      @close="cancelDocDialog"
    >
      <el-form
        ref="fileForm"
        :model="docForm"
        :rules="{
          name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        }"
        label-position="left"
        label-width="100px"
        @submit.prevent
      >
        <el-form-item label="文件名称" prop="name">
          <el-input
            v-model="docForm.name"
            placeholder="请输入文件名称"
            @keyup.enter="createOrUpdateDoc"
          >
            <!-- <template #prepend v-if="currentParentFolder && currentParentFolder.parentId != 0">
              {{ currentParentFolder.uniqueKey }}
            </template> -->
            <template #append>.{{ suffixDocType }}</template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelDocDialog">取 消</el-button>
        <el-button
          style="
            background: #de3a05;
            border-radius: 4px;
            color: #fff;
            border: 0;
          "
          type="primary"
          @click.once="createOrUpdateDoc"
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

const docDialogVisible = ref(false)
const docForm = reactive({
  name: '',
})
const fileForm = ref(null)
const suffixDocType = ref(null)

const currentParentFolder = ref(null)

const handleEdit = (file, suffixDocType1) => {
  docDialogVisible.value = true
  suffixDocType.value = suffixDocType1
  currentParentFolder.value = file
  if (file) {
    docForm.name = file.name.split('.')[0]
  }
}

const createOrUpdateDoc = () => {
  fileForm.value.validate((valid) => {
    if (valid) {
      const name =
        suffixDocType.value === 'md'
          ? docForm.name + '.zip'
          : docForm.name + '.' + suffixDocType.value
      const uniqueKeyName =
        suffixDocType.value === 'md' ? `${docForm.name}.zip` : name
      const fileType = suffixDocType.value === 'md' ? 2 : 1
      const params = {
        spaceId: props.spaceId,
        directoryId:
          currentParentFolder.value.parentId != 0
            ? currentParentFolder.value.parentId
            : 0,
        name,
        fileType,
        uniqueKey:
          (currentParentFolder.value
            ? currentParentFolder.value.uniqueKey
            : '') +
          '/' +
          uniqueKeyName,
      }
      params.uniqueKey = currentParentFolder.value.uniqueKey
      params.id = currentParentFolder.value.id
      console.log(params)

      panApi
        .updateFile(params)
        .then((res) => {
          console.log(res)
          if (res.code == 0) {
            proxy.$modal.msgSuccess('重命名成功')
            cancelDocDialog()
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
  })
}

const emits = defineEmits(['onClose'])

const cancelDocDialog = () => {
  docDialogVisible.value = false
  docForm.name = ''
  suffixDocType.value = null
  currentParentFolder.value = null
  emits('onClose')
}

defineExpose({
  handleEdit,
})
</script>

<style lang="scss" scoped></style>
