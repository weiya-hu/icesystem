<template>
  <div class="mainpage flex" :style="'height:'+height">
		<div class="left">
			<div class="lefttop fleximg">
				<div class="fleximg imglogo"><img src="../assets/kj1.png" alt="logo"></div>
			</div>
			<div class="leftdown">
				<div class="homeitem flexl" :class="activepage==0?'activepage':''" @click="exchangepage(0)">
					<div class="fleximg imghome"><img src="../assets/home.png" alt=""></div>
					<div class="hometxt">首页</div>
				</div>
				<div class="homeitem flexl" :class="activepage==1?'activepage':''" @click="exchangepage(1)">
					<div class="fleximg imghome"><img src="../assets/realtime.png" alt=""></div>
					<div class="hometxt">实时监测</div>
				</div>
				<div class="homeitem flexl" :class="activepage==2?'activepage':''" @click="exchangepage(2)">
					<div class="fleximg imghome"><img src="../assets/history.png" alt=""></div>
					<div class="hometxt">历史查询</div>
				</div>
				<div class="homeitem flexl" :class="activepage==3?'activepage':''" @click="exchangepage(3)">
					<div class="fleximg imghome"><img src="../assets/sbgl.png" alt=""></div>
					<div class="hometxt">设备管理</div>
				</div>
				<div class="homeitem flexl" :class="activepage==4?'activepage':''" @click="exchangepage(4)">
					<div class="fleximg imghome"><img src="../assets/mine.png" alt=""></div>
					<div class="hometxt">个人中心</div>
				</div>
			</div>
		</div>
		<div class="right">
			<div class="righttop fleximg">
				<div class="title">凝冰监测平台</div>
				<div class="userdata fleximg">
					<div class="fleximg ">
						<div class="imgtx fleximg">
							<img src="../assets/tx.png"/>
						</div>
						<div class="realname">{{userinfo.realname}}</div>
					</div>
					<div class="exit" @click="exit">
						退出登录
					</div>
				</div>
			</div>
			<Homemap v-if="activepage==0" style='height: calc(100%-1rem);'></Homemap>
			<Realtime v-if="activepage==1"></Realtime>
			<History v-show="activepage==2"></History>
			<Equipment v-if="activepage==3"></Equipment>
			<Person v-if="activepage==4"></Person>
		</div>
	</div>
</template>

<script>
	import History from './History.vue';
	import Homemap from './Homemap.vue';
	import Realtime from './Realtime.vue';
	import Equipment from './Equipment.vue';
	import Person from './Person.vue';
	export default {
	  name: 'Home',
		components:{History,Homemap,Realtime,Equipment,Person},
	  data () {
	    return {
	      height:'',
				activepage:0,
				userinfo:JSON.parse(localStorage.userinfo)
	    }
	  },
		methods:{
			exchangepage(id){
				this.activepage=id
			},
			exit(){
				this.$router.push({
					path:'/login'
				})
				localStorage.removeItem('token')
				localStorage.removeItem('userinfo')
				localStorage.removeItem('islogin')
			}
		},
		mounted(){
//			this.$nextTick(function(){
//				let islogin=localStorage.getItem('islogin')
//				console.log(islogin)
//			  	if(!islogin){
//			  		this.$router.push({
//			  			path:'/login'
//			  		})
//			  	}
//		   })
			
		},
	  beforeCreate:function(){
	  	//在页面还没有创建前获取是否登录，如果没有就跳转login登录页面
			
	  },
		beforeMount(){
			this.height=(document.documentElement.clientHeight).toFixed(2)+'px';
		},
		created() {
			let that=this;
			window.addEventListener('resize', function(){
				that.height=(document.documentElement.clientHeight).toFixed(2)+'px';
			});
		},
		destroyed() {
			let that=this;
			window.removeEventListener('resize', function(){
				that.height=(document.documentElement.clientHeight).toFixed(2)+'px';
			})
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.left{width:2.8rem;height: 100%;}
	.lefttop{width: 100%;background:#00284D ;height: 1rem;overflow: scroll;white-space: nowrap;}
	::-webkit-scrollbar {width: 0 !important;height: 0;}
	.imglogo{width: 1rem;}
	.leftdown{height: 100%;background: #001529;}
	.homeitem{padding-left: 0.4rem;height: 0.8rem;}
	.homeitem:hover{background: rgba(21, 136, 199,0.5)}
	.imghome{width: 0.2rem;margin-right: 0.14rem;}
	.hometxt{color: #FFFFFF;font-size: 0.18rem;}
	.right{width: 100%;height: 100%;}
	.righttop{height: 1rem;border-bottom: 1px solid #CCCCCC;position: relative;}
	.title{font-size: 0.5rem;font-weight: bold;letter-spacing: 0.1rem; text-align: center;line-height: 1rem;}
	.left .activepage{background: rgba(21, 136, 199,1);}
	.userdata{position: absolute;top: 50%;right: 0.5rem;transform: translateY(-50%);}
	.imgtx{width: 0.4rem;margin-right: 0.05rem;}
	.realname{font-size: 0.25rem;font-weight: 600;}
	.exit{color: #FFFFFF;background: #0297D7;font-size: 0.22rem;border-radius: 0.04rem;height: 0.5rem;line-height: 0.5rem;
		padding: 0 0.15rem;margin-left: 0.3rem;}
</style>
