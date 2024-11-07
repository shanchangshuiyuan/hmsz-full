import request from '@/utils/request'

/**
 * 获取企业列表
 * @param {*} params {page,pageSize,name}
 * @returns
 */
export function getListAPI(params) {
    return request({
        url: '/park/enterprise',
        params
    })
}

/**
 * 获取行业列表
 * @returns
 */
export function getIndustryListAPI() {
    return request({
        url: '/park/industry'
    })
}

/**
 * 创建企业
 * @param {*} data
 * @returns
 */
export function createEnterpriseAPI(data) {
    return request({
        url: '/park/enterprise',
        method: 'POST',
        data
    })
}

/**
 * 更新企业
 * @param {*} data
 * @returns
 */
export function updateEnterpriseAPI(data) {
    return request({
        url: '/park/enterprise',
        method: 'PUT',
        data
    })
}

/**
 * 获取企业详情
 * @param {*} id
 * @returns
 */
export function getEnterpriseDetailAPI(id) {
    return request({
        url: `/park/enterprise/${id}`
    })
}

/**
 * 给当前企业添加合同
 * @param {*} data
 * @returns
 */
export function addRentAPI(data) {
    return request({
        url: '/park/enterprise/rent',
        method: 'POST',
        data
    })
}

/**
 * 获取合同列表
 * @param {*} id
 * @returns
 */
export function getRentListAPI(id) {
    return request({
        url: `/park/enterprise/rent/${id}`
    })
}

/**
 * 退租
 * @param {合同id} rentId
 * @returns
 */

export function outRentAPI(rentId) {
    return request({
        url: `/park/enterprise/rent/${rentId}`,
        method: 'PUT'
    })
}


// https://api-hmzs.itheima.net/v1/park/enterprise/{id}
/**
 *  删除企业
 * @param {*} id 
 * @returns 
 */
export function deleteEnterpriseAPI(id) {
    return request({
        url: `/park/enterprise/${id}`,
        method: 'DELETE'
    })
}