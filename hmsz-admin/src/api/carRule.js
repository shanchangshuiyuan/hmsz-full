
import request from '@/utils/request'

/**
 * 获取规则列表
 * @param {*} params
 * @returns
 */
export function getRuleListAPI(params) {
  return request({
    url: '/parking/rule/list',
    method: 'GET',
    params
  })
}

/**
 * 创建规则
 * @returns
 */
export function createRuleAPI(data) {
    return request({
      url: '/parking/rule',
      method: 'POST',
      data
    })
  }
