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

// 将 token 存储到 localStorage 中
export function SET_USERID(userId) {
  localStorage.setItem('userId', userId)
}

export function SET_USERNAME(username) {
  localStorage.setItem('username', username)
}

export function GET_USERNAME() {
  return localStorage.getItem('username')
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

export function set_uploadingFiles(uploadingFiles) {
  return localStorage.setItem('uploadingFiles', uploadingFiles)
}

export function get_uploadingFiles() {
  return localStorage.getItem('uploadingFiles')
}

export function remove_uploadingFiles() {
  localStorage.removeItem('uploadingFiles')
}

export function set_uploadProgress(uploadProgress) {
  return localStorage.setItem('uploadProgress', uploadProgress)
}

export function get_uploadProgress() {
  return localStorage.getItem('uploadProgress')
}

export function remove_uploadProgress() {
  localStorage.removeItem('uploadProgress')
}

export function set_downLoadingFiles(downLoadingFiles) {
  return localStorage.setItem('downLoadingFiles', downLoadingFiles)
}

export function get_downLoadingFiles() {
  return localStorage.getItem('downLoadingFiles')
}

export function remove_downLoadingFiles() {
  localStorage.removeItem('downLoadingFiles')
}

export function set_downloadProgress(downloadProgress) {
  return localStorage.setItem('downloadProgress', downloadProgress)
}

export function get_downloadProgress() {
  return localStorage.getItem('downloadProgress')
}

export function remove_downloadProgress() {
  localStorage.removeItem('downloadProgress')
}
