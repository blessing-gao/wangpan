// 统一管理项目用户相关的接口
import request from '@/utils/request.js'

/**
 * 获取最近浏览记录
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const getBrowsingHistory = (params) => {
  return request({
    url: '/api/classification',
    method: 'get',
    params,
  })
}
