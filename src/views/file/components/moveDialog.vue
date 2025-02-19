<template>
  <el-dialog
    title="移动文件"
    :model-value="visible"
    width="540px"
    destroy-on-close
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="{
        floder: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
      }"
      label-position="left"
      label-width="100px"
    >
      <el-form-item label="目标文件夹" prop="floder">
        <el-tree-select
          ref="treeRef"
          v-model="form.floder"
          node-key="id"
          lazy
          :load="loadFiles"
          :props="treeProps"
          check-strictly
          placeholder="请选择移动目标文件夹"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleMove">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
// import { getFileList } from '@/api/file'
import { reactive, ref, toRef, watch } from 'vue'
import * as panApi from '@/api/pan.js'
import { GET_USERID } from '@/utils/auth'

const translateFileList = (preKey, list) => {
  list.forEach((item) => {
    item.path = `${preKey}/${item.name}`
  })
  return list
}

const props = defineProps({
  visible: {
    type: Boolean,
    required: false,
  },
  spaceId: {
    type: String,
    required: '',
  },
  file: {
    type: Object,
    required: () => {},
  },
})

const emits = defineEmits(['onClose', 'ok'])

const treeProps = {
  key: 'id',
  value: 'id',
  label: 'name',
}

const fileParams = reactive({
  status: 1,
  name: '',
  userId: GET_USERID(),
})

const form = reactive({
  floder: '',
})

const floderList = ref([])

const loadFiles = (node, resolve) => {
  if (node.level === 0) {
    if (props.spaceId) {
      panApi.contentsList(props.spaceId, 0, fileParams).then((res) => {
        let folderList = res.data.filter((item) => item.fileType === 0)
        console.log(props.file.value.fileType)

        if (props.file.value.fileType === 0) {
          folderList = folderList.filter(
            (item) => item.id !== props.file.value.id,
          )
        }
        const fileList = translateFileList('', folderList)
        return resolve(fileList)
      })
    }
  } else {
    let file = node.data
    if (file.fileType === 0) {
      panApi.contentsList(props.spaceId, file.id, fileParams).then((res) => {
        let folderList = res.data.filter((item) => item.fileType === 0)
        if (props.file.value.fileType === 0) {
          folderList = folderList.filter(
            (item) => item.id !== props.file.value.id,
          )
        }
        const fileList = translateFileList(file.uniqueKey, folderList)
        return resolve(fileList)
      })
    } else {
      return resolve([])
    }
  }
}

const formRef = ref(null)
const treeRef = ref(null)

const handleMove = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      let id = form.floder
      let node = treeRef.value.getNode(id)
      console.log(node)
      emits('ok', node.data)
    } else {
      return false
    }
  })
}

const handleClose = () => {
  form.floder = ''
  floderList.value = []
  emits('onClose')
}
</script>
