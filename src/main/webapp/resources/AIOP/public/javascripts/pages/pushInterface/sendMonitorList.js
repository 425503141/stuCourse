/**
 * ------------------------------------------------------------------
 * 应用监控-实时监控
 * ------------------------------------------------------------------
 */
var yijingMonitor = (function (model){
        //开发版本号
        model.version = "1.0.0";
        model.author  = "wangsen3";
        model.email   = "wangsen3@asiainfo.com";

        //获取下钻字段
        var getDefaultParams = function(){
			var url = window.location.href,
				reg = /\?/,
				index = url.match(reg) && url.match(reg).index;
			if(!index) return '';
			var res = {},
				pStr = url.slice(++index),
				params = pStr.split('&');
			
			params.forEach(function(item){
				var paramArr = item.split('='),
					key = paramArr[0],
					value = paramArr[1];
				res[key] = key === 'statDate' ? value : value;
			});
			return res;
		}
		model.defaultParams = getDefaultParams();
		console.log(model.defaultParams)
		model.setDefaultDate = function(date){
			if(!date) return ;
			$('#statDateFrom').datepicker( 'setDate' , date);
			$('#statDateTo').datepicker( 'setDate' , date);
		}
        
        /**
         * @description 获取一经列表
         * @param  option
         * @return  
         * ------------------------------------------------------------------
         */
        model.loadyijingGrid = function(option) {
        		var gridWidth = $("#yijngGrid").parents(".ui-grid-box").width();
        		var moreQueryIpnut ={};
//        		var searchEngines = $("#searchEngines").val();
//        		var interfaceType = $("#cycleType").val();
        		var statDateFrom = $("#statDateFrom").val();
        		var statDateTo = $("#statDateTo").val();
//        		moreQueryIpnut.exportType = interfaceType;
//        		moreQueryIpnut.search = searchEngines;
        		moreQueryIpnut.doOpDateFrom=$("#dataTimeFrom").val();
				moreQueryIpnut.doOpDateTo=$("#dataTimeTo").val();
        		moreQueryIpnut.statDateFrom = statDateFrom;
        		moreQueryIpnut.statDateTo = statDateTo;
        		moreQueryIpnut.doOpTime=model.defaultParams.doOpTime;
        		moreQueryIpnut.statusType=model.defaultParams.statusType;
        		if(model.defaultParams!=null){
        			if(model.defaultParams.statusType=="interface_push"){
        				moreQueryIpnut.pushFinishStatus=model.defaultParams.pushStatus;
        			}
        			if(model.defaultParams.statusType=="interface_num"){
        				moreQueryIpnut.pushNumStatus=model.defaultParams.pushStatus;
        			}
        		}
        		for(i in moreQueryIpnut){
            		if(moreQueryIpnut[i]==""){
            			delete moreQueryIpnut[i];
            		}
            	}
    	        var setFormatter = function(name,cellValue,option,rowObj){
    	        	if(rowObj[name + 'Status']==null){
      				  rowObj[name + 'Status']='--';
          	           }
    	            return '<span style="color:'+ rowObj[name + 'Color'] +'">' +rowObj[name + 'Status']+ '</span>'
    	        }
        		var defaults ={
        				postData:moreQueryIpnut,
        				colNames:['接口编码','应用名称', '数据日期','接口类型','目标系统','计划出数时间','实际出数时间','出数状态','计划推送数据完成时间','实际推送数据完成时间','推送状态','波动阈值','环比','接口质量','推送量','BOSS入库完成时间','入库数据量','操作'],
        				colModel:[  
        						{name:'exportId',index:'export_id', width:0.08*gridWidth,align:"center",frozen : true,formatter:setInterfaceName},
	    	        	   		{name:'exportName',index:'export_name',sorttype:"string", width:0.10*gridWidth,align:"left",frozen : true},
	    	        	   		{name:'doOpDate',index:'do_op_date', width:0.07*gridWidth,align:"center"},
	    	        	   		{name:'exportType',index:'export_type', width:0.05*gridWidth, align:"center"},	
	    	        	   		{name:'sourceName',index:'source_name', width:0.06*gridWidth, align:"center"},
	    	        	   		{name:'doPlanDatetime',index:'do_plan_datetime', width:0.12*gridWidth,align:"center",formatter:DateFmt.dateFormatter},		
	    	        	   		{name:'doEndDatetime',index:'do_end_datetime', width:0.129*gridWidth,align:"center",formatter:DateFmt.dateFormatter},		
	    	        	   		{name:'pushNumStatus',index:'push_num_status', width:0.08*gridWidth,align:"center",color:"pushNumColor",formatter:$.setStatus,formatter:setFormatter.bind(this,'pushNum')},		
	    	        	   		{name:'doPlanDatetime1',index:'do_plan_datetime_1', width:0.12*gridWidth,align:"center",formatter:DateFmt.dateFormatter},		
	    	        	   		{name:'doEndDatetime1',index:'do_end_datetime_1', width:0.12*gridWidth,align:"center",formatter:DateFmt.dateFormatter},		
	    	        	   		{name:'pushFinishStatus',index:'push_finish_status', width:0.10*gridWidth,align:"center",color:"pushFinishColor",formatter:setFormatter.bind(this,'pushFinish')},		
	    	        	   		
	    	        	   		{name:'threshold',index:'threshold', width:0.08*gridWidth,align:"center",color:"cdrfileStatusColor",formatter:$.setStatus},		
	    	        	   		{name:'lastValues',index:'last_values', width:0.08*gridWidth,align:"center",color:"cdrfileStatusColor",formatter:$.setStatus},	
	    	        	   		{name:'interfaceStatus',index:'interface_status', width:0.08*gridWidth,align:"center",color:"cdrfileStatusColor",formatter:setFormatter.bind(this,'interface')},	
	    	        	   		{name:'tableValues',index:'table_values', width:0.08*gridWidth,align:"center",color:"cdrfileStatusColor",formatter:$.setStatus},
	    	        	   		{name:'indbEndTime',index:'indb_end_time', width:0.12*gridWidth,align:"center",color:"cdrfileStatusColor",formatter:DateFmt.dateFormatter},		
	    	        	   		{name:'indbRowNum',index:'indb_row_num', width:0.09*gridWidth,align:"center",color:"cdrfileStatusColor",formatter:$.setStatus},		
	    	        	   		{name:'handle',index:'handle', title:false, width:0.145*gridWidth, sortable:false,formatter:del,align:"center",frozen : true}	
    	        	   		]
        		};
        		$(document).data("colModel",defaults.colModel);
        		$(document).data("colNames",defaults.colNames);
        		option = $.extend(defaults,option);
        		
	        	$("#yijngGrid").AIGrid({        
	        	   	url:$.ctx + '/api/push/rpt/raing/list',
	        		datatype: "json",
	        		colNames:option.colNames,
	        	   	colModel:option.colModel,
	        	   	rowNum:10,
	        	   	postData:option.postData,
	        	   	width: gridWidth,
	        	   	autowidth:false,
	        	   	shrinkToFit: false,
	        	   	rowList:[10,20,30],
	        	   	pager: '#pjyijng',
	        	   	sortname: '',
	        	    viewrecords: true,
	        	    multiselect:false,
	        		rownumbers:false,
	        	    sortorder: "asc",
	        		jsonReader: {
	        			repeatitems : false,
	        		},
	        		height: '100%',
	        		showNoResult:true
	        	}).jqGrid('setFrozenColumns');
	        	function setInterfaceName(cellvalue, options, rowObject){
	        		if(rowObject.pushFinishColor == "#f85454" || rowObject.pushNumColor == "#f85454"){//状态值
	        			var html = '<span class="ui-delay-icon"></span><span>'+rowObject.exportId+'</span>'
	        			return html;
	        		}else{
	        			var html = '<span class="ui-empty-icon v-hidden"></span>'+rowObject.exportId;
	        			return html;
	        		}
	        	}
	        	
//	        	function setColorNum(name,cellvalue, options, rowObject){
//	        		console.log(rowObject.name + 'Color')
//	        		return '<span style="color:'+ rowObject[name + 'Color'] +'">' +rowObject[name + 'Status']+ '</span>'
//	        	}
	        	
	        	function setColorFinish(cellvalue, options, rowObject){
	        		if(rowObject.pushFinishStatus=="延迟未完成"){
	        			 return '<span style="color:#f85454">' +rowObject.pushFinishStatus+ '</span>'
	        		 }else{
	        			 return '<span>' +rowObject.pushFinishStatus+ '</span>'
	        		 }
	        	}
	        	
	        	function del(cellvalue, options, rowObject){
	        		var rowObjectStr = JSON.stringify(rowObject) ;
	        		var html='<button type="button" class="btn btn-default ui-table-btn" id="'+rowObject.exportId+'" data-dataDate ="'+rowObject.doOpDate+'" data-appName="'+rowObject.exportName+'" data-delaytime="'+-rowObject.delayTime+'" data-incompleteReason ="'+rowObject.dealyReason+'" onclick="yijingMonitor.sendSMSDlg(this);">短信</button><button type="button" class="btn btn-default  ui-table-btn ui-table-btn -hidden" onclick=\'yijingMonitor.sendMemoDlg('+rowObjectStr+')\'>备注</button>';
	        		return html;
	        	}
	        	//数据日期 日和月时展示不同
	        	function dataDateFormateDiff(cellvalue, options, rowObject){
	            	if(cellvalue){
	            			if(rowObject.interfaceType == '日'){
	            				return DateFmt.Formate(cellvalue,"yyyy-MM-dd");
	            			}
	    		        	if(rowObject.interfaceType == '月'){
	    						return DateFmt.Formate(cellvalue,"yyyy-MM");
	    					}
	            	}else{
	        			return "";
	        		}
	            }
        }; 
        /**
         * 加载出数状态
         */
        model.loadStatusList=function(){
	        	$.AIGet({
	    			url:$.ctx + "/api/push/rpt/raing/status?statusType=interface_num",
	    			datatype:"json",
	    			success:function(result){
	    				var pushNumStatus = result.data;
	    				var interfaceNumHtml ="";
	    				for(var i =0,len=pushNumStatus.length;i<len;i++){
	    					interfaceNumHtml +='<option value="'+pushNumStatus[i].status_code+'">'+pushNumStatus[i].status_name+'</option>';
	    				}
	    				$('#pushNumStatus').html(interfaceNumHtml);
	    				if(model.defaultParams.statusType=="interface_num"){
	    					var pushStatus=model.defaultParams.pushStatus;
	    					$("#pushNumStatus option[value='"+pushStatus+"']").attr("selected","selected");
	    				}
	    				$('#pushNumStatus').multiselect({
	    					nonSelectedText:"--请选择--",
	    					buttonWidth:148,
	    					nSelectedText:"个选择",
	    					includeSelectAllOption:false,
	    				  });
	    				if(model.defaultParams.statusType=="interface_num"){
	    					$('#pushNumStatus').siblings(".btn-group").find("button").attr("disabled","disabled")
	    				}
	    			}
	        	});
        	
        };
        /**
         * 加载推送状态
         */
        model.loadPushList=function(){
	        	$.AIGet({
	    			url:$.ctx + "/api/push/rpt/raing/status?statusType=interface_push",
	    			datatype:"json",
	    			success:function(result){
	    				var interfaceNum = result.data;
	    				var interfaceNumHtml ="";
	    				for(var i =0,len=interfaceNum.length;i<len;i++){
	    					interfaceNumHtml +='<option value="'+interfaceNum[i].status_code+'">'+interfaceNum[i].status_name+'</option>';
	    				}
	    				$('#pushFinishStatus').html(interfaceNumHtml);
	    				if(model.defaultParams.statusType=="interface_push"){
	    					var pushStatus=model.defaultParams.pushStatus;
	    					$("#pushFinishStatus option[value='"+pushStatus+"']").attr("selected","selected");
	    				}
	    				$('#pushFinishStatus').multiselect({
	    					nonSelectedText:"--请选择--",
	    					buttonWidth:148,
	    					nSelectedText:"个选择",
	    					includeSelectAllOption:false,
	    				  });
	    				if(model.defaultParams.statusType=="interface_push"){
	    					$('#pushFinishStatus').siblings(".btn-group").find("button").attr("disabled","disabled")
	    				}
	    			}
	        	});
        	
        };
        /**
         * 加载目标系统
         */
        model.loadTops=function(){
        	$.AIGet({
    			url:$.ctx + "/api/push/rpt/raing/source",
    			datatype:"json",
    			success:function(result){
    				var sourceGroup = result.data;
    				var sourceGroupHtml ="";
    				for(var i =0,len=sourceGroup.length;i<len;i++){
    					sourceGroupHtml +='<option value="'+sourceGroup[i].source_id+'">'+sourceGroup[i].source_name+'</option>';
    				}
    				$('#sources').html(sourceGroupHtml);
    				$('#sources').multiselect({
    					nonSelectedText:"--请选择--",
    					buttonWidth:148,
    					nSelectedText:"个选择",
    					includeSelectAllOption:false,
    				  });
    			}
        	});
    };

    /**
     * 日期联动
     */
    model.loadCycleType=function(){
    	$.AIGet({
			url:$.ctx + "/api/push/rpt/raing/type",
			datatype:"json",
			success:function(result){
				var sourceGroupHtml=('<option value="">' +'全部' + '</option>');
				var sourceGroup = result.data;
				//var sourceGroupHtml ="";
				for(var i =0,len=sourceGroup.length;i<len;i++){
					sourceGroupHtml +='<option value="'+sourceGroup[i].type_code+'">'+sourceGroup[i].type_name+'</option>';
				}
				
				$('#cycleType').html(sourceGroupHtml);
				$('#cycleType').multiselect({//		nonSelectedText:"选择周期",
					nonSelectedText:"全部",
					buttonWidth:148,
					nSelectedText:"个选择",
					includeSelectAllOption:false,
					onChange:function(element, checked){
						if($(element).val() == "1"){
							DateFmt.loaddatepicker({
								from:"#dataTimeFrom",
								to:"#dataTimeTo",
								dateFormat: "yyyy-MM",
								showButtonPanel: true,
						        minDate:DateFmt.DateCalc(new Date(),"M",-6),
						    	maxDate:DateFmt.DateCalc(new Date(),"M",-1),
						        closeText:"确定" ,
					    		beforeShow :function(){
					    			$.datepicker.dpDiv.addClass("ui-hide-calendar");
					    			$("#ui-datepicker-div .ui-datepicker-year").off("change");
					    		},
						        onClose: function(dateText, inst) {
						            var month = $("#ui-datepicker-div .ui-datepicker-month option:selected").val();//得到选中的月份值
						            var year = $("#ui-datepicker-div .ui-datepicker-year option:selected").val();//得到选中的年份值
						            var dateStr = DateFmt.Formate(DateFmt.parseDate(year+'-'+(parseInt(month)+1)),"yyyy-MM");
						            $(this).val(dateStr);//给input赋值，其中要对月值加1才是实际的月份
						            if(this.id == "dataTimeTo"){
						            	var val = DateFmt.from.val();
						            	DateFmt.from.datepicker( "option", "maxDate", DateFmt.parseDate(this.value ) ).val(val);
						            }else{
						            	var val = DateFmt.to.val();
						            	DateFmt.to.datepicker( "option", "minDate", DateFmt.parseDate(this.value ) ).val(val);
						            }
						        },
								formValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"M",-6),"yyyy-MM"),
								toValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"M",-1),"yyyy-MM")
							});
							
						}else if($(element).val() == "0"){
							DateFmt.loaddatepicker({
								from:"#dataTimeFrom",
								to:"#dataTimeTo",
								dateFormat: "yy-mm-dd",
								minDate:DateFmt.DateCalc(new Date(),"d",-30),
						    		maxDate:DateFmt.DateCalc(new Date(),"d",-1),
								formValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-8),"yyyy-MM-dd"),
								toValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-1),"yyyy-MM-dd")
							});
						}else{//选择全部
							DateFmt.loaddatepicker({
								from:"#dataTimeFrom",
								to:"#dataTimeTo",
								dateFormat: "yy-mm-dd",
								minDate:DateFmt.DateCalc(new Date(),"d",-30),
						    		maxDate:DateFmt.DateCalc(new Date(),"d",-1),
								formValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-8),"yyyy-MM-dd"),
								toValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-1),"yyyy-MM-dd")
							});
						}
						
					}
				  });
			}
    	});
};
    
        /**
         * 加载状态按钮
         */
        model.loadStateList=function(option){
        	var moreQueryIpnut = formFmt.formToObj($("#yijingSearchList"));
    		var searchEngines = $("#searchEngines").val();
    		var interfaceType = $("#cycleType").val();
    		var statDateFrom = $("#statDateFrom").val();
    		var statDateTo = $("#statDateTo").val();
    		moreQueryIpnut.doOpDateFrom=$("#dataTimeFrom").val();
    		moreQueryIpnut.doOpDateTo=$("#dataTimeTo").val();
    		moreQueryIpnut.exportType = interfaceType;
    		moreQueryIpnut.search = searchEngines;
    		moreQueryIpnut.statDateFrom = statDateFrom;
    		moreQueryIpnut.statDateTo = statDateTo;
    		moreQueryIpnut.doOpTime=model.defaultParams.doOpTime;
    		moreQueryIpnut.statusType=model.defaultParams.statusType;
    		if(model.defaultParams!=null){
    			if(model.defaultParams.statusType=="interface_push"){
    				moreQueryIpnut.pushFinishStatus=model.defaultParams.pushStatus;
    			}
    			if(model.defaultParams.statusType=="interface_num"){
    				moreQueryIpnut.pushNumStatus=model.defaultParams.pushStatus;
    			}
    		}
//    		else{
//    			moreQueryIpnut.pushFinishStatus=$("#pushFinishStatus option:selected").val();
//    			moreQueryIpnut.pushNumStatus=$("#pushNumStatus option:selected").val();
//    		}
    		
        	for(i in moreQueryIpnut){
        		if(moreQueryIpnut[i]==""){
        			delete moreQueryIpnut[i];
        		}
        	}
	        	$.AIGet({
	        		url:$.ctx + "/api/push/rpt/raing/classify",
	        		datatype:"file",
	        		data:option || moreQueryIpnut,
	        		success:function(result){
	        			if(result.status == "201"){
	        				$("#statusBox").html('<span class="red">'+result.message+'</span>')
	        				return;
	        			}
	        			var data  =  result.data;
	        			if(!data){
	        				return;
	        			}
	        			var html ="";
	        			for(var i=0,len= data.length;i<len;i++){
	        				var count = data[i].statusNbr ? data[i].statusNbr  : 0;
	        				 html+='<a style="background:' + data[i].statusColor + '" class="btn btn-default" href="javascript:;" role="button" data-statusType="'+data[i].statusType+'" data-stateCode="'+data[i].stateCode+'"><span class="fleft">'+data[i].statusDesc+'</span><span class="ui-btn-number fright">'+count+'</span> ';
	        			 }
	        			$("#statusBox").html(html);
	        			if(model.defaultParams==""){
	            			$("#statusBox").find("a:first").attr("data-statecode","");
	            		}else{
	            			$("#statusBox a.btn").attr("disabled","disabled");
	            		}
	        		}
	        	});
	        	
	        	$("#statusBox").off("click","a.btn").on("click","a.btn",function(event){
	        		if(model.defaultParams==null||model.defaultParams==""){
	        			var data = {};
		        		var statusType = $(this).attr("data-statustype");
		        		var stateCode = $(this).attr("data-stateCode");
		        		if(stateCode==""||stateCode==null){
		        			moreQueryIpnut.pushNumStatus = null;
		        			moreQueryIpnut.pushFinishStatus = null;
		        		}
		        		if(statusType == "interface_num"){
		        			moreQueryIpnut.pushNumStatus = stateCode;
		        		}else if(statusType == "interface_push"){
		        			moreQueryIpnut.pushFinishStatus = stateCode;
		        		};
		        		$("#yijngGrid").jqGrid('setGridParam',{ 
		        	        postData:moreQueryIpnut
		        	    }).trigger("reloadGrid");
	        		}else{
	        			event.preventDefault();
	        		}
	        		
	        	});
        };
        /**
         * 日期控件
         */
        model.loaddatepicker=function(option){
        		var defaults={
        			from:"",
        			to:""
        		};
        		option = $.extend(defaults,option);
        		var dateFormat = "yy-mm-dd",
	        from = $( option.from ).datepicker({
	        	//defaultDate: "+1w",
	        	changeMonth: true,
	        	numberOfMonths:1,
	        	dateFormat: "yy-mm-dd",
	    		beforeShow :function(){
	    			$.datepicker.dpDiv.removeClass("ui-hide-calendar");
	    		}
	        })
	        .on( "change", function() {
	        	to.datepicker( "option", "minDate", getDate( this ) );
	        }),
	        to = $( option.to ).datepicker({
	        	//defaultDate: "+1w",
	        	changeMonth: true,
	        	numberOfMonths:1,
	        	dateFormat: "yy-mm-dd",
	    		beforeShow :function(){
	    			$.datepicker.dpDiv.removeClass("ui-hide-calendar");
	    		}
	        })
	        .on( "change", function() {
	        	from.datepicker( "option", "maxDate", getDate( this ) );
	        });
        		$.datepicker.dpDiv.addClass("ui-datepicker-box");
	        function getDate( element ) {
	        	var date;
	        	try {
	        		date = $.datepicker.parseDate( dateFormat, element.value );
	        	} catch( error ) {
	        		date = null;
	        	}
	        	
	        	return date;
	        }
        };
        /**
         * 发送短信
         */
        /**
	     * 打开短信弹框
	     */
	    model.sendSMSDlg= function(obj){
	    		sendSMS.showSMSDlg({
	    			ajaxUrl: $.ctx + "/api/inter/messageSend",
    				rowObj:obj,
    				ajaxData:{
    					appId:obj.appId
    				}
	    		});
	    };
	    /**
         * 打开备注弹框
         */
        model.sendMemoDlg = function(rowObject){
        	
        	var statDate = DateFmt.Formate(rowObject.doOpDate,"yyyy-MM-dd");
        	methodMemo.showRemarkDlg({
    			ajaxData:{
    				"statDate":statDate,//统计日期
	    			"objectId":rowObject.exportId,//数据的id：应用/调度/接口ID
	    			"objectType":"I",//A:应用/P:调度/I:接口
    			},
    			"rowObj":rowObject
    		},'5');//1-实时监控 2-历史监控 3-调度监控
    		//用来服务器记录log
    		/*$.AILog({
    			  "action": "备注",//动作
    			  "detail": "",//详情,默认为空
    			  "module": "app_monitor_realtime"//二级菜单名称，如无二级菜单 使用一级菜单名称
    	    });*/
        };
        return model;

   })(window.yijingMonitor || {});