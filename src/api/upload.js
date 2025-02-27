export function uploadFile(
  formData, // 文件对象
  name,
  targetIndex,
  overrideFileName = null,
  progressCallback,
  completeCallback,
  errorCallback,
  abortCallback,
  toastCallback,
  userId,
  token,
) {
  const path1 = import.meta.env.VITE_BASE_PREV
  let path = `${path1}/document/upload`

  // 创建 XMLHttpRequest 实例
  const req = new XMLHttpRequest()
  req.open('POST', path, true)
  req.setRequestHeader('userId', userId)
  req.setRequestHeader('token', token)

  // 监听上传进度
  req.upload.addEventListener('progress', (evt) => {
    if (evt.lengthComputable) {
      let percentComplete = Math.round((evt.loaded / evt.total) * 100)
      if (progressCallback)
        setTimeout(() => {
          progressCallback(
            name,
            targetIndex,
            percentComplete,
            evt.loaded,
            evt.total,
          ) // 更新进度
        }, 0)
    }
  })

  // 请求状态变化时处理
  req.onreadystatechange = () => {
    if (req.readyState === XMLHttpRequest.DONE) {
      if (req.status === 200) {
        const rspHeader = req.getResponseHeader('Content-Disposition')

        let filename = overrideFileName || 'upload'
        if (rspHeader) {
          let rspHeaderDecoded = decodeURIComponent(rspHeader)
          filename = rspHeaderDecoded.split('"')[1]
        }

        if (completeCallback) completeCallback()
      } else {
        if (req.getResponseHeader('Content-Type') === 'application/json') {
          const rspBody = JSON.parse(req.response)
          if (rspBody.detailedMessage) {
            errorCallback(rspBody.detailedMessage)
            return
          }
        }
        errorCallback('Unexpected response, upload incomplete.')
      }
    }
  }

  req.onerror = () => {
    errorCallback('A network error occurred.')
  }

  req.onabort = () => {
    if (abortCallback) abortCallback()
  }

  // 发送请求
  req.send(formData)

  // 返回 XMLHttpRequest 实例，以便可以控制上传操作（例如取消上传）
  return req
}
