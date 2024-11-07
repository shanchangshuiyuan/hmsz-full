// 放置全局指令
import Vue from 'vue'
import store from '@/store'
// 封装和按钮权限控制相关的指令

// 实现流程

const adminPerms = '*:*:*';

// 1. 全局指令的定义方式 - 没有任何功能指令模版代码跑通
Vue.directive('permission', {
  // 指令绑定的元素被渲染到dom中时自动执行
  inserted(el, binding) {
    // el: 指令绑定到的那个dom元素 - button
    // binding.value: 指令的绑定值  v-btn-auth="指令绑定值"
    // 2. 在指令中添加控制按钮显示和隐藏的逻辑
    // 核心逻辑：判断当前按钮独有的权限标识是否在我们的perms中找到 如果找得到 就显示 找不到就隐藏

    

    const btnPerm = binding.value // 当前按钮独有的标识 固定的 和后端商量好的
    const perm = store.state.menu.permission;
    //单独处理管理员权限
    if(perm.includes(adminPerms)){
        return;
    }
    if (!perm.includes(btnPerm)) {
      el.remove()
    }
  }
})

