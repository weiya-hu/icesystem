<template>
	<div class="history">
		<div class="select flexl">
			<div class="equiptname flexl">
				<div class="equiptnametxt">设备名称:</div>
		    <el-autocomplete v-model="state" :clearable='trues' :fetch-suggestions="querySearchAsync" placeholder="请输入设备名称" @select="handleSelect"></el-autocomplete>
			</div>
			<div class="dateitem flexl">
				<div class="equiptnametxt">选择日期:</div>
		    <el-date-picker v-model="timevalue" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 6rem;">
				</el-date-picker>
			</div>
			<div class="find" @click="find">查询</div>
			<div class="reset" @click="resetselect">重置</div>
		</div>
		<div class="list">
			<div class="title flexa">
				<div class="titletxt" style="flex: 1;">设备名称</div>
				<div class="titletxt" style="flex: 1;">凝冰数据</div>
				<div class="titletxt" style="flex: 1;">温度数据</div>
				<div class="titletxt" style="flex: 1;">湿度数据</div>
				<div class="titletxt" style="flex: 1;">采集点图像</div>
				<div class="titletxt" style="flex: 1;">测量时间</div>
			</div>
			<div class="flexa equipdataitem" v-if="equiplist.length" v-for='(item,index) in equiplist'>
				<div class="datatxt" style="flex: 1;">{{item.name?item.name:'--'}}</div>
				<div class="datatxt" style="flex: 1;">{{item.ice?item.ice:'--'}}mm</div>
				<div class="datatxt" style="flex: 1;">{{item.tem?item.tem:'--'}}℃</div>
				<div class="datatxt" style="flex: 1;">{{item.hum?item.hum:'--'}}RH(%)</div>
				<div class="datatxt imgactive" style="flex: 1;" v-if='item.img' @click="showimg(item.img)">查看图像</div>
				<div class="datatxt" style="flex: 1;" v-if='!item.img'>无</div>
				<div class="datatxt" style="flex: 1;">{{item.create_time?item.create_time:'--'}}</div>
			</div>
			<div class="nodata" v-if="equiplist.length==0 && dataflag==false">--请选择条件查询--</div>
			<div class="nodata" v-if="equiplist.length==0 && dataflag==true">--未查询到结果--</div>
		</div>
		<div class="pagination flex" v-if="equiplist.length">
			<div class="totlenum">共{{totledatalist.total}}条记录</div>
			<el-pagination
	      @current-change="handleCurrentChange"
	      :current-page.sync="pageNo"
	      :page-size="totledatalist.size"
	      layout="prev, pager, next, jumper"
	      :total="totledatalist.total">
	    </el-pagination>
		</div>
		<div class="imageview fleximg" v-if='isshowimgflag' @click="isshowimg">
			<div class="img fleximg" @click.stop="stopmp">
				<img :src="showimgurl"/>
			</div>
			<div class="imgcha fleximg">
				<img src="../assets/cha.png"/>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Homemap',
		data() {
			return {
				state: '',//设备编号
				equipnamelist:[],//element组件设备名称模糊查询下拉列表
				timevalue: [],//时间选择结果
				equiplist:[],//查询到的历史数据
				pageNo:1,//查询的第几页
				selectequip:{},//选择的设备数据
				trues:true,//设备名称输入框可清空boolean值
				totledatalist:{},//查询到的历史数据包括页数等数据
				dataflag:false,//没有list是否是查询的原因
				showimgurl:'',//要展示的图片地址
				isshowimgflag:false,//图片查看是否显示
			}
		},
		mounted(){
		},
		methods: {
			querySearchAsync(queryString, cb) {
        let data={equipmentName:''},that=this,list=[];
      	if(queryString){
      		data={equipmentName:queryString}
      	}
      	let loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      	this.$http.post(this.global.domainurl + '/icecondensation/equipment/getEquipmentByUserIdAndName',data).then(function(res) {
					 loading.close();
					if(res.data.success){
						list=JSON.parse(JSON.stringify(res.data.result)) 
						for(let i=0;i<list.length;i++){
							list[i].value=list[i].name
						}
						that.equipnamelist=list
						cb(list);
					}
				}).catch(function(error) {
					 loading.close();
					console.log(error)
				})
      },
      //获取设备名列表
      handleSelect(item) {
        this.selectequip=item
      },
			find(pageNo){
				let data={
					pageNo:pageNo | this.pageNo,
					pageSize:10,
					beginTime:this.timevalue[0],
					endTime:this.timevalue[1],
					equipmentId:this.state?this.selectequip.id:0
				},that=this,list=[];
      	let loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      	this.$http.post(this.global.domainurl + '/icecondensation/equipment/getHistory',data).then(function(res) {
					 loading.close();
					if(res.data.success){
						that.equiplist=res.data.result.records
						that.totledatalist=res.data.result
						that.dataflag=res.data.result.records.length ? false: true
					}
				}).catch(function(error) {
					 loading.close();
					console.log(error)
				})
			},
			resetselect(){
				this.timevalue= [];
				this.state='';
				this.pageNo=1
			},
      handleCurrentChange(val) {
      	console.log(val)
				this.find(val)
				this.pageNo=val
      },
      showimg(imgurl){
      	this.showimgurl=imgurl;
      	this.isshowimg()
      },
      isshowimg(){
      	this.isshowimgflag=!this.isshowimgflag
      	console.log(this.isshowimgflag)
      },
      stopmp(){},
		},
		beforeCreate: function() {
			console.log('history')
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
	.history{padding: 0.3rem 0.4rem;overflow: scroll;height: calc(100% - 1rem);box-sizing: border-box;}
	.select{margin-bottom: 0.4rem;}
	.dateitem{margin: 0 0.4rem;}
	.equiptnametxt{font-size: 0.2rem;margin-right: 0.1rem;}
	.find{color: #FFFFFF;background: #188FFE;padding: 0.1rem 0.18rem;letter-spacing: 0.05rem;border-radius: 0.06rem;
		font-size: 0.20rem;margin-right: 0.4rem;}
	.reset{padding: 0.09rem 0.18rem;letter-spacing: 0.05rem;border-radius: 0.06rem;border: 1px solid #EEEEEE;box-sizing: border-box;
		font-size: 0.20rem}
	.title{background: #FAFAFA;height: 0.8rem;border: 1px solid #EEEEEE;border-radius: 0.06rem;}
	.titletxt{font-size: 0.24rem;font-weight: bold;text-align: center;}
	.nodata{width: 100%;font-size: 0.6rem;line-height: 3rem;text-align: center;color: #666666;}
	.datatxt{font-size: 0.24rem;text-align: center;color: #666666;}
	.equipdataitem{height: 0.8rem;border-bottom: 1px solid #EEEEEE;}
	.imgactive{color: #1890FF;}
	.pagination{margin: 0.2rem auto 0;font-weight: 400;color: #606266;}
	.totlenum{font-size: 13px;margin-left: 0.24rem;}
	.imageview{position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: rgba(0,0,0,0.6);}
	.img{width: 65%;}
	.imgcha{width: 0.5rem;position: absolute;top: 5%;right: 5%;}
</style>