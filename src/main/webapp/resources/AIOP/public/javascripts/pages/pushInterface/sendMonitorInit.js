/**
 *接口监控-推送监控
 */
$(function(){
	sendMonitor.loaddatepicker({
		from:'#uploadActualMinTime',
//		to:'#uploadActualMaxTime'
	});
	/*
	 *获取前几天
	 *@param day 前多少天
	 */
	var getEarlierDay = function(day){
		var now = new Date().getTime();
		return new Date(now - day * 24 * 3600 * 1000);
	}
	$('#uploadActualMinTime').datepicker( 'setDate' , getEarlierDay(0));
//	$('#uploadActualMaxTime').datepicker( 'setDate' , getEarlierDay(0));
	sendMonitor.renderGrids();

	var token = window.sessionStorage && window.sessionStorage.getItem('token');
	if(!token) return;
	/*
	 *查询表格信息
	 */
	var queryDetails = function(e){
		e.stopPropagation();
		e.preventDefault();
		var gridTypes = ['interface_push','interface_wave','interface_num','interface_push'],
			fromTime = $('#uploadActualMinTime').val(),//开始时间
//			toTime = $('#uploadActualMaxTime').val(),//结束时间
			option = {
				'X-Authorization':token,
	            'statDate':fromTime,
			}
		gridTypes.forEach(function(item){
			option.statusType=item;
			// $('.' + item).jqGrid('clearGridData');
			$('.' + item).jqGrid('setGridParam',{
				postData:option
			},true).trigger('reloadGrid');
		})
		// interfaceStatus.renderGrids();
	}
	$('.ints-query').on('click',queryDetails);

	/*
	 *导出文件
	 */
	var exportDetails = function(e){
		e.stopPropagation();
		e.preventDefault();
		var fromTime = $('#uploadActualMinTime').val(),//开始时间
//			toTime = $('#uploadActualMaxTime').val(),//结束时间 
			option = {
				'token':token,
				'X-Authorization':token,
				'statDate':fromTime,
//				'dataTimeTo':toTime
			};
		option = $.convertData(option);
		window.open(encodeURI(encodeURI($.ctx + '/api/ring/push/tables/export?' + option)))
	}
	$('.ints-export').on('click',exportDetails);
	
	
	
//	sendMonitor.loadCycleList('#sendCycle','148');//推送周期
//	sendMonitor.loadSourceList('#targetSys','148');//目标系统
//	sendMonitor.loadLevelList('#importLevel',$.priLevelObj);//重要级别
	//统计日期
//	$("#dateTime").val(DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-0),"yyyy-MM-dd")).datepicker({
//		minDate:DateFmt.DateCalc(new Date(),"d",-31),
//		changeMonth: true,
//		numberOfMonths:1,
//		dateFormat: "yy-mm-dd",
//		beforeShow :function(){
//			$.datepicker.dpDiv.removeClass("ui-hide-calendar");
//		}
//	});
//	//数据日期
//	$("#dataTime").datepicker({
//  	//defaultDate: "+1w",
//  	changeMonth: true,
//  	numberOfMonths:1,
//  	dateFormat: "yy-mm-dd",
//		beforeShow :function(){
//			$.datepicker.dpDiv.removeClass("ui-hide-calendar");
//		}
//	});
//	//是否标签
//	$('#isLabel').multiselect({
//		nonSelectedText:"全部",
//		buttonWidth:134,
//		nSelectedText:"个选择",
//		includeSelectAllOption:true,
//		selectAllText: '全部',
//	});
//	//推送周期
//	$('#sendCycle').multiselect({
//		nonSelectedText:"全部",
//		buttonWidth:134,
//		nSelectedText:"个选择",
//		includeSelectAllOption:true,
//		selectAllText: '全部',
//	});
//	//目标系统
//	$('#targetSys').multiselect({
//		nonSelectedText:"全部",
//		buttonWidth:134,
//		nSelectedText:"个选择",
//		includeSelectAllOption:true,
//		selectAllText: '全部',
//	});
//	//出数是否延迟
//	$('#isDelaySel').multiselect({
//		nonSelectedText:"全部",
//		buttonWidth:134,
//		nSelectedText:"个选择",
//		includeSelectAllOption:true,
//		selectAllText: '全部',
//	});
//	//推送数据是否成功
//	$('#isSuccess').multiselect({
//		nonSelectedText:"全部",
//		buttonWidth:134,
//		nSelectedText:"个选择",
//		includeSelectAllOption:true,
//		selectAllText: '全部',
//	});
//	//重要级别
//	$('#importLevel').multiselect({
//		nonSelectedText:"全部",
//		buttonWidth:134,
//		nSelectedText:"个选择",
//		includeSelectAllOption:true,
//		selectAllText: '全部',
//	});
//	//生效日期
//	DateFmt.loaddatepicker({
//		from:"#effectMinTime",
//		to:"#effectMaxTime"
//	});
//	//失效日期
//	DateFmt.loaddatepicker({
//		from:"#expireMinTime",
//		to:"#expireMaxTime"
//	});
//	//计划出数时间
//	DateFmt.loaddatepicker({
//		from:"#planOutputMinTime",
//		to:"#planOutputMaxTime"
//	});
//	//实际出数时间
//	DateFmt.loaddatepicker({
//		from:"#actualOutputMinTime",
//		to:"#actualOutputMaxTime"
//	});
//	//计划推送完成时间
//	DateFmt.loaddatepicker({
//		from:"#planSendMinTime",
//		to:"#planSendMaxTime"
//	});
//	//推送数据完成时间
//	DateFmt.loaddatepicker({
//		from:"#sendDataMinTime",
//		to:"#sendDataMaxTime"
//	});
//	//BOSS取数时间
//	DateFmt.loaddatepicker({
//		from:"#bossOutMinTime",
//		to:"#bossOutMaxTime"
//	});
//	//BOSS入库完成时间
//	DateFmt.loaddatepicker({
//		from:"#bossSuccessMinTime",
//		to:"#bossSuccessMaxTime"
//	});
//	/**自动补全**/
//	$( "#searchEngines" ).AIAutoComplete({
//		url:$.ctx + "/api/out/rpt/push/lenovo",
//	  	 data:{
//		       "searchEngines": "search",   //"前端页面ID"："后台传参"
//		       "dateTime": "statDate"
//		   },
//		  jsonReader:{
//			  item:"SEARCHTEXT",
//		  }
//	});
////	sendMonitor.loadStateList();//加载状态按钮
////	sendMonitor.loadGridSend();//加载列表
//	//查询
//	$("#searchyijing").click(function(){
//		var moreQueryIpnut = formFmt.formToObj($("#yijingSearchList"));
//		moreQueryIpnut.statDate = $("#dateTime").val();
//		moreQueryIpnut.doOpDate = $("#dataTime").val();
//		moreQueryIpnut.search = $("#searchEngines").val();
//		sendMonitor.loadStateList(moreQueryIpnut);
//		$("#gridSend").jqGrid('setGridParam',{ 
//          postData:moreQueryIpnut
//      },true).trigger("reloadGrid");
//		//用来服务器记录log
//		/*$.AILog({
//			  "action": "查询",//动作
//			  "detail": "",//详情,默认为空
//			  "module": "interface_monitor_inbound"//二级菜单名称，如无二级菜单 使用一级菜单名称
//	    });*/
//	});
//	//导出
//	$("#opBtn").click(function(){
//		var moreQueryIpnut = formFmt.formToObj($("#yijingSearchList"));
//		moreQueryIpnut.statDate = $("#dateTime").val();
//		moreQueryIpnut.doOpDate = $("#dataTime").val();
//		moreQueryIpnut.search = $("#searchEngines").val();
//		var type = $('.J_curState').attr('data-statusType');
//		var statusCode = $('.J_curState').attr("data-statusCode");
//		if(type == "doEndDateTime"){
//			moreQueryIpnut.doEndDateTime = statusCode;
//			moreQueryIpnut.isDelay = $('#isDelaySel').val();
//			
//		}
//		if(type == "isDelay"){
//			moreQueryIpnut.isDelay = statusCode;
//			moreQueryIpnut.doEndDateTime = $('#isSuccess').val();
//		}
//		var colModel = $("#gridSend").jqGrid('getGridParam',"colModel");
//		var colArr = [];
//		for(var i = 0; i < colModel.length; i++){
//			if(colModel[i].name != "handle"){
//				colArr.push(colModel[i].name);
//			}
//		}
//		moreQueryIpnut.column = colArr.join(',');
//		var ssg = window.sessionStorage;
//	    var token="";
//		if(ssg){
//			token = ssg.getItem("token");
//			if(token){
//				moreQueryIpnut["token"]= token;
//				moreQueryIpnut = $.convertData(moreQueryIpnut);
//				window.open(encodeURI(encodeURI($.ctx + "/api/out/rpt/push/export?"+moreQueryIpnut)));
//			}
//		}
//		//用来服务器记录log
//		/*$.AILog({
//			  "action": "导出",//动作
//			  "detail": "",//详情,默认为空
//			  "module": "interface_monitor_inbound"//二级菜单名称，如无二级菜单 使用一级菜单名称
//	    });*/
//	});
//	//显示列
//	$("#showCol").click(function(){
//		$("#showColDlg").aiDialog({
//			 width:570,
//			  height:"auto",
//			  title:"显示列",
//			  callback:function(){
//				  var checkedCol = $("#showColDlg > ul").find("input:checked");
//				  var colModel = $("#gridSend").jqGrid('getGridParam',"colModel");
//				  var colNames = $("#gridSend").jqGrid('getGridParam',"colNames");
//				  if($(document).data("colModel")){
//					  colModel = $(document).data("colModel");
//					  colNames = $(document).data("colNames");
//				  }
//				  var currentModel =[];
//				  var currentNames =[];
//				  for(var i = 0; i < colModel.length; i++){
//					  var isExist = false;
//					  var colName = colModel[i].name
//					  for(var j = 0; j < checkedCol.length; j++){
//						  var columnName = $(checkedCol[j]).val();
//				          if(columnName == colName){
//				              isExist = true;
//				              break;
//				          } 
//				      }
//				      if(isExist){
//				    	    colModel[i].hidden = false;//展示隐藏的列
//				    	    colModel[i].width= $("#gridSend").width()/checkedCol.length;
//				    	  	currentModel.push(colModel[i]);
//				    	  	currentNames.push(colNames[i]);
//				      }
//				  }
//				  $.jgrid.gridUnload("gridSend");
//				    var moreQueryIpnut = formFmt.formToObj($("#yijingSearchList"));
//				    moreQueryIpnut.statDate = $("#dateTime").val();
//					moreQueryIpnut.doOpDate = $("#dataTime").val();
//					moreQueryIpnut.search = $("#searchEngines").val();
//				    sendMonitor.loadGridSend({ 
//					  colNames:currentNames,
//					  colModel: currentModel,
//					  postData:moreQueryIpnut
//		            });
//				   $("#showColDlg").dialog( "close" );
//			  } ,
//			  open:function(){
//				  var columnArr=[
//	                 [{column:"exportFileName",title:"推送文件名称",hidden:true},{column:"statDate",title:"统计日期"},{column:"exportId",title:"序号"},{column:"doOpDate",title:"数据日期"}],
//	                 [{column:"requirementIdAndName",title:"需求编号和名称"},{column:"requirePeople",title:"需求人"},{column:"exportName",title:"推送数据标题"}],
//	                 [{column:"isRemarks",title:"是否标签"},{column:"remarks",title:"标签ID及名称"},{column:"exportType",title:"推送周期"}],
//	                 [{column:"startDate",title:"生效日期"},{column:"endDate",title:"失效日期"},{column:"exportSource",title:"目标系统"}],
//	                 [{column:"exportFileFtpIp",title:"目标IP"},{column:"exportFileFtpDir",title:"目标目录"},{column:"exportTableName",title:"后台表"}],
//	                 [{column:"customerBore",title:"用户群口径"},{column:"dataUse",title:"数据用途"},{column:"doEndDateTime",title:"实际出数时间"}],
//	                 [{column:"execTime",title:"计划出数时间"},{column:"isDelay",title:"出数是否延迟"},{column:"doEndDateTime1",title:"推送数据完成时间"}],
//	                 [{column:"execTime1",title:"计划推送完成时间"},{column:"isDoEndDateTime",title:"推送数据是否成功"},{column:"tableValues",title:"推送量"}],
//	                 [{column:"lastValues",title:"推送量环比"},{column:"requireLevel",title:"重要级别"},{column:"indbStartTime",title:"BOSS取数时间"}],
//	                 [{column:"indbEndTime",title:"BOSS入库完成时间"},{column:"indbRowNum",title:"入库数据量"},{column:'handle',hidden:true}],
//	                ];
//				  $("#showColDlg > ul").empty();
//				  for(var i=0,len= columnArr.length;i<len;i++){
//					  var columnList =columnArr[i];
//					  var $li = $('<li class="row"></li>');
//					  $("#showColDlg > ul").append($li);
//					  for(var j=0,leng= columnList.length;j<leng;j++){
//						  var html ='';
//						  if(columnList[j].hidden){
//							  html ='<input type="checkbox" id="'+columnList[j].column+'" class="hidden" checked value="'+columnList[j].column+'"> ';
//						  }else{
//							 html ='<div class="col-md-4"><label class="checkbox-block"><input type="checkbox" id="'+columnList[j].column+'" value="'+columnList[j].column+'"> '+columnList[j].title+'</label></div>';
//						  }
//						  $li.append(html);
//					  }
//				  }
//				  var colModel = $("#gridSend").jqGrid('getGridParam',"colModel");
//				  for(var i=0,len= colModel.length;i<len;i++){
//					  if(!colModel[i].hidden){
//						  $("#"+ colModel[i].name).prop("checked",true);
//					  }else{
//						  $("#"+ colModel[i].name).prop("checked",false);
//					  }
//				  }
//			  }
//		});
//		
//	});
//	
});