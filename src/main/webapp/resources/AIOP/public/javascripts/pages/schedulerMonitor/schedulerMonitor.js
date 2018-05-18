/**
 * ------------------------------------------------------------------
 * 调度监控
 * ------------------------------------------------------------------
 */
var schedulerMonitor = (function (model){
        //开发版本号
        model.version = "1.0.0";
        model.author  = "wangsen3";
        model.email   = "wangsen3@asiainfo.com";
        model.visOption = {};
        /**
         * @description 获取调度列表
         * @param  option
         * @return  
         * ------------------------------------------------------------------
         * 
         */
        model.loadSchedulerGrid = function(option) {
	        	$("#schedulerList").AIGrid({        
	        	   	url: $.ctx+'/api/sched/dispatch/list',
	        		datatype: "json",
	        		postData:option,
	        	   	colNames:['id','程序名称', '周期','数据日期','偏移量','计划开始时间','实际开始时间','计划完成时间','实际完成时间','状态','影响应用数','操作'],
	        	   	colModel:[
	        	   		{name:'procId',index:'proc_id',hidden:true },//frozen : true固定列
	        	   		{name:'procName',index:'proc_name_zn', width:130,align:"left",formatter:setAppName},
	        	   		{name:'runFreq',index:'run_Freq', width:30, align:"center",formatter:formateRunFreq},
	        	   		{name:'dataTime',index:'data_time', width:80, align:"center" ,formatter:DateFmt.dataDateFormate},
	        	   		{name:'dateArgs',index:'date_args', width:30, align:"center" ,formatter:$.setNull},
	        	   		{name:'planStartTime',index:'plan_start_time', width:80, align:"center" ,formatter:DateFmt.dateFormatter},
	        	   		{name:'actualStartTime',index:'actual_Start_Time', width:80, align:"center",formatter:DateFmt.dateFormatter},		
	        	   		{name:'planEndTime',index:'plan_End_Time', width:60,align:"center",formatter:DateFmt.dateFormatter},		
	        	   		{name:'actualEndTime',index:'actual_end_time', width:60,align:"center",formatter:DateFmt.dateFormatter},		
	        	   		{name:'statusDesc',index:'status_code', width:60,align:"center",color:"statusColor",formatter:$.setStatus},		
	        	   		{name:'affectedNbr',index:'affected_app_num', width:40,align:"center",formatter:$.setStatus},	
	        	   		{name:'op',index:'op',title:false, width:80, sortable:false,formatter:del,align:"center"}		
	        	   	],
	        	   	rowNum:10,
	        	   	rowList:[10,20,30],
	        	   	pager: '#schedulerListPager',
	        	   	sortname: '',
	        	    viewrecords: true,
	        	    multiselect:false,
	        		rownumbers:false,
	        	    sortorder: "desc",
	        	    afterGridLoad:function(){
	        	    	$("#tableCellInfo,#appTableInfoPanel").addClass("hidden");
	        	    },
	        		height: '100%' ,
	        		showNoResult:true//是否展示无数据时的样式
	        	})
	        	function formateRunFreq(cellvalue, options, rowObject){
	        		var runFreq = cellvalue;
	        		var runFreqObj =$.runFreqObj;
	        		return runFreqObj[runFreq] || runFreq;
	        	}
	        	function setAppName(cellvalue, options, rowObject){
	        		var $rowObj = $("#"+options.rowId);
	        		if(rowObject.statusColor == "red"){//状态值
	        			var html = '<span class="ui-delay-icon"></span><span>'+cellvalue+'</span>'
	        			return html;
	        		}else{
	        			var html = '<span class="ui-empty-icon v-hidden"></span><span>'+cellvalue+'</span>'
	        			return html;
	        			//return cellvalue;
	        		}
	        	}
	        	function del(cellvalue, options, rowObject){
	        		var rowObjectStr = JSON.stringify(rowObject) ;
	        		var html='<button type="button" class="btn btn-default  ui-table-btn ui-table-btn" onclick=\'schedulerMonitor.showTableCellInfo('+rowObjectStr+')\'>查看</button><button type="button" class="btn btn-default  ui-table-btn ui-table-btn" onclick=\'schedulerMonitor.sendMemoDlg('+rowObjectStr+')\'>备注</button>';
	        		return html;
	        	}
	    }
        /***
	     * 获取状态列表以及对应个数
	     */
	    model.loadStatusNumber = function(obj) {
    		var moreQueryIpnut = formFmt.formToObj($("#searchScheduler"));
			var dataTimeFrom = $("#dataTimeFrom").val();
			var dataTimeTo = $("#dataTimeTo").val();
			var search = $("#searchSchedulerName").val();
			moreQueryIpnut.dataTimeFrom = dataTimeFrom;
			moreQueryIpnut.runFreq = $('#runFreq').val();
			moreQueryIpnut.dataTimeTo = dataTimeTo;
			moreQueryIpnut.search = search;
		    	$.AIGet({
	    			url:$.ctx + "/api/sched/dispatch/status",
	    			datatype:"json",
	    			data:moreQueryIpnut,
	    			success:function(result){
	    				var html = "";
	    				var data = result.data;
	    			 	$.AIGet({
		    		    		url:$.ctx + "/api/sched/dispatch/items",
		    		    		datatype:"json",
		    		    		data:moreQueryIpnut,
		    		    		success:function(result){
		    		    			var currentArray = [];
		    		    			if(result.data.length == 0){
		    		    				currentArray = [];
		    		    				for(var i =0,len=data.length;i<len;i++){
		    		    					var currentData = $.extend(data[i],{status_count:0});
			    							currentArray.push(currentData);
		    		    				}
		    		    			}else{
			    		    			for(var i =0,len=data.length;i<len;i++){
			    		    				for(var j =0,leng=result.data.length;j<leng;j++){
				    		    				if(data[i].statusCode == result.data[j].status_code){
				    		    					var currentData = $.extend(data[i],result.data[j]);
				    		    					currentArray.push(currentData);
				    		    					break;
				    		    				} 
				    		    				if(j==leng -1){
				    		    					var currentData = $.extend(data[i],{status_count:0});
				    		    					currentArray.push(currentData);
				    		    				}
				    		    			}
			    		    			}
		    		    			}
		    		    			 var html='';
		    		    			 $(obj).empty();
	    		    			  	 var classObj = $.statusClass;
	    		    			  	 var allCount = 0;
		    		    			 for(var i = 0,length = currentArray.length; i < length; i++ ){
		    		    				 allCount += currentArray[i].status_count;
		    		    				 var _class= classObj[currentArray[i].statusCode] ? classObj[currentArray[i].statusCode] : classObj[currentArray[0].statusCode];
		    		    				 html += '<a class="btn btn-default '+_class+'" data-statusCode="'+currentArray[i].statusCode+'" href="javascript:;" role="button"><span class="fleft">'+currentArray[i].statusName+'</span><span class="ui-btn-number fright">'+currentArray[i].status_count+'</span></a>'
		    		    			 }

		    		    			 var allHtml = '<a class="btn btn-default ui-btn-all" data-statuscode="" href="javascript:;" role="button"><span class="fleft">调度总数</span><span class="ui-btn-number fright">'+allCount+'</span></a>';
		    		    			 $(obj).append(allHtml+html);
		    		    			 $(obj).find('> a').off('click').on("click",function(){

	    		    					 var runRtatus = $(this).attr("data-statusCode");
	    		    					 $("#schedulerList").jqGrid('setGridParam',{ 
	    		    				            postData:{runRtatus:runRtatus}
	    		    				        }).trigger("reloadGrid");
	    		    				 });
		    		    		}
		    		    	}); 
	    			}
	    		});
	    };
	    /***
	     * 获取状态列表以及对应个数
	     */
	    model.loadStatusList = function(dom) {
	    
    			$.AIGet({
    				url:$.ctx + "/api/sched/dispatch/status",
    				datatype:"json",
    				success:function(result){
    					var html = "";
	    				var data = result.data;
	    				if(!data) return;
	    				for(var i =0,len=data.length;i<len;i++){
	    					html +='<option value="'+data[i].statusCode+'">'+data[i].statusName+'</option>';
	    				}
	    				$(dom).html(html).multiselect({
	    					nonSelectedText:"选择状态",
	    					buttonWidth:170,
	    					numberDisplayed:2,
	    					nSelectedText:"个选择",
	    					includeSelectAllOption:false,
	    					selectAllText: ' 全部'
	    				});
	    				$(dom).multiselect('refresh');//刷新该插件-解决点击其他行查看按钮之前选中的状态还在
    				}
    			}); 
	    };
	    /***
	     * 获取重要程度下拉列表
	     */
	    model.loadPriLevelList = function(dom) {
	    	 var data = $.priLevelObj;
	    	 var html = "";
	    	 for(var i in data){
	    		 html+='<option value="'+i+'">'+data[i]+'</option>'
	    	 }
	    	 $(dom).html(html).multiselect({
					nonSelectedText:"选择重要程度",
					buttonWidth:187,
					numberDisplayed:2,
					nSelectedText:"个选择",
					includeSelectAllOption:false,
					selectAllText: ' 全部'
			 });
			$(dom).multiselect('refresh');//刷新该插件
	     };
	     /**
	         * 打开备注弹框
	         */
	        model.sendMemoDlg = function(rowObject){
	        	var statDate = DateFmt.Formate(rowObject.statDate,"yyyy-MM-dd");
	    		methodMemo.showRemarkDlg({
	    			ajaxData:{
	    				"statDate":statDate,//统计日期
		    			"objectId":rowObject.procId,//数据的id：应用/调度/接口ID
		    			"objectType":"P",//A:应用/P:调度/I:接口
	    			},
	    			"rowObj":rowObject
	    		},'3');//1-实时监控 2-历史监控 3-调度监控
	    		//用来服务器记录log
	    		/*$.AILog({
	    			  "action": "备注",//动作
	    			  "detail": "",//详情,默认为空
	    			  "module": "app_monitor_realtime"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    	    });*/
	        };
	    /***
	     * 查看按钮
	     */
	    model.showTableCellInfo=function(rowObject){
	    		var scrollTop = $("#tableCellInfo").removeClass("hidden").offset().top;
	    		$('html,body').animate({"scrollTop": scrollTop }, 500 );
	    		$("#appTableInfoPanel").addClass("hidden");
	    		$("#appEffectList").addClass("hidden");
//	    		$("#appEffectBtn").removeClass("active");
	    		$("#appEffectBtn,#tableCellInfo .nav-tabs li,#tableCellInfo .tab-content >div").removeClass("active");
	    		$("#tableCellInfo .nav-tabs li:first-child,#tableCellInfo .tab-content > div:first-child").addClass("active");
	    		$("#expandVIS").attr("needLevel",3);
      		$("#shrinkVIS").attr("needLevel",3);
	    		schedulerMonitor.loadVisData(rowObject);
	    		schedulerMonitor.loadSchedulerMonitorInfo(rowObject);
	    		if(!$("#appEffectList").is(":hidden")){//
	    			 $("#visjsonmap").jqGrid('setGridParam',{ 
				            postData:rowObject
				        }).trigger("reloadGrid");
	    		}
	    		schedulerMonitor.getDelayConditionCharts(rowObject);
	    		$("#showOnlyError").removeClass("active");
	    		$("#showOnlyError").off("click").on("click",function(){
	    			if(!$(this).hasClass("active")){
	    				$(this).addClass("active");
	    			}else{
	    				$(this).removeClass("active");
	    			}
	    		});
	    		$("#showOnlyError").off("click").on("click",function(){
	    			if(!$(this).hasClass("active")){
	    				$(this).addClass("active");
	    				rowObject.isError= true;
	    				schedulerMonitor.loadVisData(rowObject);
	    			}else{
	    				rowObject.isError= false;
	    				schedulerMonitor.loadVisData(rowObject);
	    				$(this).removeClass("active");
	    			}
	    		});
	    		$(".ui-tabs-box .nav-tabs  a").off('shown.bs.tab').on('shown.bs.tab', function (e) {
	    			var href = $(this).attr("href");
	    			if(href.indexOf("schedule") != -1){
	    				$("#searchText").val("");
	    				schedulerMonitor.loadStatusList("#scheduleStatusType");
	    				schedulerMonitor.loadScheduleData(rowObject);
	    				schedulerMonitor.searchScheduleList(rowObject);
	    			}else if(href.indexOf("interface") != -1){
	    				$("#interfaceSearchText").val("");
	    				schedulerMonitor.loadStatusList("#interfaceStatusType");
	    				schedulerMonitor.loadInterfaceData(rowObject);
	    				schedulerMonitor.searchInterfaceList(rowObject);
	    				//TODO
	    			}else if(href.indexOf("basicInfo") != -1){
	    				schedulerMonitor.loadBasicInfo(rowObject)
	    			}else if(href.indexOf("dictionary") != -1){//数据字典
	    				model.loadDictionaryData(rowObject);
	    			}else if(href.indexOf("tab2") != -1){
	    				model.loadTab2(rowObject,"")	
	    				model.loadStatusList("#visStatusType2");//获取选择状态下拉列表
	    				model.loadPriLevelList("#visImportantType2");//获取重要程度下拉列表
	    			}else if(href.indexOf("tab1") != -1){
	    				model.loadTableInfoVis(rowObject,"");
	    			} 
	    		});
	    		$("#appEffectBtn").off("click").on("click",function(){
	    			$("#visStatusType").parent().hide();
	    			if($(this).hasClass("active")){
	    				$(this).removeClass("active");
	    				$("#appEffectList").addClass("hidden");
	    			}else{
	    				$(this).addClass("active");
	    				$('#searchAPPVisList').val('');
	    				$("#appEffectList").removeClass("hidden");
	    				schedulerMonitor.loadAPPVisList(rowObject);
	    				model.loadStatusList("#visStatusType");//获取选择状态下拉列表
	    				model.loadPriLevelList("#visImportantType");//获取重要程度下拉列表
	    			}
	    			
	    		});
	    };
	    /**
	     * 查询当前行详情
	     */
	    model.loadSchedulerMonitorInfo=function(rowObject){
	     	$.AIGet({
				url:$.ctx + "/api/sched/dispatch/detail",
				datatype:"json",
				data:rowObject,
				success:function(result){
					var data = result.data;
					var priLevel = data.priLevel;
					$("#appImportantInfo").text($.priLevelObj[priLevel]);
					$("#appFreq").text($.runFreqObj[data.runFreq]);
					 var _class= $.statusClass[data.statusCode] ? $.statusClass[data.statusCode] : $.statusClass["100"];
					 $("#statusBtn").removeAttr("class").addClass("text-center").text(data.statusDesc).addClass(_class);
					 $("#statusTitle").text(data.statusDesc);
					 $("#statusMessage").text(data.incompleteReason);
					 $("#cellTitle").text(data.procName);
					 var delayTime = data.delayTime ? data.delayTime+"分钟" :"--";
					 $("#detailDelayTime").text(delayTime);
					 var planEndTime = data.planEndTime ? DateFmt.Formate(data.planEndTime,"yyyy-MM-dd HH:mm:ss") :"--";
					 $("#planCompleteTime").text(planEndTime);
					 var actualEndTime = data.actualEndTime ? DateFmt.Formate(data.actualEndTime,"yyyy-MM-dd HH:mm:ss") :"--";
					 $("#actualEndTime").text(actualEndTime);
					 var actualRunTime = data.actualRunTime ? DateFmt.MillisecondToDate(data.actualRunTime):"--"
					$("#actualRunTime").html(actualRunTime);
					//计划开始时间-实际开始时间-标准耗时 2018-01-08
					var planStartTime = data.planStartTime ? DateFmt.Formate(data.planStartTime,"yyyy-MM-dd HH:mm:ss"):"--";
					$("#planStartTime").html(planStartTime);
					var actualStartTime = data.actualStartTime ? DateFmt.Formate(data.actualStartTime,"yyyy-MM-dd HH:mm:ss"):"--";
					$("#actualStartTime").html(actualStartTime);
					var planRunTime = data.planRunTime ? DateFmt.MillisecondToDate(data.planRunTime):"--"
					$("#planRunTime").html(planRunTime);
				}
		    });
	    };
	    /**
	     * 7天数据图表
	     */
	    model.getDelayConditionCharts = function (rowObject){
		    	var option = {
		    		    title: {
		    		        text: '近7次执行情况',
		    		        subtext: ''
		    		    },
		    		    tooltip: {
		    		        trigger: 'axis'
		    		    },
		    		    legend: {
		    		        data:['延迟时间']
		    		    },
		    		    toolbox: {
		    		        show: false,
		    		        feature: {
		    		            dataZoom: {
		    		                yAxisIndex: 'none'
		    		            },
		    		            dataView: {readOnly: false},
		    		            magicType: {type: ['line', 'bar']},
		    		            restore: {},
		    		            saveAsImage: {}
		    		        }
		    		    },
		    		    xAxis:  {
		    		        type: 'category',
		    		        boundaryGap: false,
		    		        data: []
		    		    },
		    		    yAxis: {
		    		        type: 'value',
		    		        axisLabel: {
		    		            formatter: '{value} '
		    		        },
		    		        splitNumber:4
		    		    },
		    		    series: [
		    		        {
		    		            name:'延迟时间',
		    		            type:'line',
		    		            data:[],
		    		            markPoint: {
		    		                data: [
		    		                ]
		    		            } 
		    		        }
		    		    ]
		    		};
		    	$.AIGet({
				url:$.ctx + "/api/sched/dispatch/detail/history",
				datatype:"json",
				data:rowObject,
				success:function(result){
					var xAxisData = [];
					var seriesData = [];
					var markPointData = [];
					var data = result.data;
					for(var i=data.length-1;i>=0;i--){
						//var date = DateFmt.Formate(data[i].date,"yyyy-MM-dd");
						var date = DateFmt.Formate(data[i].date,"MM-dd");
						xAxisData.push(date)
						seriesData.push(data[i].delayTime);
						if(data[i].delayTime>0 && data[i].runStatus == 100){
							markPointData.push({
//									title: 'sd', value:data[i].delayTime, xAxis: date, yAxis: data[i].delayTime,symbol:"../../../stylesheets/theme/default/images/echartsIcon.png"
							    value:data[i].delayTime, xAxis: date, yAxis: data[i].delayTime,symbol:"../../../public/stylesheets/theme/default/images/echartsIcon.png"
							})
						}
					}
					option.xAxis.data = xAxisData;
					option.series[0].data = seriesData;
					option.series[0].markPoint.data = markPointData;
					var myChart = echarts.init(document.getElementById('appCharts'));
					// 使用刚指定的配置项和数据显示图表。
					myChart.setOption(option);
				}
		    	});
	    };
	    /***
	     * 调度
	     */
	    model.loadScheduleData = function(rowObject){
	    		var statusCode = $("#scheduleStatusType").val();
			var searchText = $("#searchText").val();
			rowObject.statusCode=statusCode;
			rowObject.searchText=searchText;
			$.jgrid.gridUnload("schedulejsonmap");
	    		$("#schedulejsonmap").AIGrid({        
			   	url: $.ctx + '/api/sched/dispatch/detail/control',
				datatype: "json",
				postData:rowObject,
			   	colNames:['id','程序名称','程序英文名称','周期', '状态', '执行Agent','数据日期','创建时间','开始时间','结束时间','运行时长','负责人'],
			   	colModel:[
			   		{name:'id',index:'id', width:0, sortable:false,hidden:true },//frozen : true固定列
			   		{name:'procName',index:'proc_name', width:110,align:"left",formatter:setAppName},
			   		{name:'procNameEn',index:'proc_name_en', width:80,align:"left",formatter:$.setNull},
			   		{name:'runFreq',index:'run_freq', width:50,align:"center",formatter:function(cellvalue){return $.runFreqObj[cellvalue]}},
			   		{name:'statusDesc',index:'status_code',align:"center", width:70,color:"statusColor",formatter:$.setStatus},
			   		{name:'agentCode',index:'agent_code', width:80, align:"center"},
			   		{name:'dataTime',index:'data_time', width:80, align:"center",formatter:DateFmt.dataDateFormate},		
			   		{name:'creatTime',index:'start_time', width:80,align:"center",formatter:DateFmt.dateFormatter},		
			   		{name:'actualStartTime',index:'actual_start_time', width:80,align:"center",formatter:DateFmt.dateFormatter},		
			   		{name:'actualEndTime',index:'actual_end_time', width:80,align:"center",formatter:DateFmt.dateFormatter},		
			   		{name:'consumeTime',index:'consume_time', width:40,align:"center",formatter:DateFmt.dateFormatterSecond},		
			   		{name:'creater',index:'creater', width:50,align:"center"}
			   	],
			   	rowNum:10,
			   	rowList:[10,20,30],
			   	pager: '#schedulepjmap',
			   	sortname: '',
			    viewrecords: true,
			    multiselect:false,
				rownumbers:false,
			    sortorder: "desc",
				jsonReader: {
					repeatitems : false,
					id: "0"
				},
				height: '100%' 
			});	
	    		function setAppName(cellvalue, options, rowObject){
	        		var $rowObj = $("#"+options.rowId);
	        		if(rowObject.statusColor == "red"){//状态值
	        			var html = '<span class="ui-delay-icon"></span><span>'+cellvalue+'</span>'
	        			return html;
	        		}else{
	        			return cellvalue;
	        		}
	        	}
	    };
	    /***
	     * 接口
	     */
	    model.loadInterfaceData = function(rowObject){
	    		var statusCode = $("#interfaceStatusType").val();
		    	var searchText = $("#interfaceSearchText").val();
		    	rowObject.statusCode=statusCode;
		    	rowObject.searchText=searchText;
		    	$.jgrid.gridUnload("interfacejsonmap");
		    	$("#interfacejsonmap").AIGrid({        
			   	url: $.ctx + '/api/sched/dispatch/detail/inter',
				datatype: "json",
				postData:rowObject,
			   	colNames:['JOB名称','JOB英文名称','周期', '数据日期', '状态','检验结果','开始时间','结束时间','运行时长','负责人'],
			   	colModel:[
			   		{name:'procName',index:'proc_name', width:100,align:"left"},
			   		{name:'procNameEn',index:'proc_name_en', width:80,align:"left",formatter:$.setNull},
			   		{name:'runFreq',index:'run_freq', width:50,formatter:function(cellvalue){return $.runFreqObj[cellvalue]}, align:"center"},
			   		{name:'dataTime',index:'data_time', width:40,formatter:DateFmt.dataDateFormate, align:"center"},
			   		{name:'statusName',index:'status_code', width:50, align:"center",color:"statusColor",formatter:$.setStatus},
			   		{name:'checkResult',index:'check_result', width:50, align:"center"},		
			   		{name:'actualRunTime',index:'actual_start_time', width:70,align:"center",formatter:DateFmt.dateFormatter},		
			   		{name:'actualEndTime',index:'actual_end_time', width:70, align:"center",formatter:DateFmt.dateFormatter},		
			   		{name:'excuteTime',index:'consume_time', width:80, align:"center",formatter:DateFmt.dateFormatterSecond},		
			   		{name:'admin',index:'creater', width:50, align:"center"}		
			   	],
			   	rowNum:10,
			   	rowList:[10,20,30],
			   	pager: '#schedulepjmap',
			   	sortname: '',
			    viewrecords: true,
			    multiselect:false,
				rownumbers:false,
			    sortorder: "desc",
				jsonReader: {
					repeatitems : false,
					id: "0"
				},
				height: '100%' 
			});	
	    };
	    /**
	     * 接口事件
	     */
	    model.searchInterfaceList = function(rowObject){
		    	$("#interfaceSearchBtn").click(function(){
		    		var statusCode = $("#interfaceStatusType").val();
			    	var searchText = $("#interfaceSearchText").val();
		    		$("#interfacejsonmap").jqGrid('setGridParam',{ 
		    			postData:{
		    				searchText:searchText,
		    				statusCode:statusCode
		    			}
		    		}).trigger("reloadGrid");
		    	});
		    	$("#interfaceExportBtn").click(function(){
		    		var exportData = {};
		    		var statusCode = $("#interfaceStatusType").val();
			    	var searchText = $("#interfaceSearchText").val();
	    			exportData.searchText =searchText;
	    			exportData.statusCode = statusCode? statusCode :"";
	    			exportData.procId = rowObject.procId;
	    			exportData.runTime = rowObject.runTime;
		    		
		    		var ssg = window.sessionStorage;
		    		var token="";
		    		if(ssg){
		    			token = ssg.getItem("token");
		    			if(token){
		    				exportData["token"]= token;
		    				exportData = $.convertData(exportData);
		    				window.open(encodeURI($.ctx + "/api/sched/dispatch/detail/inter/export?"+exportData));
		    			}
		    		}
		    	});
	    };
	    /**
	     * 调度查询
	     */
	    model.searchScheduleList = function(rowObject){
	    		$("#scheduleSearchBtn").click(function(){
	    			var statusCode = $("#scheduleStatusType").val();
	    			var searchText = $("#searchText").val();
	    			$("#schedulejsonmap").jqGrid('setGridParam',{ 
	    	            postData:{
		    	            	searchText:searchText,
		    	            	statusCode:statusCode
	    	            }
	    	        }).trigger("reloadGrid");
	    		});
	    		$("#scheduleExportBtn").off("click").on("click",function(){
	    			var exportData = {};
	    			var statusCode = $("#scheduleStatusType").val();
	    			var searchText = $("#searchText").val();
	    			exportData.searchText =searchText;
	    			exportData.statusCode = statusCode? statusCode :"";
	    			exportData.procId = rowObject.procId;
	    			exportData.runTime = rowObject.runTime;
	    			var ssg = window.sessionStorage;
	    		    var token="";
	    			if(ssg){
	    				token = ssg.getItem("token");
	    				if(token){
	    					exportData["token"]= token;
	    					exportData = $.convertData(exportData);
	    					window.open(encodeURI($.ctx + "/api/sched/dispatch/detail/control/export?"+exportData));
	    				}
	    			}
	    		});
	    };
	    model.loadBasicInfo = function(rowObject){
    			$.AIGet({
				url:$.ctx + "/api/sched/dispatch/detail/basicInfo",
				datatype:"json",
				data:rowObject,
				success:function(result){
					var data = result.data;
					for(var key in data){
						if(data[key] && (key.indexOf("Time") != -1)){
							data[key] = DateFmt.dateFormatter(data[key])
						}else if(data[key] && (key.indexOf("Date") != -1)){
							data[key] = DateFmt.dataDateFormate(data[key])
						}else if(data[key] && (key.indexOf("planStartTime") != -1)){//计划开始时间
							data[key] = DateFmt.dateFormatter(data[key])
						}else if(data[key] && (key.indexOf("actualStartTime") != -1)){//实际开始时间
							data[key] = DateFmt.dateFormatter(data[key])
						}else if(data[key] && (key.indexOf("planRunTime") != -1)){//标准所消耗时间
							data[key] =DateFmt.dateFormatterSecond(data[key])
						}else if(data[key] && key.indexOf("Level") != -1){
							$("#itemPeriodInfo").html($.runFreqObj[data.runFreq]);
							data[key] = $.priLevelObj[data[key]];
						}
						$("#BI"+key).html(data[key]);
					}
				}
		    });
	    };
	    /***
	     * 数据字典2018-01-08
	     */
	    model.loadDictionaryData = function(rowObject){
		    	$.jgrid.gridUnload("dictionaryjsonmap");
		    	$("#dictionaryjsonmap").AIGrid({        
			   	url: $.ctx + '/api/appMonitor/common/dictionary',
				datatype: "json",
				postData:{"procId":rowObject.procId},
			   	colNames:['中文表名','字段英文名', '字段中文名'],
			   	colModel:[
			   		{name:'tableNameCn',index:'table_name_cn', width:100,align:"center"},
			   		{name:'columnsNameEn',index:'columns_name_en', width:100,align:"center"},
			   		{name:'columnsNameCn',index:'columns_name_cn', width:100,align:"center"},
			   	],
			   	rowNum:10,
			   	rowList:[10,20,30],
			   	pager: '#dictionarypjmap',
			   	sortname: '',
			    viewrecords: true,
			    multiselect:false,
				rownumbers:false,
			    sortorder: "desc",
				jsonReader: {
					repeatitems : false,
					id: "0"
				},
				height: '100%' 
			});	
		    
	    };
	    model.loadAPPVisList = function(rowObject){
	    	var postData = {};
	    	postData.runTime = rowObject.runTime;
	    	postData.procId = rowObject.procId;
	    	$.jgrid.gridUnload("visjsonmap");
	    	$("#visjsonmap").AIGrid({        
	    	   	url: $.ctx + '/api/sched/dispatch/detail/proced',
	    		datatype: "json",
	    		postData:postData,
	    	   	colNames:['编号',/*'上级ID',*/'上级程序英文名称','上级程序名称','编号','程序英文名称','程序名称','重要程度',/*'状态',*/'来源'],
	    	   	colModel:[
	    	   		{name:'fserialNbr',index:'fserial_nbr', sortable:false, width:40,align:"center",formatter:$.setNull},		
	    	   		/*{name:'sourceId',index:'source_id', width:80,align:"center",formatter:$.setNull},*/
	    	   		{name:'fprocNameEn',index:'fproc_name_en', width:100,align:"center",formatter:$.setNull},
	    	   		{name:'fprocNameZn',index:'fproc_name_zn', width:80,align:"center",formatter:$.setNull},
	    	   		/*{name:'procId',index:'proc_id', width:50,align:"center",formatter:$.setNull},*/
	    	   		{name:'serialNbr',index:'serial_nbr', sortable:false, width:40,align:"center"},	
	    	   		{name:'procNameEn',index:'proc_name_en', width:100,align:"center",formatter:$.setNull},
	    	   		{name:'procNameZn',index:'proc_name_zn', width:80,align:"center",formatter:$.setNull},
	    	   		{name:'pri_level',index:'pri_level', width:60,align:"center",formatter:$.setImpLevel},
//	    	   		{name:'statusDesc',index:'status_desc', width:40,align:"center",color:"statusColor",formatter:$.setStatus},		
	    	   		{name:'originSystem',index:'origin_system', width:60,align:"center",formatter:$.setNull}
	    	   	],
	    	   	rowNum:6,
	    	   	rownumbers:true,
	    	   	rowList:[6,10,50,100,200],
	    	   	pager: '#vispjmap',
	    	   	sortname: '',
	    	    viewrecords: true,
	    	    multiselect:false,
	    		rownumbers:false,
	    	    sortorder: "desc",
	    		jsonReader: {
	    			repeatitems : false,
	    			id: "0"
	    		},
	    		height: '246' 
	    	});	
	    	function formatePriLevel(cellvalue, options, rowObject){
        		var priLevel = rowObject.pri_level;
        		var priLevelObj =$.priLevelObj;
        		return priLevelObj[priLevel] || '-';
        	}

	    	$("#searchAPPEffectBox").off("click").on("click",function(){
	    		postData.searchText = $("#searchAPPVisList").val();
	    		postData.statusCode = $("#visStatusType").val();
	    		postData.priLevel = $("#visImportantType").val();
	    		 $("#visjsonmap").jqGrid('setGridParam',{ 
		            postData:postData
		         }).trigger("reloadGrid");
	    	});
	    	//第二屏导出
	    	$("#exportAPPEffectBox").off("click").on("click",function(){
	    		var exportData = {};
	    		exportData.runTime = rowObject.runTime;
	    		exportData.procId = rowObject.procId;
	    		exportData.searchText = $("#searchAPPVisList").val();
	    		exportData.statusCode = $("#visStatusType").val();
	    		exportData.priLevel = $("#visImportantType").val();
	    		exportData.priLevel = !postData.priLevel ? "" : postData.priLevel;
	    		exportData.statusCode = !postData.statusCode ? "" : postData.statusCode;
	    		var token="";
	    		var ssg = window.sessionStorage;
	    		if(ssg){
	    			token = ssg.getItem("token");
	    			if(token){
	    				exportData["token"]= token;
	    				exportData = $.convertData(exportData);
	    				window.open(encodeURI(encodeURI($.ctx + "/api/sched/dispatch/detail/proced/export?"+exportData)));
	    			}
	    		}
	    	});
	    };
	    /***
	     * 关系图
	     */
	    model.loadVisData = function(rowObject){
    		if(!rowObject.needLevel){
    			rowObject.needLevel = 3;
    		}
    		var appUrl = $.ctx + "/api/sched/dispatch/detail/blood/graph";
	      	$.AIGet({
				url:appUrl,//$.ctx + "/api/appMonitor/realTime/procBloodGraph",
				datatype:"json",
				data:rowObject,
				success:function(result){
					if(!result.nodes) return;
					  var container = document.getElementById('ssMynetwork');
				      var network = model.network = new vis.Network(container, result, $.visOptions);
				      //节点点击
			      	  network.on("selectNode",function(param){//TODO
			      		rowObject.proc_2_Id = param.nodes[0];
			      		$("#expandTableVIS").attr("needLevel",3);
			      		$("#shrinkTableVIS").attr("needLevel",3);
			      		$("#shrinkTableVIS2").attr("needLevel",3);
			      		$("#expandTableVIS2").attr("needLevel",3);
			      		rowObject.tableLevel =3;
			      		schedulerMonitor.loadTableInfoVis(rowObject, $.visOptions);
			      		schedulerMonitor.loadTab2(rowObject,$.visOptions);
			      		if(!$("#tableEffectList").is(":hidden")){//
			    			 $("#visTreejsonmap").jqGrid('setGridParam',{ 
						            postData:rowObject
						        }).trigger("reloadGrid");
			    		}
			          });
				      if(rowObject.isError){
					    	  $("#expandVIS").attr("disabled","disabled");
					    	  $("#shrinkVIS").attr("disabled","disabled");
					    	  return;
				      }
				      var needLevel = $("#expandVIS").attr("needLevel");
				      needLevel = parseInt(needLevel);
//				      $("#appProgressbar").width((needLevel/result.maxLevel)*100+"%");
				      if(needLevel >= result.maxLevel){
				    	  	$("#expandVIS").attr("disabled","disabled");
				      }else{
			    	  		$("#expandVIS").removeAttr("disabled");
				      }
				      if( result.maxLevel <=3){
		    	  		  $("#shrinkVIS").attr("disabled","disabled");
		    	       }else{
		    	  		  $("#shrinkVIS").removeAttr("disabled");
		    	  	  }
			      $(".J_maximize").off("click").on("click",function(){
					  $("#maxDiagramBox").removeClass("hidden");
					  var maxDiagramcontainer = document.getElementById('maxDiagram');
				      var maxDiagram = new vis.Network(maxDiagramcontainer, result, $.visOptions);
				  });
				  $(".J_minDiagram").off("click").on("click",function(){
					  $("#maxDiagramBox").addClass("hidden");
				  });
				}
	      	});
	      	$("#expandVIS").off("click").on("click",function(){
	      		if($(this).is(":disabled")){
	      			return;
	      		}
    			if(!$("#showOnlyError").hasClass("active")){
    				rowObject.isError= false;
    			}else{
    				rowObject.isError= true;
    			}
    			var needLevel = $(this).attr("needLevel");
    			needLevel = parseInt(needLevel);
    			rowObject.needLevel = needLevel+1;
    			$(this).attr("needLevel",rowObject.needLevel);
    			$("#shrinkVIS").attr("needLevel",rowObject.needLevel);
    			schedulerMonitor.loadVisData(rowObject);
	      	});
	      	$("#shrinkVIS").off("click").on("click",function(){
	      		if($(this).is(":disabled")){
	      			return;
	      		}
	      		if(!$("#showOnlyError").hasClass("active")){
	      			rowObject.isError= false;
	      		}else{
	      			rowObject.isError= true;
	      		}
	      		var needLevel = $(this).attr("needLevel");
	      		needLevel = parseInt(needLevel);
	      		rowObject.needLevel = needLevel - 1;
	      		if(needLevel <=3){
	      			 $(this).attr("disabled","disabled");
	      			return;
	      		}
	      		$(this).attr("needLevel",rowObject.needLevel);
	      		$("#expandVIS").attr("needLevel",rowObject.needLevel);
	      		schedulerMonitor.loadVisData(rowObject);
	      	});
	      	
	    };
	    
	    
	    
	    /***
	     * 第三屏 tab2关系图点击第二屏节点
	     */
	    model.loadTab2 = function(rowObject,options){
	    	$("#tableEffectList2").addClass("hidden");
    		$("#tableEffectBtn2").removeClass("active");
	    	if(!rowObject.tableLevel){
    			rowObject.tableLevel = 3;
    		}
	    	rowObject.isNew=true;
    		var appUrl = $.ctx + "/api/sched/dispatch/detail/affact/graph";
    		rowObject.tableEffectUrl = $.ctx + '/api/sched/dispatch/affact/detail/proced';
//    		if(rowObject.historyTableUrl){
//    			appUrl = rowObject.historyTableUrl; 
//    			rowObject.tableEffectUrl = $.ctx + '/api/appMonitor/common/affect/details/procs';
//    		}
    		var newPostData = {};
    		newPostData = $.extend(newPostData,rowObject);
    		newPostData.procId = rowObject.proc_2_Id;
	    	$.AIGet({
				url:appUrl,//$.ctx + "/api/appMonitor/realTime/procTableGraph",
				datatype:"json",
				data:newPostData,
				success:function(result){
				  var container = document.getElementById('uiTab2');
				  var tableNetWork = new vis.Network(container, result, $.visOptions);
				  var needLevel = $("#expandTableVIS2").attr("needLevel");
			      needLevel = parseInt(needLevel);
			      $("#tableProgressbar").width((needLevel/result.maxLevel)*100+"%");		
			      if(needLevel >= result.maxLevel){
			    	  $("#expandTableVIS2").attr("disabled","disabled");
			      }else{
		    	  	  $("#expandTableVIS2").removeAttr("disabled");
			      }
			      if( result.maxLevel <=3){
	    	  		  $("#shrinkTableVIS2").attr("disabled","disabled");
	    	       }else{
	    	  		  $("#shrinkTableVIS2").removeAttr("disabled");
	    	  	  }
				}
	         });
  
	         $("#expandTableVIS2").off("click").on("click",function(){
	      		if($(this).is(":disabled")){
	      			return;
	      		}
    			var needLevel = $(this).attr("needLevel");
    			needLevel = parseInt(needLevel);
    			rowObject.tableLevel =newPostData.tableLevel= needLevel+1;
    			$(this).attr("needLevel",rowObject.tableLevel);
    			$("#shrinkTableVIS2").attr("needLevel",rowObject.tableLevel);
    			schedulerMonitor.loadTab2(newPostData, $.visOptions);  
	      	});
	      	$("#shrinkTableVIS2").off("click").on("click",function(){
	      		if($(this).is(":disabled")){
	      			return;
	      		}
	      		var needLevel = $(this).attr("needLevel");
	      		needLevel = parseInt(needLevel);
	      		rowObject.tableLevel =newPostData.tableLevel = needLevel - 1;
	      		if(needLevel <=3){
	      			 $(this).attr("disabled","disabled");
	      			return;
	      		}
	      		$(this).attr("needLevel",rowObject.tableLevel);
	      		$("#expandTableVIS2").attr("needLevel",rowObject.tableLevel);
	      		schedulerMonitor.loadTab2(newPostData, $.visOptions);
	      	});
	      	$("#tableEffectBtn2").off("click").on("click",function(){
	      		$("#visStatusType2").parent().hide();
	      		if($(this).hasClass("active")){
    				$(this).removeClass("active");
    				$("#tableEffectList2").addClass("hidden");
    			}else{
    				$(this).addClass("active");
    				$('#tableSearchBox2').val('');
    				$("#tableEffectList2").removeClass("hidden");
    				newPostData.statusCode=null;
    				newPostData.priLevel=null;
    				schedulerMonitor.loadtableVisList(newPostData);
    				model.loadStatusList("#visStatusType2");//获取选择状态下拉列表
    				model.loadPriLevelList("#visImportantType2");//获取重要程度下拉列表
    			}
	      	});
	      	
	    }
	    
	    /***
	     * 第三屏 应用表关系图
	     */
	    model.loadTableInfoVis = function(rowObject,options){
	    	var scrollTop = $("#appTableInfoPanel").removeClass("hidden").offset().top;
    		$('html,body').animate({"scrollTop": scrollTop }, 500 );
    		$("#tableEffectList").addClass("hidden");
    		$("#tableEffectBtn").removeClass("active");
    		$("#tableEffectList2").addClass("hidden");
    		$("#tableEffectBtn2").removeClass("active");
    		if(!rowObject.tableLevel){
    			rowObject.tableLevel = 3;
    		}
    		var appUrl = $.ctx + "/api/sched/dispatch/detail/procTableGraph";
    		var newPostData = {};
    		newPostData = $.extend(newPostData,rowObject);
    		newPostData.procId = rowObject.proc_2_Id;
	    	$.AIGet({
				url:appUrl,//$.ctx + "/api/appMonitor/realTime/procTableGraph",
				datatype:"json",
				data:newPostData,
				success:function(result){
				  $("#appInfoName").text(result.data.name);
				  var container = document.getElementById('tableNetwork');
				  var tableNetWork = new vis.Network(container, result, $.visOptions);
				  var needLevel = $("#expandTableVIS").attr("needLevel");
			      needLevel = parseInt(needLevel);
			      $("#tableProgressbar").width((needLevel/result.maxLevel)*100+"%");
			      if(needLevel >= result.maxLevel){
			    	  $("#expandTableVIS").attr("disabled","disabled");
			      }else{
		    	  	  $("#expandTableVIS").removeAttr("disabled");
			      }
			      if( result.maxLevel <=3){
	    	  		  $("#shrinkTableVIS").attr("disabled","disabled");
	    	       }else{
	    	  		  $("#shrinkTableVIS").removeAttr("disabled");
	    	  	  }
				}
	         });
	         $("#closeAppTablePanel").click(function(){
	        	 model.network.unselectAll();
	        	 var scrollTop = $("#tableCellInfo").offset().top;
	    		 $('html,body').stop().animate({"scrollTop": scrollTop }, 500 );
	        	 $(this).parent().parent().addClass("hidden");
	        	 $(this).parent().parent().find(".tab-pane").eq(0).addClass("active").siblings(".tab-pane").removeClass("active");
	        	 $(".ui-tabs-box #tabList  li").eq(0).addClass("active").siblings("li").removeClass("active")
	         });   
	         $("#expandTableVIS").off("click").on("click",function(){
	      		if($(this).is(":disabled")){
	      			return;
	      		}
    			var needLevel = $(this).attr("needLevel");
    			needLevel = parseInt(needLevel);
    			rowObject.tableLevel =newPostData.tableLevel = needLevel+1;
    			$(this).attr("needLevel",rowObject.tableLevel);
    			$("#shrinkTableVIS").attr("needLevel",rowObject.tableLevel);
    			schedulerMonitor.loadTableInfoVis(newPostData, $.visOptions);
	      	});
	      	$("#shrinkTableVIS").off("click").on("click",function(){debugger
	      		if($(this).is(":disabled")){
	      			return;
	      		}
	      		var needLevel = $(this).attr("needLevel");
	      		needLevel = parseInt(needLevel);
	      		if(needLevel <=3){
	      			 $(this).attr("disabled","disabled");
	      			return;
	      		}
	      		rowObject.tableLevel =newPostData.tableLevel = needLevel - 1;
	      		$(this).attr("needLevel",rowObject.tableLevel);
	      		$("#expandTableVIS").attr("needLevel",rowObject.tableLevel);
	      		schedulerMonitor.loadTableInfoVis(newPostData, $.visOptions);
	      	});
	      	$(".J_appCell").hide();
	      	//$(".J_search").removeClass("col-md-6").addClass("col-md-9");
	      	$("#tableEffectBtn").off("click").on("click",function(){
	      		if($(this).hasClass("active")){
    				$(this).removeClass("active");
    				$("#tableEffectList").addClass("hidden");
    			}else{
    				$(this).addClass("active");
    				$('#tableSearchBox').val('');
    				$("#tableEffectList").removeClass("hidden");
    				schedulerMonitor.loadtableVisList(newPostData);
    			}
	      		
	      	});
	      //导出受影响关系表2018-01-15
	      	$("#exportExecl").off("click").on("click",function(){
	      		var exportData = {};
	    		exportData.runTime = newPostData.runTime;
	    		exportData.procId = newPostData.procId;
	    		var token="";
	    		var ssg = window.sessionStorage;
	    		if(ssg){
	    			token = ssg.getItem("token");
	    			if(token){
	    				exportData["token"]= token;
	    				exportData = $.convertData(exportData);
	    				window.open(encodeURI(encodeURI($.ctx + "/api/sched/dispatch/detail/tables/colexport?"+exportData)));
	    			}
	    		}
	    	});
	    };
	    model.loadtableVisList = function(rowObject){
	    	rowObject.search = $("#tableSearchBox").val();
	    	rowObject.searchText = $("#tableSearchBox2").val();//TODO
	    	rowObject.appName="",
	    	$.jgrid.gridUnload("visTreejsonmap");
	    	$.jgrid.gridUnload("visTreejsonmap2");
	    	$("#visTreejsonmap").AIGrid({        
	    	   	url: $.ctx + '/api/sched/dispatch/detail/procTableList',
	    		datatype: "json",
	    		postData:rowObject,
	    	   	colNames:['编号','ID','表名称'],
	    	   	colModel:[
	    	   	    {name:'serialNbr',index:'serial_nbr', sortable:false, width:50,align:"center"},
	    	   		{name:'xmlid',index:'xml_id', width:100,align:"left"},		
	    	   		{name:'dataCnName',index:'data_CnName', width:150,align:"left"},		
	    	   	],
	    	   	rowNum:6,
	    	   	rowList:[6,15,30],
	    	   	pager: '#visTreepjmap',
	    	   	sortname: '',
	    	    viewrecords: true,
	    	    multiselect:false,
	    		rownumbers:false,
	    	    sortorder: "desc",
	    		jsonReader: {
	    			repeatitems : false,
	    			id: "0"
	    		},
	    		height: '246' 
	    	});	
	    	$("#visTreejsonmap2").AIGrid({        
	    		url: rowObject.tableEffectUrl,
	    		datatype: "json",
	    		postData:rowObject,
	    		colNames:['编号','程序英文名称','程序名称','重要程度'/*,'状态'*/],
	    	   	colModel:[
	    	   		{name:'serialNbr',index:'serial_nbr', sortable:false, width:40,align:"center"},	
	    	   		{name:'procNameEn',index:'proc_name_en', width:100,align:"center",formatter:$.setNull},
	    	   		{name:'procNameZn',index:'proc_name_zn', width:80,align:"center",formatter:$.setNull},
	    	   		{name:'pri_level',index:'pri_level', width:60,align:"center",formatter:$.setImpLevel},
//	    	   		{name:'statusDesc',index:'status_desc', width:40,align:"center",color:"statusColor",formatter:$.setStatus}			    	   		
	    	   	],
    			rowNum:6,
    			rowList:[6,15,30],
    			pager: '#visTreepjmap2',
    			viewrecords: true,
    			multiselect:false,
    			rownumbers:false,
    			jsonReader: {
    				repeatitems : false,
    				id: "0"
    			},
    			height: '246' 
	    	});	
	    	$("#effectTableBTN").off("click").on("click",function(){
	    		rowObject.search = $("#tableSearchBox").val();
	    		 $("#visTreejsonmap").jqGrid('setGridParam',{ 
		            postData:rowObject
		         }).trigger("reloadGrid");
	    	});
	    	$("#effectTableBTN2").off("click").on("click",function(){
	    		rowObject.appName = $("#searchAPPVisList").val();
	    		rowObject.runStatus = $("#visStatusType2").val();
	    		rowObject.priLevel = $("#visImportantType2").val();
	    		rowObject.searchText = $("#tableSearchBox2").val();
	    		$("#visTreejsonmap2").jqGrid('setGridParam',{ 
	    			postData:rowObject
	    		}).trigger("reloadGrid");
	    	});
	    	//第三屏导出
	    	$("#exportAPPEffectBox3").off("click").on("click",function(){
	    		var exportData = {};
	    		exportData.runTime = rowObject.runTime;
	    		exportData.procId = rowObject.procId;
	    		exportData.search = $("#tableSearchBox").val();
	    		var token="";
	    		var ssg = window.sessionStorage;
	    		if(ssg){
	    			token = ssg.getItem("token");
	    			if(token){
	    				exportData["token"]= token;
	    				exportData = $.convertData(exportData);
	    				window.open(encodeURI(encodeURI($.ctx + "/api/sched/dispatch/detail/tables/export?"+exportData)));
	    			}
	    		}
	    	});
	    	
	    	$("#exportAPPEffectBox4").off("click").on("click",function(){
	    		var exportData = {};
	    		exportData.runTime = rowObject.runTime;
	    		exportData.procId = rowObject.procId;
	    		exportData.searchText = $("#tableSearchBox2").val();
	    		exportData.runStatus = $("#visStatusType2").val();
	    		exportData.priLevel = $("#visImportantType2").val();
	    		var token="";
	    		var ssg = window.sessionStorage;
	    		if(ssg){
	    			token = ssg.getItem("token");
	    			if(token){
	    				exportData["token"]= token;
	    				exportData = $.convertData(exportData);
	    				window.open(encodeURI(encodeURI($.ctx + "/api/sched/affect/details/procs/export?"+exportData)));
	    			}
	    		}
	    	});
	    	
	    }
        return model;
        
   })(window.schedulerMonitor || {});