<template>
  <div>
    <div class="table-toolbar" v-if="hasToolbar">
      <div class="table-toolbar-left">
        <slot name="toolbarBtn"></slot>
      </div>
      <div class="table-toolbar-right flex-center" v-if="tableHead">
        <template v-if="multipleSelection.length > 0">
          <el-tooltip effect="dark" content="删除选中" placement="top">
            <el-icon
              class="columns-setting-icon"
              @click="delSelection(multipleSelection)"
            >
              <Delete />
            </el-icon>
          </el-tooltip>
          <el-divider direction="vertical" />
        </template>
        <el-tooltip effect="dark" content="刷新" placement="top">
          <el-icon class="columns-setting-icon" @click="refresh">
            <Refresh />
          </el-icon>
        </el-tooltip>
        <el-divider direction="vertical" />
        <el-tooltip effect="dark" content="列设置" placement="top">
          <el-dropdown :hide-on-click="false" size="small" trigger="click">
            <el-icon class="columns-setting-icon">
              <Setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(c, index) in columns" :key="index">
                  <el-checkbox v-model="c.visible" :label="c.label" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>
      </div>
    </div>
    <div class="table">
      <slot name="tableBtn"></slot>
      <el-table
        ref="table_ref"
        v-if="hasTable"
        class="mgb20"
        style="width: 100%"
        :border="border"
        :data="tableData"
        v-loading="loading"
        :row-key="rowKey"
        @selection-change="handleSelectionChange"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        table-layout="auto"
        :row-class-name="tableRowClassName"
        @cell-mouse-enter="handleRowMouseEnter"
        @cell-mouse-leave="handleRowMouseLeave"
        @cell-dblclick="handleCellDblclick"
      >
        <slot name="tableBefore"></slot>
        <el-table-column
          v-if="enableSelection"
          type="selection"
          width="55"
          :selectable="selectable"
          :reserve-selection="true"
        ></el-table-column>
        <template v-for="item in columns" :key="item.prop">
          <el-table-column
            v-if="item.visible"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :type="item.type"
            :align="item.align || 'center'"
            :sortable="item.sortable"
            :show-overflow-tooltip="item.showOverflowTooltip"
          >
            <template #header>
              <!-- Insert custom content into the header if provided -->
              <div>
                <slot :name="'header-' + item.prop">{{ item.label }}</slot>
              </div>
            </template>
            <template #default="{ row, column, $index }" v-if="!item.type">
              <slot
                :name="item.prop"
                :column="column"
                :rows="row"
                :index="$index"
              >
                <span v-if="item.formatter">
                  {{ item.formatter(row[item.prop]) }}
                </span>
                <span v-else>
                  {{ row[item.prop] }}
                </span>
              </slot>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <el-pagination
        style="margin-top: 8px"
        v-if="hasPagination"
        :current-page="currentPage"
        :page-size="pageSize"
        :background="true"
        :layout="layout"
        size="small"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { toRefs, ref } from 'vue'
import { Delete, Edit, View, Refresh, Setting } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const props = defineProps({
  hasTable: {
    type: Boolean,
    default: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  tableHead: {
    type: Boolean,
    default: true,
  },
  tableRowClassName: {
    type: Function,
    default: () => {},
  },
  border: {
    type: Boolean,
    default: true,
  },
  enableSelection: {
    type: Boolean,
    default: false,
  },
  // 表格相关
  tableData: {
    type: Array,
    default: [],
  },
  columns: {
    type: Array,
    default: [],
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  hasToolbar: {
    type: Boolean,
    default: true,
  },
  //  分页相关
  hasPagination: {
    type: Boolean,
    default: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },

  layout: {
    type: String,
    default: 'total, prev, pager, next, sizes, jumper',
  },
  delFunc: {
    type: Function,
    default: () => {},
  },
  viewFunc: {
    type: Function,
    default: () => {},
  },
  editFunc: {
    type: Function,
    default: () => {},
  },
  delSelection: {
    type: Function,
    default: () => {},
  },
  refresh: {
    type: Function,
    default: () => {},
  },
  changePage: {
    type: Function,
    default: () => {},
  },
  selectable: {
    type: Function,
    default: () => () => true,
  },
})

let {
  tableData,
  columns,
  rowKey,
  hasToolbar,
  hasPagination,
  total,
  currentPage,
  pageSize,
  layout,
} = toRefs(props)

columns.value.forEach((item) => {
  if (item.visible === undefined) {
    item.visible = true
  }
})

const table_ref = ref()

const emits = defineEmits([
  'turnSize',
  'handleSelectionChange',
  'handleRowMouseEnter',
  'handleRowMouseLeave',
  'handleCellDblclick',
])
// 当选择项发生变化时会触发该事件
const multipleSelection = ref([])
const handleSelectionChange = (selection) => {
  multipleSelection.value = selection
  emits('handleSelectionChange', selection)
}

const handleSizeChange = (val) => {
  emits('turnSize', val)
}

const handleRowMouseEnter = (rowIndex) => {
  emits('handleRowMouseEnter', rowIndex)
}

const handleRowMouseLeave = (rowIndex) => {
  emits('handleRowMouseLeave', rowIndex)
}

const handleCellDblclick = (rowIndex) => {
  emits('handleCellDblclick', rowIndex)
}

// 当前页码变化的事件
const handleCurrentChange = (val) => {
  props.changePage(val)
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning',
  })
    .then(async () => {
      props.delFunc(row)
    })
    .catch(() => {})
}

const getIndex = (index) => {
  return index + 1 + (currentPage.value - 1) * pageSize.value
}

defineExpose({
  table_ref,
})
</script>

<style scoped>
.table-toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 10px;
}

:deep(.el-table th) {
  background-color: #fff !important;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
  letter-spacing: 0;
  font-weight: 400;
}

.columns-setting-icon {
  display: block;
  color: #676767;
  font-size: 18px;
  cursor: pointer;
}
.el-pagination {
  float: right;
}

.table {
  padding: 0px 10px;
  background-color: #fff;
  height: calc(100% - 108px);
  overflow: scroll;
}
</style>
<style>
.table-header .cell {
  color: #333;
}

.table-toolbar-left {
  width: 100%;
}

.el-table__body-header .cell {
  display: flex;
  align-items: center;
}

.el-scrollbar__view {
  width: 100%;
}

.el-pagination.is-background .btn-next.is-active,
.el-pagination.is-background .btn-prev.is-active,
.el-pagination.is-background .el-pager li.is-active {
  background-color: rgb(222, 58, 5);
}

.el-select-dropdown__item.is-selected {
  color: rgb(222, 58, 5);
}

.el-select__wrapper.is-focused {
  box-shadow: 0 0 0 1px rgb(222, 58, 5) inset;
}

.el-pager li:hover {
  color: rgb(222, 58, 5);
}
</style>
