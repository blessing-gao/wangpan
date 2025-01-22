<template>
  <div>
    <vTableCustom
      style="width: 100%"
      ref="table_ref"
      :tableHead="false"
      :border="false"
      :loading="loading"
      :columns="downloadColumns"
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
        <div class="top_btn">
          <el-button round>
            <img
              style="margin-right: 8px; width: 16px"
              src="/icons/垃圾桶.svg"
            />
            <span>清空全部记录</span>
          </el-button>
        </div>
        <div class="table-top">
          <div class="top-one">我下载的</div>
          <el-radio-group v-model="checkRadio" @change="handleChange">
            <el-radio-button :value="1" class="custom-radio">
              <template #default>下载中（{{ downloading }}）</template>
            </el-radio-button>
            <el-radio-button :value="2" class="custom-radio">
              <template #default>已完成（{{ completed }}）</template>
            </el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <template #fileName="{ rows }">
        <div class="file-name">
          <div class="file-name_left">
            <img
              style="width: 24px; margin-right: 10px"
              src="/icons/audio.svg"
            />
            <span style="margin-right: 10px">{{ rows.fileName }}</span>
            <el-tag class="ml-2" type="warning" size="small">标签</el-tag>
          </div>
        </div>
      </template>
    </vTableCustom>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { downloadColumns } from './Columns'
import vTableCustom from '@/components/TableCustom/index.vue'
import * as taskApi from '@/api/task.js'

const { proxy } = getCurrentInstance()

const loading = ref(false)

const tableData = ref([])

const getData = async () => {
  let params = {}
  await taskApi
    .getDownloadData(params)
    .then((res) => {})
    .catch((err) => {
      proxy.$modal.msgError(err.message)
    })
}

const getTableData = () => {
  loading.value = true
  let params = {}
  taskApi
    .getDownloadingData(params)
    .then((res) => {
      tableData.value = [
        {
          fileName: '测试1',
          fileSize: '测试1',
          modifiedTime: '测试1',
        },
      ]
    })
    .catch((err) => {
      proxy.$modal.msgError(err.message)
    })
    .finally(() => {
      loading.value = false
    })
}

const getDownloadedList = () => {
  loading.value = true
  let params = {}
  taskApi
    .getDownloadedData(params)
    .then((res) => {
      tableData.value = [
        {
          fileName: '测试2',
          fileSize: '测试1',
          modifiedTime: '测试1',
        },
      ]
    })
    .catch((err) => {
      proxy.$modal.msgError(err.message)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(async () => {
  await getData()
  getTableData()
})

const handleChange = () => {
  if (checkRadio.value == '1') {
    getTableData()
  } else {
    getDownloadedList()
  }
}

const rowKey = ref('id')

const downloading = ref(0)
const completed = ref(0)

const selectedRows = ref([])

const rowClassName = ({ row }) => {
  let color = ''
  // 如果当前行在选中的行中，添加背景色
  if (selectedRows.value.includes(row.fileName)) {
    color = 'selected-row'
  }
  return color
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection.map((item) => {
    return item.fileName
  })
}

const handleRowMouseEnter = (column) => {
  column['isHovered'] = true
}

const handleRowMouseLeave = (column) => {
  column['isHovered'] = false
}

const router = useRouter()

const handleCellDblclick = (column) => {
  router.push({
    name: 'VideoDetail',
    query: {
      id: '123456',
    },
  })
}

const checkRadio = ref(1)
</script>

<style lang="scss" scoped>
:deep(.selected-row) {
  td {
    background-color: rgba(243, 232, 222, 0.5) !important;
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

.file-name {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .file-name_left {
    display: flex;
    align-items: center;
  }
}

:deep(.top_btn .el-button) {
  border: 0;
  background: #fff4f4;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #de3a05;
  letter-spacing: 0;
  font-weight: 400;
}

.table-top {
  display: flex;
  align-items: center;
  margin-top: 24px;
  .top-one {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    font-weight: 500;
    padding-right: 16px;
    border-right: 1px solid rgba(230, 231, 234, 1);
    margin-right: 16px;
  }
}

/* 自定义未选中时的字体颜色 */
:deep(.custom-radio .el-radio-button__inner) {
  color: #999999;
  border: 0;
  background-color: #ffffff !important;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 22px;
  font-weight: 500;
}

:deep(.el-radio-button) {
  --el-radio-button-checked-border-color: #ffffff;
  --el-radio-button-checked-text-color: #de3a05 !important;
}
</style>
