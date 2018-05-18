/**
 * ------------------------------------------------------------------
 * 采集周期方案 
 * ------------------------------------------------------------------
 */
var cyclePlan = (function (model){ 
		/**
		   * @description 加载下拉列表-月 日 季
		 */
	   model.loadRunSelectList = function(obj,data) {
	  	 var str = "";
	  	 for(var i in data){
	  		 str+='<option value="'+i+'">'+data[i]+'</option>'
	  	 }
	  	 $(obj).html(str);
	   };
	   /**
	    * @description 加载资源类别
	  */
	   model.loadResTypesList = function(obj,buttonWidth,isDlg) {
		   $.AIGet({
		   	   url:$.ctx + "/api/sys/selectSysResourceQuotaList",
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
				   		    menuStr+='<option value="'+data[i].resourceType+'">'+data[i].resourceName+'</option>'	
				   		}
				   		$(obj).html(menuStr);
				   		$(obj).multiselect({
				   			nonSelectedText:"资源类别",
				   			buttonWidth:buttonWidth,
				   			nSelectedText:"个选择",
				   			includeSelectAllOption:true,
				   			selectAllText: '全部',
				   		}).multiselect("rebuild");
			   	}
			  });
	    };
	    /**
		    * @description 加载资源类别 change 时加载不同的指标方案
		  */
	   model.loadQuotaTypeList = function(resourceType) {
		   if(!resourceType){
			    var menuStr = '<option value="">请选择</option>';
		   		$('#quotaType').html(menuStr);
		   		$('#quotaType').multiselect({
					nonSelectedText:"请选择",
					buttonWidth:291,
					nSelectedText:"个选择",
					includeSelectAllOption:true,
					selectAllText: '全部',
		   		}).multiselect('rebuild'); 
		   }else{
			   $.AIGet({
			   	   url:$.ctx + "/api/sys/selectQuotaName",
				   data:{"resourceType":resourceType},
				   async:false,
				   success:function(result) {
					   		var data = result.data;
					   	    var menuStr = '<option value="">请选择</option>';
					   		for(var i in data){
					   		    menuStr+='<option value="'+data[i].quotaType+'">'+data[i].quotaName+'</option>'	
					   		}
					   		$('#quotaType').html(menuStr);
					   		$('#quotaType').multiselect({
								nonSelectedText:"请选择",
								buttonWidth:291,
								nSelectedText:"个选择",
								includeSelectAllOption:true,
								selectAllText: '全部',
					   		}).multiselect('rebuild');
				   	}
				  });
		   }
	    };
	    /**
	      * @description 获取列表
	     */
        model.loadCyclePlanGrid = function(option) {
			$("#gridCyclePlan").AIGrid({        
				url:$.ctx + '/api/sys/selectTdDaqCyclePlans',
				datatype: "json",
				colNames:['周期方案', '生效时间', '失效时间','采集间隔','资源类别','指标方案','操作'],
			   	colModel:[
			   		{name:'planName',index:'plan_name', width:120, sortable:false},
			   		{name:'effTime',index:'eff_time', width:90,align:"center",formatter:DateFmt.dataDateFormateMinute, sortable:false},
			   		{name:'expTime',index:'exp_time', width:50,align:"center",formatter:DateFmt.dataDateFormateMinute, sortable:false},
			   		{name:'runTimeStr',index:'run_time_str', width:50, align:"center", sortable:false},
			   		{name:'resourceName',index:'resource_name', width:70, align:"center", sortable:false},		
			   		{name:'quotaName',index:'quota_name', width:50,align:"center", sortable:false},		
			   		{name:'op',index:'op', width:70, sortable:false,title:false,formatter:del,align:"center"}		
			   	],
			   	rowNum:10,
			   	rowList:[10,20,30],
			   	pager: '#pagerCyclePlan',
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
			//操作
			function del(cellvalue, options, rowObject){
				var html='<button type="button" class="btn btn-default  ui-table-btn ui-table-btn" data-planId="'+rowObject.planId+'" data-planName="'+rowObject.planName+'" onclick="cyclePlan.deletecyclePlanSingle(this);" title="删除">删除</button><button type="button" class="btn btn-default ui-table-btn" data-planId="'+rowObject.planId+'" data-planName="'+rowObject.planName+'" onclick="cyclePlan.insertOrUpdateApp(this,\'1\')" title="修改">修改</button>';
				return html;
			}
        };
        /**
	     * @description 刷新应用列表
	    */
        model.refreshGridCyclePlan = function(){
        	var ajaxData = {
    				"resTypes":$('#resTypes').val(),
    				"staNums":$('#staNums').val(),
    				"planName":$('#searchTxt').val(),
    		};
    		$("#gridCyclePlan").jqGrid('setGridParam',{ 
                postData:ajaxData,page:1

            },true).trigger("reloadGrid");
    	};
        /**
	     * @description 删除
	    */
        model.deletecyclePlanSingle = function(obj){
        	var planId = $(obj).attr('data-planId');
        	var planName = $(obj).attr('data-planName');
        	var msg = '确定删除周期方案『'+planName+'』?';//确认是否删除选中应用
        	var url = $.ctx + "/api/sys/delete";
			var ajaxData = {"planId":planId};
			cyclePlan.deletecyclePlan(url,ajaxData,msg);
			//用来服务器记录log
			var detail = "周期方案Id:"+planId+"&nbsp;&nbsp;&nbsp;&nbsp;周期方案名称:"+planName;
			$.AILog({
    			  "action": "删除",//动作
    			  "detail": detail,//详情,默认为空
    			  "module": "sys_daq_plan"//二级菜单名称，如无二级菜单 使用一级菜单名称
			});
        };
        /**
	     * @description 删除
	     * url-接口地址,ajaxData-传参,msg-提示信息
	    */
        model.deletecyclePlan = function(url,ajaxData,msg){
        	$("#cyclePlanDeleteDlg").confirm({
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
								   $("#cyclePlanDeleteDlg" ).dialog("close");
								   $("#cyclePlanDeleteDlg").confirm({
									   title:"提示",
									   content:"删除成功",
									   dialogType:"success",//状态类型：success 成功，failed 失败，或者错误，info提示
								   });
								   //刷新列表
								   cyclePlan.refreshGridCyclePlan();
							   }
						   },
						   error:function(){
							   $("#cyclePlanDeleteDlg").alert({
								   title:"提示",
								   content:"删除失败",
								   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
							   });
						   }
		   			  });
				},
   		   	})
        };
        /**
	     * @description 根据appId查询回显数据 修改时使用
	    */
        model.getCyclePlanById = function(id) {
	    	$.AIGet({
    			url:$.ctx + "/api/sys/getByPlanId",
    			datatype:"json",
    			data:{
    				"planId":id
    			},
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
    				$('input[name=planName]').val(data.planName);
    				$('input[name=effTime]').val(DateFmt.Formate(data.effTime,"yyyy-MM-dd HH:mm"));
    				$('input[name=expTime]').val(DateFmt.Formate(data.expTime,"yyyy-MM-dd HH:mm"));
    				//资源类别
    				$('#resourceType').val(data.resourceType).multiselect('refresh');
    				//采集指标方案
    				model.loadQuotaTypeList(data.resourceType);
    				$('#quotaType').val(data.quotaType).multiselect('refresh');
    				//周期
    				if(data.week){$('.J_week_type').val(data.week).multiselect('refresh');}
    				if(data.day){$('.J_month_type').val(data.day).multiselect('refresh');}
    				$('input[name=dateType][value='+data.dateType+']').prop('checked',true);
    				$('.J_hidden').addClass('hidden');
    				$('.J_'+data.dateType).removeClass('hidden');
    				if(data.dateType =='interval'){
	    				  $('#intervalHour').val(data.hour);
	    				  $('#intervalMin').val(data.min);
	    			 }else{
	    				  var mixTime = data.hour + ":" +data.min;
	    				  $('.J_'+data.dateType).find('.J_mixTime').val(mixTime);
	    			 }
   			  }
	    	});
        };
        /**
         * 校验名称唯一性
         * @param divId 所属标签id属性用于直接获取
         */
        model.validateName = function(divId){
        	var validateTxt = $("#"+divId).val();
        	var planId = $('#cyclePlanAddDlg').attr('planId');
        		planId = planId ? planId : "";
        	var jsonParams = {"planName" : validateTxt,"planId":planId};
        	$.AIGet({
        		url : $.ctx + "/api/sys/getByPlanName",
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
	    /**
	     * 新建或修改用户组 保存前的验证
	     * @param isUpdate=1时修改 0时新建
	     */
	    model.beforeSaveCheck = function(data){
	    	var checkObj = [];
			checkObj[1]=true;
		    switch (true){
	            case !data.planName: 
	            	checkObj[0] ='请输入方案名称';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case data.nameValidate=='1': 
	            	checkObj[0] ='该方案名称已存在';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.effTime: 
	            	checkObj[0] ='请选择生效时间';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.expTime: 
	            	checkObj[0] ='请选择失效时间';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.resourceType || data.resourceType=='请选择': 
	            	checkObj[0] ='请选择资源类别';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case !data.quotaType: 
	            	checkObj[0] ='请选择指标采集方案';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case data.dateType == 'interval' && !data.min && !data.hour:
	            	checkObj[0] ='周期选择时间间隔时 请至少填写【分钟间隔】或【小时间隔中】的其中一个';
	    			checkObj[1] =false;
	    			return checkObj;
	    			break;
	            case data.dateType != 'interval' && !data.min && !data.hour:
	            	checkObj[0] ='请选择时分';
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
	    				   $( "#cyclePlanAddDlg" ).dialog("close");
	    				   $("#SMStelDlg").alert({
	    					   title:"提示",
	    					   content:"保存成功",
	    					   dialogType:"success"
	    				   });
	    				   //刷新左侧树和右侧用列表
	    				   cyclePlan.refreshGridCyclePlan();
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
	    			   //$( "#cyclePlanAddDlg" ).dialog( "close" );
	    			   $("#SMStelDlg").alert({
	    				   title:"提示",
	    				   content:"保存失败",
	    				   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
	    			   });
	    		   }
	    	}
	    };
	    /**
	     * 新建弹窗中周期选择
	     */
	    model.dateTypeClick = function(){
	    	//点选默认时 清空指定时间框
	    	$('#dateTypeLabels input[name=dateType]').click(function(){
	    		var curDateType = $(this).val();
	    		$('input[name=dateType]').removeAttr('checked');
	   			$(this).prop('checked',true);
	   			$('.J_hidden').addClass('hidden');
	   			$('.J_'+curDateType).removeClass('hidden');
	    	})
	    };
	    /**
	     * 新建或修改
	     * @param isUpdate=1时修改 0时新建
	     */
	    model.insertOrUpdateApp = function(obj,isUpdate){
	    	$("#cyclePlanAddDlg").aiDialog({
	    		  width:640,
	    		  height:"auto",
	    		  title:"新增/修改采集周期方案",
	    		  callback:function(){
	    			  var planId = isUpdate =='1' ? $(obj).attr('data-planId') : "";
	    			  var saveObj = formFmt.formToObj($("#formSaveCyclePlan"));
	    			  saveObj.planId = planId;
	    			  var hour = '',min = '';//时 分
	    			  if(saveObj.dateType =='interval'){
	    				  hour = $('#intervalHour').val();
	    				  min = $('#intervalMin').val();
	    			  }else{
	    				  var mixTime = $('.J_'+saveObj.dateType).find('.J_mixTime').val();
	    				  hour = mixTime ? mixTime.split(":")[0] : "";
	    				  min = mixTime ? mixTime.split(":")[1] : "";
	    			  }
	    			  saveObj.hour = hour;
	    			  saveObj.min = min;
	    			  // nameValidate 1-//方案名称已存在 0-可用
	    			  if($('#popoverTipGroupName .J_message').hasClass('has-error')){
	    				  saveObj.nameValidate = '1';
	    	   		  }else{
	    	   			  saveObj.nameValidate = '0';
	    	   		  }
	    			  var checkObj = cyclePlan.beforeSaveCheck(saveObj);
	    			  if(!checkObj[1]){//非空验证
	    				  $("#SMStelDlg").alert({
	    					   title:"提示",
	    					   content:checkObj[0],
	    					   dialogType:"failed"
	    				   });
	    			  }
	    			  if(checkObj[1]){
	    				  if(isUpdate=="0"){
	    				  	$.AIPost(cyclePlan.returnAjaxOption($.ctx + "/api/sys/insert",saveObj));
	    				  	//用来服务器记录log
	    		    		$.AILog({
	    		    			  "action": "新增",//动作
	    		    			  "detail": "",//详情,默认为空
	    		    			  "module": "sys_daq_plan"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    		    	    });
	    				  }
	    				  if(isUpdate=='1'){
	    					  $.AIPut(cyclePlan.returnAjaxOption($.ctx + "/api/sys/update",saveObj));
	    					  //用来服务器记录log
	    					  var detail = "周期方案Id:"+planId+"&nbsp;&nbsp;&nbsp;&nbsp;周期方案名称:"+$(obj).attr('data-planName');
		    		    	  $.AILog({
		    		    			  "action": "修改",//动作
		    		    			  "detail": detail,//详情,默认为空
		    		    			  "module": "sys_daq_plan"//二级菜单名称，如无二级菜单 使用一级菜单名称
		    		    	  });
	    				  }
	    			  }
	    		  },
	    		  open:function(){
	    			  var planId = isUpdate =='1' ? $(obj).attr('data-planId') : "";
	    			  $('#cyclePlanAddDlg').attr('planId',planId);
	    			  $('#resourceType,#quotaType').removeAttr('disabled');
    				  $('#resourceType').next('.btn-group').find('button').removeClass('disabled');
    				  $('#quotaType').next('.btn-group').find('button').removeClass('disabled');
	    			  $("#popoverTipGroupName .has-error span,.J_message span").text('');
	    			  //生效时间 失效时间
	    			  $( "#effTime").datetimepicker({
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
	    					  $("#expTime").datepicker("option", "minDate", selectedDate);
	    			          var effTime = new Date($("#effTime").val()).getTime();//生效时间
	    			          var expTime = new Date($("#expTime").val()).getTime();//失效时间
	    			          if(expTime-effTime<0){
	    			        	  $("#SMStelDlg").alert({
	   	    					   title:"提示",
	   	    					   content:"生效时间应小于失效时间,请重新选择！",
	   	    					   dialogType:"failed"
	   	    				   });
	    			           $(this).val('');
	    			          }
	    			          var ymdStr = DateFmt.Formate(new Date().getTime(),'yyyy-MM-dd');
	    					  var nowTime = ymdStr + " 00:00";
	    					  if(!selectedDate){
	    						  $(this).val(nowTime);
	    						  $("#expTime").val($("#expTime").val())
	    					  }
	    			       }
	    		      });
	    			  $( "#expTime").datetimepicker({
	    				  changeMonth: true, //显示月份
	    			      changeYear: true, //显示年份
	    			      showButtonPanel: true, //显示按钮
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
	    			          $("#effTime").datepicker("option", "maxDate", selectedDate);
	    			          var effTime = new Date($("#effTime").val()).getTime();//生效时间
	    			          var expTime = new Date($("#expTime").val()).getTime();//失效时间
	    			          if(expTime-effTime<0){
	    			        	  $("#SMStelDlg").alert({
	   	    					   title:"提示",
	   	    					   content:"失效时间应大于生效时间,请重新选择！",
	   	    					   dialogType:"failed"
	   	    				   });
	    			           $(this).val('');
	    			          }
	    			          var ymdStr = DateFmt.Formate(new Date().getTime(),'yyyy-MM-dd');
	    					  var nowTime = ymdStr + " 00:00";
	    					  if(!selectedDate){
	    						  $(this).val(nowTime);
	    						  $("#effTime").val($("#effTime").val())
	    					  }
	    			        }
	    		      });
	    			  $.datepicker.dpDiv.addClass("ui-datepicker-box");
	    			  cyclePlan.loadResTypesList('#resourceType','291','1');//资源类别下拉
	    			  model.loadQuotaTypeList();
	    			  $('#resourceType').change(function(){
	    					 var resourceType = $(this).val();
	    					 model.loadQuotaTypeList(resourceType);
	    			  });
	    			  //周期默认选择 时间间隔
	    			 $('input[name=dateType]').removeAttr('checked');
	    			 $('input[name=dateType][value="interval"]').prop('checked',true);
	    			 $('.J_hidden').addClass('hidden');
	    			 $('.J_interval').removeClass('hidden');
	    			 cyclePlan.loadRunSelectList('.J_week_type',$.weekObjCyclePlan);//每周list
		    	     cyclePlan.loadRunSelectList('.J_month_type',$.monthObj);//每月list
		    	     $('.J_week_type,.J_month_type').multiselect({buttonWidth:80});
		    	     model.dateTypeClick();//周期选择联动
		    	     //时分
	    			 $( ".J_mixTime").timepicker({
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
	    			 if(isUpdate&&isUpdate=='1'){
	    				  $('#resourceType,#quotaType').attr('disabled','disabled');
	    				  $('#resourceType').next('.btn-group').find('button').addClass('disabled');
	    				  $('#quotaType').next('.btn-group').find('button').addClass('disabled');
	    				  var planId = $(obj).attr('data-planId');
	    				  cyclePlan.getCyclePlanById(planId);//修改信息回显
	    			 }
	    		  }
	    	});
	    };
	    /**
	     * 输入1-num之间的数字
	    	正则表达式要求只能输入1-23的整数/^([1-9]|1\d|2[0-3])$/
	   		正则表达式要求只能输入1-59的整数/^([1-9]|[1-4]\d|5[0-9])$/
	   */
	    model.numReg = function(num,reg){
	    	 if(!num.match(reg)){  
	    	  return false;  
	    	 }else{  
	    	  return true;  
	    	 }  
	    }
        return model;
})(window.cyclePlan || {});
 

