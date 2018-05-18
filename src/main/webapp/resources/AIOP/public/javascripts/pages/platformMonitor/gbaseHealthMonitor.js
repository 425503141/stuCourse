/**
 * ------------------------------------------------------------------
 * 平台监控-gbase数据库-gbase健康监控
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
	        	   	url:$.ctx + '/api/gb/base/monitor/list/health',
	        		datatype: "json",
	        		postData:{"userId" :model.userId},
	        		colNames:['分类','系统', '用途','集群名称','节点IP','gcware','gcluster','DataState','gnode','syncserver','DataState','接收字节数','发送字节数','更新时间'/*,'操作'*/],
	        	   	colModel:[
	        	   		{name:'classify',index:'classify', width:50,formatter:$.setNull},//frozen : true固定列
	        	   		{name:'system',index:'system', width:50,align:"center",formatter:$.setNull},
	        	   		{name:'purpose',index:'purpose', width:50, align:"center",formatter:$.setNull},
	        	   		{name:'gbaseGroupName',index:'gbase_group_name', width:50, align:"center",formatter:$.setNull},
	        	   		{name:'nodeIp',index:'node_ip ', width:80, align:"center",formatter:$.setNull},	
	        	   		
	        	   		{name:'coorGware',index:'coor_gcware', width:50,align:"center",formatter:$.setNull},
	        	   		{name:'coorGcluster',index:'coor_gcluster',width:80,align:"center",formatter:$.setNull},
	        	   		{name:'coorDatastate',index:'coor_datastate', width:50, align:"center",formatter:$.setNull},
	        	   		
	        	   		{name:'dataGnode',index:'data_gnode',align:"center", width:50,formatter:$.setNull},		
	        	   		{name:'dataSyncserver',index:'data_syncserver', width:50,align:"center",formatter:$.setNull},	
	        	   		{name:'dataDatastate',index:'data_datastate', width:60,align:"center",formatter:$.setNull},	
	        	   		
	        	   		{name:'bytesReceived',index:'bytes_received', width:60,align:"center",formatter:$.setNull},
	        	   		{name:'bytesSent',index:'bytes_sent', width:60,align:"center",formatter:$.setNull},
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
							{startColumnName: 'coorGware', numberOfColumns: 3, titleText: 'COORDINATOR'},
							{startColumnName: 'dataGnode', numberOfColumns: 3, titleText: 'DATA'},
							{startColumnName: 'bytesReceived', numberOfColumns: 3, titleText: '网络'},
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