import request from '@/utils/request'

export function getBuildingListAPI(params) {
    return request({
        url: '/park/building',
        params
    })
}

export function getBuildingRentListAPI() {
    return request({
        url: '/park/rent/building'
    })
}

/**
 * 删除楼层租赁合同
 * @param {*} id 
 * @returns 
 */
// https://api-hmzs.itheima.net/v1/park/enterprise/rent/{id}
export function deleteRentAPI(id) {
    return request({
        url: `/park/enterprise/rent/${id}`,
        method: 'DELETE'
    })
}