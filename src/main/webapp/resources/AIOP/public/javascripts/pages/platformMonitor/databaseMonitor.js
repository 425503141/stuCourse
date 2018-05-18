/**
 * ------------------------------------------------------------------
 * 平台监控-数据库监控
 * ------------------------------------------------------------------
 */
var databaseMonitor = (function (model){
	    model.userId = '';
	    model.getUserId = function(){
	    	var ssg = window.sessionStorage;
	    	if(ssg){
    			var token = ssg.getItem("token");
    			model.userId = ssg.getItem("userId");
    			$('#userIdHidden').val(model.userId);
    		}
	    }
        /**
         * @description 获取列表 - 监控监控
         * @param  option
         * @return  
         * ------------------------------------------------------------------
         */
        model.loaddatabaseMonitorGrid = function(option) { 
	        	$("#gridDatabaseMonitor").AIGrid({        
	        	   	url:$.ctx + '/api/db/base/monitor/list/health',
	        		datatype: "json",
	        		postData:{"userId" :model.userId},
	        		colNames:['分类','系统', '用途','数据库名称','数据库IP','数据库版本','启动时间','连通状态','连接线程数','活动线程数','等待线程数','接收字节数','发送字节数','查询/秒','事务/秒','操作'],
	        	   	colModel:[
	        	   		{name:'classify',index:'classify', width:60},//frozen : true固定列
	        	   		{name:'system',index:'system', width:50,align:"center"},
	        	   		{name:'purpose',index:'purpose', width:50, align:"center"},
	        	   		{name:'dbName',index:'db_name', width:80, align:"center"},
	        	   		{name:'dbIpAddr',index:'db_ip_addr ', width:80, align:"center"},		
	        	   		{name:'dbVersion',index:'db_version', width:80,align:"center",formatter:$.setNull},
	        	   		{name:'startTime',index:'start_time',width:90,align:"center",formatter:DateFmt.dataDateFormateMinute},
	        	   		{name:'dbStatus',index:'db_status ', width:80, align:"center",formatter:$.setIsOn},
	        	   		{name:'threadsConnected',index:'threads_connected', width:80,align:"center",formatter:$.setNull},		
	        	   		{name:'threadsActive',index:'threads_active', width:80,align:"center",formatter:$.setNull},	
	        	   		{name:'threadsWaiting',index:'threads_waiting', width:80,align:"center",formatter:$.setNull},		
	        	   		{name:'bytesReceived',index:'bytes_received ', width:80,align:"center",formatter:$.setNull},
	        	   		{name:'byesSent',index:'byes_sent', width:80,align:"center",formatter:$.setNull},
	        	   		{name:'rowsReadPersecond',index:'rows_read_persecond', width:80,align:"center",formatter:$.setNull},
	        	   		{name:'commitPersecond',index:'commit_persecond', width:80,align:"center",formatter:$.setNull},
	        	   		{name:'op',index:'op', width:70,title:false, sortable:false,formatter:del,align:"center"}		
	        	   	],
	        	   	rowNum:10,
	        	   	rowList:[10,20,30],
	        	   	pager: '#pagerDatabaseMonitor',
	        	   	sortname: '',
	        	    viewrecords: true,
	        	    multiselect:false,
	        	    sord:'',
	        		rownumbers:false,
	        		jsonReader: {
	        			repeatitems : false,
	        			id: "0"
	        		},
	        		height: '100%',
	        		setGroupHeaders:{
						  useColSpanStyle: true, 
						  groupHeaders:[
							{startColumnName: 'classify', numberOfColumns: 3, titleText: '主机信息'},//<em>Price</em>
							{startColumnName: 'dbName', numberOfColumns: 5, titleText: '数据库信息'},
							{startColumnName: 'threadsConnected', numberOfColumns: 3, titleText: '线程'},
							{startColumnName: 'bytesReceived', numberOfColumns: 2, titleText: '网络'},
							{startColumnName: 'rowsReadPersecond', numberOfColumns: 2, titleText: '查询'},
						  ]	
				   },
				   afterGridLoad:function(){
	        	    	$("#tableCellInfo,#appTableInfoPanel").addClass("hidden");
	        	    },
	        	});	
	        	//操作
	        	function del(cellvalue, options, rowObject){
	        		var rowObjectStr = JSON.stringify(rowObject) ;
	        		var html='<button type="button" class="btn btn-default  ui-table-btn ui-table-btn" onclick=\'databaseMonitor.showTableCellInfo('+rowObjectStr+')\'>查看</button>';
	        		return html;
	        	}
        }
        /***
	     * 获取全部分类
	     */
	    model.loadAllTypeList = function() {
		    	var ztreeObj = new Ztree();
		    	var navNodes = [
		    		{"id":"1","name":"数据库监控","url":"","pid":"0"},
		    		{"id":"1-1","name":"MYSQL数据库","url":"","pid":"1"},
		    		{"id":"1-1-1","name":"健康监控","url":$.ctx+"/platformMonitor/databaseMonitoring.min.html","pid":"1-1"},
		    		{"id":"1-1-2","name":"资源监控","url":$.ctx+"/platformMonitor/mysqlSourceMonitor.min.html","pid":"1-1"},
		    		{"id":"1-1-3","name":"INnoDB监控","url":$.ctx+"/platformMonitor/mysqlINnoDBMonitor.min.html","pid":"1-1"},
		    		{"id":"1-2","name":"GBase数据库","pid":"1"},
		    		{"id":"1-2-1","name":"GBase健康监控","url":$.ctx+"/platformMonitor/gbaseHealthMonitor.min.html","pid":"1-2"},
		    		{"id":"1-2-2","name":"节点存储情况","url":$.ctx+"/platformMonitor/gbaseNodeMonitor.min.html","pid":"1-2"},
		    		{"id":"1-2-3","name":"Show Process List","url":$.ctx+"/platformMonitor/gbaseProcessMonitor.min.html","pid":"1-2"},
		    	];
		    	ztreeObj.init({
		    		id:"appType",
		    		setting:{
		    			view: {
		    				selectedMulti: false,
		    			},
		    			callback: {
		    				/*onClick: function(event, treeId, treeNode){
		    					//点击切换页面
		    					if(treeNode.url){
		    					}
		    				}*/
		    			},
		    			data: {
		    				simpleData: {
		    					enable: true,
		    					idKey: "id",
		    					pIdKey: "pid",
		    					rootPId: 0
		    				}
		    			}
		    		},
		    		treeData:navNodes,
		    		expandAll:true
		    	});
	    };
	    /***
	     * 查看按钮
	     */
	    model.showTableCellInfo=function(rowObject){
			var scrollTop = $("#tableCellInfo").removeClass("hidden").offset().top;
			$('html,body').animate({"scrollTop": scrollTop }, 500 );
			model.loadBasicInfoPanel(rowObject);//基本信息 加载
			$(".ui-tabs-box .nav-tabs  a").off('shown.bs.tab').on('shown.bs.tab', function (e) {
    			var href = $(this).attr("href");
    			if(href.indexOf("basicInfoPanel") != -1){//基本信息
    				model.loadBasicInfoPanel(rowObject);
    			}
    			if(href.indexOf("capabilityPanel") != -1){//性能曲线
    				//当前使用情况
    				model.loadCurrentCharts('连接池使用',rowObject,'1');
    				model.loadCurrentCharts('表缓存使用',rowObject,'2');
    				model.loadCurrentCharts('打开文件数',rowObject,'3');
    				//最近10小时性能趋势
    			    DateFmt.loadDateTime({
    				   startTime:"#startTimeCapability",//开始时间输入框 如#startTime
    	    		   endTime:"#endTimeCapability",//结束时间输入框 如#endTime
    			    });
    				model.loadCapabilityCharts(rowObject);//最近10小时性能趋势charts
    				$('#searchBtnCapability').click(function(){
    			    	model.loadCapabilityCharts(rowObject);//最近10小时性能趋势charts
    				});
    			}
    			if(href.indexOf("topSqlPanel") != -1){//TOP SQL
    				//日期控件
    			    DateFmt.loadDateTime({
    				   startTime:"#startTimeTopSql",//开始时间输入框 如#startTime
    	    		   endTime:"#endTimeTopSql",//结束时间输入框 如#endTime
    			    });
    				model.loadTopSqlGrid(rowObject);//列表
    				//查询按钮
    				$('#searchBtnTopSql').click(function(){
    					var ajaxData = {
    							"serverId":rowObject.serverId,
    							"dbId":rowObject.dbId,
    							"startTime":$('#startTimeTopSql').val(),
    							"endTime":$('#endTimeTopSql').val()
    		    		};
    		    		$("#gridSql").jqGrid('setGridParam',{ 
    		                postData:ajaxData
    		            },true).trigger("reloadGrid");
    				});
    			}
    			if(href.indexOf("spacePanel") != -1){//空间
    				//折线图
    		    	var params = {
    				    			"titleTxt":"Binlog一周空间占用情况",
    			        			"chartsId":"spaceCharts",//charts的id 如#chartsDiv,
    			        			"ajaxData":{"serverId":rowObject.serverId,"dbId":rowObject.dbId},//请求的参数
    			        			"ajaxUrl":$.ctx + "/api/db/base/monitor/detail/chart/space",//接口地址
    			        			"yformatter": '{value}MB',//y轴数据格式
    			        			"itemStyleObj": {"lineColor":["#f6b37f","#56b881","#26b6e8",'#ff885e','#fae2a1','rgb(249,205,173)','rgb(200,200,169)','rgb(131,175,155)']}//折线颜色等
    		    				  };
    		    	model.getChartsData(rowObject,params);
    		    	//列表
    				model.loadSpaceGrid(rowObject);
    			}
    			if(href.indexOf("warnPanel") != -1){//告警
    				model.loadWarnGrid(rowObject);//列表
    			}
    		});
			
	    };
	    /**
	     * 基本信息-全部加载
	     */
	    model.loadBasicInfoPanel = function(rowObject){
	    	//基本信息-CPU表盘
			model.loadCPUDialCharts(rowObject);
			//基本信息-CPU使用率
			var ajaxData = {"serverId":rowObject.serverId};//请求的参数
	    	var paramsCpu = {
				    			"titleTxt":"CPU使用率",
			        			"chartsId":"cpuCharts",//charts的id 如#chartsDiv,
			        			"ajaxData":ajaxData,
			        			"ajaxUrl":$.ctx + "/api/db/base/monitor/detail/cpu",//接口地址
			        			"itemStyleObj":{"lineColor":["#f6b37f"]},//折线颜色等
			        			"yformatter": '{value}%'//y轴数据格式
		    				  };
	    	model.getChartsData(rowObject,paramsCpu);
	    	//基本信息-内存使用率
	    	var paramsMemory = {
				    			"titleTxt":"内存使用率",
			        			"chartsId":"memoryCharts",//charts的id 如#chartsDiv,
			        			"ajaxData":ajaxData,
			        			"ajaxUrl":$.ctx + "/api/db/base/monitor/detail/memory",//接口地址
			        			"itemStyleObj":{"lineColor":["#45bd6f"]},//折线颜色等
			        			"yformatter": '{value}%'//y轴数据格式
							  };
	    	model.getChartsData(rowObject,paramsMemory);
			//基本信息-数据库基本信息&&主机基本信息
	    	model.loadBasicInfo(rowObject);
	    };
	    /**
	     * 性能曲线-最近10小时性能趋势charts
	     */
	    model.loadCapabilityCharts = function(rowObject){
	    	var ajaxData = {"serverId":rowObject.serverId,"dbId":rowObject.dbId,"startTime":$('#startTimeCapability').val(),"endTime":$('#endTimeCapability').val()};//请求的参数
	    	var itemStyleObj = {"lineColor":["#56b881","#f6b37f","#26b6e8",'#ff885e','#fae2a1','rgb(249,205,173)','rgb(200,200,169)','rgb(131,175,155)']};//折线颜色等
	    	var params1 = {
			    			"titleTxt":"Threads",
		        			"chartsId":"ThreadsCharts",//charts的id 如#chartsDiv,
		        			"ajaxData":ajaxData,
		        			"ajaxUrl":$.ctx + "/api/db/base/monitor/detail/chart/thread",//接口地址
		        			"itemStyleObj":itemStyleObj
	    				  };
	    	var params2 = {
			    			"titleTxt":"QPS-TPS",
		        			"chartsId":"QpsCharts",//charts的id 如#chartsDiv,
		        			"ajaxData":ajaxData,
		        			"ajaxUrl":$.ctx + "/api/db/base/monitor/detail/chart/qpstps",//接口地址
		        			"itemStyleObj":itemStyleObj
				          };
	    	var params3 = {
			    			"titleTxt":"DML Persecond",
		        			"chartsId":"DmlCharts",//charts的id 如#chartsDiv,
		        			"ajaxData":ajaxData,
		        			"ajaxUrl":$.ctx + "/api/db/base/monitor/detail/chart/dmls",//接口地址
		        			"itemStyleObj":itemStyleObj
		                   };
	    	var params4 = {
			    			"titleTxt":"Transaction Persecond",
		        			"chartsId":"TransactionPersecondCharts",//charts的id 如#chartsDiv,
		        			"ajaxData":ajaxData,
		        			"ajaxUrl":$.ctx + "/api/db/base/monitor/detail/chart/tps",//接口地址
		        			"itemStyleObj":itemStyleObj
		                   };
	    	var params5 = {
			    			"titleTxt":"InnoDB IO",
		        			"chartsId":"InnoDBIOCharts",//charts的id 如#chartsDiv,
		        			"ajaxData":ajaxData,
		        			"ajaxUrl":$.ctx + "/api/db/base/monitor/detail/chart/Innerdbio",//接口地址
		        			"itemStyleObj":itemStyleObj
		                   };
	    	var params6 = {
			    			"titleTxt":"InnoDB Row Read",
		        			"chartsId":"InnoDBRowReadCharts",//charts的id 如#chartsDiv,
		        			"ajaxData":ajaxData,
		        			"ajaxUrl":$.ctx + "/api/db/base/monitor/detail/chart/Innerdbrowsread",//接口地址
		        			"itemStyleObj":itemStyleObj
						  };
			var params7 = {
			    			"titleTxt":"InnoDB Row DML",
		        			"chartsId":"InnoDBRowDMLCharts",//charts的id 如#chartsDiv,
		        			"ajaxData":ajaxData,
		        			"ajaxUrl":$.ctx + "/api/db/base/monitor/detail/chart/innerdbrowsdml",//接口地址
		        			"itemStyleObj":itemStyleObj
				          };
			var params8 = {
			    			"titleTxt":"Key Buffer",
		        			"chartsId":"KeyBufferCharts",//charts的id 如#chartsDiv,
		        			"ajaxData":ajaxData,
		        			"ajaxUrl":$.ctx + "/api/db/base/monitor/detail/chart/keybuffer",//接口地址
		        			"itemStyleObj":itemStyleObj
		                   };
			var params9 = {
			    			"titleTxt":"Network",
		        			"chartsId":"NetworkCharts",//charts的id 如#chartsDiv,
		        			"ajaxData":ajaxData,
		        			"ajaxUrl":$.ctx + "/api/db/base/monitor/detail/chart/network",//接口地址
		        			"itemStyleObj":itemStyleObj
		                   };
			var params10 = {
			    			"titleTxt":"Aborted",
		        			"chartsId":"AbortedCharts",//charts的id 如#chartsDiv,
		        			"ajaxData":ajaxData,
		        			"ajaxUrl":$.ctx + "/api/db/base/monitor/detail/chart/aborted",//接口地址
		        			"itemStyleObj":itemStyleObj
		                   };
		    //Threads 
	    	model.getChartsData(rowObject,params1);
		    //QPS-TPS
	    	model.getChartsData(rowObject,params2);
		    //DML Persecond
	    	model.getChartsData(rowObject,params3);
		    //Transaction Persecond
	    	model.getChartsData(rowObject,params4);
		    //InnoDB IO
	    	model.getChartsData(rowObject,params5);
		    //InnoDB Row Read
		    model.getChartsData(rowObject,params6);
		    //InnoDB Row DML
		    model.getChartsData(rowObject,params7);
		    //Key Buffer
		    model.getChartsData(rowObject,params8);
		    //Network
		    model.getChartsData(rowObject,params9);
		    //Aborted
		    model.getChartsData(rowObject,params10);
	    };
	    /**
	     * 基本信息-CPU表盘
	     */
	    model.loadCPUDialCharts=function(rowObject){
	    	var option = {
	    			title: {
	    		    	x:"center",//标题水平居中
	    		    	top:5,
	    		        text: 'CPU使用率',
	    		        textStyle:{
	    		        	fontSize:14,
	    		        	fontWeight:'normal',
	    		        },
	    		    },
	    		    tooltip : {
	    		        formatter: "{a} <br/>{b} : {c}%"
	    		    },
	    		    toolbox: {},
	    		    series: [
	    		        {
	    		            name: 'CPU',
	    		            type: 'gauge',
	    		            detail: {formatter:'{value}%',fontSize:"16"},
	    		            data: [],//{value: 10, name: '使用率'}
	    		            axisLine: {            // 坐标轴线  
	    	                     lineStyle: {// 属性lineStyle控制线条样式  
	    	                         			color: [[0.2, '#3acf61'], [0.8, '#ffc46f'], [1, '#fe6f4e']],
	    	                         			width:20
	    	                                } ,
	    	                },
	    		        }
	    		    ]
	    		};
	    	var postData = {"serverId":rowObject.serverId,"dbId":rowObject.dbId};
	    	$.AIGet({
				url:$.ctx+'/api/db/base/monitor/detail/cup/dial',
				datatype:"json",
				data:postData,
				success:function(result){
					    var data = result.data;
					    if(data){
							option.series[0].data = [{"value":data.cpuRate}];
							var myChart = echarts.init(document.getElementById('cpuDialCharts'));
							// 使用刚指定的配置项和数据显示图表。
							myChart.setOption(option);
						}	
					}
		    	});
	    };
        /**
         * @description 取得折线图数据
         * @param   rowObject-当前行信息 params-参数
         * @return  
         * ------------------------------------------------------------------
         */
        model.getChartsData = function(rowObject,params) { 
        	var defaults = {
        			"titleTxt":"图表的名称",
        			"chartsId":"chartsId",//charts的id 如#chartsDiv,
        			"ajaxData":"",//请求的参数
        			"ajaxUrl":"",//接口地址
        			"itemStyleObj":{},//折线颜色等
        			"yformatter": '{value}'
        	};
        	params = $.extend(defaults,params);
        	var option = {
        		    title: {
        		    	top:20,
        		        text: params.titleTxt,
        		        x:'center',
        		        textStyle:{
        		        	fontSize:14,
        		        	fontWeight:'normal',
        		        },
        		    },
        		    legend: {
        		        icon:'circle',
        		        data:[],//'邮件营销'
        		       	orient: 'horizontal',
        		        left: 'center',
        		        bottom:'1%',
        		        
        		    },
        		    tooltip: {
        		        trigger: 'axis',
        		    },
        		    toolbox: {},
        		    xAxis:  {
        		        type: 'category',
        		        boundaryGap: false,
        		        data: [],
        		        axisLabel : {
        		            interval : 12,
        		        },
        		        splitNumber : 10
        		    },
        		    yAxis: {
        		        type: 'value',
        		        axisLabel: {
        		            formatter: params.yformatter
        		        },
        		    },
        		    series: []
        		};
	    	$.AIGet({
				url:params.ajaxUrl,
				datatype:"json",
				data:params.ajaxData,
				success:function(result){
					    var data = result.data;
					    var myChart = echarts.init(document.getElementById(params.chartsId));
					    myChart.clear();
					    if(result.status=='201'){return;}
						option.xAxis.data = data.xaxis.data;
						var changeColorSeries = [];
						data.series.map(function (item,index) {
							item.symbol ='circle';//空心圆改为实心圆
							//"itemStyleObj":{"lineColor":["#f6b37f","red","green"]},//折线颜色等
							if(params.itemStyleObj){ //itemStyleObj 为{}时用插件的默认色
								item.itemStyle = {  
		                                normal : { 
		                                	color:params.itemStyleObj.lineColor[index],//折线点颜色
		                                    lineStyle:{  
		                                        color:params.itemStyleObj.lineColor[index] //折线线条颜色
		                                    }  
		                                }  
		                            }
							}
							changeColorSeries.push(item)
			                return changeColorSeries;
			            })
						option.series = changeColorSeries;
						option.legend.data = data.legendData
						// 使用刚指定的配置项和数据显示图表。
						myChart.setOption(option);
					}
		    	});
        }
	    /**
	     * 基本信息-数据库基本信息&&主机基本信息
	     */
	    model.loadBasicInfo=function(rowObject){
	     	$.AIGet({
				url:$.ctx + "/api/db/base/monitor/detail/basicinfo",
				datatype:"json",
				data:{"serverId":rowObject.serverId,"dbId":rowObject.dbId},
				success:function(result){
					var data = result.data;
					//数据库基本信息
					$("#dbName").html(data.dbName).attr('title',data.dbName);
					$("#dbIp").html(data.dbIp).attr('title',data.dbIp);
					$("#dbPort").html(data.dbPort).attr('title',data.dbPort);
					var dbVersion = data.dbVersion ? data.dbVersion : '-';
					$("#dbVersion").html(dbVersion).attr('title',dbVersion);
					$("#dbCollectStatus").html($.setCollectStatus(data.dbCollectStatus)).attr('title',$.setCollectStatus(data.dbCollectStatus));
					$("#dbStatus").html($.setIsOn(data.dbStatus)).attr('title',$.setIsOn(data.dbStatus));
					//主机基本信息
					$("#serverName").html(data.serverName).attr('title',data.serverName);
					$("#serverIp").html(data.serverIp).attr('title',data.serverIp);
					$("#serverPort").html(data.serverPort).attr('title',data.serverPort);
					var serverVersion = data.osVersion ? data.osVersion : '-';
					$("#serverVersion").html(serverVersion).attr('title',serverVersion);
					$("#serverCollectStatus").html($.setCollectStatus(data.serverCollectStatus)).attr('title',$.setCollectStatus(data.serverCollectStatus));
					$("#serverStatus").html($.setIsOn(data.serverStatus)).attr('title',$.setIsOn(data.serverStatus));
				}
		    });
	    };
	    /**
         * @description 性能曲线 -当前使用情况 
         * @param titleTxt 标题 item-1第一个 2-第二个 3-第三个
         */
        model.loadCurrentCharts = function(titleTxt,rowObject,item) { 
        	var dbIpAddrPort = rowObject.dbIpAddrPort ? rowObject.dbIpAddrPort : "";
        	var seriesColor = ['#ff885e','#fae2a1','rgb(249,205,173)','rgb(200,200,169)','rgb(131,175,155)'];//饼图色块颜色
        	var seriesLabel = { //直接显示百分比
	    			 normal: {
		                    position: 'inner',
		                    formatter:'{d}%'
		                }
	    	};
        	var option = {
        		    title: {
        		    	x:"center",//标题水平居中
        		    	top:5,
        		        text: dbIpAddrPort+" " + titleTxt,
        		        textStyle:{
        		        	fontSize:14,
        		        	fontWeight:'normal',
        		        },
        		    },
        		    toolbox: {},
        		    tooltip : {
        		        trigger: 'item',
        		        formatter: "{b} : {c} ({d}%)"//{a} <br/>{b} : {c} ({d}%)
        		    },
        		    legend: {
        		        orient: 'horizontal',//vertical,horizontal 
        		        left: 'center',
        		        bottom:'1%',
        		        data: []
        		    },
        		    series : []
        		};
	    	var postData = {"serverId":rowObject.serverId,"dbId":rowObject.dbId};
	    	$.AIGet({
				url:$.ctx+'/api/db/base/monitor/detail/chart/pies',
				datatype:"json",
				data:postData,
				success:function(result){
					    var data = result.data;
					    if(item=='1'){
					    	option.series = data[0].series;
					    	option.series.label = seriesLabel;
					    	option.series.color = seriesColor;
							option.legend.data = data[0].legendData
							var myChart = echarts.init(document.getElementById('linkCharts'));
							// 使用刚指定的配置项和数据显示图表。
							myChart.setOption(option);
					    }
					    if(item=='2'){
					    	option.series = data[1].series;
					    	option.series.label = seriesLabel;
					    	option.series.color = seriesColor;
							option.legend.data = data[1].legendData
							var myChart = echarts.init(document.getElementById('cacheCharts'));
							// 使用刚指定的配置项和数据显示图表。
							myChart.setOption(option);
					    }
					    if(item=='3'){
					    	option.series = data[2].series;
					    	option.series.color = seriesColor;
					    	option.series.label = seriesLabel;
							option.legend.data = data[2].legendData
							var myChart = echarts.init(document.getElementById('openCharts'));
							// 使用刚指定的配置项和数据显示图表。
							myChart.setOption(option);
					    }
					}
		    	});
        };
	    /**
         * @description TOP SQL 列表
         */
        model.loadTopSqlGrid = function(rowObject) { 
	        	$("#gridSql").AIGrid({        
	        	   	url:$.ctx + '/api/db/base/monitor/detail/chart/topsql',
	        		datatype: "json",
	        		postData:{"serverId":rowObject.serverId,"dbId":rowObject.dbId,"startTime":$('#startTimeTopSql').val(),"endTime":$('#endTimeTopSql').val()},
	        		colNames:['SQL ID','SQL Text', 'TS count', 'Query Time avq','Lock Time Avq','Rows Sent Avq','Rows  Examined Avq'],
	        	   	colModel:[
	        	   		{name:'sqlId',index:'sql_id', width:90,align:"center",formatter:cLink},
	        	   		{name:'sqlText',index:'sql_text', width:90,align:"center"},
	        	   		{name:'tsCount',index:'ts_count ', width:100,align:"center"},
	        	   		{name:'queryTime',index:'query_time', width:80, align:"center"},
	        	   		{name:'lockTime',index:'lock_time', width:80, align:"center"},		
	        	   		{name:'rowsSent',index:'rows_sent', width:50,align:"center"},		
	        	   		{name:'rowsExamined',index:'rows_examined', width:50,align:"center"},		
	        	   	],
	        	   	rowNum:10,
	        	   	rowList:[10,20,30],
	        	   	pager: '#pagerSql',
	        	   	sortname: '',
	        	    viewrecords: true,
	        	    multiselect:false,
	        		rownumbers:false,
	        	    sortorder: "",
	        		jsonReader: {
	        			repeatitems : false,
	        			id: "0"
	        		},
	        		height: '100%',
	        	});
	        	function cLink(cellvalue, options, rowObject){
	        		var rowObjectStr = JSON.stringify(rowObject);
	        		var html = '<a class="gridLink" style="width:100%;display:inline-block;" data-sqlId="'+rowObject.sqlId+'" data-sqlText="'+rowObject.sqlText+'" href="javascript:void(0)" onclick="databaseMonitor.showSqltxt(this)" >'+cellvalue+'</a>';
	        		return html;
	        	} 
        };
        /**
         * @description TOP SQL 列表 -详情
         */
        model.showSqltxt = function(obj) { 
        	$('.J_sqlBox').removeClass('hidden');
        	$('.J_sqlId').html($(obj).attr("data-sqlId"));
        	$('.J_sqlTextArea').val($(obj).attr("data-sqlText")).lineLine();;
        };
        /**
         * @description 空间列表 
         */
        model.loadSpaceGrid = function(rowObject) { 
	        $("#gridSpace").AIGrid({        
	    	   	url:$.ctx+'/api/db/base/monitor/detail/list/space',
	    		datatype: "json",
	    		postData:{"serverId":rowObject.serverId,"dbId":rowObject.dbId},
	    	   	colNames:['名称','空间类型','物理大小','昨日增长/Mb'],
	    	   	colModel:[
	    	   		{name:'schemaName',sortable:false, width:100,align:"center"},
	    	   		{name:'schemaType',sortable:false, width:80, align:"center"},
	    	   		{name:'physicalSize',sortable:false, width:80, align:"center"},		
	    	   		{name:'growth',sortable:false, width:50,align:"center"},		
	    	   	],
	    	   	rowNum:'',
	    	   	rowList:[10,20,30],
	    	   	pager: '#pagerSpace',
	    	   	sortname: '',
	    	    viewrecords: true,
	    	    multiselect:false,
	    		rownumbers:false,
	    	    sortorder: "",
	    		jsonReader: {
	    			repeatitems : false,
	    			id: "0"
	    		},
	    		height: '100%' 
	    	});	
        };
        /**
         * @description 告警 列表
         */
        model.loadWarnGrid = function(rowObject) { 
        	$("#gridWarn").AIGrid({        
        	   	url:$.ctx + '/api/alarm/getDBAlarmRealTimeList',
        		datatype: "json",
        		postData:{"dbId":rowObject.dbId},
        		colNames:["分类",'系统', '用途', '告警对象','告警实例','告警类型','告警发生时间','最后告警时间','告警恢复时间','告警次数','告警级别','告警描述'],
    		   	colModel:[
    		   	    {name:'classify',index:"classify",width:60,align:"center",formatter:$.setNull},
    		   		{name:'system',index:'system', width:60,align:"center",formatter:$.setNull},
    		   		{name:'purpose',index:'purpose', width:60,align:"center",formatter:$.setNull},
    		   		{name:'alarmObject',index:'alarmObject', width:50,align:"center",formatter:$.setNull},
    		   		{name:'alarmInstance',index:'alarmInstance',width:80, align:"center",formatter:$.setNull},
    		   		{name:'alarmIndexName',index:'alarm_index_name', width:80,align:"center",formatter:$.setNull},
    		   		{name:'alarmHappenedTime',index:'alarm_happened_time', width:80,align:"center",formatter:DateFmt.dataDateFormateMinute},
    		   		{name:'alarmLastTime',index:'alarm_last_time', width:80,align:"center",formatter:DateFmt.dataDateFormateMinute},
    		   		{name:'alarmRecoveryTime',index:'alarm_recovery_time',width:80, align:"center",formatter:DateFmt.dataDateFormateMinute},
    		   		{name:'alarmCount',index:'alarm_count', width:80,align:"center",formatter:$.setNull},
    		   		{name:'alarmLevelName',index:'alarm_level_name', width:50,align:"center",color:'alarmLevelColor',formatter:$.setColor},
    		   		{name:'alarmDescription',index:'alarm_description',width:150, align:"center",sortable:false,formatter:$.setNull},
    		   	],
        	   	rowNum:10,
        	   	rowList:[10,20,30],
        	   	pager: '#pagerWarn',
        	   	sortname: '',
        	    viewrecords: true,
        	    multiselect:false,
        		rownumbers:false,
        	    sortorder: "",
        		jsonReader: {
        			repeatitems : false,
        			id: "0"
        		},
        		height: '100%' 
        	});	
        }
        return model;
   })(window.databaseMonitor || {});