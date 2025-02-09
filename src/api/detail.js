// 统一管理项目用户相关的接口
import request from '@/utils/request.js'
const path = import.meta.env.VITE_BASE_PREV

/**
 * 获取标签
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const getTagData = (params) => {
  console.log(111, path)
  return request({
    url: `${path}/favourite/file`,
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
    url: '/api/classification',
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
    url: '/api/classification',
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
    url: '/api/classification',
    method: 'delete',
    data,
  })
}
