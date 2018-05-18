/**
 * ------------------------------------------------------------------
 * 平台监控-数据库监控
 * ------------------------------------------------------------------
 */
var databaseMonitor = (function (model){
        /**
         * @description 获取列表 - INnoDb监控
         * @param  option
         * @return  
         * ------------------------------------------------------------------
         */
        model.loaddatabaseMonitorGrid = function(option) { 
	        	$("#gridDatabaseMonitor").AIGrid({        
	        	   	url:$.ctx + '/api/db/base/monitor/list/innerdb',
	        		datatype: "json",
	        		postData:{"userId" :model.userId},
	        		colNames:['分类','系统', '用途','数据库名称','数据库IP','数据库版本','启动时间','连通状态','total','data','dirty','flushed','free','capacity','read_thread','write_thread','read','insert','update','delete','操作'],
	        	   	colModel:[
	        	   		{name:'classify',index:'classify', width:50},//frozen : true固定列
	        	   		{name:'system',index:'system', width:50,align:"center"},
	        	   		{name:'purpose',index:'purpose', width:50, align:"center"},
	        	   		{name:'dbName',index:'db_name', width:50, align:"center"},
	        	   		{name:'dbIpAddr',index:'db_ip_addr ', width:80, align:"center"},		
	        	   		{name:'dbVersion',index:'db_version', width:50,align:"center",formatter:$.setNull},
	        	   		{name:'startTime',index:'start_time',width:80,align:"center",formatter:DateFmt.dataDateFormateMinute},
	        	   		{name:'dbStatus',index:'db_status ', width:50, align:"center",formatter:$.setIsOn},
	        	   		
	        	   		{name:'bufferPoolInstances',index:'buffer_pool_instances',align:"center", width:50,formatter:$.setNull},		
	        	   		{name:'bufferPoolSize',index:'buffer_pool_size', width:50,align:"center",formatter:$.setNull},
	        	   		
	        	   		
	        	   		{name:'bufferPoolPagesDirty',index:'buffer_pool_pages_dirty', width:60,align:"center",formatter:$.setNull},	
	        	   		{name:'bufferPoolPagesFlushed',index:'buffer_pool_pages_flushed', width:60,align:"center",formatter:$.setNull},
	        	   		{name:'bufferPoolPagesFree',index:'buffer_pool_pages_free', width:60,align:"center",formatter:$.setNull},
	        	   		
	        	   		{name:'ioCapacity',index:'io_capacity', width:60,align:"center",formatter:$.setNull},
	        	   		{name:'readIOThreads',index:'read_io_threads', width:60,align:"center",formatter:$.setNull},
	        	   		{name:'writeIOThreads',index:'write_io_threads', width:60,align:"center",formatter:$.setNull},
	        	   		
	        	   		{name:'rowsRead',index:'rows_read', width:40,align:"center",formatter:$.setNull},
	        	   		{name:'rowsInserted',index:'rows_inserted', width:40,align:"center",formatter:$.setNull},
	        	   		{name:'rowsUpdated',index:'rows_updated', width:40,align:"center",formatter:$.setNull},
	        	   		{name:'rowsDeleted',index:'rows_deleted', width:40,align:"center",formatter:$.setNull},
	        	   		
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
							{startColumnName: 'bufferPoolInstances', numberOfColumns: 2, titleText: 'Innodb_buffer_pool'},
							{startColumnName: 'bufferPoolPagesDirty', numberOfColumns: 3, titleText: 'Pages'},
							{startColumnName: 'ioCapacity', numberOfColumns: 3, titleText: 'IO'},
							{startColumnName: 'rowsRead', numberOfColumns: 4, titleText: 'Innodb_rows'}
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