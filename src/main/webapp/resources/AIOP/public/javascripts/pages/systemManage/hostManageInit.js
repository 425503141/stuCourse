/**
 * ------------------------------------------------------------------
 * 系统管理-监控项目管理-主机管理
 * ------------------------------------------------------------------
 */
$(function(){
	//左侧导航选中
	$('#menuList li').removeClass('active');
	$('#menuList li.J_nav_host').addClass('active');
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
	//批量删除
	$('#hostManageDeleteBatch').click(function(){
		var ids = $("#gridHostManage").jqGrid('getSelectedIdsArray',{key:"serverId"});
			ids = ids.join(',');
    	var msg = '删除主机会同时删除该主机的数据库，确认是否删除选中主机?';
    	var url = $.ctx + "/api/sys/serverManagement/deleteList";
		var ajaxData = {"serverIds":ids};
		if(!ids){
			$("#appManageDeleteDlg").alert({
				   title:"提示",
				   content:"请选择要删除的主机",
				   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
			   });
		}else{
			hostManage.deleteHostManage(url,ajaxData,msg,ids);
		}
	});
	//查询按钮
	$("#searchHostManage").off('click').on('click',function(){
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
		url:$.ctx + "/api/sys/serverManagement/listByServerNameOrIpAddr",
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
	  		url:$.ctx + "/api/sys/serverManagement/serverManagementListUpload",
	  		fileElementId:"fileExcel",
	  		dataType:'json',
	  		type:"POST",
	  		success:function(data){
	  			$("#importAppList").empty();
	  			$(".J_falseDlg").hide();
				if(data.status == 200){
					hostManage.serverList = data.data;
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
	 //测试按钮
	 $('.J_test').off('click').on('click',function(){
		hostManage.dataBaseLinkTest();
	 });
});