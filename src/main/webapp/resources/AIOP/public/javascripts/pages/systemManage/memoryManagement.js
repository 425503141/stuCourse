/**
 * ------------------------------------------------------------------
 * 存储管理
 * ------------------------------------------------------------------
 */
var taskCode = '';
var memoryManagement = (function (model){
		model.userId = '';
	    var ssg = window.sessionStorage;
	    if(ssg){
    			model.userId = ssg.getItem("userId");
    	}
	    /**
	      * @description 获取列表
	     */
        model.loadmemoryManagementGrid = function(option) {
			$("#gridMemory").AIGrid({
				url:$.ctx + '/api/sys/storage/manager/list',
				datatype: "json",
				postData:{},
				colNames:['任务编码','删除对象', '文件路径', '通配符','文件删除周期','文件保存时长','描述','启用/停用时间','操作','创建时间','创建人','更新时间','维护人','状态'],
			   	colModel:[
			   	    {name:'taskCode',index:"task_code",frozen : true,width:100,align:"center"},
			   		{name:'delFileType',index:'del_file_type', width:100,frozen : true,align:"center"},
			   		{name:'filePath',index:'file_path', width:110,align:"center"},
			   		{name:'ruleWildcards',index:'rule_wildcards', width:110,align:"center"},
			   		{name:'delCycle',index:'del_cycle', width:140, align:"center"},
			   		{name:'saveDuration',index:'save_duration', width:100, align:"center"},
			   		{name:'taskDescription',index:'task_description', width:110,align:"center"},
			   		{name:'enableDisableTime',index:'enable_disable_time', width:100,align:"center"},
			   		{name:'op',index:'op', width:310, align:"center",formatter:del},
			   		{name:'createTime',index:'create_time', width:110, align:"center"},
			   		{name:'createUser',index:'create_user', width:110,align:"center"},
			   		{name:'updateTime',index:'update_time', width:130,align:"center",formatter:DateFmt.dataDateFormateMinute},
			   		{name:'updateUser',index:'update_user', width:150, sortable:false,title:false,align:"center"},
			   		{name:'enableStatus',index:'enable_status ', width:110, align:"center",frozen : true}
			   	],
			   	rowNum:10,
			   	rowList:[10,20,30],
			   	pager: '#pagerMemory',
			   	sortname: '',
			   	rownumbers: false,
			    viewrecords: true,
			    multiselect:false,
			    sortorder: "asc",
                autowidth:false,
                shrinkToFit:false,
                // autoScroll: false,
				jsonReader: {
					repeatitems : false,
					id: "0"
				},
				height: '100%',
				//showNoResult:true
			});
			//操作
			function del(cellvalue, options, rowObject){
                // var html="<button type=\"button\" class=\"btn btn-default  ui-table-btn ui-table-btn\" title=\"查看\">查看</button><div class=\"dropdown\">"+
                //     "   <button type=\"button\" class=\"btn btn-default  ui-table-btn ui-table-btn dropdown-toggle\" id=\"dropdownMenu1\" "+
                //     "           data-toggle=\"dropdown\">"+
                //     "       更多"+
                //     "       <span class=\"caret\"></span>"+
                //     "   </button>"+
                //     "   <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenu1\">"+
                //     "       <li role=\"presentation\">"+
                //     "           <a role=\"menuitem\" tabindex=\"-1\" href=\"#\">查看工单</a>"+
                //     "       </li>"+
                //     "       <li role=\"presentation\">"+
                //     "           <a role=\"menuitem\" tabindex=\"-1\" href=\"#\">启用</a>"+
                //     "       </li>"+
                //     "       <li role=\"presentation\">"+
                //     "           <a role=\"menuitem\" tabindex=\"-1\" href=\"#\">修改</a>"+
                //     "       </li>"+
                //     "       <li role=\"presentation\">"+
                //     "           <a role=\"menuitem\" tabindex=\"-1\" href=\"#\">删除</a>"+
                //     "       </li>"+
                //     "   </ul>"+
                //     "</div>";

                var html='<button type="button" class="btn btn-default  ui-table-btn ui-table-btn">查看</button>'+'<button type="button" class="btn btn-default  ui-table-btn ui-table-btn" >更多'+'<span class="caret">'+'</span></button>';
                    return html;
                // var html="<button type=\"button\" class=\"btn btn-default  ui-table-btn ui-table-btn\" title=\"查看\">查看</button><div class=\"dropdown\">"+
                //             "   <button type=\"button\" class=\"btn btn-default  ui-table-btn ui-table-btn dropdown-toggle\" id=\"dropdownMenu1\" "+
                //             "           data-toggle=\"dropdown\">"+
                //             "       更多"+
                //             "       <span class=\"caret\"></span>"+
                //             "   </button>"+
                //             "   <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenu1\">"+
                //             "       <li role=\"presentation\">"+
                //             "           <a role=\"menuitem\" tabindex=\"-1\" href=\"#\">查看工单</a>"+
                //             "       </li>"+
                //             "       <li role=\"presentation\">"+
                //             "           <a role=\"menuitem\" tabindex=\"-1\" href=\"#\">启用</a>"+
                //             "       </li>"+
                //             "       <li role=\"presentation\">"+
                //             "           <a role=\"menuitem\" tabindex=\"-1\" href=\"#\">修改</a>"+
                //             "       </li>"+
                //             "       <li role=\"presentation\">"+
                //             "           <a role=\"menuitem\" tabindex=\"-1\" href=\"#\">删除</a>"+
                //             "       </li>"+
                //             "   </ul>"+
                //             "</div>";
			}
        };
    	model.lookMemoryZhuJi = function(option) {
                // var serverId = option['serverId'];
                $("#gridMemoryZhuJi").AIGrid({
                    url:$.ctx + '/api/sys/storage/manager/see',
                    datatype: "json",
                    postData:{"taskCode":taskCode},
                    colNames:['分类','系统', '用途', '主机IP','主机名称'],
                    colModel:[
                        {name:'fileSystem',index:'fileSystem', width:110},//frozen : true固定列
                        {name:'type',index:'type', width:110,align:"center"},
                        {name:'totalCapacity',index:'totalCapacity', width:110, align:"center"},
                        {name:'usedCapacity',index:'usedCapacity', width:110,align:"center"},
                        {name:'availableCapacity ',index:'availableCapacity', width:110, align:"center"}

                    ],
                    rowNum:10,
                    rowList:[10,20,30],
                    // pager: '#pagerMemoryZhuJi',
                    sortname: '',
                    viewrecords: true,
                    multiselect:false,
                    sord:'',
                    rownumbers:false,
                    jsonReader: {
                        repeatitems : false,
                        id: "0"
                    },
                    height: '100%',
                    // afterGridLoad:function(){
                    //     $("#tableCellInfo,#appTableInfoPanel").addClass("hidden");
                    // },
                });
        }
	    /**
	     * @description 删除应用
	    */
        model.deletememoryManagementSingle = function(obj){
        	var dataId = $(obj).attr('data-id');
        	var msg = '删除该主机会同时删除该主机的数据库，确认是否删除该主机?';
        	var url = $.ctx + "/api/sys/serverManagement/delete";
			var ajaxData = {"serverId":dataId};
			memoryManagement.deletememoryManagement(url,ajaxData,msg);
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
        model.deletememoryManagement = function(url,ajaxData,msg,ids){
        	$("#memoryManagementDeleteDlg").confirm({
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
								   $("#memoryManagementDeleteDlg" ).dialog( "close" );
								   $("#memoryManagementDeleteDlg").confirm({
									   title:"提示",
									   content:"删除成功",
									   dialogType:"success",//状态类型：success 成功，failed 失败，或者错误，info提示
								   });
								   //刷新列表
								   model.refreshGridmemoryManagement();
							   }
						   },
						   error:function(){
							   $("#memoryManagementDeleteDlg").alert({
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
        model.getmemoryManagementById = function(id) {
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
	     * 返回新建或修改应用所需的option
	     * @param url-接口地址  ajaxData-传的参数
	     */
	    model.returnAjaxOption = function(url,ajaxData){
	    	return {
	    		url: url,
	    		data: ajaxData,
	    		success: function(data){
	    			   if(data.status == 200){
	    				   $( "#memoryManagementAddDlg" ).dialog( "close" );
	    				   $("#SMStelDlg").alert({
	    					   title:"提示",
	    					   content:"保存成功",
	    					   dialogType:"success"
	    				   });
	    				   //刷新左侧树和右侧用列表
	    				   memoryManagement.refreshGridmemoryManagement();
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
	    			   //$( "#memoryManagementAddDlg" ).dialog( "close" );
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
	    	$("#memoryManagementAddDlg").aiDialog({
	    		  width:640,
	    		  height:"auto",
	    		  title:"新增/修改主机",
	    		  gridObj:model.gridObj,
	    		  callback:function(){
	    			  var serverId  = isUpdate =='1' ? $(obj).attr('data-id') : "";
	    			  var purpose = $('#treeList_add_value').attr('node-id');//所属节点id
	    			  var saveObj = formFmt.formToObj($("#formSavememoryManagement"));
	    			  saveObj.serverId = serverId;
	    			  saveObj.purpose = purpose;
	    			  var checkObj = memoryManagement.beforeSaveCheck(saveObj);
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
		    				  	$.AIPost(memoryManagement.returnAjaxOption($.ctx + "/api/sys/serverManagement/insert",saveObj));
		    				  	//用来服务器记录log
//		    		    		$.AILog({
//		    		    			  "action": "新增",//动作
//		    		    			  "detail": "",//详情,默认为空
//		    		    			  "module": "sys_daq_plan"//二级菜单名称，如无二级菜单 使用一级菜单名称
//		    		    	    });
		    				  }
		    				  if(isUpdate=='1'){
		    					  $.AIPut(memoryManagement.returnAjaxOption($.ctx + "/api/sys/serverManagement/update",saveObj));
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
	    			  $('#memoryManagementAddDlg').attr('serverId',serverId);
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
	    				  memoryManagement.getmemoryManagementById(dataId);//修改信息回显
	    			 }
	    		  }
	    	});
	    };

	    /**
	     * 加载应用错误列表
	     * @param data
	     */
//	    model.loadDlgList = function(data){
//	    	$("#importAppList").empty();
//	    	$("#importAppList").AIGrid({
//	    		datatype: "local",
//	    	   	colNames:['错误所在行', '错误原因'],
//	    	   	colModel:[
//	    	   		{name:'errorRow',index:'error_row', width:36, align:"center",sortable:false},
//	    	   		{name:'errorCause',index:'error_cause', width:100, align:"center",cellattr:addCellAttr,sortable:false},
//	    	   	],
//	    	    multiselect:false,
//	    		rownumbers:false,
//	    		height: 255
//	    	});
//	    	function addCellAttr(rowId, val, rowObject, cm, rdata) {
//	            return "style='color:#e75062'";
//	        }
//	    	for(var i=0;i<=data.length;i++){
//	    		jQuery("#importAppList").jqGrid('addRowData',i+1,data[i]);
//	    	}
//	    }
        return model;
})(window.memoryManagement || {});
