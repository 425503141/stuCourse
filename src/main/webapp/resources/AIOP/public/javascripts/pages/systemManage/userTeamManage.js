/**
 * ------------------------------------------------------------------
 * 用户组管理 
 * ------------------------------------------------------------------
 */
var userGroupManage = (function (model){ 
	    /**
	     * @description 获取用户组列表
	    */
        model.loadUserGroupGrid = function(option) {
			$("#gridUserTeamManage").AIGrid({        
			   	url:$.ctx+'/api/sys/group/List',
				datatype: "json",
				postData :{},
			   	colNames:['用户组名','描述', '创建日期','操作'],
			   	colModel:[
			   		{name:'groupName',index:'group_name', width:120,frozen : true , align:"center"},//frozen : true固定列
			   		{name:'groupRemark',index:'group_remark', width:150, align:"center"},
			   		{name:'createTime',index:'create_time', width:50, align:"center",formatter:DateFmt.dateFormatter},
			   		{name:'op',index:'op', width:70, sortable:false, align:"center",formatter:del,title:false}		
			   	],
			   	rowNum:10,
			   	rowList:[10,20,30],
			   	pager: '#pagerUserTeamManage',
			   	sortname: '',
			    viewrecords: true,
			    multiselect:false,
				rownumbers:false,
			    sortorder: "desc",
				jsonReader: {
					repeatitems : false,
					id: "0"
				},
				height: '100%' 
			});	
			function del(cellvalue, options, rowObject){
				var delObj = JSON.stringify(rowObject);
					delObj = delObj.replace(/"/g,"'");
				var html='<button type="button" class="btn btn-default  ui-table-btn ui-table-btn J_deleteUserGroup" data-groupName="'+rowObject.groupName+'" data-name="'+rowObject.groupName+'" data-groupId="'+rowObject.groupId+'" onclick="userGroupManage.deleteUserGroup(this);" title="删除">删除</button><button type="button" class="btn btn-default ui-table-btn J_modifyUserGroup" onclick="userGroupManage.insertOrUpdateUserGroup(this,\'1\')" data-name="'+rowObject.groupName+'" data-groupId="'+rowObject.groupId+'" title="修改">修改</button>';
				return html;
			}
        }
        /**
	     * @description 刷新用户组列表
	    */
        model.refreshGridUserTeamManage = function(){
    		var ajaxData = {
    				"groupName":$('#userGroupInput').val(),
    				"groupRemark":"",//待与包婷婷确认
    		};
    		$("#gridUserTeamManage").jqGrid('setGridParam',{ 
                postData:ajaxData,page:1 
            }).trigger("reloadGrid");
    	}
        /**
	     * @description 删除用户组
	    */
        model.deleteUserGroup=function(obj){
        	var groupId = $(obj).attr('data-groupId');
        	var groupName = $(obj).attr('data-groupName');
        	var msg = '确定删除用户组'+groupName+'?';
        	$("#userGroupDeleteDlg").confirm({
   			 	height:"auto",
	   			title:"提示",
	   			content:msg,
				callback:function(){
					  //TODO
					  $.AIDel({
		   				   url: $.ctx + "/api/sys/group/delete",
						   data: {"groupId":groupId},
						   async:true,
						   dataType:"json",
						   type:"DELETE",
						   success: function(data){
							   if(data.status == 200){
								   $( "#userGroupDeleteDlg" ).dialog( "close" );
								   $("#userGroupDeleteDlg").deleteSuc({
									   title:"提示",
									   content:"删除成功",
									   dialogType:"success",//状态类型：success 成功，failed 失败，或者错误，info提示
								   });
								 //刷新左侧树和右侧用户组列表
								 userGroupManage.loadUserGroupTree();
								 userGroupManage.refreshGridUserTeamManage();
							   }
							   //用户组被使用 不能删除
							   if(data.status == 201 && data.data.isCanDel==false){
								   $("#userGroupDeleteDlg").alert({
									   title:"提示",
									   content:data.message,
									   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
								   });
							   }
						   },
						   error:function(){
							   $("#userGroupDeleteDlg").alert({
								   title:"提示",
								   content:"删除失败",
								   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
							   });
						   }
		   			  });
					 //用来服务器记录log
					 var detail = '用户组ID:'+groupId+'&nbsp;&nbsp;&nbsp;&nbsp;用户组名:'+$(obj).attr('data-name');
		    		 $.AILog({
		    			  "action": "删除",//动作
		    			  "detail": detail,//详情,默认为空
		    			  "module": "sys_manage_group"//二级菜单名称，如无二级菜单 使用一级菜单名称
		    		});
				},
   		   	})
        };
        /**
	     * @description 根据ID查询用户组信息
	    */
        model.getUserGroupById = function(id) {
	    	$.AIGet({
    			url:$.ctx + "/api/sys/group/sysGroup",
    			datatype:"json",
    			data:{
    				"groupId":id
    			},
    			success:function(result){
    				var data = result.data;
    				$('#groupName').val(data.groupName);
    				$('#groupRemark').val(data.groupRemark);
    				var parentGroupId = data.parentGroupId;
    			    $('#treeList_add_value').val(data.parentGroupName).attr('node-id',parentGroupId);
   			  }
	    	});
        };
        /**
	     * @description 查询所属用户组用户组
	    */
        model.loadUserGroupTree = function() {
	    	var ztreeObj = new Ztree();
	    	$.AIGet({
    			url:$.ctx + "/api/sys/group/nodes",
    			datatype:"json",
    			success:function(result){
    			 	ztreeObj.init({
    		    		id:"userGroupTree",
    		    		expandRoot:true,//是否展开根节点
    		    		expandRootId:'0',//根节点的id
    		    		setting:{
    		    			view: {
    		    				selectedMulti: false,
    		    			},
    		    			callback: {
    		    				onClick: function(event, treeId, treeNode){
    		    					$("#gridUserTeamManage").jqGrid('setGridParam',{ 
    		    				        postData:{groupId:treeNode.id}
    		    				    }).trigger("reloadGrid");
    		    				},
    		    			},
    		    			data: {
    		    				simpleData: {
    		    					enable: true,
    		    					idKey: "id",
    		    					pIdKey: "pid",
    		    					rootPId: 0
    		    				}
    		    			}
    		    		},
    		    		treeData:result.nodes,
    		    		expandAll:false
    		    	});
    			}
	    	});
    };
    /**
     * 新建或修改用户组
     * @param isUpdate=1时修改 0时新建
     */
    model.insertOrUpdateUserGroup = function(obj,isUpdate){
    	$("#userGroupAddDlg").aiDialog({
    		  width:570,
    		  height:"auto",
    		  title:"新建或修改用户组",
    		  callback:function(){
    			  var groupName = $.trim($("#groupName").val());
    			  var groupRemark = $.trim($("#groupRemark").val());
    			  var parentGroupId = $('#treeList_add_value').attr('node-id');
    			  var groupId = isUpdate =='1' ? $(obj).attr('data-groupId') : "";
    			  var ajaxData = {
    					      "groupId":groupId,
    						  "parentGroupId": parentGroupId,
    						  "groupName":groupName,
    						  "groupRemark": groupRemark,
    			  }
    	   		  if(groupName.length == 0){
    		   			 $("#SMStelDlg").alert({
    						   title:"提示",
    						   content:"用户名不能为空",
    						   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
    					 });
    	   				return;
    	   		  }
    			  if($('#popoverTipGroupName .J_message').hasClass('has-error')){
    		   			 $("#SMStelDlg").alert({
    						   title:"提示",
    						   content:"请正确填写用户组名称",
    						   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
    					 });
    	   				return;
    	   		  }
    			  if(!parentGroupId){
    				  $("#SMStelDlg").alert({
    					   title:"提示",
    					   content:"请选择所属用户组",
    					   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
    				 });
       				return;
    			  }
    			  if(groupRemark.length == 0){
    		   			 $("#SMStelDlg").alert({
    						   title:"提示",
    						   content:"描述不能为空",
    						   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
    					 });
    	   				return;
    	   		  }
    			  if(isUpdate=="0"){
    				  $.AIPost(model.returnAjaxOption($.ctx + "/api/sys/group/insert",ajaxData));
    				//用来服务器记录log
 		    		 $.AILog({
 		    			  "action": "新增",//动作
 		    			  "detail": "",//详情,默认为空
 		    			  "module": "sys_manage_group"//二级菜单名称，如无二级菜单 使用一级菜单名称
 		    		});
    			  }
    			  if(isUpdate=='1'){
    				  $.AIPut(model.returnAjaxOption($.ctx + "/api/sys/group/update",ajaxData));
    				//用来服务器记录log
    				 var detail = '用户组ID:'+groupId+'&nbsp;&nbsp;&nbsp;&nbsp;用户组名:'+$(obj).attr('data-name');
 		    		 $.AILog({
 		    			  "action": "修改",//动作
 		    			  "detail": detail,//详情,默认为空
 		    			  "module": "sys_manage_group"//二级菜单名称，如无二级菜单 使用一级菜单名称
 		    		});
    			  }
    		  } ,
    		  open:function(){
    			  var groupId = isUpdate =='1' ? $(obj).attr('data-groupId') : "";
    			  $('#userGroupAddDlg').attr("groupId",groupId);
    			  $("#popoverTipGroupName .J_popverTip").popoverTip({
    				  content:"文字、字母或数字开头，长度不超过10个中文字符。",
    			  });
    			  $('#popoverTipGroupName .J_message span').text('');
    			  $('#popoverTipGroupName .J_message').removeClass('has-error')
    			  //打开前加载所属用户组下拉树
    			  $("#userGroupTeamZtreeBox").comboTree({
    				  	treeUrl:$.ctx+"/api/sys/group/nodes",
    					noneSelectedText:"请选择",
    					id:"treeList_add",
    					ajaxType:"get",
    					maxHeight:283,
    					expandRoot:true,//是否展开根节点
    					expandRootId:'0'//根节点的id
    			  }); 
    			  if(isUpdate&&isUpdate=='1'){
    				  $('#treeList_add_value').trigger('click');
    		          $('#treeList_add_tree').addClass('hidden');
    				  var groupId = $(obj).attr('data-groupId');
    				  userGroupManage.getUserGroupById(groupId);//修改信息回显
    			  }
    		  }
    	});
    };
    /**
     * 返回新建或修改用户组所需的option
     * @param url-接口地址  ajaxData-传的参数
     */
    model.returnAjaxOption = function(url,ajaxData){
    	return {
    		url: url,
    		data: ajaxData,
    		success: function(data){
    			   if(data.status == 200){
    				   $( "#userGroupAddDlg" ).dialog( "close" );
    				   $("#SMStelDlg").alert({
    					   title:"提示",
    					   content:"保存成功",
    					   dialogType:"success"//状态类型：success 成功，failed 失败，或者错误，info提示
    				   });
    				   //刷新左侧树和右侧用户组列表
    				   userGroupManage.loadUserGroupTree();
    				   userGroupManage.refreshGridUserTeamManage();
    			   }
    		   },
    		   error: function(){
    			   $("#SMStelDlg").alert({
    				   title:"提示",
    				   content:"保存失败",
    				   dialogType:"failed"
    			   });
    		   }
    	}
    };
    /**
     * 校验用户组名称
     * @param divId 所属标签id属性用于直接获取
     */
    model.validateUserName = function(divId){
    	var groupName = $("#"+divId).val();
    	var groupId = $('#userGroupAddDlg').attr("groupId");
    	var jsonParams = {"groupName" : groupName,"groupId":groupId};
    	$.AIGet({
    		url : $.ctx + "/api/sys/group/checkGroupName",
    		data : jsonParams,
    		type : "get",
    		datatype:"json",
    		success:function(result){
    			if(result.data.checkResult == true){
    				$("#popoverTipGroupName .has-error span").text(result.message);
    				$("#popoverTipGroupName .J_message").removeClass('has-error').addClass('has-success').find('span').text('可用');
    			}else{
    				$("#popoverTipGroupName .J_message").removeClass('has-success').addClass('has-error').find('span').text(result.message);
    			}
    		}
    	});
    };
    return model;
})(window.userGroupManage || {});