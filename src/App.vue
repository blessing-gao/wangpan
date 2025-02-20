<script setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { SET_TOKEN } from '@/utils/auth'

// import axios from 'axios'
// import useUserStore from '@/store/modules/user'
// const userStore = useUserStore()
// console.log(userStore.user);

// console.log(userStore.token) // 获取值
// userStore.getToken() // 获取方法
// axios.post('/api/user/login').then((res) => {
//   console.log('mock', res)
// })
const urlParams = new URLSearchParams(window.location.search)

const token = urlParams.get('token') // 获取id参数

SET_TOKEN(token)
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<style>
@import './styles/main.css';
</style>
