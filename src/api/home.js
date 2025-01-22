// 统一管理项目用户相关的接口
import request from '@/utils/request.js'

/**
 * 获取分类
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const channelList = (params) => {
  return request({
    url: '/api/classification',
    method: 'get',
    params,
  })
}

/**
 * 获取最近查看列表
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const getHistoryList = (params) => {
  return request({
    url: '/api/recent',
    method: 'get',
    params,
  })
}

/**
 * 获取最近上传列表
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const getUploadList = (params) => {
  return request({
    url: '/api/recent-upload',
    method: 'get',
    params,
  })
}