// 统一管理项目用户相关的接口
import request from '@/utils/request.js'
const path = import.meta.env.VITE_BASE_PREV

// 项目用户相关的请求地址
const API = {
  LOGIN_URL: `${path}/user/login`,
  USERINFO_URL: `${path}/space/project/17`,
  LOGOUT_URL: `/doc/ssologout`,
}

// 登录接口
export const reqLogin = (data) => request.post(API.LOGIN_URL, data)

// 获取用户信息
export const reqUserInfo = (params) => request.get(API.USERINFO_URL, params)

// 退出登录
// export const reqLogout = (params) => request.get(API.LOGOUT_URL, params)
export const reqLogout = (params) => {
  return request({
    url: `/doc/sso/logout`,
    method: 'get',
    params
  })
}
