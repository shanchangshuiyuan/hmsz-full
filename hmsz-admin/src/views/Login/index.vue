<template>
  <div class="login_body">
    <div class="bg" />
    <div class="box">
      <div class="title">智慧园区-登录</div>
      <el-form ref="form" :model="formData" :rules="rules">
        <el-form-item label="账号" prop="username">
          <el-input v-model="formData.username" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" show-password />
        </el-form-item>

        <el-form-item prop="remember">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login_btn" @click="login_bnt"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { FORMDATA_KEY } from "@/constants/KEY";
export default {
  name: "Login",
  data() {
    return {
      formData: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
      rememberMe: true,
    };
  },
  methods: {
    login_bnt() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return;
        }
        await this.$store.dispatch("user/doLogin", this.formData);
        //记住我功能的实现
        if (this.rememberMe) {
          localStorage.setItem(FORMDATA_KEY, JSON.stringify(this.formData));
        } else {
          localStorage.removeItem(FORMDATA_KEY);
        }

        //实现从哪个页面退出登录，登录后跳转哪个页面
        const routeData = this.$route.query.redirect;

        //路由跳转
        if (routeData) {
          this.$router.push(routeData);
        } else {
          this.$router.push("/");
        }
      });
    },
  },

  created() {
    const { username, password } = JSON.parse(
      localStorage.getItem(FORMDATA_KEY)
    );
    this.formData.username = username;
    this.formData.password = password;
  },
};
</script>

<style scoped lang="scss">
.login_body {
  display: flex;
}
.bg {
  width: 60vw;
  height: 100vh;
  background: url("~@/assets/login-bg.svg") no-repeat;
  background-position: right top;
  background-size: cover;
}
.box {
  margin: 200px 10% 0;
  flex: 1;
  .title {
    padding-bottom: 76px;
    font-size: 26px;
    font-weight: 500;
    color: #1e2023;
  }
  ::v-deep() {
    .ant-form-item {
      display: flex;
      margin-bottom: 62px;
      flex-direction: column;
    }
    .ant-form-item-label label {
      font-size: 16px;
      color: #8b929d;
    }
    .ant-input,
    .ant-input-password {
      border-radius: 8px;
    }
  }
}
.login_btn {
  width: 100%;
}
</style>
