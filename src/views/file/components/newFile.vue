<template>
  <div>
    <el-dropdown
      teleported
      :trigger="trigger"
      :placement="placement"
      @command="handleCommand"
    >
      <slot></slot>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="folder">
            <!-- <svg-icon name="color-file_type_folder" class="mr-2" /> -->
             <img src="/icons/文件管理.svg" style="margin-right: 12px;" >
            文件夹
          </el-dropdown-item>
          <!-- <el-dropdown-item command="txt" divided>
            文本文件
          </el-dropdown-item>
          <el-dropdown-item command="docx">
            word
          </el-dropdown-item>
          <el-dropdown-item command="xlsx">
            excel
          </el-dropdown-item>
          <el-dropdown-item command="pptx">
            ppt
          </el-dropdown-item>
          <el-dropdown-item command="md">
            超级文档
          </el-dropdown-item> -->
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
const props = defineProps({
  trigger: {
    type: String,
    default: 'click',
  },
  placement: {
    type: String,
    default: 'bottom',
  },
})

const emits = defineEmits(['onCommand'])

const handleCommand = (key) => {
  emits('onCommand', key)
}
</script>

<style lang="scss" scoped>
:deep(
  .el-dropdown-menu__item:not(.is-disabled):focus,
  .el-dropdown-menu__item:not(.is-disabled):hover
) {
  background-color: rgba(243, 232, 222, 0.5) !important;
  color: #de3a05;
}
</style>
