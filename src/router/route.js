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
    }
  ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/EngineeringManagement',
    name: 'EngineeringManagement',
    title: '工程管理',
    meta: {
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: 'shzlpg',
        name: 'shzlpg',
        title: '适航指令评估-pinggu2',
        component: () => import('src/pages/EngineeringManagement/1-shzlpg')
      },
      {
        path: 'djgxzt',
        name: 'djgxzt',
        title: '单机构型状态',
        component: () => import('src/pages/EngineeringManagement/2-djgxzt')
      },
      {
        path: 'shwjjs',
        name: 'shwjjs',
        title: '适航文件接受',
        component: () => import('src/pages/EngineeringManagement/3-shwjjs')
      },
      {
        path: 'wxdggbpg',
        name: 'wxdggbpg',
        title: '维修大纲改版评估',
        component: () => import('src/pages/EngineeringManagement/4-wxdggbpg')
      },
      {
        path: 'oemzl',
        name: 'oemzl',
        title: 'OEM资料',
        component: () => import('src/pages/EngineeringManagement/5-oemzl')
      }
    ]
  },
  {
    path: '/MaintenanceControl',
    name: 'MaintenanceControl',
    title: '工程管理',
    meta: {
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: '1_mc_gzzl',
        name: '1_mc_gzzl',
        title: '工作指令',
        component: () => import('src/pages/MaintenanceControl/1_mc_gzzl')
      },
      {
        path: '2_mc_rylb',
        name: '2_mc_rylb',
        title: '人员列表',
        component: () => import('src/pages/MaintenanceControl/2_mc_rylb')
      },
      {
        path: '3_mc_gsgl',
        name: '3_mc_gsgl',
        title: '工时管理',
        component: () => import('src/pages/MaintenanceControl/3_mc_gsgl')
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
    name: 'form',
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
        path: 'index',
        name: 'user_index',
        title: '用户管理',
        component: () => import('src/pages/user/index')
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
