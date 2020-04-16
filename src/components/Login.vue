<template>
	<div class="login" :style="'height:'+height">
		<div class="logink">
			<div class="title">凝冰监测平台</div>
			<form action="">
				<div class="fleximg iptitem">
					<label for="username" class="labelusername" >用户名</label><span class="mh">：</span>
					<input type="text" id="username" class="iptusername"  maxlength="20" v-model="loginform.username">					
				</div>
				<div class="fleximg iptitem">
					<label for="password" class="labelusername">密码</label><span class="mh">：</span>
					<input type="password" id="password" class="iptusername"  maxlength="20" v-model="loginform.password">
				</div>
				<div class="fleximg iptitem">
					<label for="yzm" class="labelusername ">验证码</label><span class="mh">：</span>
					<div class="itemyzm flexl">
						<input type="text" id="yzm" class="iptyzm" maxlength="4" v-model="loginform.passcode">
						<div class="yzmtxt ValidCode fleximg" @click="refreshCode">
							<span v-for="(item, index) in codeList" :key="index" :style="getStyle(item)">{{item.code}}</span>
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
				loginform:{
					username:'',
					password:'',
					passcode:''
				}
			}
		},
		beforeMount(){
			this.height=(document.documentElement.clientHeight).toFixed(2)+'px';
		},
		methods: {
			refreshCode () {
			  this.createdCode()
			},
			createdCode () {
			  let len = this.length,
				codeList = [],
				chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789',
				charsLen = chars.length
			  // 生成
			  for (let i = 0; i < len; i++) {
				let rgb = [Math.round(Math.random() * 200), Math.round(Math.random() * 180), Math.round(Math.random() * 160)]
				codeList.push({
				  code: chars.charAt(Math.floor(Math.random() * charsLen)), // 随机码
				  color: `rgb(${rgb})`, // 随机颜色
				  // fontSize: `1${[Math.floor(Math.random() * 10)]}px`, // 随机字号
				  padding: `${[Math.floor(Math.random() * 10)]}px`, // 随机内边距
				  transform: `rotate(${Math.floor(Math.random() * 50) - Math.floor(Math.random() * 50)}deg)` // 随机旋转角度
				})
			  }
			  // 指向
			  this.codeList = codeList
			  // 将当前数据派发出去
			  this.$emit('update:value', codeList.map(item => item.code).join(''))
			},
			// 动态绑定样式
			getStyle (data) {
			  return `color: ${data.color}; padding: ${data.padding}; transform: ${data.transform}`
			},
			loginsubmit(){
				console.log(this.loginform)
				if(1){
					localStorage.setItem('islogin',true)
					console.log('tohome')
					this.$router.push({
						path:'/home'
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