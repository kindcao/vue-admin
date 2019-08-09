<template>
  <div class='basic'>
    <el-form ref="filters" :model="filters">
      <el-row>
        <el-col :span="6">
          <el-form-item prop="adKeyword">
            <el-input v-model="filters.adEvalNumb" size="medium" placeholder="请输入AD号码或描述" style="width:280px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" style="margin-left: 13px;">
          <el-form-item prop="issueAuthId">
            <el-select v-model="filters.issueAuthId" clearable filterable placeholder="适航局" style="width:140px">
              <el-option v-for="item in ADAdd_AuthorityList" :key="item.id" :label="item.authNameAbbr" :value="item.id">
                <span style="float: left">{{ item.authNameAbbr }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.authNation }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" style="margin-top: -2px;margin-left: -30px;">
          <el-form-item prop="cnstIdStatus">
            <el-radio-group v-model="filters.cnstIdStatus" size="mini">
              <el-radio-button v-for="(item,index) in ADAdd_ADApplyStatus" :label="item.cnstId" :key="item.cnstId">{{item.descTxt}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item>
            <el-button type="primary" v-on:click="queryData" size="small">查询</el-button>
            <el-button type="primary" v-on:click="reset" size="small">重置</el-button>
            <el-button plain v-on:click="handlerSeniorSearch" size="small">高级查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isShowSinorSearchPanel === true">
        <el-col :span="3">
          <el-form-item prop="adCompVer" style="margin-top:-2px">
            <!--<el-input type="number" v-model.number="filters.adCompVer" @keydown.native="handleInput"></el-input>-->
            <el-input-number v-model.number="filters.adCompVer" placeholder="版本" style="width:120px"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="adDateEff">
            <el-date-picker type="date" placeholder="自生效日期" v-model="filters.adDateEff" size="medium" style="width:140px"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
            <el-form-item prop="adDateEffEnd"><span style="margin-left:5px;">-</span>
              <el-date-picker type="date" placeholder="到生效日期" v-model="filters.adDateEffEnd" size="medium" style="width:140px"></el-date-picker>
            </el-form-item>
        </el-col>
        <el-col span="9" style="margin: -2px 0px 0px -17px">
          <el-form-item prop="cnstIdComp">
            <el-radio-group v-model="filters.cnstIdComp" size="mini">
              <el-radio-button v-for="(item,index) in ADAdd_CnstValCompIdList" :label="item.cnstId" :key="item.cnstId">{{item.descTxt}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='24'>
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="expand" class="expand-column-bg" >
              <template slot-scope="props">
                <table class="expand-table" cellpadding="0" cellspacing="0">
                  <tr>
                    <th>适航局:</th>
                    <td style="width: 150px">{{ props.row.authNameAbbr }}</td>
                    <th>适航指令号:</th>
                    <td style="width: 150px">{{ props.row.adCompNum }}</td>
                    <th>版本:</th>
                    <td>{{ props.row.adCompVer }}</td>
                  </tr>
                  <tr>
                    <th style="vertical-align: top">描述:</th>
                    <td colspan="5">{{ props.row.adCompName }}</td>
                  </tr>
                  <tr>
                    <th>生效日期:</th>
                    <td colspan="5">{{ props.row.adDateEff }}</td>
                  </tr>
                </table>
                <ul class="ui">
                  <li><el-button type="primary" plain @click.native="browserAd(1, props.row, '适用性评估列表')">适用性评估列表</el-button></li>
                  <li><el-button type="primary" plain @click.native="browserAd(2, props.row, '评估结论')">评估结论</el-button></li>
                  <li><el-button type="primary" plain @click.native="browserAd(3, props.row, '历史记录')">历史记录</el-button></li>
                  <li><el-button type="primary" plain @click.native="browserAd(4, props.row, '工程文件生成')">工程文件生成</el-button></li>
                  <li><el-button type="primary" plain @click.native="browserAd(5, props.row, '限制器材')">限制器材</el-button></li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column label="AD评估单号" prop="adEvalNumb" align="left" min-width="15%"></el-table-column>
            <el-table-column label="适航指令号" align="left" min-width="15%">
              <template slot-scope="scope">
                <span style="">{{ scope.row.authNameAbbr  + ' AD ' +  scope.row.adCompNum + ' R' + scope.row.adCompVer }}</span>
              </template>
            </el-table-column>
            <el-table-column label="描述" prop="adCompName" min-width="39%"></el-table-column>
            <el-table-column label="适用部件" prop="cnstIdCompTxt" min-width="8%"></el-table-column>
            <el-table-column label="状态" prop="cnstIdStatusTxt" min-width="8%"></el-table-column>
            <el-table-column label="操作" min-width="15%" align="center">
              <template scope="scope">
                <router-link :to="'/Engineering/ADEvalAdd/' + scope.row.id + '/' + scope.row.acTypeId + '/update'"> <i class="el-icon-edit">编辑</i> </router-link>
                <!--<router-link :to="{ name: 'ADEvalAdd', params: { id: scope.row.id, acTypeId: scope.row.acTypeId, action: 'update' }}"> <i class="el-icon-edit">编辑</i> </router-link>-->
                <!--<router-link :to="$route.path + '?id=' + scope.row.id + '&acTypeId=' + scope.row.acTypeId + '&action=update'"> <i class="el-icon-edit">编辑</i> </router-link>-->
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="750px" :before-close="handleClose" :close-on-click-modal="false" :append-to-body="true">
      <div v-if="buttonIndex === 1">
        <table class="expand-table" cellpadding="0" cellspacing="0">
          <tr>
            <th style="width: 100px">适用部位:</th>
            <td style="width: 150px">{{ dataForm.cnstIdCompTxt }}</td>
            <th style="width: 100px">是否适用:</th>
            <td style="width: 150px">{{ dataForm.cnstIdIsApplyTxt }}</td>
          </tr>
          <tr>
            <td colspan="5">
              <table class="expand-table" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 100px">注册号</td>
                  <td style="width: 120px">飞机序号</td>
                  <td style="width: 250px">适用部分</td>
                  <td style="width: 100px">状态</td>
                </tr>
                <tbody v-for="item in subDataTable">
                  <tr>
                    <td>{{ item.acReg }}</td>
                    <td>{{ item.acSn }}</td>
                    <td>
                      <span v-if="dataForm.cnstIdComp === 'adeval_comp_fl'">{{ item.adApplyAcModel }}</span>
                      <span v-if="dataForm.cnstIdComp === 'adeval_comp_eng'">
                        <span v-if="utils.isNotEmpty(item.adApplyEng1Model)">{{ item.adApplyEng1Model }} {{ item.adApplyEng1Sn }};</span>
                        <span v-if="utils.isNotEmpty(item.adApplyEng2Model)">{{ item.adApplyEng2Model }} {{ item.adApplyEng2Sn }};</span>
                        <span v-if="utils.isNotEmpty(item.adApplyEng3Model)">{{ item.adApplyEng3Model }} {{ item.adApplyEng3Sn }};</span>
                        <span v-if="utils.isNotEmpty(item.adApplyEng4Model)">{{ item.adApplyEng4Model }} {{ item.adApplyEng4Sn }};</span>
                      </span>
                      <span v-if="dataForm.cnstIdComp === 'adeval_comp_apu'">{{ item.adApplyApuModel }}</span>
                      <span v-if="dataForm.cnstIdComp === 'adeval_comp_compo'">PN:{{ item.adApplyComponentPn }} SN:{{ item.adApplyComponentSn }}</span>
                    </td>
                    <td>{{ item.cnstIdStatusTxt }}</td>
                  </tr>
                  <tr>
                    <td style="width: 100px">到期设置</td>
                    <td colspan="3">{{ item.dueSetup }}</td>
                  </tr>
                  <!--<tr>
                    <td style="width: 100px">完成备注</td>
                    <td colspan="3">{{ item.dueRemark }}</td>
                  </tr>-->
                  <tr>
                    <td style="width: 100px">评估结论</td>
                    <td colspan="3">{{ item.evalConclusion }}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </table>
      </div>
      <div v-if="buttonIndex === 2">
        <table class="expand-table" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width: 60px;vertical-align: top">评估结论</td>
            <td style="vertical-align: top">{{ dataForm.adEvalConclusion }}</td>
          </tr>
        </table>
      </div>
      <div v-if="buttonIndex === 3">
        暂未提供方法。
      </div>
      <div v-if="buttonIndex === 4">
        <table class="expand-table" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width: 60px;vertical-align: top">工程指令</td>
            <td style="vertical-align: top">{{ dataForm.followingEo }}</td>
          </tr>
          <tr>
            <td style="width: 60px;vertical-align: top">维护提示</td>
            <td style="vertical-align: top">{{ dataForm.followingMt }}</td>
          </tr>
        </table>
      </div>
      <div v-if="buttonIndex === 5">
        <table class="expand-table" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width: 60px;vertical-align: top">限制器材</td>
            <td style="vertical-align: top">{{ dataForm.followingLmtPart }}</td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>

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
  .expand-table {
    width: 100%;
    border:1px solid #EBEEF5;
    border-collapse: collapse;
  }
  .expand-table th {
    font-weight: bold!important;
    width: 110px!important;;
    text-align: right!important;
    background: none!important;
  }
  .expand-table th, .expand-table td {
    padding: 10px!important;
    border:1px solid #EBEEF5!important;
  }
  .ui{
    width:700px;
    height:50px;
    list-style: none;
    margin-top:10px;
    padding:0;
  }
  .ui li{
    margin:10px;
    float: left;/*该处换为display:inline-block;同样效果*/

  }
  .el-form .el-form-item__content{margin-left:10px!important;}
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
          adCompVer: null,
          adDateEff: '',
          adDateEffEnd: '',
          cnstIdStatus: 'adapply_status_open',
          cnstIdComp: ''
        },
        loading: false,
        pagesize: 15,
        currentpage: 1,
        total: 0,
        ADAdd_AuthorityList: [],
        ADAdd_CnstValCompIdList: [],
        ADAdd_ADApplyStatus: [],

        // 新增界面数据
        dataForm: {
          acMake: '',
          acMakeEn: '',
          acType: '',
          acTypeEn: '',
          acTypeId: 0,
          adCompName: '',
          adCompNum: '',
          adCompNumName: '',
          adCompVer: 0,
          adDateEff: '',
          adDateEffEnd: '',
          adDocId: 0,
          adEvalConclusion: '',
          adEvalNumb: '',
          adEvalRev: 0,
          authNameAbbr: '',
          authNation: '',
          authNationEn: '',
          cnstIdComp: '',
          cnstIdCompTxt: '',
          cnstIdCompTxtEn: '',
          cnstIdStatus: 'adapply_status_open',
          cnstIdStatusTxt: '',
          cnstIdStatusTxtEn: '',
          followingEo: '',
          followingLmtPart: '',
          followingMt: '',
          id: 0,
          issueAuthId: 0,
          sumRev: ''
        },
        subDataTable: [],
        dialogTitle: '',
        buttonIndex: 1,
        dialogHeight: 'height: 100px',
        dialogVisible: false, // 新增界面是否显示
        isShowSinorSearchPanel: false
      }
    },
    methods: {
      handleInput(e) {
        let valid = new RegExp('^[1-9][0-9]*$').test(e.key)
        if (!valid) {
          e.preventDefault();
        }
        /* let a = e.key.replace(/^[1-9]\d*$/, '');
        if (!a) {
          e.preventDefault();
        } */
      },
      browserAd: function (index, row, title) {
        let self = this;
        self.buttonIndex = index;
        self.dialogTitle = title;
        self.dataForm = Object.assign({}, row);
        switch (index) {
          case 1: // 适用性评估列表
            $.ajax({
              url: 'http://106.12.133.158:1881/api/pm/adcompapply/query',
              type: 'POST',
              data: "{ 'obj': { 'adEvalId': '" + self.dataForm.id + "'}}",
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              success: function (result) {
                if (result.status === 0) {
                  self.subDataTable = result.data;
                  self.dialogHeight = 'height: 260px';
                  self.dialogVisible = true;
                } else {
                  console.log(result.status);
                }
              },
              error: function (e) {
                console.log(e);
              }
            });
            break;
          case 2: // 评估结论
            self.dialogVisible = true;
            break;
          case 3: // 历史记录
            self.dialogVisible = true;
            break
          case 4: // 工程文件生成
            self.dialogVisible = true;
            break;
          case 5: // 限制器材
            self.dialogVisible = true;
            break;
        }
      },
      handleClose(done) {
        this.dialogVisible = false;
        this.$refs['dataForm'].resetFields();
      },
      queryData () {
        let self = this;
        $.ajax({
          url: 'http://106.12.133.158:1881/api/pm/adcompeval/query',
          type: 'POST',
          data: '{' +
            "  'obj': {" +
            "    'adEvalNumb': '" + self.filters.adEvalNumb + "'," +
            "    'issueAuthId': '" + self.filters.issueAuthId + "'," +
            "    'adCompVer': '" + self.filters.adCompVer + "'," +
            "    'adDateEff': '" + self.utils.dateToString(self.filters.adDateEff, 'yyyy-MM-dd') + "'," +
            "    'adDateEffEnd': '" + self.utils.dateToString(self.filters.adDateEffEnd, 'yyyy-MM-dd') + "'," +
            "    'cnstIdStatus': '" + self.filters.cnstIdStatus + "'," +
            "    'cnstIdComp': '" + self.filters.cnstIdComp + "'" +
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
          url: 'http://106.12.133.158:1881/api/static/authority/query',
          type: 'POST',
          data: '{' +
            "  'obj': {" +
            "    'authNameAbbr': null" +
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
          url: 'http://106.12.133.158:1881/api/static/cnstval/querySub',
          type: 'POST',
          data: '{' +
            "  'obj': {" +
            "    'cnstId': \"'adeval_comp','adapply_status'\"" +
            '  }' +
            '}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              self.ADAdd_CnstValCompIdList = result.data.filter(item => item.cnstParentId === 'adeval_comp');
              self.ADAdd_ADApplyStatus = result.data.filter(item => item.cnstParentId === 'adapply_status');

              let all = {descTxt: '全部', cnstId: ''};
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
          url: 'http://106.12.133.158:1881/api/static/actype/query',
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
      handlerSeniorSearch() {
        this.isShowSinorSearchPanel = !this.isShowSinorSearchPanel;
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
