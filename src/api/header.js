// 统一管理项目用户相关的接口
import request from '@/utils/request.js'

/**
 * 获取组织
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const organizationData = (params) => {
  return request({
    url: '/classification',
    method: 'get',
    params,
  })
}

/**
 * 切换组织
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const changeOrganization = (data) => {
  return request({
    url: '/recent',
    method: 'post',
    data,
  })
}
