import request from "@/utils/request";

// 登录函数
/**
 * @description: 登录函数
 * @param {*} data { mobile,password}
 * @return {*} promise
 */
export function loginAPI(data) {
  return request({
    url: "/park/login",
    method: "POST",
    data,
  });
}

// https://api-hmzs.itheima.net/v1/parking/statistics/charge/typeProportion

export function getChargeTypeProportionAPI() {
  return request({
    url: "parking/statistics/charge/typeProportion",
  });
}


/**
 * @description: 获取用户信息
 * @param {*} data {}
 * @return {*} promise
 */
export function getProfileAPI() {
  return request({
    url: '/park/user/profile',
    method: 'GET'
  })
}
