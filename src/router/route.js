/**
 * @Project Name: vue-admin
 * @Author: luichooy
 * @Date: 2018-01-17 15:01
 * @Email: luichooy@163.com
 * @Idea: WebStorm
 */

import Layout from 'src/pages/layout/layout';

// 不作为main组件子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: () => import('src/pages/login/login')
};

// 错误页面
export const errorRouter = {
  path: '/error/:code',
  name: 'error',
  meta: {
    title: 'error'
  },
  component: () =>
    import('src/pages/error/index')
};

// 作为main组件子页面展示  但不在左侧菜单显示的路由卸载otherRoter里
export const otherRouter = {
  path: '',
  name: 'otherRouter',
  redirect: '/home',
  meta: {
    requireAuth: true
  },
  component: Layout,
  children: [
    {
      path: 'home',
      name: 'home',
      title: '首页',
      component: () => import('src/pages/home/home')
    },
    {
      path: '/system/OEMDocAdd',
      name: 'OEMDocAdd',
      title: '首页',
      component: () => import('src/pages/system/OEMDocAdd')
    },
    {
      path: '/system/MelControlAdd',
      name: 'MelControlAdd',
      title: '最小清单控制编辑',
      component: () => import('src/pages/system/MelControlAdd')
    },
    {
      path: '/system/ACInfoAdd',
      name: 'ACInfoAdd',
      title: '飞机信息',
      component: () => import('src/pages/system/ACInfoAdd')
    },
    {
      path: '/Engineering/ADCompDocAdd/:id/:action',
      name: 'ADCompDocAdd',
      title: '适航文件接收',
      component: () => import('src/pages/Engineering/ADCompDocAdd')
    },
    {
      path: '/Engineering/ADEvalAdd/:id/:acTypeId/:action',
      name: 'ADEvalAdd',
      title: '适航文件评价',
      component: () => import('src/pages/Engineering/ADEvalAdd')
    }
  ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/Engineering',
    name: 'Engineering',
    title: '工程管理',
    meta: {
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: 'AdCompDoc',
        name: 'AdCompDoc',
        title: '适航文件接收',
        component: () => import('src/pages/Engineering/ADCompDoc')
      },
      {
        path: 'ADEval',
        name: 'ADEval',
        title: '适航指令评估',
        component: () => import('src/pages/Engineering/ADEval')
      },
      {
        path: 'MPEval',
        name: 'MPEval',
        title: '维修大纲改版评估',
        component: () => import('src/pages/Engineering/MPEval')
      }
    ]
  },
  {
    path: '/MCC',
    name: 'MCC',
    title: '工程管理',
    meta: {
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: 'WorkOrder',
        name: 'WorkOrder',
        title: '工作指令',
        component: () => import('src/pages/MCC/WorkOrder')
      },
      {
        path: 'StaffList',
        name: 'StaffList',
        title: '人员列表',
        component: () => import('src/pages/MCC/StaffList')
      },
      {
        path: 'LabHr',
        name: 'LabHr',
        title: '工时管理',
        component: () => import('src/pages/MCC/LabHr')
      }
    ]
  },
  {
    path: '/tables',
    name: 'tables',
    title: '表格管理',
    meta: {
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: 'basic',
        name: 'basic',
        title: '基本表格',
        component: () => import('src/pages/tables/basic')
      },
      {
        path: 'sort',
        name: 'sort',
        title: '排序表格',
        component: () => import('src/pages/tables/sort')
      },
      {
        path: 'filter',
        name: 'filter',
        title: '筛选表格',
        component: () => import('src/pages/tables/filter')
      }
    ]
  },
  {
    path: '/charts',
    name: 'charts',
    title: 'echarts图表',
    meta: {
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: 'bar',
        name: 'bar',
        title: '柱状图',
        component: () => import('src/pages/charts/bar')
      },
      {
        path: 'line',
        name: 'line',
        title: '折线图',
        component: () => import('src/pages/charts/line')
      },
      {
        path: 'pie',
        name: 'pie',
        title: '饼图',
        component: () => import('src/pages/charts/pie')
      }
    ]
  },
  {
    path: '/form',
    name: 'ADCompDoc.json',
    title: '表单管理',
    meta: {
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: 'render',
        name: 'render',
        title: '渲染表单',
        component: () => import('src/pages/form/render/render')
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    title: '系统管理',
    meta: {
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'system_index',
        title: '系统管理',
        component: () => import('src/pages/system/index/index')
      },
      {
        path: 'ATAChapter',
        name: 'ATAChapter',
        title: 'ATA章节管理',
        component: () => import('src/pages/system/ATAChapter')
      },
      {
        path: 'ACType',
        name: 'ACType',
        title: '飞机商业型',
        component: () => import('src/pages/system/ACType')
      },
      {
        path: 'ACInfo',
        name: 'ACInfo',
        title: '飞机信息',
        component: () => import('src/pages/system/ACInfo')
      },
      {
        path: 'ConstantValTree',
        name: 'ConstantValTree',
        title: '常量字典',
        component: () => import('src/pages/system/ConstantValTree')
      },
      {
        path: 'ProductModel',
        name: 'ProductModel',
        title: '产品型号',
        component: () => import('src/pages/system/ProductModel')
      },
      {
        path: 'Authority',
        name: 'Authority',
        title: '适航局',
        component: () => import('src/pages/system/Authority')
      },
      {
        path: 'OEMDoc',
        name: 'OEMDoc',
        title: 'OEM发布文档',
        component: () => import('src/pages/system/OEMDoc')
      },
      {
        path: 'MelControl',
        name: 'MelControl',
        title: '最低清单控制',
        component: () => import('src/pages/system/MelControl')
      },
      {
        path: 'groupedTable',
        name: 'groupedTable',
        title: 'groupedTable',
        component: () => import('src/pages/system/groupedTable')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    title: '用户管理',
    meta: {
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: 'SysUser',
        name: 'SysUser',
        title: '用户管理',
        component: () => import('src/pages/user/SysUser')
      }
    ]
  },
  {
    path: '/access',
    name: 'access',
    title: '权限管理',
    meta: {
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'access_index',
        title: '权限管理',
        component: () => import('src/pages/access/index')
      }
    ]
  },
  {
    path: '/log',
    name: 'log',
    title: '日志管理',
    meta: {
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'log_index',
        title: '操作日志',
        component: () => import('src/pages/log/index')
      }
    ]
  },
  {
    path: '/test',
    name: 'test',
    title: '测试',
    meta: {
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'test_index',
        title: '测试',
        component: () => import('src/pages/test/test')
      }
    ]
  }
];

export const routers = [
  loginRouter,
  errorRouter,
  otherRouter,
  ...appRouter
];
