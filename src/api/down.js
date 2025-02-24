export function downloadFile(
  fileSize,
  overrideFileName = null,
  id,
  progressCallback,
  completeCallback,
  errorCallback,
  abortCallback,
  toastCallback,
) {
  const path1 = import.meta.env.VITE_BASE_PREV
  let path = `${path1}/document/download/${id}`
  console.log(path)

  // 如果文件大小超过 50GiB（53687091200 字节），则使用浏览器下载
  if (fileSize > 53687091200) {
    return new BrowserDownload(path, id, completeCallback, toastCallback)
  }

  // 创建 XMLHttpRequest 实例
  const req = new XMLHttpRequest()
  req.open('GET', path, true)
  req.responseType = 'blob'
  req.send()

  // 监听下载进度
  req.addEventListener('progress', (evt) => {
    let percentComplete = Math.round((evt.loaded / fileSize) * 100)
    if (progressCallback) progressCallback(id, percentComplete, evt.loaded, fileSize) // 更新进度
  })

  // 请求状态变化时处理
  req.onreadystatechange = () => {
    if (req.readyState === XMLHttpRequest.DONE) {
      let completeDownload = req.response.size == fileSize
      if (req.status === 200 && completeDownload) {
        const rspHeader = req.getResponseHeader('Content-Disposition')
        let filename = overrideFileName || 'download'
        if (rspHeader) {
          let rspHeaderDecoded = decodeURIComponent(rspHeader)
          filename = rspHeaderDecoded.split('"')[1]
        }

        if (completeCallback) completeCallback()
        downloadWithLink(window.URL.createObjectURL(req.response), filename)
      } else {
        if (req.getResponseHeader('Content-Type') === 'application/json') {
          const rspBody = JSON.parse(req.response)
          if (rspBody.detailedMessage) {
            errorCallback(rspBody.detailedMessage)
            return
          }
        }
        errorCallback('Unexpected response, download incomplete.')
      }
    }
  }

  req.onerror = () => {
    errorCallback('A network error occurred.')
  }

  req.onabort = () => {
    if (abortCallback) abortCallback()
  }

  // 返回 XMLHttpRequest 实例，以便可以控制下载操作（例如取消下载）
  return req
}

function downloadWithLink(blobUrl, filename) {
  const a = document.createElement('a')
  a.href = blobUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
