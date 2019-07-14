<template>
  <el-form ref="form" :model="form" :rules="formRules" label-width="120px" @submit.prevent="onSubmit" style="margin:0 0 100px;width:100%;">
    <el-row hidden>
      <el-col :span="18">
        <el-form-item label="主键" prop="id" hidden>
          <el-input v-model="form.id"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <el-form-item label="飞机商业型" prop="acTypeId">
          <el-select v-model="form.acTypeId"  placeholder="请选择" style="width:100%" >
            <el-option  v-for="item in ACTypeSubList" :key="item.id" :label="item.acType" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <el-form-item label="MEL版本" prop="melRev">
          <el-input-number v-model="form.melRev" :min="0" :max="20"></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <el-form-item label="适用适航局" prop="melAuthId">
          <el-select v-model="form.melAuthId"  placeholder="请选择" style="width:100%">
            <el-option  v-for="item in AuthoritySubList" :key="item.id" :label="item.authName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <el-form-item label="生效日期" prop="melDateEff">
          <el-date-picker type="date" v-model="form.melDateEff" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%;" size="medium"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <el-form-item label="评估结论" prop="melStatus">
          <el-select v-model="form.melStatus" value-key="melStatus">
            <el-option label="" value=""></el-option>
            <el-option label="完成" value="0"></el-option>
            <el-option label="生效" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18" style="margin-top: 20px">
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
      </el-col>
    </el-row>
    <el-row hidden="true">
      <el-col :span="9">
        <el-form-item label="创建人" prop="createById">
          <span>{{form.createById}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="9">
        <el-form-item label="创建时间" prop="createTime">
          <span>{{form.createTime}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row hidden="true">
      <el-col :span="9">
        <el-form-item label="更新人" prop="updateById">
          <span>{{form.updateById}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="9">
        <el-form-item label="更新时间" prop="updateTime">
          <span>{{form.updateTime}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
    <el-col :span="24" class="toolbar" style="margin: 10px 0;">
      <el-form-item class="clearfix">
        <el-button type="primary" @click.native="editSubmit" :loading="addLoading"  class="el-icon-edit">保存</el-button>
        <el-button @click.native="$router.back(-1)"  class="el-icon-back">返回</el-button>
      </el-form-item>
    </el-col>
    </el-row>
    <el-row>
      <el-col :span="20" style="margin-left: 20px;margin-bottom: 100px">
        OEM文档
        <el-table
          v-loading="loading"
          element-loading-text="加载数据中"
          :data='tableData'
          @selection-change="handleSelectionChange"
          border
          :row-class-name="addRowClass"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="编号" prop="id" align="center" width="70"></el-table-column>
          <el-table-column label="飞机商业型" prop="acTypeId"  min-width="15%"></el-table-column>
          <el-table-column label="文档名称" prop="docName" min-width="40%"></el-table-column>
          <el-table-column label="文档版本" prop="docVer" min-width="15%"></el-table-column>
          <el-table-column label="生效日期" prop="effcDate"  min-width="15%"></el-table-column>
          <el-table-column label="操作" min-width="15%" align="center">
            <template scope="scope">
              <i class="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"><span>编辑</span></i>
              <i style="width:20px;">&nbsp;</i>
              <i class="el-icon-delete" @click="handleDel(scope.$index, scope.row)"><span>删除</span></i>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-form>
</template>
<style scope>
  @import '../../resources/form-controls.css';
</style>
<script>
  import $ from 'jquery';

  export default {
    created() {
      this.initConstantVal();
      this.queryData();
    },
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        form: {
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
        },
        editFormRules: {
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
        loading: false,
        pagesize: 5,
        currentpage: 1,
        total: 0,
        ACTypeSubList: [],
        AuthoritySubList: []
      }
    },
    methods: {
      queryData () {
        let id = this.$route.params.id;
        if (id === null || id === '' || id === undefined) {
          return;
        }
        let self = this;
        $.ajax({
          url: 'http://106.12.133.158:88/api/pm/melcontrol/query',
          type: 'POST',
          data: '{' +
            "  'obj': {" +
            "    'id': " + id + ',' +
            "    'flag': 0" +
            '  }' +
            '}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            console.log(result.status === 0);
            if (result.status === 0 && result.data.length > 0) {
              let results = result.data.filter(item => item.id === id);
              if (results !== null && results !== undefined && results.length > 0) {
                let row = results[0];
                // debugger;
                // self.changeSelectVal(row.id);
                if (row.melDateEff !== null && row.melDateEff !== '') {
                  self.$set(self.form, 'melDateEff', row.melDateEff);
                }
                // if (row.melStatus !== null && row.melStatus !== '') {
                //   self.$set(self.form, 'melStatus', row.melStatus.toString());
                // }
                row.melStatus = String(row.melStatus);
                self.form = Object.assign({}, row);
                // self.$set(self.form, 'melStatus', );
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
      OEMDocList () {
        let sef = this;
        $.ajax({
          url: 'http://106.12.133.158:88/api/pm/oemdoc/query',
          type: 'POST',
          data: '{' +
            "  'obj': {" +
            "    'acTypeId': '" + sef.filters.acTypeId + "'," +
            "    'docName': '" + sef.filters.docName + "'," +
            "    'docVer': '" + sef.filters.docVer + "'," +
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
            } else {
              console.log(result.status);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
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
      reset() {
        this.$refs['filters'].resetFields();
      },
      dateToString (time, format) {
        if (time === null || time === '' || time === undefined) {
          return '';
        }
        if (format === null || format === '') {
          format = 'yyyy-MM-dd hh:mm:ss';
        }
        if (time instanceof Date) {
          return this.utils.formatDate(time, format);
        } else {
          return time.split(' ')[0];
        }
      },
      changeSelectVal: function (id) {
        let selectedWorkName = this.dictionaryOEMDOC.filter(item => item.id === id);
        if (selectedWorkName === null || selectedWorkName.length === 0) return;
        this.form.acTypeText = selectedWorkName[0].descTxt;
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
            url: 'http://106.12.133.158:88/api/pm/oemdoc/delete',
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
              self.ACTypeSubList = result.data;
              console.log(self.ACTypeSubList);
            } else {
              console.log(result.ACTypeSubList);
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
              self.AuthoritySubList = result.data;
              console.log(self.AuthoritySubList);
            } else {
              console.log(result.AuthoritySubList);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
      },
      // 编辑
      editSubmit: function () {
        var sef = this;
        sef.$refs.form.validate((valid) => {
          if (valid) {
            sef.$confirm('确认提交吗？', '提示', {}).then(() => {
              sef.editLoading = true;
              // NProgress.start();
              let para = Object.assign({}, this.form);
              debugger;
              $.ajax({
                url: 'http://106.12.133.158:88/api/pm/melcontrol/update',
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
                    sef.editLoading = false;
                    // NProgress.done();
                    sef.$message({
                      message: '数据编辑成功.',
                      type: 'success'
                    });
                    sef.$refs['form'].resetFields();
                    sef.editFormVisible = false;

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
                url: 'http://106.12.133.158:88/api/pm/oemdoc/add',
                type: 'POST',
                data: '{' +
                  "    'id': '" + para.id + "'," +
                  "    'acTypeId': '" + para.acTypeId + "'," +
                  "    'docName': '" + para.docName + "'," +
                  "    'docVer': '" + para.docVer + "'," +
                  "    'effcDate': '" + sef.dateToString(para.effcDate, 'yyyy-MM-dd') + "'," +
                  "    'evalConclusion': '" + para.evalConclusion + "'," +
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
            url: 'http://106.12.133.158:88/api/pm/oemdoc/delete',
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
    },
    formMethod: {
      formatDate (time, format) {
        if (time === null || time === undefined) {
          return '';
        }
        let date = new Date(time);
        if (format === null || format === '') {
          format = 'yyyy-MM-dd hh:mm:ss';
        }
        return this.utils.formatDate(date, format);
      }
    }
  };
</script>
