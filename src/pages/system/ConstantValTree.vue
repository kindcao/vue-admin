<template>
  <div>
    <!--<el-form ref="filters" :model="filters" >
      <el-row>
        <el-col :span="4">
          <el-form-item label="分类" prop="classify" label-width="50px">
            <el-input v-model="filters.classify"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="名称或描述" prop="descTxt" label-width="90px">
            <el-input v-model="filters.descTxt"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="是否有效" prop="flag" label-width="75px">
            <el-select v-model="filters.flag">
              <el-option label="有效" value="0"></el-option>
              <el-option label="无效" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item style="margin-left: 20px;">
            <el-button type="primary" v-on:click="findTreeData">查询</el-button>
            <el-button type="primary" v-on:click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>-->
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column label="名称或描述" prop="descTxt" align="left" min-width="25%"></el-table-column>
      <el-table-column label="分类" prop="cnstId" min-width="15%"></el-table-column>
      <el-table-column label="英文描述" prop="descTxtEn" min-width="15%"></el-table-column>
      <el-table-column label="父编码" prop="parentId" min-width="8%"></el-table-column>
      <el-table-column label="父节点名称" prop="parentText" min-width="10%"></el-table-column>
      <el-table-column label="排序" prop="displayOrder" min-width="8%"></el-table-column>
      <el-table-column label="操作" min-width="19%" align="center">
        <template scope="scope">
          <i class="el-icon-circle-plus-outline" @click="handleEdit(scope.$index, scope.row, 'add')"><span>新增</span></i>
          <i style="width:20px;">&nbsp;</i>
          <i class="el-icon-edit" @click="handleEdit(scope.$index, scope.row, 'update')"><span>编辑</span></i>
          <i style="width:20px;">&nbsp;</i>
          <i class="el-icon-delete" @click="handleDel(scope.$index, scope.row)" v-if="scope.row.parentId !== -99" disabled><span>删除</span></i>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" :visible.sync="dialogVisible" :close-on-click-modal="false" :append-to-body="true">
      <el-form :model="dataForm" label-width="120px" :rules="dataFormRules" ref="dataForm">
        <el-form-item label="主键" prop="id" hidden>
          <el-input v-model="dataForm.id"></el-input>
        </el-form-item>
        <el-form-item label="父节点ID" prop="parentId" hidden>
          <el-input v-model="dataForm.parentId"></el-input>
        </el-form-item>
        <el-form-item label="父节点" prop="parentText" >
          <el-input v-model="dataForm.parentText" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="cnstId">
          <el-input v-model="dataForm.cnstId"></el-input>
        </el-form-item>
        <el-form-item label="中文描述" prop="descTxt">
          <el-input v-model="dataForm.descTxt"></el-input>
        </el-form-item>
        <el-form-item label="英文描述" prop="descTxtEn">
          <el-input v-model="dataForm.descTxtEn"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="排序编号" prop="displayOrder">
          <el-input-number v-model="dataForm.displayOrder" controls-position="right" :min="0" label="排序编号"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click.native="dataSubmit" :loading="dataLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped>
  @import '../../resources/form-controls.css';
</style>
<script>
  import $ from 'jquery';
  export default {
    created () {
      this.findTreeData();
    },
    data() {
      return {
        tableData: [], // JSON.parse(JSON.stringify(data)),
        /* filters: {
          classify: '',
          descTxt: '',
          flag: ''
        }, */
        loading: false,
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
          cnstId: '',
          descTxt: '',
          descTxtEn: '',
          parentId: 0,
          parentText: '',
          displayOrder: 0,
          remark: '',
          flag: 0,
          createById: '',
          createTime: '',
          updateById: '',
          updateTime: ''
        }
      }
    },

    methods: {
      // 显示编辑界面
      handleEdit: function (index, row, action) {
        this.dialogVisible = true;
        this.dataForm = {
          id: 0,
          cnstId: '',
          descTxt: '',
          descTxtEn: '',
          parentId: 0,
          parentText: '',
          displayOrder: 0,
          remark: '',
          flag: 0,
          createById: '',
          createTime: '',
          updateById: '',
          updateTime: '',
          action: ''
        };
        if (action === 'add') {
          this.dataForm.parentId = row.id;
          this.dataForm.parentText = row.descTxt;
          // this.$set(this.dataForm, 'parentId', row.parentId);
          // this.$set(this.dataForm, 'parentText', row.parentText);
        } else {
          this.dataForm = Object.assign({}, row);
        }
        this.dataForm.action = action;
      },
      findTreeData () {
        let sef = this;
        $.ajax({
          url: 'http://106.12.133.158:88/api/static/cnstval/query',
          type: 'POST',
          data: '{' +
           /* "  'obj': {" +
            "    'classify': '" + sef.filters.classify + "'," +
            "    'descTxt': '" + sef.filters.descTxt + "'," +
            "    'flag': '" + sef.filters.flag + "'" +
            '  }' + */
            '}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (result) {
            console.log(result.status === 0);
            if (result.status === 0) {
              sef.tableData = sef.getListData(result.data);
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
      getListData(results) {
        let dataArray = [];
        results.forEach(function (data) {
          if (data !== undefined) {
            let cnstId = data.cnstId;
            if (cnstId === 'root') {
              let objTemp = {
                id: data.id,
                cnstId: cnstId,
                descTxt: data.descTxt,
                descTxtEn: data.descTxtEn,
                remark: data.remark,
                parentId: data.parentId,
                parentText: data.descTxt,
                displayOrder: data.displayOrder,
                flag: data.flag,
                createById: data.createById,
                createTime: data.createTime,
                updateById: data.updateById,
                updateTime: data.updateTime
              }
              dataArray.push(objTemp);
            }
          }
        })
        return this.data2treeDG(results, dataArray)
      },
      data2treeDG(datas, dataArray) {
        for (let j = 0; j < dataArray.length; j++) {
          let dataArrayIndex = dataArray[j];
          let childrenArray = [];
          let Id = dataArrayIndex.id;
          for (let i = 0; i < datas.length; i++) {
            let data = datas[i];
            if (data !== undefined) {
              let parentId = data.parentId;
              if (parentId === Id) { // 判断是否为儿子节点
                let objTemp = {
                  id: data.id,
                  cnstId: data.cnstId,
                  descTxt: data.descTxt,
                  descTxtEn: data.descTxtEn,
                  remark: data.remark,
                  parentId: parentId,
                  parentText: dataArrayIndex.descTxt, // 父节点名称
                  displayOrder: data.displayOrder,
                  flag: data.flag,
                  createById: data.createById,
                  createTime: data.createTime,
                  updateById: data.updateById,
                  updateTime: data.updateTime
                }
                childrenArray.push(objTemp);
              }
            }
          }
          dataArrayIndex.children = childrenArray;
          if (childrenArray.length > 0) { // 有儿子节点则递归
            this.data2treeDG(datas, childrenArray)
          }
        }
        return dataArray;
      },
      // 编辑
      dataSubmit: function () {
        var self = this;
        self.$refs.dataForm.validate((valid) => {
          if (valid) {
            self.$confirm('确认提交吗？', '提示', {}).then(() => {
              self.editLoading = true;
              // NProgress.start();
              let para = Object.assign({}, this.dataForm);
              let postUrl = 'http://106.12.133.158:88/api/static/cnstval/';
              if (para.action !== '') {
                postUrl += para.action;
              }
              $.ajax({
                url: postUrl,
                type: 'POST',
                data: '{' +
                  "    'id': '" + para.id + "'," +
                  "    'cnstId': '" + para.cnstId + "'," +
                  "    'descTxt': '" + para.descTxt + "'," +
                  "    'descTxtEn': '" + para.descTxtEn + "'," +
                  "    'displayOrder': '" + para.displayOrder + "'," +
                  "    'remark': '" + para.remark + "'," +
                  "    'parentId': '" + para.parentId + "'," +
                  "    'flag': '" + para.flag + "'," +
                  "    'createById': '" + para.createById + "'," +
                  "    'createTime': '" + para.createTime + "'," +
                  "    'updateById': '" + para.updateById + "'," +
                  "    'updateTime': '" + para.updateTime + "'" +
                  '}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (result) {
                  if (result.status === 0) {
                    self.dataLoading = false;
                    // NProgress.done();
                    self.$message({
                      message: '数据编辑成功.',
                      type: 'success'
                    });
                    self.$refs['dataForm'].resetFields();
                    self.dialogVisible = false;
                    self.findTreeData();
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
      // 删除
      handleDel: function (index, row) {
        var self = this;
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          // NProgress.start();
          $.ajax({
            url: 'http://106.12.133.158:88/api/static/cnstval/delete',
            type: 'POST',
            data: '[' + row.id + ']',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
              console.log(result.status);
              if (result.status === 0) {
                self.$message({
                  message: '删除成功',
                  type: 'success'
                });
                self.findTreeData();
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
      // append(data) {
      //   const newChild = { id: id++, descTxt: 'testtest', children: [] };
      //   if (!data.children) {
      //     this.$set(data, 'children', []);
      //   }
      //   data.children.push(newChild);
      // },
      //
      // remove(node, data) {
      //   debugger;
      //   const parent = node.parent;
      //   const children = parent.data.children || parent.data;
      //   const index = children.findIndex(d => d.id === data.id);
      //   children.splice(index, 1);
      // }
    }
  };
</script>
