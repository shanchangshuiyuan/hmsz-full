import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

//静态路由  比如登录 404 首页 不需要权限
export const routes = [
  {
    path: "/login",
    component: () => import("@/views/Login/index"),
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/workbench",
  },
  {
    path: "/addCarCard",
    component: () => import("@/views/Car/CarCard/addCarCard"),
    hidden: true,
  },
  {
    path: "/addEnterprise",
    component: () => import("@/views/Park/Enterprise/AddEnterprise"),
    hidden: true,
  },
  {
    path: "/enterpriseDetail",
    component: () => import("@/views/Park/Enterprise/EnterpriseDetail"),
    hidden: true,
  },
  {
    path: "/addRole",
    component: () => import("@/views/System/Role/AddRole"),
    hidden: true,
  },
  {
    path: "/workbench",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/Workbench/index"),
        meta: { title: "工作台", icon: "el-icon-data-board" },
      },
    ],
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    mode: "history",
    scrollBehavior: () => ({ y: 0 }),
    routes: routes,
  });

const router = createRouter();

// 重置路由方法
export function resetRouter() {
  // 得到一个全新的router实例对象
  const newRouter = createRouter();
  // 使用新的路由记录覆盖掉老的路由记录
  router.matcher = newRouter.matcher;
}

export default router;
