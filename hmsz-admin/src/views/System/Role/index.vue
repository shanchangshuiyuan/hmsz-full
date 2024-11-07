<template>
  <div class="role-container">
    <div class="left-wrapper">
      <!--
        思路：tab切换类交互的实现通用思路
         1. 点击谁就把谁的index值记录下来(需要一个独一无二的标识就可以 id)
         2. 通过动态控制class类名 active  :class="{active: index === 当前项的下标值}"
       -->
      <div
        v-for="(item,index) in roleList"
        :key="item.roleId"
        class="role-item"
        :class="{active: currentIndex === index}"
        @click="switchTab(index)"
      >
        <div class="role-info">
          <!--
            是一个组件 而且还是一个全局组件
            1. 传入不同的iconClass就会显示不同的图标
            2. 图标名来自于icons文件夹下的svg文件夹下的所有可选图标的名称

            目标：根据当前谁被激活 显示激活的图标
            未激活 user 激活的图标 user-active
           -->
          <svg-icon :icon-class="currentIndex === index ?'user-active':'user'" class="icon" />
          {{ item.roleName }}
        </div>
        <div class="more">
          <el-dropdown>
            <span class="el-dropdown-link">
              <svg-icon icon-class="more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="goEdit(item.roleId)">编辑角色</el-dropdown-item>
              <el-dropdown-item @click.native="deleteRole(item.roleId)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-button class="addBtn" size="mini" @click="$router.push('/addRole')">添加角色</el-button>
    </div>
    <div class="right-wrapper">
      <el-tabs v-model="activeName">
        <el-tab-pane label="功能权限" name="first">
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <div class="tree-title"> {{ item.title }} </div>
              <el-tree
                ref="tree"
                :data="item.children"
                :props="defaultProps"
                :show-checkbox="true"
                node-key="id"
                default-expand-all
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="成员列表" name="second">
          <div class="user-wrapper">
            <el-table
              :data="roleUserList"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                width="250"
                label="序号"
              />
              <el-table-column
                prop="name"
                label="员工姓名"
              />
              <el-table-column
                prop="userName"
                label="登录账号"
              />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>

<script>
import { getRoleListAPI, getTreeListAPI, getRoleDetailAPI, getRoleUserAPI, delRoleUserAPI } from '@/api/system'

// 递归添加disabled属性
// 重复的执行同一个函数 目的是为针对于每一层中的每一个对象都执行相同的逻辑
// 相同的逻辑：遍历数组 给每一项都添加一个属性disable
// 判断：递归的结束条件 必须有子集数组 才去调用这个函数
function addDisabled(treeList) {
  treeList.forEach(item => {
    item.disabled = true
    if (item.children) {
      addDisabled(item.children)
    }
  })
}
export default {
  name: 'Role',
  data() {
    return {
      roleList: [], // 角色列表
      currentIndex: 0,
      treeList: [], // 树形列表
      defaultProps: {
        children: 'children',
        label: 'title',
        disabled: (data, node) => {
          return true
        }
      },
      activeName: 'first',
      roleUserList: [] // 成员列表
    }
  },
  async mounted() {
    await this.getRoleList()
    await this.getTreeList()
    // 组件初始化的时候模拟点击一下第一项
    // 1. this.roleList不能是空 2.treeList也不能为空  意味着需要等到上面的俩个方法中的异步请求返回之后才能拿调用
    // switcheTab方法
    this.switchTab(0)
  },
  methods: {
    goEdit(roleId) {
      console.log('去编辑')
      this.$router.push({
        path: '/addRole',
        query: {
          roleId
        }
      })
    },
    async highLightPerms(roleId) {
      // 1. 使用id获取高亮权限点列表
      const res = await getRoleDetailAPI(roleId)
      const perms = res.data.perms
      // 2. 遍历tree实例组成的数组 分别调用它身上的高亮方法 传入需要高亮的权限点数据
      this.$refs.tree.forEach((treeInstance, index) => {
        treeInstance.setCheckedKeys(perms[index])
      })
    },
    async getUserMember(roleId) {
      // 实现成员列表的接口调用
      const resMemeber = await getRoleUserAPI(roleId)
      this.roleUserList = resMemeber.data.rows
    },
    async switchTab(index) {
      this.currentIndex = index
      // 拿到当前的角色id
      const roleId = this.roleList[index].roleId
      this.highLightPerms(roleId)
      this.getUserMember(roleId)
    },
    async getRoleList() {
      const res = await getRoleListAPI()
      this.roleList = res.data
    },
    async getTreeList() {
      const res = await getTreeListAPI()
      // 直接赋值 没有disabled为true
      // 思路: 针对于treeList中的每一项（每一层中的每一项）都动态添加一个disabled为true
      this.treeList = res.data
      // addDisabled(this.treeList)
    },

    deleteRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示',).then(async () => {
        await delRoleUserAPI(id)
        this.$message.success('删除成功');
        this.getRoleList()
      }).catch(() => {
        this.$message.info('已取消删除');
      })
    }
  }
}
</script>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  padding:10px;
  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
      }
    }

    .more {
      display: flex;
      align-items: center;
    }
    .addBtn{
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;

      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
        padding: 0px 4px;
        text-align: center;
        .tree-title {
          background: #f5f7fa;
          text-align: center;
          padding: 10px 0;
          margin-bottom: 12px;
        }
      }
    }

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper{
      padding:20px;
    }
  }
}
</style>
