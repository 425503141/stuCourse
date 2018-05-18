/**
 * ------------------------------------------------------------------
 * 采集周期方案
 * ------------------------------------------------------------------
 */
$(function(){
	cyclePlan.loadCyclePlanGrid();//初始化加载列表
	cyclePlan.loadResTypesList('#resTypes',134);//加载资源类别
	//全部状态
	$('#staNums').multiselect({
		nonSelectedText:"全部状态",
		buttonWidth:134,
		nSelectedText:"个选择",
		includeSelectAllOption:true,
		selectAllText: '全部',
	});
	//查询按钮
	$("#searchCyclePlan").click(function(){
		cyclePlan.refreshGridCyclePlan();
		//用来服务器记录log
		$.AILog({
			  "action": "查询",//动作
			  "detail": "",//详情,默认为空
			  "module": "sys_daq_plan"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    });
	});
	//新建
	$("#cyclePlanAddBtn").click(function(){
		cyclePlan.insertOrUpdateApp(this,'0');
	});
	//校验采集方案名称
	$('#planName').change(function(){
		cyclePlan.validateName('planName');
	});
	//输入框模糊下拉自动补全
	$( "#searchTxt" ).AIAutoComplete({
		url:$.ctx + "/api/sys/selectByPlanName",
	  	 data:{
		  		 "searchTxt": "planName",   // "输入框的id":"后台需要的入参名称"
		   },
		  jsonReader:{
			  item:"planName"//接口返回的用于展示的字段名称
		  }
	});
});
