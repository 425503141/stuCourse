/**
 * ------------------------------------------------------------------
 * 告警管理-实时告警-短信弹窗
 * ------------------------------------------------------------------
 */
var sendSMSAlarm = (function (model){
        /**
         * @description 发短信弹框列表
         * @param  option
         * @return  
         * ------------------------------------------------------------------
         */
        model.ztreeObj =  new Ztree();
        model.phoneNumArr = [];
        model.loadSMSUserList = function(option) { 
         	$.AIGet({
	    			url:$.ctx + "/api/appMonitor/realTime/userGroups",
	    			datatype:"json",
	    			success:function(result){
	    				sendSMSAlarm.ztreeObj.init({
		    		    		id:"deptListType",
		    		    		setting:{
		    		    			view: {
		    		    				selectedMulti: false,
		    		    				showIcon: false
		    		    			},
		    		    			check: {
		    		    				enable: true,
		    		    				chkStyle: "checkbox"
		    		    			},
		    		    			callback: {
		    		    				onCheck: function(event, treeId, treeNode){
		    		    					var groupId =sendSMSAlarm.ztreeObj.getSelectedIdArray();
		    		    					$("#smsUserList").jqGrid('setGridParam',{ 
		    		        					postData:{"searchText":$("#searchSMSUserList").val(),"groupId":groupId}
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
	    				sendSMSAlarm.loadUserList();
	    			}
	     	});
        };
        model.showSMSDlg = function(option) { 
        		var defaults ={
        				ajaxUrl:"",
        				rowObj:{},
        				ajaxData:{}
        		}
        		option = $.extend(defaults,option);
        		$("#tableCellInfo,#appTableInfoPanel").addClass("hidden");
    		    var obj = option.rowObj;
	    		var appId = obj.id;
	    		$("#sensSMSDlg").aiDialog({
		   		  width:570,
		   		  height:"auto",
		   		  title:"发送短信",
		   		  callback:function(){
		   			  //TODO
		   			var SMSFormInput = formFmt.formToObj($("#SMSForm"));
		   			var  smsplanDate = $("#SMSplanDate").val() ;
		   			var  smsplanTime = $("#SMSplanTime").val() ;
		   			SMSFormInput.expectRecoveryTime= $("#SMSplanDate").val() +" " + $("#SMSplanTime").val();
		   			var tel = SMSFormInput.tel;
		   			tel = tel.length> 0 ? tel.substring(0,tel.length-1).split(","):[];
		   			SMSFormInput.tel = tel;
		   			if(SMSFormInput.tel.length == 0){
			   			 $("#SMStelDlg").alert({
							   title:"提示",
							   content:"请输入手机号码！",
							   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
						   });
		   				return;
		   			}else if(smsplanDate.length== 0 || (smsplanDate.length== 0 && smsplanTime.length ==0)){
			   			 $("#SMSDateDlg").alert({
							   title:"提示",
							   content:"请输入日期",
							   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
						   });
		   				return;
		   			}
		   			var ajaxData = $.extend(SMSFormInput,option.ajaxData);
		   			  $.AIPost({
		   				   url: option.ajaxUrl,
						   data: ajaxData,
						   async:true,
						   dataType:"json",
						   type:"POST",
						   success: function(data){
							   if(data.status == 200){
								   $( "#sensSMSDlg" ).dialog( "close" );
								   $("#SMSAlertDlg").alert({
									   title:"发送短信提示",
									   content:"发送成功",
									   dialogType:"success",//状态类型：success 成功，failed 失败，或者错误，info提示
								   });
							   }
						   } 
		   			  });
		   		  } ,
		   		  open:function(){
		   			var rowObj = option.rowObj;
		   			$(".ui-user-sms-list").addClass("hidden");
		   			$(".ui-tel-box >a").remove();
		   			$("#SMStelNum").val("");
		   			$("#alarmInstance").val(rowObj.alarmObject+'  ( '+rowObj.alarmInstance+' )');
		   			$("#alarmIndexName").val(rowObj.alarmIndexName);
		   			$("#alarmLevelName").val(rowObj.alarmLevelName).css('color',rowObj.alarmLevelColor);
		   			var alarmDescription = rowObj.alarmDescription ? rowObj.alarmDescription : '-';
		   			$("#alarmDescription").val(alarmDescription).attr('title',alarmDescription);
		   			//预计恢复时间
		   			$("#SMSplanDate" ).datepicker({
		   			      changeMonth: true,
		   			      dateFormat: "yy-mm-dd" 
		   		    });
	   			    $( "#SMSplanTime" ).timepicker({
	   				  timeFormat: "HH:mm:ss",
	   				  controlType:"select",
	   				  timeOnlyTitle:"选择时分秒",
	   				  timeText: '已选择',
	   				  hourText: '时',
	   				  minuteText: '分',
	   				  secondText: '秒',
	   				  currentText:"当前时间",
	   				  closeText: '确定',
	   				  onClose:function(time){
	   					  var time = time ? time : "00:00:00";
	   					  $(this).val(time);
	   				  }
	   		       });
	   			   $.datepicker.dpDiv.addClass("ui-datepicker-box");
		   		  }
		   	});
	    		$("#showSMSUserList").off("click").on("click",function(){
	    			$(".ui-user-sms-list").removeClass("hidden");
	    			sendSMSAlarm.loadSMSUserList();
	    		});
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
	    				$(html).on("click","> i",function(){
	    					$(this).parent().remove();
	    					$("#inputPhoneNum").focus();
	    					var telNum = $(this).prev().text();
	    					var SMSTelNum = $("#SMStelNum").val();
	    					var telarr = SMSTelNum.split(",")
						SMSTelNum = SMSTelNum.replace(telNum+",","");
						$("#SMStelNum").val(SMSTelNum);
	    				});
	    			}
	    		});
        };
        model.loadUserList = function(option) { 
        	var groupId =sendSMSAlarm.ztreeObj.getSelectedIdArray();
        		$("#searchSMSUserList").keyup(function(e){
        			var groupId =sendSMSAlarm.ztreeObj.getSelectedIdArray();
        			e = e || window.event;
        			var input = $(this).val();
        			if(e.keyCode == 13){
        				$("#smsUserList").jqGrid('setGridParam',{ 
        					postData:{searchText:input,groupId:groupId}
        				}).trigger("reloadGrid");
        			}
        		});
	        	$("#smsUserList").AIGrid({        
	        	   	url:$.ctx + '/api/appMonitor/realTime/userphones',
	        		datatype: "json",
	        		postData:{groupId:groupId},
	        	   	colNames:['用户名','电话号码'],
	        	   	colModel:[
	        	   		{name:'userName',index:'user_name', width:90,align:"center"},
	        	   		{name:'userTel',index:'user_tel', width:120,align:"center"}
	        	   	],
	        	   	rowNum:5,
	        	   	rowList:[5,15,30],
	        	   	pager: '#smsUserPager',
	        	   	sortname: 'app_name',
	        	    viewrecords: true,
	        		rownumbers:false,
	        	    sortorder: "desc",
	        		jsonReader: {
	        			repeatitems : false,
	        			id: "0"
	        		},
	        		height: 200,
	        		afterGridLoad:function(){
	        			var SMSTelNum = $("#SMStelNum").val();
	    				var telarr = SMSTelNum.split(",")
	    	        		for(var i = 0,len = telarr.length;i<len;i++){
	    	        			var $td = $("td[title='"+telarr[i]+"']");
	    	        			if($td.length>0 && $.trim(telarr[i]).length>0){
	    	        				$("#smsUserList").setSelection($td.parent().attr("id"));
	    	        			}
	    	        		}
	        		},
	        		onSelectAll:function(aRowids, status){
	        			var ids = aRowids||[];
	        			sendSMSAlarm.setSelectedRow(ids);
	        		},
	        		onSelectRow:function(rowid, status, e){
		    			if(status){
		    				var ids = $("#smsUserList").jqGrid('getGridParam','selarrrow')?$("#smsUserList").jqGrid('getGridParam','selarrrow'):[];
		    				sendSMSAlarm.setSelectedRow(ids);
		    			}else{
	    					var rowObj = $("#smsUserList").jqGrid('getRowData',rowid);
	    					var userTel = rowObj.userTel;
    						var SMSTelNum = $("#SMStelNum").val();
						SMSTelNum = SMSTelNum.replace(userTel+",","");
	    					$("#SMStelNum").val(SMSTelNum);
	    				}
	        		}
	        	});
	        	$("#searchSMSUserListBtn").off("click").on("click",function(){
	        		var groupId =sendSMSAlarm.ztreeObj.getSelectedIdArray();
        			var input = $("#searchSMSUserList").val();
    				$("#smsUserList").jqGrid('setGridParam',{ 
    					postData:{searchText:input,groupId:groupId}
    				}).trigger("reloadGrid");
	        	});
        };
        model.setSelectedRow = function(ids) { 
        		var SMStelNum=$("#SMStelNum").val();
			for(var i=0,len=ids.length;i<len;i++){
				 var rowObj = $("#smsUserList").jqGrid('getRowData',ids[i]);
				 var phoneNum = rowObj.userTel;
				 if($.trim(phoneNum).length>0){
					 if($.inArray(phoneNum,SMStelNum.split(",")) == -1){
						 SMStelNum = phoneNum+","+SMStelNum;
					 }
				 }
			}
			$("#SMStelNum").val(SMStelNum);
        };
        return model;

   })(window.sendSMSAlarm || {});