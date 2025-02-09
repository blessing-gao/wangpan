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
 * 上传文件夹
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const uploadFile = (params, data) => {
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
