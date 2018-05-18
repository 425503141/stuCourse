/**
 * ------------------------------------------------------------------
 * 用户管理 
 * ------------------------------------------------------------------
 */
var userManage = (function (model){ 
		model.userList = [];
		/**
	     * @description 获取用户列表
	    */
        model.loadUserGrid = function(option) {
			$("#userGrid").AIGrid({        
			   	url:$.ctx+'/api/sys/user/list',
				datatype: "json",
				postData :{},
			   	colNames:['用户名','权限类型', '姓名', '邮箱','手机号码','所属用户组','创建时间','操作'],
			   	colModel:[
			   		{name:'userName',index:'user_name', width:100,frozen : true , align:"center"},//frozen : true固定列
			   		{name:'authName',index:'auth_name', width:50, /* userGrid:"invdate", */ align:"center"},
			   		{name:'realName',index:'real_name', width:70, align:"center"},
			   		{name:'userMail',index:'user_mail', width:80, align:"center"},
			   		{name:'userTel',index:'user_tel', width:50, align:"center"},		
			   		{name:'groupName',index:'group_name', width:100, align:"center"},		
			   		{name:'createTime',index:'create_time', width:50, align:"center",formatter:statDateFormatter},		
			   		{name:'op',index:'op', width:70, sortable:false, align:"center",formatter:del,title:false}		
			   	],
			   	rowNum:10,
			   	rowList:[10,20,30],
			   	pager: '#userPjmap',
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
				var ssg = window.sessionStorage;
				if(ssg){
					var curUserId = ssg.getItem("userId");//当前用户
				}
				var userId = rowObject.userId;
				var userName = rowObject.userName;
				var hiddenClass = curUserId==userId ? "hidden" :"";//当前用户不能删除当前用户
				var html='<button type="button" class="btn btn-default  ui-table-btn ui-table-btn '+hiddenClass+'" data-name="'+rowObject.userName+'"  title="删除" onclick="userManage.deleteUser(this,'+userId+');">删除</button><button type="button" class="btn btn-default ui-table-btn" data-name="'+rowObject.userName+'"  onclick="userManage.updateUser(this,'+userId+')" title="修改" >修改</button>';
				return html;
			}
			function statDateFormatter(cellvalue, options, rowObject){
        		return DateFmt.Formate(rowObject.createTime,"yyyy-MM-dd HH:mm:ss");
        	}
        }
        /**
         * 增加用户(单个)
         */
        model.addOnceUser = function(){
        	var userName = $("#userName").val();
        	var realName = $("#realName").val();
        	var userPsd = $("#userPsd").val();
        	var accessRight = $('input[name="optionsRadiosinline"]:checked').val();
          	var treeObj=$.fn.zTree.getZTreeObj("treeList_addOnce_tree");
          	var leafName = treeObj ? treeObj.getSelectedNodes()[0].id : "";
          	//二期 主机节点
          	var treeObj2=$.fn.zTree.getZTreeObj("treeList_directory2_tree");
          	var nodeId = treeObj2 ? treeObj2.getSelectedNodes()[0].id : "";
          	var userMail = $("#userMail").val();
          	var userTel = $("#userTel").val();
          	if(userName.length == 0){
          		$("#AppAlertDlg").alert({
          			title:"提示",
          			content:"用户名不能为空",
          			dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
          		});
          		return;
          	}
          	if($('.userNameTip .J_message span').hasClass('has-error')){
          		$("#AppAlertDlg").alert({
          			title:"提示",
          			content:"请正确填写用户名",
          			dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
          		});
          		return;
          	}
          	if(realName.length == 0){
          		$("#AppAlertDlg").alert({
          			title:"提示",
          			content:"姓名不能为空",
          			dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
          		});
          		return;
          	}
          	if($("#treeList_addOnce_value").val() == ""){
          		$("#AppAlertDlg").alert({
          			title:"提示",
          			content:"请选择所属用户组",
          			dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
          		});
          		return;
          	} 
          	if(userMail.length == 0){
          		$("#AppAlertDlg").alert({
          			title:"提示",
          			content:"请输入邮箱",
          			dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
          		});
          		return;
          	} 
          	if($('.userMailTip .J_message span').hasClass('has-error')){
          		$("#AppAlertDlg").alert({
          			title:"提示",
          			content:"请正确填写邮箱",
          			dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
          		});
        		return;
          	}
          	if($('.userTelTip .J_message span').hasClass('has-error')){
          		$("#AppAlertDlg").alert({
          			title:"提示",
          			content:"请正确填写手机号",
          			dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
          		});
        		return;
          	}
          	var sysUserRequest = {};
          	sysUserRequest.userName = userName;
          	sysUserRequest.realName = realName;
          	sysUserRequest.userPsd = userPsd;
          	sysUserRequest.userAuth = accessRight;
          	sysUserRequest.userGroup =leafName ;
          	//二期主机节点
          	sysUserRequest.nodeId =nodeId ;
          	sysUserRequest.userMail = userMail;
          	sysUserRequest.userTel = userTel;
          	$.AIPost({	
          		url: $.ctx + "/api/sys/user/insert",
          		data: sysUserRequest,
          		async:true,
          		dataType:"json",
          		type:"POST",
          		success: function(data){
          			if(data.status == 200){
          				$( "#createAppDlg" ).dialog( "close" );
          				$("#AppAlertDlg").alert({
          					title:"",
          					content:"添加用户成功",
          					dialogType:"success",//状态类型：success 成功，failed 失败，或者错误，info提示
          				});
          				$("#userGrid").trigger("reloadGrid");  
          			}else{
          				$("#AppAlertDlg").alert({
          					title:"",
          					content:data.message,
          					dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
          				});
          			}
          		} 
          	});
        }
        /**
         * 增加用户(批量)
         */
        model.addMoreUser = function(){
        	var userAuth = $('input[name="optionsRadiosinline"]:checked').val();
          	var treeObj=$.fn.zTree.getZTreeObj("treeList_directory_tree");
          	var userGroup = treeObj ?  treeObj.getSelectedNodes()[0].id : "";
          	var ajaxData ={
          			"userAuth" : userAuth,
          			"userGroup" : userGroup,
          		    "userList" : userManage.userList
          			
          	};
          	$.AIPost({
          		url: $.ctx + "/api/sys/user/insertList",
          		data: ajaxData,
          		async:true,
          		dataType:"json",
          		type:"POST",
          		success: function(data){
          			if(data.status == 200){
          				$( "#createAppDlg" ).dialog( "close" );
          				$("#AppAlertDlg").alert({
          					title:"提示",
          					content:"批量添加成功",
          					dialogType:"success",//状态类型：success 成功，failed 失败，或者错误，info提示
          				});  
          				$("#userGrid").trigger("reloadGrid");  
          			}else{
          				$("#AppAlertDlg").alert({
          					title:"提示",
          					content:data.message,
          					dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
          				});
          			}
          		} 
        	});
        }
        /**
         * 根据用户id删除用户
         * @param userId
         */
        model.deleteUser = function(obj,userId){
        	var jsonParams = {"userId":userId};
        	$("#userDelConfirm").confirm({
        		height:"auto",
        		title:"删除用户",
        		content:"确定删除此用户吗?",
        		callback:function(){
        			$.AIDel({
        			   url: $.ctx + "/api/sys/user/delete",
        			   data: jsonParams,
        			   async:true,
        			   dataType:"json",
        			   type:"DELETE",
        			   success: function(data){
        				   if(data.status == 200){
        					   $( "#userDelConfirm" ).dialog( "close" );
        					   $("#userDelAlertDlg").deleteSuc({
        						   title:"删除操作提示",
        						   content:"删除成功",
        						   dialogType:"success",//状态类型：success 成功，failed 失败，或者错误，info提示
        					   });
        					   jQuery("#userGrid").trigger("reloadGrid");
        				   }else{
        					   $("#userDelAlertDlg").deleteSuc({
        						   title:"删除操作提示",
        						   content:data,
        						   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
        					   });
        				   }
        			   } 
           			});
        			//用来服务器记录log
        			var detail = '用户ID:'+userId+'&nbsp;&nbsp;&nbsp;&nbsp;用户名:'+$(obj).attr('data-name');
    				$.AILog({
    					  "action": "删除",//动作
    					  "detail": detail,//详情,默认为空
    					  "module": "sys_manage_user"//二级菜单名称，如无二级菜单 使用一级菜单名称
    				});
        		}
        	});	
        }
        /**
         * 修改用户信息(根据用户id查询)
         * @param userId
         */
        model.updateUser = function(obj,userId){
        	var jsonParams = {"userId":userId};
        	$.AIGet({
        		url : $.ctx + "/api/sys/user/sysUserById",
        		data : jsonParams,
        		type : "get",
        		datatype:"json",
        		success:function(result){
        			if(result.status == 200){
        				$("#createAppDlg").aiDialog({
        					  width:710,
        					  height:"auto",
        					  callback:function(){	
        						  var userName = $("#userName").val();
        						  var realName = $("#realName").val();
        						  var userPsd = $("#userPsd").val();
        						  var accessRight = $('input[name="optionsRadiosinline"]:checked').val();
        						  var treeObj=$.fn.zTree.getZTreeObj("treeList_addOnce_tree");
        						  var leafName = treeObj ?  treeObj.getSelectedNodes()[0].id : $("#treeList_addOnce_value").attr('userGroup');
        						  
        						  var treeObj2=$.fn.zTree.getZTreeObj("treeList_directory2_tree");
        						  var nodeId = treeObj2 ?  treeObj2.getSelectedNodes()[0].id : $("#treeList_directory2_value").attr('nodeId');
        						  
        						  var userMail = $("#userMail").val();
        						  var userTel = $("#userTel").val();
        						  if(userName.length == 0){
        							  $("#AppAlertDlg").alert({
        								   title:"提示",
        								   content:"用户名不能为空",
        								   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
        							  });
        							  return;
        						  }
        						  if($('.userNameTip .J_message span').hasClass('has-error')){
        							  $("#AppAlertDlg").alert({
        								   title:"提示",
        								   content:"请正确填写用户名",
        								   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
        							 });
        			   				return;
        						  }
        						  if(userMail.length == 0){
        							  $("#AppAlertDlg").alert({
        								   title:"提示",
        								   content:"请输入邮箱",
        								   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
        							  });
        							  return;
        						  } 
        						  if($('.userMailTip .J_message span').hasClass('has-error')){
        							  $("#AppAlertDlg").alert({
        								   title:"提示",
        								   content:"请正确填写邮箱",
        								   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
        							 });
        			   				return;
        						  }
        						  if($('.userTelTip .J_message span').hasClass('has-error')){
        							  $("#AppAlertDlg").alert({
        								   title:"提示",
        								   content:"请正确填写手机号",
        								   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
        							 });
        			   				return;
        						  }
        						  //创建后台传递对象
        						  var sysUserRequest = {};
        						  sysUserRequest.userId = userId;
        						  sysUserRequest.userName = userName;
        						  sysUserRequest.realName = realName;
        						  sysUserRequest.userPsd = userPsd;
        						  sysUserRequest.userAuth = accessRight;
        						  sysUserRequest.userGroup =leafName ;
        						  sysUserRequest.nodeId =nodeId ;
        						  sysUserRequest.userMail = userMail;
        						  sysUserRequest.userTel = userTel;
        						  $.AIPut({
        			   				   url: $.ctx + "/api/sys/user/update",
        							   data: sysUserRequest,
        							   async:true,
        							   dataType:"json",
        							   type:"PUT",
        							   success: function(data){
        								   if(data.status == 200){
        									   $( "#createAppDlg" ).dialog( "close" );
        									   $("#AppAlertDlg").alert({
        										   title:"提示",
        										   content:"修改用户成功",
        										   dialogType:"success",//状态类型：success 成功，failed 失败，或者错误，info提示
        									   });
        									   $("#userGrid").trigger("reloadGrid");  
        								   }else{
        									   $("#AppAlertDlg").alert({
        										   title:"提示",
        										   content:"修改用户失败",
        										   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
        									 });
        								   }
        							   } 
        			   			  });
        						  
        						//用来服务器记录log
        						var detail = '用户ID:'+userId+'&nbsp;&nbsp;&nbsp;&nbsp;用户名:'+$(obj).attr('data-name');
    							$.AILog({
    								  "action": "修改",//动作
    								  "detail": detail,//详情,默认为空
    								  "module": "sys_manage_user"//二级菜单名称，如无二级菜单 使用一级菜单名称
    							});
        						  
        					  },
        					  open:function(){
        						  $("#createAppDlg").attr("userId",userId);
        						  $("#J_tabs").removeClass("clearfix").addClass("none");
        						  $("#addMore").removeClass("active").addClass("none");
        						  $("#addOnce").removeClass("none").addClass("active");
        						  $("#userName").val(result.data.userName).attr('disabled','disabled');;
        						  $("#realName").val(result.data.realName);
        						  $("#userPsd").val(result.data.userPsd);
        						  $(":radio[name='optionsRadiosinline'][value='" + result.data.userAuth + "']").prop("checked", "checked");
        						  $("#userTeamZtree").comboTree({
        							  noneSelectedText:result.data.sysGroup.group_name,
        							  id:"treeList_addOnce",
        							  treeUrl:$.ctx+"/api/sys/group/nodes",
        							  ajaxType:"get",
        							  maxHeight:283,
        							  expandRoot:true,//是否展开根节点
        							  expandRootId:'0'//根节点的id
        						  }); 
        						  $("#treeList_addOnce_value").removeAttr("placeholder");
        						  $("#treeList_addOnce_value").val(result.data.sysGroup.group_name).attr('userGroup',result.data.userGroup);
        						  // 二期新增 -主机节点
        						  var noneSelectedText = result.data.nodeName ? result.data.nodeName : "请选择主机节点";
        						  $("#hostNodeZtree").comboTree({
        							  noneSelectedText:noneSelectedText,
        							  id:"treeList_directory2",
        							  ajaxData:{"userId":""},
        							  treeUrl:$.ctx+"/api/sys/platformNode/list",
        							  ajaxType:"get",
        							  maxHeight:283,
        							  expandRoot:true,//是否展开根节点
        							  expandRootId:'000'//根节点的id
        						  }); 
        						  $("#treeList_directory2_value").val(result.data.nodeName).attr('nodeId',result.data.nodeId);
        						  $("#userMail").val(result.data.userMail);
        						  $("#userTel").val(result.data.userTel);
        						  $("#popoverTip").popoverTip({
        							  content:"用户名需体系内唯一。用户名最短5位，最长12位，请使用英文字母、数字和'_'（下划线），用户名首字符必须为字母或数字。",
        						  });
        					    }
        				  });
        			}else{
        				$("#SMStelDlg").alert({
        				   title:"提示",
        				   content:result.message,
        				   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
        				});
        			}
        		}
        	});
        }
        /**
         * 校验用户名
         * @param divId 所属标签id属性用于直接获取用户名
         */
        model.validateUserName = function(divId){
        	var userName = $("#" + divId ).val();
        	var jsonParams = {"userName" : userName};
        	$.AIGet({
        		url : $.ctx + "/api/sys/user/checkUserName",
        		data : jsonParams,
        		type : "get",
        		datatype:"json",
        		success:function(result){
        			if(result.data.checkResult == true){
        				$(".userNameTip .J_message span").text("可用").removeClass("has-error").addClass("has-success");				
        			}
        			else{
        				$(".userNameTip .J_message span").text(result.message).removeClass("has-success").addClass("has-error");
        			}
        		}
        	});
        }
        /**
         * 校验邮箱
         * @param divId 所属标签id属性用于直接获取用户邮箱
         */
        model.validateEmail = function (divId){
        	var uerEmail = $("#" + divId ).val();
        	var userId = $("#createAppDlg").attr("userId");
        	var jsonParams = {"userMail" : uerEmail,"userId":userId};
        	$.AIGet({
        		url : $.ctx + "/api/sys/user/checkUserMail",
        		data : jsonParams,
        		type : "get",
        		datatype:"json",
        		success:function(result){
        			if(result.data.checkResult == true){
        				$(".userMailTip .J_message span").text("可用").removeClass("has-error").addClass("has-success");
        			}else{
        				$(".userMailTip .J_message span").text(result.message).removeClass("has-success").addClass("has-error");
        			}
        		}
        	});
        }
        /**
         * 校验用户手机号
         * @param divId 所属标签id属性用于直接获取用户手机号
         */
        model.validatePhoneNO = function (divId){
        	var userPhone = $("#" + divId ).val();
        	var phoneNOReg = /^1[3|4|5|7|8][0-9]{9}$/;
        	if(!phoneNOReg.test(userPhone)){
        		$(".userTelTip .J_message span").text("请输入正确的手机号").removeClass("has-success").addClass("has-error");
        		return;
        	}else{
        		$(".userTelTip .J_message span").text("").removeClass("has-error").addClass("has-success");
        	}
        }

        /**
         * 加载用户错误列表
         * @param data
         */
        model.loadDlgList = function (data){
        	$("#importUserList").empty();
        	$("#importUserList").AIGrid({			
        		datatype: "local",
        	   	colNames:['错误所在行', '报错原因'],
        	   	colModel:[
        	   		{name:'errorRow',index:'error_row', width:36, align:"center",sortable:false },
        	   		/*{name:'errorInfo',index:'error_info', width:90 userGrid:"invdate", align:"center"},*/
        	   		{name:'errorCause',index:'error_cause', width:100, align:"center",cellattr:addCellAttr,sortable:false},
        	   	],
        	    multiselect:false,
        		rownumbers:false,
        		height: 180 
        	});	
        	function addCellAttr(rowId, val, rowObject, cm, rdata) {
                if(rowObject.planId == null ){
                    return "style='color:#e75062'";
                }
            }
        	for(var i=0;i<=data.length;i++){		
        		jQuery("#importUserList").jqGrid('addRowData',i+1,data[i]);		
        	}	
        }
        
		return model;
		
})(window.userManage || {});