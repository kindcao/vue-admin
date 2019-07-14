<template>
  <el-form ref="form" :model="form" label-width="120px" @submit.prevent="onSubmit"
           style="margin:0 0 100px;width:80%;min-width:800px;">
    <el-row hidden>
      <el-col :span="18">
        <el-form-item label="编码">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <el-form-item label="适航局" prop="issue_auth_id">
          <el-select v-model="form.issue_auth_id" placeholder="请选择适航局">
            <el-option label="FAA" value="FAA"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <el-form-item label="适航指令号" prop="ad_comp_num">
          <el-input v-model="form.ad_comp_num"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <el-form-item label="版本" prop="ad_comp_ver">
          <el-input type="number" v-model.number="form.ad_comp_ver"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <el-form-item label="描述" prop="ad_comp_name">
          <el-input v-model="form.ad_comp_name"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <el-form-item label="生效日期" prop="ad_date_eff">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.ad_date_eff"
                          style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
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
        <el-form-item label="创建人" prop="ad_comp_name">
          <span>{{form.create_by_id}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="9">
        <el-form-item label="创建时间" prop="ad_comp_name">
          <span>{{form.create_time}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row hidden="true">
      <el-col :span="9">
        <el-form-item label="更新人" prop="ad_comp_name">
          <span>{{form.update_by_id}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="9">
        <el-form-item label="更新时间" prop="ad_comp_name">
          <span>{{form.update_time}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="评估机型列表">
      <el-table
        :data="tableData"
        border
        style="width: 100%;height: 200px;">
        <el-table-column
          prop="date"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-row>
      <el-col :span="9">
        <el-form-item label="接受工程师" prop="ad_comp_name">
          <el-input placeholder="请选择工程师" v-model="input3" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="9">
        <el-form-item label="传达日期" prop="ad_date_eff">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.ad_date_eff"
                          style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-col :span="24" class="toolbar" style="margin: 20px 0;">
      <el-form-item class="clearfix">
        <el-button type="primary">立即创建</el-button>
        <el-button @click.native.prevent>取消</el-button>
      </el-form-item>
    </el-col>
  </el-form>
</template>
<style>
  .clearfix:after {
    HEIGHT: 0px;
    CONTENT: '';
    CLEAR: both;
    DISPLAY: block;
    VISIBILITY: hidden
  }

  .clearfix {
    ZOOM: 1
  }

  .content-wrapper {
    background: #fff;
  }

  .el-form-item {
    margin-bottom: 10px;
  }

  .el-form-item__label {
    line-height: 35px;
  }

  .el-form-item__content {
    line-height: 35px;
  }

  input[type='text'], input[type='number'] {
    height: 35px;
    padding: 0 15px;
  }

  .el-input__icon {
    line-height: 35px;
  }

  .el-row {
    margin-bottom: 0px;
  }

  .el-col {
    border-radius: 4px;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 30px;
  }

  .el-table th {
    padding: 0px;
    height: 15px;
    font-size: 9pt;
  }

  .el-table td {
    padding: 4px 0;
    font-size: 9pt;
  }

  .el-col {
    height: 45px;
    min-height: 45px;
  }
</style>
<script>
  export default {
    created() {
      this.queryADCompDoc();
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
          id: '',
          issue_auth_id: '',
          ad_comp_num: '',
          ad_comp_ver: '',
          ad_comp_name: '',
          ad_date_eff: '',
          create_by_id: '',
          create_time: '',
          update_by_id: '',
          update_time: ''
        },
        loading: false,
        pagesize: 5,
        currentpage: 1,
        total: 0
      }
    },
    methods: {

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
