// user.js
import { defineStore } from 'pinia'
import { reqLogin, reqLogout, reqUserInfo } from '@/api/user.js'
import {
  SET_TOKEN,
  REMOVE_TOKEN,
  GET_TOKEN,
  SET_USERID,
  GET_USERID,
  SET_PACEID,
  GET_PACEID,
  SET_USERNAME,
} from '@/utils/auth'
import * as panApi from '@/api/pan.js'
const useUserStore = defineStore('user', {
  state: () => {
    return {
      spaceId: GET_PACEID() || '',
      token: GET_TOKEN() || '',
      checkUser: {},
      userId: GET_USERID() || '',
    }
  },
  actions: {
    // 用户登录的方法
    async userLogin(data) {
      try {
        const result = await reqLogin(data)
        // 登录请求:成功200->token
        // 登录请求:失败201->登录失败错误的信息
        if (result.code === 200) {
          this.token = result.data.token // 假设 result.data 是 token
          // 本地存储持久化存储一份
          SET_TOKEN(result.data.token)
          // 能保证当前async函数返回一个成功的promise
          return 'ok'
        } else {
          return Promise.reject(new Error(result.data)) // 如果登录失败，抛出错误
        }
      } catch (error) {
        // 捕获请求失败时的错误
        console.error('Login failed:', error)
        return Promise.reject(error)
      }
    },
    async userInfo() {
      try {
        // 从本地存储中获取 token
        const token = GET_TOKEN() // 假设你有 GET_TOKEN 方法从本地存储获取 token
        // 请求用户信息，假设接口为 reqUserInfo
        let parmas = {
          token: token,
        }
        this.userId = 1
        SET_USERID(this.userId)
        let url = window.location.href
        // 通过userId获取到用户的第一个speaceId
        // 如果当前的speaceId不为空或者路由包含了share，则不进行获取speaceId
        if (this.spaceId === '' && !url.includes('share')) {
          let result = await panApi.getUserSpace({ userId: this.userId })
          this.spaceId = result.data[0].spaceId
          SET_PACEID(this.spaceId)
          SET_USERNAME(result.data[0].spaceName)
        }
      } catch (error) {
        // 捕获请求失败时的错误
        console.error('Get user info failed:', error)
        return Promise.reject(error)
      }
    },
    async userLogout(path) {
      const result = await reqLogout({ returnUrl: path })
      this.token = ''
      this.username = ''
      this.checkUser = {}
      REMOVE_TOKEN()
      return 'ok'
    },
  },
})

export default useUserStore
