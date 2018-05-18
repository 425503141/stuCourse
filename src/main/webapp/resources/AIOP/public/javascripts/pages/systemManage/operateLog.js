/**
 * ------------------------------------------------------------------
 * 操作日志 
 * ------------------------------------------------------------------
 */
var operateLog = (function (model){ 
	    /**
	     * @description 获取操作日志列表
	    */
        model.loadOperateLogGrid = function(option) {
			$("#gridOperateLog").AIGrid({        
			   	url:$.ctx+'/api/sys/log/list',
				datatype: "json",
				postData:{logTimeFrom:$('#operateLogMinTime').val(),logTimeTo:$('#operateLogMaxTime').val()},
			   	colNames:['登录账户','姓名', '操作模块','动作','内容','操作时间','登录地址'],
			   	colModel:[
			   		{name:'userName',index:'user_name', width:120,align:"center", sortable:false},//frozen : true固定列
			   		{name:'realName',index:'real_name', width:90, align:"center", sortable:false},
			   		{name:'moduleName',index:'module_name', width:100, align:"center", sortable:false},
			   		{name:'operationAction',index:'operation_action', width:80, sortable:false, align:"center"},
			   		{name:'operationDetail',index:'operation_detail', width:120,align:"center", sortable:false,formatter:emptyShow},//frozen : true固定列
			   		{name:'logTime',index:'log_time', width:90, align:"center",formatter:DateFmt.dateFormatter, sortable:false},
			   		{name:'userIp',index:'user_ip', width:90, align:"center", sortable:false},
			   	],
			   	rowNum:10,
			   	rowList:[10,20,30],
			   	pager: '#pagerOperateLog',
			   	sortname: '',
			    viewrecords: true,
			    multiselect:false,
				rownumbers:false,
			    sortorder: "desc",
				jsonReader: {
					repeatitems : false,
					id: "0"
				},
				height: '100%' 
			});	
			function emptyShow(cellvalue, options, rowObject){
				var content = rowObject.operationDetail ? rowObject.operationDetail : '-'
				return content
			}
        };
        /**
	     * @description 刷新用户组列表
	     * @param isSearch 1-查询 0 -导出
	    */
        model.searchOrExportOperateLog = function(isSearch){
        	var moduleName = "";
        	var treeObj=$.fn.zTree.getZTreeObj("operateLog_tree_tree");
        	//var moduleName = treeObj&&treeObj.getSelectedNodes()[0] ? treeObj.getSelectedNodes()[0].name : "";
        	var moduleIds = $.trim($('#operateLog_tree_value').attr('node-ids'));
        		moduleIds = moduleIds ? moduleIds : '';
        	var ajaxData = {
    				"logTimeFrom":$('#operateLogMinTime').val(),
    				"logTimeTo":$('#operateLogMaxTime').val(),
    				"moduleIds":moduleIds,
    				"searchText":$('#searchTxt').val()
    		};
        	if(isSearch=='1'){
        		$("#gridOperateLog").jqGrid('setGridParam',{ 
                    postData:ajaxData,page:1 
                }).trigger("reloadGrid");
        	}
        	if(isSearch=='0'){
        		var colModel = $("#gridOperateLog").jqGrid('getGridParam',"colModel");
        		var colArr = [];
        		for(var i = 0; i < colModel.length; i++){
        			if(colModel[i].name != "handle"){
        				colArr.push(colModel[i].name);
        			}
        		}
        		ajaxData.column = colArr.join(',');
        		var ssg = window.sessionStorage;
        	    var token="";
        		if(ssg){
        			token = ssg.getItem("token");
        			if(token){
        				ajaxData["token"]= token;
        				ajaxData = $.convertData(ajaxData);
        				window.open(encodeURI(encodeURI($.ctx + "/api/sys/log/exportCsv?"+ajaxData)));
        				//用来服务器记录log
        	    		$.AILog({
        	    				  "action": "导出",//动作
        	    				  "detail": "",//详情,默认为空
        	    				  "module": "sys_manage_log"//二级菜单名称，如无二级菜单 使用一级菜单名称
        	    		});
        			}
        		}
        	}
    		
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
	        	defaultDate: "+1w",
	        	changeMonth: true,
	        	numberOfMonths:1,
	        	dateFormat: "yy-mm-dd"
	        })
	        .on( "change", function() {
	        	to.datepicker( "option", "minDate", getDate( this ) );
	        }),
	        to = $( option.to ).datepicker({
	        	defaultDate: "+1w",
	        	changeMonth: true,
	        	numberOfMonths:1,
	        	dateFormat: "yy-mm-dd"
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
        return model;
})(window.operateLog || {});