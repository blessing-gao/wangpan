import request from '@/utils/request.js'

const api_prex = '/file'
/**
 * 获取目录
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const fileList = (params) => {
  return request({
    url: api_prex + '/listFiles',
    method: 'get',
    params,
  })
}

/**
 * 上传文件到指定存储桶
 * @requestParam params 包含 `bucketName` 的参数
 * @requestBody data FormData 对象，包含上传的文件
 * @returns {AxiosPromise}
 */
export const uploadFile = (params, data) => {
  return request({
    url: api_prex + '/uploadFiles',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params,
    data,
  })
}

/**
 * 上传文件夹到指定存储桶
 * @requestParam params 包含 `bucketName` 的参数
 * @requestBody data FormData 对象，包含上传的文件
 * @returns {AxiosPromise}
 */
export const uploadFolder = (params, data) => {
  return request({
    url: api_prex + '/uploadFolder',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params,
    data,
  })
}

/**
 * 创建文件夹
 * @param {string} bucketName - 存储桶名称
 * @param {string} folderName - 文件夹名称
 * @returns {Promise} - 返回一个 Promise
 */
export const createFolder = (params, data = {}) => {
  return request({
    url: api_prex + '/createFolder',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params,
    data,
  })
}

/**
 * 获取文件信息
 * @param {Object} params 参数，包括bucketName和objectName
 * @returns {AxiosPromise} 返回的axios请求结果
 */
export const getFileInfo = (params) => {
  return request({
    url: api_prex + '/fileInfo', // 后端接口路径
    method: 'get', // 使用GET请求
    params: params, // 传递查询参数
  })
    .then((response) => {
      // 成功时处理返回数据
      console.log('文件信息：', response.data)
      return response.data
    })
    .catch((error) => {
      // 错误时处理
      console.error('获取文件信息失败：', error)
      throw error
    })
}
