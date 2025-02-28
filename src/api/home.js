// 统一管理项目用户相关的接口
import request from '@/utils/request.js'
import { GET_USERID, GET_PACEID } from '@/utils/auth'
const path = import.meta.env.VITE_BASE_PREV

/**
 * 获取分类
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const channelList = () => {
  return request({
    url: `${path}/workBench/recently/documentType?spaceId=${GET_PACEID()}&userId=${GET_USERID()}`,
    method: 'get',
  })
}

/**
 * 获取最近查看列表
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const getHistoryList = () => {
  return request({
    url: `${path}/workBench/recently/view?spaceId=${GET_PACEID()}&userId=${GET_USERID()}`,
    method: 'get',
  })
}

/**
 * 获取最近上传列表
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const getUploadList = () => {
  return request({
    url: `${path}/workBench/recently/uploaded?spaceId=${GET_PACEID()}&userId=${GET_USERID()}`,
    method: 'get',
  })
}
