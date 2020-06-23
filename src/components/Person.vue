<template>
	<div class="person">
		<div class="flexl">
			<div class="persondata" :class="active==0?'active':''" @click="changeactive(0)">个人信息</div>
			<div class="persondata" :class="active==1?'active':''" @click="changeactive(1)">修改密码</div>
		</div>
		<div class="personcont" v-if="active==0">
			<div class="flexl iptitem">
				<div class="label">用户名：</div>
				<input type="text" v-model="userinfo.username" disabled="disabled"/>
			</div>
			<div class="flexl iptitem">
				<div class="label">真实姓名：</div>
				<input type="text" v-model="userinfo.realname" disabled="disabled"/>
			</div>
			<div class="flexl iptitem">
				<div class="label">电话号码：</div>
				<input type="tel" v-model="userinfo.phone" maxlength="11"/>
			</div>
			<div class="btnsure" @click="telsure">确定</div>
		</div>
		<div class="personcont" v-if="active==1">
			<div class="flexl iptitem">
				<div class="label"><span class="xx">*</span>旧密码：</div>
				<input type="password" v-model="oldpswd" placeholder="请输入旧密码" maxlength="16"/>
			</div>
			<div class="flexl iptitem">
				<div class="label"><span class="xx">*</span>新密码：</div>
				<input type="password" v-model="newpswd" placeholder="请输入新密码" maxlength="16"/>
				<div class="pswd">密码为最少6位最多16位数字或者字母或者两者的组合</div>
			</div>
			<div class="flexl iptitem">
				<div class="label"><span class="xx">*</span>确认新密码：</div>
				<input type="password" v-model="newpswda" placeholder="确认新密码" maxlength="16"/>
			</div>
			<div class="btnsure" @click="pswdsure">确定</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Realtime',
		data() {
			
			return {
				active:0,
				userinfo:{},
				oldpswd:'',
				newpswd:'',
				newpswda:''
			}
		},
		methods: {
			changeactive(num){
				this.active=num
			},
			telsure(){
				let value=this.userinfo.phone,that=this;
				console.log(value)
				if(!value){
					this.$alert('请输入电话号码', '错误提示', {
	          confirmButtonText: '确定'
	        });
				}else if(value.length!==11){
					this.$alert('电话号码位数不够', '错误提示', {
	          confirmButtonText: '确定'
	        });
				}else if(!(/^[1][345789]\d{9}$/).test(value)){
					this.$alert('手机号码不符合规范', '错误提示', {
	          confirmButtonText: '确定'
	        });
				}else{
					this.$confirm('是否确认保存电话号码', '确认信息', {
	          distinguishCancelAndClose: true,
	          confirmButtonText: '确认',
	          cancelButtonText: '取消'
	        })
	        .then(() => {
						let loading = this.$loading({
		          lock: true,
		          text: 'Loading',
		          spinner: 'el-icon-loading',
		          background: 'rgba(0, 0, 0, 0.7)'
		        });
		        let data={phone:that.userinfo.phone}
		      	this.$http.post(this.global.domainurl + '/icecondensation/user/updatePhone',data).then(function(res) {
		      		console.log(res)
							 loading.close();
							if(res.data.success){
								that.$message({
									type: 'success',
									message: '保存成功'
								});
							}else{
								that.$alert(res.data.message, '错误提示', {
				          confirmButtonText: '确定'
				        });
							}
						}).catch(function(error) {
							 loading.close();
							console.log(error)
						})
	        })
				}
			},
			pswdsure(){
				let that=this;
				console.log(this.oldpswd,this.newpswd,this.newpswda)
				if(!this.oldpswd){
					this.$alert('请输入旧密码', '错误提示', {
	          confirmButtonText: '确定'
	        });
				}else if(!this.newpswd){
					this.$alert('请输入新密码', '错误提示', {
	          confirmButtonText: '确定'
	        });
				}else if(!this.newpswda){
					this.$alert('请确认新密码', '错误提示', {
	          confirmButtonText: '确定'
	        });
				}else if(this.newpswd.length<6){
					this.$alert('新密码的位数不能低于6位', '错误提示', {
	          confirmButtonText: '确定'
	        });
				}else if(!(/^[A-Za-z0-9]+$/).test(this.newpswd)){
					this.$alert('只能填写英文或者数字', '错误提示', {
	          confirmButtonText: '确定'
	        });
				}else if(this.newpswd !== this.newpswda){
					this.$alert('两次输入密码不一致', '错误提示', {
	          confirmButtonText: '确定'
	        });
				}else{
					this.$confirm('是否确认修改密码', '确认信息', {
	          distinguishCancelAndClose: true,
	          confirmButtonText: '确认',
	          cancelButtonText: '取消'
	        })
	        .then(() => {
						let loading = this.$loading({
		          lock: true,
		          text: 'Loading',
		          spinner: 'el-icon-loading',
		          background: 'rgba(0, 0, 0, 0.7)'
		        });
		        let data={oldPassword:that.oldpswd,newPassword:that.newpswd}
		      	this.$http.post(this.global.domainurl + '/icecondensation/user/updatePassword',data).then(function(res) {
		      		console.log(res)
							 loading.close();
							if(res.data.success){
								that.$message({
									type: 'success',
									message: res.data.message
								});
								that.oldpswd='',
								that.newpswd='',
								that.newpswda=''
							}else{
								that.$alert(res.data.message, '错误提示', {
				          confirmButtonText: '确定'
				        });
							}
						}).catch(function(error) {
							 loading.close();
							console.log(error)
							that.oldpswd='',
							that.newpswd='',
							that.newpswda=''
						})
	        })
				}
			}
		},
		mounted() {
			this.userinfo=JSON.parse(localStorage.getItem('userinfo')) 
		},
		beforeCreate: function() {

		},
		beforeMount: function() {

		},
		created: function() {
			
		},
		destroyed: function() {

		}
	}
</script>

<style scoped="scoped">
	.person{overflow: scroll;height: calc(100% - 1rem);background: #ECF0F5;padding: 2%;}
	.persondata{padding: 0.1rem 0.4rem;background: #001529;color: #FFFFFF;border-top-left-radius: 0.1rem;border-top-right-radius: 0.1rem;
		margin-right: 0.08rem;font-size: 0.14rem}
	.active{background:#00A57C;}
	.personcont{padding: 1rem 2.5rem;background: #FFFFFF;box-sizing: border-box;margin: 0 auto;}
	.label{width: 1.5rem;text-align: right;margin-right: 0.2rem;font-size: 0.16rem;color: #666666;}
	input{width: 5rem;height: 0.45rem;padding-left: 0.2rem;border: 1px solid #bbbbbb;outline:none ;}
	.iptitem{margin: 0.4rem 0;}
	.btnsure{color: #FFFFFF;font-size: 0.2rem;padding: 0.1rem 0;background: #001529;border-radius: 0.04rem;margin: 0.7rem 0 0.5rem 2.5rem;
		width: 0.8rem;text-align: center;}
	.pswd{color: #AAAAAA;font-size: 0.12rem;margin-left: 0.1rem;width:2.5rem;}
	.xx{color: red;font-size: 0.12rem;margin-right: 0.04rem;}
</style>
