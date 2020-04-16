// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
Vue.prototype.$http = axios
Vue.config.productionTip = false
import VueRouter from 'vue-router'
import router from './router/index.js'
Vue.use(VueRouter)
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
import global_ from './public/global'//引用文件
Vue.prototype.global = global_
import echarts from 'echarts'
Vue.prototype.$echarts = echarts;
import './../static/base.css'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
