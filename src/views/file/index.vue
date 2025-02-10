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
              <div class="organization-content" @click="uploadFiles">
                <img
                  src="/icons/文件.svg"
                  style="margin-right: 12px; width: 16px"
                />
                上传文件
              </div>
            </el-popover>

            <el-button  @click="createDict">新建文件夹</el-button>
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
            <div class="file-name_right">
              <img
                class="file-name_right-img"
                v-show="!rows.isHovered"
                src="/icons/FolderDown.svg"
              />
              <img
                class="file-name_right-img"
                v-show="rows.isHovered"
                src="/icons/FolderDown-hover.svg"
              />
              <img
                class="file-name_right-img"
                v-show="!rows.isHovered"
                src="/icons/常用文件.svg"
              />
              <!-- 少星型图标 -->
              <!-- <img
                class="file-name_right-img"
                v-show="rows.isHovered"
                src="/icons/常用文件.svg"
              /> -->
              <el-popover
                placement="bottom"
                :popper-style="{
                  boxSizing: 'border-box',
                  padding: '8px 0px',
                }"
                :width="88"
                trigger="hover"
              >
                <template #reference>
                  <img
                    class="file-name_right-img"
                    src="/icons/more_horiz.svg"
                  />
                </template>
                <div class="popover-content">
                  <div>重命名</div>
                  <div @click="handleDelete">删除</div>
                  <div @click="uploadFiles">上传文件</div>
                  <div @click="handleDetail(rows)">详细信息</div>
                </div>
              </el-popover>
            </div>
          </div>
        </template>

      </vTableCustom>
    </div>
    <fileDetail ref="fileDetailRefs" />
    <uploadFile ref="uploadFileRefs" />
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import leftTabs from './components/leftTabs.vue'
import vTableCustom from '@/components/TableCustom/index.vue'
import fileDetail from './components/fileDetail.vue'
import { columns } from './components/Columns.js'
import * as panApi from '@/api/pan.js'
// import uploadSearch from '@/components/uploadSearch.vue'
import uploadFile from './components/uploadFile.vue'
import { fileTypeIcon, collaboraOnlineExts, compressedExts } from '@/enum'

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

// 获取spaceId
const spaceId = ref('')
const getSpaceId = async () => {
  const proId = route.query.proId
  const result = await panApi.getSpaceIdByProdId(proId)
  spaceId.value = result.data
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
  getTableData()
  createFolder()
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
      // this.currentFolderOrFile = file
      // this.$refs.fileTree.setCurrentKey(file.id)
      // this.currentFile = file
      // this.showMdPreview = true
      // this.showDocPreview = false
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
  uploadFileRefs.value.handleEdit('folder')
}

// 上传文件
const uploadFiles = () => {
  uploadFileRefs.value.handleEdit('file')
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
</script>

