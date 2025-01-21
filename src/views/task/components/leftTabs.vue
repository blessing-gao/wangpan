<template>
  <div style="height: 100%">
    <div class="left-center">
      <div class="all-file">
        <img
          style="margin-right: 12px; width: 14px"
          src="/icons/编组 32.svg"
          alt=""
        />
        <span>我的任务</span>
      </div>
      <el-tree
        :data="otherList"
        :props="defaultProps"
        highlight-current
        accordion
        :style="{ '--selected-bg-color': selectedBgColor }"
        @node-click="handleNodeClick"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <template v-if="data.label == '我上传的'">
              <img
                style="margin-right: 12px; width: 14px"
                src="/icons/矩形.svg"
              />
            </template>
            <template v-if="data.label == '我下载的'">
              <img
                style="margin-right: 12px; width: 14px"
                src="/icons/常用文件.svg"
              />
            </template>
            <template v-if="data.label == '智能处理'">
              <img
                style="margin-right: 12px; width: 14px"
                src="/icons/垃圾桶.svg"
              />
            </template>
            <span>{{ node.label }}</span>
          </span>
        </template>
      </el-tree>
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

const otherList = ref([
  {
    label: '我上传的',
  },
  {
    label: '我下载的',
  },
  {
    label: '智能处理',
  },
])

const emits = defineEmits(['handleNodeClick'])

const handleNodeClick = (data) => {
  emits('handleNodeClick', data)
}
</script>

<style lang="scss" scoped>
.left-center {
  text-align: center;
  box-sizing: border-box;
  width: 160px;
  padding: 16px;
  height: 100%;
  border-right: 1px solid rgba(230, 231, 234, 1);
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

.all-file {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
  font-weight: 500;
  margin-bottom: 12px;
}

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
</style>
