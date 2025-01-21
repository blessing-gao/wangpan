// utils/auth.js

// 将 token 存储到 localStorage 中
export function SET_TOKEN(token) {
  localStorage.setItem('token', token)
}

// 从 localStorage 获取 token
export function GET_TOKEN() {
  return localStorage.getItem('token')
}

// 从 localStorage 中移除 token
export function REMOVE_TOKEN() {
  localStorage.removeItem('token')
}
