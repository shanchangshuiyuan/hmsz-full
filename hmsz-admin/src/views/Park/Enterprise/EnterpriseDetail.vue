<template>
    <div class="detail-enterprise">
      <header class="add-header">
        <el-page-header content="查看企业" @back="$router.back()" />
      </header>
      <main class="add-main">
        <div class="form-container">
          <div class="title">租赁记录</div>
          <div class="table-container">
            <el-table
              :data="rentList"
              style="width: 100%"
              border
            >
              <el-table-column
                type="index"
                label="序号"
                width="50"
              />
              <el-table-column
                prop="name"
                label="租赁楼宇"
                width="180"
              />
              <el-table-column
                label="租赁起止时间"
                width="280"
              >
                <template #default="{row}">
                  {{ row.startTime }} - {{ row.endTime }}
                </template>
              </el-table-column>
              <!--
                预览实现步骤
                 1. 提供一个现成的预览地址
                 2. 按照固定的形式 previewURL?src=合同文件地址 拼接起来
                 3. 使用a链接在一个新窗口打开
               -->
              <el-table-column
                label="租赁合同(点击预览)"
              >
                <template #default="{row}">
                  <a :href="`${previewURL}?src=${row.contractUrl}`" target="_blank">
                    <el-button type="text">
                      {{ row.contractName }}
                    </el-button>
                  </a>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="录入时间"
              />
              <!--
                下载功能
                  只需要通过一个a链接打开 浏览器识别你打开的是一个可下载的文件 就会自动触发下载功能
               -->
              <el-table-column
                prop="address"
                label="操作"
              >
                <template #default="{row}">
                  <a :href="row.contractUrl">
                    <el-button type="text">合同下载</el-button>
                  </a>
                </template>
              </el-table-column>
            </el-table>
          </div>
  
        </div>
      </main>
  
    </div>
  </template>
  
  <script>
  import { getEnterpriseDetailAPI } from '@/api/park'
  // 预览地址 固定的 由产品后端来提供
  const previewURL = 'https://view.officeapps.live.com/op/view.aspx'
  export default {
    data() {
      return {
        rentList: [],
        previewURL: previewURL
      }
    },
    mounted() {
      this.getDetail()
    },
    methods: {
      async getDetail() {
        const res = await getEnterpriseDetailAPI(this.$route.query.id)
        this.rentList = res.data.rent
      }
    }
  }
  </script>
  
  <style scoped lang="scss">
  .detail-enterprise {
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
        .arrow{
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
        margin-bottom: 20px;
        .title {
          height: 60px;
          line-height: 60px;
          padding-left: 20px;
        }
      }
      .table-container{
        padding:20px;
      }
      .preview{
        img{
          width: 100px;
        }
      }
    }
  }
  </style>
