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
import global_ from './public/global' //引用文件
Vue.prototype.global = global_
import echarts from 'echarts'
Vue.prototype.$echarts = echarts;
import './../static/base.css'
/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: {
		App
	},
	template: '<App/>'
})
axios.defaults.timeout = 2000
//拦截器设置全局请求token
axios.interceptors.request.use(
	config => {

		if(localStorage.token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
			config.headers = {
				"Content-Type": "application/json",
				"X-Access-Token": localStorage.token
			}
		}
		return config;
	},
	err => {
		return Promise.reject(err);
	});
// 添加响应拦截器
axios.interceptors.response.use(function(response) {
	// 对响应数据做点什么
	return response
}, function(error) {
	console.log(error)
	console.log('err' + error) // for debug
    ElementUI.Message({
    message: error.message,
//					message:'请求超时',
      type: 'error',
      duration: 2 * 1000
    })
	// 对响应错误做点什么
	if(error.response) {
		if(error.response.status === 500) {
			ElementUI.MessageBox('token失效，请重新登录', {
          confirmButtonText: '确定'
        }).then(()=>{
        	console.log('0000')
          router.push('/login')
					localStorage.removeItem('token')
					localStorage.removeItem('userinfo')
					localStorage.removeItem('islogin')
        });
		}
	}
	return Promise.reject(error)
})
