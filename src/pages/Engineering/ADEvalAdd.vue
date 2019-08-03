<template>
  <section>
    <el-form ref="form" :model="form" :rules="formRules" label-width="90px" style="width:100%;min-width:850px;">
      <fieldset style="background: #f5f7fa;">
      <legend>AD文件</legend>
      <div v-for="(row, index) in docList" :key="index" class="ad-doc-info">
        <div>
          <div style="float: left;width:300px">适航指令号：{{ row.authNameAbbr  + ' AD ' +  row.adCompNum + ' R' + row.adCompVer }}</div>
          <div style="float: left;width:300px"> 生效日期：{{ row.adDateEff }}</div>
        </div>
        <br/>
        描述:
        <template slot-scope="scope">
          <el-popover placement="top-start" title="适航文件标题" width="500" trigger="hover" >
            <div style="font-size: 9pt">{{row.adCompName}}</div>
            <span slot="reference">{{ row.adCompName.substr(0,120)+'...' }}</span>
          </el-popover>
        </template>
      </div>
    </fieldset>
      <fieldset>
        <legend>{{form.acType}}飞机适用性</legend>
        <el-row hidden>
          <el-col :span="5">
            <el-form-item label="编码" prop="id">
              <el-input v-model="form.id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="DOC ID" prop="adDocId">
              <el-input v-model="form.adDocId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: -10px">
          <el-col :span="6">
            <el-form-item label="AD评估单号" prop="adEvalNumb">
              <el-input v-model="form.adEvalNumb"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="评估版次" prop="adEvalRev">
              <el-input type="number" v-model.number="form.adEvalRev"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="cnstIdStatus">
              <el-radio-group v-model="form.cnstIdStatus" size="mini">
                <el-radio-button v-for="(item,index) in ADEval_IdStatusList" :label="item.cnstId" :key="item.cnstId">{{item.descTxt}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <el-tabs type="border-card" style="margin-top: 10px">
        <el-tab-pane>
          <span slot="label"><i class="fa fa-plane" style="font-size: 1.3em;margin-top: 15px;"></i> 适用性评估列表</span>
          <el-row>
            <el-col :span="24" align="left">
              <el-form-item label="适用部位" prop="cnstIdComp">
                <el-radio-group v-model="form.cnstIdComp" size="small" :disabled="tableData.length > 0">
                  <el-radio-button v-for="(item,index) in ADEval_CnstValCompIdSubList" :label="item.cnstId" :key="item.cnstId">{{item.descTxt}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <div>
            <div style="float: left; width: 80%">
              <el-table v-loading="loading" element-loading-text="加载数据中" :data='tableData' border>
                <el-table-column label="飞机注册号" prop="acReg"  min-width="15%"></el-table-column>
                <el-table-column label="飞机序号" prop="acSn" min-width="15%"></el-table-column>
                <el-table-column label="适用部件" align="left" min-width="35%" :formatter="formatter"></el-table-column>
                <el-table-column label="状态" prop="cnstIdStatusTxt" min-width="15%"></el-table-column>
                <el-table-column label="操作" min-width="20%" align="center">
                  <template scope="scope">
                    <i class="el-icon-edit" @click="handleEdit(scope.$index, scope.row, 'updateRef')"><span>编辑</span></i>
                    <i style="width:20px;">&nbsp;</i>
                    <i class="el-icon-delete" @click="deleteApply(scope.$index, scope.row.id)"><span>删除</span></i>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="float: right; width: 15%">
              <el-button type="primary" plain @click="handleEdit(null, null, 'addRef')">新增</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="评估结论" style="height: 120px">
          <span slot="label"><i class="fa fa-audio-description fa-lg" style="font-size: 1.5em;"></i> 评估结论</span>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="adEvalConclusion" label-width="0px">
                <el-input type="textarea" placeholder="评估结论" v-model="form.adEvalConclusion" maxlength="128" rows="5" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="本次改版概况" style="height: 120px">
          <span slot="label"><i class="fa fa-calendar" style="font-size: 1.3em;"></i> 本次改版概况</span>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="sumRev" label-width="0px">
                <el-input type="textarea" placeholder="本次改版概况" v-model="form.sumRev" maxlength="1024" rows="5" show-word-limit>
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="工程文件生成" style="height: 120px">
          <span slot="label"><i class="fa fa-wrench" style="font-size: 1.3em;"></i> 工程文件生成</span>
          <el-row style="margin-bottom: 20px;">
            <el-col :span="12">
              工程指令列表
            </el-col>
            <el-col :span="12">
              <el-form-item prop="followingEo" label-width="10px">
                <el-input type="textarea" placeholder="工程指令" v-model="form.followingEo" maxlength="128" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              维护提示信息列表
            </el-col>
            <el-col :span="12">
              <el-form-item prop="followingMt" label-width="10px">
                <el-input type="textarea" placeholder="维护提示" v-model="form.followingMt" maxlength="128" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="限制器材">
          <span slot="label"><i class="fa fa-cubes" style="font-size: 1.3em;"></i> 限制器材</span>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="followingLmtPart" label-width="10px">
                <el-input type="textarea" placeholder="限制器材" v-model="form.followingLmtPart" maxlength="128" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
  </el-form>
    <div slot="footer" class="dialog-footer" style="margin: 20px 0px 50px 100px;">
      <el-button type="primary" @click.native="evalSubmit" :loading="loading">保存</el-button>
      <el-button @click.native="$router.back(-1)"  class="el-icon-back">返回</el-button>
    </div>

    <el-dialog :title="!dataForm.id ? '新增' : '修改'" :visible.sync="dialogVisible" width="750px" :close-on-click-modal="false" :append-to-body="true" @close="formReset();">
      <el-form :model="dataForm" :rules="dataFormRules" ref="dataForm" :style='dialogHeight' label-width="0" style="margin-left: 30px">
        <el-row>
          <el-col :span="10">
            <el-form-item prop="acId">
              <el-select v-model="dataForm.acId" @change="changeAcInfo($event)" placeholder="飞机信息">
                <el-option v-for="item in ADEval_ACInfofilter" :key="item.id" :label="item.acReg" :value="item.id">
                  <span style="float: left">{{ item.acReg }}</span>
                  <span style="float: left;margin-left: 10px">{{ item.acSn }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item prop="cnstIdIsApply">
              <el-radio-group v-model="dataForm.cnstIdIsApply"size="small">
                <el-radio-button label="1">适用</el-radio-button>
                <el-radio-button label="0">不适用</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item prop="cnstIdStatus">
              <el-radio-group v-model="dataForm.cnstIdStatus" size="small">
                <el-radio-button v-for="item in ADEval_IdStatusList" :label="item.cnstId" :key="item.cnstId">{{item.descTxt}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="width: 100%">
              <div v-if="form.cnstIdComp === 'adeval_comp_fl'">
                <el-row>
                  <el-col :span="12">
                    <el-form-item  prop="adApplyAcModel">
                      <el-input v-model="dataForm.adApplyAcModel" placeholder="机身型号"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="adApplyAcSn">
                      <el-input v-model="dataForm.adApplyAcSn" placeholder="机身序号"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div v-else-if="form.cnstIdComp === 'adeval_comp_eng'">
                <el-row>
                  <el-col :span="4">
                    <el-form-item prop="eng1Checked">
                      <el-checkbox v-model="dataForm.eng1Checked" :disabled="dataForm.eng1Disabled">发动机型号(1)</el-checkbox>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item prop="adApplyEng1Model" style="width: 85%!important;">
                      <el-input v-model="dataForm.adApplyEng1Model" :disabled="dataForm.eng1Disabled"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item prop="adApplyEng1Sn">
                      <el-input v-model="dataForm.adApplyEng1Sn" :disabled="dataForm.eng1Disabled"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">
                    <el-form-item prop="eng2Checked">
                      <el-checkbox v-model="dataForm.eng2Checked" :disabled="dataForm.eng2Disabled">发动机型号(2)</el-checkbox>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item prop="adApplyEng2Model" style="width: 85%!important;">
                      <el-input v-model="dataForm.adApplyEng2Model" :disabled="dataForm.eng2Disabled"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item prop="adApplyEng2Sn">
                      <el-input v-model="dataForm.adApplyEng2Sn" :disabled="dataForm.eng2Disabled"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">
                    <el-form-item prop="eng3Checked">
                      <el-checkbox v-model="dataForm.eng3Checked" :disabled="dataForm.eng3Disabled">发动机型号(3)</el-checkbox>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item prop="adApplyEng3Model" style="width: 85%!important;">
                      <el-input v-model="dataForm.adApplyEng3Model" :disabled="dataForm.eng3Disabled"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item prop="adApplyEng3Sn">
                      <el-input v-model="dataForm.adApplyEng3Sn" :disabled="dataForm.eng3Disabled"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">
                    <el-form-item prop="eng4Checked">
                      <el-checkbox v-model="dataForm.eng4Checked" :disabled="dataForm.eng4Disabled">发动机型号(4)</el-checkbox>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item prop="adApplyEng4Model" style="width: 85%!important;">
                      <el-input v-model="dataForm.adApplyEng4Model" :disabled="dataForm.eng4Disabled"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item prop="adApplyEng4Sn">
                      <el-input v-model="dataForm.adApplyEng4Sn" :disabled="dataForm.eng4Disabled"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div v-else-if="form.cnstIdComp === 'adeval_comp_apu'">
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="adApplyApuModel">
                      <el-input v-model="dataForm.adApplyApuModel" placeholder="APU型号"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="adApplyApuSn">
                      <el-input v-model="dataForm.adApplyApuSn" placeholder="APU序号"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div v-else-if="form.cnstIdComp === 'adeval_comp_compo'">
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="adApplyComponentPn">
                      <el-input v-model="dataForm.adApplyComponentPn" placeholder="PN"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="adApplyComponentSn">
                      <el-input v-model="dataForm.adApplyComponentSn" placeholder="SN"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div style="width: 100%;display:1">
              <el-row style="margin-bottom: 20px">
                <el-col :span="12">
                  <el-form-item prop="dueSetup">
                    <el-input type="textarea" placeholder="到期设置" v-model="dataForm.dueSetup" maxlength="128" rows="2" show-word-limit></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="dueRemark" label-width="0">
                    <el-input type="textarea" placeholder="完成备注" v-model="dataForm.dueRemark" maxlength="128" rows="2" show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item prop="evalConclusion" style="width: 95% !important">
                    <el-input type="textarea" placeholder="评估结论" v-model="dataForm.evalConclusion" maxlength="128" rows="2" show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogVisible = false;formReset();">取消</el-button>
        <el-button type="primary" @click.native="applySubmit" :loading="dataLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<style scope>
  @import '../../resources/form-controls.css';

  .buttonMiniSize {
    height: 25px;
    padding: 0 15px;
  }
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
  .item_content {
    margin-top: -20px;
  }
  .ad-doc-info {
    margin-top:-10px;
    font-size: 14px;
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
    font: 15px/2 Verdana, Geneva, sans-serif;
    text-align: left;
    font-weight:bold;
    /* text-shadow: 2px 2px 2px rgb(88, 126, 156);*/
  }
</style>
<script>
  import $ from 'jquery';
  export default {
    created() {
      this.initConstantVal();
      this.queryEval();
      this.queryApply();
    },
    data() {
      return {
        actionDo: this.getAction(),
        sel: null, // 临时存放当前新增的对象
        docList: [], // new util.HashTable(),
        tableData: [],
        form: {
          acMake: '',
          acMakeEn: '',
          acType: '',
          acTypeEn: '',
          acTypeId: 0,
          adCompName: '',
          adCompNum: '',
          adCompNumName: '',
          adCompVer: 0,
          adDateEff: '',
          adDateEffEnd: '',
          adDocId: 0,
          adEvalConclusion: '',
          adEvalNumb: '',
          adEvalRev: 0,
          authNameAbbr: '',
          authNation: '',
          authNationEn: '',
          cnstIdComp: '',
          cnstIdCompTxt: '',
          cnstIdCompTxtEn: '',
          cnstIdStatus: 'adapply_status_open',
          cnstIdStatusTxt: '',
          cnstIdStatusTxtEn: '',
          createById: 0,
          createTime: '',
          flag: 0,
          followingEo: '',
          followingLmtPart: '',
          followingMt: '',
          id: 0,
          issueAuthId: 0,
          sumRev: '',
          updateById: 0,
          updateTime: ''
        },
        formRules: {
          issueAuthId: [
            {required: true, message: '请选择适航局', trigger: 'blur'}
          ],
          adCompNum: [
            {required: true, message: '请输入适航指令号', trigger: 'blur'},
            {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
          ],
          adCompVer: [
            {required: true, message: '请输入版本', trigger: 'blur'},
            {type: 'number', message: '版本必须是数字', trigger: 'blur'}
          ],
          adCompName: [
            {required: true, message: '请输入描述', trigger: 'blur'},
            {min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur'}
          ]
        },
        loading: false,
        dialogHeight: 'height: 100px',
        ADEval_CnstValCompIdSubList: [],
        ADEval_ACInfoSubList: [],
        ADEval_ACInfofilter: [],
        ADEval_IsApplyList: [],
        ADEval_IdStatusList: [],
        dialogVisible: false, // 新增界面是否显示
        dataLoading: false,
        dataFormRules: {
          cnstId: [
            { required: true, message: '请输入分类', trigger: 'blur' }
          ],
          descTxt: [
            { required: true, message: '名称或描述', trigger: 'blur' },
            { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
          ]
        },
        // 新增界面数据
        dataForm: {
          id: 0,
          acId: '',
          acReg: '',
          adApplyAcModel: '',
          adApplyAcSn: '',
          adApplyApuModel: '',
          adApplyApuSn: '',
          adApplyComponentPn: '',
          adApplyComponentSn: '',
          adApplyEng1Model: '',
          adApplyEng1Sn: '',
          adApplyEng2Model: '',
          adApplyEng2Sn: '',
          adApplyEng3Model: '',
          adApplyEng3Sn: '',
          adApplyEng4Model: '',
          adApplyEng4Sn: '',
          cnstIdIsApply: '1',
          cnstIdIsApplyTxt: '',
          cnstIdIsApplyTxtEn: '',
          cnstIdStatus: 'adapply_status_open',
          cnstIdStatusTxt: '',
          cnstIdStatusTxtEn: '',
          dueRemark: '',
          dueSetup: '',
          evalConclusion: '',
          flag: 0,
          updateById: 0,
          updateTime: null,
          adEvalComp: '',
          eng1Checked: false,
          eng2Checked: false,
          eng3Checked: false,
          eng4Checked: false,

          eng1Disabled: true,
          eng2Disabled: true,
          eng3Disabled: true,
          eng4Disabled: true
        }
      }
    },
    methods: {
      formReset: function() {
        this.$refs['dataForm'].resetFields();
      },
      formatter(row, column) {
        var contents = '';
        switch (this.form.cnstIdComp) {
          case 'adeval_comp_fl' :
            contents = row.adApplyAcModel;
            break;
          case 'adeval_comp_eng' :
            if (this.utils.isNotEmpty(row.adApplyEng1Model)) contents += row.adApplyEng1Model + ' ' + row.adApplyEng1Sn + ';';
            if (this.utils.isNotEmpty(row.adApplyEng2Model)) contents += row.adApplyEng2Model + ' ' + row.adApplyEng2Sn + ';';
            if (this.utils.isNotEmpty(row.adApplyEng3Model)) contents += row.adApplyEng3Model + ' ' + row.adApplyEng3Sn + ';';
            if (this.utils.isNotEmpty(row.adApplyEng4Model)) contents += row.adApplyEng4Model + ' ' + row.adApplyEng4Sn + ';';
            if (contents !== '') contents = contents.substring(0, contents.length - 1);
            break;
          case 'adeval_comp_apu' :
            contents = row.adApplyApuModel;
            break;
          case 'adeval_comp_compo' :
            contents = 'PN:' + row.adApplyComponentPn;
            if (this.utils.isNotEmpty(row.adApplyComponentSn)) {
              contents += '  SN:' + row.adApplyComponentSn;
            }
            break;
        }
        return contents;
      },
      // 机型选择时设置对应的机型名称和制造商
      changeAcInfo: function (id) {
        let acinfo = this.ADEval_ACInfofilter.filter(item => item.id === id);
        if (acinfo === null || acinfo.length === 0) return;
        this.dataForm.acReg = acinfo[0].acReg;
        switch (this.form.cnstIdComp) {
          case 'adeval_comp_fl' :
            this.dataForm.adApplyAcModel = acinfo[0].prodModelAc;
            this.dataForm.adApplyAcSn = acinfo[0].apuSn;
            break;
          case 'adeval_comp_eng' :
            this.dataForm.adApplyEng1Model = acinfo[0].prodModelEng1;
            this.dataForm.adApplyEng2Model = acinfo[0].prodModelEng2;
            this.dataForm.adApplyEng3Model = acinfo[0].prodModelEng3;
            this.dataForm.adApplyEng4Model = acinfo[0].prodModelEng4;

            this.dataForm.adApplyEng1Sn = acinfo[0].engine1Sn;
            this.dataForm.adApplyEng2Sn = acinfo[0].engine2Sn;
            this.dataForm.adApplyEng3Sn = acinfo[0].engine3Sn;
            this.dataForm.adApplyEng4Sn = acinfo[0].engine4Sn;

            if (this.utils.isNotEmpty(this.dataForm.adApplyEng1Model)) {
              this.dataForm.eng1Disabled = false;
            }
            if (this.utils.isNotEmpty(this.dataForm.adApplyEng2Model)) {
              this.dataForm.eng2Disabled = false;
            }
            if (this.utils.isNotEmpty(this.dataForm.adApplyEng3Model)) {
              this.dataForm.eng3Disabled = false;
            }
            if (this.utils.isNotEmpty(this.dataForm.adApplyEng4Model)) {
              this.dataForm.eng4Disabled = false;
            }
            break;
          case 'adeval_comp_apu' :
            this.dataForm.adApplyApuModel = acinfo[0].prodModelApu;
            this.dataForm.adApplyApuSn = acinfo[0].apuSn;
            break;
          case 'adeval_comp_compo' :
            break;
        }
      },
      acInfofilter(inputWhere) {
        this.form.acId = inputWhere;
        if (inputWhere) {
          // inputWhere存在
          this.ADEval_ACInfofilter = this.ADEval_ACInfoSubList.filter((item) => {
            if (!!~item.acReg.indexOf(inputWhere) || !!~item.acReg.toUpperCase().indexOf(inputWhere.toUpperCase())) {
              return true
            } else if (!!~item.acSn.indexOf(inputWhere) || !!~item.acSn.toUpperCase().indexOf(inputWhere.toUpperCase())) {
              return true
            }
          });
        } else {
          // inputWhere为空时，还原数组
          this.ADEval_ACInfofilter = this.ACINFO_ACTypeSubList;
        }
      },
      // 初始化选择框数据
      initConstantVal: function () {
        let self = this;
        let acTypeId = this.$route.params.acTypeId;
        if (self.utils.isEmpty(acTypeId)) {
          return;
        }
        // 飞机信息
        $.ajax({
          url: 'http://106.12.133.158:1881/api/static/acinfo/query',
          type: 'POST',
          data: '{' +
            "  'obj': {" +
            "    'acTypeId': '" + acTypeId + "'," +
            '  }' +
            '}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              self.ADEval_ACInfoSubList = result.data;
              self.ADEval_ACInfofilter = result.data;
            } else {
              console.log(result.data);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
        $.ajax({
          url: 'http://106.12.133.158:1881/api/static/cnstval/querySub',
          type: 'POST',
          data: '{' +
            "  'obj': {" +
            "    'cnstId': \"'adeval_comp','adapply_status'\"" +
            '  }' +
            '}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              self.ADEval_CnstValCompIdSubList = result.data.filter(item => item.cnstParentId === 'adeval_comp');
              self.ADEval_IdStatusList = result.data.filter(item => item.cnstParentId === 'adapply_status');
            } else {
              console.log(result.data);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
      },
      getAdEvalId() {
        let adEvalId = this.$route.params.id;
        if (this.utils.isEmpty(adEvalId)) {
          return -1;
        }
        return adEvalId;
      },
      getAction() {
        let action = this.$route.params.action;
        if (action === null || action === '' || action === undefined) {
          return '';
        }
        return action;
      },
      queryEval() {
        let adEvalId = this.getAdEvalId();
        if (adEvalId === -1) return;
        let self = this;
        $.ajax({
          url: 'http://106.12.133.158:1881/api/pm/adcompeval/query',
          type: 'POST',
          data: '{' +
            "  'obj': {" +
            "    'id': " + adEvalId + ',' +
            "    'flag': 0" +
            '  }' +
            '}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0 && result.data.length > 0) {
              let row = result.data[0];
              self.docList = [row];
              if (self.utils.isEmpty(row.cnstIdStatus)) {
                self.$set(self.form, 'cnstIdStatus', 'adapply_status_open');
              }
              self.form = Object.assign({}, row);
            } else {
              console.log(result.status);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
      },
      queryApply() {
        let self = this;
        let adEvalId = this.getAdEvalId();
        if (adEvalId === -1) return;
        $.ajax({
          url: 'http://106.12.133.158:1881/api/pm/adcompapply/query',
          type: 'POST',
          data: '{' +
            "  'obj': {" +
            "    'adEvalId': '" + adEvalId + "'" +
            '  }' +
            '}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              self.tableData = result.data;
            } else {
              console.log(result.status);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
      },
      // 编辑
      evalSubmit: function () {
        var self = this;
        let adEvalId = this.getAdEvalId();
        if (adEvalId === -1) return;
        self.$refs.form.validate((valid) => {
          if (valid) {
            self.$confirm('确认提交吗？', '提示', {}).then(() => {
              self.loading = true;
              // NProgress.start();
              let para = Object.assign({}, self.form);
              $.ajax({
                url: 'http://106.12.133.158:1881/api/pm/adcompeval/update',
                type: 'POST',
                data: '{' +
                  "    'id': '" + para.id + "'," +
                  "    'adEvalNumb': '" + para.adEvalNumb + "'," +
                  "    'cnstIdStatus': '" + para.cnstIdStatus + "'," +
                  "    'adEvalRev': '" + para.adEvalRev + "'," +
                  "    'cnstIdComp': '" + para.cnstIdComp + "'," +
                  "    'adEvalConclusion': '" + para.adEvalConclusion + "'," +
                  "    'followingEo': '" + para.followingEo + "'," +
                  "    'followingLmtPart': '" + para.followingLmtPart + "'," +
                  "    'followingMt': '" + para.followingMt + "'," +
                  "    'sumRev': '" + para.sumRev + "'" +
                  '}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (result) {
                  if (result.status === 0) {
                    self.loading = false;
                    // NProgress.done();
                    self.$message({message: '数据保存成功.', type: 'success'});
                    self.queryEval();
                  } else {
                    console.log(result.status);
                  }
                },
                error: function (e) {
                  self.loading = false;
                  console.log(e);
                }
              });
            });
          }
        });
      },
      // 显示编辑界面
      handleEdit: function (index, row, action) {
        this.dialogVisible = true;

        switch (this.form.cnstIdComp) {
          case 'adeval_comp_fl' :
            this.dialogHeight = 'height: 200px';
            break;
          case 'adeval_comp_eng' :
            this.dialogHeight = 'height: 350px';
            break;
          case 'adeval_comp_apu' :
            this.dialogHeight = 'height: 200px';
            break;
          case 'adeval_comp_compo' :
            this.dialogHeight = 'height: 200px';
            break;
        }
        if (action === 'addRef') {
          /* this.dataForm = {
            id: 0,
            acId: '',
            acReg: '',
            adApplyAcModel: '',
            adApplyAcSn: '',
            adApplyApuModel: '',
            adApplyApuSn: '',
            adApplyComponentPn: '',
            adApplyComponentSn: '',
            adApplyEng1Model: '',
            adApplyEng1Sn: '',
            adApplyEng2Model: '',
            adApplyEng2Sn: '',
            adApplyEng3Model: '',
            adApplyEng3Sn: '',
            adApplyEng4Model: '',
            adApplyEng4Sn: '',
            cnstIdIsApply: '',
            cnstIdIsApplyTxt: '',
            cnstIdIsApplyTxtEn: '',
            cnstIdStatus: '',
            cnstIdStatusTxt: '',
            cnstIdStatusTxtEn: '',
            dueRemark: '',
            dueSetup: '',
            evalConclusion: '',
            flag: 0,
            updateById: 0,
            updateTime: null,
            eng1Checked: false,
            eng2Checked: false,
            eng3Checked: false,
            eng4Checked: false,

            eng1Disabled: false,
            eng2Disabled: false,
            eng3Disabled: false,
            eng4Disabled: false,
            action: ''
          }; */
        } else if (action === 'updateRef') {
          this.dataForm = Object.assign({}, row);
          this.row(row.acId);
        }
        this.dataForm.action = action;
      },
      // 编辑
      applySubmit: function () {
        let self = this;
        let adEvalId = this.getAdEvalId();
        if (adEvalId === -1) return;
        self.$refs.dataForm.validate((valid) => {
          if (valid) {
            self.$confirm('确认提交吗？', '提示', {}).then(() => {
              self.loading = true;
              // NProgress.start();
              let evalPara = Object.assign({}, self.form);
              let evalData =
                  "'objEval': {" +
                  "    'id': '" + evalPara.id + "'," +
                  "    'adEvalNumb': '" + evalPara.adEvalNumb + "'," +
                  "    'cnstIdStatus': '" + evalPara.cnstIdStatus + "'," +
                  "    'adEvalRev': '" + evalPara.adEvalRev + "'," +
                  "    'cnstIdComp': '" + evalPara.cnstIdComp + "'," +
                  "    'adEvalConclusion': '" + evalPara.adEvalConclusion + "'," +
                  "    'followingEo': '" + evalPara.followingEo + "'," +
                  "    'followingLmtPart': '" + evalPara.followingLmtPart + "'," +
                  "    'followingMt': '" + evalPara.followingMt + "'," +
                  "    'sumRev': '" + evalPara.sumRev + "'" +
                  '}';

              let para = Object.assign({}, self.dataForm);
              let postUrl = 'http://106.12.133.158:1881/api/pm/adcompapply/';
              if (para.action !== '') {
                postUrl += para.action;
              }
              let jsonCommon =
                "'id': '" + para.id + "'," +
                "'adEvalId': '" + adEvalId + "'," +
                "'acId': '" + para.acId + "'," +
                "'dueSetup': '" + para.dueSetup + "'," +
                "'dueRemark': '" + para.dueRemark + "'," +
                "'evalConclusion': '" + para.evalConclusion + "'," +
                "'cnstIdIsApply': '" + para.cnstIdIsApply + "'," +
                "'cnstIdStatus': '" + para.cnstIdStatus + "',";
              var json = '';
              switch (self.form.cnstIdComp) {
                case 'adeval_comp_fl' :
                  json =
                    "'adApplyAcModel': '" + para.adApplyAcModel + "'," +
                    "'adApplyAcSn': '" + para.adApplyAcSn + "'," +
                    "'adApplyEng1Model': '" + para.adApplyEng1Model + "'," +
                    "'adApplyEng2Model': '" + para.adApplyEng2Model + "'," +
                    "'adApplyEng3Model': '" + para.adApplyEng3Model + "'," +
                    "'adApplyEng4Model': '" + para.adApplyEng4Model + "'," +
                    "'adApplyEng1Sn': '" + para.adApplyEng1Sn + "'," +
                    "'adApplyEng2Sn': '" + para.adApplyEng2Sn + "'," +
                    "'adApplyEng3Sn': '" + para.adApplyEng3Sn + "'," +
                    "'adApplyEng4Sn': '" + para.adApplyEng4Sn + "'," +
                    "'adApplyApuModel': '" + para.adApplyApuModel + "'," +
                    "'adApplyApuSn': '" + para.adApplyApuSn + "'," +
                    "'adApplyComponentPn': null," +
                    "'adApplyComponentSn': null";
                  break;
                case 'adeval_comp_eng' :
                  if (para.eng1Checked) {
                    json += "'adApplyEng1Model': '" + para.adApplyEng1Model + "'," +
                      "'adApplyEng1Sn': '" + para.adApplyEng1Sn + "',";
                  }
                  if (para.eng2Checked) {
                    json += "'adApplyEng2Model': '" + para.adApplyEng2Model + "'," +
                      "'adApplyEng2Sn': '" + para.adApplyEng2Sn + "',";
                  }
                  if (para.eng3Checked) {
                    json += "'adApplyEng3Model': '" + para.adApplyEng3Model + "'," +
                      "'adApplyEng3Sn': '" + para.adApplyEng3Sn + "',";
                  }
                  if (para.eng4Checked) {
                    json += "'adApplyEng4Model': '" + para.adApplyEng4Model + "'," +
                      "'adApplyEng4Sn': '" + para.adApplyEng4Sn + "',";
                  }
                  if (json === '') {
                    self.$message({
                      message: '未选择发动机',
                      type: 'warning'
                    });
                    return;
                  }
                  json +=
                    "'adApplyAcModel': null," +
                    "'adApplyAcSn': null," +
                    "'adApplyApuModel': null," +
                    "'adApplyApuSn': null," +
                    "'adApplyComponentPn': null," +
                    "'adApplyComponentSn': null";
                  break;
                case 'adeval_comp_apu' :
                  json =
                    "'adApplyAcModel': null," +
                    "'adApplyAcSn': null," +
                    "'adApplyEng1Model': null," +
                    "'adApplyEng2Model': null," +
                    "'adApplyEng3Model': null," +
                    "'adApplyEng4Model': null," +
                    "'adApplyEng1Sn': null," +
                    "'adApplyEng2Sn': null," +
                    "'adApplyEng3Sn': null," +
                    "'adApplyEng4Sn': null," +
                    "'adApplyApuModel': '" + para.adApplyApuModel + "'," +
                    "'adApplyApuSn': '" + para.adApplyApuSn + "'," +
                    "'adApplyComponentPn': null," +
                    "'adApplyComponentSn': null";
                  break;
                case 'adeval_comp_compo' :
                  json =
                    "'adApplyAcModel': null," +
                    "'adApplyAcSn': null," +
                    "'adApplyEng1Model': null," +
                    "'adApplyEng2Model': null," +
                    "'adApplyEng3Model': null," +
                    "'adApplyEng4Model': null," +
                    "'adApplyEng1Sn': null," +
                    "'adApplyEng2Sn': null," +
                    "'adApplyEng3Sn': null," +
                    "'adApplyEng4Sn': null," +
                    "'adApplyApuModel': null," +
                    "'adApplyApuSn': null," +
                    "'adApplyComponentPn': '" + para.adApplyComponentPn + "'," +
                    "'adApplyComponentSn': '" + para.adApplyComponentSn + "'";
                  break;
              }
              $.ajax({
                url: postUrl,
                type: 'POST',
                data: "{ 'obj':{" + jsonCommon + json + '},' + evalData + '}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (result) {
                  if (result.status === 0) {
                    self.loading = false;
                    // NProgress.done();
                    self.$message({message: '数据保存成功.', type: 'success'});
                    self.$refs['dataForm'].resetFields();
                    self.dialogVisible = false;
                    self.queryApply();
                  } else {
                    console.log(result.status);
                  }
                },
                error: function (e) {
                  self.loading = false;
                  console.log(e);
                }
              });
            });
          }
        });
      },
      // 删除
      deleteApply: function (index, id) {
        let self = this;
        self.$confirm('确认删除飞机适用性评估吗？', '提示', {}).then(() => {
          self.loading = true;
          // NProgress.start();
          $.ajax({
            url: 'http://106.12.133.158:1881/api/pm/adcompapply/delete',
            type: 'POST',
            data: '[' + id + ']',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
              if (result.status === 0) {
                self.loading = false;
                // NProgress.done();
                self.$message({message: '数据保存成功.', type: 'success'});
                self.queryApply();
              } else {
                console.log(result.status);
              }
            },
            error: function (e) {
              self.loading = false;
              console.log(e);
            }
          });
        });
      }
    }
  };
</script>
