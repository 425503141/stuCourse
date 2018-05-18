/**
 * ------------------------------------------------------------------
 * 接口监控管理
 * ------------------------------------------------------------------
 */
$(function(){
	//左侧导航选中
	$('#menuList li').removeClass('active');
	$('#menuList li.J_nav_interface').addClass('active');
	hostManage.loadRunSelectList('#importantType',$.priLevelObj,'134');//重要程度list
	hostManage.loadInterfaceSourceList('#interfaceSource','134');//接口来源
	hostManage.loadHostManageGrid();//初始化加载列表
	//批量删除
	$('#hostManageDeleteBatch').click(function(){
		var ids = $("#gridHostManage").jqGrid('getSelectedIdsArray',{key:"interfaceCode"});
			ids = ids.join(',');
    	var msg = '确认是否删除选中接口?';
    	var url = $.ctx + "/api/sys/interfaceManagement/deleteList";
		var ajaxData = {"interfaceCodes":ids};
		if(!ids){
			$("#appManageDeleteDlg").alert({
				   title:"提示",
				   content:"请选择要删除的接口",
				   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
			   });
		}else{
			hostManage.deleteHostManage(url,ajaxData,msg,ids);
		}
	});
	//查询按钮
	$("#searchHostManage").click(function(){
		hostManage.refreshGridHostManage();
		//用来服务器记录log
//		$.AILog({
//			  "action": "查询",//动作
//			  "detail": "",//详情,默认为空
//			  "module": "sys_daq_plan"//二级菜单名称，如无二级菜单 使用一级菜单名称
//	    });
	});
	//输入框模糊下拉自动补全
	$( "#searchTxt" ).AIAutoComplete({
		url:$.ctx + "/api/sys/interfaceManagement/listByCodeOrName",
	  	 data:{
		  		 "searchTxt": "searchText",   // "输入框的id":"后台需要的入参名称"
		   },
		  jsonReader:{
			  item:"searchText"//接口返回的用于展示的字段名称
		  }
	});
	//新建
	$("#hostManageAddBtn").click(function(){
		hostManage.insertOrUpdateApp(this,'0');
	});
	/**
	 * 批量添加上传
	 */
	$(".J_upBox").on("change","#fileExcel",function(){
	  	$.fileUpload({
	  		url:$.ctx + "/api/sys/interfaceManagement/interfaceManagementListUpload",
	  		fileElementId:"fileExcel",
	  		dataType:'json',
	  		type:"POST",
	  		success:function(data){
	  			$("#importAppList").empty();
	  			$(".J_falseDlg").hide();
				if(data.status == 200){
					hostManage.interfaceList = data.data;
					$(".file-tip").removeClass('red').text("上传成功");
					$(".J_falseDlg").hide();
					$("#fileExcel").attr('data-file','1');
				}else{
					$(".file-tip").addClass('red').text(data.message);
					$("#fileExcel").attr('data-file','0');
					if(data.data){//有错误列表信息时再展示下面错误表格
						$(".J_falseDlg").show();
						hostManage.loadDlgList(data.data);
					}
					var file = $("#fileExcel");  
					file.after(file.clone().val(""));     
					file.remove();   
				}
	  		}
	  	});
	 });
	// 关闭第二屏主机详情页面按钮
	$(".ui-moudle-title i.ui-close-panel").click(function(){
		$(this).parent().parent().addClass("hidden");
	});
});