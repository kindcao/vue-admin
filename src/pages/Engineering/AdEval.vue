<template>
  <div class='basic'>
    <el-form ref="filters" :model="filters">
      <el-row>
        <el-col :span="10">
          <el-form-item prop="adKeyword" style="margin-left: -20px">
            <el-input v-model="filters.adEvalNumb" size="medium" placeholder="请输入AD号码或描述"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="issueAuthId">
            <el-select v-model="filters.issueAuthId" placeholder="请选择适航局" style="width:100%">
              <el-option  v-for="item in ADAdd_AuthorityList" :key="item.id" :label="item.authName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item>
            <el-button type="primary" v-on:click="queryData" size="small">查询</el-button>
            <el-button type="primary" v-on:click="reset" size="small">重置</el-button>
            <router-link :to="{ name: 'ADCompEvalAdd', params: { id: '', action: 'add' }}"> <el-button type="primary">新增</el-button></router-link>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2">
          <el-form-item prop="adCompVer" style="width:110px;margin-left: -20px">
            <el-input type="number" v-model.number="filters.adCompVer" size="medium" placeholder="版本" style="width:70px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="adDateEffStart" style="width:100px;">
            <el-date-picker type="date" placeholder="自生效日期" v-model="filters.adDateEffStart" size="medium" style="width:140px"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="adDateEffEnd" style="width:100px;margin-left: -35px">
            <el-date-picker type="date" placeholder="到生效日期" v-model="filters.adDateEffEnd" size="medium" style="width:140px"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="5" style="margin: -2px 0px">
          <el-form-item prop="cnstIdStatus">
            <el-radio-group v-model="filters.cnstIdStatus" size="mini">
              <el-radio-button v-for="(item,index) in ADAdd_ADApplyStatus" :label="item.cnstId" :key="item.cnstId">{{item.descTxt}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="9" style="margin: -2px 0px 0px -10px">
          <el-form-item prop="cnstIdComp">
            <el-radio-group v-model="filters.cnstIdComp" size="mini">
              <el-radio-button v-for="(item,index) in ADAdd_CnstValCompIdList" :label="item.cnstId" :key="item.cnstId">{{item.descTxt}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='24'>
          <el-table
            :data="tableData" border
            style="width: 100%">
            <el-table-column type="expand" style="background: red" class="expand-column-bg" >
              <template slot-scope="props">
                <el-form label-width="90px" :inline="false">
                  <el-row>
                    <el-col :span="6" style="height: 30px;line-height: 30px">
                      <el-form-item label="适航局">
                        <span>{{ props.row.issueAuthId }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="适航指令号">
                        <span>{{ props.row.adCompNum }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="版本">
                        <span>{{ props.row.adCompVer }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="描述" class="item_content">
                        <template slot-scope="scope">
                          <el-popover placement="top-start" title="适航文件标题" width="400" trigger="hover" >
                            <div style="font-size: 9pt">{{props.row.adCompName}}</div>
                            <span slot="reference">{{ props.row.adCompName.substr(0,120)+'...' }}</span>
                          </el-popover>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="生效日期">
                        <span>{{ props.row.adDateEff }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="操作人">
                        <span>{{ props.row.updateById }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
                      <el-form-item label="操作时间">
                        <span>{{ props.row.updateTime }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-tabs type="border-card">
                        <el-tab-pane>
                          <span slot="label"><i class="el-icon-bank-card"></i> 适用列表</span>
                          <el-form-item label="适用部件">
                            <span>{{ props.row.cnstIdCompText }}</span>
                          </el-form-item>
                          <el-table
                            v-loading="loading"
                            element-loading-text="加载数据中"
                            :data="props.row.applyList"
                            border>
                            <el-table-column label="编号" prop="id" align="center" width="70"></el-table-column>
                            <el-table-column label="注册号" prop="acReg"  min-width="25%"></el-table-column>
                            <el-table-column label="机身序号" prop="acSn" min-width="25%"></el-table-column>
                            <el-table-column label="适用部件" prop="cnstIdComp" min-width="30%"></el-table-column>
                            <el-table-column label="状态" prop="cnstIdStatus"  min-width="20%"></el-table-column>
                          </el-table>
                        </el-tab-pane>
                        <el-tab-pane>
                          <span slot="label"><i class="el-icon-document"></i> 评估结论</span>
                          <span>{{ props.row.adEvalConclusion }}</span>
                        </el-tab-pane>
                        <el-tab-pane>
                          <span slot="label"><i class="el-icon-date"></i> 查看历史版本</span>
                          <el-table
                            v-loading="loading"
                            element-loading-text="加载数据中"
                            :data="props.row.historyList"
                            border>
                            <el-table-column label="适航指令号" align="left" width="160px">
                              <template slot-scope="scope">
                                <span style="">{{ scope.row.issueAuthId  + ' AD ' +  scope.row.adCompNum + ' R' + scope.row.adCompVer }}</span>
                              </template>
                            </el-table-column>
                          </el-table>
                        </el-tab-pane>
                        <el-tab-pane>
                          <span slot="label"><i class="el-icon-paperclip"></i> 工程文件生成</span>
                          工程文件生成
                        </el-tab-pane>
                      </el-tabs>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="AD" prop="AdEvalNumb"  align="left" width="120px"></el-table-column>
            <el-table-column label="适航指令号" align="left" width="160px">
              <template slot-scope="scope">
                <span style="">{{ scope.row.issueAuthId  + ' AD ' +  scope.row.adCompNum + ' R' + scope.row.adCompVer }}</span>
              </template>
            </el-table-column>
            <el-table-column label="描述" prop="adCompName" min-width="40%"></el-table-column>
            <el-table-column label="适用部件" prop="cnstIdCompText" min-width="12%"></el-table-column>
            <el-table-column label="状态" prop="cnstIdStatusText" min-width="10%"></el-table-column>
            <el-table-column label="操作" width="120px" align="center">
              <template scope="scope">
                <router-link :to="{ name: 'ADCompEvalAdd', params: { id: scope.row.id, action: 'update' }}"> <i class="el-icon-edit">编辑</i> </router-link>
                <i style="width:20px;">&nbsp;</i>
                <i class="el-icon-delete" @click="handleDel(scope.$index, scope.row)"><span>删除</span></i>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="margin-top: 16px; text-align:right;"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[15, 30, 50, 100]"
            :page-size="pagesize"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange">
          </el-pagination>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<style scoped>
  @import '../../resources/form-controls.css';
</style>
<style>

  .el-table .cell {
    line-height: 18px;
  }
  .demo-table-expand {
    font-size: 0pt;
  }
  .el-input__suffix {
    right: 0px;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .el-table__expanded-cell {
    background: #FCFCFC !important;
  }

  .el-table--enable-row-hover .el-table__body tr:hover>  td.el-table__expanded-cell {
    background-color: #FCFCFC !important;
  }


  .el-table__expanded-cell .el-col {
    height: 25px;
    line-height: 25px;
    min-height: 25px;
  }
  .el-table__expanded-cell .el-form-item__label,.el-table__expanded-cell .el-form-item__content {
    font-size: 9pt;
  }
  .el-popover__title {
    color: #303133;
    font-size: 10pt;
    font-weight: bold;
    line-height: 1;
    margin-bottom: 12px;
  }

</style>
<script>
  import $ from 'jquery';
  const NEGATIVE = 1;
  export default {
    created() {
      this.initConstantVal();
      this.queryData();
    },
    data() {
      return {
        tableData: [],
        filters: {
          adEvalNumb: '',
          issueAuthId: '',
          adCompVer: '',
          adDateEffStart: '',
          adDateEffEnd: '',
          cnstIdStatus: '-1',
          cnstIdComp: '-1'
        },
        loading: false,
        pagesize: 15,
        currentpage: 1,
        total: 0,
        ADAdd_AuthorityList: [],
        ADAdd_CnstValCompIdList: [],
        ADAdd_ADApplyStatus: []
      }
    },
    methods: {
      queryData () {
        let self = this;
        $.ajax({
          url: 'http://106.12.133.158:88/api/pm/adcompeval/query',
          type: 'POST',
          data: '{' +
            "  'obj': {" +
            "    'adEvalNumb': '" + self.filters.adEvalNumb + "'," +
            "    'issueAuthId': '" + self.filters.issueAuthId + "'," +
            "    'adCompVer': '" + self.filters.adCompVer + "'," +
            "    'adDateEffStart': '" + self.utils.dateToString(self.filters.adDateEffStart, 'yyyy-MM-dd') + "'," +
            "    'adDateEffEnd': '" + self.utils.dateToString(self.filters.adDateEffEnd, 'yyyy-MM-dd') + "'," +
            "    'cnstIdStatus': '" + self.filters.cnstIdStatus + "'," +
            "    'cnstIdComp': '" + self.filters.cnstIdComp + "'," +
            "    'flag': '" + self.filters.flag + "'" +
            '  },' +
            "  'page': {" +
            "    'pageNum': " + self.currentpage + ',' +
            "    'pageSize': " + self.pagesize +
            '  }' +
            '}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              self.tableData = result.data.list;
              self.total = result.data.total;
              self.loading = false;
            } else {
              console.log(result.status);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
      },
      // 初始化选择框数据
      initConstantVal: function () {
        var self = this;
        // 适航局选择框初始化数据
        $.ajax({
          url: 'http://106.12.133.158:88/api/static/authority/query',
          type: 'POST',
          data: '{' +
            "  'obj': {" +
            "    'authName': null" +
            '  }' +
            '}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            console.log(result.status === 0);
            if (result.status === 0) {
              self.ADAdd_AuthorityList = result.data;
            } else {
              console.log(result.data);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
        $.ajax({
          url: 'http://106.12.133.158:88/api/static/cnstval/querySub',
          type: 'POST',
          data: '{' +
            "  'obj': {" +
            "    'cnstId': \"'productmodel_type','adapply_status'\"" +
            '  }' +
            '}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              self.ADAdd_CnstValCompIdList = result.data.filter(item => item.cnstParentId === 'productmodel_type');
              self.ADAdd_ADApplyStatus = result.data.filter(item => item.cnstParentId === 'adapply_status');

              let all = {descTxt: '全部', cnstId: '-1'};
              if (self.ADAdd_CnstValCompIdList !== null && self.ADAdd_CnstValCompIdList !== undefined) {
                self.ADAdd_CnstValCompIdList.splice(0, 0, all);
              }
              if (self.ADAdd_ADApplyStatus !== null && self.ADAdd_ADApplyStatus !== undefined) {
                self.ADAdd_ADApplyStatus.splice(0, 0, all);
              }
            } else {
              console.log(result.data);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
        // 评估工程师选择框初始化数据
        /* $.ajax({
          url: 'http://106.12.133.158:88/api/static/actype/query',
          type: 'POST',
          data: "{ 'obj': { 'acType': null } }",
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              self.ADAdd_UserList = result.data;
            } else {
              console.log(result.ADAdd_UserList);
            }
          },
          error: function (e) {
            console.log(e);
          }
        }); */
      },
      show(scope) {
        console.log(scope);
      },
      handleSizeChange(value) {
        this.pagesize = value;
        this.queryADCompDoc();
      },
      handleCurrentChange(value) {
        this.currentpage = value;
        this.queryADCompDoc();
      },
      addRowClass({row, rowIndex}) {
        if (row.rateType === NEGATIVE) {
          return 'warning-row';
        }
      },
      reset() {
        this.$refs['filters'].resetFields();
      },
      /* 显示编辑界面 */
      handleEdit: function (index, row) {
        alert('编辑数据');
        return false;
      },
      // 删除
      handleDel: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        }).catch(() => {
        });
      }
    }
  };

</script>
