/**
 * 二经入口
 * 
 */
$(function(){
	
	erjingMonitor.loadStatusList().then(erjingMonitor.setStatus);
	$('#subheaderBox').find('a:eq(1)').parent().siblings("li").removeClass('active');
	$("#moreSearch").click(function(){
		if($(this).hasClass("active")){
			$(this).removeClass("active");
			$("#moreSearchCondition").addClass("hidden");
		}else{
			$(this).addClass("active");
			$("#moreSearchCondition").removeClass("hidden");
			if(yijingMonitor.defaultParams==""){
				$("#moreSearchCondition").find("input[type='text']").val("");
				$('select.multiselect').val("").multiselect('refresh');
			}
		}
	})
	/**自动补全**/
	$( "#searchEngines" ).AIAutoComplete({
		url:$.ctx + "/api/inter/interfaceInput/querySearchText",
	  	 data:{
	  		 "searchEngines": "searchText",   // 获取输入框内容
		      "dateTimeFrom": "statDateFrom",
		      "dateTimeTo":"statDateTo"
		   },
		  jsonReader:{
			  item:"searchEngines",
		  }
	});
	//重要程度
	$('#priLevel').multiselect({
		nonSelectedText:"请选择",
		buttonWidth:148,
		nSelectedText:"个选择",
		includeSelectAllOption:false
// 		enableFiltering:true//显示查询输入框
	  });
	//接口来源
	erjingMonitor.loadInterfaceSourceList($.ctx + "/api/inter/interfaceInput/interfaceSource",'#interfaceSource','--请选择--');
	//入库分类
	erjingMonitor.loadInterfaceSourceList($.ctx + "/api/inter/interfaceInput/interfaceEntry",'#entryType');
	//接口类型
	//erjingMonitor.loadInterfaceSourceList($.ctx + "/api/inter/interfaceInput/interfaceType",'#cycleType','--全部--');
	erjingMonitor.loadInterfaceType();
	//日期控件加载
	yijingMonitor.loaddatepicker({
		from:"#ftpTimeFrom",
		to:"#ftpTimeTo"
	});
	yijingMonitor.loaddatepicker({
		from:"#ftpTimeFrom",
		to:"#ftpTimeTo"
	});
	yijingMonitor.loaddatepicker({
		from:"#loadTimeFrom",
		to:"#loadTimeTo"
	});
	yijingMonitor.loaddatepicker({
		from:"#dayLoadTimeFrom",
		to:"#dayLoadTimeTo"
	});
	yijingMonitor.loaddatepicker({
		from:"#dayFtpTimeFrom",
		to:"#dayFtpTimeTo"
	});
	yijingMonitor.loaddatepicker({
		from:"#fileDateFrom",
		to:"#fileDateTo"
	});
	yijingMonitor.loaddatepicker({
		from:"#filePlanArriveTimeFrom",
		to:"#filePlanArriveTimeTo"
	});
	yijingMonitor.loaddatepicker({
		from:"#fileActualArriveTimeFrom",
		to:"#fileActualArriveTimeTo"
	});

//	$('#interfaceTypes').multiselect({
//		nonSelectedText:"--请选择--",
//		buttonWidth:148,
//		nSelectedText:"个选择",
//		includeSelectAllOption:false,
//	  });//	
	yijingMonitor.loaddatepicker({
		from:'#dateTimeFrom',
		to:'#dateTimeTo'
	});
	erjingMonitor.setDefaultDate(erjingMonitor.defaultParams && erjingMonitor.defaultParams.statDateFrom);
	if(erjingMonitor.defaultParams.statDateFrom==undefined){
		erjingMonitor.defaultParams.statDateFrom=DateFmt.loaddatepicker({
			from:"#fileDateFrom",
			to:"#fileDateTo",
			dateFormat: "yy-mm-dd",
	    	minDate:DateFmt.DateCalc(new Date(),"d",-30),
	    	maxDate:DateFmt.DateCalc(new Date(),"d",-1),
			formValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-8),"yyyy-MM-dd"),
			toValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-1),"yyyy-MM-dd")
		});
	}
	
	erjingMonitor.loadStateList();
	erjingMonitor.loaderjingGrid();
	//导出
	$("#opBtn").off("click").on("click",function(){
		var moreQueryIpnut = formFmt.formToObj($("#erjingSearchList"));
		var dateTimeFrom = $("#dateTimeFrom").val();
		var dateTimeTo = $("#dateTimeTo").val();
		var searchEngines = $("#searchEngines").val();
		var typeName  = $("#cycleType").val();
		moreQueryIpnut.entryType = $("#entryType").val();
//		if( $("#entryType").val()==null){
//			moreQueryIpnut.entryType=[2];
//		}
		moreQueryIpnut.interfaceType = typeName ;
		moreQueryIpnut.statDateFrom = dateTimeFrom;
		moreQueryIpnut.statDateTo = dateTimeTo;
		moreQueryIpnut.searchEngines = searchEngines;
		moreQueryIpnut.dataTimeFrom=$("#fileDateFrom").val();
		moreQueryIpnut.dataTimeTo=$("#fileDateTo").val();
		moreQueryIpnut.timeSlotFrom=erjingMonitor.defaultParams.timeSlotFrom;
		moreQueryIpnut.timeSlotTo=erjingMonitor.defaultParams.timeSlotTo;
		moreQueryIpnut.statusType=erjingMonitor.defaultParams.statusType;
		erjingMonitor.defaultParams && (moreQueryIpnut = $.extend(erjingMonitor.defaultParams,moreQueryIpnut))
		if(erjingMonitor.defaultParams!=null){
			if(erjingMonitor.defaultParams.statusType=="load_status"){
				moreQueryIpnut.loadDelay=erjingMonitor.defaultParams.pushStatus;
			}
			if(erjingMonitor.defaultParams.statusType=="file_arrive_status"){
				moreQueryIpnut.arriveDelay=erjingMonitor.defaultParams.pushStatus;
			}
			if(erjingMonitor.defaultParams.statusType=="ftp_status"){
				moreQueryIpnut.ftpDelay=erjingMonitor.defaultParams.pushStatus;
			}
		}
		//erjingMonitor.loadStateList(moreQueryIpnut);
		for(i in moreQueryIpnut){
			if(moreQueryIpnut[i]==undefined){
				delete moreQueryIpnut[i]
			}
		}
		var colModel = $("#erjingGrid").jqGrid('getGridParam',"colModel");
		var colArr = [];
		for(var i = 0; i < colModel.length; i++){
			if(colModel[i].name != "handle"){
				colArr.push(colModel[i].name);
			}
		}
		console.log(moreQueryIpnut)
		moreQueryIpnut.column = colArr.join(',');
		var ssg = window.sessionStorage;
	    var token="";
		if(ssg){
			token = ssg.getItem("token");
			if(token){
				moreQueryIpnut["token"]= token;
				moreQueryIpnut = $.convertData(moreQueryIpnut);
				window.open(encodeURI(encodeURI($.ctx + "/api/inter/interfaceInput/exportInterfaceInputMonitersCsv?"+moreQueryIpnut)));
			}
		}
		//用来服务器记录log
		$.AILog({
			  "action": "导出",//动作
			  "detail": "",//详情,默认为空
			  "module": "interface_monitor_push"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    });
	});
	//查询按钮
	$("#searcherjing").click(function(){
		var colModel = $("#erjingGrid").jqGrid('getGridParam',"colModel");
		var moreQueryIpnut = formFmt.formToObj($("#erjingSearchList"));
		var dateTimeFrom = $("#dateTimeFrom").val();
		var dateTimeTo = $("#dateTimeTo").val();
		var searchEngines = $("#searchEngines").val();
		var typeName  = $("#cycleType").val();
		moreQueryIpnut.entryType = $("#entryType").val();
//		if( $("#entryType").val()==null){
//			moreQueryIpnut.entryType=[2];
//		}
		moreQueryIpnut.dataTimeFrom=$("#fileDateFrom").val();
		moreQueryIpnut.dataTimeTo=$("#fileDateTo").val();
		moreQueryIpnut.typeName  = typeName ;
		moreQueryIpnut.statDateFrom = dateTimeFrom;
		moreQueryIpnut.statDateTo = dateTimeTo;
		moreQueryIpnut.searchEngines = searchEngines;
		moreQueryIpnut.timeSlotFrom=erjingMonitor.defaultParams.timeSlotFrom;
		moreQueryIpnut.timeSlotTo=erjingMonitor.defaultParams.timeSlotTo;
		moreQueryIpnut.statusType=erjingMonitor.defaultParams.statusType;
//		console.log(moreQueryIpnut)
		if(erjingMonitor.defaultParams!=null){
			if(erjingMonitor.defaultParams.statusType=="load_status"){
				moreQueryIpnut.loadDelay=erjingMonitor.defaultParams.pushStatus;
			}
			if(erjingMonitor.defaultParams.statusType=="file_arrive_status"){
				moreQueryIpnut.arriveDelay=erjingMonitor.defaultParams.pushStatus;
			}
			if(erjingMonitor.defaultParams.statusType=="ftp_status"){
				moreQueryIpnut.ftpDelay=erjingMonitor.defaultParams.pushStatus;
			}
		}
		var colArr = [];
		for(var i = 0; i < colModel.length; i++){
			if(colModel[i].name != "handle"){
				colArr.push(colModel[i].name);
			}
		}
		//moreQueryIpnut.column = colArr.join(',');
		
		erjingMonitor.defaultParams && (moreQueryIpnut = $.extend(erjingMonitor.defaultParams,moreQueryIpnut))
		erjingMonitor.loadStateList();
		$("#erjingGrid").jqGrid('setGridParam',{ 
            postData:moreQueryIpnut
        },true).trigger("reloadGrid");
		//用来服务器记录log
		$.AILog({
			  "action": "查询",//动作
			  "detail": "",//详情,默认为空
			  "module": "interface_monitor_push"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    });
	});
	//显示列
	$("#showCol").click(function(){
		$("#showColDlg").aiDialog({
			 width:570,
			  height:"auto",
			  title:"显示列",
			  callback:function(){
				  //TODO
				  var checkedCol = $("#showColDlg > ul").find("input:checked");
				  var colModel = $("#erjingGrid").jqGrid('getGridParam',"colModel");
				  var colNames = $("#erjingGrid").jqGrid('getGridParam',"colNames");
				  if($(document).data("erjingcolModel")){
					  colModel = $(document).data("erjingcolModel");
					  colNames = $(document).data("erjingcolNames");
				  }
				  var currentModel =[];
				  var currentNames =[];
				  for(var i = 0; i < colModel.length; i++){
					  var isExist = false;
					  var colName = colModel[i].name
					  for(var j = 0; j < checkedCol.length; j++){
						  var columnName = $(checkedCol[j]).val();
				          if(columnName == colName){
				              isExist = true;
				              break;
				          } 
				      }
				      if(isExist){
				    	  if(i<colModel.length-1){
					      		colModel[i].width= ($("#erjingGrid").width()-200)/(checkedCol.length-1);
					      	}
				    	    //colModel[i].width= $("#erjingGrid").width()/checkedCol.length;
				    	  	colModel[colModel.length-1].width=200;
				    	  	currentModel.push(colModel[i]);
				    	  	currentNames.push(colNames[i]);
				      }
				  }
				  $.jgrid.gridUnload("erjingGrid");
				  	var moreQueryIpnut = formFmt.formToObj($("#erjingSearchList"));
					var dateTimeFrom = $("#dateTimeFrom").val();
					var dateTimeTo = $("#dateTimeTo").val();
					var searchEngines = $("#searchEngines").val();
					var typeName  = $("#cycleType").val();
					moreQueryIpnut.entryType = $("#entryType").val();
//					if( $("#entryType").val()==null){
//						moreQueryIpnut.entryType=[2];
//					}
					moreQueryIpnut.interfaceType = typeName ;
					moreQueryIpnut.statDateFrom = dateTimeFrom;
					moreQueryIpnut.statDateTo = dateTimeTo;
					moreQueryIpnut.dataTimeFrom=$("#fileDateFrom").val();
					moreQueryIpnut.dataTimeTo=$("#fileDateTo").val();
	        		moreQueryIpnut.timeSlotFrom=erjingMonitor.defaultParams.timeSlotFrom;
	        		moreQueryIpnut.timeSlotTo=erjingMonitor.defaultParams.timeSlotTo;
	        		moreQueryIpnut.statusType=erjingMonitor.defaultParams.statusType;
					moreQueryIpnut.searchEngines = searchEngines;
					if(erjingMonitor.defaultParams!=null){
						if(erjingMonitor.defaultParams.statusType=="load_status"){
							moreQueryIpnut.loadDelay=erjingMonitor.defaultParams.pushStatus;
						}
						if(erjingMonitor.defaultParams.statusType=="file_arrive_status"){
							moreQueryIpnut.arriveDelay=erjingMonitor.defaultParams.pushStatus;
						}
						if(erjingMonitor.defaultParams.statusType=="ftp_status"){
							moreQueryIpnut.ftpDelay=erjingMonitor.defaultParams.pushStatus;
						}
					}
					erjingMonitor.loaderjingGrid({ 
					  colNames:currentNames,
					  postData:moreQueryIpnut,
					  colModel: currentModel
		            });
				   $("#showColDlg").dialog( "close" );
			  } ,
			  open:function(){
				  var columnArr=[
	                 [{column:'interfacecode',hidden:true},{column:'interfaceName',hidden:true},{column:"typeName",title:"接口类型"},{column:"totalRecord",title:"实际入库数"},{column:"loadedRecord",title:"原始文件数"}],
	                 [{column:"statDate",title:"统计日期"},{column:"dataTime",title:"数据日期"},{column:"ftpPlanEndTime",title:"FTP计划完成时间"}],
	                 [{column:"ftpActualEndTime",title:"FTP实际完成时间"},{column:"loadActualEndTime",title:"LOAD实际完成时间 "},{column:"loadPlanEndTime",title:"LOAD计划完成时间"}],
	                 [{column:"ftpStatusStatus",title:"FTP状态"},{column:"loadStatusStatus",title:"LOAD状态"},{column:"interfaceStatusStatus",title:"接口质量"}],
	                 [{column:"priLevel",title:"重要程度"},{column:"interfaceSourceName",title:"接口来源"},{column:"entryTypeName",title:"入库分类"}],
	                 [{column:"dateArgs",title:"偏移量"},{column:"fileActualArriveTime",title:"文件实际到达时间"},{column:"fileStatusStatus",title:"文件到达状态"}],
	                 [{column:"filePlanArriveTime",title:"文件计划到达时间"},{column:"ftpActualStartTime",title:"FTP实际开始时间"},{column:"ftpPlanStartTime",title:"FTP计划开始时间"}],
	                 [{column:"loadActualStartTime",title:"load实际开始时间"},{column:"loadPlanStartTime",title:"load计划开始时间"},{column:"interfaceTableName",title:"接口表名"}],
	                 [{column:'handle',hidden:true}]
				 ];
				  $("#showColDlg > ul").empty();
				  for(var i=0,len= columnArr.length;i<len;i++){
					  var columnList =columnArr[i];
					  var $li = $('<li class="row"></li>');
					  $("#showColDlg > ul").append($li);
					  for(var j=0,leng= columnList.length;j<leng;j++){
						  var html ='';
						  if(columnList[j].hidden){
							  html ='<input type="checkbox" id="col_'+columnList[j].column+'" class="hidden" checked value="'+columnList[j].column+'"> ';
						  }else{
							 html ='<div class="col-md-4"><label class="checkbox-block"><input type="checkbox" id="col_'+columnList[j].column+'" value="'+columnList[j].column+'"> '+columnList[j].title+'</label></div>';
						  }
						  $li.append(html);
					  }
				  }
				  var colModel = $("#erjingGrid").jqGrid('getGridParam',"colModel");
				  
				  for(var i=0,len= colModel.length;i<len;i++){
					  if(!colModel[i].hidden){
						  $("#col_"+ colModel[i].name).prop("checked",true);
					  }else{
						  $("#col_"+ colModel[i].name).prop("checked",false);
					  }
				  }
			  }
		});
		
	});

});
