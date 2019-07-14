<%--
@Project Name: vue-admin
@Author: luichooy
@Date: 2017-11-16 12:27
@Email: luichooy@163.com
@Idea: WebStorm
--%>

<template>
  <div class='basic'>
    <el-form ref="filters" :model="filters" label-width="80px">
      <el-row>
        <el-col :span="4">
          <el-form-item label="章节号" prop="ATAChapterNumb">
            <el-input v-model="filters.ATAChapterNumb"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="章节名字" prop="ATAChapterName">
            <el-input v-model="filters.ATAChapterName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button type="primary" v-on:click="getATAChapterServerData">查询</el-button>
            <el-button type="primary" v-on:click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span='24'>
        <el-card>
          <div slot="header">
            基本表格（包含自定义模板，filter，分页组件）
          </div>
          <div class="table-wrapper">
            <el-table
              v-loading="loading"
              element-loading-text="加载数据中"
              :data='tableData'
              border
              :row-class-name="addRowClass">
              <!--<el-table-column label="序号" prop="ATA_NO" align="center" width="70"></el-table-column>-->
              <el-table-column label="章节号" prop="actype" align="center" min-width="30%"></el-table-column>
              <el-table-column label="章节名字" prop="acmake" min-width="45%"></el-table-column>
              <!--<el-table-column label="操作人" prop="ATAChapterOperUser" align="center" width="150"></el-table-column>
              <el-table-column label="操作时间" prop="ATAChapterOperDate" align="center" width="180"></el-table-column>-->
              <el-table-column label="操作" min-width="25%" align="center">
                <template scope="scope">
                  <el-button type="plain" size="small" icon="el-icon-edit" circle  @click="handleEdit(scope.$index, scope.row)"></el-button>
                  <el-button type="plain" size="small" icon="el-icon-delete" circle  @click="handleDel(scope.$index, scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              style="margin-top: 16px; text-align:right;"
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[5, 10, 15, 20]"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange">
            </el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style>
  .el-row {
    margin-bottom: 20px;
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .el-table td, .el-table th {
    padding: 8px 0;
  }
</style>
<script src="../../../data/ATAChapter.js"></script>

