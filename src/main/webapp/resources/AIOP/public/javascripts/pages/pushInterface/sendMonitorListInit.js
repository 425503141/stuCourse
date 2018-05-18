/**
 *作者：wangsen3 
 *一经监控入口 
 */
$(function(){
	yijingMonitor.loadStatusList();
	yijingMonitor.loadCycleType();
	$('#subheaderBox').find('a:eq(2)').parent().siblings("li").removeClass('active');
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
		url:$.ctx + "/api/push/rpt/raing/assco",
	  	 data:{
		       "searchEngines": "searchEngines"  //"前端页面ID"："后台传参"
//		       "dateTime": "dateTime"
		   },
		  jsonReader:{
			  item:"search",
		  }
	});
	yijingMonitor.loaddatepicker({
		from:"#doPlanDatetimeFrom",
		to:"#doPlanDatetimeTo"
	});
	yijingMonitor.loaddatepicker({
		from:"#statDateFrom",
		to:"#statDateTo",
		
	});
	yijingMonitor.loaddatepicker({
		from:"#doEndDatetimeFrom",
		to:"#doEndDatetimeTo"
	});
	yijingMonitor.loaddatepicker({
		from:"#doPlanDatetime1From",
		to:"#doPlanDatetime1To"
	});
	yijingMonitor.loaddatepicker({
		from:"#doEndDatetime1From",
		to:"#doEndDatetime1To"
	});
	yijingMonitor.loaddatepicker({
		from:"#indbEndTimeFrom",
		to:"#indbEndTimeTo"
	});
	yijingMonitor.loaddatepicker({
		from:"#getDataMinTime",
		to:"#getDataMaxTime"
	});
	yijingMonitor.loaddatepicker({
		from:"#dataLoadMinTime",
		to:"#dataLoadMaxTime"
	});
	DateFmt.loaddatepicker({
		from:"#dataTimeFrom",
		to:"#dataTimeTo",
//		dateFormat: "yy-mm-dd",
//    	minDate:DateFmt.DateCalc(new Date(),"d",-30),
//    	maxDate:DateFmt.DateCalc(new Date(),"d",-1),
//		formValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-8),"yyyy-MM-dd"),
//		toValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-1),"yyyy-MM-dd")
	});
	
	yijingMonitor.setDefaultDate(yijingMonitor.defaultParams && yijingMonitor.defaultParams.statDateFrom);
//	console.log(yijingMonitor.defaultParams.statDateFrom)
	if(yijingMonitor.defaultParams.statDateFrom==undefined){
		yijingMonitor.defaultParams.statDateFrom=DateFmt.loaddatepicker({
			from:"#dataTimeFrom",
			to:"#dataTimeTo",
			dateFormat: "yy-mm-dd",
	    	minDate:DateFmt.DateCalc(new Date(),"d",-30),
	    	maxDate:DateFmt.DateCalc(new Date(),"d",-1),
			formValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-8),"yyyy-MM-dd"),
			toValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-1),"yyyy-MM-dd")
		});
	}
	yijingMonitor.loadStateList();
	yijingMonitor.loadyijingGrid();
	
	$("#searchyijing").click(function(){
		var moreQueryIpnut = formFmt.formToObj($("#yijingSearchList"));
		var searchEngines = $("#searchEngines").val();
		var interfaceType = $("#cycleType").val();
		var statDateFrom = $("#statDateFrom").val();
		var statDateTo = $("#statDateTo").val();
		moreQueryIpnut.doOpDateFrom=$("#dataTimeFrom").val();
		moreQueryIpnut.doOpDateTo=$("#dataTimeTo").val();
		moreQueryIpnut.exportType = interfaceType;
		moreQueryIpnut.search = searchEngines;
		moreQueryIpnut.statDateFrom = statDateFrom;
		moreQueryIpnut.statDateTo = statDateTo;
		moreQueryIpnut.doOpTime=yijingMonitor.defaultParams.doOpTime;
		moreQueryIpnut.statusType=yijingMonitor.defaultParams.statusType;
		if(yijingMonitor.defaultParams!=null){
			if(yijingMonitor.defaultParams.statusType=="interface_push"){
				moreQueryIpnut.pushFinishStatus=yijingMonitor.defaultParams.pushStatus;
			}
			if(yijingMonitor.defaultParams.statusType=="interface_num"){
				moreQueryIpnut.pushNumStatus=yijingMonitor.defaultParams.pushStatus;
			}
		}
		for(i in moreQueryIpnut){
    		if(moreQueryIpnut[i]==""){
    			delete moreQueryIpnut[i];
    		}
    	}
		yijingMonitor.loadStateList(moreQueryIpnut);
		$("#yijngGrid").jqGrid('setGridParam',{ 
            postData:moreQueryIpnut
        },true).trigger("reloadGrid");
		//用来服务器记录log
		$.AILog({
			  "action": "查询",//动作
			  "detail": "",//详情,默认为空
			  "module": "interface_monitor_inbound"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    });
	});
	//导出
	$("#opBtn").off("click").on("click",function(){
		var moreQueryIpnut = formFmt.formToObj($("#yijingSearchList"));
		var searchEngines = $("#searchEngines").val();
		var interfaceType = $("#cycleType").val();
		var statDateFrom = $("#statDateFrom").val();
		var statDateTo = $("#statDateTo").val();
		moreQueryIpnut.doOpDateFrom=$("#dataTimeFrom").val();
		moreQueryIpnut.doOpDateTo=$("#dataTimeTo").val();
		moreQueryIpnut.exportType = interfaceType;
		moreQueryIpnut.search = searchEngines;
		moreQueryIpnut.statDateFrom = statDateFrom;
		moreQueryIpnut.statDateTo = statDateTo;
		moreQueryIpnut.doOpTime=yijingMonitor.defaultParams.doOpTime;
		moreQueryIpnut.statusType=yijingMonitor.defaultParams.statusType;
		for(i in moreQueryIpnut){
    		if(moreQueryIpnut[i]==""){
    			delete moreQueryIpnut[i];
    		}
    	}
		yijingMonitor.loadStateList(moreQueryIpnut);
		if(yijingMonitor.defaultParams!=null){
			if(yijingMonitor.defaultParams.statusType=="interface_push"){
				moreQueryIpnut.pushFinishStatus=yijingMonitor.defaultParams.pushStatus;
			}
			if(yijingMonitor.defaultParams.statusType=="interface_num"){
				moreQueryIpnut.pushNumStatus=yijingMonitor.defaultParams.pushStatus;
			}
		}
		var colModel = $("#yijngGrid").jqGrid('getGridParam',"colModel");
		var colArr = [];
		for(var i = 0; i < colModel.length; i++){
			if(colModel[i].name != "handle"){
				colArr.push(colModel[i].name);
			}
		}
		moreQueryIpnut.column = colArr.join(',');
		var ssg = window.sessionStorage;
	    var token="";
		if(ssg){
			token = ssg.getItem("token");
			if(token){
				moreQueryIpnut["token"]= token;
				moreQueryIpnut = $.convertData(moreQueryIpnut);
				window.open(encodeURI(encodeURI($.ctx + "/api/push/rpt/raing/export?"+moreQueryIpnut)));
			}
		}
		//用来服务器记录log
		$.AILog({
			  "action": "导出",//动作
			  "detail": "",//详情,默认为空
			  "module": "interface_monitor_inbound"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    });
	});
	

	yijingMonitor.loadPushList();
	yijingMonitor.loadTops();

	
	//显示列
	$("#showCol").click(function(){
		$("#showColDlg").aiDialog({
			 width:570,
			  height:"auto",
			  title:"显示列",
			  callback:function(){
				  //TODO
				  var checkedCol = $("#showColDlg > ul").find("input:checked");
				  var colModel = $("#yijngGrid").jqGrid('getGridParam',"colModel");
				  var colNames = $("#yijngGrid").jqGrid('getGridParam',"colNames");
				  if($(document).data("colModel")){
					  colModel = $(document).data("colModel");
					  colNames = $(document).data("colNames");
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
				      		colModel[i].width= ($("#yijngGrid").width()-150)/(checkedCol.length-1);
				      	}
//				    	    colModel[i].width= $("#yijngGrid").width()/checkedCol.length;
				    	    colModel[colModel.length-1].width=150;
				    	  	currentModel.push(colModel[i]);
				    	  	currentNames.push(colNames[i]);
				      }
				  }
				   
				  $.jgrid.gridUnload("yijngGrid");
				  var moreQueryIpnut = formFmt.formToObj($("#yijingSearchList"));
					var searchEngines = $("#searchEngines").val();
					var interfaceType = $("#cycleType").val();
					var statDateFrom = $("#statDateFrom").val();
					var statDateTo = $("#statDateTo").val();
					moreQueryIpnut.doOpDateFrom=$("#dataTimeFrom").val();
					moreQueryIpnut.doOpDateTo=$("#dataTimeTo").val();
					moreQueryIpnut.exportType = interfaceType;
					moreQueryIpnut.search = searchEngines;
					moreQueryIpnut.statDateFrom = statDateFrom;
					moreQueryIpnut.statDateTo = statDateTo;
					moreQueryIpnut.doOpTime=yijingMonitor.defaultParams.doOpTime;
					moreQueryIpnut.statusType=yijingMonitor.defaultParams.statusType;
					for(i in moreQueryIpnut){
			    		if(moreQueryIpnut[i]==""){
			    			delete moreQueryIpnut[i];
			    		}
			    	}
					if(yijingMonitor.defaultParams!=null){
	        			if(yijingMonitor.defaultParams.statusType=="interface_push"){
	        				moreQueryIpnut.pushFinishStatus=yijingMonitor.defaultParams.pushStatus;
	        			}
	        			if(yijingMonitor.defaultParams.statusType=="interface_num"){
	        				moreQueryIpnut.pushNumStatus=yijingMonitor.defaultParams.pushStatus;
	        			}
	        		}
	        		for(i in moreQueryIpnut){
	            		if(moreQueryIpnut[i]==""){
	            			delete moreQueryIpnut[i];
	            		}
	            	}
				  yijingMonitor.loadyijingGrid({ 
					  colNames:currentNames,
					  colModel: currentModel,
					  postData:moreQueryIpnut
		            });
				  $("#showColDlg").dialog( "close" );
			  } ,
			  open:function(){
				 
				  var columnArr=[
		                 [{column:"doEndDatetime",title:"实际出数时间"},{column:"doEndDatetime1",title:"实际推送数据完成时间"},{column:"doOpDate",title:"数据日期"}],
		                 [{column:"doPlanDatetime",title:"计划出数时间"},{column:"doPlanDatetime1",title:"计划推送数据完成时间"},{column:"exportType",title:"接口类型"}],
		                 [{column:"indbEndTime",title:"BOSS入库完成时间"},{column:"indbRowNum",title:"入库数据量"},{column:"lastValues",title:"环比"}],
		                 [{column:"pushFinishStatus",title:"推送状态"},{column:"pushNumStatus",title:"出数状态"},{column:"sourceName",title:"目标系统"}],
		                 [{column:"tableValues",title:"推送量"},{column:'handle',hidden:true},{column:'exportName',hidden:true},{column:'exportId',hidden:true}]
					 ];
				  
				  
				  $("#showColDlg > ul").empty();
				  for(var i=0,len= columnArr.length;i<len;i++){
					  var columnList =columnArr[i];
					  var $li = $('<li class="row"></li>');
					  $("#showColDlg > ul").append($li);
					  for(var j=0,leng= columnList.length;j<leng;j++){
						  var html ='';
						  if(columnList[j].hidden){
							  html ='<input type="checkbox" id="'+columnList[j].column+'" class="hidden" checked value="'+columnList[j].column+'"> ';
						  }else{
							 html ='<div class="col-md-4"><label class="checkbox-block"><input type="checkbox"  id="'+columnList[j].column+'" value="'+columnList[j].column+'"> '+columnList[j].title+'</label></div>';
						  }
						  $li.append(html);
					  }
				  }
				  
				  var colModel = $("#yijngGrid").jqGrid('getGridParam',"colModel");
				  for(var i=0,len= colModel.length;i<len;i++){
					  if(!colModel[i].hidden){
						  $("#"+ colModel[i].name).prop("checked",true);
						  $("#showColDlg > ul").find("#"+ colModel[i].name).prop("checked",true)
					  }else{
						  $("#"+ colModel[i].name).prop("checked",false);
					  }
				  }
			  }
		});
		
	});

	
	
});