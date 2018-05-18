/**
 * ------------------------------------------------------------------
 * 平台监控-gbase数据库-Show Process List
 * ------------------------------------------------------------------
 */
var databaseMonitor = (function (model){
        /**
         * @description 获取列表
         * @param  option
         * @return  
         * ------------------------------------------------------------------
         */
        model.loaddatabaseMonitorGrid = function(option) { 
	        	$("#gridDatabaseMonitor").AIGrid({        
	        	   	url:$.ctx + '/api/gb/base/monitor/list/process',
	        		datatype: "json",
	        		postData:{"userId" :model.userId},
	        		colNames:['分类','系统', '用途','集群名称','节点IP','id','User','Host','Command','Time','State','Info','更新时间'/*,'操作'*/],
	        	   	colModel:[
	        	   		{name:'classify',index:'classify', width:50,formatter:$.setNull},//frozen : true固定列
	        	   		{name:'system',index:'system', width:50,align:"center",formatter:$.setNull},
	        	   		{name:'purpose',index:'purpose', width:50, align:"center",formatter:$.setNull},
	        	   		{name:'gbaseGroupName',index:'gbase_group_name', width:50, align:"center",formatter:$.setNull},
	        	   		{name:'nodeIp',index:'node_ip ', width:80, align:"center",formatter:$.setNull},	
	        	   		
	        	   		{name:'processId',index:'process_id', width:60,align:"center",formatter:$.setNull},	
	        	   		{name:'processUser',index:'process_user', width:50,align:"center",formatter:$.setNull},
	        	   		{name:'processHost',index:'process_host',width:80,align:"center",formatter:$.setNull},
	        	   		{name:'processCommand',index:'process_command', width:50, align:"center",formatter:$.setNull},
	        	   		{name:'processTime',index:'process_time',align:"center", width:50,formatter:$.setNull},		
	        	   		{name:'processState',index:'process_state', width:50,align:"center",formatter:$.setNull},
	        	   		{name:'processInfo',index:'process_info', width:50,align:"center",formatter:$.setNull},	
	        	   		{name:'dataTime',index:'data_time', width:60,align:"center",formatter:DateFmt.dataDateFormateMinute},
	        	   		
	        	   		/*{name:'op',index:'op', width:70,title:false, sortable:false,formatter:del,align:"center"}*/		
	        	   	],
	        	   	rowNum:10,
	        	   	rowList:[10,20,30],
	        	   	pager: '#pagerDatabaseMonitor',
	        	   	sortname: '',
	        	    viewrecords: true,
	        	    multiselect:false,
	        	    sord:'',
	        		rownumbers:false,
	        		jsonReader: {
	        			repeatitems : false,
	        			id: "0"
	        		},
	        		height: '100%',
	        		setGroupHeaders:{
						  useColSpanStyle: true, 
						  groupHeaders:[
							{startColumnName: 'classify', numberOfColumns: 5, titleText: 'GBase集群信息'},//<em>Price</em>
							{startColumnName: 'processId', numberOfColumns: 8, titleText: '线程情况'},
						  ]	
				   },
				   afterGridLoad:function(){
	        	    	$("#tableCellInfo,#appTableInfoPanel").addClass("hidden");
	        	    },
	        	});	
	        	//操作
	        	function del(cellvalue, options, rowObject){
	        		var rowObjectStr = JSON.stringify(rowObject) ;
	        		var html='<button type="button" class="btn btn-default  ui-table-btn ui-table-btn" onclick=\'databaseMonitor.showTableCellInfo('+rowObjectStr+')\'>查看</button>';
	        		return html;
	        	}
        }
        return model;
   })(window.databaseMonitor || {});