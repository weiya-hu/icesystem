// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
axios.defaults.baseURL = '/api' // 开发本地代理
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
axios.interceptors.request.use(
	config => {
	    if (localStorage.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
	      config.headers={
	      	"Content-Type": "application/json",
	        "X-Access-Token": localStorage.token
	      }
	    }
	    return config;
	},
	err => {
    return Promise.reject(err);
});
//Vue.http.interceptors.push((request,next)=>{
// //request.credentials = true; // 接口每次请求会跨域携带cookie
// request.method= 'POST'; // 请求方式（get,post）
// request.headers.set('token',localStorage.token) // 请求headers携带参数
// 
// next(function(response){
//return response;
// 
// });
//})
//Vue.http.interceptors.push((request, next) => {
//		let token =localStorage.getItem('token')
//  request.headers.set('token', token); //setting request.headers
//  next((response) => {
//    return response
// })
//})
//if (localStorage.getItem('token')) {
//store.commit('set_token', localStorage.getItem('token'))
//}
//const myfilter = {
//bzdate: (date) => {
//  if (date) {
//    let timestring = new Date(date)
//    return timestring.toLocaleDateString() + ' ' + timestring.toTimeString().substr(0, 8)
//  }
//}
//}
//for (let key in myfilter) {
//Vue.filter(key, myfilter[key])
//}
//// 添加请求拦截器
//axios.interceptors.request.use(function (config) {
//// 在发送请求之前做些什么
//// 判断是否存在token,如果存在将每个页面header添加token
//if (store.state.token) {
//  config.headers.common['token'] = store.state.token
//}
//return config
//}, function (error) {
//router.push('/login')
//return Promise.reject(error)
//})
//// 添加响应拦截器
//axios.interceptors.response.use(function (response) {
//// 对响应数据做点什么
//return response
//}, function (error) {
//// 对响应错误做点什么
//if (error.response) {
//  switch (error.response.status) {
//    case 401:
//      store.commit('del_token')
//      router.push('/login')
//  }
//}
//return Promise.reject(error)
//})
//
//router.beforeEach((to, from, next) => {
//if (to.meta.title) {
//  document.title = to.meta.title
//}
//if (to.path !== '/login' && !localStorage.getItem('userInfo')) {
//  next({path: '/login'})
//} else {
//  next()
//}
//})
