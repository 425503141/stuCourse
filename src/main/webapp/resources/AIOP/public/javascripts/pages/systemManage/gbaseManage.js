/**
 * ------------------------------------------------------------------
 * Gbase集群监控管理
 * ------------------------------------------------------------------
 */
var hostManage = (function (model){ 
		model.ztreeObj = new Ztree();
		model.gridObj = "#gridHostManage";
		model.userId = '';
	    var ssg = window.sessionStorage;
	    if(ssg){
    			model.userId = ssg.getItem("userId");
    	}
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
				url:$.ctx + '/api/sys/gbaseManagement/list',
				datatype: "json",
				colNames:['分类', '系统', '用途','集群名称','集群采集点','节点名称','节点IP','gcware','gcluster','DataState','更新时间','操作'],
			   	colModel:[
			   		{name:'classify',index:'classify', width:60,formatter:$.setNull},
			   		{name:'system',index:'system', width:50,align:"center",formatter:$.setNull},
			   		{name:'purpose',index:'purpose', width:50,align:"center",formatter:$.setNull},
			   		{name:'gbaseGroupName',index:'gbase_group_name', width:50, align:"center",formatter:$.setNull},
			   		{name:'mainNodeIp',index:'main_node_ip', width:70, align:"center",formatter:$.setNull},		
			   		{name:'nodeName',index:'node_name', width:50,align:"center",formatter:$.setNull},
			   		{name:'nodeIp',index:'node_ip', width:50,align:"center",formatter:$.setNull},
			   		{name:'coorGcware',index:'coor_gcware', width:45, align:"center"},
			   		{name:'coorGcluster',index:'coor_gcluster', width:45, align:"center",formatter:$.setNull},		
			   		{name:'coorDatastate',index:'coor_datastate', width:45,align:"center",formatter:$.setNull},
			   		{name:'updateTime',index:'update_time', width:70,align:"center",formatter:DateFmt.dataDateFormateMinute},	
			   		{name:'op',index:'op', width:140, sortable:false,title:false,formatter:del,align:"center"}		
			   	],
			   	rowNum:10,
			   	rowList:[10,20,30],
			   	pager: '#pagerHostManage',
			   	sortname: '',
			   	rownumbers: false,
			    viewrecords: true,
			    multiselect:false,
			    sortorder: "",
				jsonReader: {
					repeatitems : false,
					id: "0"
				},
				height: '100%',
				setGroupHeaders:{
					  useColSpanStyle: true, 
					  groupHeaders:[
						{startColumnName: 'classify', numberOfColumns: 7, titleText: '集群信息'},
						{startColumnName: 'coorGcware', numberOfColumns: 5, titleText: 'GBASE COORDINATOR CLUSTER INFORMATION'},
					  ]	
			   },
			   afterGridLoad:function(){
      	    	$("#tableCellInfo,#appTableInfoPanel").addClass("hidden");
			   },
				//showNoResult:true
			}); 
			//操作
			function del(cellvalue, options, rowObject){
				var html='<button type="button" class="btn btn-default  ui-table-btn ui-table-btn" data-id="'+rowObject.gbaseGroupId +'" data-name="'+rowObject.planName+'" onclick="hostManage.showTableCellInfo(this);" title="查看">查看</button><button type="button" class="btn btn-default  ui-table-btn ui-table-btn" data-id="'+rowObject.gbaseGroupId +'" data-name="'+rowObject.planName+'" onclick="hostManage.deleteHostManageSingle(this);" title="删除">删除</button><button type="button" class="btn btn-default ui-table-btn" data-id="'+rowObject.gbaseGroupId +'" data-planName="'+rowObject.planName+'" onclick="hostManage.insertOrUpdateApp(this,\'1\')" title="修改">修改</button>';
				return html;
			}
        };
        /**
	      * @description 获取详情列表
	     */
	      model.showTableCellInfo = function(obj) {
	    	  debugger
	    	  var gbaseGroupId = $(obj).attr('data-id');
	    	  var scrollTop = $("#tableCellInfo").removeClass("hidden").offset().top;
			  $('html,body').animate({"scrollTop": scrollTop }, 500 );
			  $('#gbox_gridHostManageDetail .jqg-second-row-header').remove();
			  model.loadHostManageGridDetail(gbaseGroupId);//查询当前行主机详情    
			  $("#gridHostManageDetail").jqGrid("setGridParam", {postData:{"gbaseGroupId":gbaseGroupId}}).trigger("reloadGrid");
	      };
        /**
	      * @description 获取详情列表
	     */
       model.loadHostManageGridDetail = function(gbaseGroupId) {
			$("#gridHostManageDetail").AIGrid({        
				url:$.ctx + '/api/sys/gbaseManagement/datailList',
				datatype: "json",
				postData:{"gbaseGroupId":gbaseGroupId},
				colNames:[/*'分类', '系统', '用途',*/'集群名称','集群采集点','节点名称','节点IP','gcware','gcluster','DataState','gnode','syncserver','DataState','采集时间'],
			   	colModel:[
			   		/*{name:'classify',index:'classify', width:60,formatter:$.setNull},
			   		{name:'system',index:'system', width:50,align:"center",formatter:$.setNull},
			   		{name:'purpose',index:'purpose', width:50,align:"center",formatter:$.setNull},*/
			   		{name:'gbaseGroupName',index:'gbase_group_name', width:50, align:"center",formatter:$.setNull},
			   		{name:'mainNodeIp',index:'main_node_ip', width:70, align:"center",formatter:$.setNull},		
			   		{name:'nodeName',index:'node_name', width:50,align:"center",formatter:$.setNull},
			   		{name:'nodeIp',index:'node_ip', width:50,align:"center",formatter:$.setNull},
			   		{name:'coorGcware',index:'coor_gcware', width:50, align:"center",formatter:$.setNull},
			   		{name:'coorGcluster',index:'coor_gcluster', width:50, align:"center",formatter:$.setNull},		
			   		{name:'coorDatastate',index:'coor_datastate', width:50,align:"center",formatter:$.setNull},
			   		{name:'dataGnode',index:'data_gnode', width:50, align:"center",formatter:$.setNull},
			   		{name:'dataSyncserver',index:'data_syncserver', width:50, align:"center",formatter:$.setNull},		
			   		{name:'dataDatastate',index:'data_datastate', width:50,align:"center",formatter:$.setNull},
			   		{name:'dataTime',index:'data_time', width:70,align:"center",formatter:DateFmt.dataDateFormateMinute},	
			   	],
			   	rowNum:10,
			   	rowList:[10,20,30],
			   	pager: '#pagerHostManageDetail',
			   	sortname: '',
			   	rownumbers: false,
			    viewrecords: true,
			    multiselect:false,
			    sortorder: "",
				jsonReader: {
					repeatitems : false,
					id: "0"
				},
				height: '100%',
				setGroupHeaders:{
					  useColSpanStyle: true, 
					  groupHeaders:[
						{startColumnName: 'gbaseGroupName', numberOfColumns:4, titleText: '集群信息'},
						{startColumnName: 'coorGcware', numberOfColumns:3, titleText: 'GBASE COORDINATOR CLUSTER INFORMATION'},
						{startColumnName: 'dataGnode', numberOfColumns: 4, titleText: 'DATA CLUSTER INFORMATION'},
					  ]
			   }
			});
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
        	var msg = '确认是否删除该Gbase集群?';
        	var url = $.ctx + "/api/sys/gbaseManagement/delete";
			var ajaxData = {"gbaseGroupId":dataId};
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
    			url:$.ctx + "/api/sys/gbaseManagement/selectById",
    			datatype:"json",
    			data:{"gbaseGroupId":id},
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
    				$('#treeList_add_value').attr('node-id',data.nodeId).val(data.nodeName);
    				$('input[name=gbaseGroupName]').val(data.gbaseGroupName);
    				$('input[name=mainNodeIp]').val(data.mainNodeIp);
    				$('input[name=port]').val(data.port);
    				$('input[name=userName]').val(data.userName);
    				$('input[name=passWord]').val(data.passWord);
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
	            case !data.gbaseGroupName : 
	            	checkObj[0] ='请填写集群名称';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.mainNodeIp : 
	            	checkObj[0] ='请填写集群采集点';
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
	     * 新建或修改
	     * @param isUpdate=1时修改 0时新建
	     */
	    model.insertOrUpdateApp = function(obj,isUpdate){
	    	$("#hostManageAddDlg").aiDialog({
	    		  width:640,
	    		  height:"auto",
	    		  title:"新增/修改",
	    		  gridObj:model.gridObj,
	    		  callback:function(){
	    			  var gbaseGroupId   = isUpdate =='1' ? $(obj).attr('data-id') : "";
	    			  var purpose = $('#treeList_add_value').attr('node-id');//所属节点id
	    			  var saveObj = formFmt.formToObj($("#formSaveHostManage"));
	    			  saveObj.gbaseGroupId  = gbaseGroupId ;
	    			  saveObj.purpose = purpose;
	    			  var checkObj = hostManage.beforeSaveCheck(saveObj);
		  				if(!checkObj[1]){//非空验证
		    				  $("#SMStelDlg").alert({
		    					   title:"提示",
		    					   content:checkObj[0],
		    					   dialogType:"failed"
		    				   });
		    			  }
		    			  if(checkObj[1]){
		    				  if(isUpdate=="0"){
		    				  	$.AIPost(hostManage.returnAjaxOption($.ctx + "/api/sys/gbaseManagement/insert",saveObj));
		    				  	//用来服务器记录log
//		    		    		$.AILog({
//		    		    			  "action": "新增",//动作
//		    		    			  "detail": "",//详情,默认为空
//		    		    			  "module": "sys_daq_plan"//二级菜单名称，如无二级菜单 使用一级菜单名称
//		    		    	    });
		    				  }
		    				  if(isUpdate=='1'){
		    					  $.AIPut(hostManage.returnAjaxOption($.ctx + "/api/sys/gbaseManagement/update",saveObj));
		    					  //用来服务器记录log
//		    					  var detail = "周期方案Id:"+planId+"&nbsp;&nbsp;&nbsp;&nbsp;周期方案名称:"+$(obj).attr('data-planName');
//			    		    	  $.AILog({
//			    		    			  "action": "修改",//动作
//			    		    			  "detail": detail,//详情,默认为空
//			    		    			  "module": "sys_daq_plan"//二级菜单名称，如无二级菜单 使用一级菜单名称
//			    		    	  });
		    				  }
		    			  }
	    		  },
	    		  open:function(){
	    			  var gbaseGroupId   = isUpdate =='1' ? $(obj).attr('data-id') : "";
	    			  $('#hostManageAddDlg').attr('gbaseGroupId',gbaseGroupId );
					  $('input[name=mainNodeIp]').removeAttr('disabled');
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
	    			  //登录协议类型下拉
	    			  model.loadLoginProtocolList('#protocolType','291');
	    			 if(isUpdate&&isUpdate=='1'){
						  $('input[name=mainNodeIp]').attr('disabled','disabled');
	    				  var dataId = $(obj).attr('data-id');
	    				  hostManage.getHostManageById(dataId);//修改信息回显
	    			 }
	    		  }
	    	});
	    };
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
