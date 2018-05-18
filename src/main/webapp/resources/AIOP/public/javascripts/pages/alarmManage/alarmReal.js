/**
 * ------------------------------------------------------------------
 * 告警管理-实时告警
 * ------------------------------------------------------------------
 */
var alarmReal = (function (model){ 
	/**
     * @description 获取列表
    */
   model.loadHostManageGrid = function(option) {
	   var gridWidth = $("#gridHostManage").parents(".ui-grid-box").width();
		$("#gridHostManage").AIGrid({        
			url:$.ctx + '/api/alarm/getAlarmRealTimeList',
			datatype: "json",
			colNames:["分类",'系统', '用途', '告警对象','告警实例','告警类型','告警发生时间','最后告警时间',/*'告警恢复时间',*/'告警次数','告警级别','告警描述','操作'],
		   	colModel:[
		   	    {name:'classify',index:"classify",width:0.08*gridWidth,frozen : true,align:"center",formatter:$.setNull},
		   		{name:'system',index:'system', width:0.08*gridWidth,frozen : true,align:"center",formatter:$.setNull},
		   		{name:'purpose',index:'purpose', width:0.08*gridWidth,frozen : true,align:"center",formatter:$.setNull},
		   		{name:'alarmObject',index:'alarmObject', width:0.08*gridWidth,frozen : true,align:"center",formatter:$.setNull},
		   		{name:'alarmInstance',index:'alarmInstance',width:0.08*gridWidth,frozen : true, align:"center",formatter:$.setNull},
		   		{name:'alarmIndexName',index:'alarm_index_name',width:0.08*gridWidth,frozen : true,align:"center",formatter:$.setNull},
		   		{name:'alarmHappenedTime',index:'alarm_happened_time',width:0.10*gridWidth,align:"center",formatter:DateFmt.dataDateFormateMinute},
		   		{name:'alarmLastTime',index:'alarm_last_time',width:0.10*gridWidth,align:"center",formatter:DateFmt.dataDateFormateMinute},
		   		//{name:'alarmRecoveryTime',index:'alarm_recovery_time',width:80, align:"center",formatter:DateFmt.dataDateFormateMinute},
		   		{name:'alarmCount',index:'alarm_count',width:0.08*gridWidth,align:"center",formatter:$.setNull},
		   		{name:'alarmLevelName',index:'alarm_level_name',width:0.10*gridWidth,align:"center",color:'alarmLevelColor',formatter:$.setColor},
		   		{name:'alarmDescription',index:'alarm_description',width:0.14*gridWidth, align:"center",sortable:false,formatter:$.setNull},
		   		{name:'op',index:'op',width:0.14*gridWidth,frozen : true,sortable:false,title:false,formatter:del,align:"center"}
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
			width: gridWidth,
    	   	autowidth:false,
    	   	shrinkToFit: false,
			height: '100%',
			//showNoResult:true
		}).jqGrid('setFrozenColumns'); 
		//操作
		function del(cellvalue, options, rowObject){
			var rowObjectStr = JSON.stringify(rowObject);
			var html='<button type="button" class="btn btn-default  ui-table-btn ui-table-btn" onclick=\'alarmReal.sendSMSDlg('+rowObjectStr+')\'>短信</button><button type="button" class="btn btn-default ui-table-btn" onclick=\'alarmReal.operationCancel('+rowObjectStr+')\' title="取消">取消</button>';
			return html;
		}
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
	/**
     * 打开短信弹框
     */
    model.sendSMSDlg= function(obj){
    		sendSMSAlarm.showSMSDlg({
    			ajaxUrl: $.ctx + "/api/alarm/messageSend",
				rowObj:obj,
				ajaxData:{
					appId:obj.appId
				}
    		});
    		//用来服务器记录log
    		/*$.AILog({
    			  "action": "短信",//动作
    			  "detail": "",//详情,默认为空
    			  "module": "app_monitor_realtime"//二级菜单名称，如无二级菜单 使用一级菜单名称
    	    });*/
    };
	/**
    * @description 取消
   */
   model.operationCancel = function(rowObject){
	   var alarmId = rowObject.alarmId;
	   $.AIGet({
		   url: $.ctx+'/api/alarm/canelRealAlarm',
		   data: {"alarmId":alarmId},
		   async:true,
		   dataType:"json",
		   type:"GET",
		   success: function(data){
			   if(data.status == 200){
				   $("#hostManageDeleteDlg").deleteSuc({
					   title:"提示",
					   content:"取消成功",
					   dialogType:"success",//状态类型：success 成功，failed 失败，或者错误，info提示
				   });
				   //刷新列表
				   model.refreshGridHostManage();
			   }
		   }
		  });
	};
    return model;
})(window.alarmReal || {});
