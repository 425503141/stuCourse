/**
 * ------------------------------------------------------------------
 * 应用监控-实时监控
 * ------------------------------------------------------------------
 */
$(function(){
	realTimeMonitor.initCycle();
	$('#importantType').multiselect({
		nonSelectedText:"选择重要程度",
		buttonWidth:148,
		nSelectedText:"个选择",
		includeSelectAllOption:false
	  });
	/**
	 * 全部分类 
	 */
	realTimeMonitor.loadAllTypeList('','1');
	$("#allTypeBtn").click(function(){
		if($(this).hasClass("active")){
			$(this).removeClass("active");
			$("#allTypeZtreeDlg").addClass("hidden");
		}else{
			$(this).addClass("active");
			$("#allTypeZtreeDlg").removeClass("hidden");
		}
	});
	$( "#dataDate" ).datepicker({
    	changeMonth: true,
    	numberOfMonths:1,
    	dateFormat: "yy-mm-dd"
	});
	/**自动补全**/
	$( "#appName" ).AIAutoComplete({
		url:$.ctx + "/api/appMonitor/realTime/getByProcName",
	  	 data:{
		  		 "appName": "searchText", // "输入框的id":"后台需要的入参名称"
		   },
		  jsonReader:{
			  item:"procNameEn"//接口返回的用于展示的字段名称
		  }
	});
	/**查询按钮*/
	$("#queryAppMonitorList").click(function(){
		var moreQueryIpnut = formFmt.formToObj($("#queryAppMonitorForm"));
		var dataTime = $("#dataDate").val();
		var appName = $("#appName").val();
		var runFreq = $("#cycleType").val();
		moreQueryIpnut.runFreq = runFreq;
		moreQueryIpnut.dataTime = dataTime;
		moreQueryIpnut.appName = appName;
		var treeObj=$.fn.zTree.getZTreeObj("appType");
		var appClassifyId = treeObj&&treeObj.getSelectedNodes()[0]?  treeObj.getSelectedNodes()[0].id : "";
		moreQueryIpnut.appClassifyId = appClassifyId;
		realTimeMonitor.loadStatusNumber("#statusContent");
		$("#APPList").jqGrid('setGridParam',{ 
            postData:moreQueryIpnut,page:1
        },true).trigger("reloadGrid");
		//用来服务器记录log
		$.AILog({
			  "action": "查询",//动作
			  "detail": "",//详情,默认为空
			  "module": "app_monitor_realtime"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    });
	});
	/**
	 * 状态按钮
	 */
	 $("#statusContent").on("click",".btn",function(){
		 var statusCode = $(this).attr("data-statusCode");
	 	$("#APPList").jqGrid('setGridParam',{ 
	        postData:{runStatus:statusCode},page:1
	    }).trigger("reloadGrid");
	 });
	//加载日期控件
	DateFmt.loaddatepicker({
		from:"#planSartDate",
		to:"#planEndDate"
	});
	DateFmt.loaddatepicker({
		from:"#actualSartDate",
		to:"#actualEndDate"
	});
	realTimeMonitor.loadAppGrid();
	realTimeMonitor.loadStatusList("#statusType");
	realTimeMonitor.loadStatusNumber("#statusContent");
	/***
     * 关闭详情页面按钮
     */
	$(".ui-moudle-title i.ui-close-panel").click(function(){
		$(this).parent().parent().addClass("hidden");
	});
});