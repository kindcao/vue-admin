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
        <el-col :span="6">
          <el-form-item label="文档名称" prop="docName" label-width="100px">
            <el-input v-model="filters.docName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
            label="文档版本"
            label-width="100px"
            prop="docVer"
            :rules="[
            { type: 'number', message: '文档版本必须为数字值'}
            ]">
            <el-input type="age" v-model.number="filters.docVer" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="是否有效" prop="flag" label-width="100px">
            <el-select v-model="filters.flag">
              <el-option label="有效" value="0"></el-option>
              <el-option label="无效" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11" style="display: inline-block; ">
          <el-form-item label="生效日期" prop="effcDateStart" label-width="110px">
            <el-date-picker type="date" placeholder="选择日期" v-model="filters.effcDateStart" style="width: 160px;" size="medium"></el-date-picker>
            -
            <el-date-picker type="date" placeholder="选择日期" v-model="filters.effcDateEnd" style="width: 160px;" size="medium"></el-date-picker>
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
    <el-table-column label="飞机商业型" prop="acTypeId"  min-width="15%"></el-table-column>
    <el-table-column label="文档名称" prop="docName" min-width="40%"></el-table-column>
    <el-table-column label="文档版本" prop="docVer" min-width="15%"></el-table-column>
    <el-table-column label="生效日期" prop="effcDate"  min-width="15%"></el-table-column>
    <el-table-column label="操作" min-width="15%" align="center">
      <template scope="scope">
<!--        <router-link :to="{ name: 'OEMDocAdd', params: { id: scope.row.id }}"> <i class="el-icon-edit"><span>编辑</span></i> </router-link>-->
        <i class="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"><span>编辑</span></i>
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

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" :append-to-body="true">
      <el-form :model="editForm" label-width="130px" :rules="editFormRules" ref="editForm">
        <el-form-item label="主键" prop="id" hidden>
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>
        <el-form-item label="飞机商业型" prop="acTypeId">
          <el-select v-model="editForm.acTypeId"  placeholder="请选择" style="width:100%"  @change="changeSelectVal($event, 'editForm')">
            <el-option  v-for="item in dictionary" :key="item.id" :label="item.acType" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文档名称" prop="docName">
          <el-input v-model="editForm.docName"></el-input>
        </el-form-item>
        <el-form-item label="文档版本" prop="docVer">
          <el-input-number v-model="editForm.docVer" :min="0" :max="20"></el-input-number>
        </el-form-item>
        <el-form-item label="生效日期" prop="effcDate">
          <el-date-picker type="date" placeholder="选择日期" v-model="editForm.effcDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%;" size="medium"></el-date-picker>
        </el-form-item>
        <el-form-item label="评估结论" prop="evalConclusion">
          <el-input type="textarea" placeholder="请输入内容" v-model="editForm.evalConclusion"  maxlength="50" show-word-limit></el-input>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" :append-to-body="true">
      <el-form :model="addForm" label-width="130px" :rules="addFormRules" ref="addForm" style="margin-top: -15px;">
        <el-form-item label="飞机商业型" prop="acTypeId">
          <el-select v-model="addForm.acTypeId"  placeholder="请选择" style="width:100%"  @change="changeSelectVal($event, 'addForm')">
            <el-option  v-for="item in dictionary" :key="item.id" :label="item.acType" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文档名称" prop="docName">
          <el-input v-model="addForm.docName"></el-input>
        </el-form-item>
        <el-form-item label="文档版本" prop="docVer">
          <el-input-number v-model="addForm.docVer" :min="0" :max="20"></el-input-number>
        </el-form-item>
        <el-form-item label="生效日期" prop="effcDate">
          <el-date-picker type="date" placeholder="选择日期" v-model="addForm.effcDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%;" size="medium"></el-date-picker>
        </el-form-item>
        <el-form-item label="评估结论" prop="evalConclusion">
          <el-input type="textarea" placeholder="请输入内容" v-model="addForm.evalConclusion" maxlength="50" show-word-limit></el-input>
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
          docName: '',
          docVer: '',
          effcDateStart: '',
          effcDateEnd: '',
          flag: ''
        },
        loading: false,
        pagesize: 15,
        currentpage: 1,
        total: 0,
        dictionary: [],
        sels: [], // 列表选中列
        editFormVisible: false,  // 编辑界面是否显示
        editLoading: false,
        editFormRules: {
          acTypeId: [
            {required: true, message: '请选择飞机商业机型', trigger: 'blur'}
          ],
          docName: [
            {required: true, message: '请输入文档名称', trigger: 'blur'},
            {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
          ],
          docVer: [
            {required: true, message: '请输入文档版本', trigger: 'blur'},
            {type: 'number', message: '文档版本必须是数字', trigger: 'blur'}
          ]
        },
        // 编辑界面数据
        editForm: {
          id: 0,
          acTypeId: '',
          acTypeText: '',
          docName: '',
          docVer: 0,
          effcDate: null,
          evalConclusion: '',
          flag: 0,
          createById: '',
          createTime: '',
          updateById: '',
          updateTime: ''
        },

        addFormVisible: false, // 新增界面是否显示
        addLoading: false,
        addFormRules: {
          acTypeId: [
            {required: true, message: '请选择飞机商业机型', trigger: 'blur'}
          ],
          docName: [
            {required: true, message: '请输入文档名称', trigger: 'blur'},
            {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
          ],
          docVer: [
            {required: true, message: '请输入文档版本', trigger: 'blur'},
            {type: 'number', message: '文档版本必须是数字', trigger: 'blur'}
          ]
        },
        // 新增界面数据
        addForm: {
          id: 0,
          acTypeId: '',
          acTypeText: '',
          docName: '',
          docVer: 0,
          effcDate: null,
          evalConclusion: '',
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
          url: 'http://106.12.133.158:1881/api/pm/oemdoc/query',
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
      reset() {
        this.$refs['filters'].resetFields();
      },
      changeSelectVal: function (id, formType) {
        let selectedWorkName = this.dictionary.filter(item => item.id === id);
        if (selectedWorkName === null) return;
        if (formType === 'editForm') {
          this.editForm.acTypeText = selectedWorkName[0].descTxt;
        } else if (formType === 'addForm') {
          this.addForm.acTypeText = selectedWorkName[0].descTxt;
        }
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
            url: 'http://106.12.133.158:1881/api/pm/oemdoc/delete',
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
          url: 'http://106.12.133.158:1881/api/static/actype/query',
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
      },
      // 显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        /*
        if (row.effcDate !== null && row.effcDate !== '' && row.effcDate !== undefined) {
          row.effcDate = new Date(row.effcDate);
        } */
        this.editForm = Object.assign({}, row);
      },
      // 显示新增界面
      handleAdd: function () {
        this.addFormVisible = true;
        this.addForm = {
          id: 0,
          acTypeId: '',
          docName: '',
          docVer: 0,
          effcDate: null,
          evalConclusion: '',
          flag: 0,
          createById: '',
          createTime: '',
          updateById: '',
          updateTime: ''
        };
      },
      // 编辑
      editSubmit: function () {
        var sef = this;
        sef.$refs.editForm.validate((valid) => {
          if (valid) {
            sef.$confirm('确认提交吗？', '提示', {}).then(() => {
              sef.editLoading = true;
              // NProgress.start();
              let para = Object.assign({}, this.editForm);
              $.ajax({
                url: 'http://106.12.133.158:1881/api/pm/oemdoc/update',
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
                    sef.editLoading = false;
                    // NProgress.done();
                    sef.$message({
                      message: '数据编辑成功.',
                      type: 'success'
                    });
                    sef.$refs['editForm'].resetFields();
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
                url: 'http://106.12.133.158:1881/api/pm/oemdoc/add',
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
            url: 'http://106.12.133.158:1881/api/pm/oemdoc/delete',
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
        return this.uitls.formatDate(date, format);
      }
    }
  }

</script>

