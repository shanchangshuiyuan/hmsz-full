import request from '@/utils/request'

/**
 * 上传接口
 * @param {*} data
 * @returns
 */
export function uploadAPI(data) {
  return request({
    url: '/upload',
    method: 'POST',
    data
  })
}
