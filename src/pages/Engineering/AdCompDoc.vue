<template>
  <div class='basic'>
    <el-form ref="filters" :model="filters" label-width="80px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="适航局" prop="issue_auth_id">
            <el-select v-model="filters.issue_auth_id" placeholder="请选择适航局" size="medium">
              <el-option label="FAA" value="FAA"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="机型" prop="ac_type_id">
            <el-select v-model="filters.ac_type_id" placeholder="请选择机型" size="medium">
              <el-option label="机型一" value="FAA"></el-option>
              <el-option label="机型二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="AD号" prop="ad_comp_num">
            <el-input v-model="filters.ad_comp_num" size="medium"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="生效日期" prop="ad_date_eff">
            <el-col :span="10">
              <el-date-picker type="date" placeholder="选择日期" v-model="filters.ad_date_eff_start" style="width: 100%;"
                              size="medium"></el-date-picker>
            </el-col>
            <el-col class="line" :span="1" align="center">-</el-col>
            <el-col :span="10">
              <el-date-picker type="date" placeholder="选择日期" v-model="filters.ad_date_eff_end" style="width: 100%;"
                              size="medium"></el-date-picker>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="版本" prop="ad_comp_ver">
            <el-input type="number" v-model.number="filters.ad_comp_ver" size="medium"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="描述" prop="ad_comp_name">
            <el-input v-model="filters.ad_comp_name" size="medium"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item>
            <el-button type="primary" v-on:click="getATAChapterServerData" size="small">查询</el-button>
            <el-button type="primary" v-on:click="reset" size="small">重置</el-button>
            <router-link :to="{ name: 'ADCompDocAdd', params: { id: '', action: 'add' }}"> <el-button type="primary">新增</el-button></router-link>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span='24'>
        <el-table
          :data="tableData" border
          style="width: 100%">
          <el-table-column type="expand" style="background: red" class="expand-column-bg" >
            <template slot-scope="props">
              <el-form label-width="90px" :inline="false">
                <el-row>
                  <el-col :span="6" style="height: 30px;line-height: 30px">
                    <el-form-item label="适航局">
                      <span>{{ props.row.issue_auth_id }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="适航指令号">
                      <span>{{ props.row.ad_comp_num }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="版本">
                      <span>{{ props.row.ad_comp_ver }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="描述" class="item_content">
                      <template slot-scope="scope">
                        <el-popover placement="top-start" title="适航文件标题" width="400" trigger="hover" >
                          <div style="font-size: 9pt">{{props.row.ad_comp_name}}</div>
                          <span slot="reference">{{ props.row.ad_comp_name.substr(0,120)+'...' }}</span>
                        </el-popover>
                      </template>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="适航指令号">
                      <span>{{ props.row.ad_date_eff }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="操作人">
                      <span>{{ props.row.update_by_id }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    <el-form-item label="操作时间">
                      <span>{{ props.row.update_time }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="适航指令号" align="left" width="200px">
            <template slot-scope="scope">
              <span style="">{{ scope.row.issue_auth_id  + ' AD ' +  scope.row.ad_comp_num + ' R' + scope.row.ad_comp_ver }}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述" prop="ad_comp_name" min-width="20%"></el-table-column>
          <el-table-column label="操作" width="120px" align="center">
            <template scope="scope">
              <router-link :to="{ name: 'ADCompDocAdd', params: { id: scope.row.id, action: 'update' }}"> <i class="el-icon-edit">编辑</i> </router-link>
              <!--<i class="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"><span>编辑</span></i>-->
              <i style="width:20px;">&nbsp;</i>
              <i class="el-icon-delete" @click="handleDel(scope.$index, scope.row)"><span>删除</span></i>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 16px; text-align:right;"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[5, 10, 15, 20]"
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

</style>
<script>
  const NEGATIVE = 1;
  export default {
    created() {
      this.queryADCompDoc();
    },
    data() {
      return {
        tableData: [],
        filters: {
          issue_auth_id: '',
          ac_type_id: '',
          ad_comp_num: '',
          ad_comp_ver: '',
          ad_comp_name: '',
          ad_date_eff_start: '',
          ad_comp_num_end: ''
        },
        loading: false,
        pagesize: 5,
        currentpage: 1,
        total: 0
      }
    },
    methods: {
      queryADCompDoc() {
        this.axios.get(`getQueryADCompDocData?per_page=${this.pagesize}&cur_page=${this.currentpage}&issue_auth_id=${this.filters.issue_auth_id}`)
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
      addRowClass({row, rowIndex}) {
        if (row.rateType === NEGATIVE) {
          return 'warning-row';
        }
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
    },
    mounted: function() {
      this.tableExpandCellWidth = window.innerWidth - this.$refs.table.$el.offsetLeft - 50;
      // window.innerWidth:浏览器的可用宽度
      // this.$refs.table.$el.offsetLeft：表格距离浏览器的宽度
      // 后面的50：根据需求空出的宽度，自行调整
    }
  };

</script>
