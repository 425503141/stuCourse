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
	        	   	url:$.ctx + '/api/gb/base/monitor/list/storage',
	        		datatype: "json",
	        		postData:{"userId" :model.userId},
	        		colNames:['分类','系统', '用途','集群名称','节点IP','目录名称','总空间','已用空间','空闲空间','已用利用率','挂载目录','更新时间'/*,'操作'*/],
	        	   	colModel:[
	        	   		{name:'classify',index:'classify', width:50,formatter:$.setNull},//frozen : true固定列
	        	   		{name:'system',index:'system', width:50,align:"center",formatter:$.setNull},
	        	   		{name:'purpose',index:'purpose', width:50, align:"center",formatter:$.setNull},
	        	   		{name:'gbaseGroupName',index:'gbase_group_name', width:50, align:"center",formatter:$.setNull},
	        	   		{name:'nodeIp',index:'node_ip ', width:80, align:"center",formatter:$.setNull},	
	        	   		
	        	   		{name:'pathName',index:'path_name', width:60,align:"center",formatter:$.setNull},	
	        	   		{name:'spaceTotal',index:'space_total', width:50,align:"center",formatter:$.setNull},
	        	   		{name:'spaceUsed',index:'space_used',width:80,align:"center",formatter:$.setNull},
	        	   		{name:'spaceFree',index:'space_free', width:50, align:"center",formatter:$.setNull},
	        	   		{name:'utilizationrate',index:'utilizationrate',align:"center", width:50,formatter:$.setNull},		
	        	   		{name:'mountPath',index:'mount_path', width:50,align:"center",formatter:$.setNull},	
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
							{startColumnName: 'pathName', numberOfColumns: 7, titleText: '空间情况'},
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