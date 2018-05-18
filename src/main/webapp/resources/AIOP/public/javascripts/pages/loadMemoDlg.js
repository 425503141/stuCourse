/**
 * ------------------------------------------------------------------
 * 备注处理情况
 * ------------------------------------------------------------------
 */
var methodMemo = (function (model){
	 model.memoInfo = {};//备注信息
     var ssg = window.sessionStorage;
	    if(ssg){
 			model.userId = ssg.getItem("userId");
 	}
	/**
     * 备注弹窗 保存前的验证
     */
    model.beforeSaveCheckMemo = function(data){
    	var checkObj = [];
		checkObj[1]=true;
	    switch (true){
            case !data.operationStartTime: 
            	checkObj[0] ='请选择开始处理时间';
    			checkObj[1] =false;
    			return checkObj;
    			break;
    		//当处理完成情况为“完成-1”或“失败-9”时，处理结束时间为必填项。
            case !data.operationEndTime && data.operationStatus=='1' || !data.operationEndTime && data.operationStatus=='9': 
            	checkObj[0] ='请选择处理结束时间';
    			checkObj[1] =false;
    			return checkObj;
    			break;
            case !data.operationStatus: 
            	checkObj[0] ='请选择处理完成情况';
    			checkObj[1] =false;
    			return checkObj;
    			break;
            case !data.operationUser : 
            	checkObj[0] ='请填写处理人';
    			checkObj[1] =false;
    			return checkObj;
    			break;
            case !data.errorReason: 
            	checkObj[0] ='请填写原因';
    			checkObj[1] =false;
    			return checkObj;
    			break;
            case !data.operationDetail: 
            	checkObj[0] ='请填写处理内容';
    			checkObj[1] =false;
    			return checkObj;
    			break;
            default:
            	return checkObj;
	      }
    };
    /***
     * 备注弹窗 
     * @isFor 1-实时监控 2-历史监控 3-调度监控
     */
    model.showRemarkDlg = function(rowObject,isFor){
    	$("#cyclePlanAddDlg").aiDialog({
    		  width:900,
    		  height:"auto",
    		  title:"处理情况备注",
    		  buttons:[{
					"class":"ui-aiop-cancel-btn mr10",
					type:"Cancel",
					text: "取消",
					click: function() { 
						$( this ).dialog( "close" );
					}
		  		},
				{
					"class":"ui-aiop-btn",
					type:"ok",
					text: "确定",
					click: function() { 
						  var saveObj = formFmt.formToObj($("#formSaveCyclePlan"));
		    			  var memoInfo = model.memoInfo;//带过来的备注详情信息
		    			  saveObj.objectId  = memoInfo.objectId;
		    			  saveObj.objectType  = memoInfo.objectType;
		    			  saveObj.memoUser  = model.userId;
		    			  saveObj.statisticDate   = DateFmt.Formate(memoInfo.statisticDate,"yyyy-MM-dd");
		    			  var checkObj = model.beforeSaveCheckMemo(saveObj);
		    			  if(!checkObj[1]){//非空验证
		    				  $("#SMStelDlg").alert({
		    					   title:"提示",
		    					   content:checkObj[0],
		    					   dialogType:"failed"
		    				   });
		    			  }
		    			  if(checkObj[1]){
		    				  	$.AIPost({
		    				  		url: $.ctx+"/api/appMonitor/common/addOperation",
		    			    		data: saveObj,
		    			    		success: function(data){
		    			    			   if(data.status == 200){
		    			    				   $( "#cyclePlanAddDlg" ).dialog("close");
		    			    				   $("#SMStelDlg").alert({
		    			    					   title:"提示",
		    			    					   content:"保存成功",
		    			    					   dialogType:"success"
		    			    				   });
		    			    			   }
		    			    			   if(data.status == 201){
		    			    				   $("#SMStelDlg").alert({
		    			    					   title:"提示",
		    			    					   content:data.message,
		    			    					   dialogType:"failed"
		    			    				   });
		    			    			   }
		    			    		   }
		    				  	});
		    			  }
					} 
				},
		  		{
					"class":"ui-aiop-btn",
					type:"export",
					text: "导出",
					click: function() { 
						var memoInfo = model.memoInfo;//带过来的备注详情信息
						var moreQueryIpnut = {
			        			"statDate":DateFmt.Formate(rowObject.rowObj.statDate,"yyyy-MM-dd"),//统计日期
				    			"objectId":memoInfo.objectId,//数据的id：应用/调度/接口ID
				    			"objectType":memoInfo.objectType,//A:应用/P:调度/I:接口
			        	};
			        	var ssg = window.sessionStorage;
					    var token="";
						if(ssg){
							token = ssg.getItem("token");
							if(token){
								moreQueryIpnut["token"]= token;
								moreQueryIpnut = $.convertData(moreQueryIpnut);
								window.open(encodeURI(encodeURI($.ctx + "/api/appMonitor/common/exportOperationMemo?"+moreQueryIpnut)));
							}
						}
						//用来服务器记录log
						/*$.AILog({
							  "action": "导出",//动作
							  "detail": "",//详情,默认为空
							  "module": "app_monitor_realtime"//二级菜单名称，如无二级菜单 使用一级菜单名称
					    });*/
					} 
				}],
    		  open:function(){
    			  $("#tableCellInfo,#appTableInfoPanel").addClass("hidden");//备注对话框展开时，对于上一次操作展开的第2屏、第3屏都应该关闭（实时、历史、调度）
    			  $('#expTime').removeAttr('disabled');
    			  $('.J_clearTimeEnd').click(function(){
    				  $('#expTime').val('');
    			  });
    			  if(isFor=="1"){
    				  model.sendMemoDlgListReal(rowObject.rowObj);
    			  }
    			  if(isFor=="2"){
    				  model.sendMemoDlgListHistory(rowObject.rowObj);
    			  }
    			  if(isFor=="3"){
    				  model.sendMemoDlgListSchedule(rowObject.rowObj);
    			  }
    			  if(isFor=="4"){
    				  model.sendMemoDlgListInterface(rowObject.rowObj);
    			  }
    			  if(isFor=="5"){
    				  model.sendMemoDlgListsendMonitor(rowObject.rowObj);
    			  }
    			  if(isFor=="6"){
    				  model.sendMemoDlgInterPushMonitor(rowObject.rowObj);
    			  }
    			  $("#memoGrid").jqGrid('clearGridData');//清空表格
    		      $("#memoGrid").jqGrid('setGridParam',{
    		    		datatype:'local',
    		    		data:$.makeArray(rowObject.rowObj),//data是符合格式要求的重新加载的数据
    		    	}).trigger("reloadGrid");
    			  //处理完成情况
    			  $('#operationStatus').multiselect({
    					nonSelectedText:"请选择",
    					buttonWidth:148,
    					nSelectedText:"个选择",
    					includeSelectAllOption:false,
    					onChange: function(option, checked, select) {
    						var curVal = $(option).val();
    						if(curVal=="0"){//状态是处理中，结束时间就得空着，不能选
    							$('#expTime').val('').attr('disabled','disabled');
    						}else{
    							$('#expTime').removeAttr('disabled');
    						}
    					}
    			  });
    			  //获取备注信息 有值则回填
    			  model.getOperationMemo(rowObject);
    		  }
    	});
    };
    /**
     * 打开备注弹框-列表-实时监控
     */
    model.sendMemoDlgListReal = function(rowObject){
		  $("#memoGrid").AIGrid({        
			datatype: "local",
			data:$.makeArray(rowObject),
      	   	colNames:['id','应用名称','应用分类', '周期', '重要程度','数据日期','偏移量','计划完成时间','实际完成时间','状态'],
      	   	colModel:[
      	   		{name:'appId',index:'appId', width:0,sortable:false,hidden:true },//frozen : true固定列
      	   		{name:'appName',index:'app_name', width:90,align:"left",formatter:setAppName,sortable:false},
      	   		{name:'appClassifyName',index:'app_classify_name', width:90, align:"center",sortable:false},
      	   		{name:'runFreq',index:'run_freq', width:50,formatter:formateRunFreq, align:"center",sortable:false},
      	   		{name:'impLevel',index:'imp_level', width:50, align:"center",formatter:$.setImpLevel,sortable:false},
      	   		{name:'dataTime',index:'data_time', width:80, align:"center",formatter:DateFmt.dataDateFormate,sortable:false},
      	   		{name:'dateArgs',index:'date_args', width:50, align:"center",sortable:false},
      	   		{name:'planEndTime',index:'plan_end_time', width:80,align:"center",formatter:DateFmt.dateFormatter,sortable:false},		
      	   		{name:'actualEndTime',index:'actual_end_time', width:80,align:"center",formatter:DateFmt.dateFormatter,sortable:false},		
      	   		{name:'statusName',index:'status_order',color:"statusColor", width:80,align:"center",formatter:$.setStatus,sortable:false},		
      	   	],
      	    rowNum:10,
	  	   	rowList:[10,20,30],
	  	   	pager: '',
	  	   	sortname: '',
	  	    viewrecords: true,
	  	    multiselect:false,
	  		rownumbers:false,
	  	    sortorder: "desc",
	  		jsonReader: {
	  			repeatitems : false,
	  			id: "0"
	  		},
	  		height: '100%',
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
      		}
      	}
    };
    /**
     * 打开备注弹框-列表-历史监控
     */
    model.sendMemoDlgListHistory = function(rowObject){
    	$("#memoGrid").AIGrid({        
    		datatype: "local",
			data:$.makeArray(rowObject),
    	   	colNames:['id','统计日期','应用名称','应用分类', '周期', '重要程度','数据日期','偏移量','计划完成时间','实际完成时间','状态'],
    	   	colModel:[
    	   		{name:'appId',index:'appId', width:0,sortable:false,hidden:true },//frozen : true固定列
    	   		{name:'statDate',index:'statistic_date', width:80,align:"center",formatter:DateFmt.dataDateFormate,sortable:false},
    	   		{name:'appName',index:'app_name', width:90,align:"left",formatter:setAppName,sortable:false},
    	   		{name:'appClassifyName',index:'app_classify_name', width:90, align:"center",sortable:false},
    	   		{name:'runFreq',index:'run_freq', width:40,formatter:formateRunFreq, align:"center",sortable:false},
    	   		{name:'impLevel',index:'imp_level', width:50, align:"center",formatter:$.setImpLevel,sortable:false},
    	   		{name:'dataTime',index:'data_time', width:80, align:"center",formatter:DateFmt.dataDateFormate,sortable:false},
    	   		{name:'dateArgs',index:'date_args', width:40, align:"center",sortable:false},
    	   		{name:'planEndTime',index:'plan_end_time', width:80,align:"center",formatter:DateFmt.dateFormatter,sortable:false},		
    	   		{name:'actualEndTime',index:'actual_end_time', width:80,align:"center",formatter:DateFmt.dateFormatter,sortable:false},		
    	   		{name:'statusName',index:'status_order',color:"statusColor", width:80,align:"center",formatter:$.setStatus,sortable:false},		
    	   	],
    	   	rowNum:10,
    	   	rowList:[10,20,30],
    	   	pager: '',
    	   	sortname: '',
    	    viewrecords: true,
    	    multiselect:false,
    		rownumbers:false,
    	    sortorder: "asc",
    	    afterGridLoad:function(){
    	    	$("#tableCellInfo,#appTableInfoPanel").addClass("hidden");
    	    },
    		jsonReader: {
    			repeatitems : false,
    			id: "0"
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
    			var html = '<span class="ui-delay-icon"></span><span>'+rowObject.appName+'</span>'
    			return html;
    		}else{
    			var html = '<span class="ui-empty-icon v-hidden"></span>'+rowObject.appName
    			return html;
    		}
    	}
    };
    /**
     * 打开备注弹框-列表-调度监控
     */
    model.sendMemoDlgListSchedule = function(rowObject){
    	$("#memoGrid").AIGrid({        
    		datatype: "local",
			data:$.makeArray(rowObject),
    	   	colNames:['id','程序名称', '周期','数据日期','偏移量','计划开始时间','实际开始时间','计划完成时间','实际完成时间','状态'],
    	   	colModel:[
    	   		{name:'procId',index:'proc_id',hidden:true },//frozen : true固定列
    	   		{name:'procName',index:'proc_name_zn', width:130,align:"left",formatter:setAppName,sortable:false},
    	   		{name:'runFreq',index:'run_Freq', width:50, align:"center",formatter:formateRunFreq,sortable:false},
    	   		{name:'dataTime',index:'data_time', width:80, align:"center" ,formatter:DateFmt.dataDateFormate,sortable:false},
    	   		{name:'dateArgs',index:'date_args', width:60, align:"center" ,formatter:$.setNull,sortable:false},
    	   		{name:'planStartTime',index:'plan_start_time', width:80, align:"center" ,formatter:DateFmt.dateFormatter,sortable:false},
    	   		{name:'actualStartTime',index:'actual_Start_Time', width:80, align:"center",formatter:DateFmt.dateFormatter,sortable:false},		
    	   		{name:'planEndTime',index:'plan_End_Time', width:60,align:"center",formatter:DateFmt.dateFormatter,sortable:false},		
    	   		{name:'actualEndTime',index:'actual_end_time', width:60,align:"center",formatter:DateFmt.dateFormatter,sortable:false},		
    	   		{name:'statusDesc',index:'status_code', width:60,align:"center",color:"statusColor",formatter:$.setStatus,sortable:false},		
    	   	],
    	   	rowNum:10,
    	   	rowList:[10,20,30],
    	   	pager: '',
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
    		}
    	}
    };
    /**
     * 打开备注弹框-列表-接口监控
     */
    model.sendMemoDlgListInterface = function(rowObject){
    	$("#memoGrid").AIGrid({        
    		datatype: "local",
			data:$.makeArray(rowObject),
			colNames:['接口编码','接口名称', '接口类型','数据日期','接口主题域','上传状态','文件取走情况','文件入库情况'],
			colModel:[  
					{name:'unitId',index:'unit_id', width:80,frozen : true,align:"center"},
        	   		{name:'unitDesc',index:'unit_desc',sorttype:"string",  width:100,align:"center",frozen : true},
        	   		{name:'unitType',index:'unit_type',width:60,align:"center"},
        	   		{name:'txDate',index:'tx_date', width:60, align:"center"},	
        	   		{name:'unitTop',index:'unit_top', width:80, align:"center"},
        	   		{name:'isDealy',index:'is_dealy', width:80,align:"center",color:"updateStatusColor",formatter:$.setStatus},		
        	   		{name:'groupFtpDesc',index:'group_ftp_desc', width:80,align:"center",color:"datafileStatusColor",formatter:$.setStatus},		
        	   		{name:'groupLoadDesc',index:'group_load_desc', width:80,align:"center",color:"cdrfileStatusColor",formatter:$.setStatus},		
    	   		],
    	   	rowNum:10,
    	   	rowList:[10,20,30],
    	   	pager: '',
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
    		}
    	}
    };
    /**
     * 打开备注弹框-列表-接口推送
     */
    model.sendMemoDlgListsendMonitor = function(rowObject){
    	$("#memoGrid").AIGrid({        
    		datatype: "local",
			data:$.makeArray(rowObject),
			colNames:['应用名称', '数据日期','接口类型','出数状态','推送状态'],
			colModel:[  
        	   		{name:'exportName',index:'export_name',sorttype:"string",  width:100,align:"center",frozen : true},
        	   		{name:'doOpDate',index:'do_op_date',width:60,align:"center"},
        	   		{name:'exportType',index:'export_type', width:60, align:"center"},	
        	   		{name:'pushNumStatus',index:'push_num_status', width:80, align:"center"},
        	   		{name:'pushFinishStatus',index:'push_finish_status', width:80,align:"center"},		
    	   		],
    	   	rowNum:10,
    	   	rowList:[10,20,30],
    	   	pager: '',
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
    		}
    	}
    };
    /**
     * 打开备注弹框-列表-接口入库
     */
    model.sendMemoDlgInterPushMonitor = function(rowObject){
    	$("#memoGrid").AIGrid({        
    		datatype: "local",
			data:$.makeArray(rowObject),
			colNames:['接口编码','接口名称','接口类型','接口来源','重要程度','入库分类','偏移量','接口质量','数据日期'],
			colModel:[  
					{name:'interfacecode',index:'interface_code',sorttype:"string",width:100,align:"center",frozen : true},
        	   		{name:'interfaceName',index:'interface_name',sorttype:"string",  width:100,align:"center"},
        	   		{name:'typeName',index:'type_name',width:60,align:"center"},
        	   		{name:'interfaceSourceName',index:'interface_source_name',width:60,align:"center"},
        	   		{name:'priLevel',index:'pri_level', width:60, align:"center"},	
        	   		{name:'entryTypeName',index:'entry_type_name', width:80, align:"center"},
        	   		{name:'dateArgs',index:'date_args', width:80,align:"center"},
        	   		{name:'interfaceStatusStatus',index:'interface_status', width:80, align:"center"},
        	   		{name:'dataTime',index:'data_time', width:80,align:"center"},
    	   		],
    	   	rowNum:10,
    	   	rowList:[10,20,30],
    	   	pager: '',
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
    		}
    	}
    };
    /***
     * 获取备注处理情况
     */
    model.getOperationMemo = function(option){
    	var defaults ={
    			ajaxData:{},
		}
    	option = $.extend(defaults,option);
    	$.AIGet({
			url:$.ctx + "/api/appMonitor/common/getOperationMemo",
			datatype:"json",
			data:option.ajaxData,
			success:function(result){
			   model.memoInfo = result.data;
			   var memoInfo = model.memoInfo;//带过来的备注详情信息
			   var rowObj = option.rowObj;
  			  //开始处理时间无带过来的值时默认为进入页面的系统时间
  			  var sysTime = DateFmt.Formate(new Date().getTime(),"yyyy-MM-dd HH:mm");
  			  var operationStartTime  = !memoInfo.operationStartTime ? sysTime :DateFmt.Formate(memoInfo.operationStartTime,"yyyy-MM-dd HH:mm");
  			  //处理结束时间无带过来的值时默认为""
  			  var operationEndTime  = !memoInfo.operationEndTime ? "" :DateFmt.Formate(memoInfo.operationEndTime,"yyyy-MM-dd HH:mm");
  			  var operationStatus = memoInfo.operationStatus ? memoInfo.operationStatus : "";
  			  if(operationStatus=='0'){
  				$('#expTime').attr('disabled','disabled');
  			  }
  			  $('#operationStatus').val(operationStatus).multiselect('refresh');
  			  $('input[name="operationUser"]').val(memoInfo.operationUser);
  			   var errorReason = !memoInfo.errorReason ? rowObj.incompleteReason : memoInfo.errorReason;
  			  $('input[name="errorReason"]').val(errorReason);
  			  $('textarea[name="operationDetail"]').val(memoInfo.operationDetail);
  			  //开始处理时间和处理结束时间
  			  $( "#effTime").val(operationStartTime).datetimepicker({
  				  changeMonth: true, //显示月份
  			      changeYear: true, //显示年份
  			      showButtonPanel: true, //显示按钮
  			      defaultDate:new Date(),
  			      timeFormat: "HH:mm",
  			      dateFormat: "yy-mm-dd",
  				  controlType:"select",
  				  timeOnlyTitle:"选择时间",
  				  timeText: '已选择',
  				  hourText: '时',
  				  minuteText: '分',
  				  second_slider:false,
  				  currentText:"当前时间",
  				  closeText: '确定',
  				  onClose: function (selectedDate) {
  					  $("#expTime").datepicker("option", "minDate", selectedDate);
  			          var effTime = new Date($("#effTime").val()).getTime();//生效时间
  			          var expTime = new Date($("#expTime").val()).getTime();//失效时间
  			          if(expTime-effTime<0){
  			        	  $("#SMStelDlg").alert({
 	    					   title:"提示",
 	    					   content:"开始处理时间应小于处理结束时间,请重新选择！",
 	    					   dialogType:"failed"
 	    				   });
  			           $(this).val('');
  			          }
  			          var ymdStr = DateFmt.Formate(new Date().getTime(),'yyyy-MM-dd');
  					  var nowTime = ymdStr + " 00:00";
  					  if(!selectedDate){
  						  $(this).val(nowTime);
  						  $("#expTime").val($("#expTime").val())
  					  }
  			       }
  		      });
  			  $("#expTime").val(operationEndTime).datetimepicker({
  				  changeMonth: true, //显示月份
  			      changeYear: true, //显示年份
  			      showButtonPanel: true, //显示按钮
  			      timeFormat: "HH:mm",
  			      dateFormat: "yy-mm-dd",
  				  controlType:"select",
  				  timeOnlyTitle:"选择时间",
  				  timeText: '已选择',
  				  hourText: '时',
  				  minuteText: '分',
  				  second_slider:false,
  				  currentText:"当前时间",
  				  closeText: '确定',
  				  onClose: function (selectedDate) {
  			          $("#effTime").datepicker("option", "maxDate", selectedDate);
  			          var effTime = new Date($("#effTime").val()).getTime();//生效时间
  			          var expTime = new Date($("#expTime").val()).getTime();//失效时间
  			          if(expTime-effTime<0){
  			        	  $("#SMStelDlg").alert({
 	    					   title:"提示",
 	    					   content:"处理结束时间应大于开始处理时间,请重新选择！",
 	    					   dialogType:"failed"
 	    				   });
  			           $(this).val('');
  			          }
  			          var ymdStr = DateFmt.Formate(new Date().getTime(),'yyyy-MM-dd');
  					  var nowTime = ymdStr + " 00:00";
  					  if(!selectedDate){
  						  $(this).val(nowTime);
  						  $("#effTime").val($("#effTime").val())
  					  }
  			        }
  		      });
  			  $.datepicker.dpDiv.addClass("ui-datepicker-box");
			}
		});
    };
    return model;
})(window.methodMemo || {});