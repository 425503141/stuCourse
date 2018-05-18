/**
 * ------------------------------------------------------------------
 * 应用监控-实时监控
 * ------------------------------------------------------------------
 */
var realTimeMonitor = (function (model){
        //开发版本号
        model.version = "1.0.0";
        model.author  = "wangsen3";
        model.email   = "wangsen3@asiainfo.com";       
        model.network = {};
        /**
         * @description 获取应用列表
         * @param  option
         * @return  
         * ------------------------------------------------------------------
         */
        model.loadAppGrid = function(option) {
	        	$("#APPList").AIGrid({        
	        	   	url:$.ctx + '/api/appMonitor/realTime/list',
	        		datatype: "json",
	        		postData:{runFreq : $("#cycleType").val()},
	        	   	colNames:['id','应用名称','应用分类', '周期', '重要程度','数据日期','偏移量','计划完成时间','实际完成时间','状态','操作'],
	        	   	colModel:[
	        	   		{name:'appId',index:'appId', width:0, sortable:false,hidden:true },//frozen : true固定列
	        	   		{name:'appName',index:'app_name', width:90,align:"left",formatter:setAppName},
	        	   		{name:'appClassifyName',index:'app_classify_name', width:90, align:"center"},
	        	   		{name:'runFreq',index:'run_freq', width:50,formatter:formateRunFreq, align:"center"},
	        	   		{name:'impLevel',index:'imp_level', width:50, align:"center",formatter:$.setImpLevel},
	        	   		{name:'dataTime',index:'data_time', width:80, align:"center",formatter:DateFmt.dataDateFormate},
	        	   		{name:'dateArgs',index:'date_args', width:50, align:"center"},
	        	   		{name:'planEndTime',index:'plan_end_time', width:80,align:"center",formatter:DateFmt.dateFormatter},		
	        	   		{name:'actualEndTime',index:'actual_end_time', width:80,align:"center",formatter:DateFmt.dateFormatter},		
	        	   		{name:'statusName',index:'status_order',color:"statusColor", width:80,align:"center",formatter:$.setStatus},		
	        	   		{name:'op',index:'op', width:130,title:false, sortable:false,formatter:del,align:"center"}		
	        	   	],
	        	   	rowNum:10,
	        	   	rowList:[10,20,30],
	        	   	pager: '#APPListPager',
	        	   	sortname: '',
	        	    viewrecords: true,
	        	    multiselect:false,
	        		rownumbers:false,
	        	    sortorder: "desc",
	        		jsonReader: {
	        			repeatitems : false,
	        			id: "0"
	        		},
	        		afterGridLoad:function(){
	        	    	$("#tableCellInfo,#appTableInfoPanel").addClass("hidden");
	        	    },
	        		height: '100%',
	        		showNoResult:true//是否展示无数据时的样式
	        	});	
	        	function formateRunFreq(cellvalue, options, rowObject){
	        		var runFreq = rowObject.runFreq;
	        		var runFreqObj =$.runFreqObj;
	        		return runFreqObj[runFreq] || runFreq;
	        	}
	        	function setAppName(cellvalue, options, rowObject){
	        		var $rowObj = $("#"+options.rowId);
	        		if(rowObject.statusColor == "red"){//状态值
	        			var html = '<span class="ui-delay-icon"></span><span>'+rowObject.appName+'</span>';
	        			return html;
	        		}else{
	        			var html = '<span class="ui-empty-icon v-hidden"></span>'+rowObject.appName;
	        			return html;
	        			//return rowObject.appName;
	        		}
	        	}
	        	function del(cellvalue, options, rowObject){
	        		var rowObjectStr = JSON.stringify(rowObject) ;
	        		var html='<button type="button" class="btn btn-default  ui-table-btn ui-table-btn" onclick=\'realTimeMonitor.showTableCellInfo('+rowObjectStr+')\'>查看</button><button type="button" class="btn btn-default ui-table-btn" id="'+rowObject.appId+'" data-delaytime ="'+rowObject.delayTime+'" data-appName="'+rowObject.appName+'"  data-incompletereason ="'+rowObject.incompleteReason+'" onclick="realTimeMonitor.sendSMSDlg(this);">短信</button><button type="button" class="btn btn-default  ui-table-btn ui-table-btn -hidden" onclick=\'realTimeMonitor.sendMemoDlg('+rowObjectStr+')\'>备注</button>';
	        		return html;
	        	}
        };
	    /***
	     * 获取状态列表
	     */
	    model.loadStatusList = function(dom) {
	    		$.AIGet({
	    			url:$.ctx + "/api/appMonitor/common/appStatus",
	    			datatype:"json",
	    			success:function(result){
	    				var html = "";
	    				var data = result.data;
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
//	    			 		enableFiltering:true//显示查询输入框
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
	    /***
	     * 获取全部分类
	     */
	    model.loadAllTypeList = function(appClassifyName,isReal) {
		    	var ztreeObj = new Ztree();
		    	$.AIGet({
	    			url:$.ctx + "/api/appMonitor/common/appClassifies",
	    			datatype:"json",
	    			data:{appClassifyName:appClassifyName || ""},
	    			success:function(result){
	    			 	ztreeObj.init({
		    		    		id:"appType",
								expandRoot:true,//是否展开根节点
	    					    expandRootId:'0000',//根节点的id
		    		    		setting:{
		    		    			view: {
		    		    				selectedMulti: false,
		    		    			},
		    		    			callback: {
		    		    				onClick: function(event, treeId, treeNode){
		    		    					$("#APPList").jqGrid('setGridParam',{ 
		    		    				        postData:{appClassifyId:treeNode.id}
		    		    				    }).trigger("reloadGrid");
		    		    					if(isReal&&isReal=='1'){
		    		    						realTimeMonitor.loadStatusNumber("#statusContent");//刷新状态按钮
		    		    					}else{
		    		    						historyMonitor.loadStatusNumber("#statusContent");
		    		    					}
		    		    					
		    		    				},
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
		    		    		treeData:result.nodes,
		    		    		expandAll:false
		    		    	});
	    			}
		    	});
		    	$("#searchAllType").keyup(function(e){
		    		e= e|| window.event;
		    		if(e.keyCode == 13){
		    			var  key=$(this).val();
		    			realTimeMonitor.loadAllTypeList(key);
		    		}
		    	});
		    	$("#searchAllType").next().click(function(e){
	    			var  key=$("#searchAllType").val();
	    			realTimeMonitor.loadAllTypeList(key);
		    	});
	    };
	    /***
	     * 获取状态列表以及对应个数
	     */
	    model.loadStatusNumber = function(obj) {
    		var moreQueryIpnut = formFmt.formToObj($("#queryAppMonitorForm"));
			var dataTime = $("#dataDate").val();
			var appName = $("#appName").val();
			var runFreq = $("#cycleType").val();
			moreQueryIpnut.runFreq = runFreq;
			moreQueryIpnut.dataTime = dataTime;
			moreQueryIpnut.appName = appName;
			var treeObj=$.fn.zTree.getZTreeObj("appType");
			var appClassifyId = treeObj&&treeObj.getSelectedNodes()[0] ?  treeObj.getSelectedNodes()[0].id : "";
			moreQueryIpnut.appClassifyId = appClassifyId;
		    	$.AIGet({
	    			url:$.ctx + "/api/appMonitor/common/appStatus",
	    			datatype:"json",
	    			data:moreQueryIpnut,
	    			success:function(result){
	    				var html = "";
	    				var data = result.data;
	    			 	$.AIGet({
		    		    		url:$.ctx + "/api/appMonitor/realTime/countAppStatus",
		    		    		datatype:"json",
		    		    		data:moreQueryIpnut,
		    		    		success:function(result){
		    		    			var currentArray = [];
		    		    			if(result.data.length == 0){
		    		    				currentArray = [];
		    		    				for(var i =0,len=data.length;i<len;i++){
		    		    					var currentData = $.extend(data[i],{statusCount:0});
    		    							currentArray.push(currentData);
		    		    				}
		    		    			}else{
		    		    				currentArray = [];
		    		    				for(var i =0,len=data.length;i<len;i++){
		    		    					for(var j =0,leng=result.data.length;j<leng;j++){
		    		    						if(data[i].statusCode == result.data[j].statusCode){
		    		    							var currentData = $.extend(data[i],result.data[j]);
		    		    							currentArray.push(currentData);
		    		    							break;
		    		    						} 
		    		    						if(j==leng -1){
		    		    							var currentData = $.extend(data[i],{statusCount:0});
		    		    							currentArray.push(currentData);
		    		    						}
		    		    					}
		    		    				}
		    		    			}
		    		    			// console.log(currentArray);
		    		    			 var html='';
		    		    			 $(obj).empty();
	    		    			  	 var classObj = $.statusClass;
	    		    			  	 var allCount = 0;
		    		    			 for(var i = 0,length = currentArray.length; i < length; i++ ){
		    		    				 allCount += currentArray[i].statusCount
		    		    				 var _class= classObj[currentArray[i].statusCode] ? classObj[currentArray[i].statusCode] : classObj[currentArray[0].statusCode];
		    		    				 html += '<a class="btn btn-default '+_class+'" data-statusCode="'+currentArray[i].statusCode+'" href="javascript:;" role="button"><span class="fleft">'+currentArray[i].statusName+'</span><span class="ui-btn-number fright">'+currentArray[i].statusCount+'</span></a>'
		    		    			 }
		    		    			 var allHtml = '<a class="btn btn-default ui-btn-all" data-statuscode="" href="javascript:;" role="button"><span class="fleft">应用总数</span><span class="ui-btn-number fright">'+allCount+'</span></a>'
		    		    			 $(obj).append(allHtml+html);
		    		    		}
		    		    	}); 
	    			}
	    		});
	    };
	    /**
	     * 打开短信弹框
	     */
	    model.sendSMSDlg= function(obj){
	    		sendSMS.showSMSDlg({
	    			ajaxUrl: $.ctx + "/api/appMonitor/realTime/sendMessage",
    				rowObj:obj,
    				ajaxData:{
    					appId:obj.appId
    				}
	    		});
	    		//用来服务器记录log
	    		$.AILog({
	    			  "action": "短信",//动作
	    			  "detail": "",//详情,默认为空
	    			  "module": "app_monitor_realtime"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    	    });
	    };
	    /**
         * 打开备注弹框
         */
        model.sendMemoDlg = function(rowObject){
        	var statDate = DateFmt.Formate(rowObject.statDate,"yyyy-MM-dd");
    		methodMemo.showRemarkDlg({
    			ajaxData:{
    				"statDate":statDate,//统计日期
	    			"objectId":rowObject.appId,//数据的id：应用/调度/接口ID
	    			"objectType":"A",//A:应用/P:调度/I:接口
    			},
    			"rowObj":rowObject
    		},'1');//1-实时监控 2-历史监控 3-调度监控
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
		    	rowObject.isNew=true;
	    		var scrollTop = $("#tableCellInfo").removeClass("hidden").offset().top;
	    		$('html,body').animate({"scrollTop": scrollTop }, 500 );
	    		$("#appTableInfoPanel").addClass("hidden");
	    		$("#appEffectList").addClass("hidden");
	    		$("#appEffectBtn,#tableCellInfo .nav-tabs li,#tableCellInfo .tab-content >div").removeClass("active");
	    		$("#tableCellInfo .nav-tabs li:first-child,#tableCellInfo .tab-content > div:first-child").addClass("active");
	    		realTimeMonitor.loadAppMonitorInfo(rowObject);
	    		$("#shrinkVIS").attr("needLevel",3);
	    		$("#expandVIS").attr("needLevel",3);
      		
	    		realTimeMonitor.loadVisData(rowObject);
	    		realTimeMonitor.getDelayConditionCharts(rowObject);
	    		realTimeMonitor.loadVisData(rowObject);
	    		$("#showOnlyError,#showOnlyErrorDelay").removeClass("active");
	    		$("#showOnlyError").off("click").on("click",function(){
	    			if(!$(this).hasClass("active")){
	    				$(this).addClass("active");
	    				$("#showOnlyErrorDelay").removeClass("active");
	    				rowObject.isError= true;
	    				rowObject.isDelay= false;
	    				realTimeMonitor.loadVisData(rowObject);
	    			}else{
	    				rowObject.isError= false;
	    				realTimeMonitor.loadVisData(rowObject);
	    				$(this).removeClass("active");
	    			}
	    		});
	    		$("#showOnlyErrorDelay").off("click").on("click",function(){
	    			if(!$(this).hasClass("active")){
	    				$(this).addClass("active");
	    				$("#showOnlyError").removeClass("active");
	    				rowObject.isError= false;
	    				rowObject.isDelay= true;
	    				realTimeMonitor.loadVisData(rowObject);
	    			}else{
	    				rowObject.isDelay= false;
	    				realTimeMonitor.loadVisData(rowObject);
	    				$(this).removeClass("active");
	    			}
	    		});
	    		$(".ui-tabs-box .nav-tabs  a").off('shown.bs.tab').on('shown.bs.tab', function (e) {
	    			var href = $(this).attr("href");
	    			if(href.indexOf("schedule") != -1){
	    				$("#searchText").val("");
	    				realTimeMonitor.loadScheduleData(rowObject);
	    				realTimeMonitor.searchScheduleList(rowObject);
	    				realTimeMonitor.loadStatusList("#scheduleStatusType");
	    				
	    			}else if(href.indexOf("interface") != -1){
	    				$("#interfaceSearchText").val("");
	    				realTimeMonitor.loadInterfaceData(rowObject);
	    				realTimeMonitor.searchInterfaceList(rowObject);
	    				realTimeMonitor.loadStatusList("#interfaceStatusType");
	    				//TODO
	    			}else if(href.indexOf("basicInfo") != -1){
	    				realTimeMonitor.loadBasicInfo(rowObject);
	    			}else if(href.indexOf("dictionary") != -1){//数据字典
	    				realTimeMonitor.loadDictionaryData(rowObject);
	    			}else if(href.indexOf("tab2") != -1){
	    				rowObject.isNew=true;
	    				realTimeMonitor.loadTab2(rowObject,"")	
	    				realTimeMonitor.loadStatusList("#visStatusType2");//获取选择状态下拉列表
	    				realTimeMonitor.loadPriLevelList("#visImportantType2");//获取重要程度下拉列表
	    			}else if(href.indexOf("tab1") != -1){
	    				realTimeMonitor.loadTableInfoVis(rowObject,"");
	    			}
	    		});
	    };
	    /**
	     * 查询当前行详情
	     */
	    model.loadAppMonitorInfo=function(rowObject){
	     	$.AIGet({
				url:$.ctx + "/api/appMonitor/realTime/details",
				datatype:"json",
				data:rowObject,
				success:function(result){
					var data = result.data;
					var impLevel = data.impLevel ? $.priLevelObj[data.impLevel] : "-";
					$("#tableCellName").html(data.appName);
					$("#itemTypeInfo").html(data.appClassifyName);
					$("#itemPeriodInfo").html($.runFreqObj[data.runFreq]);
					$("#itemImportantInfo").html(impLevel);
					$("#incompleteReason").html(data.incompleteReason);
					$("#incompleteReason").prev().text(data.statusName+"原因");
					 var _class= $.statusClass[data.runStatus] ? $.statusClass[data.runStatus] : $.statusClass["100"]
					$("#statusBtn").removeAttr("class").addClass("text-center").html(data.statusName).addClass(_class);
					 var actualEndTime = data.actualEndTime ? DateFmt.Formate(data.actualEndTime,"yyyy-MM-dd HH:mm:ss"):"--";
					 var planCompleteTime =  data.planCompleteTime ? DateFmt.Formate(data.planCompleteTime,"yyyy-MM-dd HH:mm:ss"):"--";
					$("#actualEndTime").html(actualEndTime);
					var delayTime = data.delayTime ? data.delayTime+"分钟" :"--";
					$("#delayTime").html(delayTime);
					$("#planCompleteTime").html(planCompleteTime);
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
		    	var 	option = {
		    		    title: {
		    		        text: '近7次执行情况',//
		    		        subtext: ''
		    		    },
		    		    tooltip: {
		    		        trigger: 'axis'
		    		    },
		    		    legend: {
		    		        data:['延迟时间']
		    		    },
		    		    toolbox: {
		    		        show: true,
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
				url:$.ctx + "/api/appMonitor/realTime/details/delayCondition",
				datatype:"json",
				data:rowObject,
				success:function(result){
					var xAxisData = [];
					var seriesData = [];
					var markPointData = [];
					var data = result.data;
					for(var i=data.length-1;i>=0;i--){
						//var date = DateFmt.Formate(data[i].date,"yyyy-MM-dd ");//hh:mm
						var date = DateFmt.Formate(data[i].date,"MM-dd ");//hh:mm
						xAxisData.push(date)
						seriesData.push(data[i].delayTime);
						if(data[i].delayTime>0 && data[i].runStatus == 100){
							markPointData.push({
							    value:data[i].delayTime, xAxis: date, yAxis: data[i].delayTime,symbol:$.ctx + "/public/stylesheets/theme/default/images/echartsIcon.png"
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
	     * 关系图
	     */
	    model.loadVisData = function(rowObject){
    		if(!rowObject.needLevel){
    			rowObject.needLevel = 3;
    		}
    		var appUrl = $.ctx + "/api/appMonitor/realTime/procBloodGraph";
    		rowObject.appEffectUrl  = $.ctx + '/api/appMonitor/realTime/details/procs';
    		console.log(rowObject)
//    		if(){
//    			
//    		}
    		$('.ui-error-radio').removeClass('hidden');
    		if(rowObject.historyAppUrl){
    			appUrl = rowObject.historyAppUrl;
    			rowObject.appEffectUrl  =  $.ctx + '/api/appMonitor/history/details/procs';
    			$('.ui-error-radio').addClass('hidden');
    		}
	      	$.AIGet({
				url:appUrl,//$.ctx + "/api/appMonitor/realTime/procBloodGraph",
				datatype:"json",
				data:rowObject,
				success:function(result){
					if(!result.nodes) return;
					  var container = document.getElementById('mynetwork');
				      var network = model.network = new vis.Network(container, result, $.visOptions);
				      //节点点击
			      	  network.on("selectNode",function(param){//TODO
			      		rowObject.proc_2_Id = param.nodes[0];
			      		$("#shrinkTableVIS").attr("needLevel",3);
			      		$("#expandTableVIS").attr("needLevel",3);
			      		$("#shrinkTableVIS2").attr("needLevel",3);
			      		$("#expandTableVIS2").attr("needLevel",3);
			      		rowObject.tableLevel = 3;
			      		realTimeMonitor.loadTableInfoVis(rowObject,$.visOptions);
			      		realTimeMonitor.loadTab2(rowObject,$.visOptions);
			          });
				      if(rowObject.isError){
				    	  $("#expandVIS").attr("disabled","disabled");
				    	  $("#shrinkVIS").attr("disabled","disabled");
				    	  return;
				      }
				      var needLevel = $("#expandVIS").attr("needLevel");
				      needLevel = parseInt(needLevel);
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
    			if(!$("#showOnlyErrorDelay").hasClass("active")){
    				rowObject.isDelay= false;
    			}else{
    				rowObject.isDelay= true;
    			}
    			var needLevel = $(this).attr("needLevel");
    			needLevel = parseInt(needLevel);
    			rowObject.needLevel = needLevel+1;
    			$(this).attr("needLevel",rowObject.needLevel);
    			$("#shrinkVIS").attr("needLevel",rowObject.needLevel);
    			realTimeMonitor.loadVisData(rowObject);
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
	      		if(!$("#showOnlyErrorDelay").hasClass("active")){
	      			rowObject.isDelay= false;
	      		}else{
	      			rowObject.isDelay= true;
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
	      		realTimeMonitor.loadVisData(rowObject);
	      	});
	      	$("#appEffectBtn").off("click").on("click",function(){
    			if($(this).hasClass("active")){
    				$(this).removeClass("active");
    				$("#appEffectList").addClass("hidden");
    			}else{
    				$(this).addClass("active");
    				$('#searchAPPVisList').val('');
    				$("#appEffectList").removeClass("hidden");
    				realTimeMonitor.loadAPPVisList(rowObject);
    				realTimeMonitor.loadStatusList("#visStatusType");//获取选择状态下拉列表
    				realTimeMonitor.loadPriLevelList("#visImportantType");//获取重要程度下拉列表
    			}
    		});
	    };
	    /**
	     * 关系图受影响表格
	     * 
	     */
	    model.loadAPPVisList = function(rowObject){
	    	var postData = {};
	    	postData.runTime = rowObject.runTime;
	    	postData.procId = rowObject.procId;
    		$.jgrid.gridUnload("visjsonmap");
    		$("#visjsonmap").AIGrid({        
	    	   	url: rowObject.appEffectUrl,
	    		datatype: "json",
	    		postData:postData,
	    		colNames:['编号',/*'上级ID',*/'上级程序英文名称','上级程序名称','编号','程序英文名称','程序名称','重要程度','状态','来源'],
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
	    	   		{name:'statusDesc',index:'status_desc', width:40,align:"center",color:"statusColor",formatter:$.setStatus},		
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
	    	$("#searchAPPEffectBox").off("click").on("click",function(){
	    		postData.appName = $("#searchAPPVisList").val();
	    		postData.runStatus = $("#visStatusType").val();
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
	    		exportData.appName = $("#searchAPPVisList").val();
	    		exportData.runStatus = $("#visStatusType").val();
	    		exportData.priLevel = $("#visImportantType").val();
	    		exportData.priLevel = !postData.priLevel ? "" : postData.priLevel;
	    		exportData.runStatus = !postData.runStatus ? "" : postData.runStatus;
	    		var token="";
	    		var ssg = window.sessionStorage;
	    		if(ssg){
	    			token = ssg.getItem("token");
	    			if(token){
	    				exportData["token"]= token;
	    				exportData = $.convertData(exportData);
	    				window.open(encodeURI(encodeURI($.ctx + "/api/appMonitor/common/common/details/procs/export?"+exportData)));
	    			}
	    		}
	    	});
	    	
	    };
	    /**
	     * 第三屏关系图受影响表格
	     * 
	     */
	    model.loadTableVisList = function(rowObject){
	    	rowObject.runTime = rowObject.dataTime;
	    	rowObject.searchText = $("#tableSearchBox").val();//TODO
	    	rowObject.searchText = $("#tableSearchBox2").val();//TODO
	    	rowObject.appName="",
	    	$.jgrid.gridUnload("visTreejsonmap");
	    	$.jgrid.gridUnload("visTreejsonmap2");
	    	$("#visTreejsonmap").AIGrid({        
	    		url: rowObject.tableEffectUrl,
	    		datatype: "json",
	    		postData:rowObject,
	    		colNames:['编号','ID','表名称'],
	    	   	colModel:[
	    	   	    {name:'serialNbr',index:'serial_nbr',sortable:false,width:50,align:"center"},
	    			{name:'id',index:'id', sortable:false,width:150,align:"left"},		
	    			{name:'name',index:'name', sortable:false,width:150,align:"left"},		
    			],
    			rowNum:6,
    			rowList:[6,15,30],
    			pager: '#visTreepjmap',
    			viewrecords: true,
    			multiselect:false,
    			rownumbers:false,
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
	    		colNames:['编号','程序英文名称','程序名称','重要程度','状态'],
	    	   	colModel:[
	    	   		{name:'serialNbr',index:'serial_nbr', sortable:false, width:40,align:"center"},	
	    	   		{name:'procNameEn',index:'proc_name_en', width:100,align:"center",formatter:$.setNull},
	    	   		{name:'procNameZn',index:'proc_name_zn', width:80,align:"center",formatter:$.setNull},
	    	   		{name:'pri_level',index:'pri_level', width:60,align:"center",formatter:$.setImpLevel},
	    	   		{name:'statusDesc',index:'status_desc', width:40,align:"center",color:"statusColor",formatter:$.setStatus}			    	   		
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
	    		rowObject.searchText = $("#tableSearchBox").val();
	    		$("#visTreejsonmap").jqGrid('setGridParam',{ 
	    			postData:rowObject
	    		}).trigger("reloadGrid");
	    	});
	    	$("#effectTableBTN2").off("click").on("click",function(){
	    		rowObject.searchText = $("#tableSearchBox2").val();
	    		rowObject.appName = $("#searchAPPVisList").val();
	    		rowObject.runStatus = $("#visStatusType2").val();
	    		rowObject.priLevel = $("#visImportantType2").val();
	    		 
	    		
	    		$("#visTreejsonmap2").jqGrid('setGridParam',{ 
	    			postData:rowObject
	    		}).trigger("reloadGrid");
	    	});
	    	//第三屏导出
	    	$("#exportAPPEffectBox3").off("click").on("click",function(){
	    		var exportData = {};
	    		exportData.runTime = rowObject.runTime;
	    		exportData.procId = rowObject.procId;
	    		exportData.searchText = $("#tableSearchBox").val();
	    		var token="";
	    		var ssg = window.sessionStorage;
	    		if(ssg){
	    			token = ssg.getItem("token");
	    			if(token){
	    				exportData["token"]= token;
	    				exportData = $.convertData(exportData);
	    				window.open(encodeURI(encodeURI($.ctx + "/api/appMonitor/common/common/details/tables/export?"+exportData)));
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
	    		exportData.fileName='Monitor_Affected_ImportantApp_';
	    		if(rowObject.historyTableUrl){
	    			exportData.fileName='His_Monitor_Affected_ImportantApp_';
	    		}
	    		var token="";
	    		var ssg = window.sessionStorage;
	    		if(ssg){
	    			token = ssg.getItem("token");
	    			if(token){
	    				exportData["token"]= token;
	    				exportData = $.convertData(exportData);
	    				window.open(encodeURI(encodeURI($.ctx + "/api/appMonitor/common/affect/details/procs/export?"+exportData)));
	    			}
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
			   	url: $.ctx + '/api/appMonitor/realTime/details/controls',
				datatype: "json",
				postData:rowObject,
			   	colNames:['id','程序名称','程序英文名称','周期', '状态', '执行Agent','数据日期','创建时间','开始时间','结束时间','运行时长','负责人'],
			   	colModel:[
			   		{name:'id',index:'id', width:0,sortable:false,hidden:true },//frozen : true固定列
			   		{name:'procName',index:'proc_name', width:110,align:"left"},
			   		{name:'procNameEn',index:'proc_name_en', width:80,align:"left",formatter:$.setNull},
			   		{name:'runFreq',index:'run_freq', width:50,align:"center",formatter:function(cellvalue){return $.runFreqObj[cellvalue]}},
			   		{name:'statusName',index:'status_name',align:"center", width:70,color:"statusColor",formatter:$.setStatus},
			   		{name:'excuteAgent',index:'agent_code', width:80, align:"center"},
			   		{name:'dataTime',index:'data_time', width:80, align:"center",formatter:DateFmt.dataDateFormate},		
			   		{name:'createTime',index:'create_time', width:80,align:"center",formatter:DateFmt.dateFormatter},		
			   		{name:'actualRunTime',index:'actual_start_time', width:80,align:"center",formatter:DateFmt.dateFormatter},		
			   		{name:'actualEndTime',index:'actual_end_time', width:80,align:"center",formatter:DateFmt.dateFormatter},		
			   		{name:'excuteTime',index:'consume_time', width:40,align:"center",formatter:DateFmt.dateFormatterSecond},		
			   		{name:'admin',index:'creater', width:50,align:"center"}
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
			   	url: $.ctx + '/api/appMonitor/realTime/details/interfaces',
				datatype: "json",
				postData:rowObject,
			   	colNames:['JOB名称','JOB英文名称','周期', '数据日期', '状态','检验结果','开始时间','结束时间','运行时长','负责人'],
			   	colModel:[
			   		{name:'procName',index:'proc_name', width:100,align:"left"},
			   		{name:'procNameEn',index:'proc_name_en', width:80,align:"left",formatter:$.setNull},
			   		{name:'runFreq',index:'run_freq', width:30,formatter:function(cellvalue){return $.runFreqObj[cellvalue]}, align:"center"},
			   		{name:'dataTime',index:'data_time', width:40,formatter:DateFmt.dataDateFormate, align:"center"},
			   		{name:'statusName',index:'status_name', width:50, align:"center",color:"statusColor",formatter:$.setStatus},
			   		{name:'checkResult',index:'check_result', width:50, align:"center"},		
			   		{name:'actualRunTime',index:'actual_start_time', width:80,align:"center",formatter:DateFmt.dateFormatter},		
			   		{name:'actualEndTime',index:'actual_end_time', width:80, align:"center",formatter:DateFmt.dateFormatter},		
			   		{name:'excuteTime',index:'consume_time', width:70, align:"center",formatter:DateFmt.dateFormatterSecond},		
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
	    			var postData = {};
	    			postData.procId = rowObject.procId;
	    			postData.runTime = rowObject.runTime;
	    			var statusCode = $("#scheduleStatusType").val();
	    			var searchText = $("#searchText").val();
	    			postData.searchText =searchText;
	    			postData.statusCode =statusCode? statusCode :"";
	    			var statusCodeStr = "";
	    			if(postData.statusCode){
	    				for(var i=0;i<statusCode.length;i++){
	    					statusCodeStr+="statusCode[]="+statusCode[i]+"&"
	    				}
	    			}
	    			var ssg = window.sessionStorage;
	    		    var token="";
	    			if(ssg){
	    				token = ssg.getItem("token");
	    				if(token){
	    					postData["token"]= token;
	    					var paramStr = "procId=" + postData.procId+"&"+"runTime=" + postData.runTime+"&"+statusCodeStr+"searchText=" + postData.searchText+"&"+"token=" + postData.token;
	    					//postData = $.convertData(postData);
	    					window.open(encodeURI($.ctx + "/api/appMonitor/realTime/details/export/controls?"+paramStr));
	    				}
	    			}
	    		});
	    };
	    /**
	     * 调度接口
	     */
	    model.searchInterfaceList = function(rowObject){
		    	$("#interfaceSearchBtn").off("click").on("click",function(){
		    		var statusCode = $("#interfaceStatusType").val();
			    	var searchText = $("#interfaceSearchText").val();
		    		$("#interfacejsonmap").jqGrid('setGridParam',{ 
		    			postData:{
		    				searchText:searchText,
		    				statusCode:statusCode
		    			}
		    		}).trigger("reloadGrid");
		    	});
		    	$("#interfaceExportBtn").off("click").on("click",function(){
		    		var postData = {};
	    			postData.procId = rowObject.procId;
	    			postData.runTime = rowObject.runTime;
	    			var statusCode = $("#interfaceStatusType").val();
	    			var searchText = $("#interfaceSearchText").val();
	    			postData.searchText =searchText;
	    			postData.statusCode =statusCode? statusCode :"";
	    			var statusCodeStr = "";
	    			if(postData.statusCode){
	    				for(var i=0;i<statusCode.length;i++){
	    					statusCodeStr+="statusCode[]="+statusCode[i]+"&"
	    				}
	    			}
		    		var ssg = window.sessionStorage;
		    		var token="";
		    		if(ssg){
		    			token = ssg.getItem("token");
		    			if(token){
		    				postData["token"]= token;
		    				var paramStr = "procId=" + postData.procId+"&"+"runTime=" + postData.runTime+"&"+statusCodeStr+"searchText=" + postData.searchText+"&"+"token=" + postData.token;
		    				//rowObject = $.convertData(rowObject);
		    				window.open(encodeURI($.ctx + "/api/appMonitor/realTime/details/export/interfaces?"+paramStr));
		    			}
		    		}
		    	});
	    };
	    /**
	     * 基础信息
	     */
	    model.loadBasicInfo = function(rowObject){
	    	$.AIGet({
				url:$.ctx + "/api/appMonitor/realTime/details",
				datatype:"json",
				data:rowObject,
				success:function(result){
					var data = result.data;
					for(var key in data){
						if(data[key] && (key.indexOf("planCompleteTime") != -1)){
							data[key] = DateFmt.dateFormatter(data[key])
						}else if(data[key] && (key.indexOf("actualEndTime") != -1)){
							data[key] = DateFmt.dateFormatter(data[key])
						}else if(data[key] && (key.indexOf("dataTime") != -1)){
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
						}else if(data[key] && key.indexOf("Freq") != -1){
							data[key] = $.runFreqObj[data[key]];
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
	    
	    /***
	     * 第三屏 tab2关系图点击第二屏节点
	     */
	    model.loadTab2 = function(rowObject,options){
	    	console.log(rowObject)
	    	$("#tableEffectList2").addClass("hidden");
    		$("#tableEffectBtn2").removeClass("active");
	    	if(!rowObject.tableLevel){
    			rowObject.tableLevel = 3;
    		}
	    	
    		var appUrl = $.ctx + "/api/appMonitor/common/affect/procGraph";
    		rowObject.tableEffectUrl = $.ctx + '/api/appMonitor/common/affect/details/procs';
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
    			realTimeMonitor.loadTab2(newPostData, $.visOptions);    			
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
	      		realTimeMonitor.loadTab2(newPostData, $.visOptions);
	      	});
	      	$("#tableEffectBtn2").off("click").on("click",function(){
	      		if($(this).hasClass("active")){
    				$(this).removeClass("active");
    				$("#tableEffectList2").addClass("hidden");
    			}else{
    				$(this).addClass("active");
    				$('#tableSearchBox2').val('');
    				$("#tableEffectList2").removeClass("hidden");
    				realTimeMonitor.loadTableVisList(newPostData);
    				realTimeMonitor.loadStatusList("#visStatusType2");//获取选择状态下拉列表
    				realTimeMonitor.loadPriLevelList("#visImportantType2");//获取重要程度下拉列表
    				$(".J_appCell").hide();
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
    		var appUrl = $.ctx + "/api/appMonitor/realTime/procTableGraph";
    		rowObject.tableEffectUrl = $.ctx + '/api/appMonitor/realTime/details/tables';
    		if(rowObject.historyTableUrl){   			
    			appUrl = rowObject.historyTableUrl;
    			rowObject.tableEffectUrl = $.ctx + '/api/appMonitor/history/details/tables';
    		}
    		var newPostData = {};
    		newPostData = $.extend(newPostData,rowObject);
    		newPostData.procId = rowObject.proc_2_Id;
    		newPostData.isHistory=false;
    		if(rowObject.historyTableUrl){
    			newPostData.isHistory=true;
    		}
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
    			rowObject.tableLevel =newPostData.tableLevel= needLevel+1;
    			$(this).attr("needLevel",rowObject.tableLevel);
    			$("#shrinkTableVIS").attr("needLevel",rowObject.tableLevel);
    				realTimeMonitor.loadTableInfoVis(newPostData, $.visOptions);
	      	});
	      	$("#shrinkTableVIS").off("click").on("click",function(){
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
	      		$("#expandTableVIS").attr("needLevel",rowObject.tableLevel);
	      		realTimeMonitor.loadTableInfoVis(newPostData, $.visOptions);
	      	});
	      	$("#tableEffectBtn").off("click").on("click",function(){
	      		if($(this).hasClass("active")){
    				$(this).removeClass("active");
    				$("#tableEffectList").addClass("hidden");
    			}else{
    				$(this).addClass("active");
    				$('#tableSearchBox').val('');
    				$("#tableEffectList").removeClass("hidden");
    				realTimeMonitor.loadTableVisList(newPostData);
    				$(".J_appCell").hide();
    			}
	    	});
	      	//导出受影响关系表2018-01-15
	      	$("#exportExecl").off("click").on("click",function(){
	      		var exportData = {};
	    		exportData.runTime = newPostData.runTime;
	    		exportData.procId = newPostData.procId;
	    		var ishistory=newPostData.isHistory
	    		exportData.fileName='RealTime_Monitor_Affected_Tbale_';
	    		if(ishistory){
	    			exportData.fileName='His_RealTime_Monitor_Affected_Tbale_';
	    		}
	    		var token="";
	    		var ssg = window.sessionStorage;
	    		if(ssg){
	    			token = ssg.getItem("token");
	    			if(token){
	    				exportData["token"]= token;
	    				exportData = $.convertData(exportData);
	    				window.open(encodeURI(encodeURI($.ctx + "/api/appMonitor/common/common/details/tables/colexport?"+exportData)));
	    			}
	    		}
	    	});
	    };
	    /****
	     * 周期 数据日期联动 
	     */
	    model.initCycle= function(){
		    	$('#cycleType').multiselect({
		    		nonSelectedText:"日",
		    		buttonWidth:160,
		    		nSelectedText:"个选择",
		    		includeSelectAllOption:false,
		    		onChange:function(element, checked){
		    			if($(element).val() == "month"){
		    				$( "#dataDate" ).val("").datepicker( "destroy" ).datepicker({
		    				    changeMonth: true,
		    			        changeYear: true,
		    			        dateFormat: 'yy-MM',
		    			        showButtonPanel: true,
		    			        minDate:DateFmt.DateCalc(new Date(),"M",-6),
		    			        maxDate:DateFmt.DateCalc(new Date(),"M",-1),
		    			        closeText:"确定" ,
		    		    		beforeShow :function(){
		    		    			$.datepicker.dpDiv.addClass("ui-hide-calendar");
		    		    			$("#ui-datepicker-div .ui-datepicker-year").off("change");
		    		    		},
		    			        onClose: function(dateText, inst) {
		    			            var month = $("#ui-datepicker-div .ui-datepicker-month option:selected").val();//得到选中的月份值
		    			            var year = $("#ui-datepicker-div .ui-datepicker-year option:selected").val();//得到选中的年份值
		    			            var dateStr = DateFmt.Formate(DateFmt.parseDate(year+'-'+(parseInt(month)+1)),"yyyy-MM");
		    			            $("#dataDate").val(dateStr);//给input赋值，其中要对月值加1才是实际的月份
		    			        }
		    			    }).off("click");
		    			}else if($(element).val() == "quarter"){
		    				var currentMonth = DateFmt.DateCalc(new Date(),"q",-1).getMonth()+1;
		    				var currentYear = DateFmt.DateCalc(new Date(),"q",-1).getFullYear();
		    				var minMonth = DateFmt.DateCalc(new Date(),"y",-1).getMonth()+1;
		    				var minYear = DateFmt.DateCalc(new Date(),"y",-1).getFullYear();
		    				var targetDate = {"1":3,"2":3,"3":3,"4":6,"5":6,"6":6,"7":9,"8":9,"9":9,"10":12,"11":12,"12":12};
		    				$( "#dataDate" ).val("").datepicker( "destroy" ).datepicker({
		    				    changeMonth: true,
		    			        changeYear: true,
		    			        dateFormat: 'yy-MM',
		    			        showButtonPanel: true,
		    			        minDate:DateFmt.parseDate(minYear + "-" + targetDate[minMonth]),
		    			    	maxDate:DateFmt.parseDate(currentYear + "-" + targetDate[currentMonth]),
		    			        closeText:"确定",
		    			        monthNames : [ '03', '06','09', '12' ],
		    			    	monthNamesShort : [  '03', '06', '09','12' ],
		    			        onClose: function(dateText, inst) {
		    			            var month = $("#ui-datepicker-div .ui-datepicker-month").val();//得到选中的月份值
		    			            var year = $("#ui-datepicker-div .ui-datepicker-year option:selected").val();//得到选中的年份值
		    			            var dateStr = DateFmt.Formate(DateFmt.parseDate(year+'-'+(parseInt(month))),"yyyy-MM");
		    			            $("#dataDate").val(dateStr);//给input赋值，其中要对月值加1才是实际的月份
		    			        },
		    		    		beforeShow :function(){
		    		    			$.datepicker.dpDiv.addClass("ui-hide-calendar");
		    		    		}
		    			    }).off("click").on("click",function(){
		    			    	if(!$.datepicker.dpDiv.is(":hidden")){
		    			    		var $monthSelect = $.datepicker.dpDiv.find(".ui-datepicker-month").clone();
		    			    		$.datepicker.dpDiv.find(".ui-datepicker-month").remove();
		    			    		$(".ui-datepicker-title").prepend($monthSelect);
		    			    		var monthNames = $( "#dataDate" ).datepicker( "option", "monthNames");
		    			    		var html = '';
		    			    		var year = $("#ui-datepicker-div .ui-datepicker-year option:selected").val();//得到选中的年份值
		    			    		for(var i=0,len = monthNames.length;i<len;i++){
		    			    			if( targetDate[currentMonth] >= monthNames[i]&& year == currentYear){
		    			    				html += '<option value="'+monthNames[i]+'">'+monthNames[i]+'</option>';
		    			    			} 
		    			    		}
		    			    		$("#ui-datepicker-div .ui-datepicker-year").off("change").on("change",function(){
		    			    			var year = $("#ui-datepicker-div .ui-datepicker-year option:selected").val();//得到选中的年份值
		    			    			var html = "";
			    			    		for(var i=0,len = monthNames.length;i<len;i++){
			    			    			if( targetDate[currentMonth] >= monthNames[i]&& year == currentYear){
			    			    				html += '<option value="'+monthNames[i]+'">'+monthNames[i]+'</option>';
			    			    			}else if( targetDate[currentMonth] < monthNames[i]&& year == minYear){
			    			    				html += '<option value="'+monthNames[i]+'">'+monthNames[i]+'</option>';
			    			    			}
			    			    		}
			    			    		$monthSelect.html(html);
		    			    		});
		    			    		$monthSelect.html(html);
		    			    	}
		    			    	return false;
		    			    });
		    			}else if($(element).val() == "week"){
		    				$( "#dataDate" ).val("").datepicker( "destroy" ).datepicker({
		    			    	defaultDate: "+1w",
		    			    	changeMonth: true,
		    			    	numberOfMonths:1,
		    			    	dateFormat: "yy-mm-dd",
		    			    	minDate:DateFmt.DateCalc(new Date(),"M",-3),
		    			    	maxDate:DateFmt.DateCalc(new Date(),"w",-1),
		    					beforeShow :function(){
		    						$.datepicker.dpDiv.removeClass("ui-hide-calendar");
		    						$("#ui-datepicker-div .ui-datepicker-year").off("change");
		    					}
		    			    }).off("click");
		    			}else if($(element).val() == "day"){
		    				$( "#dataDate" ).val("").datepicker( "destroy" ).datepicker({
		    			    	defaultDate: "+1w",
		    			    	changeMonth: true,
		    			    	numberOfMonths:1,
		    			    	dateFormat: "yy-mm-dd",
		    			    	minDate:DateFmt.DateCalc(new Date(),"d",-30),
		    			    	maxDate:DateFmt.DateCalc(new Date(),"d",-1),
		    					beforeShow :function(){
		    						$.datepicker.dpDiv.removeClass("ui-hide-calendar");
		    						$("#ui-datepicker-div .ui-datepicker-year").off("change");
		    					}
		    			    }).off("click");
		    			}else if(!$(element).val()){//选择全部
		    				$( "#dataDate" ).val("").datepicker( "destroy" ).datepicker({
		    			    	changeMonth: true,
		    			    	numberOfMonths:1,
		    			    	dateFormat: "yy-mm-dd",
		    					beforeShow :function(){
		    						$.datepicker.dpDiv.removeClass("ui-hide-calendar");
		    						$("#ui-datepicker-div .ui-datepicker-year").off("change");
		    					}
		    			    }).off("click");
		    			}
		    			
		    		}
		    	  });
	    }
        return model;
        

   })(window.realTimeMonitor || {});