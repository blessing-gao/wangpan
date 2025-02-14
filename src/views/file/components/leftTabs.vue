<template>
  <div style="height: 100%">
    <!-- 左侧二级导航 -->
    <div class="two-left">
      <div class="left-top">
        <div class="all-file">全部文件</div>
        <el-tree
          :data="fileData"
          :props="defaultProps"
          accordion
          highlight-current
          :style="{ '--selected-bg-color': selectedBgColor }"
          :loading="loading"
          @node-click="handleNodeClick"
        >
          <template #default="{ data }">
            <span class="custom-tree-node">
              <img
                style="margin-right: 12px; width: 14px"
                :src="
                  fileTypeIcon(
                    data.fileType === 2
                      ? data.name.replace('zip', 'md')
                      : data.name,
                  )
                "
              />
              <span>{{ data.name }}</span>
            </span>
          </template>
        </el-tree>
      </div>
      <div class="left-center">
        <div class="all-file">其他</div>
        <el-tree
          :data="otherList"
          :props="defaultProps"
          highlight-current
          accordion
          :style="{ '--selected-bg-color': selectedBgColor }"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <template v-if="data.label == '最近使用'">
                <img
                  style="margin-right: 12px; width: 12px"
                  src="/icons/矩形.svg"
                />
              </template>
              <template v-if="data.label == '收藏文件'">
                <img
                  style="margin-right: 12px; width: 12px"
                  src="/icons/常用文件.svg"
                />
              </template>
              <template v-if="data.label == '回收站'">
                <img
                  style="margin-right: 12px; width: 12px"
                  src="/icons/垃圾桶.svg"
                />
              </template>
              <span>{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </div>
      <div class="left-footer">
        <div class="file-number">
          <div class="file-number-title">{{ userName }}</div>
        </div>
        <div class="use-size">
          <div class="use-size-left">
            <div class="used-size">{{ usedSize }}</div>
            /
            <div class="all-size">{{ allSize }}</div>
          </div>
          <div class="proportion">
            {{ proportion }}
          </div>
        </div>
        <div>
          <el-progress
            :stroke-width="4"
            :show-text="false"
            :percentage="percentage"
            color="#C38F5D"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { SET_PACEID, GET_PACEID } from '@/utils/auth'
import * as panApi from '@/api/pan.js'
import { useRoute } from 'vue-router'
import { fileTypeIcon } from '@/enum'

const route = useRoute()

const { proxy } = getCurrentInstance()

const selectedBgColor = '#f9f3ee' // 可以动态修改这个值
const loading = ref(true)
const defaultProps = {
  children: 'children',
  label: 'label',
}
const fileData = ref([])

const emits = defineEmits(['handleNodeClick'])

const handleNodeClick = (data, node) => {
  if (data.fileType === 0) {
    // 点击文件节点，获取数据并展开
    fileId.value = data.id
    getLeftTabs(leftSpaceId.value, data)
    node.expanded = true
  }
  emits('handleNodeClick', data, node)
}

const getProId = () => {
  let proId = route.query.spaceId || GET_PACEID()
  return proId || 233 // 如果proId为空则返回默认值233
}

// 获取spaceId
const leftSpaceId = ref('')
const getSpaceId = async () => {
  const proId = getProId()
  SET_PACEID(proId)
  const result = await panApi.getSpaceIdByProdId(proId)
  leftSpaceId.value = result.data
}

const usedSize = ref('0')
const allSize = ref('0')
const proportion = ref('0%')
const percentage = ref(0)
const userName = ref(null)
const getSpaceDetail = () => {
  panApi
    .spaceDetail(leftSpaceId.value)
    .then((res) => {
      console.log(res.data)
      if (res.data.quota == '-1') {
        allSize.value = '无限制'
      } else {
        allSize.value = formatSize(res.data.quota)
        proportion.value =
          ((Number(res.data.size) / Number(res.data.quota)) * 100).toFixed(2) +
          '%'
        percentage.value = Number(
          ((Number(res.data.size) / Number(res.data.quota)) * 100).toFixed(2),
        )
      }
      usedSize.value = formatSize(res.data.size)
      userName.value = res.data.name
    })
    .catch((err) => {
      console.error(err)
    })
}

const formatSize = (size) => {
  // 1 KB = 1024 bytes, 1 MB = 1024 KB, 1 GB = 1024 MB
  const KB = 1024
  const MB = KB * 1024
  const GB = MB * 1024
  const TB = GB * 1024

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
  } else {
    // 小于 1KB，显示为字节
    return size + ' bytes'
  }
}

// 获取左侧的
const fileId = ref(0)
const getLeftTabs = async (spaceId, data) => {
  leftSpaceId.value = spaceId
  let params = {
    current: 1,
    size: 500,
    status: 1,
    name: '',
  }
  await panApi
    .contentsList(spaceId, fileId.value, params)
    .then((res) => {
      if (fileId.value == 0 || fileData.value.length == 0) {
        fileData.value = res.data
      } else {
        data.children = res.data
      }
    })
    .catch((err) => {
      console.log(2222, err)
      proxy.$modal.msgError(err.message)
    })
}

onMounted(async () => {
  await getSpaceId()
  getSpaceDetail()
  // 这里之所以调用是因为如果修改了之后，无法重新显示内容
  getLeftTabs(leftSpaceId.value)
})

const otherList = ref([
  {
    label: '最近使用',
  },
  {
    label: '收藏文件',
  },
  {
    label: '回收站',
  },
])

defineExpose({
  getLeftTabs,
})
</script>

<style lang="scss" scoped>
.two-left {
  position: relative;
  box-sizing: border-box;
  width: 233px;
  padding: 12px;
  height: 100%;
  border-right: 1px solid rgba(230, 231, 234, 1);
}

/* 样式覆盖选中项的字体颜色和背景颜色 */

/* 修改选中节点的背景色 */
:deep(.el-tree .el-tree-node__content:hover) {
  background: #f9f3ee; /* 你想要的任何颜色 */
}

:deep(.el-tree-node__content) {
  height: 40px;
}

:deep(
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content
) {
  background-color: #f9f3ee;
  color: #de3a05;
}

.custom-tree-node {
  display: flex;
  align-items: centere;
  span {
    max-width: 166px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.all-file {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #999999;
  letter-spacing: 0;
  font-weight: 400;
  margin-bottom: 4px;
}

:deep(.el-tree-node__content > .el-tree-node__expand-icon) {
  padding-left: 0;
}

:deep(.el-tree-node__content) {
  padding-left: 0 !important;
}

.left-top {
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(230, 231, 234, 1);
}

.left-center {
  margin-top: 16px;
}

.left-center-btn {
  display: flex;
  align-items: center;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
  font-weight: 400;
  margin-bottom: 20px;
}

.left-footer {
  position: absolute;
  bottom: 0;
  width: 77%;
  margin-top: 17px;
  background: rgba(243, 232, 222, 0.5);
  border-radius: 8px;
  padding: 10px 16px 14px 14px;
  margin-bottom: 24px;
}

.file-number {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  .file-number-title {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .file-number-number {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    font-weight: 500;
    display: flex;
    align-items: center;
  }
}

.use-size {
  display: flex;
  justify-content: space-between;
  margin-bottom: 9px;
  .use-size-left {
    display: flex;
    .used-size {
      font-family: PingFangSC-Medium;
      font-size: 12px;
      color: #c38f5d;
      letter-spacing: 0;
      line-height: 17px;
      font-weight: 500;
      margin-right: 4px;
    }
    .all-size {
      font-family: PingFangSC-Medium;
      font-size: 12px;
      color: #999999;
      letter-spacing: 0;
      line-height: 17px;
      font-weight: 500;
      margin-left: 4px;
    }
  }
  .proportion {
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #333333;
    letter-spacing: 0;
    font-weight: 500;
  }
}

:deep(.el-progress-bar__outer) {
  background: #ffffff;
}
</style>
