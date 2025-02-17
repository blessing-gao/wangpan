<template>
  <div style="height: 100%; display: flex">
    <leftTabs ref="leftTabsRefs" @handleNodeClick="handleNodeClick" />
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
              <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item @click="clickFile()">
                  根目录
                </el-breadcrumb-item>
                <div v-if="isLevelText" style="display: flex">
                  <el-breadcrumb-item
                    v-for="item in tabList"
                    :key="item.id"
                    @click="clickFile(item)"
                  >
                    {{ item.name }}
                  </el-breadcrumb-item>
                </div>

                <!-- <el-breadcrumb-item>promotion list</el-breadcrumb-item>
                <el-breadcrumb-item>promotion detail</el-breadcrumb-item> -->
              </el-breadcrumb>
              <!-- <el-button link @click="clickFile()">根目录</el-button>
              <div v-if="isLevelText" style="display: flex">
                <el-button
                  v-for="item in tabList"
                  :key="item.id"
                  link
                  @click="clickFile(item)"
                >
                  {{ item.name }}
                </el-button>
              </div> -->
            </div>
            <div class="table-top-right">
              <el-select
                class="m-2"
                placeholder="请选择类型"
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
            <!-- <img class="file-name_right-img" src="/icons/FolderDown.svg" />
            <img
              class="file-name_right-img"
              src="/icons/FolderDown-hover.svg"
            />
            <img class="file-name_right-img" src="/icons/常用文件.svg" /> -->

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
      :demand="uploadDemandFile"
      :spaceId="spaceId"
      :uploadParams="uploadParams"
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
    <folderDialog
      ref="folderDialogRefs"
      :spaceId="spaceId"
      @onclose="folderClose"
    />
    <docDialog ref="docDialogRefs" :spaceId="spaceId" @onClose="folderClose" />
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, reactive } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { SET_PACEID, GET_PACEID } from '@/utils/auth'
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
import folderDialog from './components/folderDialog.vue'
import docDialog from './components/docDialog.vue'

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

const getProId = () => {
  let proId = route.query.spaceId || GET_PACEID()
  return proId || 233 // 如果proId为空则返回默认值233
}

// 获取spaceId
const spaceId = ref('')
const getSpaceId = async () => {
  const proId = getProId()
  SET_PACEID(proId)
  const result = await panApi.getSpaceIdByProdId(proId)
  spaceId.value = result.data
}

// 获取spaceId列表
const getSpaceIdList = () => {}

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
  console.log(spaceId.value, fileId.value)

  panApi
    .contentsList(spaceId.value, fileId.value, params)
    .then((res) => {
      tableData.value = res.data
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(async () => {
  await getSpaceId()
  await getMaxSize()
  leftTabsRefs.value.getLeftTabs(spaceId.value)
  getTableData()
})

const rowKey = ref('id')

const checkedNumber = ref('')
const isCheckedNumber = ref(true)
const selectedRows = ref([])

const handleSelectionChange = (selection) => {
  selectedRows.value = selection.map((item) => {
    return item.name
  })
  checkedNumber.value = `已选 ${selectedRows.value.length} 项`
}

const rowClassName = ({ row }) => {
  let color = ''
  // 如果当前行在选中的行中，添加背景色
  if (selectedRows.value.includes(row.name)) {
    color = 'selected-row'
  }
  return color
}

const handleRowMouseEnter = (column) => {
  column['isHovered'] = true
}

const handleRowMouseLeave = (column) => {
  // console.log(selectedRows.value, column)
  if (selectedRows.value.indexOf(column.name) != -1) {
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

// 当前选中查看的文件夹或文件
const currentFolderOrFile = ref(null)
// 用于判断是否是根目录，如果不是，上传文件或文件夹时需要添加父级
const isFolder = ref(null)
// 用于面包屑展示路径，需要name和id
const tabList = ref([])

const hanldeRowClick = (column) => {
  isLevelText.value = true
  if (column.fileType === 0) {
    fileId.value = column.id
    uploadParams.directoryId = column.id
    uploadParams.uniqueKey = column.uniqueKey
    tabList.value.push(column)
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

const clickFile = (folder) => {
  if (!folder) {
    isLevelText.value = false
    fileId.value = 0
    tabList.value = []
  } else {
    isLevelText.value = true
    fileId.value = folder.id
    console.log(tabList.value)
    tabList.value = tabList.value.filter((item) => item.parentId !== folder.id)
  }

  getTableData()
}

const fileDetailRefs = ref(null)

const handleDetail = (rows) => {
  fileDetailRefs.value.handleEdit(rows)
}

const folderDialogRefs = ref(null)
const createDict = () => {
  folderDialogRefs.value.handleEdit('create')
}

const handleNodeClick = (data, node) => {
  if (data.fileType === 0) {
    fileId.value = data.id
    getTableData()
  } else {
    // 如果不是文件类型，需要跳转预览
    const exts = collaboraOnlineExts.map((item) => item.ext)
    const fileExt = data.name.split('.').pop().toLowerCase()
    if (exts.includes(fileExt)) {
      router.push({
        name: 'VideoDetail',
        query: {
          id: data.id,
        },
      })
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
  uploadFileRefs.value.handleEdit('file', isFolder.value)
}

const mdDialogRefs = ref(null)
// 当前点击更多操作时选中的文件对象
const curretnOperateFolderOrFile = reactive({})

// file tree 和 file table中点击更多对应的操作
const handleFileOperate = (type, operate, file) => {
  if (type === 'create') {
    if (operate == 'folder') {
      folderDialogRefs.value.handleEdit('create', file)
    }
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
      router.push({
        name: 'VideoDetail',
        query: {
          id: file.id,
        },
      })
    }
    if (operate === 'rename') {
      handleShowRename(file)
    }
    if (operate === 'remove') {
      showDeleteDialog(file)
    }
    if (operate === 'move') {
      moveDialogVisible.value = true
    }
    if (operate === 'download') {
      downloadFiles(file.id)
    }
  }
}

// 下载文档
const downloadFiles = (id) => {
  panApi
    .downloadFile(id)
    .then((res) => {
      let blob = new Blob([res.data])
      let _fileNames = res.headers['content-disposition']
        .split(';')[1]
        .split('=')[1]
        .trim()
        .replace(/"/g, '')
        .split('.')
      _fileNames[0] = decodeURI(_fileNames[0])
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = _fileNames.join('.')
      link.click()
      window.URL.revokeObjectURL(link.href)
    })
    .catch((err) => {
      console.log(err)
    })
}

const docDialogRefs = ref(null)

// 点击显示对应的重命名Dialog
const handleShowRename = (file) => {
  curretnOperateFolderOrFile.value = file
  if (file.fileType === 0) {
    console.log(222)

    folderDialogRefs.value.handleEdit('update', file)
  } else if (file.fileType === 2) {
    // this.suffixDocType = 'md'
    // this.docDialogVisible = true
    // this.docForm.name = ''
  } else {
    let suffixDocType = file.name.substring(file.name.lastIndexOf('.') + 1)
    docDialogRefs.value.handleEdit(file, suffixDocType)
  }
}

// 显示删除文件弹窗确认框
const showDeleteDialog = (file) => {
  const name = file.fileType === 2 ? file.name.replace('zip', 'md') : file.name
  ElMessageBox.confirm(
    `确认删除文件${file.fileType === 0 ? '夹' : ''}${name}`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  ).then(() => {
    // 删除文件夹或者文件
    if (file.fileType === 0) {
      panApi
        .deleteFolder(file.id)
        .then((res) => {
          if (res.code == 0) {
            proxy.$modal.msgSuccess('删除成功')
            if (file.parentId == 0) {
              fileId.value = 0
            } else {
              fileId.value = file.parentId
            }
            getTableData()
            leftTabsRefs.value.getLeftTabs(spaceId.value)
          }
        })
        .catch((err) => {
          console.error(err)
        })
    } else {
      const params = {
        documentId: file.id,
      }
      panApi
        .deleteFile(params)
        .then((res) => {
          if (res.code == 0) {
            proxy.$modal.msgSuccess('删除成功')
            if (file.parentId == 0) {
              fileId.value = 0
            } else {
              fileId.value = file.parentId
            }
            getTableData()
            leftTabsRefs.value.getLeftTabs(spaceId.value)
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
  })
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
  uploadFileRefs.value.handleEdit('file', currentParentFolder.value)
}

const handleClose = () => {
  uploadDialogVisible.value = false
  importMdDialogVisible.value = false
  moveDialogVisible.value = false
  isFolder.value = null
  uploadParams.directoryId = 0
  uploadParams.uniqueKey = ''
  getTableData()
  leftTabsRefs.value.getLeftTabs(spaceId.value)
}

// 上传文件
const uploadFiles = async () => {
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
    if (currentParentFolder.value) {
      fileId.value = currentParentFolder.value.id
    } else {
      fileId.value = 0
    }

    getTableData()
    // 还需要调用左侧tab的查询接口
    leftTabsRefs.value.getLeftTabs(spaceId.value)
  }
}

const leftTabsRefs = ref(null)

// 移动文件夹或文件
const handleMoveFolderOrFile = (targetFolder) => {
  // 移动文件夹
  if (curretnOperateFolderOrFile.value.fileType === 0) {
    const params = {
      ...curretnOperateFolderOrFile.value,
      parentId: targetFolder.id,
      spaceId: spaceId.value,
    }
    panApi
      .updateFolder(params)
      .then((res) => {
        console.log(res)
        if (res.code == 0) {
          proxy.$modal.msgSuccess('移动成功')
          getTableData()
          // 还需要调用左侧tab的查询接口
          leftTabsRefs.value.getLeftTabs(spaceId.value)
        }
      })
      .catch((err) => {
        proxy.$modal.msgWarning(err.response.data.msg)
      })
      .finally(() => {
        moveDialogVisible.value = false
      })
  } else {
    const params = {
      ...curretnOperateFolderOrFile.value,
      directoryId: targetFolder.id,
      spaceId: spaceId.value,
      fileType: curretnOperateFolderOrFile.value.fileType === 2 ? 2 : 1,
    }
    panApi
      .updateFile(params)
      .then((res) => {
        console.log(res)
        if (res.code == 0) {
          proxy.$modal.msgSuccess('移动成功')
          getTableData()
          // 还需要调用左侧tab的查询接口
          leftTabsRefs.value.getLeftTabs(spaceId.value)
        }
      })
      .catch((err) => {
        proxy.$modal.msgWarning(err.response.data.msg)
      })
      .finally(() => {
        moveDialogVisible.value = false
        currentFile.value = null
        curretnOperateFolderOrFile.value = null
      })
  }
}

const folderClose = (folderId, types) => {
  if (types == 'create') {
    fileId.value = folderId
  }
  getTableData()
  // 还需要调用左侧tab的查询接口
  leftTabsRefs.value.getLeftTabs(spaceId.value)
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
