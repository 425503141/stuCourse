/**
 * ------------------------------------------------------------------
 * 用户管理 
 * ------------------------------------------------------------------
 */
$(function(){
	userManage.loadUserGrid();	//加载用户列表
	/**
	 * 初始化用户权限类型
	 */
	$('#searchRightType').multiselect({
		nonSelectedText:"权限类型",
		buttonWidth:134,
		nSelectedText:"个选择",
		includeSelectAllOption:true,
		selectAllText: ' 全部权限类型',
		selectAllValue:'0'
	});
	/**
	 * 初始化所属用户组(初始页模糊查询)
	 */
	$("#searchUserTeam").comboTree({
	  	treeUrl:$.ctx+"/api/sys/group/nodes",
		noneSelectedText:"全部用户组",
		id:"treeList",
		ajaxType:"get",
		maxHeight:283,
		expandRoot:true,//是否展开根节点
		expandRootId:'0'//根节点的id
	}); 
	/**
	 * 新建按钮
	 */
	$("#createAppBtn").click(function(){
		$("#createAppDlg").aiDialog({
		  	width:710,
		  	height:"auto",
		  	callback:function(){
			  	if($('#addOnce').hasClass("active")){
			  		userManage.addOnceUser();
			  	}else{
			  		if($("#treeList_directory_value").val() == ""){
					 	$("#AppAlertDlg").alert({
					 		title:"提示",
					 		content:"请选择所属用户组",
					 		dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
					 	});
						return;
			  		}
			  		if($("#fileExcel").attr('data-file') == "0"){
			  			$("#FiletelDlg").alert({
			  				title:"提示",
			  				content:"请正确上传文件！",
			  				dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
			  			});
			  			return;
			  		}
			  		userManage.addMoreUser();
			  	}
			    //用来服务器记录log
				$.AILog({
					  "action": "新增",//动作
					  "detail": "",//详情,默认为空
					  "module": "sys_manage_user"//二级菜单名称，如无二级菜单 使用一级菜单名称
				});
		  	},
		  	open:function(){
		  		$("#createAppDlg").attr("userId","");
		  		$("#fileExcel").attr('data-file','0');
		  		//单个添加时只能添加当前级别以下的用户
		  		var ssg = window.sessionStorage;
				if(ssg){
					var curAuthType = ssg.getItem("authType");//当前用户权限类型
					if(curAuthType!='SUPER_ADMINISTRATOR'){
						$('input[name="optionsRadiosinline"][value="2"]').parent('label').addClass('hidden');
					}
				}
		  		$("#userName").removeAttr('disabled');
		  		$(".J_falseDlg").hide();
		  		if($("#J_tabs").hasClass("none")){
		  			$("#J_tabs").removeClass("none").addClass("clearfix");
		  		}
		  		$(".J_addMore,#addMore").removeClass("active");
		  		$(".J_addOnce,#addOnce").addClass("active");
	  			//初始化所属用户组
	  			$("#userTeamZtree").comboTree({
	  			  	treeUrl:$.ctx+"/api/sys/group/nodes",
	  				noneSelectedText:"请选择",
	  				id:"treeList_addOnce",
	  				ajaxType:"get",
	  				maxHeight:283,
	  				expandRoot:true,//是否展开根节点
	  				expandRootId:'0'//根节点的id
	  		    });
	  			$("#directory").comboTree({
	  				treeUrl:$.ctx+"/api/sys/group/nodes",
	  				noneSelectedText:"请选择所属目录",
	  				id:"treeList_directory",
	  				ajaxType:"get",
	  				maxHeight:115,
	  				expandRoot:true,//是否展开根节点
	  				expandRootId:'0'//根节点的id
	  			});
	  			// 二期新增 -主机节点
				  $("#hostNodeZtree").comboTree({
					  noneSelectedText:'请选择主机节点',
					  id:"treeList_directory2",
					  ajaxData:{"userId":""},
					  treeUrl:$.ctx+"/api/sys/platformNode/list",
					  ajaxType:"get",
					  maxHeight:283,
					  expandRoot:true,//是否展开根节点
					  expandRootId:'000'//根节点的id
				  }); 
	  			$("#popoverTip").popoverTip({
	  				content:"用户名需体系内唯一。用户名最短5位，最长12位，请使用英文字母、数字和'_'（下划线），用户名首字符必须为字母或数字。",
	  			});  
		  	},
		  	close:function(){
		  		// 清除文件
	  			$(".file-tip").removeClass('red').text("");
				var file = $("#fileExcel");  
				file.after(file.clone().val(""));     
				file.remove(); 
				$("#fileExcel").attr('data-file','0');
		  	}
		});
	});	
	/**
	 * 批量添加上传
	 */
	$("#addMore").on("change","#fileExcel",function(){
	  	$.fileUpload({
	  		url:$.ctx + "/api/sys/user/userListUpload",
	  		fileElementId:"fileExcel",
	  		dataType:'json',
	  		type:"POST",
	  		success:function(data){
	  			$("#importUserList").empty();
	  			$(".J_falseDlg").hide();
  				if(data.status == 200){
  					userManage.userList = data.data;
  					$("#fileExcel").attr('data-file','1');
  					$(".file-tip").removeClass('red').text("上传成功");
  					$(".J_falseDlg").hide();
  				}else{
  					$(".file-tip").addClass('red').text(data.message);
  					if(data.data){//有错误列表信息时再展示下面错误表格
  						$(".J_falseDlg").show();
  						userManage.loadDlgList(data.data);
  					}
  					$("#fileExcel").attr('data-file','0');
  					var file = $("#fileExcel");  
  					file.after(file.clone().val(""));     
  					file.remove();   
  				}
	  		},
	  	});
	 });	
	/**
	 * 查询按钮
	 */
	$("#searchBtn").click(function(){
		var authId = $("#searchRightType").val();
		var treeObj=$.fn.zTree.getZTreeObj("treeList_tree");
		var nodes;
		var searchGroup = "";
		if(treeObj != null){
			nodes = treeObj.getSelectedNodes();
			if(nodes.length > 0){
				searchGroup = nodes[0].id;
			}
		}
		var searchText = $("#searchText").val();
		$("#userGrid").jqGrid('setGridParam',{ 
	        postData:{"authId" : authId, "groupId" : searchGroup, "searchText" : searchText},page:1 
	    }).trigger("reloadGrid");
		//用来服务器记录log
		$.AILog({
			  "action": "查询",//动作
			  "detail": "",//详情,默认为空
			  "module": "sys_manage_user"//二级菜单名称，如无二级菜单 使用一级菜单名称
		});
		
	});
});