/**
 * ------------------------------------------------------------------
 * 权限管理 
 * ------------------------------------------------------------------
 */
var rightsManage=(function (model){ 
	/**
     * @description 获取权限列表
    */
	model.loadRightsGrid = function(option) {
		$("#rightsGrid").AIGrid({        
			   	url:$.ctx+'/api/sys/auth/list',
				datatype: "json",
				postData :{/* page:1,rowNumber:10 */},
			   	colNames:['权限名称', '实时监控', '历史监控','调度监控','一经监控','二经监控','应用管理','用户管理','用户组管理','权限管理','操作日志','数据源配置'],
			   	colModel:[
			   		{name:'authName', index:'auth_name',width:100, align:"center",sortable:false,},
			   		{name:'appMonitorRealtime',index:'app_monitor_realtime',align:"center",width:90,formatter:judge},
			   		{name:'appMonitorHistory',index:'app_monitor_history',width:90, align:"center",formatter:judge},
			   		{name:'procMonitor',index:'proc_monitor',align:"center",width:100,formatter:judge},
			   		{name:'interfaceMonitorInbound', index:'interface_monitor_inbound',width:90, align:"center",formatter:judge},
			   		{name:'interfaceMonitorPush',index:'interface_monitor_push',align:"center",width:90,formatter:judge},	
			   		{name:'sysManageApp', index:'sys_manage_app', width:100,align:"center",formatter:judge},	
			   		{name:'sysManageUser',index:'sys_manage_user',width:100,align:"center",formatter:judge},		
			   		{name:'sysManageGroup', index:'sys_manage_group',width:100,align:"center",formatter:judge},		  			
			   		{name:'sysManageAuth',index:'sys_manage_auth',width:100,align:"center",formatter:judge},			
			   		{name:'sysManageLog',index:'sys_manage_log',width:100,align:"center",formatter:judge},
			   		{name:'sysDbSetting',index:'sys_db_setting',width:100,align:"center",formatter:judge}
			   	],
			   	rowNum:10,
			   	rowList:[10,20,30],
			   	pager: '#pjmap', 
			   	sortname: 'invdate',
			    viewrecords: true,
			    multiselect:false,
				rownumbers: false,
			    sortorder: "desc",
				jsonReader: {
					repeatitems : false,
					id: "0",
				},
				height: '100%',
				'setGroupHeaders':{
					  useColSpanStyle: true, 
					  groupHeaders:[
						{startColumnName: 'appMonitorRealtime', numberOfColumns: 2, titleText: '应用监控'},//<em>Price</em>
						{startColumnName: 'interfaceMonitorInbound', numberOfColumns: 2, titleText: '接口监控'},
						{startColumnName: 'sysManageApp', numberOfColumns: 6, titleText: '系统管理'}
					  ]	
			   }
			});
			function del(){
				var html='<button type="button" class="btn btn-default  ui-table-btn ui-table-btn">删除</button><button type="button" class="btn btn-default ui-table-btn">修改</button>';
				return html;
			}
			function judge(cellvalue){
				var yes='<span>&radic;</span>';
				var no='<span>&ndash;</span>';
				if(cellvalue == "1"){
					return yes;
				}
				else{
					return no;
				}
			}
	}
	
	
	
	return model;
	
})(window.rightsManage || {});