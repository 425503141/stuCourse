/**
 *主机监控
 */
$(function(){
	databaseMonitor.getUserId();//获取用户id
	databaseMonitor.loaddatabaseMonitorGrid();//加载主机监控列表
	//全部分类
	databaseMonitor.loadAllTypeList();
	$("#allTypeBtn").click(function(){
		if($(this).hasClass("active")){
			$(this).removeClass("active");
			$("#allTypeZtreeDlg").addClass("hidden");
		}else{
			$(this).addClass("active");
			$("#allTypeZtreeDlg").removeClass("hidden");
		}
	});
	//输入框联想输入
	$( "#searchTxt").AIAutoComplete({
		url:$.ctx + "/api/db/base/monitor/lenovo",
	  	 data:{"searchTxt":"search","userIdHidden":"userId"},//dom ID ：参数名称,
		 jsonReader:{item:"search"}//返回结果中用于展示使用的字段名
	});
	//查询按钮
	$("#searchBtnDatabaseMonitor").click(function(){
		var treeObj=$.fn.zTree.getZTreeObj("appType");
		var moreQueryIpnut = {"userId":databaseMonitor.userId,"search":$("#searchTxt").val()};
		$("#gridDatabaseMonitor").jqGrid('setGridParam',{ 
            postData:moreQueryIpnut
        }).trigger("reloadGrid");
		//用来服务器记录log
		/*$.AILog({
			  "action": "查询",//动作
			  "detail": "",//详情,默认为空
			  "module": "app_monitor_history"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    });*/
	});
    // 关闭第二屏主机详情页面按钮
	$(".ui-moudle-title i.ui-close-panel").click(function(){
		$(this).parent().parent().addClass("hidden");
	});
});