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
  export default {
    created() {

    },
    data() {
      return {
        tableData: [],
        filters: {
          'userName': ''
        },
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
                if (res.data.status === 0) {
                  sef.addLoading = false;
                  // NProgress.done();
                  sef.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  sef.$refs['addForm'].resetFields();
                  sef.addFormVisible = false;
                } else {
                  this.$message({
                    type: 'error',
                    message: res.data.data,
                    center: true
                  });
                }
              });
            })
          }
        })
      }
    }
  }
</script>


