/**
 * ------------------------------------------------------------------
 * 平台监控-数据库监控
 * ------------------------------------------------------------------
 */
var databaseMonitor = (function (model){
        /**
         * @description 获取列表 - 资源监控
         * @param  option
         * @return  
         * ------------------------------------------------------------------
         */
        model.loaddatabaseMonitorGrid = function(option) { 
	        	$("#gridDatabaseMonitor").AIGrid({        
	        	   	url:$.ctx + '/api/db/base/monitor/list/resource',
	        		datatype: "json",
	        		postData:{"userId" :model.userId},
	        		colNames:['分类','系统', '用途','数据库名称','数据库IP','数据库版本','启动时间','连通状态','最大连接数','连接线程数','最大连接错误数','最大打开文件数','已打开文件数','表缓存数','已打开表','操作'],
	        	   	colModel:[
	        	   		{name:'classify',index:'classify', width:50},//frozen : true固定列
	        	   		{name:'system',index:'system', width:50,align:"center"},
	        	   		{name:'purpose',index:'purpose', width:50, align:"center"},
	        	   		{name:'dbName',index:'db_name', width:50, align:"center"},
	        	   		{name:'dbIpAddr',index:'db_ip_addr ', width:80, align:"center"},		
	        	   		{name:'dbVersion',index:'db_version', width:50,align:"center",formatter:$.setNull},
	        	   		{name:'startTime',index:'start_time',width:80,align:"center",formatter:DateFmt.dataDateFormateMinute},
	        	   		{name:'dbStatus',index:'db_status ', width:50, align:"center",formatter:$.setIsOn},
	        	   		
	        	   		{name:'maxConnections',index:'max_connections',align:"center", width:50,formatter:$.setNull},		
	        	   		{name:'threadsConnected',index:'threads_connected', width:50,align:"center",formatter:$.setNull},	
	        	   		{name:'abortedConnections',index:'aborted_connections', width:60,align:"center",formatter:$.setNull},	
	        	   		
	        	   		{name:'openFilesLimit',index:'open_files_limit', width:60,align:"center",formatter:$.setNull},
	        	   		{name:'openFiles',index:'open_files', width:60,align:"center",formatter:$.setNull},
	        	   		
	        	   		{name:'totalTables',index:'total_tables', width:60,align:"center",formatter:$.setNull},
	        	   		{name:'openTables',index:'open_tables', width:60,align:"center",formatter:$.setNull},
	        	   		
	        	   		{name:'op',index:'op', width:70,title:false, sortable:false,formatter:del,align:"center"}		
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
							{startColumnName: 'classify', numberOfColumns: 8, titleText: '数据库信息'},//<em>Price</em>
							{startColumnName: 'maxConnections', numberOfColumns: 3, titleText: '连接池资源'},
							{startColumnName: 'openFilesLimit', numberOfColumns: 2, titleText: '文件资源'},
							{startColumnName: 'totalTables', numberOfColumns: 2, titleText: '表资源'},
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