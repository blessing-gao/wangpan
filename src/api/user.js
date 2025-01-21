// 统一管理项目用户相关的接口
import request from '@/utils/request.js'

// 项目用户相关的请求地址
const API = {
  LOGIN_URL: '/user/login',
  USERINFO_URL: '/user/info',
  LOGOUT_URL: '/user/logout',
}

// 登录接口
export const reqLogin = (data) => request.post(API.LOGIN_URL, data)

// 获取用户信息
export const reqUserInfo = (params) => request.get(API.USERINFO_URL, params)

// 退出登录
export const reqLogout = () => request.post(API.LOGOUT_URL)
