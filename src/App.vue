<script setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { SET_TOKEN } from '@/utils/auth'
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
