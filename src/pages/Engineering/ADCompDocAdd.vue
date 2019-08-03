<template>
  <el-form ref="form" :model="form" :rules="formRules" label-width="120px" @submit.prevent="onSubmit"
           style="margin:0 0 100px;width:90%;min-width:850px;">
    <el-row hidden>
      <el-col :span="18">
        <el-form-item label="编码">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="适航局" prop="issueAuthId">
          <el-select v-model="form.issueAuthId"  placeholder="请选择适航局" style="width:100%">
            <el-option  v-for="item in ADAdd_AuthorityList" :key="item.id" :label="item.authNameAbbr" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="适航指令号" prop="adCompNum" label-width="100px">
          <el-input v-model="form.adCompNum"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="版本" prop="adCompVer" label-width="80px">
          <el-input type="number" v-model.number="form.adCompVer"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row style="margin: 10px 0px 28px">
      <el-col :span="20">
        <el-form-item label="描述" prop="adCompName">
          <el-input v-model="form.adCompName" type="textarea"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="生效日期" prop="adDateEff">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.adDateEff" format="yyyy-MM-dd" value-format="yyyy-MM-dd"  style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :style='fileUploadHeight' class="fileUploadRow">
      <el-col :span="18">
        <el-form-item label="生效日期" prop="fileName">
          <el-upload
            class="upload-demo"
            action="http://106.12.133.158:1881/api/common/upload"
            :on-success="uploadSuccess"
            :on-preview="updatePreview"
            :on-remove="uploadRemove"
            :before-upload="uploadBefore"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row hidden="true">
      <el-col :span="9">
        <el-form-item label="创建人" prop="createById">
          <span>{{form.createById}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="9">
        <el-form-item label="创建时间" prop="createTime">
          <span>{{form.createTime}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row hidden="true">
      <el-col :span="9">
        <el-form-item label="更新人" prop="updateById">
          <span>{{form.updateById}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="9">
        <el-form-item label="更新时间" prop="updateTime">
          <span>{{form.updateTime}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="评估机型列表">
      <div style="float: left; width: 75%">
        <el-table :data='tableData' v-loading="loading" element-loading-text="加载数据中" style="width: 100%;" stripe border fit highlight-current-row>
          <el-table-column label="机型" align='center' width="180px">
            <template slot-scope="scope">
              <el-select placeholder="请选择" v-if="scope.row.enabled" v-model="scope.row.acTypeId"  @change="changeAcType($event,scope.$index,scope.row)">
                <el-option  v-for="item in ADAdd_ACTypeList" :key="item.id" :label="item.acType" :value="item.id"></el-option>
              </el-select>
              <span v-else>{{scope.row.acType}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="acMake" label="制造商" align='left'></el-table-column>
          <el-table-column prop="userName" label="评估工程师" align='center' width="140px">
            <template slot-scope="scope">
              <el-select placeholder="请选择" v-if="scope.row.enabled" v-model="scope.row.userNo"  @change="changeUser($event,scope.$index,scope.row)">
                <el-option  v-for="item in ADAdd_UserList" :key="item.userNo" :label="item.userName" :value="item.userNo"></el-option>
              </el-select>
              <span v-else>{{scope.row.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align='right' width="160px">
            <template slot-scope="scope">
              <el-button-group class="button-group">
                <el-button v-if="!scope.row.enabled" type="primary" size="mini" class="buttonMiniSize" icon="el-icon-edit" @click='startEdit(scope.$index,scope.row)' title="编辑"></el-button>
                <el-button v-if="scope.row.enabled" type="success" size="mini" class="buttonMiniSize" icon="el-icon-check" @click='confirmEdit(scope.$index,scope.row)' title="保存"></el-button>
                <el-button v-if="scope.row.enabled" type="warning" size="mini" class="buttonMiniSize" icon="el-icon-refresh" @click='cancelEdit(scope.$index,scope.row)' title="取消"></el-button>
                <el-button @click.native.prevent="deleteItem(scope.$index, scope.row)" class="buttonMiniSize" type="danger" size="mini" icon="el-icon-delete"  title="删除"></el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="float: right; width: 20%">
        <el-button type="primary" plain @click="addTableRow">新增机型</el-button>
      </div>
    </el-form-item>
    <!--<el-row>
      <el-col :span="9">
        <el-form-item label="接受工程师" prop="ad_comp_name">
          <el-input placeholder="请选择工程师" v-model="input3" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="9">
        <el-form-item label="传达日期" prop="ad_date_eff">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.ad_date_eff"  style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>-->
    <el-col :span="24" class="toolbar" style="margin: 20px 0;">
      <el-form-item class="clearfix">
        <el-button type="primary" @click.native="dataSubmit" :loading="loading">保存</el-button>
        <el-button @click.native="$router.back(-1)"  class="el-icon-back">返回</el-button>
      </el-form-item>
    </el-col>
  </el-form>

</template>

<style scope>
  @import '../../resources/form-controls.css';

  .buttonMiniSize {
    height: 25px;
    padding: 0 15px;
  }
</style>
<style>
  .el-table .el-table__body .el-table__row td {
    height: 39px!important;
  }
  .el-table th {
    height: 30px!important;
  }
</style>
<script>
  import $ from 'jquery';
  export default {
    created() {
      this.initConstantVal();
      this.queryData();
      this.attachQuery();
      this.queryAdCompEval();
    },
    data() {
      return {
        fileUploadHeight: 'height: 100px',
        actionDo: this.getAction(),
        sel: null, // 临时存放当前新增的对象
        storeList: [], // new util.HashTable(),
        tableData: [],
        /* tableData: [{
          id: 2,
          acTypeId: 47,
          acType: 'BBJ',
          acMake: 'Boeing',
          userNo: '0003',
          userName: '沈万三'
        }, {
          id: 3,
          acTypeId: 44,
          acType: 'Challenger 605',
          acMake: 'Bombardier',
          userNo: '0003',
          userName: '沈万三'
        }, {
          id: 4,
          acTypeId: 40,
          acType: 'Falcon 900 B',
          acMake: 'Dassault',
          userNo: '0004',
          userName: '刘超阳'
        }], */
        form: {
          id: 0,
          issueAuthId: '',
          adCompNum: '',
          adCompName: '',
          adCompVer: '',
          adDateEff: null,
          flag: 0,
          createById: '',
          createTime: '',
          updateById: '',
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
        fileList: [],
        ADAdd_AuthorityList: [],
        ADAdd_ACTypeList: [],
        ADAdd_UserList: [{
          userNo: '0001',
          userName: '王磊'
        }, {
          userNo: '0002',
          userName: '杨斌'
        }, {
          userNo: '0003',
          userName: '沈万三'
        }, {
          userNo: '0004',
          userName: '刘超阳'
        }]
      }
    },
    methods: {
      uploadBefore(file) {
        let fileNum = this.fileList.length + 1;
        this.fileUploadHeight = 'height: ' + (50 + 30 * fileNum) + 'px';
      },
      uploadSuccess(response, file, fileList) {
        this.fileList.push({name: file.name, url: response.data.path});
      },
      uploadRemove(file, fileList) {
        let self = this;
        if (!self.utils.isEmpty(file.id)) {
         /* self.fileList.forEach(function (item, index) {
            if (item.url === file.url) {
              self.fileList.slice(index);
            }
          });
        } else { */
          let index = self.fileList.forEach(function (item, index) {
            if (item.id === file.id) {
              return index;
            }
          });
          if (index >= 0) {
            self.$confirm('确定删除' + file.name + '?', '提示', {}).then(() => {
              self.loading = true;
              $.ajax({
                url: 'http://106.12.133.158:1881/api/static/attafile/delete',
                type: 'POST',
                data: '[' + +file.id + ']',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (result) {
                  if (result.status === 0) {
                    self.loading = false;
                    self.$message({
                      message: file.name + '删除成功.',
                      type: 'success'
                    });
                    self.fileList.slice(index);
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
        }
      },
      updatePreview(file) {
        window.open('http://106.12.133.158:1881/file/' + file.url)
      },
      // 机型选择时设置对应的机型名称和制造商
      changeAcType: function (acTypeId, index, row) {
        let acTypeItem = this.ADAdd_ACTypeList.filter(item => item.id === acTypeId);
        if (acTypeItem === null || acTypeItem.length === 0) return;
        this.tableData[index].acType = acTypeItem[0].acType;
        this.tableData[index].acMake = acTypeItem[0].acMake;
      },
      // 选择评估工程师，设置对应的工程师名称
      changeUser: function (userNo, index, row) {
        let userList = this.ADAdd_UserList.filter(item => item.userNo === userNo);
        if (userList === null || userList.length === 0) return;
        this.tableData[index].userName = userList[0].userName;
      },
      // 初始化选择框数据
      initConstantVal: function () {
        var self = this;
        // 适航局选择框初始化数据
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
            console.log(result.status === 0);
            if (result.status === 0) {
              self.ADAdd_AuthorityList = result.data;
            } else {
              console.log(result.ADAdd_AuthorityList);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
        // 机型选择框初始化数据
        $.ajax({
          url: 'http://106.12.133.158:1881/api/static/actype/query',
          type: 'POST',
          data: "{ 'obj': { 'acType': null } }",
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              self.ADAdd_ACTypeList = result.data;
            } else {
              console.log(result.ADAdd_ACTypeList);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
        // 评估工程师选择框初始化数据
        /* $.ajax({
          url: 'http://106.12.133.158:1881/api/static/actype/query',
          type: 'POST',
          data: "{ 'obj': { 'acType': null } }",
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              self.ADAdd_UserList = result.data;
            } else {
              console.log(result.ADAdd_UserList);
            }
          },
          error: function (e) {
            console.log(e);
          }
        }); */
      },
      attachQuery: function() {
        let adDocId = this.getAdDocId();
        if (adDocId === -1) return;
        let self = this;
        $.ajax({
          url: 'http://106.12.133.158:1881/api/static/attafile/query',
          type: 'POST',
          data: '{' +
            "  'obj': {" +
            "    'classifyId': 100001," +
            "    'refId': '" + adDocId + "'" +
            '  }' +
            '}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              result.data.forEach(function (item, i) {
                self.fileList.push({id: item.id, name: item.fileName, url: item.filePath});
              });
            } else {
              console.log(result.status);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
      },
      getAdDocId() {
        let adDocId = this.$route.params.id;
        if (adDocId === null || adDocId === '' || adDocId === undefined) {
          adDocId = -1;
          if (!this.utils.isEmpty(window.localStorage.getItem('adDocId'))) {
            adDocId = window.localStorage.getItem('adDocId');
          }
          return adDocId;
        } else {
          window.localStorage.setItem('adDocId', adDocId);
        }
        return decodeURI(adDocId);
      },
      getAction() {
        let action = this.$route.params.action;
        if (this.utils.isEmpty(action)) {
          action = -1;
          if (!this.utils.isEmpty(window.localStorage.getItem('action'))) {
            action = window.localStorage.getItem('action');
          }
        } else {
          window.localStorage.setItem('action', action);
        }
        return decodeURI(action);
      },
      queryData() {
        let adDocId = this.getAdDocId();
        if (adDocId === -1) return;
        let self = this;
        $.ajax({
          url: 'http://106.12.133.158:1881/api/pm/adcompdoc/query',
          type: 'POST',
          data: '{' +
            "  'obj': {" +
            "    'id': " + adDocId + ',' +
            "    'flag': 0" +
            '  }' +
            '}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0 && result.data.length > 0) {
              self.form = Object.assign({}, result.data[0]);
            } else {
              console.log(result.status);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
      },
      queryAdCompEval() {
        let self = this;
        let adDocId = this.getAdDocId();
        if (adDocId === -1) return;
        $.ajax({
          url: 'http://106.12.133.158:1881/api/pm/adcompeval/query',
          type: 'POST',
          data: '{' +
            "  'obj': {" +
            "    'adDocId': '" + adDocId + "'" +
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
      dataSubmit: function () {
        let self = this;
        self.$refs.form.validate((valid) => {
          if (valid) {
            self.$confirm('确认提交吗？', '提示', {}).then(() => {
              self.loading = true;
              // NProgress.start();
              let para = Object.assign({}, this.form);
              let action = self.getAction();
              let postUrl = 'http://106.12.133.158:1881/api/pm/adcompdoc/';
              if (action !== '') {
                postUrl += action;
              }
              let refList = '';
              let adEvalJson = '';
              let alarmMessage = '';
              if (self.utils.isNotEmpty(action) && action === 'addRef') {
                let adEvalList = self.storeList;
                if (adEvalList !== null && adEvalList !== undefined && adEvalList.length > 0) {
                  for (let i = 0; i < adEvalList.length; i++) {
                    /* adEvalJson +=
                    '{' +
                    "    'id': " + adEvalList[i].id + ',' +
                    "    'acTypeId': '" + adEvalList[i].acTypeId + "'," +
                    "    'userId': '" + adEvalList[i].userNo + "'," +
                    "    'userName': '" + adEvalList[i].userName + "'," +
                    "    'ActionStatus': " + adEvalList[i].ActionStatus +
                    '}'; */
                    adEvalJson +=
                      '{' +
                      "    'acTypeId': '" + adEvalList[i].acTypeId + "'," +
                      "    'userId': '" + adEvalList[i].userNo + "'" +
                      '},';

                    if (self.utils.isEmpty(adEvalList[i].acTypeId)) {
                      alarmMessage += '第' + (i + 1) + '行未选择机型.<br/>';
                    }
                    if (self.utils.isEmpty(adEvalList[i].acMake)) {
                      alarmMessage += '第' + (i + 1) + '行制造商为空.<br/>';
                    }
                    if (self.utils.isEmpty(adEvalList[i].userNo)) {
                      alarmMessage += '第' + (i + 1) + '行评估工程师为空.<br/>';
                    }
                  }
                }
                if (!self.utils.isEmpty(alarmMessage)) {
                  self.loading = false;
                  self.$alert(alarmMessage, '评估机型数据校验不通过', {dangerouslyUseHTMLString: true});
                  return false;
                }
                refList = "'refList': [" + adEvalJson + ']';
              }
              let fileName = '';
              let fileUrl = '';
              let classifyId = '';
              if (self.fileList.length > 0) {
                classifyId = '100001';
                fileName = self.fileList[0].name;
                fileUrl = self.fileList[0].url;
              }
              debugger;
              $.ajax({
                url: postUrl,
                type: 'POST',
                data: '{' +
                  "   'obj': {" +
                  "       'id': '" + para.id + "'," +
                  "       'issueAuthId': '" + para.issueAuthId + "'," +
                  "       'adCompNum': '" + para.adCompNum + "'," +
                  "       'adCompVer': '" + para.adCompVer + "'," +
                  "       'adCompName': '" + para.adCompName + "'," +
                  "       'adDateEff': '" + self.utils.dateToString(para.adDateEff, 'yyyy-MM-dd') + "'," +
                  "       'flag': '" + para.flag + "'," +
                  "       'createById': '" + para.createById + "'," +
                  "       'createTime': '" + para.createTime + "'," +
                  "       'updateById': '" + para.updateById + "'," +
                  "       'updateTime': '" + para.updateTime + "'" +
                  '   },' +
                  "   'fileList': [{" +
                  "       'classifyId': '" + classifyId + "'," +
                  "       'fileName': '" + fileName + "'," +
                  "       'filePath': '" + fileUrl + "'" +
                  '   }],' +
                      refList +
                  '}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (result) {
                  if (result.status === 0) {
                    self.loading = false;
                    // NProgress.done();
                    self.$message({
                      message: '数据保存成功.',
                      type: 'success'
                    });
                    self.queryData();
                    if (self.utils.isNotEmpty(action) && action === 'addRef') {
                      self.queryAdCompEval();
                    }
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
      vilidateAdEval: function(dataList, arrIndex) {
        let self = this;
        let alarmMessage = '';
        let adEvalList = dataList;
        if (adEvalList !== null && adEvalList !== undefined && adEvalList.length > 0) {
          for (let i = 0; i < adEvalList.length; i++) {
            if (self.utils.isEmpty(adEvalList[i].acTypeId)) {
              alarmMessage += '第' + (arrIndex + i + 1) + '行未选择机型.<br/>';
            }
            if (self.utils.isEmpty(adEvalList[i].acMake)) {
              alarmMessage += '第' + (arrIndex + i + 1) + '行制造商为空.<br/>';
            }
            if (self.utils.isEmpty(adEvalList[i].userNo)) {
              alarmMessage += '第' + (arrIndex + i + 1) + '行评估工程师为空.<br/>';
            }
          }
        }
        if (!self.utils.isEmpty(alarmMessage)) {
          self.loading = false;
          self.$alert("<font color='red'>" + alarmMessage + '</font>', '评估机型数据校验不通过', {dangerouslyUseHTMLString: true});
          return false;
        }
        return true;
      },
      // Ad Comp Eval Controller
      handleAdCompEval: function (index, row, action) {
        let self = this;
        let adDocId = this.getAdDocId();
        if (adDocId === -1) return;
        self.$confirm('确认提交吗？', '提示', {}).then(() => {
          self.loading = true;
          if (row === null || row === undefined) {
            self.loading = false;
            self.$alert('第' + index + '行评估机型数据无效，请重新编辑数据', '评估机型数据校验不通过', {dangerouslyUseHTMLString: true});
            return false;
          } else {
            if (!this.vilidateAdEval([row], 0)) {
              self.loading = false;
              return false;
            }
            $.ajax({
              url: 'http://106.12.133.158:1881/api/pm/adcompeval/' + action,
              type: 'POST',
              data: '{' +
                "    'id': '" + row.id + "'," +
                "    'adDocId': '" + adDocId + "'," +
                "    'acTypeId': '" + row.acTypeId + "'," +
                "    'userId': '" + row.userNo + "'" +
                '}',
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              success: function (result) {
                if (result.status === 0) {
                  self.loading = false;
                  self.$message({
                    message: '数据保存成功.',
                    type: 'success'
                  });
                  self.queryAdCompEval();
                } else {
                  console.log(result.status);
                }
              },
              error: function (e) {
                console.log(e);
              }
            });
          }
        });
      },
      // 删除
      deleteAdCompEval: function (id) {
        var self = this;
        this.loading = true;
        // NProgress.start();
        $.ajax({
          url: 'http://106.12.133.158:1881/api/pm/adcompeval/delete',
          type: 'POST',
          data: '[' + id + ']',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              this.loading = false;
              self.$message({
                message: '删除成功',
                type: 'success'
              });
              self.queryAdCompEval();
            } else {
              console.log(result.status);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
      },
      // 新增数据
      addTableRow() {
        for (let data of this.tableData) {
          if (data.enabled) {
            return this.$message.warning('请先保存当前编辑项');
          }
        }
        let item = {
          id: this.utils.generateId(6),
          acTypeId: null,
          acType: null,
          acMake: null,
          userNo: null,
          userName: null,
          enabled: true,
          ActionStatus: -1 // -1:新增,-2:修改,-3:删除
        }
        this.tableData.push(item)
      },
      // 删除数据
      deleteItem(index, row) {
        let self = this;
        this.$confirm('请确认是否删除?', '提示', {
          type: 'warning'
        }).then(() => {
          // 适航文件接收编辑
          if (self.actionDo === 'update') {
            self.deleteAdCompEval(row.id); // 适航指令评估 数据库已经存在，直接删除（后端要进行校验，如流程执行中，则不能删除）
          } else {
            // storeList 过滤是否存在符合id的数据，,则判断是否
            let arrIndex = self.getIndex(row.id);
            // 若ActionStatus不存在，则表示数据库中已经存在的数据,标记为 -3 ，后续在数据库中删除即可。
            if (row.ActionStatus === null || row.ActionStatus === undefined) {
              // arrIndex若为-1，表示数组中不存在ID的对象,则新增，将当前行数据存放到storeList数组中
              if (arrIndex === -1) {
                let jsonRow = JSON.parse(JSON.stringify(row));
                jsonRow.ActionStatus = -3;
                self.storeList.push(jsonRow); // 将当前行数据存放到storeList数组中
              } else { // 否则表示storeList存在满足id的数据，根据arrIndex索引找到它，修改相关属性的值
                self.storeList[arrIndex].ActionStatus = -3;
              }
            } else if (arrIndex !== -1) { // 否则表示数据库不存在，并判断是否在storeList存在，若存在删除数组即可，无需操作数据库
              self.storeList.splice(arrIndex, 1);
            }
            self.tableData.splice(index, 1);
          }
        }).catch(() => {
        });
      },
      // 编辑数据
      startEdit(index, row) {
        for (let data of this.tableData) {
          if (data.enabled && data.id !== row.id) {
            return this.$message.warning('请先保存当前编辑项');
          }
        }
        // storeList 过滤是否存在符合id的数据，则判断是否
        let arrIndex = this.getIndex(row.id);
        // arrIndex若为-1，表示数组中不存在ID的对象,则新增，将当前行数据存放到storeList数组中
        if (arrIndex === -1) {
          let jsonRow = JSON.parse(JSON.stringify(row));
          this.storeList.push(jsonRow); // 将当前行数据存放到storeList数组中
        } else {
          this.storeList[arrIndex].acTypeId = row.acTypeId;
          this.storeList[arrIndex].acType = row.acType;
          this.storeList[arrIndex].acMake = row.acMake;
          this.storeList[arrIndex].userNo = row.userNo;
          this.storeList[arrIndex].userName = row.userName;
        }
        // this.sel = JSON.parse(JSON.stringify(row));
        this.$set(row, 'enabled', true)
      },
      // 编辑成功
      confirmEdit(index, row) {
        // 适航文件接收编辑
        if (this.actionDo === 'update') {
          if (row.ActionStatus === null || row.ActionStatus === undefined) {
            this.handleAdCompEval(index, row, 'update'); // 适航指令评估 数据库已经存在
          } else if (row.ActionStatus === -1) { // 表示新增
            this.storeList.splice(index, 1);// 在临时存储数组中删除
            this.handleAdCompEval(index, row, 'add'); // 新增数据
          }
        } else {
          // storeList 过滤是否存在符合id的数据，,则判断是否
          let arrIndex = this.getIndex(row.id);
          if (!this.vilidateAdEval([row], arrIndex === -1 ? 0 : arrIndex)) {
            return;
          }
          // arrIndex若为-1，表示数组中不存在ID的对象,则新增，将当前行数据存放到storeList数组中
          if (arrIndex === -1) {
            let jsonRow = JSON.parse(JSON.stringify(row));
            // 若ActionStatus不存在，则表示从数据库中已经存在的数据,标记为 -2 ，表示修改，否则表示新增的数据（缓存中，后续需要插入到数据库）
            if (row.ActionStatus === null || row.ActionStatus === undefined) {
              jsonRow.ActionStatus = -2;
            } else {
              jsonRow.ActionStatus = -1;
            }
            this.storeList.push(jsonRow); // 将当前行数据存放到storeList数组中
          } else {
            // 否则表示storeList存在满足id的数据，根据arrIndex索引找到它，修改相关属性的值
            this.storeList[arrIndex].acTypeId = row.acTypeId;
            this.storeList[arrIndex].acType = row.acType;
            this.storeList[arrIndex].acMake = row.acMake;
            this.storeList[arrIndex].userNo = row.userNo;
            this.storeList[arrIndex].userName = row.userName;
            if (row.ActionStatus === null || row.ActionStatus === undefined) {
              this.storeList[arrIndex].ActionStatus = -2;
            } else {
              this.storeList[arrIndex].ActionStatus = -1;
            }
          }

          let msg = '';
          for (let i = 0; i < this.storeList.length; i++) {
            msg += this.storeList[i].acTypeId + ',';
          }
          this.$message({
            message: msg,
            type: 'success'
          });
          this.$set(row, 'enabled', false);
        }
      },
      // 取消
      cancelEdit(index, row) {
        let self = this;
        this.$confirm('请确认是否取消编辑?', '提示', {
          type: 'warning'
        }).then(() => {
          let arrIndex = self.getIndex(row.id);
          // 是否是取消操作
          if (arrIndex !== -1) {
            let results = this.storeList[arrIndex];
            if (results !== null) {
              this.$set(row, 'acTypeId', results.acTypeId);
              this.$set(row, 'acType', results.acType);
              this.$set(row, 'acMake', results.acMake);
              this.$set(row, 'userNo', results.userNo);
              this.$set(row, 'userName', results.userName);
            }
          }
          this.$set(row, 'enabled', false);
        }).catch(() => {
        });
      },
      getIndex: function (id) {
        let arrIndex = -1;
        for (let i = 0; i < this.storeList.length; i++) {
          if (this.storeList[i].id === id) {
            arrIndex = i;
            break;
          }
        }
        return arrIndex;
      }
    }
  };
</script>
