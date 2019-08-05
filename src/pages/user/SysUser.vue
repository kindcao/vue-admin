<template>
  <section>
    <el-form ref="filters" :model="filters" label-width="120px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="用户名" prop="acType">
            <el-input v-model="filters.userName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
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
      <el-table-column label="编号" prop="id" align="center" min-width="30"></el-table-column>
      <el-table-column label="用户名" prop="userName"></el-table-column>
      <el-table-column label="密码" prop="passwd"></el-table-column>
      <el-table-column label="用户全称" prop="fullName"></el-table-column>
      <el-table-column label="邮件地址" prop="email"></el-table-column>
      <el-table-column label="操作" align="center" min-width="50">
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
    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" :append-to-body="true">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="addForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passwd">
          <el-input v-model="addForm.passwd" show-password></el-input>
        </el-form-item>
        <el-form-item label="用户全称" prop="fullName">
          <el-input v-model="addForm.fullName"></el-input>
        </el-form-item>
        <el-form-item label="邮件地址" prop="email">
          <el-input v-model="addForm.email"></el-input>
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
  const POSITIVE = 0;
  const NEGATIVE = 1;
  export default {
    created() {
      this.queryData();
    },
    data() {
      return {
        tableData: [],
        filters: {
          userName: ''
        },
        loading: false,
        pagesize: 15,
        currentpage: 1,
        total: 0,
        sels: [], // 列表选中列
        addFormVisible: false, // 新增界面是否显示
        addLoading: false,
        addFormRules: {
          userName: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 4, max: 32, message: '长度在4 到 32 个字符', trigger: 'blur'}
          ],
          passwd: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 4, max: 32, message: '长度在 4 到 32 个字符', trigger: 'blur'}
          ],
          fullName: [
            {required: true, message: '请输入用户全称', trigger: 'blur'},
            {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
          ],
          email: [
            {type: 'email', required: false, message: '请输入邮件地址', trigger: 'blur'}
          ]
        },
        // 新增界面数据
        addForm: {
          email: '',
          fullName: '',
          passwd: '',
          userName: ''
        }
      }
    },
    // 显示新增界面
    methods: {
      queryData() {
        let sef = this;
        this.axios.post('/sys/sysuser/query', {
          obj: {
            userName: sef.filters.userName
          },
          page: {
            pageNum: sef.currentpage,
            pageSize: sef.pagesize
          }
        }).then((res) => {
          sef.tableData = res.data.list;
          sef.total = res.data.total;
          sef.loading = false;
        });
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
      handleAdd: function () {
        this.addFormVisible = true;
        this.addForm = {
          email: '',
          fullName: '',
          passwd: '',
          userName: ''
        }
      },
      addSubmit: function () {
        var sef = this;
        sef.$refs.addForm.validate((valid) => {
          if (valid) {
            sef.$confirm('确认提交吗？', '提示', {}).then(() => {
              sef.addLoading = true;
              // NProgress.start();
              let para = Object.assign({}, this.addForm);
              this.axios.post('/sys/sysuser/add', {
                'email': para.email,
                'passwd': para.passwd,
                'userName': para.userName,
                'fullName': para.fullName
              }).then((res) => {
                sef.addLoading = false;
                sef.$refs['addForm'].resetFields();
                sef.addFormVisible = false;
              }).catch((e) => {
                sef.addLoading = false;
                this.addForm.userName = '';
              })
            })
          }
        })
      },
      handleSelectionChange: function (sels) {
        this.sels = sels;
      },
      // 批量删除
      batchRemove: function () {
      }
    }
  }
</script>


