<template>
  <div class="add-role">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>添加角色</span>
      </div>
      <div class="right">
        黑马程序员
      </div>
    </header>
    <main class="add-main">
      <div class="step-container">
        <el-steps direction="vertical" :active="currentActive">
          <el-step title="角色信息" />
          <el-step title="权限信息" />
          <el-step title="检查并完成" />
        </el-steps>
      </div>
      <!--
        v-if: 真实的dom创建和移除
        v-show: 操作的只是css样式的变化  原因: 步骤切换的时候有可能回退 保证dom之前操作过的状态还在
       -->
      <div v-show="currentActive === 1" class="form-container">
        <div class="title">角色信息</div>
        <div class="form">
          <el-form ref="infoForm" class="form-box" :model="roleForm" :rules="roleRules">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" />
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="roleForm.remark" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-show="currentActive === 2" class="form-container">
        <div class="title">权限配置</div>
        <div class="form">
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <div class="tree-title">{{ item.title }}</div>
              <el-tree
                ref="tree"
                :data="item.children"
                show-checkbox
                default-expand-all
                node-key="id"
                highlight-current
                check-strictly
                :props="{ label: 'title' }"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-show="currentActive === 3" class="form-container">
        <div class="title">检查并完成</div>
        <div class="form">
          <div class="info">
            <div class="form-item">角色名称：{{ roleForm.roleName }}</div>
            <div class="form-item">角色描述：{{ roleForm.remark }}</div>
            <div class="form-item">角色权限：</div>
            <div class="tree-wrapper">
              <div v-for="item in disableTreeList" :key="item.id" class="tree-item">
                <div class="tree-title">{{ item.title }}</div>
                <!--
                  在内部通过遍历数组生成每一个树节点的时候 检测当前props选项中
                  是否传入了一个配置项 叫做disabled 如果传入了 调用这个方法拿到它的返回值
                  如果当前拿到的是true 就把当前项禁用掉 如果没有返回true 不禁用

                  arrary.some(item=> 判断条件)
                 -->
                <el-tree
                  ref="diabledTree"
                  :data="item.children"
                  show-checkbox
                  default-expand-all
                  check-strictly
                  node-key="id"
                  :highlight-current="false"
                  :props="{ label: 'title', disabled:()=>true}"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <!--
        上一步按钮 只有currentAcitve > 1 才显示
        下一步按钮 等于3不显示
       -->
      <div class="btn-container">
        <el-button v-if="currentActive>1" @click="prev">上一步</el-button>
        <el-button v-if="currentActive !== 3" type="primary" @click="next">下一步</el-button>
        <el-button v-if="currentActive === 3" type="primary" @click="confirmAdd">确认添加</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { getTreeListAPI, addRoleAPI, getRoleDetailAPI, updateRoleAPI } from '@/api/system'
export default {
  data() {
    return {
      currentActive: 1,
      roleForm: {
        roleName: '',
        remark: ''
      },
      roleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      treeList: [], // tree列表
      disableTreeList: [], // 回填显示的树列表
      permsList: [] // 存入选中项节点
    }
  },
  computed: {
    roleId() {
      return this.$route.query.roleId
    }
  },
  async mounted() {
    await this.getTreeList()
    if (this.roleId) {
      this.getDetail()
    }
  },
  methods: {
    async getDetail() {
      const res = await getRoleDetailAPI(this.roleId)
      const { perms, roleName, remark } = res.data
      this.roleForm.roleName = roleName
      this.roleForm.remark = remark
      // 回填树  setCheckedKeys
      this.$refs.tree.forEach((treeInstance, index) => {
        treeInstance.setCheckedKeys(perms[index])
      })
    },
    async confirmAdd() {
      if (this.roleId) {
        await updateRoleAPI({
          roleId: this.roleId,
          ...this.roleForm,
          perms: this.permsList
        })
      } else {
        await addRoleAPI({
          ...this.roleForm,
          perms: this.permsList
        })
      }

      this.$router.back()
    },
    async getTreeList() {
      const res = await getTreeListAPI()
      this.treeList = res.data
      // 在disabledTreeList中放一份数据 因为数组是引用类型 在进行赋值的时候实际上赋值是数据的引用
      // 也就是说这俩份数据实际指向的是同一个内存区域（堆内存） 一个修改另一个也会受到影响
      // 解决办法：深拷贝
      this.disableTreeList = JSON.parse(JSON.stringify(res.data))
    },
    prev() {
      if (this.currentActive === 1) return
      this.currentActive--
    },
    next() {
      if (this.currentActive === 3) return
      // 在角色信息这个状态下 做表单校验 如果校验通过 才能进入到下一个状态 （this.currentActive++）
      if (this.currentActive === 1) {
        // 处在角色信息状态
        this.$refs.infoForm.validate(valid => {
          if (valid) {
            this.currentActive++
          }
        })
      } else if (this.currentActive === 2) {
        // 选择权限信息的状态
        // 目标：判断用户至少选择了一项
        // 思路: 获取到用户选择了什么 把每一项的数组展开合并为一个大数组 如果这个大数组长度大于零证明至少选中了一项
        this.permsList = []
        this.$refs.tree.forEach(treeInstance => {
          const keys = treeInstance.getCheckedKeys()
          console.log(keys)
          this.permsList.push(keys)
        })
        if (this.permsList.flat().length === 0) {
          // 没有选中
          return this.$message({
            type: 'warning',
            message: '请至少选择一项'
          })
        } else {
          this.currentActive++
          // 回填树形结构
          this.$refs.diabledTree.forEach((treeInstance, index) => {
            treeInstance.setCheckedKeys(this.permsList[index])
          })
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
.add-role {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }

      .arrow {
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    position: fixed;
    top: 64px;
    bottom: 88px;
    width: 100%;
    overflow-y: auto;
    background: #f4f6f8;
    padding: 20px 230px;
    display: flex;
    .step-container {
      height: 400px;
      width: 200px;
    }
    .form-container {
      flex:1;
      background-color: #fff;
      overflow-y: auto;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .el-form {
          display: flex;
          flex-wrap: wrap;
        }
        .info{
          font-size:14px;
          color:#666;
          .form-item{
            margin-bottom:20px;
          }
        }
      }
      .form-box{
        width: 600px;
        display: flex;
        flex-direction: column;
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
    z-index: 10001;
  }
  .tree-wrapper {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .tree-item {
        flex: 1;
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
}
</style>
