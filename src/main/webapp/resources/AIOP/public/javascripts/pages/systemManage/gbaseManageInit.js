/**
 * ------------------------------------------------------------------
 * 系统管理-监控项目管理-Gbase集群监控管理
 * ------------------------------------------------------------------
 */
$(function(){
	//左侧导航选中
	$('#menuList li').removeClass('active');
	$('#menuList li.J_nav_gbase').addClass('active');
	hostManage.loadHostManageGrid();//初始化加载列表
	//左侧树的查询按钮
	$('.J_treeSearch').click(function(){
		var platformNodeName = $('#searchAllType').val();
		hostManage.loadAppManageTree(platformNodeName);
	});
	//左侧树的取消按钮
	$('.J_treeCancel').click(function(){
		hostManage.loadAppManageTree();//重新加载左侧树
	});
	//左侧树的确定即增加节点按钮
	$('.J_treeAdd').click(function(){
		var treeObj = $.fn.zTree.getZTreeObj("appType");
		var changNodes = hostManage.ztreeObj.getChangeNodes();//返回新加treeNode数组
		if(changNodes.length<=0){return;}
		$.AIPost({
			url: $.ctx+'/api/sys/platformNode/addNode',
			data: {"newNodes":changNodes},
			success: function(data){
				   if(data.status == 200){
					   $("#appManageDeleteDlg").alert({
						   title:"提示",
						   content:'保存成功',
						   dialogType:"success"
					   });
					   hostManage.loadAppManageTree();//重新加载左侧树
				   }else{
					   $("#appManageDeleteDlg").alert({
						   title:"提示",
						   content:'添加节点保存失败',
						   dialogType:"failed"
					   });
				   }
			},
		});
	});
	//全部分类
	$("#allTypeBtn").click(function(){
		if($(this).hasClass("active")){
			$(this).removeClass("active");
			$("#allTypeZtreeDlg").addClass("hidden");
		}else{
			$(this).addClass("active");
			$("#allTypeZtreeDlg").removeClass("hidden");
			hostManage.loadAppManageTree();
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
		url:$.ctx + "/api/sys/gbaseManagement/listByNameOrIp",
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
	// 关闭第二屏主机详情页面按钮
	$(".ui-moudle-title i.ui-close-panel").click(function(){
		$(this).parent().parent().addClass("hidden");
	});
});