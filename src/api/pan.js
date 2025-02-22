// 统一管理项目用户相关的接口
import request from '@/utils/request.js'
import { GET_USERID } from '@/utils/auth'
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
    // onUploadProgress: (progressEvent) => {
    //   if (progressEvent.lengthComputable) {
    //     const percent = Math.round(
    //       (progressEvent.loaded / progressEvent.total) * 100,
    //     )
    //     onProgress(percent)
    //   }
    // },
  })
}

/**
 * 编辑之后文档上传
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
// export const uploadFile = (data) => {
//   return request({
//     url: `${path}/document/upload/${id}`,
//     method: 'post',
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//     data,
//   })
// }

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
    method: 'delete',
    params,
  })
}

// 文档 - 彻底删除文件
export function recycleBinDeleteFile(params) {
  return request({
    url: `${path}/document/deleteFileFromRecycleBin`,
    method: 'delete',
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

// 查询文件信息
export function providerOptions(id) {
  return request({
    url: `${path}/provider/document/vo/${id}`,
    method: 'get',
  })
}

// 获取分享外链
export function getShareUrl(data) {
  return request({
    url: `${path}/document/share`,
    method: 'post',
    data,
  })
}

// 获取文档评论
export function commentOptions(params) {
  return request({
    url: `${path}/comment/list`,
    method: 'get',
    params,
  })
}

// 文件收藏
export function addCollect(data) {
  return request({
    url: `${path}/userCollect/add`,
    method: 'post',
    data,
  })
}

// 获取收藏列表
export function getCollect(params) {
  return request({
    url: `${path}/userCollect/list`,
    method: 'get',
    params,
  })
}

// 移除收藏
export function deleteCollect(data) {
  return request({
    url: `${path}/userCollect/remove?collectId=${data.collectId}`,
    method: 'delete',
  })
}

// 获取用户关联组织
export function getUserSpace(params) {
  return request({
    url: `${path}/userSpace/list`,
    method: 'get',
    params,
  })
}

// 获取文件类型
export function getFileTypes() {
  return request({
    url: `${path}/document/file-types`,
    method: 'get',
  })
}

// 文件批量下载
export function downloadFiles(params) {
  return request({
    url: `${path}/directory/download`,
    method: 'get',
    responseType: 'blob',
    params,
  })
}

// 查询回收站列表
export function recycleBin(params) {
  return request({
    url: `${path}/document/recycleBin`,
    method: 'get',
    params,
  })
}

// 还原文件
export function restoreFile(params) {
  return request({
    url: `${path}/document/recoverFile`,
    method: 'get',
    params,
  })
}