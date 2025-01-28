import request from '@/utils/request.js'

const api_prex = '/file';
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
    });
};
