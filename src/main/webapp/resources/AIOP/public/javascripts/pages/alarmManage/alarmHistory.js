/**
 * ------------------------------------------------------------------
 * 告警管理-历史告警
 * ------------------------------------------------------------------
 */
var alarmHistory = (function (model){ 
	   /**
		    * @description 告警分类下拉列表
		*/
	   model.loadResourceTypeList = function(obj,buttonWidth){
		   $.AIGet({
		   	   url:$.ctx + "/api/alarm/common/queryAlarmClassifyList",
			   data:{},
			   success:function(result) {
				   		var data = result.data;
				   	    var menuStr = '';
				   		for(var i in data){
				   		    menuStr+='<option value="'+data[i].alarmClassifyId+'">'+data[i].alarmClassifyName+'</option>'	
				   		}
				   		$(obj).html(menuStr).val('');
				   		$(obj).multiselect({
				   			nonSelectedText:"告警分类",
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
	      * @description 获取列表
	     */
        model.loadHostManageGrid = function(option) {
			$("#gridHostManage").AIGrid({        
				url:$.ctx + '/api/alarm/getAlarmHistoryList',
				datatype: "json",
				colNames:["分类",'系统', '用途', '告警对象','告警实例','告警类型','告警发生时间','最后告警时间','告警恢复时间','告警次数','告警级别','告警描述'],
			   	colModel:[
			   	    {name:'classify',index:"classify",width:60,align:"center",formatter:$.setNull},
			   		{name:'system',index:'system', width:60,align:"center",formatter:$.setNull},
			   		{name:'purpose',index:'purpose', width:60,align:"center",formatter:$.setNull},
			   		{name:'alarmObject',index:'alarmObject', width:50,align:"center",formatter:$.setNull},
			   		{name:'alarmInstance',index:'alarmInstance',width:80, align:"center",formatter:$.setNull},
			   		{name:'alarmIndexName',index:'alarm_index_name', width:80,align:"center",formatter:$.setNull},
			   		{name:'alarmHappenedTime',index:'alarm_happened_time', width:80,align:"center",formatter:DateFmt.dataDateFormateMinute},
			   		{name:'alarmLastTime',index:'alarm_last_time', width:80,align:"center",formatter:DateFmt.dataDateFormateMinute},
			   		{name:'alarmRecoveryTime',index:'alarm_recovery_time',width:80, align:"center",formatter:DateFmt.dataDateFormateMinute},
			   		{name:'alarmCount',index:'alarm_count', width:80,align:"center",formatter:$.setNull},
			   		{name:'alarmLevelName',index:'alarm_level_name', width:50,align:"center",color:'alarmLevelColor',formatter:$.setColor},
			   		{name:'alarmDescription',index:'alarm_description',width:150, align:"center",sortable:false,formatter:$.setNull},
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
        };
        /**
	     * @description 刷新列表
	    */
        model.refreshGridHostManage = function(){
        	var ajaxData = {
    				"classifications":$('#resourceType').val(),
    				"searchText":$('#searchTxt').val()
    		};
    		$("#gridHostManage").jqGrid('setGridParam',{ 
                postData:ajaxData
            },true).trigger("reloadGrid");
    	};
        return model;
})(window.alarmHistory || {});
