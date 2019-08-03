<template>
  <section>
    <el-form ref="filters" :model="filters" style="margin-bottom: 30px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="注册号" prop="acReg" label-width="130px">
            <el-input v-model="filters.acReg"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="飞机商业型" prop="acTypeId" label-width="130px">
            <el-select v-model="filters.acTypeId"  placeholder="请选择" style="width:100%" >
              <el-option  v-for="item in ACINFO_ACTypeList" :key="item.id" :label="item.acType" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="机身型号" prop="prodModelAcId" label-width="130px">
            <el-select v-model="filters.prodModelAcId"  placeholder="请选择" style="width:100%" >
              <el-option  v-for="item in ACINFO_ProductFuselageList" :key="item.id" :label="item.prodModel" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="机身序号" prop="acSn" label-width="130px">
            <el-input v-model="filters.acSn"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
      <el-col :span="6">
        <el-form-item label="发动机型号" prop="prodModelEng1Id" label-width="130px">
          <el-select v-model="filters.prodModelEng1Id"  placeholder="请选择" style="width:100%" >
            <el-option  v-for="item in ACINFO_ProductEngineList" :key="item.id" :label="item.prodModel" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="发动机序号" prop="engine1Sn" label-width="130px">
          <el-input v-model="filters.engine1Sn"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="APU型号" prop="prodModelApuId" label-width="130px">
          <el-select v-model="filters.prodModelApuId"  placeholder="请选择" style="width:100%" >
            <el-option  v-for="item in ACINFO_ProductAPUList" :key="item.id" :label="item.prodModel" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="APU序号" prop="apuSn" label-width="130px">
          <el-input v-model="filters.apuSn"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="飞机所属" prop="cnstIdProperty" label-width="130px">
            <el-select v-model="filters.cnstIdProperty"  placeholder="请选择" style="width:100%" >
              <el-option  v-for="item in ACINFO_ConstantACIList" :key="item.cnstId" :label="item.descTxt" :value="item.cnstId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发动机滑油型号" prop="consEngineOil" label-width="130px">
            <el-input v-model="filters.consEngineOil"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="液压油型号" prop="consHydFluid" label-width="130px">
            <el-input v-model="filters.consHydFluid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="APU滑油型号" prop="consApuOil" label-width="130px">
            <el-input v-model="filters.consApuOil"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="是否有效" prop="flag" label-width="130px">
            <el-select v-model="filters.flag">
              <el-option label="有效" value="0"></el-option>
              <el-option label="无效" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" v-on:click="queryData">查询</el-button>
            <el-button type="primary" v-on:click="reset">重置</el-button>
            <router-link :to="{ name: 'ACInfoAdd', params: { id: '', action: 'add' }}"> <el-button type="primary">新增</el-button></router-link>
<!--            <el-button type="primary" v-on:click="handleAdd">新增</el-button>-->
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
    <el-table-column label="注册号" prop="acReg"  min-width="13%"></el-table-column>
    <el-table-column label="飞机商业型" prop="acType" min-width="15%"></el-table-column>
    <el-table-column label="机身型号" prop="prodModelAc" min-width="15%"></el-table-column>
    <el-table-column label="机身序号" prop="acSn"  min-width="12%"></el-table-column>
      <el-table-column label="发动机型号" prop="prodModelEng1"  min-width="15%"></el-table-column>
      <el-table-column label="发动机序号" prop="engine1Sn"  min-width="15%"></el-table-column>
    <el-table-column label="操作" min-width="15%" align="center">
      <template scope="scope">
        <router-link :to="{ name: 'ACInfoAdd', params: { id: scope.row.id, action: 'update' }}"> <i class="el-icon-edit">编辑</i> </router-link>
<!--        <i class="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"><span>编辑</span></i>-->
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
  </section>
</template>
<style scope>
  @import '../../resources/form-controls.css';
</style>
<style>
  .el-table td, .el-table th {
    padding: 8px 0;
  }
  .el-table td, .el-table th {
    padding: 4px 0;
    font-size: 9pt;
  }
  .el-col {
    height:40px;
    min-height: 40px;
  }
</style>
<script>
  import $ from 'jquery';

  const POSITIVE = 0;
  const NEGATIVE = 1;
  export default {
    created () {
      this.initConstantVal();
      this.queryData();
    },
    data () {
      return {
        tableData: [],
        filters: {
          acReg: '',
          acTypeId: '',
          prodModelAcId: '',
          acSn: '',
          prodModelEng1Id: '',
          engine1Sn: '',
          prodModelApuId: '',
          apuSn: '',
          cnstIdProperty: '',
          consEngineOil: '',
          consHydFluid: '',
          consApuOil: '',
          flag: ''
        },
        loading: false,
        pagesize: 15,
        currentpage: 1,
        total: 0,
        ACINFO_ACTypeList: [],
        ACINFO_ProductFuselageList: [],
        ACINFO_ProductEngineList: [],
        ACINFO_ProductAPUList: [],
        ACINFO_ConstantACIList: [],
        sels: [] // 列表选中列
      }
    },
    methods: {
      queryData () {
        let sef = this;
        $.ajax({
          url: 'http://106.12.133.158:1881/api/static/acinfo/query',
          type: 'POST',
          data: '{' +
                  "  'obj': {" +
                  "    'acTypeId': '" + sef.filters.acTypeId + "'," +
                  "    'acReg': '" + sef.filters.acReg + "'," +
                  "    'prodModelAcId': '" + sef.filters.prodModelAcId + "'," +
                  "    'acSn': '" + sef.filters.acSn + "'," +
                  "    'prodModelEng1Id': '" + sef.filters.prodModelEng1Id + "'," +
                  "    'engine1Sn': '" + sef.filters.engine1Sn + "'," +
                  "    'prodModelApuId': '" + sef.filters.prodModelApuId + "'," +
                  "    'apuSn': '" + sef.filters.apuSn + "'," +
                  "    'cnstIdProperty': '" + sef.filters.cnstIdProperty + "'," +
                  "    'consEngineOil': '" + sef.filters.consEngineOil + "'," +
                  "    'consHydFluid': '" + sef.filters.consHydFluid + "'," +
                  "    'consApuOil': '" + sef.filters.consApuOil + "'," +
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
      initConstantVal: function () {
        var self = this;
        $.ajax({
          url: 'http://106.12.133.158:1881/api/static/actype/query',
          type: 'POST',
          data: "{ 'obj': { 'acType': null } }",
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              self.ACINFO_ACTypeList = result.data;
            } else {
              console.log(result.ACINFO_ACTypeList);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
        $.ajax({
          url: 'http://106.12.133.158:1881/api/static/prodmodel/query',
          type: 'POST',
          data: "{ 'obj': { 'cnstIdType': \"'productmodel_type_fl','productmodel_type_eng','productmodel_type_apu'\" } }",
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              self.ACINFO_ProductFuselageSubList = result.data.filter(item => item.cnstIdType === 'productmodel_type_fl');
              self.ACINFO_ProductEngineSubList = result.data.filter(item => item.cnstIdType === 'productmodel_type_eng');
              self.ACINFO_ProductAPUSubList = result.data.filter(item => item.cnstIdType === 'productmodel_type_apu');
            } else {
              console.log(result.status);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
        $.ajax({
          url: 'http://106.12.133.158:1881/api/static/cnstval/querySub',
          type: 'POST',
          data: "{ 'obj': { 'cnstId': \"'acinfor_property'\" } }",
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              self.ACINFO_ConstantACIList = result.data;
            } else {
              console.log('ACI字典下拉框初始化失败.');
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
          this.loading = true;
          // NProgress.start();
          $.ajax({
            url: 'http://106.12.133.158:1881/api/static/acinfo/delete',
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
            url: 'http://106.12.133.158:1881/api/static/acinfo/delete',
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

