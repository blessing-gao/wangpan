<template>
  <div>
    <el-dialog
      v-model="importMdDialogVisible"
      title="上传文档"
      width="640px"
      :style="{ '--el-dialog-border-radius': '8px' }"
    >
      <ul class="list-none flex pa-0 color-#262626">
        <li
          @click="handleShowUpload('mdFile', currentFolderOrFile)"
          class="cursor-pointer flex flex-col flex-items-center w-142px"
        >
          <!-- <svg-icon class="font-size-70px" name="color-export_type_md" /> -->
          <span>Markdown</span>
          <span class="font-size-12px color-#8a8f8d">.md</span>
        </li>
        <li
          @click="handleShowUpload('mdNotion', currentFolderOrFile)"
          class="cursor-pointer flex flex-col flex-items-center w-142px"
        >
          <div class="h-70px w-70px flex flex-items-center flex-justify-center">
            <!-- <svg-icon
              class="font-size-50px color-#77757C"
              name="color-file_type_superdoc"
            /> -->
          </div>
          <span>超级文档</span>
          <span class="font-size-12px color-#8a8f8d">.zip</span>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const importMdDialogVisible = ref(false)

const currentFolderOrFile = ref(null)

const handleEdit = (file) => {
  importMdDialogVisible.value = true
  currentFolderOrFile.value = file
}

const emits = defineEmits(['handleShowUpload'])

const handleShowUpload = (type, currentFolderOrFile) => {
  emits('handleShowUpload', type, currentFolderOrFile)
}

defineExpose({
  handleEdit,
})
</script>

<style lang="scss" scoped>
@import '../../../styles/components/fileIndex.css';
</style>
