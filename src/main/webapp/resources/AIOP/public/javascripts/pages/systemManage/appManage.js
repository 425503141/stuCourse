/**
 * ------------------------------------------------------------------
 * 应用管理
 * ------------------------------------------------------------------
 */
var appManage = (function (model){
	    model.appList = [];//批量添加时的应用信息
		model.ztreeObj = new Ztree();
		 model.gridObj = "#gridAppManage";
	     /**
		   * @description 加载周期&重要程度下拉列表-搜索条件
		 */
	     model.loadRunSelectList = function(obj,data) {
	    	 var str = "";
	    	 for(var i in data){
	    		 str+='<option value="'+i+'">'+data[i]+'</option>'
	    	 }
	    	 $(obj).html(str);
	     };
	     /**
		   * @description 加载周期下拉列表-新增或修改的单选
		 */
	     model.loadRunSelectLabel = function(obj,data,radioName) {
	    	 var str = "";
	    	 var disabledAttr = radioName=='impLevel' ?  ' ' : 'disabled="disabled"'
	    	 for(var i in data){
	    		 str+='<label class="radio-inline"><input type="radio" '+disabledAttr+' name="'+radioName+'" value="'+i+'">'+data[i]+'</label>'
	    	 }
	    	 $(obj).html(str);
	     };
	     /**
	      * @description 获取应用管理列表
	     */
        model.loadAppManageGrid = function(option) {
			$("#gridAppManage").AIGrid({
				url:$.ctx + '/api/sys/appManagement/List',
				datatype: "json",
			   	colNames:["id",'应用名称','所属分类', '周期', '重要程度','创建时间','创建人','需求提出人','操作'],
			   	colModel:[
                    {name:'appId',index:"id",hidden:true},
			   		{name:'appName',index:'app_name', width:120},
			   		{name:'appClassifyName',index:'app_classify_name', width:90,align:"center"},
			   		{name:'runFreq',index:'run_freq', width:50,align:"center",formatter:formateRunFreq},
			   		{name:'impLevel',index:'imp_level', width:50, align:"center",formatter:$.setImpLevel},
			   		{name:'createTime',index:'create_time', width:70, align:"center",formatter:DateFmt.dateFormatter},
			   		{name:'userName',index:'user_name', width:70,align:"center"},
			   		{name:'proposer',index:'proposer', width:50,align:"center"},
			   		{name:'op',index:'op', width:90, sortable:false,title:false,formatter:del,align:"center"}
			   	],
			   	rowNum:10,
			   	rowList:[10,20,30],
			   	pager: '#pagerAppManage',
			   	sortname: '',
			   	rownumbers: false,
			    viewrecords: true,
			    sortorder: "desc",
				jsonReader: {
					repeatitems : false,
					id: "0"
				},
				height: '100%'
			});
        	function formateRunFreq(cellvalue, options, rowObject){
        		var runFreq = rowObject.runFreq;
        		var runFreqObj =$.runFreqObj;
        		return runFreqObj[runFreq] || runFreq;
        	}
			//操作
			function del(cellvalue, options, rowObject){
				var html='<button type="button" class="btn btn-default  ui-table-btn ui-table-btn" data-appId="'+rowObject.appId+'" data-name="'+rowObject.appName+'" onclick="appManage.deleteAppManageSingle(this);" title="删除">删除</button><button type="button" class="btn btn-default ui-table-btn" data-appId="'+rowObject.appId+'" data-name="'+rowObject.appName+'" onclick="appManage.insertOrUpdateApp(this,\'1\')" title="修改">修改</button>';
				return html;
			}
        };
        /**
	     * @description 删除应用
	    */
        model.deleteAppManageSingle = function(obj){
        	var appId = $(obj).attr('data-appId');
        	var msg = '确认是否删除该应用?';//确认是否删除选中应用
        	var url = $.ctx + "/api/sys/appManagement/deleteByAppId";
			var ajaxData = {"appId":appId};
			appManage.deleteAppManage(url,ajaxData,msg);
			//用来服务器记录log
			var detail = '应用ID:'+appId+'&nbsp;&nbsp;&nbsp;&nbsp;应用名称:'+$(obj).attr('data-name');
			$.AILog({
    			  "action": "删除",//动作
    			  "detail": detail,//详情,默认为空
    			  "module": "sys_manage_app"//二级菜单名称，如无二级菜单 使用一级菜单名称
			});
        };
        /**
	     * @description 删除应用
	     * url-接口地址,ajaxData-传参,msg-提示信息
	    */
        model.deleteAppManage = function(url,ajaxData,msg,ids){
        	$("#appManageDeleteDlg").confirm({
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
								   $("#appManageDeleteDlg" ).dialog( "close" );
								   $("#appManageDeleteDlg").deleteSuc({
									   title:"提示",
									   content:"删除成功",
									   dialogType:"success",//状态类型：success 成功，failed 失败，或者错误，info提示
								   });
								   //刷新左侧树和右侧用列表
								   appManage.loadAppManageTree();
								   appManage.refreshGridAppManage();
							   }
						   },
						   error:function(){
							   $("#appManageDeleteDlg").alert({
								   title:"提示",
								   content:"删除失败",
								   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
							   });
						   }
		   			  });
					  //用来服务器记录log
						var detail = "应用ID集合："+ids;
						$.AILog({
			    			  "action": "批量删除",//动作
			    			  "detail": "",//详情,默认为空
			    			  "module": "sys_manage_app"//二级菜单名称，如无二级菜单 使用一级菜单名称
						});
				},
   		   	})
        };
        /**
	     * @description 根据appId查询回显数据 修改时使用
	    */
        model.getAppManageById = function(id) {
	    	$.AIGet({
    			url:$.ctx + "/api/sys/appManagement/getByAppId",
    			datatype:"json",
    			data:{
    				"appId":id
    			},
    			success:function(result){
    				var data = result.data;
    				$('#procName').val(data.procName);
    				$('#procId').val(data.procId);
    				$('#appName').val(data.appName);
    				$('input[name=runFreqRadio][value='+data.runFreq+']').prop('checked',true);;
    				$('input[name= impLevel][value='+data.impLevel+']').prop('checked',true);
    				$('#appManageTreeAdd_value').val(data.appClassifyName).attr('node-id',data.appClassifyId);
    				$('input[name=isDefault][value='+data.isDefault+']').prop('checked',true);
    				$('#planCompleteTime').val(data.time);
    				$('#dateArgs').val(data.dateArgs);
    				$('#userNameInput').val(data.proposer);
    				$('#remark').val(data.remark);
    				//日周月季联动计划完成时间
    				$('.J_hidden').addClass('hidden');
	    	    	$('.J_'+data.runFreq).removeClass('hidden');
	    	    	$('.has-select-form-group .btn-group').addClass('hidden');
	    	    	$('.J_'+data.runFreq).next('.btn-group').removeClass('hidden');
	    	    	if(data.runFreq=='day'){
	    	    		$('.J_describe').text('每日');
	    	    		$('.J_pianTxt').text('天');
	    	    	}
					if(data.runFreq=='week'){
						var week = data.week ? data.week : '0';
						$('.J_describe').text('每周');
						$('.J_pianTxt').text('周');
		    	    	$('.J_week_type').val(week).multiselect('refresh');
						    	    	}
					if(data.runFreq=='month'){
						var day = data.day ? data.day : '1';
						$('.J_describe').text('每月');
						$('.J_pianTxt').text('月');
		    	    	$('.J_month_type').val(day).multiselect('refresh');
					}
					if(data.runFreq=='quarter'){
						var month = data.month ? data.month : '1';
						$('.J_describe').text('每季');
						$('.J_pianTxt').text('季');
		    	    	$('.J_quarter_type').val(month).multiselect('refresh');
					}
					//电话号码
					var tel = data.tel;//data.tel ["18632159874", "18601282739", "15237766123"]
					if(tel){
						$("#SMStelNum").val(tel.join(','));
						var htmlTel = '';
						for(var i=0;i<tel.length;i++){
							htmlTel += '<a href="javascript:;"><span>'+tel[i]+'</span><i></i></a>'
						}
  	    				$('#inputPhoneNum').before(htmlTel);
  	    				//电话号码的删除按钮
  	    				model.telDelete();
					}

   			  }
	    	});
        };
        /**
	     * @description 电话号码的删除按钮
	    */
        model.telDelete = function(){
        	$("#selectedPhoneNum a").on("click","> i",function(){
					$(this).parent().remove();
					$("#inputPhoneNum").focus();
					var telNum = $(this).prev().text();
					var SMSTelNum = $("#SMStelNum").val();
					var telarr = SMSTelNum.split(",")
					SMSTelNum = SMSTelNum.replace(telNum+",","");
					$("#SMStelNum").val(SMSTelNum);
			});
    	};
        /**
	     * @description 刷新应用列表
	    */
        model.refreshGridAppManage = function(){
        	/* */
        	var ajaxData = {
    				"runFreq":$('#cycleType').val(),
    				"impLevel":$('#importantType').val(),
    				"appName":$('#searchTxtAppManage').val(),
    		};
    		$("#gridAppManage").jqGrid('setGridParam',{
                postData:ajaxData,page:1
            },true).trigger("reloadGrid");
    	};
    	/***
	     * 获取左侧树全部分类
	    */
	    model.loadAppManageTree = function(appClassifyName) {
	    	   var appClassifyName = appClassifyName ? appClassifyName : "";
		    	$.AIGet({
	    			url:$.ctx + "/api/sys/appManagement/appClassifies",
	    			datatype:"json",
	    			data:{"appClassifyName":appClassifyName},
	    			success:function(result){
	    			 	appManage.ztreeObj.init({
	    		    		id:"appManageTree",
	    		    		expandRoot:true,//是否展开根节点
	    					expandRootId:'0000',//根节点的id
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
    		    					removeTitle: "删除"
    		    				},
	    		    			callback: {
	    		    				beforeRename: model.zTreeBeforeRename,
    		    					beforeRemove:model.beforeRemove,
    		    					beforeDrag: model.zTreeBeforeDrag,
    		    					beforeDrop: model.zTreeBeforeDrop,
    		    					onDrop:model.zTreeOnDrop,
	    		    				onClick: function(event, treeId, treeNode){
	    		    					$("#gridAppManage").jqGrid('setGridParam',{
	    		    				        postData:{appClassifyId:treeNode.id}
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
	     * @description 拖拽树节点
	    */
	    model.zTreeBeforeDrag=function(treeId, treeNodes){

	    	var falg;
			if(treeNodes[0].name!= null && treeNodes[0].name != "" &&treeNodes[0].name  != undefined){
				falg = true;
			}else{
				falg = false;
			}
			return falg;
	    }
	    model.zTreeBeforeDrop=function(treeId, treeNodes, targetNode, moveType){
	    	// 获取拖动分类节点及其所有子节点数量
	    	var zTree = appManage.ztreeObj.instance;
	    	var childNodes = zTree.transformToArray(treeNodes[0]);
	    	var moveNodeCount = childNodes.length;

	    	var falg;
			if(targetNode.name!= null && targetNode.name != "" &&targetNode.name  != undefined){
				$.AIPut({
	    			url: $.ctx+'/api/sys/appManagement/updateNode',
	    			data: {"appClassifyId":treeNodes[0].id,"appClassifyName":treeNodes[0].name,"parentClassifyId":targetNode.id,"moveNodeCount":moveNodeCount},
	    			success: function(data){
	    				console.log(data)
	    				  falg=false;
	    				   if(data.status == "201"){
	    						$("#appManageDeleteDlg").alert({
				    			   title:"提示",
				    			   // content:'已超过最大层级限定的4级',data.message
				    			   content:data.message,
				    			   dialogType:"failed",
				    			   close: function( event, ui ) {
				    				   appManage.loadAppManageTree();//重新加载左侧树
				    			   },
				    			   callback:function(){
				    				   appManage.loadAppManageTree();//重新加载左侧树
				    			   },
				    		  });

	    				   }else{
	    					   $("#appManageDeleteDlg").alert({
	    		    			   title:"提示",
	    		    			   content:'拖动分类节点成功',
	    		    			   dialogType:"success",//状态类型：success 成功，failed 失败，或者错误，info提示
	    		    			   callback:function(){
				    				   appManage.loadAppManageTree();//重新加载左侧树
				    			   },
	    		    		   });
	    				   }
	    			},
	    		});
			}
			return falg;
	    }
	    model.zTreeOnDrop=function(evelnt, treeId, treeNode, targetNode, moveType){
	    	// console.log(targetNode)
	    	var zTree = appManage.ztreeObj.instance;
	    	var childNodes = zTree.transformToArray(treeNodes[0]);
	    	var moveNodeCount = childNodes.length;
	    	$.AIPut({
    			url: $.ctx+'/api/sys/appManagement/updateNode',
    			data: {"appClassifyId":treeNode[0].id,"appClassifyName":treeNode[0].name,"parentClassifyId":targetNode.id,"moveNodeCount":moveNodeCount},
    			success: function(data){
    				   if(data.status == 200){
    					   //alert('修改节点成功成功');
    				   }
    			},
    		});
	    	zTree.updateNode(treeNode);
	    	return true;
	    }


	    /**
	     * @description 重命名树节点
	    */
	    model.zTreeBeforeRename = function(treeId, treeNode, newName, isCancel) {
	    	//如果 beforeRename 返回 false，则继续保持编辑名称状态，直到名称符合规则位置 （按下 ESC 键可取消编辑名称状态，恢复原名称）如果未设置 beforeRename 或 beforeRename 返回 true，则结束节点编辑名称状态，更新节点名称，并触发 setting.callback.onRename 回调函数。
	    	var zTree = appManage.ztreeObj.instance;
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
	    			   content:'该应用分类名称已存在',
	    			   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
	    		   });
	    		return false;
	    	}
	    	if(treeNode.name!=newName && jQuery.inArray(newName, allNames) <= -1){
	    		$.AIPut({
	    			url: $.ctx+'/api/sys/appManagement/updateNode',
	    			data: {"appClassifyId":treeNode.id,"appClassifyName":newName,"parentClassifyId":treeNode.pid},
	    			success: function(data){
	    				   if(data.status == 200){
	    					   //alert('修改节点成功成功');
	    					   $("#appManageDeleteDlg").alert({
	    		    			   title:"提示",
	    		    			   content:'修改节点名称成功',
	    		    			   dialogType:"success",//状态类型：success 成功，failed 失败，或者错误，info提示
	    		    			   /*callback:function(){
				    				   appManage.loadAppManageTree();//重新加载左侧树
				    			   },*/
	    		    		   });
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
	    	var zTree = appManage.ztreeObj.instance;
	    	zTree.selectNode(treeNode);
	    	//if(treeNode.isCanDel==true && treeNode.id!=0){//可删除
	    	if(treeNode.id!=0){
	    		$.AIDel({
	    			   url: $.ctx+'/api/sys/appManagement/deleteNode',
	    			   data: {"appClassifyId":treeNode.id},
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
	    					   appManage.loadAppManageTree();//重新加载左侧树
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
		    			   content:'有属于当前分类的应用或子节点，不允许删除',
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
	    	//level==4时不能再添加 隐藏加号按钮
	    	if(treeNode.level=='4'){
	    		var addStr = '';
	    	}else{
	    		var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
	    		+ "' title='add node' onfocus='this.blur();'></span>";
	    	}
	    	sObj.after(addStr);
	    	var btn = $("#addBtn_"+treeNode.tId);
	    	$("#appManageTree_1_edit").bind("click",function(){
		    	if(treeNode.id==0){//全部分类不可删除
		    		 $("#appManageDeleteDlg").alert({
		    			   title:"提示",
		    			   content:'根节点不可修改',
		    			   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
		    		  });
		    		 return false;
		    	}
	    	})
	    	if (btn) btn.bind("click", function(){
	    		var zTree = appManage.ztreeObj.instance;
	    		zTree.addNodes(treeNode, {id:('100' + model.newCount), pId:treeNode.id, name:"new node" + (model.newCount++)});
	    		zTree.updateNode(treeNode);
	    		return false;
	    	});
	    };
	    model.removeHoverDom = function(treeId, treeNode) {
	    	$("#addBtn_"+treeNode.tId).unbind().remove();
	    };
	    /***
	     * @description 查询默认计划完成时间
	    */
	    model.getPlanCompleteTime = function() {
		    	$.AIGet({
	    			url:$.ctx + "/api/sys/appManagement/getPlanEndList",
	    			datatype:"json",
	    			success:function(result){
	    				var planEndTime = DateFmt.Formate(result.data[0].planEndTime,"hh:mm");
	    				$('#planCompleteTime').val(planEndTime);
	    			}
		    	});
	    };
	    /**
	     * @description 关联应用程序唯一性校验
	    */
	    model.checkName = function(data){
	    	var checkObj = [];
	    		checkObj[1]=true;
	    	    $.AIGet({
	    			url : $.ctx + "/api/sys/appManagement/check",
	    			data : {"procId" : data.procId,"appId":data.appId,"appName":data.appName},
	    			datatype:"json",
	    			async:false,
	    			success:function(result){
	    				if(result.data.checkResult == false){
	    					checkObj[0] = result.message;
	    					checkObj[1] =false;
	    					return checkObj;
	    				}
	    			}
	    		});
	    	   return checkObj;
	    };
	    /**
	     * 新建或修改用户组 保存前的验证
	     * @param isUpdate=1时修改 0时新建
	     */
	    model.beforeSaveCheck = function(data){
	    	var checkObj = [];
	    		checkObj[1]=true;
	    	if(!data.procName || !data.procId){
	    		checkObj[0] ='请选择关联应用程序';
	    		checkObj[1] =false;
	    		return checkObj;
	    	}
	    	if(!data.appName){
	    		checkObj[0] ='请输入应用名称';
	    		checkObj[1] =false;
	    		return checkObj;
	    	}
	    	if(!data.appClassifyId){
	    		checkObj[0] ='请选择所属分类';
	    		checkObj[1] =false;
	    		return checkObj;
	    	}
	    	if(!data.impLevel){
	    		checkObj[0] ='请选择重要程度';
	    		checkObj[1] =false;
	    		return checkObj;
	    	}
	    	if(data.isDefault ==1 && !data.time){
	    		checkObj[0] ='计划完成时间的时分选项不能为空';
	    		checkObj[1] =false;
	    		return checkObj;
	    	}
	    	return checkObj;
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
	    				   $( "#appManageAddDlg" ).dialog( "close" );
	    				   $("#SMStelDlg").alert({
	    					   title:"提示",
	    					   content:"保存成功",
	    					   dialogType:"success"
	    				   });
	    				   //刷新左侧树和右侧用列表
	    				   appManage.loadAppManageTree();;
	    				   appManage.refreshGridAppManage();
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
	    			   $( "#appManageAddDlg" ).dialog( "close" );
	    			   $("#SMStelDlg").alert({
	    				   title:"提示",
	    				   content:"保存失败",
	    				   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
	    			   });
	    		   }
	    	}
	    };
	    /**
	     * @description 新建或修改时应用名称和需求提出人自动补全
	    */
	    model.appNameAndUserNameComplete = function(){
	    	/**自动补全-应用名称**/
	    	$("#procName").autocomplete({
	    		source:function( request, response ) {
	    	        $.AIGet( {
	    	      	   url:$.ctx + "/api/sys/appManagement/getByProcName",
	    	      	   data:{"searchText":$.trim($("#procName").val())},
	    	      	   success:function( data) {
	    	      	  			response($.map(data.data, function(item ) { // 此处是将返回数据转换为 JSON对象，并给每个下拉项补充对应参数
	    	                    	return {
	    	                    		// 设置item信息
	    	                    		value: item["procNameZn"], // 下拉项显示内容
	    	                    	    info: item//返回的每条数据信息
	    	                    	}
	    	      	  			}));
	    	      	  		}
	    	        });
	    	    },
	    	    select: function( event, ui ) {
	    	    	var info = ui.item.info;
	    	    	//根据选择的关联应用程序 联动//周期//重要程度//偏移量
	    	    	$('#procId').val(info.procId);//关联应用程序的id
	    	    	$('#appName').val(info.procNameZn);//应用程序名称
	    	    	$('input[name=runFreqRadio][value='+info.runFreq+']').prop('checked',true);//周期
	    	    	$('input[name=impLevel][value='+info.priLevel+']').prop('checked',true);;//重要程度
	    	    	$('#dateArgs').val(info.dateArgs);//偏移量
	    	    	//日周月季联动计划完成时间
	    	    	$('.J_hidden').addClass('hidden');
	    	    	$('.J_'+info.runFreq).removeClass('hidden');
	    	    	$('.has-select-form-group .btn-group').addClass('hidden');
	    	    	$('.J_'+info.runFreq).next('.btn-group').removeClass('hidden');
	    	    	if(info.runFreq=='day'){
	    	    		$('.J_describe').text('每日');
	    	    		$('.J_pianTxt').text('天');
	    	    	}
					if(info.runFreq=='week'){
						$('.J_describe').text('每周');
						$('.J_pianTxt').text('周');
						    	    	}
					if(info.runFreq=='month'){
						$('.J_describe').text('每月');
						$('.J_pianTxt').text('月');
					}
					if(info.runFreq=='quarter'){
						$('.J_describe').text('每季');
						$('.J_pianTxt').text('季');
					}
	    	    }
	    	});
	       /**自动补全-需求提出人**/
	       $("#userNameInput" ).AIAutoComplete({
	    	  url:$.ctx + "/api/sys/appManagement/getByUserName",
	    	  data:{
	    		       "userNameInput": "userName" //"前端页面ID"："后台传参"
	    		    },
	    	  jsonReader:{
	    					item:"userName",//"后台传参"
	    		         }
	       });
	    };
	    /**
	     * 批量添加保存
	     */
	    model.addAppManageBatch = function(){
	      	var ajaxData ={"appList" : appManage.appList};
	      	$.AIPost({
	      		url: $.ctx + "/api/sys/appManagement/insertList",
	      		data: ajaxData,
	      		async:true,
	      		dataType:"json",
	      		type:"POST",
	      		success: function(data){
	      			if(data.status == 200){
	      				$( "#appManageAddBatchDlg" ).dialog( "close" );
	      				$("#AppAlertDlg").alert({
	      					title:"提示",
	      					content:"批量添加成功",
	      					dialogType:"success"
	      				});
	      				 //刷新左侧树和右侧用列表
	    			   appManage.loadAppManageTree();;
	    			   appManage.refreshGridAppManage();
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
	    /**
	     * 新建或修改应用
	     * @param isUpdate=1时修改 0时新建
	     */
	    model.insertOrUpdateApp = function(obj,isUpdate){
	    	$("#appManageAddDlg").aiDialog({
	    		  width:640,
	    		  height:"auto",
	    		  title:"新增/修改应用",
				  gridObj:model.gridObj,
	    		  callback:function(){
	    			  var appId = isUpdate =='1' ? $(obj).attr('data-appId') : "";
	    			  var saveObj = formFmt.formToObj($("#formSaveAppManage"));
	    			  //电话号码
	    			  var tel = saveObj.tel;
			   		  tel = tel.length> 0 ? tel.substring(0,tel.length-1).split(","):[];
			   		  saveObj.tel = tel;

	    		      var treeObj=$.fn.zTree.getZTreeObj("appManageTreeAdd_tree");
	    		      var appClassifyId = $('#appManageTreeAdd_value').attr('node-id');
	    		      saveObj.appClassifyId = appClassifyId;//所属分类
	    			  saveObj.appId = appId;//appId
	    			  var checkObj = appManage.beforeSaveCheck(saveObj);
	    			  var checkObjName = appManage.checkName(saveObj);//所属业务唯一性校验
	    			  if(!checkObjName[1]){//关联程序唯一性验证
	    				  $("#SMStelDlg").alert({
	    					   title:"提示",
	    					   content:checkObjName[0],
	    					   dialogType:"failed"
	    				   });
	    			  }
	    			  if(!checkObj[1]){//非空验证
	    				  $("#SMStelDlg").alert({
	    					   title:"提示",
	    					   content:checkObj[0],
	    					   dialogType:"failed"
	    				   });
	    			  }
	    			  if(checkObjName[1] && checkObj[1]){
	    				  if(isUpdate=="0"){
	    				  	$.AIPost(appManage.returnAjaxOption($.ctx + "/api/sys/appManagement/insert",saveObj));
	    				  	//用来服务器记录log
	    		    		$.AILog({
	    		    			  "action": "新增",//动作
	    		    			  "detail": "",//详情,默认为空
	    		    			  "module": "sys_manage_app"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    		    	    });
	    				  }
	    				  if(isUpdate=='1'){
	    					  $.AIPut(appManage.returnAjaxOption($.ctx + "/api/sys/appManagement/updateByAppId",saveObj));
	    					  //用来服务器记录log
	    					  var detail = '应用ID:'+appId+'&nbsp;&nbsp;&nbsp;&nbsp;应用名称:'+$(obj).attr('data-name');
		    		    	  $.AILog({
		    		    			  "action": "修改",//动作
		    		    			  "detail": detail,//详情,默认为空
		    		    			  "module": "sys_manage_app"//二级菜单名称，如无二级菜单 使用一级菜单名称
		    		    	  });
	    				  }
	    			  }
	    		  },
	    		  open:function(){
	    			  $('.ui-app-name-box').removeClass('hidden');
	    			  appManage.loadRunSelectLabel('#runFreqLabels',$.runFreqObj,'runFreqRadio');//周期单选list
	    			  appManage.loadRunSelectLabel('#priLevelLabels',$.priLevelObj,'impLevel');//重要程度单选list
	    			  $('input[name=isDefault]').removeAttr('checked');
	    			  $('input[name=isDefault][value="0"]').prop('checked',true);
	    			  appManage.loadRunSelectList('.J_week_type',$.weekObj);//每周list
		    	      appManage.loadRunSelectList('.J_month_type',$.monthObj);//每月list
		    	      appManage.loadRunSelectList('.J_quarter_type',$.quarterObj);//每季list
		    	      $('.J_week_type,.J_month_type').multiselect({buttonWidth:80});
		    	      $('.J_quarter_type').multiselect({buttonWidth:90});
		    	      $('.has-select-form-group .btn-group').addClass('hidden');
		    	      $('.J_describe').text('每日');
		    	      $('.J_pianTxt').text('天');
	    			  appManage.appNameAndUserNameComplete();//应用名称和需求提出人自动补全
	    			  //appManage.getPlanCompleteTime();//查询默认计划完成时间
	    			  //打开所属分类下拉树
	    			  $("#appManageTreeAdd").comboTree({
	    				  	treeUrl: $.ctx + "/api/sys/appManagement/appClassifies",
	    					noneSelectedText:"请选择",
	    					id:"appManageTreeAdd",
	    					ajaxType:"get",
	    					maxHeight:283,
	    					expandRoot:true,//是否展开根节点
	    					expandRootId:'0000'//根节点的id
	    			  });

	    			  //时分秒-计划完成时间
	    			  $( ".J_planCompleteTime").timepicker({
	    				  timeFormat: "HH:mm",
	    				  showSecond: false,
	    				  controlType:"select",
	    				  timeOnlyTitle:"选择时间",
	    				  timeText: '已选择',
	    				  hourText: '时',
	    				  minuteText: '分',
	    				  second_slider:false,
	    				  currentText:"当前时间",
	    				  closeText: '确定',
	    				  onClose:function(time){
		   					  var time = time ? time : "00:00";
		   					  $(this).val(time);
		   				  }

	    		      });
	    			  $.datepicker.dpDiv.addClass("ui-datepicker-box");
	    			  //电话号码
	    			  $('#SMStelNum').val("");
	    			  $('#selectedPhoneNum a').remove();
	    			  $("#inputPhoneNum").off("keyup").on("keyup",function(e){
	  	    			e = e || window.event;
	  	    			var tel = $(this).val();
	  	    			tel = $.trim(tel);
	  	    			if(e.keyCode == 13){
	  	    				if(tel.length == 0 || tel.length <11 || !(/^1[3|4|5|8][0-9]\d{4,8}$/.test(tel))){
	  			   			 $("#SMStelDlg").alert({
	  							   title:"提示",
	  							   content:"手机号格式错误",
	  							   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
	  						   });
	  		   				return false;
	  		   			}
	  	    				var html =$('<a href="javascript:;"><span>'+tel+'</span><i></i></a>');
	  	    				$(this).before(html);
	  	    				$(this).val("");
	  	    				var SMStelNum = tel+","+$("#SMStelNum").val();
	      					$("#SMStelNum").val(SMStelNum);
	      				    //电话号码的删除按钮
	  	    				model.telDelete();
	  	    			}
	  	    		});
	    			  if(isUpdate&&isUpdate=='1'){
	    				  $('.ui-app-name-box').addClass('hidden');
	    				  var appId = $(obj).attr('data-appId');
	    				  appManage.getAppManageById(appId);//修改信息回显
	    			  }
	    		  }
	    	});
	    };
        return model;
})(window.appManage || {});

