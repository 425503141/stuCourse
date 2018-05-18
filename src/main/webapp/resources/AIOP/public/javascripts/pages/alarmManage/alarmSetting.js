/**
 * ------------------------------------------------------------------
 * 告警管理-告警设置
 * ------------------------------------------------------------------
 */
var hostManage = (function (model){ 
		model.userId = $('#commonUserId').val();
	   /**
		    * @description 资源类型下拉列表
		*/
	   model.loadResourceTypeList = function(obj,buttonWidth){
		   $.AIGet({
		   	   url:$.ctx + "/api/alarm/common/queryAlarmResourceList",
			   data:{},
			   success:function(result) {
				   		var data = result.data;
				   	    var menuStr = '';
				   		for(var i in data){
				   		    menuStr+='<option value="'+data[i].deviceType+'">'+data[i].deviceTypeName+'</option>'	
				   		}
				   		$(obj).html(menuStr).val('');
				   		$(obj).multiselect({
				   			nonSelectedText:"资源类型",
				   			buttonWidth:buttonWidth,
				   			nSelectedText:"个选择",
				   			includeSelectAllOption:true,
				   			selectAllText: '全部',
				   		});
			   	}
			  });
	    };
	    /**
		    * @description 告警类型下拉列表
		*/
	   model.loadAlarmTypeList = function(obj,buttonWidth,deviceType){
		   if(!deviceType){
		   	    var menuStr = '';
		   		$(obj).html(menuStr).val('');
		   		$(obj).multiselect({
		   			nonSelectedText:"告警类型",
		   			buttonWidth:buttonWidth,
		   			nSelectedText:"个选择",
		   			includeSelectAllOption:true,
		   			selectAllText: '全部',
		   		}).multiselect('rebuild');
		   }else{
			   $.AIGet({
			   	   url:$.ctx + "/api/alarm/common/queryAlarmIndexList",
				   data:{"deviceType":deviceType},
				   success:function(result) {
					   		var data = result.data;
					   	    var menuStr = '';
					   		for(var i in data){
					   		    menuStr+='<option value="'+data[i].alarmIndexId+'">'+data[i].alarmIndexName+'</option>'	
					   		}
					   		$(obj).html(menuStr).val('');
					   		$(obj).multiselect({
					   			nonSelectedText:"告警类型",
					   			buttonWidth:buttonWidth,
					   			nSelectedText:"个选择",
					   			includeSelectAllOption:true,
					   			selectAllText: '全部',
					   		}).multiselect('rebuild');
				   	}
				  });
		   }
	    };
	    /**
		    * @description 登录协议类型下拉列表
		  */
	   model.loadLoginProtocolList = function(obj,buttonWidth){
		   $.AIGet({
		   	   url:$.ctx + "/api/sys/serverManagement/selectSysLoginProtocol",
			   data:{},
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
				   		});
			   	}
			  });
	    };
	    /**
	      * @description 获取列表
	     */
        model.loadHostManageGrid = function(option) {
			$("#gridHostManage").AIGrid({        
				url:$.ctx + '/api/alarm/getAlarmConfigList',
				datatype: "json",
				colNames:["id",'资源类型', '告警类型', '状态','告警描述','更新时间','操作'],
			   	colModel:[
			   	    {name:'serverId',index:"",hidden:true},
			   		{name:'deviceTypeName',index:'device_type_name', width:80,align:"center"},
			   		{name:'alarmIndexName',index:'alarm_index_name', width:80,align:"center"},
			   		{name:'ison',index:'ison', width:50,align:"center",formatter:setIsOn,},
			   		{name:'alarmDescription',index:'alarm_description',sortable:false,width:150, align:"center",formatter:$.setNull},
			   		{name:'updateTime',index:'update_time',width:80, align:"center",formatter:DateFmt.dataDateFormateMinute},
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
				//showNoResult:true
			}); 
			//状态
			function setIsOn(cellvalue, options, rowObject){
				var html='';
				if(cellvalue=='ON' || cellvalue=='on'){
					html='<span class="green">启用</span>'
				}
				if(cellvalue=='OFF' || cellvalue=='off'){
					html='<span>暂停</span>'
				}
				return html;
			}
			//操作
			function del(cellvalue, options, rowObject){
				var rowObjectStr = JSON.stringify(rowObject);
				var hiddenClass1 = rowObject.ison=='ON' ? 'hidden' :'';
				var hiddenClass2 = rowObject.ison=='OFF' ? 'hidden' :'';
				var html='<button type="button" class="btn btn-default  ui-table-btn ui-table-btn" onclick=\'hostManage.deleteHostManageSingle('+rowObjectStr+')\' title="删除">删除</button><button type="button" class="btn btn-default ui-table-btn" data-id="'+rowObject.configId+'" data-obj='+rowObjectStr+' onclick="hostManage.insertOrUpdateHostAlarm(this,\'1\')" title="修改">修改</button><button type="button" class="btn btn-default ui-table-btn '+hiddenClass1+'" onclick=\'hostManage.startOrStop('+rowObjectStr+')\' title="启用">启用</button><button type="button" class="btn btn-default ui-table-btn '+hiddenClass2+'" onclick=\'hostManage.startOrStop('+rowObjectStr+')\'  title="暂停">暂停</button>';
				return html;
			}
        };
        /**
	     * @description 刷新列表
	    */
        model.refreshGridHostManage = function(){
        	var ajaxData = {
    				"deviceType":$('#resourceType').val(),
    				"alarmIndexId":$('#alarmType').val()
    		};
    		$("#gridHostManage").jqGrid('setGridParam',{ 
                postData:ajaxData
            },true).trigger("reloadGrid");
    	};
	    /**
	     * @description 删除应用
	    */
        model.deleteHostManageSingle = function(rowObject){
        	var msg = '确认是否删除该告警设置?';
        	var url = $.ctx + "/api/alarm/delete";
			var ajaxData = {"configId":rowObject.configId,"isdelete":"1"};
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
	     * @description 删除
	     * url-接口地址,ajaxData-传参,msg-提示信息
	    */
        model.deleteHostManage = function(url,ajaxData,msg,ids){
        	$("#hostManageDeleteDlg").confirm({
   			 	height:"auto",
	   			title:"提示",
	   			content:msg,
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
								   $("#hostManageDeleteDlg").deleteSuc({
									   title:"提示",
									   content:"删除成功",
									   dialogType:"success"
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
								   dialogType:"failed"
							   });
						   }
		   			  });
				},
   		   	})
        };
        /**
	     * @description 启用或暂停
	     * rowObject-本条信息的参数,url-请求接口的地址
	    */
        model.startOrStop = function(rowObject){
        	var ajaxData = {"configId":rowObject.configId,"ison":rowObject.ison};
        	$.AIPost({
				   url: $.ctx+'/api/alarm/isOnOff',
				   data: ajaxData,
				   async:true,
				   dataType:"json",
				   type:"POST",
				   success: function(data){
					   if(data.status == 200){
						   $("#hostManageDeleteDlg").alert({
							   title:"提示",
							   content:'操作成功',
							   dialogType:"success"
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
			  });
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
	    				   $( "#hostAlarmAddDlg" ).dialog( "close" );
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
	     * 新增告警时对主机的告警类型需要判断唯一性
	     */
	    model.isExist = function(configId){
	    	 var isExist = '0';
	    	 $.AIPost({
			   	   	url:$.ctx + "/api/alarm/queryExistsByConfigId",
			   	   	data:{"configId":configId},
			   	   	async:false,
			   	   	success:function(result) {
			   	   		if(result.status == '201'){
			   	   		   isExist = '1';
			   	   		}
			   	   		if(result.status == '200'){
			   	   		   isExist = '0';
			   	   		}
				   	}
			   });
	    	 return isExist;
	    };
	    /**
	     * 新建或修改-主机告警 保存前的验证
	     * @param isUpdate=1时修改 0时新建
	     */
	    model.beforeSaveCheckHostAlarm = function(data){
	    	var data = data.configJson;
	    	var checkObj = [];
			checkObj[1]=true;
		    switch (true){
	            case data.critical=='N' && data.warn=='N': 
	            	checkObj[0] ='严重告警阀值和警告告警阀值必须设置其中一项,也可同时设置两项';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case data.critical && data.warn && parseInt(data.thresholdCrit)<=parseInt(data.thresholdWarn): 
	            	checkObj[0] ='严重告警的阀值应大于警告告警的阀值';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case data.timesContCbx=='1' && !data.timesCont: 
	            	checkObj[0] ='请填写连续告警次数选项的告警次数';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case data.timesAccuCbx=='1' && !data.periodAccu: 
	            	checkObj[0] ='请填写累计告警数选项的累计时间段';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case data.timesAccuCbx=='1' && !data.timesAccu: 
	            	checkObj[0] ='请填写累计告警数选项的告警次数';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case data.timesContCbx=='0' && data.timesAccuCbx=='0': 
	            	checkObj[0] ='请至少勾选并设置其中一种告警策略,也可同时设置两项';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	    				
	            default:
	            	return checkObj;
		      }
	    }
        /**
	     * @description 新增===主机告警
	     * @param isUpdate=1时修改 0时新建
	    */
	    model.insertOrUpdateHostAlarm = function(obj,isUpdate){
	    	var url = $.ctx+'/api/alarm/saveOrUpdateAlarmConfig';
	    	$("#hostAlarmAddDlg").aiDialog({
	    		  width:640,
	    		  height:"auto",
	    		  title:"新增/修改主机告警",
	    		  callback:function(){
	    			  var configId  = isUpdate =='1' ? $(obj).attr('data-id') : "";
	    			  var alarmIndexId = $('#alarmIndexIdDiv input[name="alarmIndexId"]:checked').val();
	    			  var thresholdCrit = $.trim($('#thresholdCrit').val());//严重告警阈值
	    			  var thresholdWarn = $.trim($('#thresholdWarn').val());//警告告警阈值
	    			  var timesCont = $.trim($('#timesCont').val());//连续告警策略-告警次数
	    			  var timesContCbx = $('#timesContCbx').is(':checked') ? "1" : "0";//连续告警策略 1 复选框被勾选 0-未勾选
	    			  var timesAccu = $.trim($('#timesAccu').val());//累计告警策略-告警次数
	    			  var timesAccuCbx = $('#timesAccuCbx').is(':checked') ? "1" : "0";//累计告警策略 1 复选框被勾选 0-未勾选
	    			  var periodAccu = $.trim($('#periodAccu').val()) + $('.J_timeSelect option:selected').html();//累计告警-累计时间段
	    			  var saveObj = {};
	    			  saveObj = {
			    				  "alarmIndexId": alarmIndexId,
			    				  "configId": configId,
			    				  "configJson":{ 
							    					"critical":thresholdCrit ? "Y" : "N",
							    					"thresholdCrit":thresholdCrit,
							    					"descCrit":$('#descCrit').val(),
							    					"warn":thresholdWarn ? "Y" : "N",
							    					"thresholdWarn":thresholdWarn,
							    					"descWarn":$('#descWarn').val(),
							    					"strategyCont":timesCont ? "Y" : "N",
							    					"timesCont":timesCont,
							    					"timesContCbx":timesContCbx,
							    					"strategyAccu":timesAccu ? "Y" : "N",
							    					"periodAccu":periodAccu,
							    					"timesAccu":timesAccu,
							    					"timesAccuCbx":timesAccuCbx
			    				  				},
			    				"createUser": model.userId,
			    				"deviceType": "S",//主机告警为S
			    				"updateUser": model.userId
	    			  };
	    			  if(!configId){//新建时传值 修改时不传值
	    				  saveObj.isdelete="0";
	    				  saveObj.ison="OFF";
	    				  //新增告警时对主机的告警类型需要判断唯一性
		    			  var validateId = "S" + alarmIndexId;//deviceType+alarmIndexId
	    				  var isExist = model.isExist(validateId);
	    				  if(isExist=='1'){
	    					  $("#SMStelDlg").alert({
		    					   title:"提示",
		    					   content:'该告警类型已存在,请选择其他告警类型',
		    					   dialogType:"failed"
		    				   });
	    					  return;
	    				  }
	    			  }
	    			  var checkObj = hostManage.beforeSaveCheckHostAlarm(saveObj);
		  				if(!checkObj[1]){//非空验证
		    				  $("#SMStelDlg").alert({
		    					   title:"提示",
		    					   content:checkObj[0],
		    					   dialogType:"failed"
		    				   });
		    			  }
		    			  if(checkObj[1]){
		    				  	$.AIPost(hostManage.returnAjaxOption(url,saveObj));
		    				  	if(isUpdate=="0"){
			    				  	//用来服务器记录log
	//		    		    		$.AILog({
	//		    		    			  "action": "新增",//动作
	//		    		    			  "detail": "",//详情,默认为空
	//		    		    			  "module": "sys_daq_plan"//二级菜单名称，如无二级菜单 使用一级菜单名称
	//		    		    	    });
		    				   }
		    				  if(isUpdate=='1'){
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
	    			 //加载告警类型-单选列表-默认选择CPU使用率
	    			 model.loadAlarmTypeDlg('#alarmIndexIdDiv','1');
	    			 $('input[name=alarmIndexId]').removeAttr('disabled');
	    			 $('.J_timeSelect').multiselect({
				   			nonSelectedText:"时间",
				   			buttonWidth:'60',
				   			nSelectedText:"个选择",
				   			includeSelectAllOption:true,
				   			selectAllText: '全部',
				   	 }).multiselect('refresh');
	    			 if(isUpdate&&isUpdate=='1'){
	    				  //修改时 告警类型不可修改
	    				  $('input[name=alarmIndexId]').attr('disabled','disabled');
	    				  var rowObject = $(obj).attr('data-obj');
	    				  	  rowObject = JSON.parse(rowObject);
	    				  hostManage.getHostManageById(rowObject);//修改信息回显
	    			 }
	    		  }
	    	});
	    };
	    /**
	     * @description 根据查询回显数据 修改时使用
	    */
        model.getHostManageById = function(rowObject) {
        	var configJson = rowObject.configJson;
        	$('#thresholdCrit').val(configJson.thresholdCrit);
        	$('#descCrit').val(configJson.descCrit);
        	$('#thresholdWarn').val(configJson.thresholdWarn);
        	$('#descWarn').val(configJson.descWarn);
        	if(configJson.strategyCont=='Y'){
        		$('#timesContCbx').prop('checked',true);
        		$('#timesCont').val(configJson.timesCont);
        	}
        	if(configJson.strategyAccu=='Y'){
        		$('#timesAccuCbx').prop('checked',true);
        		var periodAccu = '';
        		var periodAccuVal = '';
        		if(configJson.periodAccu && configJson.periodAccu.indexOf("分钟") > -1){
        			periodAccu = configJson.periodAccu.replace('分钟','');
        			periodAccuVal = 'minute';
        		}
        		if(configJson.periodAccu && configJson.periodAccu.indexOf("小时") > -1){
        			periodAccu = configJson.periodAccu.replace('小时','');
        			periodAccuVal = 'hour';
        		}
        		$('.J_timeSelect').val(periodAccuVal).multiselect('refresh');
        		$('#periodAccu').val(periodAccu);
        		$('#timesAccu').val(configJson.timesAccu);
        	}
			$('input[name=alarmIndexId][value='+rowObject.alarmIndexId+']').prop('checked',true);
        };
	    /**
	     * @description 新增===主机告警==资源类型为主机时查询出告警类型
	     * hide005=='1' 新增主机告警对话框的“告警类型”项去掉“主机连通性”选项
	    */
	    model.loadAlarmTypeDlg = function(obj,hide005){
	    	$.AIGet({
		   	   	url:$.ctx + "/api/alarm/common/queryAlarmIndexList",
		   	   	async:false,
		   	   	data:{"deviceType":'S'},//资源类型为主机时查询出告警类型
		   	   	success:function(result) {
				   		var data = result.data;
				   	    var str = '';
				   		for(var i in data){
				   		    str+='<label class="radio-inline"><input type="radio" name="alarmIndexId" value="'+data[i].alarmIndexId+'" title="'+data[i].alarmIndexName+'">'+data[i].alarmIndexName+'</label>'
				   		}
				   		$(obj).html(str);
				   		$('input[name=alarmIndexId]').removeAttr('checked');
		    			$('input[name=alarmIndexId][value="001"]').prop('checked',true);
		    			if(hide005 && hide005 == '1'){
		    				$('input[name=alarmIndexId][value="005"]').parent().hide();
		    			}
			   	}
			 });
	    	 //告警设置新增对话框每次点击告警类型时，告警设置项都应该刷新
	    	 $('#alarmIndexIdDiv input[name="alarmIndexId"]').click(function(){
	    		  $('#formSaveHostAlarm').find('input[type="text"],textarea').val('');
	    		  $('#formSaveHostAlarm').find('input[type="checkbox"]:checked').prop('checked',false);
	    		  $('#formSaveHostAlarm').find('select.multiselect ').val('').multiselect('refresh');
	    	 });
	    };
        return model;
})(window.hostManage || {});
