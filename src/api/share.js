import request from '@/utils/request.js'
const path = import.meta.env.VITE_BASE_PREV

export const share = (id) => {
  return request({
    url: `${path}/document/share/${id}`,
    method: 'get',
  })
}
