<script setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 进入应用后直接开始获取cookie中的值，保证其在user.js之前执行
// 获取 cookie 中的值
function getCookie(name) {
  let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (match) return match[2]
  return null
}
// 从 Cookie 中获取 token 和 userId
const token = getCookie('token')
const userId = getCookie('userId')
console.log(token, userId)
// 如果 token 存在，存储到 localStorage
if (token) {
  localStorage.setItem('token', token)
}
// 如果 userId 存在，存储到 localStorage
if (userId) {
  localStorage.setItem('userId', userId)
}
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<style>
@import './styles/main.css';
</style>
