/**
 * ------------------------------------------------------------------
 * 应用管理 
 * ------------------------------------------------------------------
 */
$(function(){
	//$.runFreqObj-周期,$.priLevelObj-重要成都 来自profile.js中
	appManage.loadAppManageGrid();//初始化加载列表
	appManage.loadAppManageTree();//初始化加载左侧树
	appManage.loadRunSelectList('#cycleType',$.runFreqObj);//周期list
	appManage.loadRunSelectList('#importantType',$.priLevelObj);//重要程度list
	//查询按钮-查询应用列表
	$("#searchAppManage").click(function(){
		appManage.refreshGridAppManage();
		//用来服务器记录log
		$.AILog({
			  "action": "查询",//动作
			  "detail": "",//详情,默认为空
			  "module": "sys_manage_app"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    });
	});
	//点选默认时 清空指定时间框
	$('.radio-inline input[name=isDefault][value=0]').click(function(){
		$('#planCompleteTime').val('');
	})
	//全部周期和全部重要程度
	$('#cycleType').multiselect({
		nonSelectedText:"全部周期",
		buttonWidth:134,
		nSelectedText:"个选择",
		includeSelectAllOption:true,
		selectAllText: '全部',
	});
	$('#importantType').multiselect({
		nonSelectedText:"全部重要程度",
		buttonWidth:134,
		nSelectedText:"个选择",
		includeSelectAllOption:true,
		selectAllText: '全部'
	});
	//新建应用
	$("#appManageAddBtn").click(function(){
		appManage.insertOrUpdateApp(this,'0');
	});
    //批量添加应用
	$("#appManageAddBatchBtn").click(function(){
		$("#appManageAddBatchDlg").aiDialog({
		  	width:560,
		  	height:"auto",
		  	title:"批量添加",
		  	callback:function(){
			  		if($("#fileExcel").attr('data-file')== "0"){
			  			$("#FiletelDlg").alert({
			  				title:"提示",
			  				content:"请正确上传文件！",
			  				dialogType:"failed",
			  			});
			  			return;
			  		}
			  		appManage.addAppManageBatch();
		  	},
		  	open:function(){
				// 清除文件
		  		$("#fileExcel").attr('data-file','0');
				$(".J_falseDlg").hide();
				$(".file-tip").removeClass('red').text("");
				var file = $("#fileExcel");  
				file.after(file.clone().val(""));     
				file.remove();   
		  	}
		});
	});
	/**
	 * 批量添加上传
	 */
	$(".J_upBox").on("change","#fileExcel",function(){
	  	$.fileUpload({
	  		url:$.ctx + "/api/sys/appManagement/appManagementListUpload",
	  		fileElementId:"fileExcel",
	  		dataType:'json',
	  		type:"POST",
	  		success:function(data){
	  			$("#importAppList").empty();
	  			$(".J_falseDlg").hide();
				if(data.status == 200){
					appManage.appList = data.data;
					$(".file-tip").removeClass('red').text("上传成功");
					$(".J_falseDlg").hide();
					$("#fileExcel").attr('data-file','1');
				}else{
					$(".file-tip").addClass('red').text(data.message);
					$("#fileExcel").attr('data-file','0');
					if(data.data){//有错误列表信息时再展示下面错误表格
						$(".J_falseDlg").show();
						appManage.loadDlgList(data.data);
					}
					var file = $("#fileExcel");  
					file.after(file.clone().val(""));     
					file.remove();   
				}
	  		}
	  	});
	 });
	//批量删除
	$('#appManageDeleteBatch').click(function(){
		var ids = $("#gridAppManage").jqGrid('getSelectedIdsArray',{key:"appId"});
			ids = ids.join(',');
    	var msg = '确认是否删除选中应用?';
    	var url = $.ctx + "/api/sys/appManagement/deleteList";
		var ajaxData = {"ids":ids};
		if(!ids){
			$("#appManageDeleteDlg").alert({
				   title:"提示",
				   content:"请选择要删除的应用",
				   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
			   });
		}else{
			appManage.deleteAppManage(url,ajaxData,msg,ids);
		}
	});
	//左侧树确定按钮
	$('#appManageTreeSave').click(function(){
		var treeObj = $.fn.zTree.getZTreeObj("appManageTree");
		var changNodes = appManage.ztreeObj.getChangeNodes();//返回新加treeNode数组
		$.AIPost({
			url: $.ctx+'/api/sys/appManagement/addNode',
			data: {"newNodes":changNodes},
			success: function(data){
				   if(data.status == 200){
					   $("#appManageDeleteDlg").alert({
						   title:"提示",
						   content:'保存成功',
						   dialogType:"success"
					   });
					   appManage.loadAppManageTree();//重新加载左侧树
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
	//左侧树的取消按钮
	$('#appManageTreeCancel').click(function(){
		appManage.loadAppManageTree();//重新加载左侧树
	});
	//左侧树的查询按钮
	$('.J_treeSearch').click(function(){
		var appClassifyName = $('#treeKeyWords').val();
		appManage.loadAppManageTree(appClassifyName);
	});
});
