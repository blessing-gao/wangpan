// 统一管理项目用户相关的接口
import request from '@/utils/request.js'
const path = import.meta.env.VITE_BASE_PREV

/**
 * 获取最近浏览记录
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const getBrowsingHistory = (params) => {
  return request({
    url: '/classification',
    method: 'get',
    params,
  })
}


/**
 * 根据名称搜索文件
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const nameSearch = (name) => {
  return request({
    url: `${path}/document/list/${name}`,
    method: 'get',
  })
}

/**
 * 上传搜索
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const uploadSearch = (params, data) => {
  return request({
    url: '/classification',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params,
    data,
  })
}
