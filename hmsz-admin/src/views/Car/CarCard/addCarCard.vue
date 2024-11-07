<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header
        :content="id ? '编辑月卡' : '增加月卡'"
        @back="$router.back()"
      />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <!--
            el-form： :model  :rules
            el-form-item:  prop指定要用哪条规则
            el-input  v-model双向绑定
           -->
          <el-form
            label-width="100px"
            :model="carForm"
            :rules="carRules"
            ref="carForm"
          >
            <el-form-item label="车主姓名" prop="personName">
              <el-input v-model="carForm.personName" />
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="carForm.phoneNumber" />
            </el-form-item>
            <el-form-item label="车辆号码" prop="carNumber">
              <el-input v-model="carForm.carNumber" />
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input v-model="carForm.carBrand" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">最新一次月卡缴费信息</div>
        <div class="form">
          <el-form
            label-width="100px"
            :model="paymentForm"
            :rules="paymentRules"
            ref="paymentForm"
          >
            <el-form-item label="有效日期" prop="cardDate">
              <el-date-picker
                v-model="paymentForm.cardDate"
                type="daterange"
                align="center"
                unlink-panels
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              >
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input v-model="paymentForm.paymentAmount" />
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select
                v-model="paymentForm.paymentMethod"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in paymentMethods"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetForm()">重置</el-button>
        <el-button type="primary" @click="comfirmForm">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { addCarCardAPI, getCardDeatailAPI, editCardAPI } from "@/api/card";
export default {
  data() {
    const validateCarNumber = (rule, value, callback) => {
      const carNumberRule =
        /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/;
      if (carNumberRule.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确格式的车牌号"));
      }
    };
    return {
      //车辆信息表单
      carForm: {
        personName: "",
        phoneNumber: "",
        carNumber: "",
        carBrand: "",
      },
      //车辆信息表单校验规则
      carRules: {
        personName: [
          {
            required: true,
            message: "车主姓名不能为空",
            trigger: "blur",
          },
        ],
        phoneNumber: [
          {
            required: true,
            message: "联系方式不能为空",
            trigger: "blur",
          },
          //正则校验
          {
            pattern:
              /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        carNumber: [
          {
            required: true,
            message: "车牌号不能为空",
            trigger: "blur",
          },
          {
            validator: validateCarNumber,
            trigger: "blur",
          },
        ],
        carBrand: [
          {
            required: true,
            message: "车辆品牌不能为空",
            trigger: "blur",
          },
        ],
      },
      //缴费信息表单
      paymentForm: {
        cardDate: "",
        paymentAmount: "",
        paymentMethod: "",
      },
      paymentRules: {
        cardDate: [
          {
            type: "array",
            required: true,
            message: "日期不能为空",
            trigger: "change",
          },
        ],
        paymentAmount: [
          {
            required: true,
            message: "支付金额不能为空",
            trigger: "blur",
          },
        ],
        paymentMethod: [
          {
            required: true,
            message: "支付方式不能为空",
            trigger: "blur",
          },
        ],
      },

      //支付方式
      paymentMethods: [
        {
          value: "Alipay",
          label: "微信",
        },
        {
          value: "WeChat",
          label: "支付宝",
        },
        {
          value: "Cash",
          label: "线下支付",
        },
      ],
    };
  },
  methods: {
    //确认按钮逻辑
    comfirmForm() {
      this.$refs.carForm.validate((valid) => {
        if (!valid) return;
        this.$refs.paymentForm.validate(async (valid) => {
          if (!valid) return;

          //校验通过 可向接口发送
          const data = {
            ...this.carForm,
            ...this.paymentForm,
            cardStartDate: this.paymentForm.cardDate[0],
            cardEndDate: this.paymentForm.cardDate[1],
          };
          delete data.cardDate;
          if (this.id) {
            await editCardAPI(data);
            this.$message.success("编辑月卡成功");
          } else {
            await addCarCardAPI(data);
            this.$message.success("新增月卡成功");
          }
          this.$router.back();
        });
      });
    },

    //表单重置功能
    resetForm() {
      this.$refs.carForm.resetFields();
      this.$refs.paymentForm.resetFields();
    },

    //点击编辑按钮数据回显逻辑
    async getCardDeatail() {
      const res = await getCardDeatailAPI(this.id);
      const {
        personName,
        phoneNumber,
        carNumber,
        carBrand,
        carInfoId,
        cardStartDate,
        cardEndDate,
        paymentMethod,
        paymentAmount,
        rechargeId,
      } = res.data;
      //负责数据回显的两个数组
      this.carForm = {
        personName,
        phoneNumber,
        carNumber,
        carBrand,
        carInfoId,
      };
      this.paymentForm = {
        paymentMethod,
        paymentAmount,
        rechargeId,
        cardDate: [cardStartDate, cardEndDate],
      };
    },
  },

  computed: {
    id() {
      return this.$route.query.id;
    },
  },

  created() {
    if (this.id) {
      this.getCardDeatail();
    }
  },
};
</script>

<style scoped lang="scss">
.add-card {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
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
    .preview {
      img {
        width: 100px;
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
}
</style>
