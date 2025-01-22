// 统一管理项目用户相关的接口
import request from '@/utils/request.js'

/**
 * 获取我上传的所有可见信息
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const getUpladData = (params) => {
  return request({
    url: '/api/classification',
    method: 'get',
    params,
  })
}

/**
 * 获取我上传的上传中信息
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const getUploadIngList = (params) => {
  return request({
    url: '/api/classification',
    method: 'get',
    params,
  })
}

/**
 * 获取我上传的已完成信息
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const getUploadedList = (params) => {
  return request({
    url: '/api/recent',
    method: 'get',
    params,
  })
}

/**
 * 获取我下载的所有可见信息
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const getDownloadData = (params) => {
  return request({
    url: '/api/classification',
    method: 'get',
    params,
  })
}

/**
 * 获取我下载的下载中信息
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const getDownloadingData = (params) => {
  return request({
    url: '/api/classification',
    method: 'get',
    params,
  })
}

/**
 * 获取我下载的已完成信息
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const getDownloadedData = (params) => {
  return request({
    url: '/api/classification',
    method: 'get',
    params,
  })
}
