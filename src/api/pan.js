// 统一管理项目用户相关的接口
import request from '@/utils/request.js'

/**
 * 获取目录
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const contentsList = (params) => {
  return request({
    url: '/api/classification',
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
    url: '/api/recent',
    method: 'get',
    params,
  })
}
