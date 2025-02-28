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
    async getCookie(name) {
      let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
      if (match) return match[2]
      return null
    },
    deleteCookie(name) {
      // 设置 cookie 的过期时间为过去的时间，这样浏览器就会删除该 cookie
      document.cookie =
        name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    },
    async userInfo() {
      try {
        // 步骤
        // 如果local中没有userid，从cookie中获取userid，如果cookie中没有，跳转到登录页面
        if (this.userId == '') {
          this.userId = await this.getCookie('userId')
          this.token = await this.getCookie('token')

          // 如果 cookie 中没有 userId，跳转到登录页面
          if (!this.userId) {
            window.location.href = import.meta.env.VITE_LOGIN_URL
            return
          } else {
            SET_USERID(this.userId)
            SET_TOKEN(this.token)
          }

          // 从 cookie 中删除 userId 和 token
          this.deleteCookie('userId')
          this.deleteCookie('token')
        }

        let url = window.location.href
        if (this.spaceId === '' && !url.includes('share')) {
          const result = await panApi.getUserSpace({ userId: this.userId })
          const { spaceId, spaceName } = result.data[0] || {}
          if (spaceId) {
            this.spaceId = spaceId
            SET_PACEID(this.spaceId)
            SET_USERNAME(spaceName)
          }
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
