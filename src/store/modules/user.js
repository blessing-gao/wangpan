// user.js
import { defineStore } from 'pinia'
import { reqLogin, reqLogout, reqUserInfo } from '@/api/user.js'
import { SET_TOKEN, REMOVE_TOKEN, GET_TOKEN, SET_USERID, SET_PACEID, GET_PACEID } from '@/utils/auth'
import * as panApi from '@/api/pan.js'
const useUserStore = defineStore('user', {
  state: () => {
    return {
      spaceId: GET_PACEID() || '',
      token: GET_TOKEN() || '',
      checkUser: {},
      userId: '',
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
        // if (!token || token === 'null') {
        //   return Promise.reject(new Error('用户未登录，无法获取用户信息'))
        // }
        // 请求用户信息，假设接口为 reqUserInfo
        let parmas = {
          token: token,
        }
        this.userId = '1'
        SET_USERID(this.userId)
        // 通过userId获取到用户的第一个speaceId
        let result = await panApi.getUserSpace({userId: this.userId})
        if(this.spaceId === ''){
          this.spaceId = result.data[0].spaceId
          SET_PACEID(this.spaceId)
        }
        // 发送请求，期望获取到userId
        // const result = await reqUserInfo(parmas)
        // // 如果请求成功
        // if (result.code === 200) {
        //   this.checkUser = result.data.checkUser
        //   this.username = result.data.checkUser.username
        //   return result.data // 返回用户信息
        // } else {
        //   // 如果请求失败，抛出错误
        //   return Promise.reject(new Error(result.data.message))
        // }
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
