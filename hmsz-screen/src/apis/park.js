// 获取园区信息

import request from '@/utils/request'

/**
 * 获取园区信息
 * @returns 
 */
// https://api-hmzs.itheima.net/v1/park/statistics/info
export function getParkInfoAPI() {
    return request({
        url: "/park/statistics/info"
    })
}