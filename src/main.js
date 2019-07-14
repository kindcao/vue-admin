// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import http from './http';
import store from './store/index';
import router from './router/index';
import Root from './Root.vue';
import VueGoodTablePlugin from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css';
import utils from './utils/utils.js'

// 公共样式表
import 'normalize.css';
import 'animate.css';

// 引入babel-polyfill
import 'babel-polyfill';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 引入echarts主模块（基础模块）
import ECharts from 'vue-echarts/components/ECharts.vue'

// 引入需要的echarts如表
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';

// 引入需要的 echarts的交互组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';
import 'echarts/lib/component/visualMap';
import 'echarts/lib/component/toolbox';

import 'src/assets/styles/variable.scss';
import 'src/assets/styles/base.scss';
import 'src/assets/styles/common.scss';
import 'src/assets/styles/iconfont.css';

Vue.prototype.utils = utils;
Vue.use(ElementUI);

Vue.use(VueGoodTablePlugin);

Vue.component('chart', ECharts);

Vue.config.productionTip = false;

/* eslint-disable no-new */

// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
Vue.prototype.axios = http;

Vue.directive('numberInt', { bind: function(el, binding, vnode) {
  let element = el.getElementsByTagName('input')[0];
  let len = binding.arg;  // 初始化设置
  element.value = Number(element.value).toFixed(len);  // 失焦时候格式化
  element.addEventListener('blur', function() {
    if (isNaN(element.value)) {
      vnode.data.model.callback(0);
    } else {
      vnode.data.model.callback(Number(element.value).toFixed(len));
    }
  });
}});

new Vue({
  el: '#app',
  store,
  router,
  template: '<Root/>',
  components: { Root }
});

