<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input
        clearable
        placeholder="请输入内容"
        class="search-main"
        v-model="cardListParams.carNumber"
      />
      <span class="search-label">车主姓名：</span>
      <el-input
        clearable
        placeholder="请输入内容"
        class="search-main"
        v-model="cardListParams.personName"
      />
      <span class="search-label">状态：</span>
      <el-select v-model="cardListParams.cardStatus" placeholder="请选择">
        <el-option
          v-for="item in statusList"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-button type="primary" class="search-btn" @click="searchList"
        >查询</el-button
      >
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/addCarCard')"
        >添加月卡</el-button
      >
      <el-button @click="batchDeleteCard">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="cardList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="车主名称" prop="personName" />
        <el-table-column label="联系方式" prop="phoneNumber" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="车辆品牌" prop="carBrand" />
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate" />
        <el-table-column
          label="月卡状态"
          prop="cardStatus"
          :formatter="formatter"
        />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text">续费</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="editCard(scope.row.id)"
              >编辑</el-button
            >
            <el-button size="mini" type="text" @click="deleteCard(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="cardListParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <!-- 添加楼宇 -->
    <el-dialog title="添加楼宇" width="580px">
      <!-- 表单接口 -->
      <div class="form-container">
        <!-- <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="楼宇名称" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="楼宇层数" prop="floors">
            <el-input v-model="addForm.floors" />
          </el-form-item>
          <el-form-item label="在管面积" prop="area">
            <el-input v-model="addForm.area" />
          </el-form-item>
          <el-form-item label="物业费" prop="propertyFeePrice">
            <el-input v-model="addForm.propertyFeePrice" />
          </el-form-item>
        </el-form> -->
      </div>
      <template #footer>
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCardListAPI, deleteCardAPI } from "@/api/card";
export default {
  data() {
    return {
      //获取表格数据的参数
      cardListParams: {
        page: 1,
        pageSize: 2,
        carNumber: "",
        personName: "",
        cardStatus: null,
      },
      //表格列表数据
      cardList: [],

      //当前页数
      currentPage: 1,
      //页面总条数
      total: 0,

      //搜索筛选状态标志
      statusList: [
        {
          id: 0,
          label: "可用",
        },
        {
          id: 1,
          label: "已过期",
        },
        {
          id: null,
          label: "全部",
        },
      ],

      //批量选中状态
      multipleSelection: [],
    };
  },

  methods: {
    //获取月卡列表
    async getCardList() {
      const res = await getCardListAPI(this.cardListParams);
      this.cardList = res.data.rows;
      this.total = res.data.total;
    },

    formatter(row, column, cellValue, index) {
      const MAP = {
        0: "可用",
        1: "已过期",
      };
      return MAP[row.cardStatus];
    },

    //处理分页逻辑
    handleCurrentChange(page) {
      //将点击的页数赋值给请求参数页数
      this.cardListParams.page = page;
      this.getCardList();
    },
    handleSizeChange(pageSize) {
      this.cardListParams.pageSize = pageSize;
      this.getCardList();
    },

    //处理分页后序号逻辑
    indexMethod(index) {
      return (
        index +
        (this.cardListParams.page - 1) * this.cardListParams.pageSize +
        1
      );
    },
    //搜索逻辑
    searchList() {
      this.cardListParams.page = 1;
      this.getCardList();
    },

    //编辑按钮逻辑
    editCard(id) {
      this.$router.push({
        path: "/addCarCard",
        query: {
          id,
        },
      });
    },

    //删除按钮逻辑
    deleteCard(id) {
      this.$confirm("此操作将永久删除该数据吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //处理最后一页只有一条数据且该数据被删除的时候,需要重新渲染其前一页的数据
          if (this.cardList.length === 1 && this.cardListParams.page > 1) {
            await deleteCardAPI(id);
            this.cardListParams.page--;
            this.getCardList();
          } else {
            await deleteCardAPI(id);
            this.getCardList();
          }

          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //批量删除逻辑
    //批量选中状态
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    batchDeleteCard() {
      this.$confirm("此操作将永久删除该数据吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {

          const idList = this.multipleSelection.map(item=>item.id);
          const id = idList.join(',');
          
          //处理最后一页只有一条数据且该数据被删除的时候,需要重新渲染其前一页的数据
          if (this.cardList.length === idList.length && this.cardListParams.page > 1) {
            await deleteCardAPI(id);
            this.cardListParams.page--;
            this.getCardList();
          } else {
            await deleteCardAPI(id);
            this.getCardList();
          }

          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },

  mounted() {
    this.getCardList();
  },
};
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;
  .search-main {
    width: 220px;
    margin-right: 10px;
  }
  .search-btn {
    margin-left: 20px;
  }
}
.create-container {
  margin: 10px 0px;
}
.page-container {
  padding: 4px 0px;
  text-align: right;
}
.form-container {
  padding: 0px 80px;
}
</style>
