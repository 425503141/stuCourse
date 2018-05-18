/**
 * ------------------------------------------------------------------
 * 调度计划处理时间
 * ------------------------------------------------------------------
 */
var schedulePlanProcessing = (function (model){
        /**
         * @description 获取列表
         * @param  option
         * @return  
         * ------------------------------------------------------------------
         */
        model.loadGridSchedulePlanProcessing = function(option) { 
	        	$("#gridSchedulePlanProcessing").AIGrid({        
	        	   	url:$.ctx + '/api/interReport/inter/list',
	        		datatype: "json",
	        		postData:{"statisticDate" :$('#dateTime').val(),"circle" :$('#runFreq').val()},
	        		colNames:['序号','接口编码','接口来源', '接口表名','接口名称','文件计划到达时间','文件实际到达时间','Load计划完成时间','Load实际完成时间','状态'],
	        	   	colModel:[
	        	   		{name:'serialNbr',index:'row_rum', width:40,align:"center",sortable:false,formatter:$.setNull},//frozen : true固定列
	        	   		{name:'interfaceCode',index:'interface_code', width:80,align:"center",sortable:false,formatter:$.setNull},
	        	   		{name:'interfaceSource',index:'interface_source_name', width:80,align:"center",sortable:false,formatter:$.setNull},
	        	   		{name:'interfaceTable',index:'interface_table_name', width:80, align:"center",sortable:false,formatter:$.setNull},
	        	   		{name:'interfaceName',index:'interface_name', width:80, align:"center",sortable:false,formatter:$.setNull},
	        	   		{name:'filePlanArriveTime',index:'file_plan_arrive_time',width:80,align:"center",sortable:false,formatter:DateFmt.dataDateFormateMinute},
	        	   		{name:'fileActualArriveTime',index:'file_actual_arrive_time', width:80, align:"center",sortable:false,formatter:DateFmt.dataDateFormateMinute},
	        	   		{name:'loadPlanEndTime',index:'load_plan_end_time',width:80,align:"center",sortable:false,formatter:DateFmt.dataDateFormateMinute},
	        	   		{name:'loadActualEndTime',index:'load_actual_end_time', width:80, align:"center",sortable:false,formatter:DateFmt.dataDateFormateMinute},
	        	   		{name:'statusName',index:'status_name', width:50, align:"center",sortable:false,formatter:$.setNull},		
	        	   	],
	        	   	rowNum:10,
	        	   	rowList:[10,20,30],
	        	   	pager: '#pagerSchedulePlanProcessing',
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
	        		showNoResult:true//是否展示无数据时的样式
	        	});	
	        	function formateRunFreq(cellvalue, options, rowObject){
	        		var runFreq = rowObject.runFreq;
	        		var runFreqObj =$.runFreqObj;
	        		return runFreqObj[runFreq] || runFreq;
	        	}
        }
        /***
	     * 获取左侧树形导航dd
	     */
	   model.loadAllTypeList = function() {
		    	var ztreeObj = new Ztree();
		    	var navNodes = [
		    		{"id":"1","name":"经分报表","url":"","pid":"0"},
		    		{"id":"1-1-1","name":"调度计划处理时间","url":$.ctx+"/statisticalReport/schedulePlanProcessing.min.html","pid":"1"},
		    		{"id":"1-1-2","name":"汇总情况报表","url":$.ctx+"/statisticalReport/collectReport.min.html","pid":"1"},
		    		{"id":"1-1-3","name":"接口运行计划时间","url":$.ctx+"/statisticalReport/circulatePlanProcessing.min.html","pid":"1"},
		    		]
		    	ztreeObj.init({
		    		id:"appType",
		    		setting:{
		    			view: {
		    				selectedMulti: false,
		    			},
		    			callback: {
		    				onClick: function(event, treeId, treeNode){
		    					//点击切换页面
		    					if(treeNode.url){
		    					}
		    				}
		    			},
		    			data: {
		    				simpleData: {
		    					enable: true,
		    					idKey: "id",
		    					pIdKey: "pid",
		    					rootPId: 0
		    				}
		    			}
		    		},
		    		treeData:navNodes,
		    		expandAll:true
		    	});
	    };
        return model;
   })(window.schedulePlanProcessing || {});