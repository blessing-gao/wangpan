// 统一管理项目用户相关的接口
import request from '@/utils/request.js'

/**
 * 获取标签
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const getTagData = (params) => {
  return request({
    url: '/classification',
    method: 'get',
    params,
  })
}

/**
 * 添加标签
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const addTag = (data) => {
  return request({
    url: '/classification',
    method: 'post',
    data,
  })
}

/**
 * 删除标签
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const removeTag = (data) => {
  return request({
    url: '/classification',
    method: 'delete',
    data,
  })
}

/**
 * 获取详情信息
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const detailOptions = (data) => {
  return request({
    url: '/classification',
    method: 'delete',
    data,
  })
}
