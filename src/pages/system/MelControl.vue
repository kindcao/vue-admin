<template>
  <section>
    <el-form ref="filters" :model="filters">
      <el-row>
        <el-col :span="6">
          <el-form-item label="飞机商业型" prop="acTypeId" label-width="110px">
            <el-select v-model="filters.acTypeId"  placeholder="请选择" style="width:100%" >
              <el-option
                v-for="item in dictionary"
                :key="item.id"
                :label="item.acType"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item
            label="MEL版本"
            label-width="100px"
            prop="melRev">
            <el-input type="age" v-model.number="filters.melRev" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="适用适航局" prop="melAuthId" label-width="110px">
            <el-select v-model="filters.melAuthId"  placeholder="请选择" style="width:100%" >
              <el-option
                v-for="item in AuthorityListMain"
                :key="item.id"
                :label="item.authName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="状态" prop="melStatus" label-width="60px">
            <el-select v-model="filters.melStatus">
              <el-option label="" value=""></el-option>
              <el-option label="完成" value="0"></el-option>
              <el-option label="生效" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="是否有效" prop="flag" label-width="90px">
            <el-select v-model="filters.flag">
              <el-option label="有效" value="0"></el-option>
              <el-option label="无效" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11" style="display: inline-block; ">
          <el-form-item label="生效日期" label-width="110px">
            <el-date-picker type="date" placeholder="选择日期" v-model="filters.melDateEffStart" style="width: 160px;" size="medium"></el-date-picker>
            -
            <el-date-picker type="date" placeholder="选择日期" v-model="filters.melDateEffEnd" style="width: 160px;" size="medium"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item>
            <el-button type="primary" v-on:click="queryData">查询</el-button>
            <el-button type="primary" v-on:click="reset">重置</el-button>
<!--            <router-link :to="{ name: 'OEMDocAdd', params: { id: '' }}"> <button type="button"  class="el-icon-edit">跳转</button> </router-link>-->
            <el-button type="primary" v-on:click="handleAdd">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
    v-loading="loading"
    element-loading-text="加载数据中"
    :data='tableData'
    @selection-change="handleSelectionChange"
    border
    :row-class-name="addRowClass">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
    <el-table-column label="编号" prop="id" align="center" width="70"></el-table-column>
    <el-table-column label="飞机商业型" prop="acTypeId"  min-width="20%"></el-table-column>
    <el-table-column label="MEL版本" prop="melRev" min-width="10%"></el-table-column>
    <el-table-column label="适用适航局" prop="melAuthId" min-width="20%"></el-table-column>
    <el-table-column label="生效日期" prop="melDateEff"  min-width="15%"></el-table-column>
    <el-table-column label="状态" prop="melStatus"  min-width="10%" :formatter = "formatMelStatus"></el-table-column>
    <el-table-column label="操作" min-width="15%" align="center">
      <template scope="scope">
        <router-link :to="{ name: 'MelControlAdd', params: { id: scope.row.id }}"> <i class="el-icon-edit"><span>编辑</span></i> </router-link>
        <i style="width:20px;">&nbsp;</i>
        <i class="el-icon-delete" @click="handleDel(scope.$index, scope.row)"><span>删除</span></i>
      </template>
    </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="margin-top: 16px; ">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination
        style="text-align:right;float:right;"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[15, 30, 50, 100]"
        :page-size="pagesize"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </el-col>
    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" :append-to-body="true">
      <el-form :model="addForm" label-width="130px" :rules="addFormRules" ref="addForm" style="margin-top: -15px;">
        <el-form-item label="飞机商业型" prop="acTypeId">
          <el-select v-model="addForm.acTypeId"  placeholder="请选择" style="width:100%"  @change="changeAcType($event)">
            <el-option  v-for="item in dictionary" :key="item.id" :label="item.acType" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="MEL版本" prop="melRev">
          <el-input-number v-model="addForm.melRev" :min="0" :max="20"></el-input-number>
        </el-form-item>
        <el-form-item label="适用适航局" prop="melAuthId">
          <el-select v-model="addForm.melAuthId"  placeholder="请选择" style="width:100%">
            <el-option  v-for="item in AuthorityListMain" :key="item.id" :label="item.authName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生效日期" prop="melDateEff">
          <el-date-picker type="date" placeholder="选择日期" v-model="addForm.melDateEff" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%;" size="medium"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="melStatus">
          <el-select v-model="addForm.melStatus">
            <el-option label="" value=""></el-option>
            <el-option label="完成" value="0"></el-option>
            <el-option label="生效" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件" prop="ad_date_eff">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<style scope>
  @import '../../resources/form-controls.css';
</style>
<script>
  import $ from 'jquery';

  const NEGATIVE = 1;
  export default {
    created () {
      this.initConstantVal();
      this.queryData();
    },
    data: function () {
      return {
        tableData: [],
        filters: {
          acTypeId: '',
          melRev: '',
          melAuthId: '',
          melStatus: '',
          melDateEffStart: '',
          melDateEffEnd: '',
          flag: ''
        },
        loading: false,
        pagesize: 15,
        currentpage: 1,
        total: 0,
        dictionary: [],
        AuthorityListMain: [],
        sels: [], // 列表选中列
        addFormVisible: false, // 新增界面是否显示
        addLoading: false,
        addFormRules: {
          acTypeId: [
            {required: true, message: '请选择飞机商业机型', trigger: 'blur'}
          ],
          melAuthId: [
            {required: true, message: '请选择适用适航局', trigger: 'blur'}
          ],
          melRev: [
            {required: true, message: '请输入MEL版本', trigger: 'blur'},
            {type: 'number', message: 'MEL版本必须是数字', trigger: 'blur'}
          ],
          melStatus: [
            {required: true, message: '请选择状态', trigger: 'blur'}
          ]
        },
        // 新增界面数据
        addForm: {
          id: 0,
          acTypeId: '',
          acTypeText: '',
          melRev: '',
          melAuthId: '',
          melAuthText: '',
          melStatus: '',
          melStatusText: '',
          melDateEff: null,
          flag: 0,
          createById: '',
          createTime: '',
          updateById: '',
          updateTime: ''
        }
      }
    },
    methods: {
      queryData () {
        let sef = this;
        $.ajax({
          url: 'http://106.12.133.158:88/api/pm/melcontrol/query',
          type: 'POST',
          data: '{' +
                  "  'obj': {" +
                  "    'acTypeId': '" + sef.filters.acTypeId + "'," +
                  "    'melRev': '" + sef.filters.melRev + "'," +
                  "    'melAuthId': '" + sef.filters.melAuthId + "'," +
                  "    'melStatus': '" + sef.filters.melStatus + "'," +
                  "    'effcDate': '" + sef.dateToString(sef.filters.effcDate, 'yyyy-MM-dd') + "'," +
                  "    'flag': '" + sef.filters.flag + "'" +
                  '  },' +
                  "  'page': {" +
                  "    'pageNum': " + sef.currentpage + ',' +
                  "    'pageSize': " + sef.pagesize +
                  '  }' +
                  '}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            console.log(result.status === 0);
            if (result.status === 0) {
              sef.tableData = result.data.list;
              sef.total = result.data.total;
              sef.loading = false;

              console.log(sef.tableData);
            } else {
              console.log(result.status);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
      },
      show (scope) {
        console.log(scope);
      },
      handleSizeChange (value) {
        this.pagesize = value;
        this.queryData();
      },
      handleCurrentChange (value) {
        this.currentpage = value;
        this.queryData();
      },
      addRowClass ({row, rowIndex}) {
        if (row.rateType === NEGATIVE) {
          return 'warning-row';
        }
      },
      dateToString (time, format) {
        if (time === null || time === '' || time === undefined) {
          return '';
        }
        if (format === null || format === '') {
          format = 'yyyy-MM-dd hh:mm:ss';
        }
        if (time instanceof Date) {
          return this.uitls.formatDate(time, format);
        } else {
          return time.split(' ')[0];
        }
      },
      formatMelStatus (row) {
        let statusText = '';
        if (row.melStatus === 0) {
          statusText = '完成';
        } else if (row.melStatus === 1) {
          statusText = '生效';
        }
        return statusText;
      },
      reset() {
        this.$refs['filters'].resetFields();
      },
      changeAcType: function (id) {
        let selectedWorkName = this.dictionary.filter(item => item.id === id);
        if (selectedWorkName === null || selectedWorkName.length === 0) return;
        this.addForm.acTypeText = selectedWorkName[0].descTxt;
      },
      changeAuthority: function (id) {
        let selectedWorkName = this.AuthorityListMain.filter(item => item.id === id);
        if (selectedWorkName === null || selectedWorkName.length === 0) return;
        this.addForm.melAuthId = selectedWorkName[0].authName;
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
            url: 'http://106.12.133.158:88/api/pm/melcontrol/delete',
            type: 'POST',
            data: '[' + row.id + ']',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
              console.log(result.status);
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
      },
      initConstantVal: function () {
        var self = this;
        $.ajax({
          url: 'http://106.12.133.158:88/api/static/actype/query',
          type: 'POST',
          data: '{' +
            "  'obj': {" +
            "    'acType': null" +
            '  }' +
            '}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            console.log(result.status === 0);
            if (result.status === 0) {
              self.dictionary = result.data;
              console.log(self.dictionary);
            } else {
              console.log(result.dictionary);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });

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
              self.AuthorityListMain = result.data;
              console.log(self.AuthorityListMain);
            } else {
              console.log(result.AuthorityListMain);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
      },
      // 显示新增界面
      handleAdd: function () {
        this.addFormVisible = true;
        this.addForm = {
          id: 0,
          acTypeId: '',
          acTypeText: '',
          melRev: '',
          melAuthId: '',
          melAuthText: '',
          melStatus: '',
          melStatusText: '',
          melDateEff: null,
          flag: 0,
          createById: '',
          createTime: '',
          updateById: '',
          updateTime: ''
        };
      },
      // 新增
      addSubmit: function () {
        var sef = this;
        sef.$refs.addForm.validate((valid) => {
          if (valid) {
            sef.$confirm('确认提交吗？', '提示', {}).then(() => {
              sef.addLoading = true;
              // NProgress.start();
              let para = Object.assign({}, this.addForm);
              $.ajax({
                url: 'http://106.12.133.158:88/api/pm/melcontrol/add',
                type: 'POST',
                data: '{' +
                  "    'id': '" + para.id + "'," +
                  "    'acTypeId': '" + para.acTypeId + "'," +
                  "    'melRev': '" + para.melRev + "'," +
                  "    'melAuthId': '" + para.melAuthId + "'," +
                  "    'melDateEff': '" + sef.dateToString(para.melDateEff, 'yyyy-MM-dd') + "'," +
                  "    'melStatus': '" + para.melStatus + "'," +
                  "    'flag': '" + para.flag + "'," +
                  "    'createById': '" + para.createById + "'," +
                  "    'createTime': '" + para.createTime + "'," +
                  "    'updateById': '" + para.updateById + "'," +
                  "    'updateTime': '" + para.updateTime + "'" +
                  '}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (result) {
                  console.log(result.status === 0);
                  if (result.status === 0) {
                    sef.addLoading = false;
                    // NProgress.done();
                    sef.$message({
                      message: '提交成功',
                      type: 'success'
                    });
                    sef.$refs['addForm'].resetFields();
                    sef.addFormVisible = false;

                    sef.queryData();
                  } else {
                    console.log(result.status);
                  }
                },
                error: function (e) {
                  console.log(e);
                }
              });
            });
          }
        });
      },
      handleSelectionChange: function (sels) {
        this.sels = sels;
      },
      // 批量删除
      batchRemove: function () {
        var sef = this;
        if (sef.sels == null) {
          return;
        }
        var ids = sef.sels.map(item => item.id).toString();
        console.log(ids);
        sef.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          sef.listLoading = true;
          // NProgress.start();
          $.ajax({
            url: 'http://106.12.133.158:88/api/pm/melcontrol/delete',
            type: 'POST',
            data: '[' + ids + ']',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
              console.log(result.status);
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
    }
  }

</script>

