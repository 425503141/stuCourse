/**
 * ------------------------------------------------------------------
 * 应用监控-实时监控
 * ------------------------------------------------------------------
 */
var erjingMonitor = (function (model){
        //开发版本号
        model.version = "1.0.0";
        model.author  = "wangsen3";
        model.email   = "wangsen3@asiainfo.com";
        model.network = {};
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
				res[key] = key === 'statDateFrom' ? value :(value);
				if(res.timeSlotFrom=="null"){
					res.timeSlotFrom="";
				}
				if(res.timeSlotTo=="null"){
					res.timeSlotTo="";
				}
			});
			return res;
		}
		model.defaultParams = getDefaultParams();
		//console.log(model.defaultParams)
		model.setDefaultDate = function(date){
			if(!date) return ;
			$('#dateTimeFrom').datepicker( 'setDate' , date);
			$('#dateTimeTo').datepicker( 'setDate' , date);
		}
        

        /**
         * @description 获取一经列表
         * @param  option
         * @return  
         * ------------------------------------------------------------------
         */
        model.loaderjingGrid = function(option) {
        		var gridWidth = $("#erjingGrid").parents(".ui-grid-box").width();
        		var getValue = function(cell,option,rowObject){
        			return cell || '--';
        		}
        		  var setFormatter = function(name,cellValue,option,rowObj){
        			  if(rowObj[name + 'StatusStatus']==null){
        				  rowObj[name + 'StatusStatus']='--';
            	           }
      	            return '<span style="color:'+ rowObj[name + 'StatusColor'] +'">' +rowObj[name + 'StatusStatus']+ '</span>'
      	          
      	        }
        		var moreQueryIpnut ={};
        		var statDateFrom = $("#dateTimeFrom").val();
        		console.log(typeof statDateFrom)
        		var statDateTo = $("#dateTimeTo").val();
        		moreQueryIpnut.doOpDateFrom=$("#dataTimeFrom").val();
				moreQueryIpnut.doOpDateTo=$("#dataTimeTo").val();
				moreQueryIpnut.dataTimeFrom=$("#fileDateFrom").val();
				moreQueryIpnut.dataTimeTo=$("#fileDateTo").val();
				moreQueryIpnut.typeName = $("#cycleType").val();
				moreQueryIpnut.entryType = $("#entryType").val();
//				if( $("#entryType").val()==null){
//					moreQueryIpnut.entryType=[2];
//				}
        		moreQueryIpnut.statDateFrom = statDateFrom;
        		moreQueryIpnut.statDateTo = statDateTo;
        		moreQueryIpnut.timeSlotFrom=model.defaultParams.timeSlotFrom;
        		moreQueryIpnut.timeSlotTo=model.defaultParams.timeSlotTo;
        		moreQueryIpnut.statusType=model.defaultParams.statusType;
        		if(model.defaultParams!=null){
        			if(model.defaultParams.statusType=="load_status"){
        				moreQueryIpnut.loadDelay=model.defaultParams.pushStatus;
        			}
        			if(model.defaultParams.statusType=="file_arrive_status"){
        				moreQueryIpnut.arriveDelay=model.defaultParams.pushStatus;
        			}
        			if(model.defaultParams.statusType=="ftp_status"){
        				moreQueryIpnut.ftpDelay=model.defaultParams.pushStatus;
        			}
        		}
	        	var defaults ={
	        			postData:moreQueryIpnut,
	        			//postData:{statDateFrom:$("#dateTimeFrom").val(),statDateTo:$('#dateTimeTo').val(),typeName:$("select[name=interfaceType]").val(),dataTimeFrom:$("#fileDateFrom").val(),dataTimeTo:$('#fileDateTo').val()},
						colNames:['接口编码','接口名称', '接口类型','接口来源','重要程度','波动阀值','波动值','接口质量','统计日期',
								'数据日期','入库分类','接口表名','偏移量','文件计划到达时间','文件实际到达时间','文件到达状态','FTP计划开始时间',
								'FTP实际开始时间','FTP计划完成时间','FTP实际完成时间','FTP状态',
								'load计划开始时间','load实际开始时间',
								'load计划完成时间','Load实际完成时间','Load状态','原始文件数',
								'实际入库数','操作'],
	    				colModel:[  
							{name:'interfacecode',index:'interface_code', width:0.06*gridWidth,align:"center",frozen : true,formatter:getValue},
		        	   		{name:'interfaceName',index:'interface_name',sorttype:"string", width:0.12*gridWidth,align:"left",frozen : true},
		        	   		{name:'typeName',index:'type_name', width:0.07*gridWidth,align:"center",formatter:getValue},
		        	   		{name:'interfaceSourceName',index:'interface_source_name ', width:0.07*gridWidth,align:"center",formatter:getValue},
		        	   		{name:'priLevel',index:'pri_level', width:0.06*gridWidth, align:"center",formatter:$.setImpLevel},
		        	   		{name:'threshold',index:'threshold', width:0.06*gridWidth, align:"center"},
		        	   		{name:'waveValues',index:'wave_values', width:0.06*gridWidth, align:"center"},
		        	   		{name:'interfaceStatusStatus',index:'interface_status', width:0.07*gridWidth,align:"center",color:"loadDifferenceColor",formatter:$.setStatus,formatter:setFormatter.bind(this,'interface')},
		        	   		{name:'statDate',index:'stat_date', width:0.10*gridWidth, align:"center",formatter:DateFmt.dataDateFormate },
		        	   		{name:'dataTime',index:'data_time', width:0.10*gridWidth, align:"center",formatter:DateFmt.dataDateFormate},		
		        	   		{name:'entryTypeName',index:'entry_type_name', width:0.06*gridWidth,align:"center",formatter:getValue},
		        	   		{name:'interfaceTableName',index:'interface_table_name', width:0.10*gridWidth,align:"center",formatter:getValue},
		        	   		{name:'dateArgs',index:'date_args', width:0.07*gridWidth,align:"center",formatter:getValue},
		        	   		{name:'filePlanArriveTime',index:'file_plan_arrive_time',formatter:DateFmt.dateFormatter, width:0.12*gridWidth,align:"center"},
		        	   		{name:'fileActualArriveTime',index:'file_actual_arrive_time', width:0.12*gridWidth,align:"center",formatter:DateFmt.dateFormatter},
		        	   		{name:'fileStatusStatus',index:'file_arrive_status', width:0.07*gridWidth,align:"center",formatter:getValue,formatter:setFormatter.bind(this,'file')},
		        	   		{name:'ftpPlanStartTime',index:'ftp_plan_start_time',formatter:DateFmt.dateFormatter, width:0.12*gridWidth,align:"center"},
		        	   		{name:'ftpActualStartTime',index:'ftp_actual_start_time',formatter:DateFmt.dateFormatter, width:0.12*gridWidth,align:"center"},
		        	   		{name:'ftpPlanEndTime',index:'ftp_plan_end_time', width:0.12*gridWidth,align:"center",formatter:DateFmt.dateFormatter},		
		        	   		{name:'ftpActualEndTime',index:'ftp_actual_end_time', width:0.12*gridWidth,align:"center",formatter:DateFmt.dateFormatter},		
		        	   		{name:'ftpStatusStatus',index:'ftp_status', width:0.10*gridWidth,align:"center",color:"ftpStatusColor",formatter:$.setStatus,formatter:setFormatter.bind(this,'ftp')},		
		        	   		{name:'loadPlanStartTime',index:'load_plan_start_time', width:0.12*gridWidth,align:"center",formatter:DateFmt.dateFormatter},		
		        	   		{name:'loadActualStartTime',index:'load_actual_start_time', width:0.12*gridWidth,align:"center",formatter:DateFmt.dateFormatter},		
		        	   		{name:'loadPlanEndTime',index:'load_plan_end_time', width:0.12*gridWidth,align:"center",formatter:DateFmt.dateFormatter},		
		        	   		{name:'loadActualEndTime',index:'load_actual_end_time', width:0.12*gridWidth,align:"center",formatter:DateFmt.dateFormatter},		
		        	   		{name:'loadStatusStatus',index:'load_status', width:0.07*gridWidth,align:"center",color:"loadStatusColor",formatter:$.setStatus,formatter:setFormatter.bind(this,'load')},		
		        	   		{name:'totalRecord',index:'total_record', width:0.07*gridWidth,align:"center"},
		        	   		{name:'loadedRecord',index:'loaded_record', width:0.07*gridWidth,align:"center"},	
		        	   		{name:'handle',index:'handle', width:200, title:false,sortable:false,formatter:del,align:"center",frozen : true}
	        	   		]
	    		};
	    		var getColumns = function(arr){
	    			if(!arr || arr.length <= 0) return;
	    			var res = [];
	    			arr.forEach(function(item){
	    				item.index !== 'handle' && res.push(item.index);
	    			});
	    			return res.toString();
	    		}
	    		var columns = getColumns(defaults.colModel);
	    		$(document).data("erjingcolModel",defaults.colModel);
	    		$(document).data("erjingcolNames",defaults.colNames);
	    		option = $.extend(defaults,option);
	    		//console.log(erjingMonitor.defaultParams);
	    		erjingMonitor.defaultParams && (option.postData = $.extend(erjingMonitor.defaultParams,option.postData));
	    		//console.log(option.postData);
	    		//defaults.postData.column = columns;
	    	 	$("#erjingGrid").AIGrid({        
	        	   	url:$.ctx + '/api/inter/interfaceInput/list',
	        		datatype: "json",
	        		postData:option.postData,
	        		colNames:option.colNames,
	        	   	colModel:option.colModel,
	        	   	rowNum:10,
	        	   	width: gridWidth,
	        	   	autowidth:false,
	        	   	shrinkToFit: false,
	        	   	rowList:[10,20,30],
	        	   	pager: '#pjerjing',
	        	   	sortname: '',
	        	    viewrecords: true,
	        	    multiselect:false,
	        		rownumbers:false,
	        	    sortorder: "asc",
	        		jsonReader: {
	        			repeatitems : false,
	        		},
	        		height: '100%',
	        		showNoResult:true,//是否展示无数据时的样式
	        		afterGridLoad:function(){
	        	    	$("#appTableInfoPanel").addClass("hidden");
	        	    },
	        	}).jqGrid('setFrozenColumns');
	        	function setInterfaceName(cellvalue, options, rowObject){
	        		if(rowObject.loadStatusColor == "red" || rowObject.loadDifferenceColor == "red" || rowObject.ftpStatusColor == "red"){//状态值
	        			var html = '<span class="ui-delay-icon"></span><span>'+rowObject.interfaceName+'</span>'
	        			return html;
	        		}else{
	        			var html = '<span class="ui-empty-icon v-hidden"></span>'+rowObject.interfaceName;
	        			return html;
	        		}
	        	}
	        	function del(cellvalue, options, rowObject){
	        		var rowObjectStr = JSON.stringify(rowObject) ;
	        		var html='<button type="button" class="btn btn-default ui-table-btn ui-table-btn" onclick=\'erjingMonitor.loadEffectTable('+rowObjectStr+')\' id="'+rowObject.interfacecode+'" >查看</button><button type="button" class="btn btn-default ui-table-btn" id="'+rowObject.interfacecode+'" data-dataDate ="'+rowObject.filedate+'" data-appName="'+rowObject.interfaceName+'" data-delaytime="'+rowObject.delayTime+'" data-incompleteReason ="'+rowObject.incompleteReason+'" onclick="yijingMonitor.sendSMSDlg(this);">短信</button><button type="button" class="btn btn-default  ui-table-btn ui-table-btn -hidden" onclick=\'erjingMonitor.sendMemoDlg('+rowObjectStr+')\'>备注</button>';
	        		return html;
	        	}
        };
        
   
        
        model.loadInterfaceType=function(){
        	$.AIGet({
    			url:$.ctx + "/api/inter/interfaceInput/interfaceType",
    			datatype:"json",
    			success:function(result){
    				var sourceGroupHtml=('<option value="">' +'全部' + '</option>');
    				var sourceGroup = result.data;
    				//var sourceGroupHtml ="";
    				for(var i =0,len=sourceGroup.length;i<len;i++){
    					sourceGroupHtml +='<option value="'+sourceGroup[i].interfaceType+'">'+sourceGroup[i].typeName+'</option>';
    				}
    				
    				$('#cycleType').html(sourceGroupHtml);
    				$('#cycleType').multiselect({//		nonSelectedText:"选择周期",
    					nonSelectedText:"全部",
    					buttonWidth:148,
    					nSelectedText:"个选择",
    					includeSelectAllOption:false,
    					onChange:function(element, checked){
    						if($(element).val() == "2"){
    							var clearBtn;
    							var confirmBtn;
    							DateFmt.loaddatepicker({
    								from:"#fileDateFrom",
    								to:"#fileDateTo",
    								dateFormat: "yyyy-MM",
    								showButtonPanel: true,
    								changeMonth:true,
    								changeYear:true,
    						        minDate:DateFmt.DateCalc(new Date(),"M",-6),
    						    	maxDate:DateFmt.DateCalc(new Date(),"M",-1),
    						        closeText:"确定" ,
    					    		beforeShow :function(dateText, inst){
    					    			$.datepicker.dpDiv.addClass("ui-hide-calendar");
    					    			$("#ui-datepicker-div .ui-datepicker-year").off("change");
//    					    			 setTimeout(function() {
//    					    				 var buttonPane = $(dateText).parent();
//    	       								 clearBtn=$("<button></button>").text("清空").addClass("btn btn-primary ui-aiop-btn");	
//    	   	   			    		       	 $(clearBtn).css({"position":"absolute","left":10,"bottom":-76,"z-index":"999999"});
//    	   	   			    		       	 $(buttonPane).append(clearBtn)
//    	   	   			    		       	 $(clearBtn).attr("id","clearBtn")
//    	   	   			    		       	 $(clearBtn).off("click").on("click",function(event){
//    	   	   			    		       		 event.preventDefault();
//    	   	   			    		       		 $(dateText).val("");
//    	   	   			    		       		 $("#clearBtn").remove();
//    	   	   			    		       		 
//    	   	   			    		       	 })
//    					    			 },1)
//    					    			dateText=$(dateText).attr("id");
//    					    			console.log(dateText)
//    					    			$(".ui-corner-all").click(function(event){
//    					    				console.log(dateText)
//    	    								 event.stopPropagation();
//    	    								var month = $("#ui-datepicker-div .ui-datepicker-month option:selected").val();//得到选中的月份值
//    	 						            var year = $("#ui-datepicker-div .ui-datepicker-year option:selected").val();//得到选中的年份值
//    	 						            var dateStr = DateFmt.Formate(DateFmt.parseDate(year+'-'+(parseInt(month)+1)),"yyyy-MM");
//    	 						            $(this).val(dateStr);//给input赋值，其中要对月值加1才是实际的月份
//    	 						            if(dateText == "fileDateTo"){
//    	 						            	var val =  dateStr;
//    	 						            	$("#"+dateText).val(val);
//    	 						            }else if(dateText== "fileDateFrom"){
//    	 						            	var val =  dateStr;
//    	 						            	$("#"+dateText).val(val);
//    	 						            }
//    	    							})
    					    		},
    						        onClose: function(dateText, inst) {
    						            var month = $("#ui-datepicker-div .ui-datepicker-month option:selected").val();//得到选中的月份值
    						            var year = $("#ui-datepicker-div .ui-datepicker-year option:selected").val();//得到选中的年份值
    						            var dateStr = DateFmt.Formate(DateFmt.parseDate(year+'-'+(parseInt(month)+1)),"yyyy-MM");
    						            $(this).val(dateStr);//给input赋值，其中要对月值加1才是实际的月份
    						            if(this.id == "fileDateTo"){
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
    							
    						}else if($(element).val() == "1"){
    							DateFmt.loaddatepicker({
    								from:"#fileDateFrom",
    								to:"#fileDateTo",
    								dateFormat: "yy-mm-dd",
    								minDate:DateFmt.DateCalc(new Date(),"d",-8),
    						    	maxDate:DateFmt.DateCalc(new Date(),"d",-1),
    								formValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-8),"yyyy-MM-dd"),
    								toValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-1),"yyyy-MM-dd")
    							});
    						}else{//选择全部
    							DateFmt.loaddatepicker({
    								from:"#fileDateFrom",
    								to:"#fileDateTo",
    								dateFormat: "yy-mm-dd",
    								minDate:DateFmt.DateCalc(new Date(),"d",-8),
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
         * 接口来源
         */
        model.loadInterfaceSourceList=function(url,obj,defaultParam){
	        	$.AIGet({
	    			url:url,
	    			datatype:"json",
	    			success:function(result){
	    				var html=defaultParam ? ('<option value="">' + defaultParam + '</option>') : "";
	    				var data = result.data,
	    					map = {
	    						'#interfaceSource':{id:'interfaceSourceId',name:'interfaceSourceName'},
	    						'#entryType':{id:'entryType',name:'entryTypeName'},
	    						//'#cycleType':{id:'interfaceType',name:'typeName'}
	    					}
	    				if(!data){return;}
	    				for(var i=0;i<data.length;i++){
	    					html+='<option value="'+data[i][map[obj].id]+'">'+data[i][map[obj].name]+'</option>'
	    				}
	    				$(obj).html(html);
	    				//$("#entryType option[value='2']").attr("selected","selected");
	    				$(obj).multiselect({
	    					nonSelectedText:"请选择",
	    					buttonWidth:148,
	    					nSelectedText:"个选择",
	    					includeSelectAllOption:false,
	    				  });
	    				
	    			}
	        	});
        };
        
        
        
        
        /**
         * 加载下来状态列表
         */
        model.loadStatusList=function(){
        	var dfd = new $.Deferred();
	        	$.AIGet({
	    			url:$.ctx + "/api/inter/common/status",
	    			datatype:"json",
	    			success:function(result){
	    				var upLoadStatus = result.data.ftp_status;
	    				var fileLevelStatus = result.data.load_status;
	    				var recordStates = result.data.interface_status;
	    				var arriveDelays = result.data.file_arrive_status;
	    				var upLoadStatusHtml ="";
	    				for(var i =0,len=upLoadStatus.length;i<len;i++){
	    					upLoadStatusHtml +='<option value="'+upLoadStatus[i].statusCode+'">'+upLoadStatus[i].statusName+'</option>';
	    				}
	    				$('#ftpDelays').html(upLoadStatusHtml);
	    				var fileLevelStatusHtml ="";
	    				for(var i =0,len=fileLevelStatus.length;i<len;i++){
	    					fileLevelStatusHtml +='<option value="'+fileLevelStatus[i].statusCode+'">'+fileLevelStatus[i].statusName+'</option>';
	    				}
	    				$('#loadDelays').html(fileLevelStatusHtml);
	    				var recordStatesHtml ="";
	    				for(var i =0,len=recordStates.length;i<len;i++){
	    					recordStatesHtml +='<option value="'+recordStates[i].statusCode+'">'+recordStates[i].statusName+'</option>';
	    				}
	    				$('#loadDifferences').html(recordStatesHtml);
	    				var arriveDelaysHtml ="";
	    				for(var i =0,len=arriveDelays.length;i<len;i++){
	    					arriveDelaysHtml +='<option value="'+arriveDelays[i].statusCode+'">'+arriveDelays[i].statusName+'</option>';
	    				}
	    				$('#arriveDelays').html(arriveDelaysHtml);
	    				if(model.defaultParams.statusType=="load_status"){
	    					var loadDelays=model.defaultParams.pushStatus;
	    					$("#loadDelays option[value='"+loadDelays+"']").attr("selected","selected");
	    				}
	    				if(model.defaultParams.statusType=="file_arrive_status"){
	    					var arriveDelays=model.defaultParams.pushStatus;
	    					$("#arriveDelays option[value='"+arriveDelays+"']").attr("selected","selected");
	    				}
	    				if(model.defaultParams.statusType=="ftp_status"){
	    					var ftpDelays=model.defaultParams.pushStatus;
	    					$("#ftpDelays option[value='"+ftpDelays+"']").attr("selected","selected");
	    				}
	    				$('#ftpDelays,#loadDelays,#loadDifferences,#arriveDelays').multiselect({
	    					nonSelectedText:"--请选择--",
	    					buttonWidth:148,
	    					nSelectedText:"个选择",
	    					includeSelectAllOption:false,
	    				  });
	    				dfd.resolve();
	    			}
	        	});
	        return dfd;
        	
        };
        /**
         * 加载状态按钮
         */
        model.loadStateList=function(option){
        	var moreQueryIpnut = formFmt.formToObj($("#erjingSearchList"));
    		var dateTimeFrom = $("#dateTimeFrom").val();
    		var dateTimeTo = $("#dateTimeTo").val();
    		var searchEngines = $("#searchEngines").val();
    		var interfaceType=$("select[name=interfaceType]").val();
    		moreQueryIpnut.dataTimeFrom=$("#fileDateFrom").val();
    		moreQueryIpnut.dataTimeTo=$("#fileDateTo").val();
    		moreQueryIpnut.entryType = $("#entryType").val();
//    		if( $("#entryType").val()==null){
//				moreQueryIpnut.entryType=[2];
//			}
    		moreQueryIpnut.typeName = interfaceType;
    		moreQueryIpnut.statDateFrom = dateTimeFrom;
    		moreQueryIpnut.statDateTo = dateTimeTo;
    		moreQueryIpnut.searchEngines = searchEngines;
    		moreQueryIpnut.timeSlotFrom=model.defaultParams.timeSlotFrom;
    		moreQueryIpnut.timeSlotTo=model.defaultParams.timeSlotTo;
    		moreQueryIpnut.statusType=model.defaultParams.statusType;
    		if(model.defaultParams!=null||model.defaultParams!=""){
    			if(model.defaultParams.statusType=="load_status"){
    				moreQueryIpnut.loadDelay=model.defaultParams.pushStatus;
    			}
    			if(model.defaultParams.statusType=="file_arrive_status"){
    				moreQueryIpnut.arriveDelay=model.defaultParams.pushStatus;
    			}
    			if(model.defaultParams.statusType=="ftp_status"){
    				moreQueryIpnut.ftpDelay=model.defaultParams.pushStatus;
    			}
    		}
	        	$.AIGet({
	        		url:$.ctx + "/api/inter/interfaceInput/countInterfaceStatus",
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
	        				var count = data[i].statusCount ? data[i].statusCount  : 0;
	        				 html+='<a style="background:' + data[i].statusColor + '" class="btn btn-default" href="javascript:;" role="button" data-statusType="'+data[i].statusType+'" data-stateCode="'+data[i].statusCode+'"><span class="fleft">'+data[i].statusName+'</span><span class="ui-btn-number fright">'+count+'</span> ';
	        			 }
	        			$("#statusBox").html(html);
	        			if(model.defaultParams==""){
	            			$("#statusBox").find("a:first").attr("data-statecode","");
	            		}else{
	            			$("#statusBox a.btn").attr("disabled","disabled");
	            		}
	        		}
	        	});
	        	//点击事件
	        	$("#statusBox").off("click","a.btn").on("click","a.btn",function(){
	        		if(model.defaultParams==null||model.defaultParams==""){
	        			var data = {};
		        		var type = $(this).attr("data-statusType");
		        		var stateCode = $(this).attr("data-stateCode");
		        		moreQueryIpnut.loadDelays = "";
		        		moreQueryIpnut.arriveDelays = "";
		        		moreQueryIpnut.ftpDelays = "";
		        		if(stateCode==""||stateCode==null){
		        			moreQueryIpnut.loadDelay = null;
		        			moreQueryIpnut.arriveDelay = null;
		        			moreQueryIpnut.ftpDelay = null;
		        		}
		        		if(type == "ftp_status"){
		        			moreQueryIpnut.ftpDelay = stateCode;
		        			moreQueryIpnut.arriveDelays = $('#arriveDelays').val();
		        			moreQueryIpnut.loadDelays = $('#loadDelays').val();
		        			
		        		}else if(type == "load_status"){
		        			moreQueryIpnut.loadDelay = stateCode;
		        			moreQueryIpnut.arriveDelays = $('#arriveDelays').val();
		        			moreQueryIpnut.ftpDelays = $('#ftpDelays').val();
		        		}else if(type == "file_arrive_status"){
		        			moreQueryIpnut.arriveDelay = stateCode;
		        			moreQueryIpnut.loadDelays = $('#loadDelays').val();
		        			moreQueryIpnut.ftpDelays = $('#ftpDelays').val();
		        		}
		        		$("#erjingGrid").jqGrid('setGridParam',{ 
		        	        postData:moreQueryIpnut
		        	    },true).trigger("reloadGrid");
	        		}else{
	        			event.preventDefault();
	        		}
	        		
	        	});
        };
        /*
		 *状态下拉框回显
         */
        model.setStatus = function(){
        	var defaultParams = erjingMonitor.defaultParams;
        	if(!defaultParams) return;
        	var getStatusName = function(arr){
        		if(!arr || arr.length <= 0 )return;
        		var res = '';
        		arr.forEach(function(item){
        			item.indexOf('Status') !== -1 && (res = item);
        		});
        		return res;
        	}
        	var keys = Object.keys(defaultParams),
        		statusName = getStatusName(keys),
        		statusMap = {
        			'1':'ftpDelays',
        			'2':'loadDelays',
        			'3':'loadDifferences',
        			'7':'arriveDelays'
        		},
        		value = defaultParams[statusName] + '';
        		id = statusMap[value[0]];
        		$('#' + id).val(value).multiselect('refresh');
        		$('#' + id).siblings(".btn-group").find("button").attr("disabled","disabled")
        }
        
        
        /***
	     * 获取状态列表
	     */
	    model.loadStatusTable = function(dom) {
	    		$.AIGet({
	    			url:$.ctx + "/api/appMonitor/common/appStatus",
	    			datatype:"json",
	    			success:function(result){
	    				var html = "";
	    				var data = result.data;
	    				for(var i =0,len=data.length;i<len;i++){
	    					html +='<option value="'+data[i].statusCode+'">'+data[i].statusName+'</option>';
	    				}
	    				$(dom).html(html).multiselect({
	    					nonSelectedText:"选择状态",
	    					buttonWidth:170,
	    					numberDisplayed:2,
	    					nSelectedText:"个选择",
	    					includeSelectAllOption:false,
	    					selectAllText: ' 全部'
//	    			 		enableFiltering:true//显示查询输入框
	    				 });
	    				$(dom).multiselect('refresh');//刷新该插件-解决点击其他行查看按钮之前选中的状态还在
	    			}
	    		});
	    };
	    /***
	     * 获取重要程度下拉列表
	     */
	    model.loadPriLevelList = function(dom) {
	    	 var data = $.priLevelObj;
	    	 var html = "";
	    	 for(var i in data){
	    		 html+='<option value="'+i+'">'+data[i]+'</option>'
	    	 }
	    	 $(dom).html(html).multiselect({
					nonSelectedText:"选择重要程度",
					buttonWidth:187,
					numberDisplayed:2,
					nSelectedText:"个选择",
					includeSelectAllOption:false,
					selectAllText: ' 全部'
			 });
			$(dom).multiselect('refresh');//刷新该插件
	     };
        
        /***
	     * 影响表
	     */
	    model.loadTableInfoVis=function(rowObject){
	    		//var scrollTop = $("#appTableInfoPanel").removeClass("hidden").offset().top;
	    		//$('html,body').animate({"scrollTop": scrollTop }, 500 );
	    		$("#tableEffectList").addClass("hidden");
	    		$("#tableEffectBtn").removeClass("active");
	    		if(!rowObject.tableLevel){
	    			rowObject.tableLevel = 3;
	    		}
	    		rowObject.procId = rowObject.interfacecode;
	    		rowObject.runTime = "";
	    		$("#appInfoName").text(rowObject.interfaceName);
		    	$.AIGet({
					url:$.ctx + "/api/inter/second/detail/procTableGraph",
					datatype:"json",
					data:rowObject,
					success:function(result){
					  if(result.status=='201'){return;}
					  //console.log(result.data)
					  var container = document.getElementById('tableNetwork');
					  var tableNetWork = model.network =new vis.Network(container, result, $.visOptions);
					  var needLevel = $("#expandTableVIS").attr("needLevel");
				      needLevel = parseInt(needLevel);
				      $("#tableProgressbar").width((needLevel/result.maxLevel)*100+"%");
				      if(needLevel >= result.maxLevel){
				    	  $("#expandTableVIS").attr("disabled","disabled");
				      }else{
			    	  	  $("#expandTableVIS").removeAttr("disabled");
				      }
				      if( result.maxLevel <=3){
		    	  		  $("#shrinkTableVIS").attr("disabled","disabled");
		    	       }else{
		    	  		  $("#shrinkTableVIS").removeAttr("disabled");
		    	  	  }
				      
				      $(".J_maximize").off("click").on("click",function(){
						  $("#maxDiagramBox").removeClass("hidden");
						  var maxDiagramcontainer = document.getElementById('maxDiagram');
					      var maxDiagram = new vis.Network(maxDiagramcontainer, result, $.visOptions);
					  });
					  $(".J_minDiagram").off("click").on("click",function(){
						  $("#maxDiagramBox").addClass("hidden");
					  });
				      
					}
		         });
		    	 //关闭按钮
		         $("#closeAppTablePanel").click(function(){
		        	// model.network.unselectAll();
		        	 var scrollTop = $("#appTableInfoPanel").offset().top;
		    		 $('html,body').animate({"scrollTop": scrollTop }, 500 );
		        	 $(this).parent().parent().addClass("hidden");
		         });
		         //展开一级
		         $("#expandTableVIS").off("click").on("click",function(){
		      		if($(this).is(":disabled")){
		      			return;
		      		}
	    			var needLevel = $(this).attr("needLevel");
	    			needLevel = parseInt(needLevel);
	    			rowObject.tableLevel =rowObject.tableLevel= needLevel+1;
	    			$(this).attr("needLevel",rowObject.tableLevel);
	    			$("#shrinkTableVIS").attr("needLevel",rowObject.tableLevel);
	    			erjingMonitor.loadTableInfoVis(rowObject);
		      	});
		         //收缩一级
		      	$("#shrinkTableVIS").off("click").on("click",function(){
		      		if($(this).is(":disabled")){
		      			return;
		      		}
		      		var needLevel = $(this).attr("needLevel");
		      		needLevel = parseInt(needLevel);
		      		rowObject.tableLevel =rowObject.tableLevel = needLevel - 1;
		      		if(needLevel <=3){
		      			 $(this).attr("disabled","disabled");
		      			return;
		      		}
		      		$(this).attr("needLevel",rowObject.tableLevel);
		      		$("#expandTableVIS").attr("needLevel",rowObject.tableLevel);
		      		erjingMonitor.loadTableInfoVis(rowObject);
		      	});
		      	//点击程序列表 按钮
		      	$("#tableEffectBtn").off("click").on("click",function(){
		      		if($(this).hasClass("active")){
	    				$(this).removeClass("active");
	    				$("#tableEffectList").addClass("hidden");
	    			}else{
	    				$(this).addClass("active");
	    				$('#tableSearchBox').val('');
	    				$("#tableEffectList").removeClass("hidden");
	    				erjingMonitor.loadTableVisList(rowObject);
	    			}
		    	});
	    };
	    /***
	     *重要影响
	     */
	    model.loadEffectTable = function(rowObject){
	    	console.log(rowObject.interfacecode)
	    	var scrollTop = $("#appTableInfoPanel").removeClass("hidden").offset().top;
    		$('html,body').stop().animate({"scrollTop": scrollTop }, 500 );
    		$("#tableEffectList2").addClass("hidden");
    		$("#tableEffectBtn2").removeClass("active");
    		$("#tableEffectList").addClass("hidden");
    		$("#tableEffectBtn").removeClass("active");
    		$(".nav-tabs li,.tab-content >div").removeClass("active");
    		$(".nav-tabs li:first-child,.tab-content > div:first-child").addClass("active");
    		if(!rowObject.tableLevel){
    			rowObject.tableLevel = 3;
    		}
    		$("#appInfoName").text(rowObject.interfaceName);
    		rowObject.procId = rowObject.interfacecode;
    		rowObject.runTime=rowObject.dataTime;
    		rowObject.needLevel=3;
    		rowObject.isNew=true;
    		$.AIGet({
	    		url:$.ctx + "/api/inter/second/getproc?interCode="+rowObject.procId+"&runTime="+rowObject.runTime,
				datatype:"json",
				async:false,
				success:function(result){
					rowObject.procId=result.data.split("|")[0];
					rowObject.runTime=result.data.split("|")[1];
				}
	    	})
	    	
	    	$.AIGet({
				url:$.ctx + "/api/appMonitor/common/affect/procGraph",
				datatype:"json",
				data:rowObject,
				success:function(result){
				  if(result.status=='201'){return;}
				  var container = document.getElementById('effectTable');
				  var tableNetWork = model.network =new vis.Network(container, result, $.visOptions);
				  var needLevel = $("#expandTableVIS2").attr("needLevel");
			      needLevel = parseInt(needLevel);
			      $("#tableProgressbar").width((needLevel/result.maxLevel)*100+"%");
			      if(needLevel >= result.maxLevel){
			    	  $("#expandTableVIS2").attr("disabled","disabled");
			      }else{
		    	  	  $("#expandTableVIS2").removeAttr("disabled");
			      }
			      if( result.maxLevel <=3){
	    	  		  $("#shrinkTableVIS2").attr("disabled","disabled");
	    	       }else{
	    	  		  $("#shrinkTableVIS2").removeAttr("disabled");
	    	  	  }
			      
			      $(".J_maximize").off("click").on("click",function(){
					  $("#maxDiagramBox").removeClass("hidden");
					  var maxDiagramcontainer = document.getElementById('maxDiagram');
				      var maxDiagram = new vis.Network(maxDiagramcontainer, result, $.visOptions);
				  });
				  $(".J_minDiagram").off("click").on("click",function(){
					  $("#maxDiagramBox").addClass("hidden");
				  });
			      
				}
	         });
	    	
	        $(".ui-tabs-box .nav-tabs  a").off('shown.bs.tab').on('shown.bs.tab', function (e) {
				var href = $(this).attr("href");
				if(href.indexOf("tab2") != -1){
					erjingMonitor.loadTableInfoVis(rowObject);
				}else if(href.indexOf("tab1") != -1){
					erjingMonitor.loadEffectTable(rowObject);
				}
			});
	    	 //关闭按钮
	         $("#closeAppTablePanel").click(function(){
	        	// model.networlok.unselectAll();
	        	 var scrollTop = $(".ui-search-box").offset().top;
	    		 //$('html,body').stop().animate({"scrollTop":scrollTop }, 500 );
	        	 $(this).parent().parent().addClass("hidden");
//	        	 $(this).parent().parent().find(".tab-pane").eq(0).addClass("active").siblings(".tab-pane").removeClass("active");
//	        	 $(".ui-tabs-box #tabList  li").eq(0).addClass("active").siblings("li").removeClass("active")
	         });
	         //展开一级
	         $("#expandTableVIS2").off("click").on("click",function(){
	      		if($(this).is(":disabled")){
	      			return;
	      		}
    			var needLevel = $(this).attr("needLevel");
    			needLevel = parseInt(needLevel);
    			rowObject.tableLevel =rowObject.tableLevel= needLevel+1;
    			$(this).attr("needLevel",rowObject.tableLevel);
    			$("#shrinkTableVIS2").attr("needLevel",rowObject.tableLevel);
    			erjingMonitor.loadEffectTable(rowObject);
	      	});
	         //收缩一级
	      	$("#shrinkTableVIS2").off("click").on("click",function(){
	      		if($(this).is(":disabled")){
	      			return;
	      		}
	      		var needLevel = $(this).attr("needLevel");
	      		needLevel = parseInt(needLevel);
	      		rowObject.tableLevel =rowObject.tableLevel = needLevel - 1;
	      		if(needLevel <=3){
	      			 $(this).attr("disabled","disabled");
	      			return;
	      		}
	      		$(this).attr("needLevel",rowObject.tableLevel);
	      		$("#expandTableVIS2").attr("needLevel",rowObject.tableLevel);
	      		erjingMonitor.loadEffectTable(rowObject);
	      	});
	      	//点击程序列表 按钮
	      	$("#tableEffectBtn2").off("click").on("click",function(){
	      		if($(this).hasClass("active")){
    				$(this).removeClass("active");
    				$("#tableEffectList2").addClass("hidden");
    			}else{
    				$(this).addClass("active");
    				$('#tableSearchBox2').val('');
    				$("#tableEffectList2").removeClass("hidden");
    				erjingMonitor.loadEffectVisList(rowObject);
    				erjingMonitor.loadStatusTable("#visStatusType2");//获取选择状态下拉列表
    				erjingMonitor.loadPriLevelList("#visImportantType2");//获取重要程度下拉列表
    			}
	    	});
	      	$("#exportAPPEffectBox3").off("click").on("click",function(){
	    		var exportData = {};
	    		exportData.runTime = rowObject.runTime;
	    		exportData.procId = rowObject.procId;
	    		exportData.searchText = $("#tableSearchBox2").val();
	    		exportData.runStatus = $("#visStatusType2").val();
	    		exportData.priLevel = $("#visImportantType2").val();
	    		exportData.fileName='Monitor_Affected_ImportantApp_';
	    		if(rowObject.historyTableUrl){
	    			exportData.fileName='His_Monitor_Affected_ImportantApp_';
	    		}
	    		var token="";
	    		var ssg = window.sessionStorage;
	    		if(ssg){
	    			token = ssg.getItem("token");
	    			if(token){
	    				exportData["token"]= token;
	    				exportData = $.convertData(exportData);
	    				window.open(encodeURI(encodeURI($.ctx + "/api/appMonitor/common/affect/details/procs/export?"+exportData)));
	    			}
	    		}
	    	});
	      	
	      	$("#exportExecl").off("click").on("click",function(){
	      		rowObject.procId = rowObject.interfacecode;
	    		rowObject.runTime=rowObject.dataTime;
	    		rowObject.needLevel=3;
	    		rowObject.isNew=true;
	    		var exportData = {};
	    		$.AIGet({
		    		url:$.ctx + "/api/inter/second/getproc?interCode="+rowObject.procId+"&runTime="+rowObject.runTime,
					datatype:"json",
					async:false,
					success:function(result){
						exportData.procId=result.data.split("|")[0];
						exportData.runTime=result.data.split("|")[1];
			    		exportData.fileName='RealTime_Monitor_Affected_Tbale_';
			    		//var ishistory=newPostData.isHistory
//			    		if(ishistory){
//			    			exportData.fileName='His_RealTime_Monitor_Affected_Tbale_';
//			    		}
			    		console.log(exportData)
			    		var token="";
			    		var ssg = window.sessionStorage;
			    		if(ssg){
			    			token = ssg.getItem("token");
			    			if(token){
			    				exportData["token"]= token;
			    				exportData = $.convertData(exportData);
			    				window.open(encodeURI(encodeURI($.ctx + "/api/appMonitor/common/common/details/tables/colexport?"+exportData)));
			    			}
			    		}
			    		
			    		
					}
		    	})

	    		


	    		
	    	});
	    };
	    
	    
	    
	    
	    /**
	     * 重要影响表 展示程序列表表格
	     * 
	     */
	    model.loadEffectVisList = function(rowObject){
	    	console.log(rowObject)
	    	rowObject.priLevel=null;
	    	rowObject.searchText = $("#tableSearchBox").val();
	    	$.jgrid.gridUnload("visTreejsonmap2");
	    	$("#visTreejsonmap2").AIGrid({        
	    		url:$.ctx + '/api/appMonitor/common/affect/details/procs',
	    		datatype: "json",
	    		postData:rowObject,
	    		colNames:['编号','程序英文名称','程序名称','重要程度','状态'],
	    	   	colModel:[
	    	   		{name:'serialNbr',index:'serial_nbr', sortable:false, width:40,align:"center"},	
	    	   		{name:'procNameEn',index:'proc_name_en', width:100,align:"center",formatter:$.setNull},
	    	   		{name:'procNameZn',index:'proc_name_zn', width:80,align:"center",formatter:$.setNull},
	    	   		{name:'pri_level',index:'pri_level', width:60,align:"center",formatter:$.setImpLevel},
	    	   		{name:'statusDesc',index:'status_desc', width:40,align:"center",color:"statusColor",formatter:$.setStatus}			    	   		
	    	   	],
    			rowNum:6,
    			rowList:[6,15,30],
    			pager: '#visTreepjmap2',
    			viewrecords: true,
    			multiselect:false,
    			rownumbers:false,
    			jsonReader: {
    				repeatitems : false,
    				id: "0"
    			},
    			height: '246' 
	    	});	

	    	$("#effectTableBTN2").off("click").on("click",function(){
	    		//rowObject.appName = $("#searchAPPVisList").val();
	    		rowObject.searchText = $("#tableSearchBox2").val();
	    		rowObject.runStatus = $("#visStatusType2").val();
	    		rowObject.priLevel = $("#visImportantType2").val();
	    		$("#visTreejsonmap2").jqGrid('setGridParam',{ 
	    			postData:rowObject
	    		}).trigger("reloadGrid");
	    	});
	    	
	    };
	    /**
	     * 点击程序列表 展示程序列表表格
	     * 
	     */
	    model.loadTableVisList = function(rowObject){
	    	rowObject.searchText = $("#tableSearchBox").val();
	    	rowObject.priLevel=null;
	    	$.jgrid.gridUnload("visTreejsonmap");
	    	$("#visTreejsonmap").AIGrid({        
	    		url: $.ctx + '/api/inter/second/detail/procTableList',//程序列表,
	    		datatype: "json",
	    		postData:rowObject,
	    		colNames:['编号','ID','表名称'],
	    	   	colModel:[
	    	   	    {name:'serialNbr',index:'serial_nbr', sortable:false, width:50,align:"center"},
	    	   		{name:'xmlid',index:'xml_id', width:100,align:"left"},		
	    	   		{name:'dataCnName',index:'data_CnName', width:150,align:"left"},		
	    	   	],
    			rowNum:6,
    			rowList:[6,15,30],
    			pager: '#visTreepjmap',
    			viewrecords: true,
    			multiselect:false,
    			rownumbers:false,
    			jsonReader: {
    				repeatitems : false,
    				id: "0"
    			},
    			height: '246' 
	    	});	
	    	$("#effectTableBTN").off("click").on("click",function(){
	    		rowObject.searchText = $("#tableSearchBox").val();
	    		$("#visTreejsonmap").jqGrid('setGridParam',{ 
	    			postData:rowObject
	    		}).trigger("reloadGrid");
	    	});
	    	
	    };
	    /**
         * 打开备注弹框
         */
        model.sendMemoDlg = function(rowObject){
        	
        	var statDate = DateFmt.Formate(rowObject.dataTime ,"yyyy-MM-dd");
        	methodMemo.showRemarkDlg({
    			ajaxData:{
    				"statDate":statDate,//统计日期
	    			"objectId":rowObject.interfacecode,//数据的id：应用/调度/接口ID
	    			"objectType":"I",//A:应用/P:调度/I:接口
    			},
    			"rowObj":rowObject
    		},'6');//1-实时监控 2-历史监控 3-调度监控
    		//用来服务器记录log
    		/*$.AILog({
    			  "action": "备注",//动作
    			  "detail": "",//详情,默认为空
    			  "module": "app_monitor_realtime"//二级菜单名称，如无二级菜单 使用一级菜单名称
    	    });*/
        };
        return model;
   })(window.erjingMonitor || {});