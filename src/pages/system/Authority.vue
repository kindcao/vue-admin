<template>
  <section>
    <el-form ref="filters" :model="filters">
      <el-row>
        <el-col :span="7">
          <el-form-item label="所属国家或地区" prop="authNation" label-width="130px">
            <el-input v-model="filters.authNation"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="适航局" prop="authNameAbbr" label-width="80px">
            <el-input v-model="filters.authNameAbbr"></el-input>
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
        <el-col :span="7">
          <el-form-item>
            <el-button type="primary" v-on:click="queryData">查询</el-button>
            <el-button type="primary" v-on:click="reset">重置</el-button>
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
    <el-table-column label="所属国家或地区" prop="authNation"  min-width="30%"></el-table-column>
    <el-table-column label="适航局" prop="authNameAbbr" min-width="15%"></el-table-column>
    <el-table-column label="CAA Nation" prop="authNationEn" min-width="40%"></el-table-column>
    <el-table-column label="操作" min-width="15%" align="center">
      <template scope="scope">
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
        <el-form-item label="所属国家或地区" prop="authNation">
          <el-input v-model="editForm.authNation"></el-input>
        </el-form-item>
        <el-form-item label="CAA Nation" prop="authNationEn">
          <el-input v-model="editForm.authNationEn"></el-input>
        </el-form-item>
        <el-form-item label="适航局" prop="authNameAbbr">
          <el-input v-model="editForm.authNameAbbr"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" :append-to-body="true">
      <el-form :model="addForm" label-width="130px" :rules="addFormRules" ref="addForm">
        <el-form-item label="所属国家或地区" prop="authNation">
          <el-input v-model="addForm.authNation"></el-input>
        </el-form-item>
        <el-form-item label="CAA Nation" prop="authNationEn">
          <el-input v-model="addForm.authNationEn"></el-input>
        </el-form-item>
        <el-form-item label="适航局" prop="authNameAbbr">
          <el-input v-model="addForm.authNameAbbr"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
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

  const POSITIVE = 0;
  const NEGATIVE = 1;
  export default {
    created () {
      this.queryData();
    },
    data () {
      return {
        tableData: [],
        filters: {
          authNation: '',
          authNameAbbr: '',
          flag: ''
        },
        loading: false,
        pagesize: 15,
        currentpage: 1,
        total: 0,
        sels: [], // 列表选中列
        editFormVisible: false,  // 编辑界面是否显示
        editLoading: false,
        editFormRules: {
          authNation: [
            { required: true, message: '请输入所属国家或地区', trigger: 'blur' },
            { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
          ],
          authNameAbbr: [
            { required: true, message: '请输入适航局名称', trigger: 'blur' },
            { min: 1, max: 32, message: '长度在 1 到 128 个字符', trigger: 'blur' }
          ],
          authNationEn: [
            { required: true, message: '请输入适航局英文名称', trigger: 'blur' },
            { min: 1, max: 32, message: '长度在 1 到 128 个字符', trigger: 'blur' }
          ]
        },
        // 编辑界面数据
        editForm: {
          id: 0,
          authNation: '',
          authNameAbbr: '',
          authNationEn: '',
          flag: 0,
          createById: '',
          createTime: '',
          updateById: '',
          updateTime: ''
        },

        addFormVisible: false, // 新增界面是否显示
        addLoading: false,
        addFormRules: {
          authNation: [
            { required: true, message: '请输入所属国家或地区', trigger: 'blur' },
            { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
          ],
          authNameAbbr: [
            { required: true, message: '请输入适航局名称', trigger: 'blur' },
            { min: 1, max: 32, message: '长度在 1 到 128 个字符', trigger: 'blur' }
          ],
          authNationEn: [
            { required: true, message: '请输入适航局英文名称', trigger: 'blur' },
            { min: 1, max: 32, message: '长度在 1 到 128 个字符', trigger: 'blur' }
          ]
        },
        // 新增界面数据
        addForm: {
          id: 0,
          authNation: '',
          authNameAbbr: '',
          authNationEn: '',
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
          url: 'http://106.12.133.158:1881/api/static/authority/query',
          type: 'POST',
          data: '{' +
                  "  'obj': {" +
                  "    'authNation': '" + sef.filters.authNation + "'," +
                  "    'authNameAbbr': '" + sef.filters.authNameAbbr + "'," +
                  "    'authNationEn': '" + sef.filters.authNationEn + "'," +
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
      reset() {
        this.$refs['filters'].resetFields();
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
            url: 'http://106.12.133.158:1881/api/static/authority/delete',
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
      // 显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      // 显示新增界面
      handleAdd: function () {
        this.addFormVisible = true;
        this.addForm = {
          id: 0,
          authNation: '',
          authNameAbbr: '',
          authNationEn: '',
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
                url: 'http://106.12.133.158:1881/api/static/authority/update',
                type: 'POST',
                data: '{' +
                  "    'id': '" + para.id + "'," +
                  "    'authNation': '" + para.authNation + "'," +
                  "    'authNameAbbr': '" + para.authNameAbbr + "'," +
                  "    'authNationEn': '" + para.authNationEn + "'," +
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
                url: 'http://106.12.133.158:1881/api/static/authority/add',
                type: 'POST',
                data: '{' +
                  "    'id': '" + para.id + "'," +
                  "    'authNation': '" + para.authNation + "'," +
                  "    'authNameAbbr': '" + para.authNameAbbr + "'," +
                  "    'authNationEn': '" + para.authNationEn + "'," +
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
            url: 'http://106.12.133.158:1881/api/static/authority/delete',
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
    filters: {
      rateTypeToText (rateType) {
        return rateType === POSITIVE ? '满意' : '不满意';
      }
    }
  }

</script>

