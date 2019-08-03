<template>
  <el-form ref="form" :model="form" :rules="formRules" label-width="80px" @submit.prevent="onSubmit" label-position="left"
           style="margin:0 0 100px;width:90%;">
    <!--<el-row hidden>
      <el-col :span="24">
        <el-form-item label="主键" prop="id" hidden>
          <el-input v-model="form.id"></el-input>
        </el-form-item>
      </el-col>
    </el-row>-->
    <el-row style="min-height: 480px">
      <el-col :span="14">
        <fieldset>
          <legend>新增/编辑 基本信息 Basic Information</legend>
          <el-row class="marginLeft">
            <el-col :span="8">
              <el-form-item prop="acReg">
                <el-input v-model="form.acReg" placeholder="注册号" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="authId">
                <el-select v-model="form.authId" clearable filterable :filter-method="authorityfilter" placeholder="适航局">
                  <el-option v-for="item in ACINFO_AuthoritySubfilter" :key="item.id" :label="item.authNameAbbr" :value="item.id">
                    <span style="float: left">{{ item.authNameAbbr }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.authNation }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="acGroup">
                <el-input v-model="form.acGroup" placeholder="公司分组"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="marginLeft">
            <el-col :span="14">
              <el-form-item prop="acTypeId" style="width: 100%">
                <el-select v-model="form.acTypeId" clearable filterable :filter-method="acTypefilter" placeholder="飞机商业型" style="width: 100%">
                  <el-option v-for="item in ACINFO_ACTypeSubfilter" :key="item.id" :label="item.acType" :value="item.id">
                    <span style="float: left">{{ item.acType }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.acMake }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item prop="cnstIdProperty" STYLE="width: 100%!important;">
                <el-select v-model="form.cnstIdProperty" clearable placeholder="产权">
                  <el-option v-for="item in ACINFO_ConstantACISubList" :key="item.cnstId" :label="item.descTxt" :value="item.cnstId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item label="机身型号" prop="prodModelAcId" label-width="100px">
                <el-select v-model="form.prodModelAcId" clearable filterable style="width:100%" >
                  <el-option v-for="item in ACINFO_ProductFuselageSubList" :key="item.id" :label="item.prodModel" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="marginLeft">
              <el-form-item prop="acSn">
                <el-input v-model="form.acSn" placeholder="机身序号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item label="发动机型号(1)" prop="prodModelEng1Id" label-width="100px">
                <el-select v-model="form.prodModelEng1Id" clearable filterable style="width:100%" >
                  <el-option v-for="item in ACINFO_ProductEngineSubList" :key="item.id" :label="item.prodModel" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="marginLeft">
              <el-form-item prop="engine1Sn">
                <el-input v-model="form.engine1Sn" placeholder="S/N"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item label="发动机型号(2)" prop="prodModelEng2Id" label-width="100px">
                <el-select v-model="form.prodModelEng2Id" clearable filterable style="width:100%" >
                  <el-option v-for="item in ACINFO_ProductEngineSubList" :key="item.id" :label="item.prodModel" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="marginLeft">
              <el-form-item prop="engine2Sn">
                <el-input v-model="form.engine2Sn" placeholder="S/N"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item label="发动机型号(3)" prop="prodModelEng3Id" label-width="100px">
                <el-select v-model="form.prodModelEng3Id" clearable filterable style="width:100%" >
                  <el-option v-for="item in ACINFO_ProductEngineSubList" :key="item.id" :label="item.prodModel" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="marginLeft">
              <el-form-item prop="engine3Sn">
                <el-input v-model="form.engine3Sn" placeholder="S/N"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item label="发动机型号(4)" prop="prodModelEng4Id" label-width="100px">
                <el-select v-model="form.prodModelEng4Id" clearable filterable style="width:100%" >
                  <el-option v-for="item in ACINFO_ProductEngineSubList" :key="item.id" :label="item.prodModel" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="marginLeft">
              <el-form-item prop="engine4Sn">
                <el-input v-model="form.engine4Sn" placeholder="S/N"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item label="APU型号" prop="prodModelApuId" label-width="100px">
                <el-select v-model="form.prodModelApuId" clearable filterable placeholder="APU" style="width:100%" >
                  <el-option v-for="item in ACINFO_ProductAPUSubList" :key="item.id" :label="item.prodModel" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="marginLeft">
              <el-form-item prop="apuSn">
                <el-input v-model="form.apuSn" placeholder="S/N"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
      </el-col>
      <el-col :span="10">
        <fieldset>
          <legend>查看消耗品</legend>
        <el-form-item label="Engine Oil" prop="consEngineOil" label-width="100px">
          <el-input v-model="form.consEngineOil"></el-input>
        </el-form-item>
        <el-form-item label="APU Oil" prop="consApuOil" label-width="100px">
          <el-input v-model="form.consApuOil"></el-input>
        </el-form-item>
        <el-form-item label="Hydro Fluid" prop="consHydFluid" label-width="100px">
          <el-input v-model="form.consHydFluid"></el-input>
        </el-form-item>
        <el-form-item label="Fluid Remark" prop="serviceFluidRemark" label-width="100px">
          <el-input v-model="form.serviceFluidRemark"></el-input>
        </el-form-item>
        </fieldset>
        <fieldset style="margin-top: 36px;">
          <legend>新增/编辑飞机使用率 Airplane Usage Rate</legend>
          <el-form-item label="月利用率 Month Rate" prop="monthRate" label-width="190px">
            <el-input v-model="form.monthRate"></el-input>
          </el-form-item>
          <el-form-item label="飞行小时数/循环 Hour/Cycle" prop="hourToCycle" label-width="190px">
            <el-input v-model="form.hourToCycle"></el-input>
          </el-form-item>
        </fieldset>
      </el-col>
    </el-row>
    <!--<el-row hidden="true">
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
    </el-row>-->
    <el-row>
      <el-col :offset="3" :span="21" class="toolbar">
        <el-button type="primary" @click.native="dataSubmit" :loading="loading"  class="el-icon-edit">保存</el-button>
        <el-button @click.native="$router.back(-1)"  class="el-icon-back">返回</el-button>
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
  .el-form-item__error {
    padding-top: 1px;
  }
  .el-col {
    height:50px!important;
    min-height: 50px!important;
  }
  .el-col .el-form-item {
    width: 90%!important;
  }
  .marginLeft .el-form-item__content {
    margin-left: 0!important
  }
  .sencond .el-select {
    width: 100%!important;
  }
  fieldset {
    /*background: rgba(255,255,255,.3);*/
    border: 1px solid #e6ebf5;
    border-style: solid;
    border-width: 1px;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    -khtml-border-radius: 5px;
    border-radius: 5px;
    line-height: 30px;
    list-style: none;
    padding: 20px 30px 10px;
    margin-bottom: 2px;
  }

  fieldset legend {
    color:#302A2A;
    font: 16px/2 Verdana, Geneva, sans-serif;
    text-align: left;
    /*text-shadow: 2px 2px 2px rgb(88, 126, 156);*/
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
          authId: null,
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
          cnstIdProperty: null,
          consEngineOil: '',
          consHydFluid: '',
          consApuOil: '',
          serviceFluidRemark: '',
          monthRate: null,
          hourToCycle: null,
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
        ACINFO_AuthoritySubfilter: [],
        ACINFO_AuthoritySubList: [],

        ACINFO_ACTypeSubfilter: [],
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
          url: 'http://106.12.133.158:1881/api/static/acinfo/query',
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
                if (row.prodModelEng1Id !== null && row.prodModelEng1Id !== '' && row.prodModelEng1Id !== 0) {
                  self.$set(self.form, 'prodModelEng1Id', row.prodModelEng1Id);
                }
                if (row.prodModelEng2Id !== null && row.prodModelEng2Id !== '' && row.prodModelEng2Id !== 0) {
                  self.$set(self.form, 'prodModelEng2Id', row.prodModelEng2Id);
                }
                if (row.prodModelEng3Id !== null && row.prodModelEng3Id !== '' && row.prodModelEng3Id !== 0) {
                  self.$set(self.form, 'prodModelEng3Id', row.prodModelEng3Id);
                }
                if (row.prodModelEng4Id !== null && row.prodModelEng4Id !== '' && row.prodModelEng4Id !== 0) {
                  self.$set(self.form, 'prodModelEng4Id', row.prodModelEng4Id);
                }

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
      authorityfilter(inputWhere) {
        this.form.authId = inputWhere;
        if (inputWhere) {
          // inputWhere存在
          this.ACINFO_AuthoritySubfilter = this.ACINFO_AuthoritySubList.filter((item) => {
            if (!!~item.authNameAbbr.indexOf(inputWhere) || !!~item.authNameAbbr.toUpperCase().indexOf(inputWhere.toUpperCase())) {
              return true
            }
          });
        } else {
          // inputWhere为空时，还原数组
          this.ACINFO_AuthoritySubfilter = this.ACINFO_AuthoritySubList;
        }
      },
      acTypefilter(inputWhere) {
        this.form.acTypeId = inputWhere;
        if (inputWhere) {
          // inputWhere存在
          this.ACINFO_ACTypeSubfilter = this.ACINFO_ACTypeSubList.filter((item) => {
            if (!!~item.acType.indexOf(inputWhere) || !!~item.acType.toUpperCase().indexOf(inputWhere.toUpperCase())) {
              return true
            }
          });
        } else {
          // inputWhere为空时，还原数组
          this.ACINFO_ACTypeSubfilter = this.ACINFO_ACTypeSubList;
        }
      },
      initConstantVal: function () {
        var self = this;
        $.ajax({
          url: 'http://106.12.133.158:1881/api/static/authority/query',
          type: 'POST',
          data: '{' +
            "  'obj': {" +
            "    'authNameAbbr': null" +
            '  }' +
            '}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              self.ACINFO_AuthoritySubList = result.data;
              self.ACINFO_AuthoritySubfilter = result.data;
            } else {
              console.log(result.data);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });

        $.ajax({
          url: 'http://106.12.133.158:1881/api/static/actype/query',
          type: 'POST',
          data: "{ 'obj': { 'acType': null } }",
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              self.ACINFO_ACTypeSubList = result.data;
              self.ACINFO_ACTypeSubfilter = result.data;
            } else {
              console.log(result.data);
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
              let postUrl = 'http://106.12.133.158:1881/api/static/acinfo/';

              let action = this.$route.params.action;
              if (action === 'add' || action === null || action === '' || action === undefined) {
                postUrl += 'add';
              } else {
                postUrl += action;
              }
              $.ajax({
                url: postUrl,
                type: 'POST',
                data: '{' +
                  "    'id': '" + para.id + "'," +
                  "    'acTypeId': '" + para.acTypeId + "'," +
                  "    'acReg': '" + para.acReg + "'," +
                  "    'acGroup': '" + para.acGroup + "'," +
                  "    'authId': '" + para.authId + "'," +
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
                  "    'cnstIdProperty': '" + para.cnstIdProperty + "'," +
                  "    'consEngineOil': '" + para.consEngineOil + "'," +
                  "    'consHydFluid': '" + para.consHydFluid + "'," +
                  "    'consApuOil': '" + para.consApuOil + "'," +
                  "    'serviceFluidRemark': '" + para.serviceFluidRemark + "'," +
                  "    'monthRate': '" + para.monthRate + "'," +
                  "    'hourToCycle': '" + para.hourToCycle + "'," +
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
                    // sef.$refs['form'].resetFields();
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
