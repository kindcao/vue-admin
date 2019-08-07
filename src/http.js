import axios from 'axios';
import { Loading, Message, MessageBox } from 'element-ui';
import store from './store/index';
import router from './router/index';
import { sessionStorage } from 'src/assets/js/storage';

if (!store.state.token_access) {
  store.commit('SET_TOKEN_ACCESS', sessionStorage.getItem('token_access'));
}

// axios 配置
const http = axios.create({
  baseURL: 'http://106.12.133.158:1881/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  transformRequest: [
    function(data, headers) {
      headers.token_access = store.state.token_access;
      if (headers['Content-type'] === 'multipart/form-data') {
        return data;
      } else {
        return JSON.stringify(data);
      }
    }
  ]
});

var loadingInstance;

// 请求拦截器
http.interceptors.request.use(
  config => {
    loadingInstance = Loading.service({
      fullscreen: true,
      lock: true,
      text: '正在请求数据...'
    });

    // 开发环境下，如果请求是 post,put,patch,则打印数据体，方便调试
    if (process.env.NODE_ENV === 'development') {
      const { method } = config;
      if (method === 'post' || method === 'put' || method === 'patch') {
        console.log('request -->');
        console.log(config.data);
      }
    }
    return config;
  },
  error => {
    loadingInstance.close();
    Message.error({
      message: '请求失败'
    });
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  res => {
    loadingInstance.close();
    console.log('response <--');
    console.log(res);
    //
    let status = res.data.status;
    if (status === 0) {
      if (res.config.url.endsWith('/sys/sysuser/login')) {
        return res;
      } else {
        Message.success({
          message: '操作成功'
        });
        return res.data;
      }
    } else if (status === -101) {
      store.commit('SET_USER', null);
      store.commit('SET_TOKEN_ACCESS', '');
      store.commit('SET_TOKEN_REFRESH', '');
      //
      Message.warning({
        message: res.data.data
      });
      router.replace({
        path: '/login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      });
    } else {
      Message.error({
        message: res.data.data
      });
      return Promise.reject(res);
    }
  },
  error => {
    loadingInstance.close();
    if (error && error.response) {
      console.log(error.response);
      switch (error.response.status) {
        // 401 token失效
        case 401:
          MessageBox.alert('身份信息已过期，请重新登陆', '提示', {
            confirmButtonText: '重新登陆',
            showClose: false,
            type: 'error',
            callback: action => {
              router.replace({
                path: '/login',
                query: {
                  redirect: router.currentRoute.fullPath
                }
              });
            }
          });
          break;

        // 403 服务器拒绝访问
        case 403:
          router.push('/error/403');
          break;

        // 404 访问的资源不存在
        case 404:
          router.push('/error/404');
          break;

        // 500 服务器错误
        case 500:
          router.push('/error/500');
          break;
      }

      return Promise.reject(error);
    }
  }
);

export default http;
