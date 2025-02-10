import axios from 'axios'
import { ElMessage } from 'element-plus'
//创建axios实例
let request = axios.create({
  timeout: 60000,
  withCredentials: true
})
//请求拦截器
request.interceptors.request.use(
  (config) => {
    // 配置请求头
    config.headers = {
      Authorization: localStorage.getItem('userToken')
        ? localStorage.getItem('userToken')
        : '',
      'Amp-Organ-Id':
        config?.headers?.['Amp-Organ-Id'] ||
        (localStorage.getItem('subTreeParams')
          ? JSON.parse(localStorage.getItem('subTreeParams')).organId
          : localStorage.getItem('curOrg')
            ? JSON.parse(localStorage.getItem('curOrg') || '{}').organId
            : ''),
      'Amp-App-Code':
        JSON.parse(localStorage.getItem('activedApp'))?.code || '',
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
//响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code === 0) {
      return data
    } else {
      ElMessage.warning(data.msg || '接口调用失败，请联系管理员')
      return Promise.reject()
    }
  },
  (error) => {
    ElMessage.warning(error)
  }
)
export default request
