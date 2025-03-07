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
      if (type === 'file') {
        loadedBytes += chunk.byteLength
        const percent = Math.round((loadedBytes / fileSize) * 100)
        progressCallback?.(index, percent, loadedBytes, fileSize)
        controller.enqueue(chunk)
      } else {
        loadedBytes = fileSize
        const percent = 100
        progressCallback?.(index, percent, loadedBytes, fileSize)
        controller.enqueue(chunk)
      }
    },
  })

  const readWithTimeout = async (reader, timeout = 3000) => {
    let readCount = 0
    while (true) {
      try {
        const readPromise = reader.read()
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('流读取超时')), timeout),
        )
        const { done } = await Promise.race([readPromise, timeoutPromise])
        console.log(`读取完成，done=${done}`)
        if (done) break
      } catch (error) {
        console.error('流读取异常:', error)
        await reader.cancel()
        throw error
      }
    }
  }

  fetch(path, {
    headers: {
      userid: userId,
      token: token,
    },
    signal: controller.signal,
  })
    .then(async (response) => {
      console.log('响应状态:', response.status)

      if (!response.ok) {
        const error = await parseErrorResponse(response)
        throw new Error(error)
      }
      if (type === 'file') {
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
      } else {
        try {
          let percent = 100
          let loadedBytes = null
          progressCallback?.(index, percent, loadedBytes, fileSize)
          
          // 流式分块下载
          const reader = response.body.getReader()
          const chunks = []
          let receivedBytes = 0

          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            chunks.push(value)
            receivedBytes += value.byteLength
          }

          const blob = new Blob(chunks)
          console.log('最终Blob大小:', blob.size)

          // 文件名处理
          const filename = getFileName(response) || 'download.zip'
          // const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, '')
          // 使用优化后的下载方法
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.style.display = 'none'
          a.href = url
          a.download = filename.replace(/"/g, '')
          document.body.appendChild(a)
          a.click()
          setTimeout(() => {
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          }, 100)

          completeCallback?.(filename)
        } catch (error) {
          console.error('文件夹下载失败详情:', error)
          throw new Error(`压缩包下载失败: ${error.message}`)
        }
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

// 辅助函数：解析文件名
function getFileName(response) {
  const disposition = response.headers.get('Content-Disposition')
  if (!disposition) return null
  const filenameMatch = disposition.match(/filename\*?=(?:UTF-8''|)([^;]+)/i)
  return filenameMatch?.[1] ? decodeURIComponent(filenameMatch[1]) : null
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
