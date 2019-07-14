<template>
  <el-form ref="form" :model="form" :rules="formRules" label-width="120px" @submit.prevent="onSubmit" style="margin:0 0 100px;width:100%;">
    <el-row hidden>
      <el-col :span="24">
        <el-form-item label="主键" prop="id" hidden>
          <el-input v-model="form.id"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="飞机信息" name="1">
        <el-row style="width: 90%">
          <el-col :span="8">
            <el-form-item label="飞机商业型" prop="acTypeId" label-width="130px">
              <el-select v-model="form.acTypeId"  placeholder="请选择" style="width:100%" >
                <el-option  v-for="item in ACINFO_ACTypeSubList" :key="item.id" :label="item.acType" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册号" prop="acReg" label-width="130px">
              <el-input v-model="form.acReg"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公司分组" prop="acGroup" label-width="130px">
              <el-input v-model="form.acGroup"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="width: 90%">
          <el-col :span="8">
            <el-form-item label="飞机所属" prop="cnstIdPropertyId" label-width="130px">
              <el-select v-model="form.cnstIdPropertyId"  placeholder="请选择" style="width:100%" >
                <el-option  v-for="item in ACINFO_ConstantACISubList" :key="item.id" :label="item.descTxt" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="机身型号" prop="prodModelAcId" label-width="130px">
              <el-select v-model="form.prodModelAcId"  placeholder="请选择" style="width:100%" >
                <el-option  v-for="item in ACINFO_ProductFuselageSubList" :key="item.id" :label="item.prodModel" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="机身序号" prop="acSn" label-width="130px">
              <el-input v-model="form.acSn"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="发动机信息" name="2">
        <el-row style="width: 90%">
          <el-col :span="12">
            <el-form-item label="发动机型号(1)" prop="prodModelEng1Id" label-width="130px">
              <el-select v-model="form.prodModelEng1Id"  placeholder="请选择" style="width:100%" >
                <el-option  v-for="item in ACINFO_ProductEngineSubList" :key="item.id" :label="item.prodModel" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发动机序号(1)" prop="engine1Sn" label-width="130px">
              <el-input v-model="form.engine1Sn"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="width: 90%">
          <el-col :span="12">
            <el-form-item label="发动机型号(2)" prop="prodModelEng2Id" label-width="130px">
              <el-select v-model="form.prodModelEng2Id"  placeholder="请选择" style="width:100%" >
                <el-option  v-for="item in ACINFO_ProductEngineSubList" :key="item.id" :label="item.prodModel" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发动机序号(2)" prop="engine2Sn" label-width="130px">
              <el-input v-model="form.engine2Sn"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="width: 90%">
          <el-col :span="12">
            <el-form-item label="发动机型号(3)" prop="prodModelEng3Id" label-width="130px">
              <el-select v-model="form.prodModelEng3Id"  placeholder="请选择" style="width:100%" >
                <el-option  v-for="item in ACINFO_ProductEngineSubList" :key="item.id" :label="item.prodModel" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发动机序号(3)" prop="engine3Sn" label-width="130px">
              <el-input v-model="form.engine3Sn"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="width: 90%">
          <el-col :span="12">
            <el-form-item label="发动机型号(4)" prop="prodModelEng4Id" label-width="130px">
              <el-select v-model="form.prodModelEng4Id"  placeholder="请选择" style="width:100%" >
                <el-option  v-for="item in ACINFO_ProductEngineSubList" :key="item.id" :label="item.prodModel" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发动机序号(4)" prop="engine4Sn" label-width="130px">
              <el-input v-model="form.engine4Sn"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="APU信息" name="3">
        <el-row style="width: 90%">
          <el-col :span="12">
            <el-form-item label="APU型号" prop="prodModelApuId" label-width="130px">
              <el-select v-model="form.prodModelApuId"  placeholder="请选择" style="width:100%" >
                <el-option  v-for="item in ACINFO_ProductAPUSubList" :key="item.id" :label="item.prodModel" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="APU序号" prop="apuSn" label-width="130px">
              <el-input v-model="form.apuSn"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="辅助信息" name="4">
        <el-row style="width: 90%">
          <el-col :span="8">
            <el-form-item label="发动机滑油型号" prop="consEngineOil">
              <el-input v-model="form.consEngineOil"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="液压油型号" prop="consHydFluid">
              <el-input v-model="form.consHydFluid"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="APU滑油型号" prop="consApuOil">
              <el-input v-model="form.consApuOil"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
    <el-row hidden="true">
      <el-col :span="12">
        <el-form-item label="创建人" prop="createById">
          <span>{{form.createById}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="创建时间" prop="createTime">
          <span>{{form.createTime}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row hidden="true">
      <el-col :span="12">
        <el-form-item label="更新人" prop="updateById">
          <span>{{form.updateById}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="更新时间" prop="updateTime">
          <span>{{form.updateTime}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
    <el-col :span="24" class="toolbar" style="margin: 10px 0;">
      <el-form-item class="clearfix">
        <el-button type="primary" @click.native="dataSubmit" :loading="loading"  class="el-icon-edit">保存</el-button>
        <el-button @click.native="$router.back(-1)"  class="el-icon-back">返回</el-button>
      </el-form-item>
    </el-col>
    </el-row>
  </el-form>
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
    height:50px;
    min-height: 50px;
  }
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
        activeNames: ['1', '2', '3', '4'],
        form: {
          id: null,
          acReg: '',
          acTypeId: null,
          acGroup: '',
          prodModelAcId: null,
          acSn: '',
          prodModelEng1Id: null,
          prodModelEng2Id: null,
          prodModelEng3Id: null,
          prodModelEng4Id: null,
          engine1Sn: '',
          engine2Sn: '',
          engine3Sn: '',
          engine4Sn: '',
          prodModelApuId: null,
          apuSn: '',
          cnstIdPropertyId: null,
          consEngineOil: '',
          consHydFluid: '',
          consApuOil: '',
          flag: 0,
          createById: '',
          createTime: '',
          updateById: '',
          updateTime: ''
        },
        formRules: {
          acTypeId: [
            {required: true, message: '请选择飞机商业机型', trigger: 'blur'}
          ],
          acReg: [
            {required: true, message: '飞机注册号不能为空.', trigger: 'blur'}
          ],
          cnstIdPropertyId: [
            {required: true, message: '请选择飞机所属', trigger: 'blur'}
          ],
          prodModelAcId: [
            {required: true, message: '请选择机身型号', trigger: 'blur'}
          ],
          acSn: [
            {required: true, message: '机身序号不能为空.', trigger: 'blur'}
          ]
        },
        loading: false,
        ACINFO_ACTypeSubList: [],
        ACINFO_ProductFuselageSubList: [],
        ACINFO_ProductEngineSubList: [],
        ACINFO_ProductAPUSubList: [],
        ACINFO_ConstantACISubList: []
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
          url: 'http://106.12.133.158:88/api/static/acinfo/query',
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
            if (result.status === 0 && result.data.length > 0) {
              let results = result.data.filter(item => item.id === id);
              if (results !== null && results !== undefined && results.length > 0) {
                let row = results[0];
                self.form = Object.assign({}, row);
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
      reset() {
        this.$refs['filters'].resetFields();
      },
      initConstantVal: function () {
        var self = this;
        $.ajax({
          url: 'http://106.12.133.158:88/api/static/actype/query',
          type: 'POST',
          data: "{ 'obj': { 'acType': null } }",
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              self.ACINFO_ACTypeSubList = result.data;
            } else {
              console.log(result.ACINFO_ACTypeSubList);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
        $.ajax({
          url: 'http://106.12.133.158:88/api/static/prodmodel/query',
          type: 'POST',
          data: "{ 'obj': { 'cnstIdProdTypeId': \"'productmodel_type_fl','productmodel_type_eng','productmodel_type_apu'\" } }",
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              self.ACINFO_ProductFuselageSubList = result.data.filter(item => item.cnstIdProdTypeId === 'productmodel_type_fl');
              self.ACINFO_ProductEngineSubList = result.data.filter(item => item.cnstIdProdTypeId === 'productmodel_type_eng');
              self.ACINFO_ProductAPUSubList = result.data.filter(item => item.cnstIdProdTypeId === 'productmodel_type_apu');
            } else {
              console.log(result.status);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
        $.ajax({
          url: 'http://106.12.133.158:88/api/static/cnstval/query',
          type: 'POST',
          data: "{ 'obj': { 'cnstId': 'acinfor_property' } }",
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              self.ACINFO_ConstantACISubList = result.data;
            } else {
              console.log('ACI字典下拉框初始化失败.');
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
      },
      // 编辑
      dataSubmit: function () {
        var sef = this;
        sef.$refs.form.validate((valid) => {
          if (valid) {
            sef.$confirm('确认提交吗？', '提示', {}).then(() => {
              sef.loading = true;
              // NProgress.start();

              let para = Object.assign({}, this.form);
              let postUrl = 'http://106.12.133.158:88/api/static/acinfo/';

              let action = this.$route.params.action;
              if (action === 'add' || action === null || action === '' || action === undefined) {
                postUrl += 'add';
              } else {
                postUrl += para.action;
              }
              debugger;
              $.ajax({
                url: postUrl,
                type: 'POST',
                data: '{' +
                  "    'id': '" + para.id + "'," +
                  "    'acTypeId': '" + para.acTypeId + "'," +
                  "    'acReg': '" + para.acReg + "'," +
                  "    'acGroup': '" + para.acGroup + "'," +
                  "    'prodModelAcId': '" + para.prodModelAcId + "'," +
                  "    'acSn': '" + para.acSn + "'," +
                  "    'prodModelEng1Id': '" + para.prodModelEng1Id + "'," +
                  "    'prodModelEng2Id': '" + para.prodModelEng2Id + "'," +
                  "    'prodModelEng3Id': '" + para.prodModelEng3Id + "'," +
                  "    'prodModelEng4Id': '" + para.prodModelEng4Id + "'," +
                  "    'engine1Sn': '" + para.engine1Sn + "'," +
                  "    'engine2Sn': '" + para.engine2Sn + "'," +
                  "    'engine3Sn': '" + para.engine3Sn + "'," +
                  "    'engine4Sn': '" + para.engine4Sn + "'," +
                  "    'prodModelApuId': '" + para.prodModelApuId + "'," +
                  "    'apuSn': '" + para.apuSn + "'," +
                  "    'cnstIdPropertyId': '" + para.cnstIdPropertyId + "'," +
                  "    'consEngineOil': '" + para.consEngineOil + "'," +
                  "    'consHydFluid': '" + para.consHydFluid + "'," +
                  "    'consApuOil': '" + para.consApuOil + "'," +
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
                    sef.loading = false;
                    // NProgress.done();
                    sef.$message({
                      message: '数据保存成功.',
                      type: 'success'
                    });
                    sef.$refs['form'].resetFields();
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
      }
    }
  };
</script>
