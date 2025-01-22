<template>
  <div>
    <vTableCustom
      style="width: 100%"
      ref="table_ref"
      :tableHead="false"
      :border="false"
      :loading="loading"
      :columns="uploadColumns"
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
          <img style="margin-right: 8px; width: 16px" src="/icons/垃圾桶.svg" />
          <div>全部暂停</div>
          <div>全部开始</div>
          <div>全部删除</div>
        </div>
        <div class="table-top">
          <div class="top-one">我上传的</div>
          <el-radio-group v-model="checkRadio" @change="handleChangeRadio">
            <el-radio-button :value="1" class="custom-radio">
              <template #default>上传中（{{ uploading }}）</template>
            </el-radio-button>
            <el-radio-button :value="2" class="custom-radio">
              <template #default>已完成（{{ completed }}）</template>
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="progress-box">
          <div class="progress-title">当前进度</div>
          <el-progress
            :stroke-width="8"
            color="#DE3A05"
            :percentage="80"
            style="width: 85%"
          >
            <template #default>
              <div style="display: flex">
                <div class="progress-speed">已完成{{ progress }}%</div>
                <div class="progress-speed" style="color: #de3a05">
                  {{ speed }}
                </div>
              </div>
            </template>
          </el-progress>
          <div>共{{ uploadSize }}个</div>
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
          </div>
        </div>
      </template>
      <template #fileSize="{ rows }">
        <div style="display: flex">
          <div>{{ rows.nowSize }}G</div>
          /
          <div>{{ rows.allSize }}G</div>
        </div>
      </template>
      <template #status="{ rows }">
        <div
          v-if="Number(rows.nowSize) != Number(rows.allSize)"
          style="width: 100%"
        >
          <el-progress
            :stroke-width="4"
            :show-text="false"
            :percentage="getPercentage(rows)"
            color="#DE3A05"
          />
          <div class="upload-status">
            <div class="upload-status-speed">{{ rows.speed }}</div>
            <div class="upload-status-time">剩余时间 {{ rows.time }}</div>
          </div>
        </div>
        <div v-else>已完成</div>
      </template>
      <template #action="{ rows }">
        <div class="action-btn">
          <el-button link @click="handleClick(rows)">暂停</el-button>
          <el-button link @click="handleClick(rows)">删除</el-button>
          <el-button link @click="handleClick(rows)">查看</el-button>
        </div>
      </template>
    </vTableCustom>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { uploadColumns } from './Columns'
import vTableCustom from '@/components/TableCustom/index.vue'
import * as taskApi from '@/api/task.js'

const router = useRouter()

const { proxy } = getCurrentInstance()

const loading = ref(false)

const tableData = ref([])

const uploadSize = ref(0)
const progress = ref(0)
const speed = ref('')

const getUpload = async () => {
  let params = {}
  await taskApi
    .getUpladData(params)
    .then((res) => {
      uploading.value = 0
      completed.value = 0
      uploadSize.value = 0
      progress.value = 0.8 * 100
      speed.value = '1.02MB/s'
    })
    .catch((err) => {
      proxy.$modal.msgError(err.message)
    })
    .finally(() => {})
}

const getUploadingData = () => {
  loading.value = true
  let params = {}
  taskApi
    .getUploadIngList(params)
    .then((res) => {
      tableData.value = [
        {
          fileName: '测试1',
          nowSize: '4.18',
          allSize: '5.44',
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

const getUploadedData = () => {
  loading.value = true
  let params = {}
  taskApi
    .getUploadedList(params)
    .then((res) => {
      tableData.value = [
        {
          fileName: '测试2',
          nowSize: '4.18',
          allSize: '5.44',
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
  await getUpload()
  getUploadingData()
})

// 切换tab
const handleChangeRadio = () => {
  console.log(checkRadio.value)

  if (checkRadio.value == '1') {
    getUploadingData()
  } else {
    getUploadedData()
  }
}

const rowKey = ref('id')

const uploading = ref(0)
const completed = ref(0)

const selectedRows = ref([])

const getPercentage = (rows) => {
  if (rows.nowSize) {
    if (Number(rows.nowSize == 0)) return 0
    return (Number(rows.nowSize) / Number(rows.allSize)) * 100
  }
}

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

const handleCellDblclick = (column) => {
  // console.log(column)
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

.top_btn {
  width: 248px;
  background: #fff4f4;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 5px 0;
}

.top_btn div {
  border: 0;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #de3a05;
  letter-spacing: 0;
  font-weight: 400;
  cursor: pointer;
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

:deep(.el-progress-bar__outer) {
  background: #e6e7ea;
}

.upload-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .upload-status-speed {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #de3a05;
    letter-spacing: 0;
    font-weight: 400;
  }
  .upload-status-time {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #333333;
    letter-spacing: 0;
    line-height: 22px;
    font-weight: 400;
  }
}

:deep(.action-btn .el-button.is-link) {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #333333;
  letter-spacing: 0;
  font-weight: 400;
}

.progress-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.progress-title {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #999999;
  letter-spacing: 0;
  font-weight: 500;
}

.progress-speed {
  margin-left: 13px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
  line-height: 20px;
  font-weight: 400;
}
</style>
