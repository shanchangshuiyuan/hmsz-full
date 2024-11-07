import request from "@/utils/request";

// https://api-hmzs.itheima.net/v1/parking/card/list
/**
 * 获取月卡列表
 * @param {*} params
 * @returns
 */

export function getCardListAPI(params) {
  return request({
    url: "parking/card/list",
    method: "GET",
    params,
  });
}

//  https://api-hmzs.itheima.net/v1/parking/card

/**
 * 添加月卡API
 * @param {*} data
 * @returns
 */
export function addCarCardAPI(data) {
  return request({
    url: "parking/card",
    method: "POST",
    data,
  });
}

//  https://api-hmzs.itheima.net/v1/parking/card/detail/{id}
/**
 * 获取编辑页月卡详情
 * @param {*} id //点击编辑按钮时当前行的id
 * @returns
 */
export function getCardDeatailAPI(id) {
  return request({
    url: `parking/card/detail/${id}`,
  });
}

// https://api-hmzs.itheima.net/v1/parking/card/edit
/**
 * 编辑月卡
 * @param {*} data
 * @returns
 */
export function editCardAPI(data) {
  return request({
    url: "parking/card/edit",
    method: "PUT",
    data,
  });
}

//  https://api-hmzs.itheima.net/v1/parking/card/{ids}
/**
 * 删除月卡
 * @param {*} id 要删除数据的id
 * @returns 
 */
export function deleteCardAPI(id) {
  return request({
    url: `parking/card/${id}`,
    method: "DELETE",
  });
}
