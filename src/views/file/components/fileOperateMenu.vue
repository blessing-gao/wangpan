<template>
  <span @click.stop>
    <el-dropdown :placement="placement" trigger="click">
      <slot></slot>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="folder" v-if="file.fileType == 0">
            <CreateDropMenu
              :placement="placement"
              trigger="hover"
              key="subMenu"
              @onCommand="addFileAction"
            >
              <div class="custom-sub-menu-text">
                <span>新建</span>
                <el-icon><ArrowRight /></el-icon>
              </div>
            </CreateDropMenu>
          </el-dropdown-item>
          <el-dropdown-item command="folder" v-if="file.fileType == 0">
            <el-dropdown
              :placement="placement"
              trigger="hover"
              @command="handleSubCommand"
            >
              <div class="custom-sub-menu-text">
                <span>上传</span>
                <el-icon><ArrowRight /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="file">
                    <img src="/icons/文件.svg" style="margin-right: 12px" />
                    文件
                  </el-dropdown-item>
                  <!-- <el-dropdown-item command="mdFile">超级文档</el-dropdown-item> -->
                  <!-- <el-dropdown-item command="folder">文件夹</el-dropdown-item> -->
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-dropdown-item>
          <el-dropdown-item
            command="edit"
            @click="handleCommand('edit')"
            v-if="
              file.fileType !== 0 &&
              ifSupportFileExts() &&
              (listType == 'default' || listType == 'collect')
            "
          >
            预览
          </el-dropdown-item>
          <el-dropdown-item
            command="download"
            v-if="
              file.fileType !== 0 &&
              ifSupportFileExts() &&
              (listType == 'default' || listType == 'collect')
            "
            @click="handleCommand('download')"
          >
            下载
          </el-dropdown-item>
          <el-dropdown-item
            command="move"
            @click="handleCommand('move')"
            v-if="listType == 'default'"
          >
            移动
          </el-dropdown-item>
          <el-dropdown-item
            command="rename"
            @click="handleCommand('rename')"
            v-if="listType == 'default'"
          >
            重命名
          </el-dropdown-item>
          <el-dropdown-item
            command="remove"
            @click="handleCommand('remove')"
            v-if="listType == 'default'"
          >
            删除
          </el-dropdown-item>
          <el-dropdown-item
            command="restore"
            @click="handleCommand('restore')"
            v-if="listType == 'recycleBin'"
          >
            还原
          </el-dropdown-item>
          <el-dropdown-item
            command="completelyDelete"
            @click="handleCommand('completelyDelete')"
            v-if="listType == 'recycleBin'"
          >
            彻底删除
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </span>
</template>

<script setup>
import CreateDropMenu from './newFile.vue'
import { collaboraOnlineExts } from '@/enum'
import { ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  file: {
    type: Object,
    default: null,
  },
  placement: {
    type: String,
    default: 'left',
  },
  listType: {
    type: String,
    default: 'default',
  },
})

console.log(props.listType)

const ifSupportFileExts = () => {
  let exts = collaboraOnlineExts.map((item) => item.ext)
  if (props.file.name) {
    let fileExt = props.file.name.split('.').pop().toLowerCase()
    return exts.includes(fileExt)
  }
}

const emits = defineEmits(['onCommand'])
const addFileAction = (key) => {
  emits('onCommand', 'create', key, props.file)
}
const handleSubCommand = (key) => {
  emits('onCommand', 'upload', key, props.file)
}
const handleCommand = (key) => {
  emits('onCommand', 'self', key, props.file)
}

defineExpose({
  addFileAction,
  handleSubCommand,
  handleCommand,
})
</script>

<style lang="scss" scoped>
.custom-sub-menu-text {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 60px;
  line-height: 22px;

  i {
    margin-right: 0;
  }
}
:deep(
  .el-dropdown-menu__item:not(.is-disabled):focus,
  .el-dropdown-menu__item:not(.is-disabled):hover
) {
  background-color: rgba(243, 232, 222, 0.5) !important;
  color: #de3a05;
}

:deep(.el-dropdown-menu__item:focus, .el-dropdown-menu__item:hover) {
  background-color: rgba(243, 232, 222, 0.5) !important;
  color: #de3a05;
}
</style>
