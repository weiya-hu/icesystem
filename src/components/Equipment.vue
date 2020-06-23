<template>
	<div class="cont">
		<div class="equipment">
			<div class="addnew" @click="addequip">+ 新增设备</div>
			<div class="equip flexll" v-for="(item,index) in list">
				<div class="equipson flexll">
					<div class="imgequip fleximg">
						<img src="../assets/equip.png"/>
					</div>
					<div class="equipdata">
						<div>设备编号：{{item.eid}}</div>
						<div>地址：{{item.address}}</div>
						<div>安装时间：{{item.installTime}}</div>
						<div>设备所属：{{item.company}}</div>
						<div v-if='item.shareInfo.length' class="flexl">共享给其他管理者：
							<div class="lookshare sharelistitempre ">查看
								<div class="sharelistitem">
									<div v-for="(itemshare,index) in item.shareInfo" class="flex">
										<div>{{itemshare.realname}}</div>
										<div class="cancelshare" @click="cancelshare(itemshare,item)">删除</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="btn flexa">
					<div @click="edit(item)">修改</div>
					<div @click="cancell(item)">删除</div>
					<div @click="shareequip(item)">共享</div>
				</div>
			</div>
		</div>
		<div class="addmodel" @click="addshow" v-if="isaddshow">
			<div class="addcontent" @click.stop='stopmp'>
				<!--<el-form ref="form" :model="form" label-width="80px">-->
				<div class="toptitle flex">
					<div>{{addoredittxt}}设备</div>
					<div @click="addshow('add')">+</div>
				</div>
				<div class="botbt flexr">
					<div @click="addsure" v-if="addoredittxt=='新增'">确定</div>
					<div @click="editsure" v-if="addoredittxt=='修改'" >确定</div>
					<div @click="addshow">取消</div>
				</div>
				<div class="inptitem fleximg">
					<label for="eid"><span>*</span>设备编号：</label>
					<div class="iptpre flexl">
						<input type="text" id="eid" v-model="form.eid" placeholder="请输入设备编号" :disabled="addoredittxt=='修改'?true:false"/>
					</div>
					<!--<el-form-item label="设备编号：" class='label'>
						<div class="iptpre flexl">
							<el-input v-model="form.eid" placeholder="请输入设备编号"></el-input>
						</div>
				  </el-form-item>-->
				</div>
				<div class="inptitem fleximg">
					<label for="eid"><span>*</span>设备地址：</label>
					<div class="iptpre flexl">
						<input type="text" id="eid" v-model="form.address" placeholder="请输入设备安装地址"/>
					</div>
				</div>
				<div class="inptitem fleximg">
					<label for="eid"><span>*</span>设备安装时间：</label>
					<div class="iptpre flexl">
						<!--<input type="text" id="eid" v-model="form.install_time" placeholder="请输入设备安装时间"/>-->
						<el-date-picker class='iptel' v-model="form.install_time" type="datetime" placeholder="请选择日期时间" value-format='yyyy-MM-dd HH:mm:ss'>
						</el-date-picker>
					</div>
				</div>
				<div class="inptitem fleximg">
					<label for="eid"><span>*</span>设备所属公司或机构：</label>
					<div class="iptpre flexl">
						<input type="text" id="eid" v-model="form.company" placeholder="请输入设备所属公司或机构"/>
					</div>
				</div>
				<!--</el-form>-->
			</div>
		</div>
		<div class="addmodel" v-if='sharemodelshow' @click="shareshow">
			<div class="addcontent sharelist" @click.stop='stopmp'>
				<!--<el-form ref="form" :model="form" label-width="80px">-->
				<div class="toptitle flex">
					<div>分享设备</div>
					<div @click="shareshow">+</div>
				</div>
				<div class="botbt flexr">
					<div @click="sharesure">确定</div>
					<div @click="shareshow">取消</div>
				</div>
				<div class="fleximg">
					<div>分享给：</div>
					<el-autocomplete v-model="sharename" :clearable='trues' :fetch-suggestions="querySearchAsync" placeholder="请输入共享者姓名" @select="handleSelect"></el-autocomplete>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Homemap',
		data() {
			return {
				sharemodelshow:false,//共享model是否显示
				sharename:'',//共享者姓名
				trues:true,//共享人输入框可清空boolean值
				selectshare:{},//被选中共享的人的相关信息
				list:[],//设备列表
				isaddshow:false,
				form:{
					eid:'',
					address:'',
					install_time:'',
					company:''
				},
				addoredittxt:'',//区分增加修改的确认键是新增还是修改，因为两个用的一个模态框,取值有add和edit
				equipitem:{},//点击要修改的设备
				shareitem:{},//点击要共享给其他人的设备
			}
		},
		methods: {
			//获取设备列表
			getlist(){
				let that=this;
				let loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
				this.$http.get(this.global.domainurl + '/icecondensation/equipment/myEquipmentList').then(function(res) {
					 loading.close();
					 console.log(res)
					if(res.data.success){
						that.list=res.data.result
					}
				}).catch(function(error) {
					 loading.close();
					console.log(error)
				})
			},
			addequip(){
				console.log(45646)
				this.addshow('add')
			},
			addshow(m){
				console.log(m)
				if(m=='add'){
					this.addoredittxt='新增'
					this.form={
						eid:'',
						address:'',
						install_time:'',
						company:''
					}
				}else if(m=='edit'){
					this.addoredittxt='修改'
				}else{
					this.addoredittxt=''
				}
				this.isaddshow=!this.isaddshow
			},
			//阻止冒泡
			stopmp(){},
			//分享设备
			shareequip(item){
				console.log(item)
				this.shareitem=item;
				this.sharemodelshow=!this.sharemodelshow
			},
			shareshow(){
				this.sharemodelshow=!this.sharemodelshow
			},
			//分享确定
			sharesure(){
				let data={id :this.shareitem.id ,username:this.sharename },that=this;
      	let loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      	this.$http.post(this.global.domainurl + '/icecondensation/equipment/shareEquipment',data).then(function(res) {
      		console.log(res)
					loading.close();
					if(res.data.success){
						that.$message({
							type: 'success',
							message: '共享成功!'
						});
						that.getlist()
					}else{
						that.$alert(res.data.message, '错误提示', {
		          confirmButtonText: '确定'
		        });
					}
				}).catch(function(error) {
					 loading.close();
					console.log(error)
				})
				this.shareshow()
			},
			handleSelect(item) {
				console.log(item)
        this.selectshare=item
      },
      //删除共享人
      cancelshare(user,equip){
      	let data={shareUserId:user.id,id:equip.id},that=this;
      	this.$confirm(equip.eid+'号设备是否确认删除共享人 ：'+user.realname, '确认信息', {
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
	      	this.$http.post(this.global.domainurl + '/icecondensation/equipment/deleteShare',data).then(function(res) {
	      		console.log(res)
						 loading.close();
						if(res.data.success){
							that.$message({
								type: 'success',
								message: '删除成功!'
							});
							that.getlist()
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
      	
      },
			querySearchAsync(queryString, cb) {
        let data={param:''},that=this,list=[];
      	if(queryString.length){
      		console.log(queryString)
      		data={param:queryString}
      	}
      	let loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      	this.$http.post(this.global.domainurl + '/icecondensation/user/getUserByParam',data).then(function(res) {
      		console.log(res)
					 loading.close();
					if(res.data.success){
						list=JSON.parse(JSON.stringify(res.data.result)) 
						for(let i=0;i<list.length;i++){
							list[i].value=list[i].realname
						}
						cb(list);
					}
				}).catch(function(error) {
					 loading.close();
					console.log(error)
				})
      },
			//添加设备确定
			addsure(){
				let that=this;
				console.log(this.form)
				if(!this.form.eid) {
					this.$alert('请输入设备编号!', '错误提示', {
						confirmButtonText: '确定'
					});
					return false
				}
				if(!this.form.address) {
					this.$alert('请输入设备安装地址!', '错误提示', {
						confirmButtonText: '确定'
					});
					return false
				}
				if(!this.form.install_time) {
					this.$alert('请输入设备安装时间!', '错误提示', {
						confirmButtonText: '确定'
					});
					return false
				}
				if(!this.form.company) {
					this.$alert('请输入设备所属公司或机构!', '错误提示', {
						confirmButtonText: '确定'
					});
					return false
				}
				//若都填了就向服务器传输设置的数据
				let data={
					"eid" : this.form.eid,
					"address" : this.form.address,
					"company" : this.form.company,
					"install_time":this.form.install_time
				}
				let loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
				this.$http.post(this.global.domainurl + '/icecondensation/equipment/add',data).then(function(res) {
					 loading.close();
					 console.log(res)
					if(res.data.success){
						that.$message({
							type: 'success',
							message: '添加设备成功!'
						});
						that.form={eid:'',address:'',install_time:'',company:''}
						that.addshow();
						that.getlist()
					}else{
						that.$alert(res.data.message, '错误提示', {
		          confirmButtonText: '确定'
		        });
					}
				}).catch(function(error) {
					 loading.close();
					console.log(error)
				})
				return true
			},
			//删除设备
			cancell(item){
				console.log(item)
				let data={
					"equipmentId":item.id
				},that=this;
				this.$confirm('是否确认删除此设备', '确认信息', {
	          distinguishCancelAndClose: true,
	          confirmButtonText: '确认',
	          cancelButtonText: '取消'
	        })
          .then(() => {
						let loading = that.$loading({
		          lock: true,
		          text: 'Loading',
		          spinner: 'el-icon-loading',
		          background: 'rgba(0, 0, 0, 0.7)'
		        });
						that.$http.post(this.global.domainurl + '/icecondensation/equipment/del',data).then(function(res) {
							 loading.close();
							 console.log(res)
							if(res.data.success){
								that.$message({
									type: 'success',
									message: '成功删除设备!'
								});
								that.getlist()
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

			},
			//修改设备
			edit(item){
				this.addshow('edit')
				let form={eid:item.eid,address:item.address,install_time:item.installTime,company:item.company}
				this.form=form;
				this.equipitem=item;
			},
			//修改设备确定
			editsure(){
				let that=this;
				console.log('确认修改')
				if(!this.form.eid) {
					this.$alert('请输入设备编号!', '错误提示', {
						confirmButtonText: '确定'
					});
					return false
				}
				if(!this.form.address) {
					this.$alert('请输入设备安装地址!', '错误提示', {
						confirmButtonText: '确定'
					});
					return false
				}
				if(!this.form.install_time) {
					this.$alert('请输入设备安装时间!', '错误提示', {
						confirmButtonText: '确定'
					});
					return false
				}
				if(!this.form.company) {
					this.$alert('请输入设备所属公司或机构!', '错误提示', {
						confirmButtonText: '确定'
					});
					return false
				}
				//若都填了就向服务器传输设置的数据
				let data={
					"id":this.equipitem.id,
					"eid" : this.form.eid,
					"address" : this.form.address,
					"company" : this.form.company,
					"installTime":this.form.install_time
				}
				let loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
				this.$http.put(this.global.domainurl + 'icecondensation/equipment/edit',data).then(function(res) {
					 loading.close();
					 console.log(res)
					if(res.data.success){
						that.$message({
							type: 'success',
							message: '修改成功!'
						});
						that.form={eid:'',address:'',install_time:'',company:''}
						that.addshow();
						that.getlist()
					}else{
						that.$alert(res.data.message, '错误提示', {
		          confirmButtonText: '确定'
		        });
					}
				}).catch(function(error) {
					 loading.close();
					console.log(error)
				})
				return true
			}
		},
		mounted:function(){
			this.getlist()
		},
		beforeCreate: function() {
			console.log('equipment')
		},
		beforeMount: function() {

		},
		created: function() {

		},
		destroyed: function(){

		}
	}
</script>

<style scoped="scoped">
	.cont{overflow: scroll;height: calc(100% - 1rem);}
	.equipment{display: flex;justify-content: flex-start;align-content: center;flex-wrap: wrap;margin: 0 auto;}
	.addnew{width: 5rem;height:2.8rem ;border: 1px dashed #AAAAAA;color: #aaaaaa;font-size: 0.18rem;
		text-align: center;line-height: 2.8rem;border-radius: 0.06rem;box-sizing: border-box;margin: 0.3rem;}
	.equip{width: 5rem;height:2.8rem ;box-shadow: 0 0 5px rgba(0,0,0,0.3);margin: 0.3rem;position: relative;
		padding: 0.2rem;background: #FFFFFF;box-sizing: border-box;}
	.equipson{}
	.imgequip{width: 0.5rem;height: 0.5rem;border-radius: 50%;overflow: hidden;padding: 0.1rem;
		box-shadow: 0 0 5px rgba(0,0,0,0.3);background: #FFFFFF;margin-right: 0.2rem;}
	.btn{position: absolute;bottom: 0;left: 0;width: 100%;box-sizing: border-box;padding: 0.2rem 0;
		border-top: 1px solid #EEEEEE;}
	.btn>div{color: #999999;font-size: 0.2rem;padding: 0 0.6rem;}
	.btn>div:nth-child(2){border-right: 1px solid #EEEEEE;border-left: 1px solid #EEEEEE;}
	.equipdata>div:nth-child(1){font-size: 0.24rem;color: #333333;}
	.equipdata>div:nth-child(2){width: 80%;font-size: 0.18rem;color: #666666;overflow: scroll;margin: 0.1rem 0;}
	.equipdata>div:nth-child(3){font-size: 0.18rem;color: #666666;margin: 0.1rem 0;}
	.equipdata>div:nth-child(4){font-size: 0.18rem;color: #666666;margin: 0.1rem 0;}
	.equipdata>div:nth-child(5){font-size: 0.12rem;color: #666666;}
	::-webkit-scrollbar {width: 0 !important;height: 0;}
	.addmodel{width: 100%;height: 100%;position: fixed;top: 0;left: 0;background: rgba(0,0,0,0.2);z-index: 7;}
	.addcontent{width: 10rem;height: 5rem;background: #FFFFFF;position: absolute;top: 50%;left: 50%;padding: 0.7rem 0.2rem 0.9rem;
		transform: translateX(-50%) translateY(-50%);background: #ECF0F5;overflow: scroll;z-index: 6;box-sizing: border-box;
		display: flex;flex-direction: column;justify-content: center;align-items: center;}
	.toptitle{width: 100%;height: 0.6rem;background: #23232D;position: absolute;top: 0;left: 0;padding: 0 0.3rem;
		box-sizing: border-box;}
	.toptitle>div:nth-child(1){color: #FFFFFF;font-size: 0.2rem;}
	.toptitle>div:nth-child(2){color: #FFFFFF;font-size: 0.4rem;transform: rotate(45deg);}
	.botbt{width: 100%;height: 0.8rem;background: #FFFFFF;padding: 0 0.3rem;box-sizing: border-box;
		position: absolute;bottom: 0;left:0;z-index: 7;}
	.botbt>div{font-size: 0.2rem;padding: 0.1rem 0.2rem;border-radius: 0.04rem;}
	.botbt>div:nth-child(1){background: #47474E;color: #FFFFFF;}
	.botbt>div:nth-child(2){background: #F2F2F2;color: #333333;margin-left: 0.2rem;}
	.botbt>div:nth-child(2):hover{color: #E16B69;}
	.inptitem{width: 100%;}
	span{color: #E16B69;font-size: 0.14rem}
	label,.label{width: 30%;text-align: right;padding-right: 0.2rem;background: #F5F5F5;height: 0.7rem;line-height: 0.7rem;
		box-sizing: border-box;color: #676767;font-size: 0.16rem}
	.iptpre{width: 70%;height: 0.7rem;background: #FFFFFF;padding: 0.1rem;box-sizing: border-box;}
	input{width: 100%;height: 100%;outline: none;border: 1px solid #EEEEEE;padding-left: 0.1rem;
		box-sizing: border-box;color: #333333;font-size: 0.16rem}
	.iptel{width: 100%;height: 100%;}
	.sharelist{height: 4rem;}
	.lookshare{border: 1px solid #EEEEEE;border-radius: 2px;color: #333333;position: relative;width: 0.4rem;padding: 0.02rem 0;text-align: center;}
	.sharelistitem{background: #FFFFFF;color: #666666;opacity: 0;position: absolute;top: 0;left:0.5rem;width: 1.5rem;z-index: 6;
		max-height: 2rem;overflow: scroll;border: 1px solid #EEEEEE;transition: all 0.3s linear;box-shadow: 0 0 10px 2px rgba(0,0,0,0.3);
		border-radius: 0.04rem;}
	.sharelistitem>div{padding: 0 0.1rem;border-bottom: 1px solid #EEEEEE;text-align: left;height: 0;line-height: 0.3rem;transition: all 0.3s linear;}
	.sharelistitempre:hover>.sharelistitem{opacity: 1;}
	.sharelistitempre:hover>.sharelistitem>div{opacity: 1;height: 0.3rem;}
	.cancelshare{text-decoration: underline;cursor: pointer;}
</style>