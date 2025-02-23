<template>
  <div style="height: 100%; display: flex; position: relative">
    <leftTabs
      ref="leftTabsRefs"
      @handleNodeClick="handleNodeClick"
      @onCommand="handleOtherList"
    />
    <div style="padding: 16px; width: 100%">
      <vTableCustom
        style="width: 100%"
        ref="table_ref"
        :tableHead="false"
        :border="false"
        :loading="loading"
        :columns="columns"
        :tableData="tableData"
        :total="total"
        :rowKey="rowKey"
        :pageSize="formInline.pageSize"
        :currentPage="formInline.currentPage"
        @turnSize="turnSize"
        :changePage="changePage"
        :enableSelection="true"
        :tableRowClassName="rowClassName"
        @handleSelectionChange="handleSelectionChange"
        @handleRowMouseEnter="handleRowMouseEnter"
        @handleRowMouseLeave="handleRowMouseLeave"
      >
        <template #toolbarBtn>
          <div style="display: flex; justify-content: space-between">
            <div v-if="selectedRowsName.length == 0">
              <el-popover
                placement="bottom-start"
                :width="108"
                style="padding: 8px 0"
                trigger="hover"
                v-if="listType != 'recycleBin'"
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

              <el-button v-if="listType != 'recycleBin'" @click="createDict">
                新建文件夹
              </el-button>
            </div>
            <div v-else class="isCheckedNumber-style">
              <div v-if="listType != 'recycleBin'">
                <el-checkbox
                  v-model="isCheckedNumber"
                  :label="checkedNumber"
                  size="large"
                  disabled
                  style="margin-right: 28px"
                />
                <el-button @click="handleDownload">批量下载</el-button>
                <el-button>批量删除</el-button>
              </div>
              <div v-else>
                <el-checkbox
                  v-model="isCheckedNumber"
                  :label="checkedNumber"
                  size="large"
                  disabled
                  style="margin-right: 28px"
                />
                <el-button>批量放回原处</el-button>
              </div>
            </div>
            <div v-if="listType == 'recycleBin'">
              <el-button>清空回收站</el-button>
            </div>
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
              </el-breadcrumb>
            </div>
            <div class="table-top-right">
              <el-select
                class="m-2"
                placeholder="请选择类型"
                style="width: 120px"
                v-model="formInline.docFileType"
                @change="changetype"
                clearable
              >
                <el-option
                  v-for="item in fileTypeList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
              <el-input
                v-if="isExpanded"
                style="margin-left: 12px"
                ref="inputRef"
                v-model="formInline.name"
                placeholder="请输入搜索内容"
                class="search-input"
                clearable
                @blur="handleBlur"
                @keyup.enter="handleSearch"
              >
                <template #suffix>
                  <el-icon class="search-icon" @click="handleSearch">
                    <Search />
                  </el-icon>
                </template>
              </el-input>

              <!-- 按钮状态 -->
              <el-button
                v-else
                style="margin-left: 12px"
                class="search-btn"
                circle
                @mouseenter="expandSearch"
              >
                <img style="width: 14px" src="/icons/Vector.svg" />
              </el-button>
              <el-button style="margin-left: 12px">
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

        <template #size="{ rows }">
          {{ formatSize(rows.size) }}
        </template>

        <template #operation="{ rows }">
          <div class="file-name_right" v-if="listType == 'default'">
            <img
              v-if="!rows.isCollect"
              style="cursor: pointer"
              src="/icons/常用文件.svg"
              @click="handleCollect(rows, 'add')"
            />
            <img
              v-else
              style="cursor: pointer"
              src="/icons/collect.svg"
              @click="handleCollect(rows, 'delete')"
            />
            <img
              style="cursor: pointer; margin-left: 16px"
              src="/icons/down.svg"
              @click="handleFileOperate('self', 'download', rows)"
            />
            <fileOperateMenu
              class="file-name_right-img"
              :file="rows"
              :listType="listType"
              @onCommand="handleFileOperate"
            >
              <img src="/icons/more_horiz.svg" />
            </fileOperateMenu>
          </div>
          <div class="file-name_right" v-if="listType == 'collect'">
            <img
              style="cursor: pointer"
              src="/icons/collect.svg"
              @click="handleCollect(rows, 'delete')"
            />
            <img
              style="cursor: pointer; margin-left: 16px"
              src="/icons/down.svg"
              @click="handleFileOperate('self', 'download', rows)"
            />
            <fileOperateMenu
              class="file-name_right-img"
              :file="rows"
              :listType="listType"
              @onCommand="handleFileOperate"
            >
              <img src="/icons/more_horiz.svg" />
            </fileOperateMenu>
          </div>
          <div class="file-name_right" v-if="listType == 'recycleBin'">
            <fileOperateMenu
              class="file-name_right-img"
              :file="rows"
              :listType="listType"
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
    <!-- <uploadProgressDialog ref="uploadProgressDialogRefs" /> -->
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, reactive, nextTick } from 'vue'
import { ArrowRight, Search } from '@element-plus/icons-vue'
import { SET_PACEID, GET_PACEID, GET_USERID } from '@/utils/auth'
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
import uploadProgressDialog from './components/uploadProgressDialog.vue'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const loading = ref(false)

const tableData = ref([])

const uploadDialogVisible = ref(false)
const moveDialogVisible = ref(false)
const spaceList = ref([])

// 判断当前是在哪个列表
const listType = ref('default')

const getProId = async () => {
  let proId = route.query.spaceId || GET_PACEID()
  return proId
}

// 获取spaceId
const spaceId = ref('')

const getSpaceId = async () => {
  // 使用await等待getProId的返回结果
  const proId = await getProId()
  // 设置spaceId的值
  spaceId.value = proId
}

const fileId = ref(0)

const total = ref(0)
const formInline = reactive({
  current: 1,
  size: 10,
})

// 修改当前页显示条数
const turnSize = (val) => {
  formInline.size = val
  getTableData()
}

// 修改当前页数
const changePage = (val) => {
  formInline.current = val
  getTableData()
}

const getTableData = () => {
  loading.value = true
  let params = {
    ...formInline,
    status: 1,
    userId: GET_USERID(),
  }
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

const fileTypeList = ref([])

const getFileType = async () => {
  await panApi.getFileTypes().then((res) => {
    fileTypeList.value = res.data
  })
}

// 响应式状态
const isExpanded = ref(false)
const inputRef = ref(null)

// 展开搜索框
const expandSearch = async () => {
  isExpanded.value = true
  await nextTick()
  inputRef.value?.focus()
}

// 处理失去焦点
const handleBlur = () => {
  if (!formInline.name || formInline.name == '') {
    isExpanded.value = false
    getTableData()
  }
}

// 执行搜索
const handleSearch = () => {
  if (formInline.name && formInline.name != '') {
    getTableData()
  }
}

const changetype = () => {
  getTableData()
}

onMounted(async () => {
  await getFileType()
  await getSpaceIdList()
  const name = route.query.name
  if (name) {
    const targetFileType = fileTypeList.value.filter((item) => {
      return item.name == name
    })
    formInline.docFileType = targetFileType[0].value
    router.replace({ name: 'file' })
  }
  await getSpaceId()
  // leftTabsRefs.value.getLeftTabs(spaceId.value)
  getTableData()
})

const rowKey = ref('id')

const checkedNumber = ref('')
const isCheckedNumber = ref(true)
const selectedRowsName = ref([])
const selectedRowsId = ref([])

const handleSelectionChange = (selection) => {
  selectedRowsName.value = selection.map((item) => item.name)
  selectedRowsId.value = selection.map((item) => item.id)
  checkedNumber.value = `已选 ${selectedRowsName.value.length} 项`
}

const rowClassName = ({ row }) => {
  let color = ''
  // 如果当前行在选中的行中，添加背景色
  if (selectedRowsName.value.includes(row.name)) {
    color = 'selected-row'
  }
  return color
}

const handleRowMouseEnter = (column) => {
  column['isHovered'] = true
}

const handleRowMouseLeave = (column) => {
  if (selectedRowsName.value.indexOf(column.name) != -1) {
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
    isFolder.value = column
    console.log(isFolder.value)

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
  // listType.value = 'default'
  if (!folder) {
    isLevelText.value = false
    fileId.value = 0
    tabList.value = []
    isFolder.value = null
  } else {
    isLevelText.value = true
    fileId.value = folder.id
    tabList.value = tabList.value.filter((item) => item.parentId !== folder.id)
    isFolder.value = folder
  }
  switch (listType.value) {
    case 'default':
      getTableData()
      break
    case 'collect':
      getCollect()
      break
    case 'recycleBin':
      getRecycleBinList()
      break
  }
}

const fileDetailRefs = ref(null)

const handleDetail = (rows) => {
  fileDetailRefs.value.handleEdit(rows)
}

const folderDialogRefs = ref(null)
const createDict = () => {
  folderDialogRefs.value.handleEdit('create', isFolder.value)
}

const handleNodeClick = (data, node) => {
  if (data.fileType === 0) {
    fileId.value = data.id
    if (tabList.value.length != 0 && data.parentId == 0) {
      tabList.value = []
    }
    isLevelText.value = true
    let idList = tabList.value.map((item) => item.id)
    if (idList.indexOf(data.id) == -1) {
      tabList.value.push(data)
    }
    isFolder.value = data
    getTableData()
  } else {
    // 如果不是文件夹类型，需要跳转预览
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
  uploadFileRefs.value.handleEdit('folder', isFolder.value)
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
    switch (operate) {
      case 'edit':
        router.push({
          name: 'VideoDetail',
          query: {
            id: file.id,
          },
        })
        break
      case 'rename':
        handleShowRename(file)
        break
      case 'remove':
        showDeleteDialog(file)
        break
      case 'move':
        moveDialogVisible.value = true
        break
      case 'download':
        downloadFiles(file.id)
        break
      case 'restore':
        handleRestore(file)
        break
      case 'completelyDelete':
        handleRecycleBinDelete(file)
        break
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

// 还原
const handleRestore = (file) => {
  const params = {
    docId: file.id,
  }
  panApi
    .restoreFile(params)
    .then((res) => {
      console.log(res)
      if (res.code == 0) {
        proxy.$modal.msgSuccess('还原成功')
        getRecycleBinList()
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

// 彻底删除
const handleRecycleBinDelete = (file) => {
  const params = {
    docId: file.id,
  }
  panApi
    .recycleBinDeleteFile(params)
    .then((res) => {
      if (res.code == 0) {
        proxy.$modal.msgSuccess('删除成功')
        getRecycleBinList()
      }
    })
    .catch((err) => {
      console.error(err)
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
  // isFolder.value = null
  uploadParams.directoryId = 0
  uploadParams.uniqueKey = ''
  getTableData()
  leftTabsRefs.value.getLeftTabs(spaceId.value)
}

// 上传文件
const uploadFiles = async () => {
  if (importMdFile.value) {
    // for (const { raw } of fileList) {
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

const handleCollect = (row, types) => {
  const params = {
    userId: GET_USERID(),
  }
  let api = null
  let message = null
  if (types == 'add') {
    api = 'addCollect'
    params.documentId = row.id
    message = '收藏成功'
  } else {
    api = 'deleteCollect'
    params.documentId = row.id
    message = '取消收藏成功'
  }
  panApi[api](params)
    .then((res) => {
      proxy.$modal.msgSuccess(message)
      switch (listType.value) {
        case 'collect':
          getCollect()
          break
        case 'default':
          getTableData()
          break
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

const handleOtherList = (data) => {
  isFolder.value = null
  isLevelText.value = null
  tabList.value = []
  if (data.label == '收藏文件') {
    listType.value = 'collect'
    getCollect()
  } else if (data.label == '回收站') {
    listType.value = 'recycleBin'
    getRecycleBinList()
  }
}

const getCollect = () => {
  loading.value = true
  const params = {
    userId: GET_USERID(),
  }
  panApi
    .getCollect(params)
    .then((res) => {
      tableData.value = res.data
    })
    .catch((err) => {
      console.error(err)
    })
    .finally(() => {
      loading.value = false
    })
}

const getRecycleBinList = () => {
  loading.value = true
  const params = {
    userId: GET_USERID(),
  }
  panApi
    .recycleBin(params)
    .then((res) => {
      tableData.value = res.data
    })
    .catch((err) => {
      console.error(err)
    })
    .finally(() => {
      loading.value = false
    })
}

const formatSize = (size) => {
  // 1 KB = 1024 bytes, 1 MB = 1024 KB, 1 GB = 1024 MB
  const KB = 1024
  const MB = KB * 1024
  const GB = MB * 1024
  const TB = GB * 1024
  if (size) {
    // 根据字节数大小决定转换的单位
    if (size >= TB) {
      // 如果大于等于 1GB，转换为 GB
      return (size / TB).toFixed(2) + ' TB'
    } else if (size >= GB) {
      // 如果大于等于 1GB，转换为 GB
      return (size / GB).toFixed(2) + ' GB'
    } else if (size >= MB) {
      // 如果大于等于 1MB，转换为 MB
      return (size / MB).toFixed(2) + ' MB'
    } else if (size >= KB) {
      // 如果大于等于 1KB，转换为 KB
      return (size / KB).toFixed(2) + ' KB'
    } else if (size < KB) {
      // 小于 1KB，显示为字节
      return size + ' bytes'
    }
  }
}

// 获取spaceId列表
const getSpaceIdList = async () => {
  const params = {
    userId: GET_USERID(),
  }

  // 获取空间数据并进行安全检查
  try {
    let result = await panApi.getUserSpace(params)
    spaceList.value = result.data
  } catch (error) {
    console.error('请求错误:', error)
    return null
  }
}

// 批量下载
const handleDownload = () => {
  let space = spaceList.value.filter((item) => {
    return item.spaceId == GET_PACEID()
  })
  console.log(space)

  const params = {
    ids: selectedRowsId.value.toString(),
    fileName: 'files',
    bucketName: space[0].spaceName,
  }

  console.log(params)

  panApi.downloadFiles(params).then((res) => {
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

.search-container {
  position: relative;
  display: inline-block;
}

.search-btn {
  transition: all 0.3s ease;
}

.search-input {
  width: 200px;
  transition: all 0.3s ease;
}

.search-icon {
  cursor: pointer;
  color: #de3a05;
  padding: 0 5px;
}

/* 平滑过渡效果 */
.el-input,
.el-button {
  vertical-align: middle;
}
</style>
