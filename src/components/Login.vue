<template>
	<div class="login" :style="'height:'+height">
		<div class="logink">
			<div class="title">凝冰监测平台</div>
			<form action="">
				<div class="fleximg iptitem">
					<label for="username" class="labelusername" >用户名</label><span class="mh">：</span>
					<input type="text" id="username" class="iptusername"  maxlength="16" v-model="loginform.username" ref='username'>					
				</div>
				<div class="fleximg iptitem">
					<label for="password" class="labelusername">密码</label><span class="mh">：</span>
					<input type="password" id="password" class="iptusername"  maxlength="20" v-model="loginform.password" ref='password'>
				</div>
				<div class="fleximg iptitem">
					<label for="yzm" class="labelusername ">验证码</label><span class="mh">：</span>
					<div class="itemyzm flexl">
						<input type="text" id="yzm" class="iptyzm" maxlength="4" v-model="loginform.captcha" ref='captcha'>
						<div class="yzmtxt ValidCode fleximg" @click="refreshCode">
							<span v-for="(item, index) in codeList" :key="index" :style="getStyle(item)">{{code[index]}}</span>
						</div>
						
					</div>
				</div>
				<input type="submit" value="立即登录" class="iptsubmit" @click="loginsubmit">
			</form>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Login',
		data() {
			return {
				height:'',
				length:4,
				codeList:[],
				code:'',
				loginform:{
					username:'',
					password:'',
					captcha:''
				}
			}
		},
		beforeMount(){
			this.height=(document.documentElement.clientHeight).toFixed(2)+'px';
			console.log(localStorage.token)
		},
		methods: {
			refreshCode () {
			  this.createdCode()
			},
			createdCode () {
			  let len = this.length,that=this,codeList = [];
				this.$http.get(this.global.domainurl + 'icecondensation/login/getCaptcha').then(function(res) {
					that.code=res.data.result
				}).catch(function(error) {
					console.log(error)
				})
			  // 生成
			  for (let i = 0; i < len; i++) {
					let rgb = [Math.round(Math.random() * 200), Math.round(Math.random() * 180), Math.round(Math.random() * 160)]
					codeList.push({
					  color: `rgb(${rgb})`, // 随机颜色
					  // fontSize: `1${[Math.floor(Math.random() * 10)]}px`, // 随机字号
					  padding: `${[Math.floor(Math.random() * 10)]}px`, // 随机内边距
					  transform: `rotate(${Math.floor(Math.random() * 50) - Math.floor(Math.random() * 50)}deg)` // 随机旋转角度
					})
			  }
			  // 指向
			  this.codeList = codeList
			},
			// 动态绑定样式
			getStyle (data) {
			  return `color: ${data.color}; padding: ${data.padding}; transform: ${data.transform}`
			},
			loginsubmit(){
				console.log(this.loginform)
				let data={
					username:this.loginform.username,
					password:this.loginform.password,
					captcha:this.loginform.captcha
				},that=this;
				if(this.loginform.username===''){
					this.$alert('请输入用户名', {
	          confirmButtonText: '确定',
	          callback: action => {
	            that.$refs.username.focus()
	          }
	        })
	      }else if(this.loginform.password===''){
	      	this.$alert('请输入密码', {
	          confirmButtonText: '确定',
	          callback: action => {
	            that.$refs.password.focus()
	          }
	        })
	      }else if(this.loginform.captcha===''){
	      	this.$alert('请输入验证码', {
	          confirmButtonText: '确定',
	          callback: action => {
	            that.$refs.captcha.focus()
	          }
	        })
	      }else{
	      	
	      	this.$http.post(this.global.domainurl + 'icecondensation/login',data).then(function(res) {
						console.log(res)
						if(res.data.success){
							localStorage.setItem("token",res.data.result.token);
							localStorage.setItem('islogin',true)
							localStorage.setItem('userinfo', JSON.stringify(res.data.result.userInfo))
							console.log('tohome')
							console.log(localStorage.token)
							that.$router.push({
								path:'/home'
							})
						}else{
							that.$alert(res.data.message, {
			          confirmButtonText: '确定'
			        })
						}
					}).catch(function(error) {
						console.log(error)
					})
	      }
					
				
			}
		},
		created() {
			let that=this;
			window.addEventListener('resize', function(){
				that.height=(document.documentElement.clientHeight).toFixed(2)+'px';
			});
			this.createdCode()
		},
		destroyed() {
			let that=this;
			window.removeEventListener('resize', function(){
				that.height=(document.documentElement.clientHeight).toFixed(2)+'px';
			})
		}
	}
</script>

<style scoped="scoped">
	body{margin: 0;padding: 0;}
	.login{width: 100%;height: 1000px; background: url(../assets/backg.jpg) no-repeat; background-size:cover;}
	.logink{width: 430px;background: rgba(144,217,255,0.4);box-shadow: 0 0 20px #000;
		padding: 15px 15px 45px;position: absolute;top: 50%;right: 20%;transform: translateY(-50%);}
    .title{font-size: 28px;color:#D7AC81;font-weight: bold; text-align:center;letter-spacing: 3px;}
	.iptitem{margin: 20px auto;}
	.labelusername{color: #FFFFFF;font-size:16px;font-weight: bold;width:60px ;text-align-last:justify;text-align:justify;
		text-justify:distribute-all-lines;}
	.mh{color: #FFFFFF;font-size:14px;margin-right: 20px;}
	.iptusername{width: calc(100% - 165px);height: 35px;color: #fff;line-height: 35px;padding-left: 10px;background: rgba(255,255,255,0.3);
		border: 1px solid #D7AC81;box-sizing: border-box;font-size: 16px}
	.itemyzm{width: calc(100% - 165px);height: 37px;}
	.iptyzm{height: 35px;color: #fff;line-height: 35px;padding-left: 10px; background: rgba(255,255,255,0.1);border: 1px solid #D7AC81;flex: 3;
		margin-right: 10px;font-size: 16px;width: 70%;overflow: hidden;}
	.login .yzmtxt{font-size: 14px;background: rgba(255,255,255,0.7);height: 100%;flex: 2.5;overflow: hidden;}
	.iptsubmit{width: 85%;display: block;margin: 0 auto;height:38px;line-height: 38px;border:1px solid #D7AC81;background: rgba(215, 172, 129,0.8);
		color: #FFFFFF;outline: none;font-size: 16px}
	.ValidCode{
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	.ValidCode span{
	    display: inline-block;
		font-size: 20px;
	}
</style>