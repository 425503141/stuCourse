/**
 * ------------------------------------------------------------------
 * 接口监控管理
 * ------------------------------------------------------------------
 */
var hostManage = (function (model){ 
	    model.interfaceList = [];//批量添加时的应用信息
	    model.gridObj = "#gridHostManage";
	    /**
		   * @description 加载周期&重要程度下拉列表-搜索条件
		 */
	     model.loadRunSelectList = function(obj,data,buttonWidth,isDlg) {
	    	 if(isDlg&&isDlg=='1'){
	    		 var str = '<option>请选择</option>';
	    	 }else{
	    		 var str = '';
	    	 }
	    	 for(var i in data){
	    		 str+='<option value="'+i+'">'+data[i]+'</option>'
	    	 }
	    	 $(obj).html(str);
	    	 $(obj).multiselect({
    			nonSelectedText:"重要程度",
    			buttonWidth:buttonWidth,
    			nSelectedText:"个选择",
    			includeSelectAllOption:true,
    			selectAllText: '全部',
    			//selectAllValue: 'null',
    		}).multiselect('refresh');
	     };
	    /**
		    * @description 接口来源下拉列表
		  */
	   model.loadInterfaceSourceList = function(obj,buttonWidth,isDlg){
		   $.AIGet({
		   	   url:$.ctx + "/api/sys/interfaceManagement/interfaceSourcelist",
			   data:{},
			   async:false,
			   success:function(result) {
				   		var data = result.data;
				   		if(isDlg&&isDlg=='1'){
				    		 var menuStr = '<option>请选择</option>';
				    	 }else{
				    		 var menuStr = '';
				    	 }
				   		for(var i in data){
				   		    menuStr+='<option value="'+data[i].interfaceSourceId+'">'+data[i].interfaceSourceName +'</option>'	
				   		}
				   		$(obj).html(menuStr);
				   		$(obj).multiselect({
				   			nonSelectedText:"接口来源",
				   			buttonWidth:buttonWidth,
				   			nSelectedText:"个选择",
				   			includeSelectAllOption:true,
				   			selectAllText: '全部',
				   		}).multiselect('refresh');
			   	}
			  });
	    };
	    /**
		    * @description 接口类型下拉列表
		  */
	   model.loadInterfaceTypeList = function(obj,buttonWidth,isDlg){
		   $.AIGet({
		   	   url:$.ctx + "/api/sys/interfaceManagement/interfaceTypeList",
			   data:{},
			   async:false,
			   success:function(result) {
				   		var data = result.data;
				   		if(isDlg&&isDlg=='1'){
				    		 var menuStr = '<option>请选择</option>';
				    	 }else{
				    		 var menuStr = '';
				    	 }
				   		for(var i in data){
				   		    menuStr+='<option value="'+data[i].interfaceType+'">'+data[i].typeName +'</option>'	
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
		    * @description 入库分类下拉列表
		  */
	   model.loadEntryTypeList = function(obj,buttonWidth){
		   $.AIGet({
		   	   url:$.ctx + "/api/sys/interfaceManagement/entryTypeList",
			   data:{},
			   async:false,
			   success:function(result) {
				   		var data = result.data;
				   	    var menuStr =  '<option>请选择</option>';;
				   		for(var i in data){
				   		    menuStr+='<option value="'+data[i].entryType +'">'+data[i].entryTypeName +'</option>'	
				   		}
				   		$(obj).html(menuStr);
				   		$(obj).multiselect({
				   			nonSelectedText:"入库分类",
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
				url:$.ctx + '/api/sys/interfaceManagement/list',
				datatype: "json",
				colNames:["id",'接口编码', '接口名称', '重要级别','接口来源','入库分类','更新时间','操作'],
			   	colModel:[
			   	    {name:'interfaceCode',index:"",hidden:true},
			   		{name:'interfaceCode',index:'interface_code', width:60},
			   		{name:'interfaceName',index:'interface_name', width:50,align:"center"},
			   		{name:'priLevel',index:'pri_level', width:50,align:"center",formatter:formatePriLevel},
			   		{name:'interfaceSourceName',index:'interface_source_name', width:50, align:"center"},
			   		{name:'entryTypeName',index:'entry_type_name', width:70, align:"center"},
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
				afterGridLoad:function(){
        	    	$("#tableCellInfo").addClass("hidden");//关闭第二屏
        	    },
			}); 
			function formatePriLevel(cellvalue, options, rowObject){
        		var priLevel = rowObject.priLevel;
        		var priLevelObj =$.priLevelObj;
        		return priLevelObj[priLevel] || priLevel;
        	}
			//操作
			function del(cellvalue, options, rowObject){
				var html='<button type="button" class="btn btn-default  ui-table-btn ui-table-btn" data-id="'+rowObject.interfaceCode+'" data-name="'+rowObject.planName+'" onclick="hostManage.showTableCellInfo(this);" title="详细">详细</button><button type="button" class="btn btn-default  ui-table-btn ui-table-btn" data-id="'+rowObject.interfaceCode+'" data-name="'+rowObject.planName+'" onclick="hostManage.deleteHostManageSingle(this);" title="删除">删除</button><button type="button" class="btn btn-default ui-table-btn" data-id="'+rowObject.interfaceCode+'" data-planName="'+rowObject.planName+'" onclick="hostManage.insertOrUpdateApp(this,\'1\')" title="修改">修改</button>';
				return html;
			}
        };
        /**
	      * @description 获取详请列表-点击详细出现第二屏
	     */
	      model.showTableCellInfo = function(obj) {
	    	  var interfaceCode = $(obj).attr('data-id');
	    	  var scrollTop = $("#tableCellInfo").removeClass("hidden").offset().top;
			  $('html,body').animate({"scrollTop": scrollTop }, 500 );
	    	  $.AIGet({
	    			url:$.ctx + "/api/sys/interfaceManagement/selectByInterfaceCode",
	    			datatype:"json",
	    			data:{"interfaceCode":interfaceCode},
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
	    				for(var key in data){
	    					
							if(data[key] && (key.indexOf("checkDataNumsFlag") != -1)){//是否校验数据量
								if(data[key]=='0'){
									data[key] = "是"
								} else if(data[key]=='1'){
									data[key] = "否"
								} else {
									data[key] = ""
								}
							}else if(data[key] && (key.indexOf("delTableFlag") != -1)){//是否删除正式表
								data[key] = data[key]=='true' ? "是" : "否"
							}else if(data[key] && (key.indexOf("transcodeFlag") != -1)){//是否转码
								if(data[key]=='0'){
									data[key] = "是"
								} else if(data[key]=='1'){
									data[key] = "否"
								} else {
									data[key] = ""
								}
							}else if(data[key] && (key.indexOf("filePlanArriveTime") != -1)){//文件计划到达时间
								data[key] = DateFmt.dataDateFormateMinute(data[key])
							}else if(data[key] && (key.indexOf("interfaceClassify") != -1)){//接口分类
								data[key] = data[key]=='1' ? "一经" : "二经";
							}else if(data[key] && key.indexOf("priLevel") != -1){//重要程度
								data[key] = $.priLevelObj[data[key]];
							}
							$("#BI-"+key).html(data[key]);
						}
	    			}
	    	  })
	      };
        /**
	     * @description 刷新列表
	    */
        model.refreshGridHostManage = function(){
        	var ajaxData = {
    				"searchText":$('#searchTxt').val(),
    				"interfaceSource":$('#interfaceSource').val(),
    				"priLevel":$('#importantType').val()
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
        	var msg = '确认是否删除该接口?';
        	var url = $.ctx + "/api/sys/interfaceManagement/delete";
			var ajaxData = {"interfaceCode":dataId};
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
							   }else{
								   $("#hostManageDeleteDlg").alert({
				      					title:"提示",
				      					content:data.message,
				      					dialogType:"failed"
				      				});
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
    			url:$.ctx + "/api/sys/interfaceManagement/selectByInterfaceCode",
    			datatype:"json",
    			data:{"interfaceCode":id},
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
    				$('input[name=interfaceCode]').val(data.interfaceCode);
    				$('input[name=interfaceName]').val(data.interfaceName);
    				//重要程度
    				$('#priLevelDlg').val(data.priLevel).multiselect('refresh');
				    //接口来源
				    $('#interfaceSourceDlg').val(data.interfaceSourceId).multiselect('refresh');
				    //入库分类
				    $('#entryType').val(data.entryType).multiselect('refresh');
				    //新增==========
				    //接口分类
				    $('#interfaceClassify').val(data.interfaceClassify).multiselect('refresh');
				    if(data.interfaceClassify=='2'){
				    	$('.J_erjingDiv').removeClass('hidden');
				    	$('#checkDataNumsFlag').val(data.checkDataNumsFlag).multiselect('refresh');
				    	$('#transcodeFlag').val(data.transcodeFlag).multiselect('refresh');
				    	$('input[name="dateArgs"]').val(data.dateArgs);
				    }else{
				    	$('.J_erjingDiv').addClass('hidden');
				    }
				    //接口类型
				    $('#interfaceDateType').val(data.interfaceType).multiselect('refresh');
				    //接口表名 分隔符 校验文件数 对应FTP信息 文件计划到达时间
				    $('input[name="interfaceTableName"]').val(data.interfaceTableName);
				    $('input[name="splitChar"]').val(data.splitChar);
				    $('input[name="checkFileNums"]').val(data.checkFileNums);
				    $('input[name="ftpId"]').val(data.ftpId);
				    var filePlanArriveTime = data.filePlanArriveTime ? DateFmt.Formate(data.filePlanArriveTime,"yyyy-MM-dd HH:mm") : " ";
				    $('input[name="filePlanArriveTime"]').val(filePlanArriveTime);
				    //是否删除正式表
				    $('#delTableFlag').val(data.delTableFlag).multiselect('refresh');
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
			    case !data.interfaceCode: 
	            	checkObj[0] ='接口编码不能为空';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.interfaceName: 
	            	checkObj[0] ='接口名称不能为空';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.interfaceClassify : 
	            	checkObj[0] ='请选择接口分类';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.interfaceDateType || data.interfaceDateType=="请选择" : 
	            	checkObj[0] ='请选择接口类型 ';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.priLevel || data.priLevel=="请选择" : 
	            	checkObj[0] ='请选择重要程度'
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.interfaceSource || data.interfaceSource=="请选择": 
	            	checkObj[0] ='请选择接口来源';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.entryType || data.entryType=="请选择": 
	            	checkObj[0] ='请选择入库分类';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.interfaceTableName : 
	            	checkObj[0] ='接口表名不能为空 ';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.splitChar : 
	            	checkObj[0] ='分隔符不能为空 ';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.checkFileNums  : 
	            	checkObj[0] ='校验文件数不能为空 ';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.ftpId : 
	            	checkObj[0] ='对应FTP信息不能为空 ';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.filePlanArriveTime : 
	            	checkObj[0] ='文件计划到达时间不能为空 ';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            // case data.interfaceClassify=='2' && !data.delTableFlag : 
	            case !data.delTableFlag || data.delTableFlag=="请选择":	
	            	checkObj[0] ='请选择是否删除正式表 ';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case data.interfaceClassify=='2' && !data.checkDataNumsFlag : 
	            	checkObj[0] ='请选择是否校验数据量 ';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case data.interfaceClassify=='2' && !data.transcodeFlag : 
	            	checkObj[0] ='请选择是否转码 ';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case data.interfaceClassify=='2' && !data.dateArgs : 
	            	checkObj[0] ='偏移量不能为空 ';
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
	    // 验证新增/修改时输入分割符是否为数字
	    model.isNum1 = function (num){
	    	 var reNum = /^-?\d*$/;
	    	 return(reNum.test(num));
	    	}
	    // 验证新增/修改时输入校验文件数是否为正整数
	    model.isNum2 = function (num){
	    	 var reNum = /^[0-9]*[1-9][0-9]*$/;
	    	 return(reNum.test(num));
	    	}
	    /**
	     * 新建或修改
	     * @param isUpdate=1时修改 0时新建
	     */
	    model.insertOrUpdateApp = function(obj,isUpdate){
	    	$("#hostManageAddDlg").aiDialog({
	    		  width:940,
	    		  height:"auto",
	    		  title:"新增/修改",
	    		  gridObj:model.gridObj,
	    		  callback:function(){
	    			  var interfaceCode  = isUpdate =='1' ? $(obj).attr('data-id') : "";
	    			  var purpose = $('#treeList_add_value').attr('node-id');//所属节点id
	    			  var saveObj = formFmt.formToObj($("#formSaveHostManage"));
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
		    				  return 
		    			  }
		  				var splitChar = saveObj.splitChar;
		    			  var flag = hostManage.isNum1(parseInt(splitChar));
		    			  if(flag == false){
		    				  $("#SMStelDlg").alert({
		    					   title:"提示",
		    					   content:"分隔符必须为整数",
		    					   dialogType:"failed"
		    				   });
		    				  return
		    			  }
		    			  var checkFileNums = saveObj.checkFileNums;
		    			  var flag = hostManage.isNum2(parseInt(checkFileNums));
		    			  if(flag == false){
		    				  $("#SMStelDlg").alert({
		    					   title:"提示",
		    					   content:"校验文件数必须为正整数",
		    					   dialogType:"failed"
		    				   });
		    				  return
		    			  }
		    			  if(checkObj[1]){
		    				  if(isUpdate=="0"){
		    				  	$.AIPost(hostManage.returnAjaxOption($.ctx + "/api/sys/interfaceManagement/insert",saveObj));
		    				  	//用来服务器记录log
//		    		    		$.AILog({
//		    		    			  "action": "新增",//动作
//		    		    			  "detail": "",//详情,默认为空
//		    		    			  "module": "sys_daq_plan"//二级菜单名称，如无二级菜单 使用一级菜单名称
//		    		    	    });
		    				  }
		    				  if(isUpdate=='1'){
		    					  $.AIPut(hostManage.returnAjaxOption($.ctx + "/api/sys/interfaceManagement/update",saveObj));
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
	    			  $("#tableCellInfo").addClass("hidden");//关闭第二屏
	    			  $("#J_tabs").removeClass("hidden");
					  $("#addMore,.J_addMore").removeClass("active");
					  $("#addOnce,.J_addOnce").addClass("active");
					  $('input[name=interfaceCode]').removeAttr('disabled');
					  // 清除文件
				  	  $("#fileExcel").attr('data-file','0');
					  $(".J_falseDlg").hide();
					  $(".file-tip").removeClass('red').text("");
					  var file = $("#fileExcel");  
					  file.after(file.clone().val(""));     
					  file.remove(); 
					  //接口分类 是否删除正式表 是否检验数据量 是否转码 -新增   
					  $('#interfaceClassify,#delTableFlag,#checkDataNumsFlag,#transcodeFlag').multiselect({
							nonSelectedText:"请选择",
							buttonWidth:264,
							nSelectedText:"个选择",
							includeSelectAllOption:false
					  }).multiselect('refresh');
					  // 初始新增隐藏checkDataNumsFlag,transcodeFlag,dateArgs
					  $('.J_erjingDiv').addClass('hidden');
					  $('#interfaceClassify').change(function(){
						  var thisVal = $(this).val();
						  if(thisVal=='2'){
							  $('.J_erjingDiv').removeClass('hidden');
						  }else{
							  $('.J_erjingDiv').addClass('hidden');
						  }
					  });
					  //接口类型-新增
					  model.loadInterfaceTypeList('#interfaceDateType','264','1');
	    			  //重要程度
					  model.loadRunSelectList('#priLevelDlg',$.priLevelObj,'264','1');//重要程度list
					  //接口来源
					  model.loadInterfaceSourceList('#interfaceSourceDlg','264','1');
					  //入库分类
					  model.loadEntryTypeList('#entryType','264','1');
					 //文件计划到达时间-新增
	    			  $("#filePlanArriveTime").datetimepicker({
	    				  changeMonth: true, //显示月份
	    			      changeYear: true, //显示年份
	    			      showButtonPanel: true, //显示按钮
	    			      defaultDate:new Date(),
	    			      timeFormat: "HH:mm",
	    			      dateFormat: "yy-mm-dd",
	    				  controlType:"select",
	    				  timeOnlyTitle:"选择时间",
	    				  timeText: '已选择',
	    				  hourText: '时',
	    				  minuteText: '分',
	    				  second_slider:false,
	    				  currentText:"当前时间",
	    				  closeText: '确定',
	    				  onClose: function (selectedDate) {
	    			          var ymdStr = DateFmt.Formate(new Date().getTime(),'yyyy-MM-dd');
	    					  var nowTime = ymdStr + " 00:00";
	    					  $(this).val(nowTime);
	    			       },
	    		      });
	    			  $.datepicker.dpDiv.addClass("ui-datepicker-box");
	    			 if(isUpdate&&isUpdate=='1'){
	    				  $("#J_tabs").addClass("hidden");
						  $("#addMore").removeClass("active");
						  $("#addOnce").addClass("active");
						  $('input[name=interfaceCode]').attr('disabled','disabled');
	    				  var interfaceCode = $(obj).attr('data-id');
	    				  hostManage.getHostManageById(interfaceCode);//修改信息回显
	    			 }
	    		  }
	    	});
	    };
	    /**
	     * 批量添加保存
	     */
	    model.addAppManageBatch = function(){
	      	var ajaxData ={"interfaceList" : model.interfaceList};
	      	$.AIPost({
	      		url: $.ctx + "/api/sys/interfaceManagement/insertList",
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
        return model;
})(window.hostManage || {});
