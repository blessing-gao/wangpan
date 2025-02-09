export const fileTypeIcon = (fileName) => {
  const list = {
    md: '/knowledge/icons/file_type_superdoc.svg',
    txt: '/knowledge/icons/file_type_txt.svg',
    dot: '/knowledge/icons/file_type_word.svg',
    doc: '/knowledge/icons/file_type_word.svg',
    docx: '/knowledge/icons/file_type_word.svg',
    docm: '/knowledge/icons/file_type_word.svg',
    dotx: '/knowledge/icons/file_type_word.svg',
    dotm: '/knowledge/icons/file_type_word.svg',
    pptx: '/knowledge/icons/file_type_ppt.svg',
    ppt: '/knowledge/icons/file_type_ppt.svg',
    xlsx: '/knowledge/icons/file_type_excel.svg',
    xls: '/knowledge/icons/file_type_excel.svg',
    jsmind: '/knowledge/icons/file_type_jsmind.svg',
    pdf: '/knowledge/icons/file_type_pdf.svg',
    png: '/knowledge/icons/file_type_png.svg',
    jpg: '/knowledge/icons/file_type_jpg.svg',
    svg: '/knowledge/icons/file_type_svg.svg',
    zip: '/knowledge/icons/file_type_zip.svg',
    tar: '/knowledge/icons/file_type_tar.svg',
    '7z': '/knowledge/icons/file_type_7z.svg'
  }
  if (fileName.includes('.')) {
    return list[fileName.split('.').pop()] || '/knowledge/icons/file_type_txt.svg'
  } else {
    return '/knowledge/icons/文件管理.svg'
  }
}

// 压缩文件后缀列表
export const compressedExts = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'lzma']

// collabora-online 支持文件后缀
export const collaboraOnlineExts = [
  {
    ext: 'sxw',
    action: 'view'
  },
  {
    ext: 'odt',
    action: 'edit'
  },
  {
    ext: 'fodt',
    action: 'edit'
  },
  {
    ext: 'stw',
    action: 'view'
  },
  {
    ext: 'ott',
    action: 'view'
  },
  {
    ext: 'doc',
    action: 'edit'
  },
  {
    ext: 'dot',
    action: 'view'
  },
  {
    ext: 'docx',
    action: 'edit'
  },
  {
    ext: 'docm',
    action: 'edit'
  },
  {
    ext: 'dotx',
    action: 'view'
  },
  {
    ext: 'dotm',
    action: 'view'
  },
  {
    ext: 'wpd',
    action: 'view'
  },
  {
    ext: 'pdb',
    action: 'view'
  },
  {
    ext: 'hwp',
    action: 'view'
  },
  {
    ext: 'wps',
    action: 'view'
  },
  {
    ext: 'wri',
    action: 'view'
  },
  {
    ext: 'lrf',
    action: 'view'
  },
  {
    ext: 'mw',
    action: 'view'
  },
  {
    ext: 'rtf',
    action: 'edit'
  },
  {
    ext: 'txt',
    // TODO 当前online兼容不好
    action: 'view'
  },
  {
    ext: 'fb2',
    action: 'view'
  },
  {
    ext: 'cwk',
    action: 'view'
  },
  {
    ext: 'pages',
    action: 'view'
  },
  {
    ext: 'abw',
    action: 'view'
  },
  {
    ext: 'sxg',
    action: 'view'
  },
  {
    ext: 'odm',
    action: 'edit'
  },
  {
    ext: 'otm',
    action: 'view'
  },
  {
    ext: 'oth',
    action: 'edit'
  },
  {
    ext: 'sxc',
    action: 'view'
  },
  {
    ext: 'ods',
    action: 'edit'
  },
  {
    ext: 'fods',
    action: 'edit'
  },
  {
    ext: 'stc',
    action: 'view'
  },
  {
    ext: 'ots',
    action: 'view'
  },
  {
    ext: 'xls',
    action: 'edit'
  },
  {
    ext: 'xla',
    action: 'edit'
  },
  {
    ext: 'xltx',
    action: 'view'
  },
  {
    ext: 'xltm',
    action: 'view'
  },
  {
    ext: 'xlsx',
    action: 'edit'
  },
  {
    ext: 'xlsb',
    action: 'edit'
  },
  {
    ext: 'xlsm',
    action: 'edit'
  },
  {
    ext: 'dif',
    action: 'edit'
  },
  {
    ext: 'slk',
    action: 'edit'
  },
  {
    ext: 'csv',
    action: 'edit'
  },
  {
    ext: 'dbf',
    action: 'edit'
  },
  {
    ext: 'wk1',
    action: 'view'
  },
  {
    ext: 'gnumeric',
    action: 'view'
  },
  {
    ext: 'numbers',
    action: 'view'
  },
  {
    ext: 'sxi',
    action: 'view'
  },
  {
    ext: 'odp',
    action: 'edit'
  },
  {
    ext: 'fodp',
    action: 'edit'
  },
  {
    ext: 'sti',
    action: 'view'
  },
  {
    ext: 'otp',
    action: 'view'
  },
  {
    ext: 'ppt',
    action: 'edit'
  },
  {
    ext: 'pot',
    action: 'view'
  },
  {
    ext: 'pptx',
    action: 'edit'
  },
  {
    ext: 'pptm',
    action: 'edit'
  },
  {
    ext: 'potx',
    action: 'view'
  },
  {
    ext: 'potm',
    action: 'view'
  },
  {
    ext: 'ppsx',
    action: 'edit'
  },
  {
    ext: 'cgm',
    action: 'view'
  },
  {
    ext: 'key',
    action: 'view'
  },
  {
    ext: 'sxd',
    action: 'view'
  },
  {
    ext: 'odg',
    action: 'edit'
  },
  {
    ext: 'fodg',
    action: 'edit'
  },
  {
    ext: 'std',
    action: 'view'
  },
  {
    ext: 'otg',
    action: 'view'
  },
  {
    ext: 'svg',
    action: 'view'
  },
  {
    ext: 'dxf',
    action: 'view'
  },
  {
    ext: 'emf',
    action: 'view'
  },
  {
    ext: 'wmf',
    action: 'view'
  },
  {
    ext: 'cdr',
    action: 'view'
  },
  {
    ext: 'vsd',
    action: 'view'
  },
  {
    ext: 'vsdx',
    action: 'view'
  },
  {
    ext: 'vss',
    action: 'view'
  },
  {
    ext: 'pub',
    action: 'view'
  },
  {
    ext: 'p65',
    action: 'view'
  },
  {
    ext: 'wpg',
    action: 'view'
  },
  {
    ext: 'fh',
    action: 'view'
  },
  {
    ext: 'bmp',
    action: 'view'
  },
  {
    ext: 'png',
    action: 'view'
  },
  {
    ext: 'gif',
    action: 'view'
  },
  {
    ext: 'tiff',
    action: 'view'
  },
  {
    ext: 'jpg',
    action: 'view'
  },
  {
    ext: 'jpeg',
    action: 'view'
  },
  {
    ext: 'pdf',
    action: 'view'
  },
  {
    ext: 'mp4',
    action: 'view'
  }
]

// 项目类型参数
export const TEMPLATE_LIST = [
  {
    resourceTypeCode: '',
    parentCode: ''
  },
  {
    resourceTypeCode: 'project_scrum',
    parentCode: 'project_scrum_detail'
  },
  {
    resourceTypeCode: 'project_waterfall',
    parentCode: 'project_waterfall_detail'
  },
  {
    resourceTypeCode: 'project_common',
    parentCode: 'project_common_detail'
  },
  {
    resourceTypeCode: 'project_demand',
    parentCode: 'project_demand_detail'
  }
]
