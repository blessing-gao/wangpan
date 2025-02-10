// 统一管理项目用户相关的接口
import request from '@/utils/request.js'
const path = import.meta.env.VITE_BASE_PREV

/**
 * 根据项目ID获取spaceId
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const getSpaceIdByProdId = (id) => {
  return request({
    url: `${path}/space/project/${id}`,
    method: 'get',
  })
}

/**
 * 获取文件
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const contentsList = (spaceId, directoryId, params) => {
  return request({
    url: `${path}/document/page/${spaceId}/${directoryId}`,
    method: 'get',
    params,
  })
}

/**
 * 获取目录下文件列表
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const getTableList = (params) => {
  return request({
    url: '/recent',
    method: 'get',
    params,
  })
}

/**
 * 上传文件夹
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const uploadFolder = (params, data) => {
  return request({
    url: '/recent',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params,
    data,
  })
}

/**
 * 上传文档
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const uploadFile = (data) => {
  return request({
    url: `${path}/document/upload`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data,
  })
}

/**
 * 文件下载
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const downloadFile = (id) => {
  return request({
    url: `${path}/document/download/${id}`,
    method: 'get',
    responseType: 'blob',
  })
}

// 文档 - 获取文档上传最大限制
export const getDocMaxSize = () => {
  return request({
    url: `${path}/document/maxSize`,
    method: 'get',
  })
}

// 文档 - 上传文档
// export const uploadFile = (formData, config) => {
//   return request.post(`${path}/document/upload`, formData, config)
// }
