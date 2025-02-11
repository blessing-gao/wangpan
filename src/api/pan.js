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
    responseType: 'blob'
  })
}

// 文档 - 获取文档上传最大限制
export const getDocMaxSize = () => {
  return request({
    url: `${path}/document/maxSize`,
    method: 'get',
  })
}

// 文档 - 更新（重命名，移动）
export const updateFile = (data) => {
  return request({
    url: `${path}/document/update`,
    method: 'post',
    data,
  })
}

// 文件夹 - 更新
export function updateFolder(data) {
  return request({
    url: `${path}/directory/update`,
    method: 'post',
    data,
  })
}

// 文件夹 - 新增
export function createFolder(data) {
  return request({
    url: `${path}/directory/create`,
    method: 'post',
    data,
  })
}

// 文件夹 - 删除
export function deleteFolder(id) {
  return request({
    url: `${path}/directory/delete/${id}`,
    method: 'get',
  })
}

// 文档 - 删除文件
export function deleteFile(params) {
  return request({
    url: `${path}/document/delete`,
    method: 'get',
    params,
  })
}


// 查询空间明细
export function spaceDetail(id) {
  return request({
    url: `${path}/space/detail/${id}`,
    method: 'get',
  })
}