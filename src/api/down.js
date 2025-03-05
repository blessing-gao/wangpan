import { GET_PACEID } from '@/utils/auth'
export function downloadFile(
  fileSize,
  overrideFileName = null,
  id,
  index,
  progressCallback,
  completeCallback,
  errorCallback,
  abortCallback,
  toastCallback,
  userId,
  token,
  type,
) {
  const path1 = import.meta.env.VITE_BASE_PREV
  const path = `${path1}/document/download/${id}?spaceId=${GET_PACEID()}`
  const controller = new AbortController()

  // 大文件处理保持原逻辑
  if (fileSize > 53687091200) {
    return new BrowserDownload(path, id, completeCallback, toastCallback)
  }

  let loadedBytes = 0
  const progressTracker = new TransformStream({
    transform(chunk, controller) {
      loadedBytes += chunk.byteLength
      const percent = Math.round((loadedBytes / fileSize) * 100)
      progressCallback?.(index, percent, loadedBytes, fileSize)
      controller.enqueue(chunk)
    },
  })

  fetch(path, {
    headers: {
      userid: userId,
      token: token,
    },
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = await parseErrorResponse(response)
        throw new Error(error)
      }

      const reader = response.body.pipeThrough(progressTracker).getReader()
      const chunks = []
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
      }

      const blob = new Blob(chunks)
      // 仅对文件类型校验大小
      if (type === 'file' && blob.size != fileSize) {
        throw new Error('下载文件不完整')
      }

      // 处理文件名（优化正则匹配）
      const disposition = response.headers.get('Content-Disposition')
      let filename = type === 'file' ? overrideFileName : 'download.zip'
      const filenameMatch = disposition?.match(
        /filename\*?=(?:UTF-8''|utf-8'')?"?([^";]+)"?/i,
      )
      if (filenameMatch && filenameMatch[1]) {
        filename = decodeURIComponent(filenameMatch[1])
      }

      // 优化下载逻辑
      const blobUrl = URL.createObjectURL(blob)
      try {
        downloadWithLink(blobUrl, filename)
        completeCallback?.(filename)
      } finally {
        URL.revokeObjectURL(blobUrl)
      }
    })
    .catch((error) => {
      if (error.name === 'AbortError') {
        abortCallback?.()
      } else {
        errorCallback?.(error.message)
      }
    })

  return {
    abort: () => controller.abort(),
    signal: controller.signal,
  }
}

// 辅助函数解析错误响应
async function parseErrorResponse(response) {
  const contentType = response.headers.get('Content-Type')
  if (contentType?.includes('application/json')) {
    const errorBody = await response.json()
    return errorBody.detailedMessage || '未知错误'
  }
  return `HTTP错误 ${response.status}`
}

function downloadWithLink(blobUrl, filename) {
  const a = document.createElement('a')
  a.href = blobUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
