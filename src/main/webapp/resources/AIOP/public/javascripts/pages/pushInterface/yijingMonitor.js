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

        /**
         * @description 获取一经列表
         * @param  option
         * @return  
         * ------------------------------------------------------------------
         */
        model.loadyijingGrid = function(option) {
        	 
        		var gridWidth = $("#yijngGrid").parents(".ui-grid-box").width();
        		var defaults ={
        				postData:{statDateFrom:$("#statDateFrom").val(),statDateTo:$("#statDateTo").val(),unitType:$("select[name=interfaceType]").val()},
        				colNames:['接口编码','接口名称', '接口类型','数据日期','接口主题域','计划上传时间','实际上传时间','上传状态','文件取走时间','文件取走情况','文件入库时间','文件入库情况','操作'],
        				colModel:[  
        						{name:'unitId',index:'unit_id', width:0.06*gridWidth,align:"center",formatter:setInterfaceName},
	    	        	   		{name:'unitDesc',index:'unit_desc',sorttype:"string", width:0.08*gridWidth,align:"left"},
	    	        	   		{name:'unitType',index:'unit_type', width:0.05*gridWidth,align:"center"},
	    	        	   		{name:'txDate',index:'tx_date', width:0.06*gridWidth, align:"center"},	
	    	        	   		{name:'unitTop',index:'unit_top', width:0.06*gridWidth, align:"center"},
	    	        	   		{name:'upDeadline',index:'up_deadline', width:0.10*gridWidth,align:"center" },		
	    	        	   		{name:'upTime',index:'up_time', width:0.10*gridWidth,align:"center"},		
	    	        	   		{name:'isDealy',index:'is_dealy',color:"isDelayColor", width:0.06*gridWidth,align:"center",formatter:setColorDelay},		
	    	        	   		{name:'groupFtpTime',index:'group_ftp_time', width:0.10*gridWidth,align:"center"},		
	    	        	   		{name:'groupFtpDesc',index:'group_ftp_desc',color:"groupFtpColor",width:0.06*gridWidth,align:"center",formatter:setColorFtp},		
	    	        	   		{name:'groupLoadTime',index:'group_load_time', width:0.10*gridWidth,align:"center"},		
	    	        	   		{name:'groupLoadDesc',index:'group_load_desc',color:"groupLoadColor",width:0.06*gridWidth,align:"center",formatter:setColorLoad},		
	    	        	   		{name:'handle',index:'handle', title:false, width:0.115*gridWidth, sortable:false,formatter:del,align:"center"}	
    	        	   		]
        		};
        		$(document).data("colModel",defaults.colModel);
        		$(document).data("colNames",defaults.colNames);
        		option = $.extend(defaults,option);
	        	$("#yijngGrid").AIGrid({        
	        	   	url:$.ctx + '/api/first/partone/list',
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
	        	
	        	function setColorLoad(cellvalue, options, rowObject){
	        		if(rowObject.groupLoadColor=="#FFFFFF"){
	        			 return '<span style="color:#f85454">' +rowObject.groupLoadDesc+ '</span>'
	        		 }else{
	        			 return '<span style="color:#45BD6F">' +rowObject.groupLoadDesc+ '</span>'
	        		 }
	        	}
	        	function setColorFtp(cellvalue, options, rowObject){
	        		if(rowObject.groupFtpColor=="#FFFFFF"){
	        			 return '<span style="color:#f85454">' +rowObject.groupFtpDesc+ '</span>'
	        		 }else{
	        			 return '<span style="color:#45BD6F">' +rowObject.groupFtpDesc+ '</span>'
	        		 }
	        	}
	        	function setColorDelay(cellvalue, options, rowObject){
	        		if(rowObject.isDelayColor=="#FFFFFF"){
	        			 return '<span style="color:#f85454">' +rowObject.isDealy+ '</span>'
	        		 }else{
	        			 return '<span style="color:#45BD6F">' +rowObject.isDealy+ '</span>'
	        		 }
	        	}
	        	
	        	function setInterfaceName(cellvalue, options, rowObject){
	        		if(rowObject.groupFtpColor == "#FFFFFF" || rowObject.groupLoadColor == "#FFFFFF" || rowObject.isDelayColor == "#FFFFFF"){//状态值
	        			var html = '<span class="ui-delay-icon"></span><span>'+rowObject.unitId+'</span>'
	        			return html;
	        		}else{
	        			var html = '<span class="ui-empty-icon v-hidden"></span>'+rowObject.unitId;
	        			return html;
	        		}
	        	}
	        	function del(cellvalue, options, rowObject){
	        		var rowObjectStr = JSON.stringify(rowObject) ;
	        		var html='<button type="button" class="btn btn-default ui-table-btn" id="'+rowObject.unitId+'" data-dataDate ="'+rowObject.dataDate+'" data-appName="'+rowObject.unitDesc+'" data-delaytime="'+rowObject.delayTime+'" data-incompleteReason ="'+rowObject.dealyReason+'" onclick="yijingMonitor.sendSMSDlg(this);">短信</button><button type="button" class="btn btn-default  ui-table-btn ui-table-btn -hidden" onclick=\'yijingMonitor.sendMemoDlg('+rowObjectStr+')\'>备注</button>';
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
         * 加载下来状态列表
         */
        model.loadStatusList=function(){
	        	$.AIGet({
	    			url:$.ctx + "/api/first/common/status",
	    			datatype:"json",
	    			success:function(result){
	    				var uploadData = result.data.file_upload_status;
	    				var fileLevelStatus = result.data.file_ftp_status;
	    				var recordStates = result.data.file_load_status;
	    				var upLoadStatusHtml ="";
	    				for(var i =0,len=uploadData.length;i<len;i++){
	    					upLoadStatusHtml +='<option value="'+uploadData[i].statusCode+'">'+uploadData[i].statusName+'</option>';
	    				}
	    				$('#upLoadDesc').html(upLoadStatusHtml);
	    				var fileLevelStatusHtml ="";
	    				for(var i =0,len=fileLevelStatus.length;i<len;i++){
	    					fileLevelStatusHtml +='<option value="'+fileLevelStatus[i].statusCode+'">'+fileLevelStatus[i].statusName+'</option>';
	    				}
	    				$('#groupFtpDesc').html(fileLevelStatusHtml);
	    				var recordStatesHtml ="";
	    				for(var i =0,len=recordStates.length;i<len;i++){
	    					recordStatesHtml +='<option value="'+recordStates[i].statusCode+'">'+recordStates[i].statusName+'</option>';
	    				}
	    				$('#groupLoadDesc').html(recordStatesHtml);
	    				$('#upLoadDesc,#groupFtpDesc,#groupLoadDesc').multiselect({
	    					nonSelectedText:"--请选择--",
	    					buttonWidth:148,
	    					nSelectedText:"个选择",
	    					includeSelectAllOption:false,
	    				  });
	    			}
	        	});
        	
        };
        /**
         * 加载接口主题域
         */
        model.loadTops=function(){
        	$.AIGet({
    			url:$.ctx + "/api/first/partone/topic",
    			datatype:"json",
    			success:function(result){
    				var upLoadStatus = result.data;
    				var recordTopsHtml ="";
    				for(var i =0,len=upLoadStatus.length;i<len;i++){
    					recordTopsHtml +='<option value="'+upLoadStatus[i].topic_code+'">'+upLoadStatus[i].topic_name+'</option>';
    				}
    				$('#unitTop').html(recordTopsHtml);
    				
    				$('#unitTop').multiselect({
    					nonSelectedText:"--请选择--",
    					buttonWidth:148,
    					nSelectedText:"个选择",
    					includeSelectAllOption:false,
    				  });
    				$('#unitTop').siblings(".btn-group").find(".multiselect-container").css({"maxHeight":"286px","overflow":"auto"});
    			}
        	});
    	
    };
        
        
        /**
         * 加载状态按钮
         */
        model.loadStateList=function(option){
        	var moreQueryIpnut = formFmt.formToObj($("#yijingSearchList"));
    		var txDateFrom = $("#dataTimeFrom").val();
    		var txDateTo = $("#dataTimeTo").val();
    		var statDateFrom = $("#statDateFrom").val();
    		var statDateTo = $("#statDateTo").val();
    		var searchEngines = $("#searchEngines").val();
    		var interfaceType=$("select[name=interfaceType]").val();
    		moreQueryIpnut.unitType = interfaceType;
    		moreQueryIpnut.txDateFrom = txDateFrom;
    		moreQueryIpnut.txDateTo = txDateTo;
    		moreQueryIpnut.statDateFrom = statDateFrom;
    		moreQueryIpnut.statDateTo = statDateTo;
    		moreQueryIpnut.search = searchEngines;
    		for(i in moreQueryIpnut){
        		if(moreQueryIpnut[i]==""){
        			delete moreQueryIpnut[i];
        		}
        	}
	        	$.AIGet({
	        		url:$.ctx + "/api/first/partone/state",
	        		datatype:"file",
	        		data:option || moreQueryIpnut,
	        		success:function(result){
	        			if(result.status == "201"){
	        				$("#statusBox").html('<span class="red">'+result.message+'</span>')
	        				return;
	        			}
	        			var data  =  result.data;
	        			console.log(data)
	        			if(!data){
	        				return;
	        			}
	        			var html ="";
	        			for(var i=0,len= data.length;i<len;i++){
	        				var count = data[i].statusNbr ? data[i].statusNbr  : 0;
	        				 html+='<a class="btn btn-default" style="background:#f85454" href="javascript:;" role="button" data-statusType="'+data[i].statusType+'" data-stateCode="'+data[i].stateCode+'"><span class="fleft">'+data[i].statusDesc+'</span><span class="ui-btn-number fright">'+count+'</span> ';
	        			 }
	        			$("#statusBox").html(html);
	        			$("#statusBox").find("a:eq(0)").attr("data-statecode","");
	        			$("#statusBox").find("a:eq(0)").css({"background":"#8093f3"})
	        			$("#statusBox").find("a:last").css({"background":"#45bd6f"})
	        		}
	        	});
	        	
	        	$("#statusBox").off("click","a.btn").on("click","a.btn",function(){
	        		var data = {};
	        		var moreQueryIpnut = formFmt.formToObj($("#yijingSearchList"));
	        		var dataTimeFrom = $("#dataTimeFrom").val();
	        		var dataTimeTo = $("#dataTimeTo").val();
	        		var searchEngines = $("#searchEngines").val();
	        		var interfaceType = $("#cycleType").val();
	        		moreQueryIpnut.unitType = interfaceType;
	        		moreQueryIpnut.txDateFrom = dataTimeFrom;
	        		moreQueryIpnut.txDateTo = dataTimeTo;
	        		moreQueryIpnut.search = searchEngines;
	        		var type = $(this).attr("data-statusType");
	        		var stateCode = $(this).attr("data-stateCode");
	        		if(stateCode==""||stateCode==null){
	        			moreQueryIpnut.upLoadDesc = null;
	        			moreQueryIpnut.groupFtpDesc = null;
	        			moreQueryIpnut.groupLoadDesc = null;
	        		}
	        		if(type == "file_upload_status"){
	        			var flag=false;
	        			var upLoadArr=$("#upLoadDesc").val();
	        			$(upLoadArr).each(function(index,item){
	        				if(item=="801"){
	        					flag=true;
	        				}
	        			})
	        			if(flag==true){
	        				moreQueryIpnut.upLoadDesc = stateCode;
	        			}else{
	        				moreQueryIpnut.upLoadDesc ="0000";
	        			}
	        			if(upLoadArr==null){
	        				moreQueryIpnut.upLoadDesc = stateCode;
	        			}
	        			//moreQueryIpnut.upLoadDesc = stateCode;
	        			moreQueryIpnut.groupFtpDesc = $('#groupFtpDesc').val();
	        			moreQueryIpnut.groupLoadDesc = $('#groupLoadDesc').val();
	        			
	        		}else if(type == "file_upload_status802"){
	        			var flag=false;
	        			var upLoadArr=$("#upLoadDesc").val();
	        			$(upLoadArr).each(function(index,item){
	        				if(item=="802"){
	        					flag=true;
	        				}
	        			})
	        			if(flag==true){
	        				moreQueryIpnut.upLoadDesc = stateCode;
	        			}else{
	        				moreQueryIpnut.upLoadDesc ="0000";
	        			}
	        			if(upLoadArr==null){
	        				moreQueryIpnut.upLoadDesc = stateCode;
	        			}
	        			//moreQueryIpnut.upLoadDesc = stateCode;
	        			moreQueryIpnut.groupFtpDesc = $('#groupFtpDesc').val();
	        			moreQueryIpnut.groupLoadDesc = $('#groupLoadDesc').val();
	        			
	        		}else if(type == "file_ftp_status"){
	        			var flag=false;
	        			var upLoadArr=$("#groupFtpDesc").val();
	        			$(upLoadArr).each(function(index,item){
	        				if(item=="901"){
	        					flag=true;
	        				}
	        			})
	        			if(flag==true){
	        				moreQueryIpnut.groupFtpDesc = stateCode;
	        			}else{
	        				moreQueryIpnut.groupFtpDesc ="0000";
	        			}
	        			if(upLoadArr==null){
	        				moreQueryIpnut.groupFtpDesc = stateCode;
	        			}
	        			//moreQueryIpnut.groupFtpDesc = stateCode;
	        			moreQueryIpnut.upLoadDesc = $('#upLoadDesc').val();
	        			moreQueryIpnut.groupLoadDesc = $('#groupLoadDesc').val();
	        			
	        		}else if(type == "file_load_status"){
	        			var flag=false;
	        			var upLoadArr=$("#groupLoadDesc").val();
	        			$(upLoadArr).each(function(index,item){
	        				if(item=="1001"){
	        					flag=true;
	        				}
	        			})
	        			if(flag==true){
	        				moreQueryIpnut.groupLoadDesc = stateCode;
	        			}else{
	        				moreQueryIpnut.groupLoadDesc ="0000";
	        			}
	        			if(upLoadArr==null){
	        				moreQueryIpnut.groupLoadDesc = stateCode;
	        			}
	        			//moreQueryIpnut.groupLoadDesc = stateCode;
	        			moreQueryIpnut.upLoadDesc = $('#upLoadDesc').val();
	        			moreQueryIpnut.groupFtpDesc = $('#groupFtpDesc').val();
	        		}
	        		for(i in moreQueryIpnut){
	            		if(moreQueryIpnut[i]==""){
	            			delete moreQueryIpnut[i];
	            		}
	            	}
	        		$("#yijngGrid").jqGrid('setGridParam',{ 
	        	        postData:moreQueryIpnut
	        	    }).trigger("reloadGrid");
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
	        from = $( option.from )
	        .datepicker({
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
        	
        	var statDate = DateFmt.Formate(rowObject.statDate,"yyyy-MM-dd");
        	methodMemo.showRemarkDlg({
    			ajaxData:{
    				"statDate":statDate,//统计日期
	    			"objectId":rowObject.unitId,//数据的id：应用/调度/接口ID
	    			"objectType":"I",//A:应用/P:调度/I:接口
    			},
    			"rowObj":rowObject
    		},'4');//1-实时监控 2-历史监控 3-调度监控
    		//用来服务器记录log
    		/*$.AILog({
    			  "action": "备注",//动作
    			  "detail": "",//详情,默认为空
    			  "module": "app_monitor_realtime"//二级菜单名称，如无二级菜单 使用一级菜单名称
    	    });*/
        };
        return model;

   })(window.yijingMonitor || {});