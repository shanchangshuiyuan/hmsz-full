<template>
  <div class="add-enterprise">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"
          ><i class="el-icon-arrow-left" />返回</span
        >
        <span>|</span>
        <span>{{ id ? "编辑企业" : "添加企业" }}</span>
      </div>
      <div class="right">黑马程序员</div>
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="form">
          <el-form
            ref="ruleForm"
            :model="addForm"
            :rules="addRules"
            label-width="100px"
          >
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              <el-input v-model="addForm.legalPerson" />
            </el-form-item>
            <el-form-item label="注册地址" prop="registeredAddress">
              <el-input v-model="addForm.registeredAddress" />
            </el-form-item>
            <el-form-item label="所在行业" prop="industryCode">
              <el-select v-model="addForm.industryCode" @focus="selectFocus">
                <el-option
                  v-for="item in industryList"
                  :key="item.industryCode"
                  :value="item.industryCode"
                  :label="item.industryName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="企业联系人" prop="contact">
              <el-input v-model="addForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="addForm.contactNumber" />
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicenseId">
              <!--
                  action本来是一个用来配置默认上传的接口地址的
                  因为我们覆盖了 所以用一个#占个位置 消除必填警告
  
                  input type="file" 本身具备选择文件的能力
                  覆盖原因: 默认的配置上传不够灵活 仅支持一些简单的上传 如果想要完全自定义上传行为 http-request
  
                  在选择文件之后 自动执行upload函数 并且把一个对象给到我们 对象中有一个file属性 就是我们要上传的文件对象
  
                  上传前校验
                   1. 上传图片之前加一层校验 目的为了限制用户上传的文件类型和大小
                   2. 如果我们添加了before-upload这个属性方法 这个函数中必须return的数据为true
                   才会继续执行 upload 方法 如果校验不过 暂停执行 不会走上传逻辑
                   3. file对象中俩个属性
                      size  文件大小 /1024/1024 = M
                      type  文件类型 image/文件类型
                 -->
              <el-upload
                class="upload-demo"
                action="#"
                :http-request="upload"
                :before-upload="beforeUpload"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传png图片，且不超过5M
                </div>
              </el-upload>
              <img :src="addForm.businessLicenseUrl" alt="" class="img" />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button>重置</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import {
  updateEnterpriseAPI,
  getIndustryListAPI,
  createEnterpriseAPI,
  getEnterpriseDetailAPI,
} from "@/api/park";
import { uploadAPI } from "@/api/common";
export default {
  data() {
    const validatePhone = (rule, value, cb) => {
      if (/^1[3-9]\d{9}$/.test(value)) {
        cb();
      } else {
        cb(new Error("请输入正确手机号"));
      }
    };
    return {
      addForm: {
        name: "", // 企业名称
        legalPerson: "", // 法人
        registeredAddress: "", // 注册地址
        industryCode: "", // 所在行业
        contact: "", // 企业联系人
        contactNumber: "", // 联系人电话
        businessLicenseUrl: "", // 营业执照url
        businessLicenseId: "", // 营业执照id
      },
      addRules: {
        name: [{ required: true, message: "企业名称为必填", trigger: "blur" }],
        legalPerson: [
          { required: true, message: "法人为必填", trigger: "blur" },
        ],
        registeredAddress: [
          { required: true, message: "注册地址为必填", trigger: "blur" },
        ],
        industryCode: [
          { required: true, message: "所在行业为必填", trigger: "blur" },
        ],
        contact: [
          { required: true, message: "企业联系人为必填", trigger: "blur" },
        ],
        contactNumber: [
          { required: true, message: "企业联系人电话为必填", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" },
        ],
        businessLicenseId: [
          { required: true, message: "请上传营业执照", trigger: "blur" },
        ],
      },
      industryList: [], // 行业列表
    };
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
  },
  mounted() {
    // 模版的渲染会等待这个接口返回吗？
    // 不是
    // 首先会以data中默认的数据完成第一次渲染
    // 等到接口数据返回之后 由于响应式数据的变化 视图会跟着一起变 完成二次渲染
    this.getIndustryList();
    if (this.id) {
      this.getDetail();
    }
  },
  methods: {
    async getDetail() {
      const res = await getEnterpriseDetailAPI(this.id);
      this.addForm = res.data;
    },
    // 聚焦时出发
    selectFocus() {
      this.getIndustryList();
    },
    // 获取行业列表
    async getIndustryList() {
      const res = await getIndustryListAPI();
      this.industryList = res.data;
    },
    async upload(res) {
      console.log(res);
      // file：要上传给后端接口的文件对象
      const { file } = res;
      // 上传文件
      // 1. 按照接口要求准备一个符合类型的formData对象 然后把参数加入进去
      const fd = new FormData(); // formData实例对象 内部是空的
      fd.append("file", file);
      fd.append("type", "businessLicense");
      // 2. 调用接口
      const _res = await uploadAPI(fd);
      this.addForm.businessLicenseId = _res.data.id;
      this.addForm.businessLicenseUrl = _res.data.url;
      // 上传之后对营业执照id做校验(保证先上传完毕 赋值成功之后 再做校验)
      /**
         1. 为什么要单独对这个上传做校验？
            上传组件在上传完毕之后 已经有图片了 但是错误提示没有消失掉
            el-form组件校验逻辑里面  el-input el-select 当有值之后会自动完成校验
  
         2. 怎么做？
            validateField  表单组件的实例方法 参数要单独校验哪个字段 就把它传入
            通过我们传入的字段 去自动查找当前字段是否符合规则要求 如果符合 清空错误提示
         */
      this.$refs.ruleForm.validateField("businessLicenseId");
    },
    beforeUpload(file) {
      console.log(file);
      const isPNG = file.type === "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isPNG) {
        this.$message.error("上传合同文件只能是 PNG 格式!");
      }
      if (!isLt5M) {
        this.$message.error("上传合同文件大小不能超过5MB!");
      }
      return isPNG && isLt5M;
    },
    confirmAdd() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          // TODO
          if (this.id) {
            // 更新接口
            const {
              name,
              id,
              legalPerson,
              registeredAddress,
              industryCode,
              businessLicenseId,
              businessLicenseUrl,
              contact,
              contactNumber,
            } = this.addForm;
            await updateEnterpriseAPI({
              name,
              id,
              legalPerson,
              registeredAddress,
              industryCode,
              businessLicenseId,
              businessLicenseUrl,
              contact,
              contactNumber,
            });
          } else {
            await createEnterpriseAPI(this.addForm);
          }

          this.$message.success(`${this.id ? "更新成功" : "新增成功"}`);
          this.$router.back();
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.add-enterprise {
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
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;
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
          .el-form-item {
            width: 50%;
          }
        }
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
  }
  .img {
    width: 150px;
    height: 150px;
    border-radius: 4px;
  }
}
</style>
