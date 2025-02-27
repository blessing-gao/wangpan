export const fileTypeIcon = (fileName) => {
  const list = {
    md: '/icons/file-word.svg',
    txt: '/icons/file-word.svg',
    dot: '/icons/file-word.svg',
    doc: '/icons/file-word.svg',
    docx: '/icons/file-word.svg',
    docm: '/icons/file-word.svg',
    dotx: '/icons/file-word.svg',
    dotm: '/icons/file-word.svg',
    pptx: '/icons/file-ppt.svg',
    ppt: '/icons/file-ppt.svg',
    xlsx: '/icons/file-excel.svg',
    xls: '/icons/file-excel.svg',
    jsmind: '/icons/file_type_jsmind.svg',
    pdf: '/icons/file-pdf.svg',
    png: '/icons/file-img.svg',
    jpg: '/icons/file-img.svg',
    jpeg: '/icons/file-img.svg',
    svg: '/icons/file-img.svg',
    zip: '/icons/压缩.svg',
    tar: '/icons/压缩.svg',
    mp3: '/icons/file-audio.svg',
    mp4: '/icons/file-video.svg',
    '7z': '/icons/压缩.svg'
  }
  if (fileName.includes('.')) {
    return list[fileName.split('.').pop()] || '/icons/file-other.svg'
  } else {
    return '/icons/文件管理.svg'
  }
}

export const typeIcon = (name) => {
  const list = {
    EXCEL: '/icons/home-excel.svg',
    视频: '/icons/编组 3.svg',
    图片: '/icons/项目.svg',
    音频: '/icons/audio.svg',
    Word: '/icons/home-word.svg',
    PPT: '/icons/home-ppt.svg',
    PDF: '/icons/home-pdf.svg',
    文本文件: '/icons/home-word.svg',
    ZIP文件: '/icons/压缩.svg',
    其他文件: '/icons/home-other.svg',
  }
  if (name) {
    return list[name] || '/icons/home-other.svg'
  } else {
    return '/icons/home-other.svg'
  }
}

// 压缩文件后缀列表
export const compressedExts = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'lzma']

// collabora-online 支持文件后缀
export const collaboraOnlineExts = [
  {
    ext: 'sxw',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'odt',
    action: 'edit',
    type:'其他文件'
  },
  {
    ext: 'vsix',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'fodt',
    action: 'edit',
    type:'其他文件'
  },
  {
    ext: 'stw',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'ipynb',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'ott',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'doc',
    action: 'edit',
    type:'Word'
  },
  {
    ext: 'dot',
    action: 'view',
    type:'Word'
  },
  {
    ext: 'docx',
    action: 'edit',
    type:'Word'
  },
  {
    ext: 'docm',
    action: 'edit',
    type:'其他文件'
  },
  {
    ext: 'dotx',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'dotm',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'wpd',
    action: 'view',
    type:'EXCEL'
  },
  {
    ext: 'pdb',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'hwp',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'wps',
    action: 'view',
    type:'EXCEL'
  },
  {
    ext: 'wri',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'lrf',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'mw',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'rtf',
    action: 'edit',
    type:'其他文件'
  },
  {
    ext: 'txt',
    // TODO 当前online兼容不好
    action: 'view',
    type:'文本文件'
  },
  {
    ext: 'fb2',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'cwk',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'pages',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'abw',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'sxg',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'mp3',
    action: 'view',
    type:'音频'
  },
  {
    ext: 'odm',
    action: 'edit',
    type:'其他文件'
  },
  {
    ext: 'otm',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'oth',
    action: 'edit',
    type:'其他文件'
  },
  {
    ext: 'sxc',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'ods',
    action: 'edit',
    type:'其他文件'
  },
  {
    ext: 'fods',
    action: 'edit',
    type:'其他文件'
  },
  {
    ext: 'stc',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'ots',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'xls',
    action: 'edit',
    type:'EXCEL'
  },
  {
    ext: 'xla',
    action: 'edit',
    type:'EXCEL'
  },
  {
    ext: 'xltx',
    action: 'view',
    type:'EXCEL'
  },
  {
    ext: 'xltm',
    action: 'view',
    type:'EXCEL'
  },
  {
    ext: 'xlsx',
    action: 'edit',
    type:'EXCEL'
  },
  {
    ext: 'xlsb',
    action: 'edit',
    type:'EXCEL'
  },
  {
    ext: 'xlsm',
    action: 'edit',
    type:'EXCEL'
  },
  {
    ext: 'dif',
    action: 'edit',
    type:'其他文件'
  },
  {
    ext: 'slk',
    action: 'edit',
    type:'其他文件'
  },
  {
    ext: 'csv',
    action: 'edit',
    type:'EXCEL'
  },
  {
    ext: 'dbf',
    action: 'edit',
    type:'EXCEL'
  },
  {
    ext: 'wk1',
    action: 'view',
    type:'EXCEL'
  },
  {
    ext: 'gnumeric',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'numbers',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'sxi',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'odp',
    action: 'edit',
    type:'其他文件'
  },
  {
    ext: 'fodp',
    action: 'edit',
    type:'其他文件'
  },
  {
    ext: 'sti',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'otp',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'ppt',
    action: 'edit',
    type:'PPT'
  },
  {
    ext: 'pot',
    action: 'view',
    type:'PPT'
  },
  {
    ext: 'pptx',
    action: 'edit',
    type:'PPT'
  },
  {
    ext: 'pptm',
    action: 'edit',
    type:'PPT'
  },
  {
    ext: 'potx',
    action: 'view',
    type:'PPT'
  },
  {
    ext: 'potm',
    action: 'view',
    type:'PPT'
  },
  {
    ext: 'ppsx',
    action: 'edit',
    type:'PPT'
  },
  {
    ext: 'cgm',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'key',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'sxd',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'odg',
    action: 'edit',
    type:'其他文件'
  },
  {
    ext: 'fodg',
    action: 'edit',
    type:'其他文件'
  },
  {
    ext: 'std',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'otg',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'svg',
    action: 'view',
    type:'图片'
  },
  {
    ext: 'dxf',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'emf',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'wmf',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'cdr',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'vsd',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'vsdx',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'vss',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'pub',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'p65',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'wpg',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'fh',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'bmp',
    action: 'view',
    type:'其他文件'
  },
  {
    ext: 'png',
    action: 'view',
    type:'图片'
  },
  {
    ext: 'gif',
    action: 'view',
    type:'图片'
  },
  {
    ext: 'tiff',
    action: 'view',
    type:'图片'
  },
  {
    ext: 'jpg',
    action: 'view',
    type:'图片'
  },
  {
    ext: 'jpeg',
    action: 'view',
    type:'图片'
  },
  {
    ext: 'pdf',
    action: 'view',
    type:'PDF'
  },
  {
    ext: 'mp4',
    action: 'view',
    type:'视频'
  },
  {
    ext: 'mp3',
    action: 'view',
    type:'音频'
  },
  {
    ext: 'zip',
    action: 'view',
    type:'ZIP文件'
  },
  {
    ext: 'tar',
    action: 'view',
    type:'ZIP文件'
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
