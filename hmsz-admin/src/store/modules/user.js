import { loginAPI } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
export default {
  namespaced: true,
  state: {
    //优先从本地取
    token: getToken() || "",
  },
  mutations: {
    setToken(state, token) {
      state.token = token;

      // 本地存一份
      setToken(token);
    },

    removeToken(state){
      state.token = '';

      removeToken();
    }
  },
  actions: {
    async doLogin(ctx, data) {
      const res = await loginAPI(data);
      ctx.commit("setToken", res.data.token);
    },
  },
};
