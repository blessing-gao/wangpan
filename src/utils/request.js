import axios from 'axios'
import { ElMessage } from 'element-plus'
import { GET_USERID, GET_TOKEN } from '@/utils/auth'
//创建axios实例
let request = axios.create({
  timeout: 600000,
  withCredentials: true,
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
      'User-Id': GET_USERID() || '',
      Token: GET_TOKEN() || '',
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
    // 如果是401，跳转到登录页面
    if (response.status === 401) {
      return (window.location.href = import.meta.env.VITE_LOGIN_URL)
    }
    if (data instanceof Blob) {
      return response
    }
    if (data.code === 0) {
      // 如果返回的code是0，但msg中包含401，跳转到登录页面
      if (data.msg && data.msg.includes('401')) {
        return (window.location.href = import.meta.env.VITE_LOGIN_URL)
      }
      return data
    } else {
      ElMessage.warning(data.msg || '接口调用失败，请联系管理员')
      return Promise.reject()
    }
  },
  (error) => {
    return Promise.reject(error)
  },
)
export default request
