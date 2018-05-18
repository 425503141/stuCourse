/**
 *历史监控初始化加载 
 */
$(function(){
	//统计日期
	/*minDate:DateFmt.DateCalc(new Date(),"y",-1),*/
	$("#dateTime").val(DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-1),"yyyy-MM-dd")).datepicker({
		minDate:"-1Y -1D",//去年的今天的昨天
		changeMonth: true,
		numberOfMonths:1,
		dateFormat: "yy-mm-dd",
		maxDate:-1,
		beforeShow :function(){
			$.datepicker.dpDiv.removeClass("ui-hide-calendar");
		}
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
	realTimeMonitor.loadStatusList("#statusType");
	historyMonitor.loadStatusNumber("#statusContent");
	historyMonitor.loadAppGrid();
	/**查询按钮*/
	$("#queryAppMonitorList").click(function(){
		var moreQueryIpnut = formFmt.formToObj($("#queryAppMonitorForm"));
		var dataTime = $("#dataDate").val();
		var appName = $("#appName").val();
		var runFreq = $("#cycleType").val();
		moreQueryIpnut.runFreq = runFreq;
		moreQueryIpnut.dataTime = dataTime;
		moreQueryIpnut.appName = appName;
		moreQueryIpnut.statDate = $("#dateTime").val();
		var treeObj=$.fn.zTree.getZTreeObj("appType");
		var appClassifyId = treeObj&&treeObj.getSelectedNodes()[0] ?  treeObj.getSelectedNodes()[0].id : "";
		moreQueryIpnut.appClassifyId = appClassifyId;
		historyMonitor.loadStatusNumber("#statusContent");
		$("#APPList").jqGrid('setGridParam',{ 
            postData:moreQueryIpnut,page:1
        },true).trigger("reloadGrid");
		//用来服务器记录log
		$.AILog({
			  "action": "查询",//动作
			  "detail": "",//详情,默认为空
			  "module": "app_monitor_history"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    });
	});
	realTimeMonitor.initCycle();
	$( "#dataDate" ).datepicker({
    	changeMonth: true,
    	numberOfMonths:1,
    	dateFormat: "yy-mm-dd"
	});
	/**自动补全**/
	$( "#appName" ).AIAutoComplete({
		url:$.ctx + "/api/appMonitor/history/getByProcName",
	  	 data:{
		  		 "appName": "searchText",   // "输入框的id":"后台需要的入参名称"
		   },
		  jsonReader:{
			  item:"procNameEn"//接口返回的用于展示的字段名称
		  }
	});
	/**
	 * 全部分类 
	 */
	realTimeMonitor.loadAllTypeList();
	$("#allTypeBtn").click(function(){
		if($(this).hasClass("active")){
			$(this).removeClass("active");
			$("#allTypeZtreeDlg").addClass("hidden");
		}else{
			$(this).addClass("active");
			$("#allTypeZtreeDlg").removeClass("hidden");
		}
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
	 /***
     * 关闭详情页面按钮
     */
	$(".ui-moudle-title i.ui-close-panel").click(function(){
		$(this).parent().parent().addClass("hidden");
	});
	$('#cycleType').multiselect({
		buttonWidth:148,
		nSelectedText:"个选择",
		includeSelectAllOption:false,
    });
	$('#importantType').multiselect({
		nonSelectedText:"选择重要程度",
		buttonWidth:148,
		nSelectedText:"个选择",
		includeSelectAllOption:false,
		selectAllText: ' 全部'
	  });
});