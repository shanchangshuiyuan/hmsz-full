import axios from "axios";
import store from "@/store";
import { Message } from "element-ui";
import router from "@/router";

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    timeout: 5000, // request timeout
});

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        const token = store.state.user.token;
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        if (response.data.code !== 10000) {
            Message.error(response.data.msg);
            return Promise.reject(response.data);
        } else {
            return response.data;
        }
    },

    //统一错误处理
    (error) => {
        //判断token是否过期
        if (error.response.status === 401) {
            // token过期
            store.commit("user/removeToken");
            //清空token 跳转到login页
            router.push("/login");
        }

        Message.error(error.response.data.msg || "登录失败");

        return Promise.reject(error);
    }
);

export default service;