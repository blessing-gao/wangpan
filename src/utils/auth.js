// utils/auth.js

// 将 token 存储到 localStorage 中
export function SET_TOKEN(token) {
  localStorage.setItem('userToken', token)
}

// 从 localStorage 获取 token
export function GET_TOKEN() {
  return localStorage.getItem('userToken')
}

// 从 localStorage 中移除 token
export function REMOVE_TOKEN() {
  localStorage.removeItem('userToken')
}

// 将 spaceId 存储到 localStorage 中
export function SET_PACEID(proId) {
  localStorage.setItem('spaceId', proId)
}

// 从 localStorage 获取 proId
export function GET_PACEID() {
  return localStorage.getItem('spaceId')
}

// 从 localStorage 获取 userId
export function GET_USERID() {
  return localStorage.getItem('userId')
}
