<template>
  <div style="height: 100%">
    <!-- 左侧二级导航 -->
    <div class="two-left">
      <div class="left-top">
        <div class="all-file">全部文件</div>
        <el-tree
          :data="data"
          :props="defaultProps"
          accordion
          highlight-current
          :style="{ '--selected-bg-color': selectedBgColor }"
          @node-click="handleNodeClick"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <template v-if="data.children">
                <!-- 一级节点，插入图片 -->
                <img style="margin-right: 12px; width: 14px;" src="/icons/编组 32.svg" />
              </template>
              <template v-else>
                <img style="margin-right: 12px; width: 12px;" src="/icons/文件 (2).svg" />
              </template>
              <span>{{ node.label }}</span>
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
                <img style="margin-right: 12px; width: 12px;" src="/icons/矩形.svg" />
              </template>
              <template v-if="data.label == '常用文件'">
                <img style="margin-right: 12px; width: 12px;" src="/icons/常用文件.svg" />
              </template>
              <template v-if="data.label == '回收站'">
                <img style="margin-right: 12px; width: 12px;" src="/icons/垃圾桶.svg" />
              </template>
              <span>{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </div>
      <div class="left-footer">
        <div class="file-number">
          <div class="file-number-title">个人网盘中心</div>
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
import { ref } from 'vue'

const selectedBgColor = '#f9f3ee' // 可以动态修改这个值

const defaultProps = {
  children: 'children',
  label: 'label',
}
const data = ref([
  {
    label: '个人资源',
    children: [
      {
        label: 'Level two 1-1',
      },
    ],
  },
  {
    label: '文件名称',
    children: [
      {
        label: '二级菜单',
      },
      {
        label: '二级菜单',
      },
    ],
  },
])

const handleNodeClick = (data) => {
  console.log(data)
}

const otherList = ref([
  {
    label: '最近使用',
  },
  {
    label: '常用文件',
  },
  {
    label: '回收站',
  },
])

const usedSize = ref('251.04GB')
const allSize = ref('3.67 TB')
const proportion = ref('20%')
const percentage = ref(20)
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
