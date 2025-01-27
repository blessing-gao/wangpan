import request from '@/utils/request.js'

/**
 * 获取目录
 * @requestParam params
 * @requestBody data
 * @returns {AxiosPromise}
 */
export const fileList = (params) => {
    return request({
        url: '/file/listFiles',
        method: 'get',
        params,
    })
}
