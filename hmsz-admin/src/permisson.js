import router from "@/router//index";
import store from "@/store/index";
import  asyncRoutes  from './router/asyncRoutes'


const whiteList = ["/login", "404"];

const getFirstRoutePermission = (permission) => {
  const firstPer = permission.map((item) => {
    return item.split(":")[0];
  });

  return [...new Set(firstPer)];
};

const getsecondRoutePermission = (permission) => {
  const newArr = permission.map(item => {
    const arr = item.split(':')
    return `${arr[0]}:${arr[1]}`
  })
  return [...new Set(newArr)]
};

// 根据权限标识过滤路由表
const getRoutes = (firstRoutePerms, secondRoutePerms, asyncRoutes) => {

  if (firstRoutePerms.includes('*')) {
    // 管理员
    return asyncRoutes
  }
  // 根据一级和二级对动态路由表做过滤 return出去过滤之后的路由表
  // 1. 根据一级路由对动态路由表做过滤
  return asyncRoutes.filter(route => {
    return firstRoutePerms.includes(route.permission);
  }).map(item => {
    // 2. 对二级路由做过滤
    return {
      ...item,
      children: item.children.filter(item => secondRoutePerms.includes(item.permission))
    }
  })
}

router.beforeEach(async (to, from, next) => {
  const token = store.state.user.token;

  if (token) {
    // 有token
    if (to.path === "/login") {
      //有token并且访问登录页 跳转到首页
      next("/");
    } else {
      //有token并且访问登录页 可继续执行
      next();
      const res = await store.dispatch("menu/getUserPermission");

      //一级路由标识
      const firstPermission = getFirstRoutePermission(res);

      //二级路由标识
      const secondPermission = getsecondRoutePermission(res);

      const routes = getRoutes(firstPermission, secondPermission, asyncRoutes);


      routes.forEach(route => {
        router.addRoute(route)
      })
      // 5. 调用mutation函数把路由表存入vuex
      store.commit('menu/setMenuList', routes);   

   

    }
  } else {
    //无token
    if (whiteList.includes(to.path)) {
      // 无token 并且访问 白名单页 可访问
      next();
    } else {
      //无token 并且访问不是白名单页 跳转到登录页
      next("/login");
    }
  }
});
