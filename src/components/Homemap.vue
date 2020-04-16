<template>
	<div class="homemap fleximg">
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
					<div v-for="(itemson,indx) in item.data" class="flexl mechine" :class="[item.pull==false?'mechineno':'',itemson.active?'mechineactive':'']"
					 @click="isactive(index,indx)">
						<div class="liststate" :class="itemson.state?'liststateno':''"></div>
						<div class="mechinename">
							{{itemson.name}}
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="right">
			<div class="righttop fleximg">
				<div class="fleximg setitem">
					<div class="fleximg imgset"><img src="../assets/set.png" alt="设备总数"></div>
					<div class="settxt">
						<div class="setxtx">设备总数</div>
						<div class="setxtx">(10)</div>
					</div>
				</div>
				<div class="fleximg setitem onlineitem">
					<div class="fleximg imgset"><img src="../assets/gou.png" alt="设备总数"></div>
					<div class="settxt">
						<div class="setxtx">在线设备</div>
						<div class="setxtx">(7)</div>
					</div>
				</div>
				<div class="fleximg setitem offlineitem">
					<div class="fleximg imgset"><img src="../assets/gt.png" alt="设备总数"></div>
					<div class="settxt">
						<div class="setxtx">离线设备</div>
						<div class="setxtx">(3)</div>
					</div>
				</div>
			</div>
			<div class="rightdown">
				<div class="condtxt">设备分布情况</div>
				<div class="mechinedata flexa">
					<div class="dataitem">
						<div class="dataname">设备名称</div>
						<div class="datatxt">设备一号</div>
					</div>
					<div class="dataitem">
						<div class="dataname">凝冰厚度</div>
						<div class="datatxt">3.2mm</div>
					</div>
					<div class="dataitem">
						<div class="dataname">温度</div>
						<div class="datatxt">2℃</div>
					</div>
					<div class="dataitem">
						<div class="dataname">湿度</div>
						<div class="datatxt">70RH(%)</div>
					</div>
					<div class="dataitem">
						<div class="dataname">测量时间</div>
						<div class="datatxt datatime">2020-03-01 01:10:12</div>
					</div>
				</div>
				<div id="allmap" ref="allmap"></div>
				<!--<div>list[m].data[n].name</div><input type='button' style='color: #0397D7; position: relative;top: 0.1rem;left: 50%;transform: translateX(-50%);' @click='torealtime' value='查看详情'/>-->
			</div>
		</div>
	</div>
</template>

<script>
	import BMap from 'BMap';
	import icono from '../assets/locag5.png';
	import iconr from '../assets/locag.png';
	export default {
		name: 'Homemap',
		data() {
			return {
				mechinelist: [],//设备列表
				maps:{},//地图实例全局可用
				idx:0,//选中的设备第1层下标
				indx:0//选中的设备第2层下标
			}
		},
		methods: {
			//创建地图
			getmap(points) {
				console.log(this.maps)
				let point = new BMap.Point(points.x,points.y); //创建地图坐标点
				this.maps.centerAndZoom(point, 12); // 初始化地图,设置中心点坐标和地图级别
//				marker.setAnimation(BMAP_ANIMATION_BOUNCE) //给标注设置动画
				this.maps.addControl(new BMap.MapTypeControl({ //添加地图类型控件,如是地图还是混合
					mapTypes: [
						BMAP_NORMAL_MAP,
						BMAP_HYBRID_MAP
					]
				}));
				// map.setCurrentCity('北京");// 设置地图显示的城市 此项是必须设置的
				this.maps.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
				var opts = {
					//                anchor: BMAP_ANCHOR_TOP_LEFT,
					//                offset: new BMap.Size(150,5)
				}
				this.maps.addControl(new BMap.NavigationControl(opts)); //addControl()向地图添加控件 平移和缩放控件 PC端默认左上角 移动端默认右下角且只有缩放功能
				// map.addControl(new BMap.ScaleControl(opts));//比例尺控件 默认左下角
				this.maps.addControl(new BMap.OverviewMapControl(opts)); //缩略图控件 默认右下角且呈可折叠状态（点击隐藏和显示）
				// map.addControl(new BMap.MapTypeControl());//地图类型控件 默认右上角可切换地图/卫星/三维三种状态
				this.maps.addControl(new BMap.GeolocationControl(opts)); //定位控件 默认左下角
			},
			//设备列表是否下拉
			ispull(index) {
				let list = JSON.parse(JSON.stringify(this.mechinelist));
				list[index].pull = !list[index].pull
				this.mechinelist = list
			},
			//设备是否是选中的状态，以及选中后对地图要做的操作
			isactive(index, indx) {
				//取消上一个active的marker的动画
				let mk='marker'+this.idx+this.indx
				window[mk].setAnimation()
				
				let list = JSON.parse(JSON.stringify(this.mechinelist));
				list[this.idx].data[this.indx].active = false
				list[index].data[indx].active = true
				
				let mker='marker'+index+indx
				window[mker].setAnimation(BMAP_ANIMATION_BOUNCE)
				
				let points=new BMap.Point(list[index].data[indx].latitude,list[index].data[indx].longitude)
				this.maps.centerAndZoom(points, 12); // 初始化地图,设置中心点坐标和地图级别
				
				let infoWindows=this.infowindow(list,index,indx)
				this.maps.openInfoWindow(infoWindows,points);
				this.mechinelist = list;
				this.idx=index;
				this.indx=indx;
			},
			//设备是否是选中的状态，以及选中后对地图要做的操作
			markerisclick(index, indx) {
				//取消上一个active的marker的动画
				let mk='marker'+this.idx+this.indx
				window[mk].setAnimation()
				
				let list = JSON.parse(JSON.stringify(this.mechinelist));
				list[this.idx].data[this.indx].active = false
				list[index].data[indx].active = true
				
				let mker='marker'+index+indx
				window[mker].setAnimation(BMAP_ANIMATION_BOUNCE)
				
				let points=new BMap.Point(list[index].data[indx].latitude,list[index].data[indx].longitude)
				let infoWindows=this.infowindow(list,index,indx)
				this.maps.openInfoWindow(infoWindows,points);
				
				this.mechinelist = list;
				this.idx=index;
				this.indx=indx;
			},
			torealtime(){
				console.log(777)
				console.log(this.indx)
			},
			//根据是否是自己的和别人分享的设备创建标注点,给标注点添加label，添加点击事件，点击显示信息窗口
			addmarker(points,person,name,m,n){
				let that=this
				//判断是否是’我的‘设备，要用不同颜色的marker
				if(person=='我的'){
					var myicon = new BMap.Icon(iconr, new BMap.Size(35, 35));
				}else{
					var myicon = new BMap.Icon(icono, new BMap.Size(35, 35));
				}
				//给每个marker单独取个不同的名字，好单独控制
				let namemarker = "marker"+m+n;
				window[namemarker]=new BMap.Marker(points)
				//给每个marker创建设备名的label
				var label = new BMap.Label(name,{
                offset:new BMap.Size(25,5)
            })
				//给每个marker添加点击事件
				window[namemarker].addEventListener("click",function (event) {
            that.markerisclick(m,n) 
        });
				window[namemarker].setIcon(myicon);
				window[namemarker].setLabel(label);
				this.maps.addOverlay(window[namemarker])
			},
			//设置信息窗口函数
			infowindow(list,m,n){
				let that=this;
				let point = new BMap.Point(list[m].data[n].latitude,list[m].data[n].longitude)
				let opts = {
          width:100,
          height: 70,
          title:'设备所属：'+list[m].person
        };
        let x="<div>设备名："+list[m].data[n].name+ "</div><input id='btn' type='button' style='color: #0397D7; position: relative;top: 0.1rem;left: 50%;transform: translateX(-50%);' @click='torealtime' value='查看详情'/>"
        let infoWindows = new BMap.InfoWindow(x,opts); 
        //给窗口信息的按钮加上点击事件
        if(!infoWindows.isOpen()){
        	infoWindows.addEventListener('open',function(e){
        		document.getElementById('btn').onclick=function(){
        			that.torealtime()
        		}
        	})
        }
        return infoWindows
			}
		},
		mounted() {
			
		},
		beforeCreate: function() {
			let that = this;
			//一来就请求到设备列表
			this.$http.get(this.global.domainurl + 'icecondensation/user/getList').then(function(res) {
				let list = JSON.parse(JSON.stringify(res.data.result))
				//给列表加上是否下拉状态，和每个设备加上是否选中状态
				for (let i = 0; i < list.length; i++) {
					if (list[i].person) {
						//给列表添加上是否下拉的键值对，刚开始是全部拉开的
						list[i].pull = true
						for (let j = 0; j < list[i].data.length; j++) {
							if (i == 0 && j == 0) {
								console.log(list[i].data[j])
								//给列表添加上是否被选中的键值对，刚开始是默认第一个选中
								list[i].data[j].active = true
							} else {
								list[i].data[j].active = false
							}
						}
					}
				}
				that.mechinelist = list
				//等组件创建完后开始做地图的事
				that.$nextTick(function(){
					that.maps= new BMap.Map(this.$refs.allmap);
					let list =JSON.parse(JSON.stringify(this.mechinelist))
					//等组件创建完后先创建地图
					let points={x:list[0].data[0].latitude,y:list[0].data[0].longitude}
					that.getmap(points)
					             
					//添加各个标注
					for(let m=0;m<list.length;m++){
						if(list[m].person){
							for(let n=0;n<list[m].data.length;n++){
								//获取要操作的经纬度
								let point = new BMap.Point(list[m].data[n].latitude,list[m].data[n].longitude)
								that.addmarker(point,list[m].person,list[m].data[n].name,m,n)
							}
						}
					}
					//地图创建好后。默认的第一个选中的设备在地图上的标注动画和信息窗口的显示
					that.isactive(0,0)
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
	.homemap {
		box-sizing: border-box;
		height: calc(100% - 1rem);
		padding: 0.2rem;
	}

	.left {
		flex: 1.8;
		height: 100%;
		overflow: scroll;
		white-space: nowrap;
		border: 1px solid #eee;
		margin: 0 0.15rem 0 0;
		box-sizing: border-box;
		border-radius: 0.06rem;
	}

	.right {
		flex: 9;
		height: 100%;
		white-space: nowrap;
		box-sizing: border-box;
	}

	::-webkit-scrollbar {
		width: 0 !important;
		height: 0;
	}

	.listtxt {
		color: #FFFFFF;
		background: #0397D7;
		height: 0.8rem;
		line-height: 0.8rem;
		font-size: 0.3rem;
		text-align: center;
		font-weight: bold;
		border-radius: 0.06rem;
	}

	.setitem {
		background: #0297D7;
		box-shadow: 3px 3px 6px 2px rgba(0, 0, 0, 0.3);
		flex: 1;
		border-radius: 0.1rem;
		height: 1.6rem;
	}

	.imgset {
		width: 0.7rem;
		margin-right: 0.3rem;
	}

	.settxt {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.setxtx {
		font-size: 0.4rem;
		font-weight: bold;
		text-align: center;
		color: #FFFFFF;
	}

	.onlineitem {
		background: #04C016;
		margin: 0 0.22rem;
	}

	.onlineitem .imgset {
		width: 0.9rem;
	}

	.offlineitem {
		background: #D3727E;
	}

	.rightdown {
		border-radius: 0.06rem;
		height: calc(100% - 1.9rem);
		margin-top: 0.25rem;
		box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.2);
	}

	.condtxt {
		width: 100%;
		height: 1rem;
		text-align: left;
		font-size: 0.3rem;
		line-height: 1rem;
		padding-left: 0.4rem;
		font-weight: bold;
		color: #333333;
		border-bottom: 1px solid #eee;
		box-sizing: border-box;
	}

	#allmap {
		height: calc(100% - 2.1rem);
		overflow: scroll;
		border-radius: 0.1rem;
	}

	/* list样式 */
	.listcon {
		height: calc(100% - 0.8rem);
		padding-left: 0.2rem;
	}

	.mechineitem {
		color: #666666;
	}

	.person {
		margin: 0.2rem 0;
	}

	.persontxt {
		font-size: 0.22rem;
	}

	.imgmore {
		width: 0.18rem;
		margin-right: 0.15rem;
	}

	.mechine {
		padding-left: 0.6rem;
		height: 0.4rem;
		line-height: 0.4rem;
		opacity: 1;
		transition: all 0.5s;
	}

	.mechine:hover {
		background: rgba(0, 0, 0, 0.04)
	}

	.homemap .mechineactive {
		background: rgba(0, 0, 0, 0.1)
	}

	.liststate {
		width: 0.14rem;
		height: 0.14rem;
		background: #95F204;
		border-radius: 50%;
		margin-right: 0.05rem;
	}

	.liststateno {
		background: #D7D7D7;
	}

	.mechinename {
		font-size: 0.20rem;
	}

	.mechineno {
		height: 0;
		opacity: 0;
	}

	.dataname {
		font-size: 0.2rem;
		margin: 0 0 0.1rem 0;
	}

	.datatxt {
		font-size: 0.3rem;
	}

	.mechinedata {
		height: 1.1rem;
	}

	.datatime {
		font-size: 0.22rem
	}
</style>
