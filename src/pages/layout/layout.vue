<template>
  <div class="layout">
    <div class="topbar-wrapper" style="left: 0; top: 0;">
      <div class="title float-left">XYJ管理系统</div>
      <ul class="menu-list float-right">
        <li v-if="user" class="menu-item" style="padding: 0;">
          <el-dropdown
            :show-timeout="10"
            :hide-timeout="10"
            @command="handleCommand"
            style="padding: 0 15px;">
            <div class="dropdown-content el-dropdown-link">
              <i class="icon el-icon-adm-usersetup"></i>
              <span class="text">{{user.userName || user.fullName}}</span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <!--<el-dropdown-item command="a">{{user.userName}}</el-dropdown-item>
              el-dropdown-item command="b">{{user.name}}</el-dropdown-item-->
              <el-dropdown-item command="b">{{user.fullName}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li class="menu-item">
          <i class="icon el-icon-adm-help"></i>
        </li>
        <li class="menu-item" @click="exit">
          <i class="icon iconfont el-icon-adm-exit"></i>
        </li>
      </ul>
    </div>
    <div class="siderbar-wrapper" :style="{width: this.isCollapsed?'64px':'200px'}">
      <!--<div class="logo-wrapper" style="background: red">
        公司Logo
      </div>-->
      <div class="menu-collapse-wrapper float-left" @click="toggleMenu">
        <i class="el-icon-adm-menu" :style="{transform: 'rotateZ(' + (this.isCollapsed ? '90' : '0') + 'deg)'}"></i>
        <span>Collapse</span>
      </div>

      <el-menu
        background-color="#424f63"
        text-color="#fff"
        active-text-color="#65cea7"
        class="menu-wrapper"
        router
        unique-opened
        :collapse="isCollapsed"
        :default-active="$route.path">
        <template v-for="(item, index) in sider_menu_data">
          <el-menu-item class="menu-item" v-if="!item.children" :index="item.path" :key="index">
            <i :class="item.icon"></i>
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
          <el-submenu v-else :index="item.path">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{item.title}}</span>
            </template>
            <el-menu-item class="menu-item" v-for="(sub_item, sub_index) in item.children" :index="sub_item.path"
                          :key="sub_index">
              <span slot="title" style="margin-left:12px;">{{sub_item.title}}</span>
            </el-menu-item>
          </el-submenu>
        </template>
      </el-menu>

    </div>

    <div class="content-wrapper" ref="content-wrapper" :style="{left: this.isCollapsed?'64px':'200px'}">
      <el-col :span="24" class="breadcrumb-container">
        <strong class="title">{{$route.name}}</strong>
        <el-breadcrumb separator="/" class="breadcrumb-inner">
          <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
            {{ item.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="24" class="content">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-col>
      <!--
      <div class="content">
        <router-view></router-view>
      </div>//-->
    </div>
  </div>
</template>
<script>
  import {sessionStorage} from 'src/assets/js/storage';

  export default {
    created() {
      this.checkAuth();
    },
    data() {
      return {
        sider_menu_data: [
          {
            path: '/home',
            title: '首页',
            icon: 'el-icon-adm-home'
          },
          {
            path: '/Engineering',
            title: '工程管理',
            icon: 'el-icon-adm-linechart',
            children: [
              {path: '/Engineering/ADCompDoc', title: '适航文件接收'},
              {path: '/Engineering/ADEval', title: '适航指令评估'},
              {path: '/Engineering/MPEval', title: '维修大纲改版评估'}
            ]
          },
          {
            path: '/MCC',
            title: '维修控制',
            icon: 'el-icon-adm-linechart',
            children: [
              {path: '/MCC/WorkOrder', title: '工作指令'},
              {path: '/MCC/StaffList', title: '人员列表'},
              {path: '/MCC/LabHr', title: '工时管理'}
            ]
          },
          {
            path: '/tables',
            title: '表格管理',
            icon: 'el-icon-adm-linechart',
            children: [
              {path: '/tables/basic', title: '基本表格'},
              {path: '/tables/sort', title: '排序表格'},
              {path: '/tables/filter', title: '筛选表格'}
            ]
          },
          {
            path: '/charts',
            title: '图表管理',
            icon: 'el-icon-adm-statistics',
            children: [
              {path: '/charts/bar', title: '柱状图'},
              {path: '/charts/line', title: '折线图'},
              {path: '/charts/pie', title: '饼图'}
            ]
          },
          {
            path: '/form',
            title: '表单管理',
            icon: 'el-icon-adm-form',
            children: [
              {path: '/form/render', title: '渲染表单'}
            ]
          },
          {
            path: '/system',
            title: '系统管理',
            icon: 'el-icon-adm-project',
            children: [
              {path: '/system/ATAChapter', title: 'ATA章节管理'},
              {path: '/system/ACType', title: '飞机商业型'},
              {path: '/system/ConstantValTree', title: '常量字典'},
              {path: '/system/ACInfo', title: '飞机信息'},
              {path: '/system/ProductModel', title: '产品型号'},
              {path: '/system/Authority', title: '适航局'},
              {path: '/system/OEMDoc', title: 'OEM发布文档'},
              {path: '/system/MelControl', title: '最低清单控制'},
              {path: '/system/groupedTable', title: 'Table群组'}
            ]
          },
          {
            path: '/user/SysUser',
            title: '用户管理',
            icon: 'el-icon-adm-user'
          },
          {
            path: '/access/index',
            title: '权限管理',
            icon: 'el-icon-adm-organization'
          },
          {
            path: '/log/index',
            title: '操作日志',
            icon: 'el-icon-adm-log'
          },
          {
            path: '/test/index',
            title: '测试',
            icon: 'el-icon-adm-formsetup'
          }
        ],
        isCollapsed: false,
        adminMenuShow: false
      }
    },
    computed: {
      user() {
        return this.$store.state.user;
      }
    },
    methods: {
      checkAuth() {
        let token = this.$store.state.token_access || sessionStorage.getItem('token_access');
        if (!token) {
          this.$router.replace('/login');
        } else {
          // this.getUser();
        }
      },
      getUser() {
        let User = {
          id: '7f859967-9b12-441c-badc-8a7d312f6da4',
          username: 'admin',
          name: '',
          type: {
            code: 0,
            name: 'System Adm'
          }
        };

        this.$store.commit('SET_USER', User);
      },
      handleCommand(command) {
        // console.log(command);
      },
      toggleMenu() {
        this.isCollapsed = !this.isCollapsed;
      },
      exit() {
        this.$confirm('即将退出系统登陆，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$store.commit('SET_USER', null);
            this.$store.commit('SET_TOKEN_ACCESS', '');
            this.$store.commit('SET_TOKEN_REFRESH', '');
            this.$router.replace({path: '/login'});
          })
          .catch(() => {
            return false;
          })
      }
    }
  }
</script>
<style lang="scss">
  @import '../../assets/styles/variable';

  .siderbar-wrapper {
    position: fixed;
    top: $topbarHeight;
    bottom: 0;
    left: 0;
    width: $siderbarWidth;
    z-index: 11;
    background-color: $siderbarBackgroundColor; // #20a0ff;
    /*transition: all 0.3s ease-in-out;*/

    .logo-wrapper {
      padding: 16px 0;
      text-align: center;
      font-size: 22px;
      color: #FFFFFF;
      /*color: #65CEA7;*/
    }

    .menu-collapse-wrapper {
      height: 50px;
      line-height: 50px;
      width: 100%;
      cursor: pointer;

      span {
        color: white;
        width: 100px;
        font-size: 12pt;
      }

      i {
        margin-left: 20px;
        width: 25px;
        transition: all 0.3s ease-in-out;
        color: white;
      }
    }

    .title {
      height: 100%;
      font-weight: bold;
    }

    .menu-wrapper {
      position: absolute;
      top: 50px;
      bottom: 0;
      width: 100%;
      border-right: none;
      transition: all 0.3s ease-in-out;


      &:not(.el-menu--collapse) {
        overflow-y: auto;
        overflow-x: hidden;
      }

      i {
        color: #FFFFFF;
      }

      .menu-item {

        &.is-active, &:hover {
          background-color: #353F4F !important;
          color: #65CEA7 !important;

          i {
            color: #65CEA7 !important;
          }
        }

      }

      .el-submenu__title:hover {
        color: #65CEA7 !important;

        i {
          color: #65CEA7 !important;
        }
      }

      .el-submenu, .el-menu-item {
        width: 100%;
      }
    }

    ::-webkit-scrollbar {
      width: 10px;
    }

    ::-webkit-scrollbar-track {
      background-color: $siderbarBackgroundColor;
      -webkit-border-radius: 2em;
      -moz-border-radius: 2em;
      border-radius: 2em;
    }

    ::-webkit-scrollbar-thumb {
      background-color: $siderbarBackgroundColor;
      -webkit-border-radius: 2em;
      -moz-border-radius: 2em;
      border-radius: 2em;
    }
  }

  .topbar-wrapper {
    position: fixed;
    left: $siderbarWidth;
    right: 0;
    top: 0;
    heihgt: $topbarHeight;
    line-height: $topbarHeight;
    padding: 0 24px 0 0;
    background-color: $topbarBackgroundColor;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
    transition: all 0.3s ease-in-out;
    z-index: 12;

    .menu-collapse-wrapper {
      height: 100%;
      width: 48px;
      text-align: center;
      cursor: pointer;

      i {
        transition: all 0.3s ease-in-out;
      }
    }

    .title {
      height: 100%;
      font-weight: bold;
    }

    .menu-list {
      .menu-item {
        position: relative;
        float: left;
        padding: 0 15px;
        min-width: 45px;
        height: 38px;
        text-align: center;
        font-size: 0px;

        &:hover {
          cursor: pointer;
          background-color: #F5F5F5;
        }

        .icon {
          vertical-align: middle;
          font-size: 24px;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          margin-left: 4px;
          font-size: 16px;
        }
      }
    }


  }

  .el-menu-item, .el-submenu__title {
    height: 45px;
    line-height: 45px;
    font-size: 10pt;
  }

  .el-submenu .el-menu-item {
    height: 35px;
    line-height: 35px;
    padding: 0 45px;
    min-width: 200px;
    font-size: 10pt;
  }

  .content-wrapper {
    position: fixed;
    left: $siderbarWidth;
    right: 0;
    top: $topbarHeight;
    bottom: 0;
    padding: 16px;
    overflow: auto;
    transition: all 0.3s ease-in-out;

    .breadcrumb-container {
      //margin-bottom: 15px;
      .title {
        width: 200px;
        float: left;
        color: #475669;
      }

      .breadcrumb-inner {
        float: right;
      }
    }

    .content-wrapper {
      background-color: #fff;
      box-sizing: border-box;
    }

    .content {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }
</style>
