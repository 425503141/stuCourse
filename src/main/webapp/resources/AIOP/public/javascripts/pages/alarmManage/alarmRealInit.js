/**
 * ------------------------------------------------------------------
 * 告警管理-实时告警
 * ------------------------------------------------------------------
 */
$(function(){
	//告警分类下拉
	alarmHistory.loadResourceTypeList('#resourceType','150');
	//输入框联想输入
	$( "#searchTxt").AIAutoComplete({
		url:$.ctx + "/api/alarm/common/queryAlarmIpOrNameList",
	  	 data:{"searchTxt":"searchTxt"},//dom ID ：参数名称,
		 jsonReader:{item:"searchText"}//返回结果中用于展示使用的字段名
	});
	//告警类型下拉 -根据资源类型选择进行联动 - 主机的
	/*hostManage.loadAlarmTypeList('#alarmType','150','');
	$('#resourceType').change(function(){
		var deviceType = $(this).val();
		hostManage.loadAlarmTypeList('#alarmType','180',deviceType);
	});*/
	alarmReal.loadHostManageGrid();//初始化加载列表
	//查询按钮
	$("#searchHostManage").click(function(){
		alarmReal.refreshGridHostManage();
		//用来服务器记录log
    	/*$.AILog({
			  "action": "查询",//动作
			  "detail": "",//详情,默认为空
			  "module": "sys_daq_plan"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    });*/
	});
});