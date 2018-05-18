/**
 * ------------------------------------------------------------------
 * 主机管理
 * ------------------------------------------------------------------
 */
var hostManage = (function (model){ 
	    model.serverList = [];//批量添加时的应用信息
		model.ztreeObj = new Ztree();
		model.gridObj = "#gridHostManage";
		model.userId = '';
	    var ssg = window.sessionStorage;
	    if(ssg){
    			model.userId = ssg.getItem("userId");
    	}
	    /**
		    * @description 操作系统类型下拉列表
		  */
	   model.loadSysOsTypesList = function(obj,buttonWidth){
		   $.AIGet({
		   	   url:$.ctx + "/api/sys/selectSysOsType",
			   data:{},
			   success:function(result) {
				   		var data = result.data;
				   	    var menuStr = '<option value="">请选择</option>';
				   		for(var i in data){
				   		    menuStr+='<option value="'+data[i].osId+'">'+data[i].osName+'</option>'	
				   		}
				   		$(obj).html(menuStr);
				   		$(obj).multiselect({
				   			nonSelectedText:"请选择",
				   			buttonWidth:buttonWidth,
				   			nSelectedText:"个选择",
				   			includeSelectAllOption:true,
				   			selectAllText: '全部',
				   		}).multiselect('refresh');
			   	}
			  });
	    };
	    /**
		    * @description 登录协议类型下拉列表
		  */
	   model.loadLoginProtocolList = function(obj,buttonWidth){
		   $.AIGet({
		   	   url:$.ctx + "/api/sys/selectSysLoginProtocol",
			   data:{},
			   async:false,
			   success:function(result) {
				   		var data = result.data;
				   	    var menuStr = '<option value="">请选择</option>';
				   		for(var i in data){
				   		    menuStr+='<option value="'+data[i].protId+'">'+data[i].protName+'</option>'	
				   		}
				   		$(obj).html(menuStr);
				   		$(obj).multiselect({
				   			nonSelectedText:"请选择",
				   			buttonWidth:buttonWidth,
				   			nSelectedText:"个选择",
				   			includeSelectAllOption:true,
				   			selectAllText: '全部',
				   		}).multiselect('refresh');
			   	}
			  });
	    };
	    /**
	      * @description 获取列表
	     */
        model.loadHostManageGrid = function(option) {
			$("#gridHostManage").AIGrid({        
				url:$.ctx + '/api/sys/serverManagement/list',
				datatype: "json",
				colNames:["id",'分类', '系统', '用途','主机名称','主机IP','系统类型','系统版本','连通状态','内存大小(G)','CPU数','更新时间','操作'],
			   	colModel:[
			   	    {name:'serverId',index:"",hidden:true},
			   		{name:'classify',index:'classify', width:60},
			   		{name:'system',index:'system', width:50,align:"center"},
			   		{name:'purpose',index:'purpose', width:50,align:"center"},
			   		{name:'serverName',index:'server_name', width:50, align:"center"},
			   		{name:'ipAddr',index:'ip_addr', width:70, align:"center",},		
			   		{name:'osName',index:'os_name', width:50,align:"center"},
			   		{name:'osVersion',index:'os_version', width:50,align:"center",formatter:$.setNull},
			   		{name:'serverStatus',index:'server_status', width:50, align:"center",formatter:$.setIsOn},
			   		{name:'memorySize',index:'memory_size', width:50, align:"center",formatter:$.setNull},		
			   		{name:'cpuNum',index:'cpu_num', width:50,align:"center",formatter:$.setNull},
			   		{name:'updateTime',index:'update_time', width:70,align:"center",formatter:DateFmt.dataDateFormateMinute},	
			   		{name:'op',index:'op', width:90, sortable:false,title:false,formatter:del,align:"center"}		
			   	],
			   	rowNum:10,
			   	rowList:[10,20,30],
			   	pager: '#pagerHostManage',
			   	sortname: '',
			   	rownumbers: false,
			    viewrecords: true,
			    multiselect:true,
			    sortorder: "",
				jsonReader: {
					repeatitems : false,
					id: "0"
				},
				height: '100%',
				//showNoResult:true
			}); 
			//操作
			function del(cellvalue, options, rowObject){
				var html='<button type="button" class="btn btn-default  ui-table-btn ui-table-btn" data-id="'+rowObject.serverId+'" data-name="'+rowObject.planName+'" onclick="hostManage.deleteHostManageSingle(this);" title="删除">删除</button><button type="button" class="btn btn-default ui-table-btn" data-id="'+rowObject.serverId+'" data-planName="'+rowObject.planName+'" onclick="hostManage.insertOrUpdateApp(this,\'1\')" title="修改">修改</button>';
				return html;
			}
        };
        /**
	     * @description 刷新列表
	    */
        model.refreshGridHostManage = function(){
        	var treeObj=$.fn.zTree.getZTreeObj("appType");
          	var nodeId = treeObj&&treeObj.getSelectedNodes()[0] ? treeObj.getSelectedNodes()[0].id : "";
        	var ajaxData = {
    				"searchText":$('#searchTxt').val(),
    				"nodeId":nodeId
    		};
    		$("#gridHostManage").jqGrid('setGridParam',{ 
                postData:ajaxData,page:1
            },true).trigger("reloadGrid");
    	};
	    /**
	     * @description 删除应用
	    */
        model.deleteHostManageSingle = function(obj){
        	var dataId = $(obj).attr('data-id');
        	var msg = '删除该主机会同时删除该主机的数据库，确认是否删除该主机?';
        	var url = $.ctx + "/api/sys/serverManagement/delete";
			var ajaxData = {"serverId":dataId};
			hostManage.deleteHostManage(url,ajaxData,msg);
			//用来服务器记录log
//			var detail = '应用ID:'+appId+'&nbsp;&nbsp;&nbsp;&nbsp;应用名称:'+$(obj).attr('data-name');
//			$.AILog({
//    			  "action": "删除",//动作
//    			  "detail": detail,//详情,默认为空
//    			  "module": "sys_manage_app"//二级菜单名称，如无二级菜单 使用一级菜单名称
//			});
        };
        /**
	     * @description 删除应用
	     * url-接口地址,ajaxData-传参,msg-提示信息
	    */
        model.deleteHostManage = function(url,ajaxData,msg,ids){
        	$("#hostManageDeleteDlg").confirm({
   			 	height:"auto",
	   			title:"提示",
	   			content:msg,
	   			gridObj:model.gridObj,
				callback:function(){
					  $.AIDel({
		   				   url: url,
						   data: ajaxData,
						   async:true,
						   dataType:"json",
						   type:"DELETE",
						   success: function(data){
							   if(data.status == 200){
								   $("#hostManageDeleteDlg" ).dialog( "close" );
								   $("#hostManageDeleteDlg").confirm({
									   title:"提示",
									   content:"删除成功",
									   dialogType:"success",//状态类型：success 成功，failed 失败，或者错误，info提示
								   });
								   //刷新列表
								   model.refreshGridHostManage();
							   }
						   },
						   error:function(){
							   $("#hostManageDeleteDlg").alert({
								   title:"提示",
								   content:"删除失败",
								   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
							   });
						   }
		   			  });
					  //用来服务器记录log
//					  var detail = "应用ID集合："+ids;
//					  $.AILog({
//			    			  "action": "批量删除",//动作
//			    			  "detail": "",//详情,默认为空
//			    			  "module": "sys_manage_app"//二级菜单名称，如无二级菜单 使用一级菜单名称
//					  });
				},
   		   	})
        };
        /**
	     * @description 根据appId查询回显数据 修改时使用
	    */
        model.getHostManageById = function(id) {
	    	$.AIGet({
    			url:$.ctx + "/api/sys/serverManagement/selectById",
    			datatype:"json",
    			data:{"serverId":id},
    			success:function(result){
    				if(result.status=='201'){
    					$("#SMStelDlg").alert({
	    					   title:"提示",
	    					   content:result.message,
	    					   dialogType:"failed"
	    				});
    					return;
    				}
    				var data = result.data;
    				$('#treeList_add_value').attr('node-id',data.nodeId).val(data.platformNodeName);
    				$('input[name=serverName]').val(data.serverName);
    				$('input[name=ipAddr]').val(data.ipAddr);
    				$('input[name=port]').val(data.port);
    				$('input[name=userName]').val(data.userName);
    				$('input[name=passWord]').val(data.passWord);
    				//系统类型
    				$('#osType').val(data.osId).multiselect('refresh');
    				//登录协议类型
    				$('#protocolType').val(data.protId).multiselect('refresh');
   			  }
	    	});
        };
	    /**
	     * 新建或修改用户组 保存前的验证
	     * @param isUpdate=1时修改 0时新建
	     */
	    model.beforeSaveCheck = function(data){
	    	var checkObj = [];
			checkObj[1]=true;
		    switch (true){
	            case !data.purpose: 
	            	checkObj[0] ='请选择所属节点';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.osType : 
	            	checkObj[0] ='请选择系统类型';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.serverName : 
	            	checkObj[0] ='请填写主机名称';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.ipAddr : 
	            	checkObj[0] ='请填写主机IP';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.protocolType: 
	            	checkObj[0] ='请选择登录协议类型';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.port: 
	            	checkObj[0] ='请填写端口号';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.userName:
	            	checkObj[0] ='请填写用户名';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.passWord: 
	            	checkObj[0] ='请填写密码';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            default:
	            	return checkObj;
		      }
	    }
	    /**
	     * 返回新建或修改应用所需的option
	     * @param url-接口地址  ajaxData-传的参数
	     */
	    model.returnAjaxOption = function(url,ajaxData){
	    	return {
	    		url: url,
	    		data: ajaxData,
	    		success: function(data){
	    			   if(data.status == 200){
	    				   $( "#hostManageAddDlg" ).dialog( "close" );
	    				   $("#SMStelDlg").alert({
	    					   title:"提示",
	    					   content:"保存成功",
	    					   dialogType:"success"
	    				   });
	    				   //刷新左侧树和右侧用列表
	    				   hostManage.refreshGridHostManage();
	    			   }
	    			   if(data.status == 201){
	    				   $("#SMStelDlg").alert({
	    					   title:"提示",
	    					   content:data.message,
	    					   dialogType:"failed"
	    				   });
	    			   }
	    		   },
	    		   error: function(){
	    			   //$( "#hostManageAddDlg" ).dialog( "close" );
	    			   $("#SMStelDlg").alert({
	    				   title:"提示",
	    				   content:"保存失败",
	    				   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
	    			   });
	    		   }
	    	}
	    };
	    /**
		   * @description 连通状态测试
		 */
		model.dataBaseLinkTest = function() {
			  var serverId  = $('#hostManageAddDlg').attr('serverId');
			  	  serverId = serverId ? serverId : "";
			  var purpose = $('#treeList_add_value').attr('node-id');//所属节点id
			  var saveObj = formFmt.formToObj($("#formSaveHostManage"));
			  saveObj.serverId = serverId;
			  saveObj.purpose = purpose;
			  var checkObj = hostManage.beforeSaveCheck(saveObj);
			   if(!checkObj[1]){
				    $("#SMStelDlg").alert({
						   title:"提示",
						   content:checkObj[0],
						   dialogType:"failed"
				    });
				}
			    if(checkObj[1]){
					  $.AIPost( {
					   	   url:$.ctx + "/api/sys/serverManagement/testServer",
					   	   data:saveObj,
					   	   success:function(result) {
					   		   		var dialogType = result.status == '200' ? "success" : "failed";
				   		   			$("#SMStelDlg").alert({
									   title:"提示",
									   content:result.message,
									   dialogType:dialogType
				   		   			});
					   	  		  }
					     });
				  }
		};
	    /**
	     * 新建或修改
	     * @param isUpdate=1时修改 0时新建
	     */
	    model.insertOrUpdateApp = function(obj,isUpdate){
	    	$("#hostManageAddDlg").aiDialog({
	    		  width:640,
	    		  height:"auto",
	    		  title:"新增/修改主机",
	    		  gridObj:model.gridObj,
	    		  callback:function(){
	    			  var serverId  = isUpdate =='1' ? $(obj).attr('data-id') : "";
	    			  var purpose = $('#treeList_add_value').attr('node-id');//所属节点id
	    			  var saveObj = formFmt.formToObj($("#formSaveHostManage"));
	    			  saveObj.serverId = serverId;
	    			  saveObj.purpose = purpose;
	    			  var checkObj = hostManage.beforeSaveCheck(saveObj);
	    			  if($('#addMore').hasClass("active")){//批量添加
	    				  if($("#fileExcel").attr('data-file')== "0"){
	  			  			$("#FiletelDlg").alert({
	  			  				title:"提示",
	  			  				content:"请正确上传文件！",
	  			  				dialogType:"failed",
	  			  			});
	  			  			return;
	  			  		}
	  			  		model.addAppManageBatch();
		  			  }else{//单个添加或修改
		  				if(!checkObj[1]){//非空验证
		    				  $("#SMStelDlg").alert({
		    					   title:"提示",
		    					   content:checkObj[0],
		    					   dialogType:"failed"
		    				   });
		    			  }
		    			  if(checkObj[1]){
		    				  if(isUpdate=="0"){
		    				  	$.AIPost(hostManage.returnAjaxOption($.ctx + "/api/sys/serverManagement/insert",saveObj));
		    				  	//用来服务器记录log
//		    		    		$.AILog({
//		    		    			  "action": "新增",//动作
//		    		    			  "detail": "",//详情,默认为空
//		    		    			  "module": "sys_daq_plan"//二级菜单名称，如无二级菜单 使用一级菜单名称
//		    		    	    });
		    				  }
		    				  if(isUpdate=='1'){
		    					  $.AIPut(hostManage.returnAjaxOption($.ctx + "/api/sys/serverManagement/update",saveObj));
		    					  //用来服务器记录log
//		    					  var detail = "周期方案Id:"+planId+"&nbsp;&nbsp;&nbsp;&nbsp;周期方案名称:"+$(obj).attr('data-planName');
//			    		    	  $.AILog({
//			    		    			  "action": "修改",//动作
//			    		    			  "detail": detail,//详情,默认为空
//			    		    			  "module": "sys_daq_plan"//二级菜单名称，如无二级菜单 使用一级菜单名称
//			    		    	  });
		    				  }
		    			  }
		  			  }
	    		  },
	    		  open:function(){
	    			  var serverId  = isUpdate =='1' ? $(obj).attr('data-id') : "";
	    			  $('#hostManageAddDlg').attr('serverId',serverId);
	    			  $("#J_tabs").removeClass("hidden");
					  $("#addMore,.J_addMore").removeClass("active");
					  $("#addOnce,.J_addOnce").addClass("active");
					  $('input[name=ipAddr]').removeAttr('disabled');
					  // 清除文件
				  	  $("#fileExcel").attr('data-file','0');
					  $(".J_falseDlg").hide();
					  $(".file-tip").removeClass('red').text("");
					  var file = $("#fileExcel");  
					  file.after(file.clone().val(""));     
					  file.remove();   
	    			  //所属节点下拉选择树
	    			  $("#nodeZtreeBox").comboTree({
	    				  	treeUrl:$.ctx+"/api/sys/platformNode/list",
	    					noneSelectedText:"请选择",
	    					id:"treeList_add",
	    					ajaxData:{"userId":model.userId},
	    					ajaxType:"get",
	    					maxHeight:283,
	    					expandRoot:true,//是否展开根节点
	    					expandRootId:'000'//根节点的id
	    			  }); 
	    			  //操作系统类型下拉
	    			  model.loadSysOsTypesList('#osType','291');
	    			  //登录协议类型下拉
	    			  model.loadLoginProtocolList('#protocolType','291');
	    			 if(isUpdate&&isUpdate=='1'){
	    				  $("#J_tabs").addClass("hidden");
						  $("#addMore").removeClass("active");
						  $("#addOnce").addClass("active");
						  $('input[name=ipAddr]').attr('disabled','disabled');
	    				  var dataId = $(obj).attr('data-id');
	    				  hostManage.getHostManageById(dataId);//修改信息回显
	    			 }
	    		  }
	    	});
	    };
	    /**
	     * 批量添加保存
	     */
	    model.addAppManageBatch = function(){
	      	var ajaxData ={"serverList" : model.serverList};
	      	$.AIPost({
	      		url: $.ctx + "/api/sys/serverManagement/insertList",
	      		data: ajaxData,
	      		async:true,
	      		dataType:"json",
	      		type:"POST",
	      		success: function(data){
	      			if(data.status == 200){
	      				$( "#hostManageAddDlg" ).dialog( "close" );
	      				$("#AppAlertDlg").alert({
	      					title:"提示",
	      					content:"批量添加成功",
	      					dialogType:"success"
	      				});
	      				 //刷新列表
	      				model.refreshGridHostManage();
	      			}else{
	      				$("#AppAlertDlg").alert({
	      					title:"提示",
	      					content:data.message,
	      					dialogType:"failed"
	      				});
	      			}
	      		} 
	    	});
	    };
	    /**
	     * 加载应用错误列表
	     * @param data
	     */
	    model.loadDlgList = function(data){	
	    	$("#importAppList").empty();
	    	$("#importAppList").AIGrid({			
	    		datatype: "local",
	    	   	colNames:['错误所在行', '错误原因'],
	    	   	colModel:[
	    	   		{name:'errorRow',index:'error_row', width:36, align:"center",sortable:false},
	    	   		{name:'errorCause',index:'error_cause', width:100, align:"center",cellattr:addCellAttr,sortable:false},
	    	   	],
	    	    multiselect:false,
	    		rownumbers:false,
	    		height: 255 
	    	});	
	    	function addCellAttr(rowId, val, rowObject, cm, rdata) {
	            return "style='color:#e75062'";
	        }
	    	for(var i=0;i<=data.length;i++){		
	    		jQuery("#importAppList").jqGrid('addRowData',i+1,data[i]);		
	    	}	
	    }
	    /***
	     * 获取左侧树全部分类
	    */
	    model.loadAppManageTree = function(platformNodeName) {
	    	   var platformNodeName = platformNodeName ? platformNodeName : "";
		    	$.AIGet({
	    			url:$.ctx + "/api/sys/platformNode/list",
	    			datatype:"json",
	    			data:{"platformNodeName":platformNodeName,"userId":model.userId},
	    			success:function(result){
	    			 	hostManage.ztreeObj.init({
	    		    		id:"appType",
	    		    		expandRoot:true,//是否展开根节点
	    					expandRootId:'000',//根节点的id
	    		    		setting:{
	    		    			view: {
	    		    				selectedMulti: false,
	    		    				addHoverDom:model.addHoverDom,
	    		    				removeHoverDom:model.removeHoverDom
	    		    			},
	    		    			edit: {
    		    					enable: true,
    		    					showRenameBtn:true,
    		    					setRemoveBtn:true,
    		    					editNameSelectAll: true,  
    		    					renameTitle: "编辑",
    		    					removeTitle: "删除",
    		    				},
	    		    			callback: {
	    		    				beforeDrag:function(treeId, treeNodes){return false;},//禁止拖拽
	    		    				beforeRename: model.zTreeBeforeRename,
    		    					beforeRemove:model.beforeRemove,
	    		    				onClick: function(event, treeId, treeNode){
	    		    					$("#gridHostManage").jqGrid('setGridParam',{ 
	    		    				        postData:{nodeId:treeNode.id}
	    		    				    }).trigger("reloadGrid");
	    		    				}
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
	     * @description 重命名树节点
	    */
	    model.zTreeBeforeRename = function(treeId, treeNode, newName, isCancel) {
	    	//如果 beforeRename 返回 false，则继续保持编辑名称状态，直到名称符合规则位置 （按下 ESC 键可取消编辑名称状态，恢复原名称）如果未设置 beforeRename 或 beforeRename 返回 true，则结束节点编辑名称状态，更新节点名称，并触发 setting.callback.onRename 回调函数。
	    	var zTree = model.ztreeObj.instance;
	    	if (newName.length == 0) {
	    		 $("#appManageDeleteDlg").alert({
	    			   title:"提示",
	    			   content:'节点名称不能为空',
	    			   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
	    		   });
	    		//setTimeout(function(){zTree.editName(treeNode)}, 10);
	    		return false;
	    	}
	        var nodes = zTree.getNodes();
	    	var nodesSave = zTree.transformToArray(zTree.getNodes());//获取已存在的所有节点信息
	    	var allNames = [];
	    	for(var i in nodesSave){
	    		allNames.push(nodesSave[i].name);//获取已存在的所有节点的name属性
	    	}
	    	//console.log(treeNode.name!=newName)
	    	if(treeNode.name!=newName && jQuery.inArray(newName, allNames) > -1){//该应用分类名称已存在
	    		 $("#appManageDeleteDlg").alert({
	    			   title:"提示",
	    			   content:'该节点名称已存在',
	    			   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
	    		   });
	    		return false;
	    	}
	    	if(treeNode.name!=newName && jQuery.inArray(newName, allNames) <= -1){
	    		$.AIPut({
	    			url: $.ctx+'/api/sys/platformNode/updateNode',
	    			data: {"nodeId":treeNode.id,"platformNodeName":newName},
	    			success: function(data){
	    				   if(data.status == 200){
	    					   //alert('修改节点成功成功');
	    				   }
	    			},
	    		});
	    	}
	    	zTree.updateNode(treeNode);
	    	return true;
	    }
	    /**
	     * @description 删除树节点
	    */
	    //如果未设置 beforeRemove 或 beforeRemove 返回 true，则删除节点并触发 setting.callback.onRemove 回调函数。
	     model.beforeRemove = function(treeId, treeNode) {
	    	var zTree = model.ztreeObj.instance;
	    	zTree.selectNode(treeNode);
	    	if(treeNode.isCanDel==true && treeNode.id!=0){//可删除
	    		$.AIDel({
	    			   url: $.ctx+'/api/sys/platformNode/deleteNode',
	    			   data: {"nodeId":treeNode.id},
	    			   async:true,
	    			   dataType:"json",
	    			   type:"DELETE",
	    			   success: function(data){
	    				   if(data.status == 201){
	    					   $("#appManageDeleteDlg").alert({
	    						   title:"提示",
	    						   content:data.message,
	    						   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
	    					   });
	    				   }
	    			   }
	    		});
	    	}
	    	if(treeNode.id==0){//全部分类不可删除
	    		 $("#appManageDeleteDlg").alert({
	    			   title:"提示",
	    			   content:'全部分类不可删除',
	    			   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
	    		  });
	    		 return false;
	    	}else{
	    		if(treeNode.isCanDel==false){//不可删除
		    		 $("#appManageDeleteDlg").alert({
		    			   title:"提示",
		    			   content:'有属于当前节点的主机，不允许删除当前节点',
		    			   dialogType:"failed"
		    		  });
		    		 return false;
		    	}
	    	}
	    }
	    /**
	     * @description 添加名树节点
	    */
	    model.newCount = 1;
	    model.addHoverDom = function(treeId, treeNode) {
	    	var sObj = $("#" + treeNode.tId + "_span");
	    	if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
	    	if(treeNode.level=='3'){//如果是三级节点隐藏加号
	    		var addStr = '';
	    	}else{
	    		var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
	    		+ "' title='add node' onfocus='this.blur();'></span>";
	    	}
	    	sObj.after(addStr);
	    	var btn = $("#addBtn_"+treeNode.tId);
	    	if (btn) btn.bind("click", function(){
	    		var zTree = model.ztreeObj.instance;
	    		zTree.addNodes(treeNode, {id:(100 + model.newCount), pId:treeNode.id, name:"new node" + (model.newCount++)});
	    		
	    		zTree.updateNode(treeNode);
	    		return false;
	    	});
	    };
	    model.removeHoverDom = function(treeId, treeNode) {
	    	$("#addBtn_"+treeNode.tId).unbind().remove();
	    };
        return model;
})(window.hostManage || {});
