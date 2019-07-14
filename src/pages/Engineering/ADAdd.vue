<template>
  <el-form ref="form" :model="form" label-width="120px" @submit.prevent="onSubmit"
           style="margin:0 0 100px;width:90%;min-width:800px;"  size="mini">
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
          <el-select v-model="form.issueAuthId" placeholder="请选择适航局">
            <el-option label="FAA" value="FAA"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
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
    <el-row>
      <el-col :span="20">
        <el-form-item label="描述" prop="adCompName">
          <el-input v-model="form.adCompName" type="textarea"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row style="margin: 20px 0px 0px;">
      <el-col :span="8">
        <el-form-item label="生效日期" prop="adDateEff">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.adDateEff" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <el-form-item label="附件" prop="ad_date_eff">
          <el-upload
            class="upload-demo"
            ref="upload"
            action=""
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
      <div style="float: left; width: 88%">
        <el-table :data="tableData" border :summary-method="getSummaries" show-summary style="width: 100%;" stripe height="260" element-loading-text="Loading"  border fit highlight-current-row>
          <el-table-column label="机型" align='center' width="140px">
            <template slot-scope="scope">
              <el-select placeholder="请选择" v-if="scope.row.enabled" v-model="scope.row.acTypeId"  @change="changeSelectVal($event,scope.$index,scope.row)">
                <el-option  v-for="item in ADAdd_ACTypeSubList" :key="item.id" :label="item.acType" :value="item.id"></el-option>
              </el-select>
              <span v-else>{{scope.row.acType}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="acMake" label="制造商" align='left'></el-table-column>
          <el-table-column prop="userName" label="评估工程师" align='center' width="140px">
            <template slot-scope="scope">
              <el-select placeholder="请选择" v-if="scope.row.enabled" v-model="scope.row.userNo"  @change="changeUser($event,scope.$index,scope.row)">
                <el-option  v-for="item in ADAdd_UserSubList" :key="item.userNo" :label="item.userName" :value="item.userNo"></el-option>
              </el-select>
              <!--<el-input v-if="scope.row.enabled" v-model="scope.row.userName">
                <el-button slot='append' type="primary" size="mini" class="buttonMiniSize" icon="el-icon-search" @click='choiceUser(scope.$index,scope.row)' title="选择评估工程师"></el-button>
              </el-input>-->
              <span v-else>{{scope.row.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align='center' width="160px">
            <template slot-scope="scope">
              <el-button-group class="button-group">
                <el-button v-if="!scope.row.enabled" type="primary" size="mini" class="buttonMiniSize" icon="el-icon-edit" @click='startEdit(scope.$index,scope.row)' title="编辑"></el-button>
                <el-button v-if="scope.row.enabled" type="success" size="mini" class="buttonMiniSize" icon="el-icon-check" @click='confirmEdit(scope.$index,scope.row)' title="保存"></el-button>
                <el-button v-if="scope.row.enabled" type="warning" size="mini" class="buttonMiniSize" icon="el-icon-refresh" @click='cancelEdit(scope.$index,scope.row)' title="取消"></el-button>
              </el-button-group>
              <el-button @click.native.prevent="deleteItem(scope.$index, scope.row)" class="buttonMiniSize" type="danger" size="mini" icon="el-icon-delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="float: right; width: 10%">
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
        <el-button type="primary">立即创建</el-button>
        <el-button @click.native.prevent>取消</el-button>
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
<script>
  import $ from 'jquery';
  export default {
    created() {
      // this.queryADCompDoc();
    },
    data() {
      return {
        sel: null, // 临时存放当前新增的对象
        storeList: [], // new util.HashTable(),
        tableData: [{
          id: 2,
          acTypeId: 47,
          acType: 'BBJ',
          acMake: 'Boeing',
          userNo: 'PXMWQJL',
          userName: '屈江林'
        }, {
          id: 3,
          acTypeId: 44,
          acType: 'Challenger 605',
          acMake: 'Bombardier',
          userNo: 'PXMWQJL',
          userName: '屈江林'
        }, {
          id: 4,
          acTypeId: 40,
          acType: 'Falcon 900 B',
          acMake: 'Dassault',
          userNo: 'PXMWQJL',
          userName: '屈江林'
        }],
        form: {
          id: 0,
          issueAuthId: '',
          adCompNum: '',
          adCompName: '',
          adCompVer: '',
          adDateEff: '',
          flag: 0,
          createById: '',
          createTime: '',
          updateById: '',
          updateTime: ''
        },
        loading: false,
        pagesize: 5,
        currentpage: 1,
        total: 0,
        ADAdd_ACTypeSubList: [],
        ADAdd_UserSubList: [{
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
      changeSelectVal: function (acTypeId, index, row) {
        let acTypeItem = this.ADAdd_ACTypeSubList.filter(item => item.id === acTypeId);
        if (acTypeItem === null || acTypeItem.length === 0) return;
        this.tableData[index].acType = acTypeItem[0].acType;
        this.tableData[index].acMake = acTypeItem[0].acMake;
      },
      changeUser: function (userNo, index, row) {
        let userList = this.ADAdd_UserSubList.filter(item => item.id === userNo);
        if (userList === null || userList.length === 0) return;
        this.tableData[index].userName = userList[0].userName;
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
              self.ADAdd_ACTypeSubList = result.data;
            } else {
              console.log(result.ADAdd_ACTypeSubList);
            }
          },
          error: function (e) {
            console.log(e);
          }
        });
        $.ajax({
          url: 'http://106.12.133.158:88/api/static/prodmodel/query',
          type: 'POST',
          data: "{ 'obj': { 'cnstValProdTypeId': '22,23,24' } }",
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            if (result.status === 0) {
              let AciArray = [22, 23, 24];
              for (let i = 0; i < AciArray.length; i++) {
                let data = result.data.filter(item => item.cnstValProdTypeId === AciArray[i]);
                if (data === null && data.length === 0) continue;
                switch (AciArray[i]) {
                  case 22 :
                    self.ACINFO_ProductFuselageSubList = data;
                    break;
                  case 23 :
                    self.ACINFO_ProductEngineSubList = data;
                    break;
                  case 24 :
                    self.ACINFO_ProductAPUSubList = data;
                    break;
                }
              }
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
          data: "{ 'obj': { 'parentId': '25' } }",
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

      // 新增数据
      addTableRow() {
        for (let data of this.tableData) {
          if (data.enabled) {
            return this.$message.warning('请先保存当前编辑项');
          }
        }
        let item = {
          id: this.uitl.generateId(10),
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
      // 编辑数据
      choiceUser(index, row) {
        alert('选择评估工程师');
      },
      // 删除数据
      deleteItem(index, row) {
        let self = this;
        this.$confirm('请确认是否删除?', '提示', {
          type: 'warning'
        }).then(() => {
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
        }).catch(() => {
        });
        let msg = '';
        for (let i = 0; i < this.storeList.length; i++) {
          msg += this.storeList[i].acMake + ',' + this.storeList[i].ActionStatus + '; ';
        }
        this.$message({
          message: msg,
          type: 'success'
        });
      },
      // 编辑数据
      startEdit(index, row) {
        for (let data of this.tableData) {
          if (data.enabled && data.id !== row.id) {
            return this.$message.warning('请先保存当前编辑项');
          }
        }
        debugger;
        // storeList 过滤是否存在符合id的数据，,则判断是否
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
        // storeList 过滤是否存在符合id的数据，,则判断是否
        let arrIndex = this.getIndex(row.id);
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
        this.$set(row, 'enabled', false)
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
      },
      getIndex: function (id) {
        let arrIndex = -1;
        let index = self.storeList.forEach(function (item, i) {
          if (item.id === id) {
            return i;
          }
        });

        if (index === null || index === undefined) {
          index = -1;
        } else {
          arrIndex = index;
        }
        return arrIndex
      }
    }
  };
</script>
