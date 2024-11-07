// 为了显示工作台 静态路由表当成初始值
// 拿到动态路由表之后 再次组合起来 左侧菜单既可以显示静态也可以显示动态

// 解决切换用户有缓存的bug
// 方案：在用户退出登录时 1. 调用清空路由记录的reset方法 2.手动把vuex中的数据也清空 3.把用户信息也清空
import { routes, resetRouter } from "@/router";
import { getProfileAPI } from "@/api/user.js";

export default {
  namespaced: true,
  state: {
    permission: [], // 存入动态筛选过后的路由表
    menuList:[],
  },
  mutations: {
    //修改权限标识
    setPermission(state, newPermission) {
      state.permission = newPermission;
    },
    //修改路由规则
    setMenuList(state, asyncRoutes) {
      state.menuList = [...routes, ...asyncRoutes];
    },
    // 退出清空路由
    clearRouter(state) {
      state.menuList = [];
      resetRouter();
    },
  },
  actions: {
    async getUserPermission(store) {
      const res = await getProfileAPI();
      store.commit("setPermission", res.data.permissions);
      return res.data.permissions;
    },
  },
};
