<template>
  <div class='basic'>
    <el-form ref="filters" :model="filters" label-width="10px">
      <el-row>
        <el-col :span="10">
          <el-form-item prop="adCompNumName">
            <el-input v-model="filters.adCompNumName" size="medium" placeholder="请输入AD指令号或描述"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="issueAuthId">
            <el-select v-model="filters.issueAuthId" placeholder="适航局" style="width:100%">
              <el-option v-for="item in ADAdd_AuthorityList" :key="item.id" :label="item.authNameAbbr" :value="item.id">
                <span style="float: left">{{ item.authNameAbbr }}</span>
                <span style="float: left;margin-left: 10px">{{ item.authNation }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item>
            <el-button type="primary" v-on:click="queryData" size="small">查询</el-button>
            <el-button type="primary" v-on:click="reset" size="small">重置</el-button>
            <router-link :to="{ name: 'ADCompDocAdd', params: { id: '', action: 'addRef' }}"> <el-button type="primary">新增</el-button></router-link>
            <el-button plain v-on:click="handlerSeniorSearch" size="small">高级查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isShowSinorSearchPanel === true">
        <el-col :span="3">
          <el-form-item prop="adCompVer">
            <!--<el-input type="number" v-model.number="filters.adCompVer" @keydown.native="handleInput"></el-input>-->
            <el-input-number v-model.number="filters.adCompVer" placeholder="版本" style="width:120px"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="adDateEff" style="width:100px;">
            <el-date-picker type="date" placeholder="自生效日期" v-model="filters.adDateEff" size="medium" style="width:140px"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="adDateEffEnd" style="width:100px;margin-left: -35px">
            <el-date-picker type="date" placeholder="到生效日期" v-model="filters.adDateEffEnd" size="medium" style="width:140px"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span='24'>
        <el-table
          :data="tableData" border
          style="width: 100%">
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
            </template>
          </el-table-column>
          <el-table-column align="left" width="20px">
            <template slot-scope="scope">
              <span>
                <el-popover placement="left-start" width="400" trigger="hover">
                  <span v-for="(file, index) in scope.row.files" :key="index">
                    <p v-if="index === 0">文件名称</p>
                    <p><el-link :href= "'http://106.12.133.158:1881/file/' + file.filePath" target="_blank">{{ file.fileName}}</el-link></p>
                  </span>
                  <i v-show="scope.row.attaNum > 0" slot="reference" class="fa fa-paperclip fa-rotate-90" style="font-size: 0.9em;transform: rotate(40deg);margin: 5px -6px 0px;"></i>
                </el-popover>
              <!--<el-link href="Engineering/ADCompDocAdd?a=sss&b=111&c=890" target="_blank"><i class="fa fa-paperclip fa-rotate-90" style="font-size: 0.9em;transform: rotate(40deg);margin: 5px -6px 0px;"></i></el-link>-->
              </span>
            </template>
          </el-table-column>
          <el-table-column label="适航指令号" align="left" width="200px">
            <template slot-scope="scope">
              <span style="">{{ scope.row.authNameAbbr  + ' AD ' +  scope.row.adCompNum + ' R' + scope.row.adCompVer }}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述" prop="adCompName" min-width="20%"></el-table-column>
          <el-table-column label="操作" width="120px" align="center">
            <template scope="scope">
              <router-link :to="'/Engineering/ADCompDocAdd/' + scope.row.id + '/update'"> <i class="el-icon-edit">编辑</i> </router-link>
              <!--<router-link :to="{ name: 'ADCompDocAdd', params: { id: scope.row.id, action: 'update' }}"> <i class="el-icon-edit">编辑</i> </router-link>-->
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
</style>
<script>
  import $ from 'jquery';
  const NEGATIVE = 1;
  export default {
    created() {
      // this.queryADCompDoc();
      this.initConstantVal();
      this.queryData();
    },
    data() {
      return {
        tableData: [],
        filters: {
          issueAuthId: '',
          adCompNum: '',
          adCompVer: '',
          adCompNumName: '',
          adDateEff: '',
          adDateEffEnd: ''
        },
        isShowSinorSearchPanel: false,
        ADAdd_AuthorityList: [],
        loading: false,
        pagesize: 15,
        currentpage: 1,
        total: 0,
        fileList: []
      }
    },
    methods: {
      queryADCompDoc() {
        this.axios.get(`getQueryADCompDocData?per_page=${this.pagesize}&cur_page=${this.currentpage}&issueAuthId=${this.filters.issueAuthId}`)
          .then(data => {
            console.log(data.data.table);
            if (data.errno === 0) {
              this.tableData = data.data.table;
              this.total = data.data.total;
              this.loading = false;
            } else {
              console.log(data.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      queryData () {
        let sef = this;
        $.ajax({
          url: 'http://106.12.133.158:1881/api/pm/adcompdoc/query',
          type: 'POST',
          data: '{' +
            "  'obj': {" +
            "    'issueAuthId': '" + sef.filters.issueAuthId + "'," +
            "    'adCompVer': '" + sef.filters.adCompVer + "'," +
            "    'adCompNumName': '" + sef.filters.adCompNumName + "'," +
            "    'adDateEff': '" + sef.utils.dateToString(sef.filters.adDateEff, 'yyyy-MM-dd') + "'," +
            "    'adDateEffEnd': '" + sef.utils.dateToString(sef.filters.adDateEffEnd, 'yyyy-MM-dd') + "'" +
            '  },' +
            "  'page': {" +
            "    'pageNum': " + sef.currentpage + ',' +
            "    'pageSize': " + sef.pagesize +
            '  }' +
            '}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              let refId = [];
              let parentResult = result;
              result.data.list.forEach(function (item, i) {
                refId.push(item.id)
              });
              if (refId.length > 0) {
                $.ajax({
                  url: 'http://106.12.133.158:1881/api/static/attafile/query',
                  type: 'POST',
                  data: '{' +
                    "  'obj': {" +
                    "    'classifyId': 100001," +
                    "    'refIdStr': '" + refId.join(',') + "'" +
                    '  }' +
                    '}',
                  contentType: 'application/json; charset=utf-8',
                  dataType: 'json',
                  success: function (result) {
                    let multiData = parentResult.data.list;
                    if (result.status === 0) {
                      for (let i = 0; i < multiData.length; i++) {
                        multiData[i].files = result.data.filter(file => file.refId === multiData[i].id);
                      }
                    } else {
                      console.log(result.status);
                    }
                    sef.tableData = multiData;
                    sef.total = parentResult.data.total;
                    sef.loading = false;
                  },
                  error: function (e) {
                    console.log(e);
                  }
                });
              }
            } else {
              console.log(result.status);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
      },
      showAttachment(refId) {
        this.fileData = [];
        if (this.fileList !== null && this.fileList !== undefined) {
          this.fileData = this.fileList.filter(file => file.refId === refId);
          this.$refs['popover-' + refId].doShow();
        }
      },
      handlerSeniorSearch() {
        this.isShowSinorSearchPanel = !this.isShowSinorSearchPanel;
      },
      show(scope) {
        console.log(scope);
      },
      handleSizeChange(value) {
        this.pagesize = value;
        this.queryData();
      },
      handleCurrentChange(value) {
        this.currentpage = value;
        this.queryData();
      },
      addRowClass({row, rowIndex}) {
        if (row.rateType === NEGATIVE) {
          return 'warning-row';
        }
      },
      reset() {
        this.$refs['filters'].resetFields();
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
      },
      // 删除
      handleDel: function (index, row) {
        var sef = this;
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          // NProgress.start();
          $.ajax({
            url: 'http://106.12.133.158:1881/api/pm/adcompdoc/delete',
            type: 'POST',
            data: '[' + row.id + ']',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
              if (result.status === 0) {
                sef.$message({
                  message: '删除成功',
                  type: 'success'
                });
                sef.queryData();
              } else {
                console.log(result.status);
              }
            },
            error: function (e) {
              console.log(e);
            }
          });
        }).catch(() => {

        });
      }
    },
    mounted: function() {
      // this.tableExpandCellWidth = window.innerWidth - this.$refs.table.$el.offsetLeft - 50;
      // window.innerWidth:浏览器的可用宽度
      // this.$refs.table.$el.offsetLeft：表格距离浏览器的宽度
      // 后面的50：根据需求空出的宽度，自行调整
    }
  };

</script>
