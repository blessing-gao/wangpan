export const columns = [
  {
    prop: 'fileName',
    label: '文件名称',
    align: 'left',
  },
  {
    prop: 'updateTime',
    label: '最近修改时间',
    align: 'left',
    width: '200',
    sortable: true,
  },
  {
    prop: 'updateBy',
    label: '修改人',
    align: 'left',
    width: '150',
    sortable: true,
  },
  {
    prop: 'size',
    label: '文件大小',
    align: 'left',
    width: '150',
    sortable: true,
  },
  {
    prop: 'docFileType',
    label: '文件类型',
    align: 'left',
    width: '120',
  },
  {
    prop: "operation",
    label: "操作",
    width: 200,
    align: "left",
    slotName: "operation",
  },
]
