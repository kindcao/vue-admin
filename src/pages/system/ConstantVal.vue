<template>
  <section>
    <el-form ref="filters" :model="filters" >
      <el-row>
        <el-col :span="4">
          <el-form-item label="分类" prop="classify" label-width="50px">
            <el-input v-model="filters.classify"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="名称或描述" prop="descTxt" label-width="90px">
            <el-input v-model="filters.descTxt"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="是否有效" prop="flag" label-width="75px">
            <el-select v-model="filters.flag">
              <el-option label="有效" value="0"></el-option>
              <el-option label="无效" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item style="margin-left: 20px;">
            <el-button type="primary" v-on:click="queryData">查询</el-button>
            <el-button type="primary" v-on:click="reset">重置</el-button>
            <el-button type="primary" v-on:click="handleAdd('category')">创建分类</el-button>
            <el-button type="primary" v-on:click="handleAdd('constant')">新增常量</el-button>
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
    <el-table-column label="分类" prop="classify" align="center" min-width="30%"></el-table-column>
    <el-table-column label="名称或描述" prop="descTxt" min-width="45%"></el-table-column>
    <el-table-column label="操作" min-width="25%" align="center">
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
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormCategoryVisible" :close-on-click-modal="false" :append-to-body="true">
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
        <el-form-item label="主键" prop="id" hidden>
          <el-input v-model="editForm.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="classify">
          <el-input v-model="editForm.classify"></el-input>
        </el-form-item>
        <el-form-item label="名称或描述" prop="descTxt">
          <el-input v-model="editForm.descTxt"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="displayOrder">
          <el-input v-model="editForm.displayOrder"></el-input>
        </el-form-item>
        <el-form-item label="父节点" prop="parentId" hidden>
          <el-input v-model="editForm.parentId"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormCategoryVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormCategoryVisible" :close-on-click-modal="false" :append-to-body="true">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
        <el-form-item label="分类" prop="classify">
          <el-input v-model="addForm.classify" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="名称或描述" prop="descTxt">
          <el-input v-model="addForm.descTxt"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="displayOrder">
          <el-input v-model="addForm.displayOrder"></el-input>
        </el-form-item>
        <el-form-item label="父节点" prop="parentId" hidden>
          <el-input v-model="editForm.parentId"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormCategoryVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" :append-to-body="true">
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
          <el-form-item label="主键" prop="id" hidden>
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="classify">
          <el-select v-model="editForm.classify"  placeholder="请选择" style="width:100%" @change="changeSelectVal($event, 'editForm')">
            <el-option
              v-for="item in dictionary"
              :key="item.id"
              :label="item.descTxt"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称或描述" prop="descTxt">
          <el-input v-model="editForm.descTxt"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="displayOrder">
          <el-input v-model="editForm.displayOrder"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" :append-to-body="true">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
        <el-form-item label="分类" prop="classify">
          <el-select v-model="addForm.classify"  placeholder="请选择" style="width:100%"  @change="changeSelectVal($event, 'addForm')">
            <el-option
              v-for="item in dictionary"
              :key="item.id"
              :label="item.descTxt"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称或描述" prop="descTxt">
          <el-input v-model="addForm.descTxt"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="displayOrder">
          <el-input v-model="addForm.displayOrder"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<style scoped>
  @import '../../resources/form-controls.css';
</style>
<script>

  import * as uitl from 'src/utils/utils';
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
          classify: '',
          descTxt: '',
          flag: ''
        },
        loading: false,
        pagesize: 15,
        currentpage: 1,
        total: 0,

        dictionary: [],

        sels: [], // 列表选中列
        editFormCategoryVisible: false, // 新增界面是否显示
        editFormVisible: false,  // 编辑界面是否显示
        editLoading: false,
        editFormRules: {
          classify: [
            { required: true, message: '请输入分类', trigger: 'blur' }
          ],
          descTxt: [
            { required: true, message: '名称或描述', trigger: 'blur' },
            { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
          ]
        },
        // 编辑界面数据
        editForm: {
          id: 0,
          classify: '',
          descTxt: '',
          parentId: 0,
          displayOrder: 0,
          remark: '',
          flag: 0,
          createById: '',
          createTime: '',
          updateById: '',
          updateTime: ''
        },

        addFormCategoryVisible: false, // 新增界面是否显示
        addFormVisible: false, // 新增界面是否显示
        addLoading: false,
        addFormRules: {
          classify: [
            { required: true, message: '请输入分类', trigger: 'blur' }
          ],
          descTxt: [
            { required: true, message: '名称或描述', trigger: 'blur' },
            { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
          ]
        },
        // 新增界面数据
        addForm: {
          id: 0,
          classify: '',
          descTxt: '',
          parentId: 0,
          displayOrder: 0,
          remark: '',
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
          url: 'http://106.12.133.158:88/api/static/cnstval/query',
          type: 'POST',
          data: '{' +
                  "  'obj': {" +
                  "    'classify': '" + sef.filters.classify + "'," +
                  "    'descTxt': '" + sef.filters.descTxt + "'," +
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
            url: 'http://106.12.133.158:88/api/static/cnstval/delete',
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
        var self = this;
        if (row.parentId === -1) {
          // self.dictionary = row;
          this.editFormCategoryVisible = true;
          this.editForm.parentId = -1;
          this.editForm.classify = '业务分类';
        } else {
          self.editFormVisible = true;
          $.ajax({
            url: 'http://106.12.133.158:88/api/static/cnstval/query',
            type: 'POST',
            data: '{' +
              "  'obj': {" +
              "    'parentId': -1" +
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
        }
        this.editForm = Object.assign({}, row);
      },
      // 显示新增界面
      handleAdd: function (action) {
        this.addForm = {
          id: 0,
          classify: '',
          descTxt: '',
          parentId: 0,
          displayOrder: 0,
          remark: '',
          flag: 0,
          createById: '',
          createTime: '',
          updateById: '',
          updateTime: ''
        };
        if (action === 'category') {
          this.addFormCategoryVisible = true;
          this.addForm.parentId = -1;
          this.addForm.classify = 'root';
        } else {
          this.addFormVisible = true;
          var self = this;
          $.ajax({
            url: 'http://106.12.133.158:88/api/static/cnstval/query',
            type: 'POST',
            data: '{' +
              "  'obj': {" +
              "    'parentId': -1" +
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
        }
      },
      changeSelectVal: function (id, formType) {
        let selectedWorkName = this.dictionary.filter(item => item.id === id);
        if (selectedWorkName === null) return;
        if (formType === 'editForm') {
          this.editForm.classify = selectedWorkName[0].descTxt;
          this.editForm.parentId = id;
        } else if (formType === 'addForm') {
          this.addForm.classify = selectedWorkName[0].descTxt;
          this.addForm.parentId = id;
        }
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
                url: 'http://106.12.133.158:88/api/static/cnstval/update',
                type: 'POST',
                data: '{' +
                  "    'id': '" + para.id + "'," +
                  "    'classify': '" + para.classify + "'," +
                  "    'descTxt': '" + para.descTxt + "'," +
                  "    'displayOrder': '" + para.displayOrder + "'," +
                  "    'remark': '" + para.remark + "'," +
                  "    'parentId': '" + para.parentId + "'," +
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
                    if (para.parentId === -1) {
                      sef.editFormCategoryVisible = false;
                    } else {
                      sef.editFormVisible = false;
                    }

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
                url: 'http://106.12.133.158:88/api/static/cnstval/add',
                type: 'POST',
                data: '{' +
                  "    'id': '" + para.id + "'," +
                  "    'classify': '" + para.classify + "'," +
                  "    'descTxt': '" + para.descTxt + "'," +
                  "    'displayOrder': '" + para.displayOrder + "'," +
                  "    'remark': '" + para.remark + "'," +
                  "    'parentId': '" + para.parentId + "'," +
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
                    if (para.parentId === -1) {
                      sef.addFormCategoryVisible = false;
                    } else {
                      sef.addFormVisible = false;
                    }
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
            url: 'http://106.12.133.158:88/api/static/cnstval/delete',
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
      },
      formatDate (time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
    }
  }

</script>

