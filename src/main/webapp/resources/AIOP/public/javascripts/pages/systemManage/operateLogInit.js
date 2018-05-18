/**
 * ------------------------------------------------------------------
 * 操作日志 
 * ------------------------------------------------------------------
 */
$(function(){
   //日期控件
   operateLog.loaddatepicker({
		from:"#operateLogMinTime",
		to:"#operateLogMaxTime"
   });
   $('#operateLogMinTime,#operateLogMaxTime').datepicker( 'setDate' , new Date());
	operateLog.loadOperateLogGrid();//初始化加载列表
	//操作模块下拉树形
	$("#operateLogZtreeBox").comboTree({
	  	treeUrl:$.ctx+"/api/sys/log/nodes",
		noneSelectedText:"全部操作模块",
		id:"operateLog_tree",
		ajaxType:"get",
		maxHeight:283,
		showCheckBox:true,//是否显示复选框
		allChecekdValue:'全部操作模块',//全选时输入框的值,showCheckBox:true时才需要
    });
   //点击查询按钮
   $('#searchOperateLog').click(function(){
	   operateLog.searchOrExportOperateLog('1');
	   //用来服务器记录log
	   $.AILog({
			  "action": "查询",//动作
			  "detail": "",//详情,默认为空
			  "module": "sys_manage_log"//二级菜单名称，如无二级菜单 使用一级菜单名称
	  });
   });
   //导出
   $("#exportOperateLog").click(function(){
	   operateLog.searchOrExportOperateLog('0');
	   operateLog.searchOrExportOperateLog('1');
	});
})