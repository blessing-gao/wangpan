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
        @handleCellDblclick="handleCellDblclick"
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

            <el-button>新建文件夹</el-button>
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
              <el-button link @click="clickFile">文件名称</el-button>
              <el-button v-if="isLevelText" link>二级文件名称</el-button>
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

        <template #operation="{ rows }">
          <div class="file-name">
<!--            <div class="file-name_left">-->
<!--              <img-->
<!--                style="width: 24px; margin-right: 10px"-->
<!--                src="/icons/文件管理.svg"-->
<!--              />-->
<!--              <span style="margin-right: 10px">{{ rows.fileName }}</span>-->
<!--              <el-tag class="ml-2" type="warning" size="small">标签</el-tag>-->
<!--            </div>-->
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
import { useRouter } from 'vue-router'
import leftTabs from './components/leftTabs.vue'
import vTableCustom from '@/components/TableCustom/index.vue'
import fileDetail from './components/fileDetail.vue'
import { columns } from './components/Columns.js'
import * as panApi from '@/api/pan.js'
// import uploadSearch from '@/components/uploadSearch.vue'
import uploadFile from './components/uploadFile.vue'
import * as fileApi from '@/api/file.js';

const { proxy } = getCurrentInstance()
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

const getTableData = () => {
  loading.value = true
  // 定义请求参数
  const params = {
    bucketName: 'gjq', // 存储桶名称
    isRecursive: false,      // 是否递归
    onlyFolders: false,      // 是否只展示文件夹
  };
  fileApi
    .fileList(params)
    .then((res) => {
      if (res.code === 200 && res.success) {
        tableData.value = res.model.map((fileName, index) => ({
          id: (index + 1).toString(), // 生成唯一的 id
          fileName: fileName, // 文件名称
          lastTime: '未知', // 最近修改时间，需要根据实际数据填充
          modifier: '未知', // 修改人，需要根据实际数据填充
          size: '未知', // 文件大小，需要根据实际数据填充
          type: fileName.endsWith('/') ? '文件夹' : '文件', // 文件类型
        }));
      } else {
        console.error('请求失败:', res.errorMessage);
      }
    })
    .catch((err) => {
      proxy.$modal.msgError(err.message)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
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
  console.log(selectedRows.value, column)
  if (selectedRows.value.indexOf(column.fileName) != -1) {
    column['isHovered'] = true
  } else {
    column['isHovered'] = false
  }
}

// 是否显示二级文件名称
const isLevelText = ref(false)

const handleCellDblclick = (column) => {
  isLevelText.value = true
}

const clickFile = () => {
  isLevelText.value = false
  getTableData()
}

const fileDetailRefs = ref(null)

const handleDetail = (rows) => {
  fileDetailRefs.value.handleEdit(rows)
}

const handleNodeClick = (data) => {
  getTableData()
}

const uploadFileRefs = ref(null)

// 上传文件夹
const uploadFolder = () => {
  uploadFileRefs.value.handleEdit()
}

// 上传文件
const uploadFiles = () => {
  uploadFileRefs.value.handleEdit()
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

<style lang="scss" scoped>
:deep(.selected-row) {
  td {
    background-color: rgba(243, 232, 222, 0.5) !important;
  }
}

.file-name {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .file-name_left {
    display: flex;
    align-items: center;
  }
}

:deep(.el-table__row:hover) {
  td {
    background-color: rgba(243, 232, 222, 0.5) !important;
  }
}

:deep(.el-table__row) {
  height: 54px;
}

:deep(.el-button) {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
  font-weight: 400;
}

.table-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 22px;
  .table-top-title {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0;
    font-weight: 400;
    display: flex;
  }
  .table-top-right {
    display: flex;
    align-items: center;
    :deep(.el-button, .el-button.is-round) {
      padding: 9px;
    }
  }
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: #de3a05;
  border-radius: 2px;
  border-color: #de3a05;
}

:deep(.custom-checkbox .el-checkbox__input:hover) {
  border-color: #de3a05 !important;
}
:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  font-family: PingFangSC-Medium;
  font-size: 12px;
  color: #666666;
  letter-spacing: 0;
  line-height: 22px;
  font-weight: 500;
}

.isCheckedNumber-style {
  display: flex;
  align-items: center;
}

.popover-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  div {
    padding: 6px 0 6px 13px;
    cursor: pointer;
  }
  div:hover {
    background: rgba(255, 215, 202, 0.5);
    color: #de3a05;
  }
}

:deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  background: #de3a05;
  border-radius: 2px;
  border-color: #de3a05;
}

.file-name_right-img {
  cursor: pointer;
  width: 18px;
  margin-left: 16px;
}

.organization-content {
  padding: 6px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
  letter-spacing: 0;
  font-weight: 400;
}

.organization-content:hover {
  color: #de3a05;
  background: rgba(255, 215, 202, 0.5);
}

:deep(.el-popper.is-light, .el-popper.is-light > .el-popper__arrow:before) {
  padding: 8px 0 !important;
}
</style>
