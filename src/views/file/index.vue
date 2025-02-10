<template>
  <div style="height: 100%; display: flex">
    <leftTabs @handleNodeClick="handleNodeClick" />
    <!-- 详细表格信息 -->
    <!-- :pageSize="formInline.pageSize"
      :currentPage="formInline.currentPage"
      @turnSize="turnSize"
      :changePage="changePage"
      :total="total"
      -->
    <div style="padding: 16px; width: 100%">
      <vTableCustom
        style="width: 100%"
        ref="table_ref"
        :tableHead="false"
        :border="false"
        :loading="loading"
        :columns="columns"
        :tableData="tableData"
        :rowKey="rowKey"
        :hasPagination="false"
        :enableSelection="true"
        :tableRowClassName="rowClassName"
        @handleSelectionChange="handleSelectionChange"
        @handleRowMouseEnter="handleRowMouseEnter"
        @handleRowMouseLeave="handleRowMouseLeave"
      >
        <template #toolbarBtn>
          <div v-if="selectedRows.length == 0">
            <el-popover
              placement="bottom-start"
              :width="108"
              style="padding: 8px 0"
              trigger="hover"
            >
              <template #reference>
                <el-button
                  style="background: #de3a05; border-radius: 4px; color: #fff"
                >
                  上传
                </el-button>
              </template>
              <div class="organization-content" @click="uploadFolder">
                <img
                  src="/icons/文件管理.svg"
                  style="margin-right: 12px; width: 16px"
                />
                上传文件夹
              </div>
              <div class="organization-content" @click="handleUploadFile">
                <img
                  src="/icons/文件.svg"
                  style="margin-right: 12px; width: 16px"
                />
                上传文件
              </div>
            </el-popover>

            <el-button @click="createDict">新建文件夹</el-button>
          </div>
          <div v-else class="isCheckedNumber-style">
            <el-checkbox
              v-model="isCheckedNumber"
              :label="checkedNumber"
              size="large"
              disabled
              style="margin-right: 28px"
            />
            <el-button>批量下载</el-button>
            <el-button>批量删除</el-button>
          </div>
          <div class="table-top">
            <div class="table-top-title">
              <el-button link @click="clickFile">根目录</el-button>
              <el-button v-if="isLevelText" link>{{}}</el-button>
            </div>
            <div class="table-top-right">
              <el-select
                class="m-2"
                placeholder="请选择状态"
                style="width: 120px"
                v-model="status"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-button style="margin-left: 12px">
                <img style="width: 14px" src="/icons/Vector.svg" />
              </el-button>
              <el-button>
                <img style="width: 14px" src="/icons/Menu 04.svg" />
              </el-button>
            </div>
          </div>
        </template>

        <template #fileName="{ rows }">
          <div class="file-name" @click="hanldeRowClick(rows)">
            <div class="file-name_left">
              <!-- <img
                style="width: 24px; margin-right: 10px"
                src="/icons/文件管理.svg"
              /> -->
              <img
                style="width: 24px; margin-right: 10px"
                :src="
                  fileTypeIcon(
                    rows.fileType === 2
                      ? rows.name.replace('zip', 'md')
                      : rows.name,
                  )
                "
              />
              <span style="margin-right: 10px">{{ rows.name }}</span>
              <el-tag class="ml-2" type="warning" size="small">标签</el-tag>
            </div>
          </div>
        </template>

        <template #operation="{ rows }">
          <div class="file-name_right">
            <!-- v-show="!rows.isHovered" -->
            <!-- v-show="rows.isHovered" -->
            <img class="file-name_right-img" src="/icons/FolderDown.svg" />
            <img
              class="file-name_right-img"
              src="/icons/FolderDown-hover.svg"
            />
            <img class="file-name_right-img" src="/icons/常用文件.svg" />

            <fileOperateMenu
              class="file-name_right-img"
              :file="rows"
              @onCommand="handleFileOperate"
            >
              <img src="/icons/more_horiz.svg" />
            </fileOperateMenu>
          </div>
        </template>
      </vTableCustom>
    </div>
    <fileDetail ref="fileDetailRefs" />
    <uploadFileVue
      ref="uploadFileRefs"
      :maxSize="docMaxSize"
      :visible="uploadDialogVisible"
      :demand="uploadDemandFile"
      @ok="uploadFiles"
      @close="handleClose"
    />
    <mdDialog ref="mdDialogRefs" @handleShowUpload="handleShowUpload" />
    <moveDialog
      ref="moveDialogRefs"
      :visible="moveDialogVisible"
      :spaceId="spaceId"
      :file="curretnOperateFolderOrFile"
      @ok="handleMoveFolderOrFile"
      @onClose="handleClose"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, reactive } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import leftTabs from './components/leftTabs.vue'
import vTableCustom from '@/components/TableCustom/index.vue'
import fileDetail from './components/fileDetail.vue'
import { columns } from './components/Columns.js'
import * as panApi from '@/api/pan.js'
import uploadFileVue from './components/uploadFile.vue'
import { fileTypeIcon, collaboraOnlineExts, compressedExts } from '@/enum'
import fileOperateMenu from './components/fileOperateMenu.vue'
import mdDialog from './components/mdDialog.vue'
import moveDialog from './components/moveDialog.vue'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const options = [
  {
    value: 'Option111111',
    label: 'Option111111',
  },
  {
    value: 'Option222222',
    label: 'Option222222',
  },
]

const loading = ref(false)

const tableData = ref([])

const status = ref(null)

const docMaxSize = ref('0')
const uploadDialogVisible = ref(false)
const moveDialogVisible = ref(false)

// 获取spaceId
const spaceId = ref('')
const getSpaceId = async () => {
  const proId = route.query.proId
  const result = await panApi.getSpaceIdByProdId(proId)
  spaceId.value = result.data
}

const getMaxSize = async () => {
  const result = await panApi.getDocMaxSize()
  docMaxSize.value = result.data
}

const fileId = ref(0)

const getTableData = () => {
  loading.value = true
  let params = {
    current: 1,
    size: 500,
    status: 1,
    name: '',
  }
  panApi
    .contentsList(spaceId.value, fileId.value, params)
    .then((res) => {
      tableData.value = res.data
    })
    .catch((err) => {
      proxy.$modal.msgError(err.message)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(async () => {
  await getSpaceId()
  await getMaxSize()
  getTableData()
})

const rowKey = ref('id')

const checkedNumber = ref('')
const isCheckedNumber = ref(true)
const selectedRows = ref([])

const handleSelectionChange = (selection) => {
  selectedRows.value = selection.map((item) => {
    return item.fileName
  })
  checkedNumber.value = `已选 ${selectedRows.value.length} 项`
}

const rowClassName = ({ row }) => {
  let color = ''
  // 如果当前行在选中的行中，添加背景色
  if (selectedRows.value.includes(row.fileName)) {
    color = 'selected-row'
  }
  return color
}

const handleRowMouseEnter = (column) => {
  column['isHovered'] = true
}

const handleRowMouseLeave = (column) => {
  // console.log(selectedRows.value, column)
  if (selectedRows.value.indexOf(column.fileName) != -1) {
    column['isHovered'] = true
  } else {
    column['isHovered'] = false
  }
}

// 是否显示二级文件名称
const isLevelText = ref(false)

const isCompressedFile = (file) => {
  const ext = file.split('.').pop().toLowerCase()
  if (compressedExts.includes(ext)) {
    return true
  }
  return false
}

const translateFileList = (preKey, list) => {
  list.forEach((item) => {
    item.path = `${preKey}/${item.name}`
  })
  return list
}

// 当前选中查看的文件夹或文件
const currentFolderOrFile = ref(null)

const hanldeRowClick = (column) => {
  isLevelText.value = true
  if (column.fileType === 0) {
    fileId.value = column.id
    getTableData()
  } else {
    const exts = collaboraOnlineExts.map((item) => item.ext)
    const fileExt = column.name.split('.').pop().toLowerCase()
    if (exts.includes(fileExt)) {
      router.push({
        name: 'VideoDetail',
        query: {
          id: column.id,
        },
      })
    } else if (['md'].includes(fileExt) || file.fileType === 2) {
      currentFile.value = file
      currentFolderOrFile.value = file
    } else {
      if (isCompressedFile(file.name)) {
        ElMessageBox.alert('不支持查看压缩文件', '提示', {
          confirmButtonText: '下载',
          autofocus: false,
          type: 'warning',
        }).then(() => {
          downloadFiles(file.id)
        })
      } else {
        proxy.$modal.msgWarning('暂不支持预览该文件格式')
      }
    }
  }
}

// 下载文档
const downloadFiles = (id) => {
  panApi.downloadFile(id).then((res) => {
    let blob = new Blob([res.data])
    let _fileNames = res.headers['content-disposition']
      .split(';')[1]
      .split('=')[1]
      .split('.')
    _fileNames[0] = decodeURI(_fileNames[0])
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = _fileNames.join('.')
    link.click()
    window.URL.revokeObjectURL(link.href)
  })
}

const clickFile = () => {
  isLevelText.value = false
  fileId.value = 0
  getTableData()
}

const fileDetailRefs = ref(null)

const handleDetail = (rows) => {
  fileDetailRefs.value.handleEdit(rows)
}

const createDict = () => {}

const handleNodeClick = (data, node) => {
  if (data.fileType === 0) {
    fileId.value = data.id
    getTableData()
  } else {
    // 如果不是文件类型，需要跳转预览

    const exts = collaboraOnlineExts.map((item) => item.ext)
    const fileExt = data.name.split('.').pop().toLowerCase()
    if (exts.includes(fileExt)) {
      console.log(111)
    }
  }
}

const uploadFileRefs = ref(null)

// 上传文件夹
const uploadFolder = () => {
  // uploadFileRefs.value.handleEdit('folder')
}

// 上传文件
const handleUploadFile = () => {
  // uploadFileRefs.value.handleEdit('file')
}

const handleDelete = () => {
  let params = {}
  panApi
    .deleteFile(params)
    .then((res) => {
      console.log(res)
      getTableData()
    })
    .catch((err) => {
      console.log(err)
    })
}

const mdDialogRefs = ref(null)
// 当前点击更多操作时选中的文件对象
const curretnOperateFolderOrFile = reactive({})

// file tree 和 file table中点击更多对应的操作
const handleFileOperate = (type, operate, file) => {
  console.log(type, operate, file)
  if (type === 'create') {
    // this.addFileAction(operate, file)
  } else if (type === 'upload') {
    if (operate === 'mdFile') {
      mdDialogRefs.value.handleEdit(currentFolderOrFile.value)
    } else {
      handleShowUpload(operate, file)
    }
  } else {
    curretnOperateFolderOrFile.value = file
    if (operate === 'edit') {
      // this.folderOrFileClick(file)
    }
    if (operate === 'rename') {
      // this.handleShowRename(file)
    }
    if (operate === 'remove') {
      // this.showDeleteDialog(file)
    }
    if (operate === 'move') {
      moveDialogVisible.value = true
    }
    if (operate === 'download') {
      // this.downloadFiles(file.id)
    }
  }
}

// 创建或上传文件(夹)的父文件夹对象
const currentParentFolder = ref(null)

const uploadParams = reactive({
  spaceId: '',
  fileType: 1,
  directoryId: 0,
  uniqueKey: '',
})

// 收否上传需求文档
const uploadDemandFile = ref(false)
//是否上传md Notion文档
const importMdNotion = ref(false)
//是否上传md 文档
const importMdFile = ref(false)
const importMdDialogVisible = ref(false)
const currentFile = ref(null)

// 点击显示上传文件弹窗
const handleShowUpload = (type, file, demand) => {
  if (file) {
    currentParentFolder.value = file
    uploadParams.directoryId = file.id
    uploadParams.uniqueKey = file.uniqueKey
  } else {
    currentParentFolder.value = null
    uploadParams.directoryId = 0
    uploadParams.uniqueKey = ''
  }
  uploadDemandFile.value = demand ? demand : false
  importMdNotion.value = ['mdNotion', 'mdFile'].includes(type)
  importMdFile.value = type === 'mdFile'
  uploadDialogVisible.value = true
}

const handleClose = () => {
  uploadDialogVisible.value = false
  importMdDialogVisible.value = false
  moveDialogVisible.value = false
}

// 是否支持编辑文档
const supportEditDoc = ref(false)

// 上传文件
const uploadFiles = async (fileList) => {
  let formData = new FormData()
  formData.append('demand', uploadDemandFile.value)
  formData.append('spaceId', spaceId.value)
  formData.append('directoryId', uploadParams.directoryId)
  formData.append('fileType', importMdNotion.value ? 2 : uploadParams.fileType)
  console.log(importMdFile.value)

  if (importMdFile.value) {
    // for (const { raw } of fileList) {
    //   const schema = new Schema() //创建新模式
    //   schema.register(AffineSchemas) //注册系统默认模块
    //   const workspace = new Workspace({ id: 'foo', schema }) //创建新工作区
    //   const page = await createPage(workspace)
    //   const rootId = page.root?.id
    //   const file = raw
    //   if (!file) continue
    //   const text = await file.text()
    //   const contentParser = new ContentParser(page)
    //   await contentParser.importMarkdown(text, rootId)
    //   const blob = await ZipTransformer.exportPages(workspace, [page])
    //   let _file = new File([blob], file.name.replace('.md', '.zip'), {
    //     type: blob.type,
    //   })
    //   formData.append('files', _file)
    // }
  } else {
    fileList.forEach((file) => {
      formData.append('files', file.raw)
    })
  }

  panApi.uploadFile(formData).then((res) => {
    if (res.code === 0) {
      uploadDialogVisible.value = false
      importMdDialogVisible.value = false
      proxy.$modal.msgSuccess('上传成功')

      const exts = collaboraOnlineExts.map((item) => item.ext)
      const fileExt = res.data.name.split('.').pop().toLowerCase()
      if (exts.includes(fileExt)) {
        const action = collaboraOnlineExts.find(
          (item) => item.ext === fileExt,
        ).action
        supportEditDoc.value = action === 'edit'
        currentFile.value = res.data
        currentFolderOrFile.value = res.data
      } else if (['md'].includes(fileExt) || res.data.fileType === 2) {
        currentFile.value = res.data
        currentFolderOrFile.value = res.data
      } else {
        currentFolderOrFile.value = currentFolderOrFile.value
        proxy.$modal.msgWarning('暂不支持预览该文件格式')
      }
    } else {
      proxy.$modal.msgWarning(res.msg)
    }
  })
}

// 移动文件夹或文件
const handleMoveFolderOrFile = (targetFolder) => {
  console.log(curretnOperateFolderOrFile.value)
  // 移动文件夹
  if (curretnOperateFolderOrFile.value.fileType === 0) {
    const params = {
      ...curretnOperateFolderOrFile.value,
      parentId: targetFolder.id,
      spaceId: spaceId.value,
    }
    console.log(params);
    
    // updateFolder(params).then((res) => {
    //   if (res.code === 0) {
    //     this.$message.success('移动成功！')
    //     this.moveDialogVisible = false
    //     this.$refs.fileTree.remove(this.curretnOperateFolderOrFile.id)
    //     this.expandAndFocusFolder(targetFolder)
    //     this.curretnOperateFolderOrFile = null
    //   } else {
    //     this.$message.warn(res.msg)
    //     this.moveDialogVisible = false
    //   }
    // })
  } else {
    const params = {
      ...curretnOperateFolderOrFile.value,
      directoryId: targetFolder.id,
      spaceId: spaceId.value,
      fileType: curretnOperateFolderOrFile.value.fileType === 2 ? 2 : 1,
    }
    console.log(params);
    
    // // 移动文件
    // updateFile(params).then((res) => {
    //   if (res.code === 0) {
    //     this.$message.success('移动成功！')
    //     this.moveDialogVisible = false
    //     this.$refs.fileTree.remove(this.curretnOperateFolderOrFile.id)
    //     this.expandAndFocusFolder(targetFolder)
    //     this.showDocPreview = false
    //     this.showMdPreview = false
    //     this.editDoc = false
    //     this.currentFile = null
    //     this.curretnOperateFolderOrFile = null
    //   } else {
    //     this.$message.warn(res.msg)
    //     this.moveDialogVisible = false
    //   }
    // })
  }
}
</script>
<style lang="scss" scoped>
@import '../../styles/components/fileIndex.css';

.more-operate {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 6px;
  outline: none;
  opacity: 0;

  &.show {
    opacity: 1;
  }

  &:hover {
    background-color: #fcfcfc;
  }
}
</style>
