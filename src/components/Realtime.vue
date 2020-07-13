<template>
	<div class="realtime fleximg">
		<div class="left">
			<div class="listtxt">设备列表</div>
			<div class="listcon">
				<div class="mechineitem" v-for="(item,index) in mechinelist" v-if="item.person">
					<div class="person flexl" @click="ispull(index)">
						<div class="fleximg imgmore" v-if="item.pull==false">
							<img src="../assets/more.png" />
						</div>
						<div class="fleximg imgmore" v-else="item.pull==false">
							<img src="../assets/no.png" />
						</div>
						<div class="persontxt" v-if="item.person=='我的'">
							{{item.person}}设备
						</div>
						<div class="persontxt" v-else="item.person=='我的'">
							{{item.person}}共享的设备
						</div>
					</div>
					<div v-for="(itemson,indx) in item.data" class="flexl mechine" :class="[item.pull==false?'mechineno':'',itemson.active?'mechineactive':'']" @click="isactive(index,indx)">
						<div class="liststate" :class="itemson.state?'liststateno':''"></div>
						<div class="mechinename">
							{{itemson.name}}
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="right ">
			<div class="righttop">最新更新数据</div>
			<div class="mechinedata flexa">
				<div class="dataitem">
					<div class="dataname">设备名称</div>
					<div class="datatxt">{{mechinelist[idx].data[indx].name}}</div>
				</div>
				<div class="dataitem">
					<div class="dataname">凝冰厚度</div>
					<div class="datatxt">{{icedata.ice}}</div>
				</div>
				<div class="dataitem">
					<div class="dataname">温度</div>
					<div class="datatxt">{{icedata.tem}}</div>
				</div>
				<div class="dataitem">
					<div class="dataname">湿度</div>
					<div class="datatxt">{{icedata.hum}}</div>
				</div>
				<div class="dataitem">
					<div class="dataname">测量时间</div>
					<div class="datatxt datatime">{{icedata.time}}</div>
				</div>
			</div>
			<div class="icechartitem flexl">
				<div id='icechart' style="height: 80%;width: 80%;"></div>
				<div class="demo-image__preview" style="height: 20%;width: 20%; padding-right: 15px;box-sizing: border-box;"
					v-if="imgshow">
					<div style="text-align: center;margin: 10px auto;font-size: 15px;">{{imgindex}}:00</div>
				  <el-image 
				    style="width: 100%;"
				    :src="chartdata[imgindex].img" 
				    :preview-src-list="[chartdata[imgindex].img]"
				    fit='contain'
				    @error='imgerror'>
				    <div class="noimg" slot="error" slot-scope="slot"> 暂无数据</div>
				  </el-image>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Realtime',
		props: ['inx'],
		data() {
			return {
				mechinelist: [],//设备列表
				idx:0,//初始选中的设备第1层下标
				indx:0,//初始选中的设备第2层下标
				myChart:null,
				icedata:{},//最新数据
				imgindex:0,//要展示的图片在列表中的下标
				chartdata:[],//chart数据
				imgshow:false,//图片是否显示（根据的是图片组件自己的加载失败事件来的）
			}
		},
		methods: {
			imgerror(){
				this.imgshow=false
			},
			ispull(index) {
				let list = JSON.parse(JSON.stringify(this.mechinelist));
				list[index].pull = !list[index].pull
				this.mechinelist = list
			},
			//设备是否是选中的状态，以及选中后对地图要做的操作
			isactive(index, indx) {	
				let that=this
				let list = JSON.parse(JSON.stringify(this.mechinelist));
				list[this.idx].data[this.indx].active = false
				list[index].data[indx].active = true
				this.mechinelist = list;
				console.log(list[index].data[indx])
				this.idx=index;
				this.indx=indx;
				this.setOptions(index,indx);
				this.newest(index,indx)
			},
			//初始化chart和第一次传入数据
			initmychart(index,indx){
        // 基于准备好的dom，初始化echarts实例
        this.myChart = this.$echarts.init(document.getElementById('icechart'))
        // 绘制图表
        this.setOptions(index,indx)
			},
			//获取当前active项的最新数据
			newest(index,indx){
				let list = JSON.parse(JSON.stringify(this.mechinelist));
				let data={equipmentId:list[index].data[indx].id},that=this;
				const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
				this.$http.post(this.global.domainurl + '/icecondensation/equipment/getEquipmentValueById',data).then(function(res) {
					 loading.close();
					console.log(res)
					if(res.data.success){
						that.icedata=res.data.result
					}
				}).catch(function(error) {
					 loading.close();
					console.log(error)
				})
			},
			setOptions(index,indx){
				let that=this,tems=[],hums=[],ices=[];
				let list = JSON.parse(JSON.stringify(this.mechinelist));
				this.$http.post(that.global.domainurl + '/icecondensation/equipment/getLine',{eid:list[index].data[indx].eid}).then(function(res) {
					console.log(res)
					let val=res.data.result;
					that.chartdata=val;
					console.log(that.chartdata)
					for(let i=0;i<val.length;i++){
						let m=i
						tems.push(parseInt(val[m].tem));
						hums.push(parseInt(val[m].hum))
						ices.push(parseInt(val[m].ice))
					}
					that.myChart.setOption({
	        	tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'cross',
								crossStyle: {
									color: '#999'
								}
							}
						},
						title: {
							show: !val[0].hum,
							extStyle: {
								color: "grey",
					  		fontSize: 20
					 		},
					  	text: "暂无数据",
					  	left: "center",
					  	top: "center"
					  },
						legend: {
		          data: ['凝冰厚度', '温度','湿度']
		        },
						xAxis: {
							type: 'category',
	//						axisTick: {length:5},
							axisLabel : {//坐标轴刻度标签的相关设置。
		            rotate:"45"
		          },
							boundaryGap: false,
	          axisTick: {
	            show: true
	          },
		          data: ['0:00','1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00']
			      },
		        yAxis: {
		      	  scale: true
		        },
		        series: [
		        {
		          name: '凝冰厚度',
		          type: 'line',
		          data: ices
		        },
		        {
		          name: '温度',
		          type: 'line',
		          data: tems
		        },
		        {
		          name: '湿度',
		          type: 'line',
		          data: hums
		        }]
	        });
		    	window.onresize = that.myChart.resize;
		    	that.myChart.on('click',function(params){
					    console.log(params.dataIndex);
					    that.imgindex=params.dataIndex
					    that.imgshow=true
					    console.log(that.imgindex);
					});
				}).catch(function(error) {
					console.log(error)
				})
			}
		},
		beforeCreate() {
			if(this.inx){
				
				console.log(this.inx)
				this.idx=this.inx[0]
				this.indx=this.inx[1]
			}
		},
		mounted() {
			let that = this;
			if(this.inx){
				
				console.log(this.inx)
				this.idx=this.inx[0]
				this.indx=this.inx[1]
			}
			//一来就请求到设备列表
			this.$http.get(that.global.domainurl + '/icecondensation/equipment/getEquipmentListByUsername').then(function(res) {
				let list = JSON.parse(JSON.stringify(res.data.result.list))
				//给列表加上是否下拉状态，和每个设备加上是否选中状态
				for(let i = 0; i < list.length; i++) {
					if(list[i].person) {
						//给列表添加上是否下拉的键值对，刚开始是全部拉开的
						list[i].pull = true
						for(let j = 0; j < list[i].data.length; j++) {
							list[i].data[j].active = false
							list[that.idx].data[that.indx].active = true
						}
					}
				}
				that.mechinelist = list
				//等组件创建完后开始做地图的事
				that.$nextTick(function() {
					that.initmychart(that.idx,that.indx)
					that.newest(that.idx,that.indx)
				})
			}).catch(function(error) {
				console.log(error)
			})
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
	.realtime {box-sizing: border-box;height: calc(100% - 1rem);padding: 0.2rem;}
	.left {flex: 1.8;height: 100%;overflow: scroll;white-space: nowrap;border: 1px solid #eee;
		margin: 0 0.15rem 0 0;box-sizing: border-box;border-radius: 0.06rem;}
	.right {flex: 9;height: 100%;white-space: nowrap;box-sizing: border-box;border-radius: 0.06rem;
		box-shadow: 3px 3px 6px 2px rgba(0, 0, 0, 0.3);}
	::-webkit-scrollbar {width: 0 !important;height: 0;}
	.listtxt {color: #FFFFFF;background: #0397D7;height: 0.8rem;line-height: 0.8rem;font-size: 0.3rem;
		text-align: center;font-weight: bold;border-radius: 0.06rem;}
	/* list样式 */
	.listcon {height: calc(100% - 1rem);padding-left: 0.2rem;}
	.mechineitem {color: #666666;}
	.person {margin: 0.2rem 0;}
	.persontxt {font-size: 0.22rem;}
	.imgmore {width: 0.18rem;margin-right: 0.15rem;}
	.mechine {padding-left: 0.6rem;height: 0.4rem;line-height: 0.4rem;opacity: 1;transition: all 0.5s;}
	.mechine:hover {background: rgba(0, 0, 0, 0.04)}
	.realtime .mechineactive {background: rgba(0, 0, 0, 0.1)}
	.liststate {width: 0.14rem;height: 0.14rem;background: #95F204;border-radius: 50%;margin-right: 0.05rem;}
	.liststateno {background: #D7D7D7;}
	.mechinename {font-size: 0.20rem;}
	.mechineno {height: 0;opacity: 0;}
	.righttop{height: 1rem;line-height: 1rem;text-align: left;font-size: 0.3rem;padding-left: 0.4rem;
		font-weight: bold;color: #333333;border-bottom: 1px solid #eee;box-sizing: border-box;}
	.dataname {font-size: 0.2rem;}
	.datatxt {font-size: 0.3rem;}
	.mechinedata {height: 1.1rem;margin: 0 0 0.1rem 0;border-bottom: 1px solid #eee;box-sizing: border-box;}
	.datatime {font-size: 0.22rem}
	.icechartitem{width: 100%;height: calc(100% - 2.2rem);}
	.noimg{display: flex;-webkit-box-pack: center;-ms-flex-pack: center;justify-content: center;-webkit-box-align: center;
    -ms-flex-align: center;align-items: center;font-size: 14px;color: #C0C4CC;vertical-align: middle;width: 100%;
    background: #F5F7FA;height: 100%;}
</style>