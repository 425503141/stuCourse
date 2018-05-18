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
	        	   	url:$.ctx + '/api/statisticsReport/appRunStatistics/list',
	        		datatype: "json",
	        		postData:{"statisticDate" :$('#dateTime').val(),"circle" :$('#runFreq').val()},
	        		colNames:['序号','数据日期','应用分类', '应用名称','程序英文名称','周期','偏移量','计划完成时间','实际完成时间','状态',"未完成原因"],
	        	   	colModel:[
	        	   		{name:'rowNum',index:'row_rum', width:40,align:"center",sortable:false,formatter:$.setNull},//frozen : true固定列
	        	   		{name:'dataTime',index:'data_time', width:80,align:"center",sortable:false,formatter:DateFmt.dataDateFormate},
	        	   		{name:'appClassifyName',index:'app_classify_name', width:80,align:"center",sortable:false,formatter:$.setNull},
	        	   		{name:'appName',index:'app_name', width:80, align:"center",sortable:false,formatter:$.setNull},
	        	   		{name:'procNameEn',index:'proc_name_en', width:80, align:"center",sortable:false,formatter:$.setNull},
	        	   		{name:'runFreq',index:'run_freq', width:50, align:"center",sortable:false,formatter:formateRunFreq},		
	        	   		{name:'dateArgs',index:'date_args', width:50,align:"center",sortable:false,formatter:$.setNull},
	        	   		{name:'planEndTime',index:'plan_end_time',width:80,align:"center",sortable:false,formatter:DateFmt.dataDateFormateMinute},
	        	   		{name:'actualEndTime',index:'actual_end_time', width:80, align:"center",sortable:false,formatter:DateFmt.dataDateFormateMinute},
	        	   		{name:'statusName',index:'status_name', width:80,align:"center",sortable:false,formatter:$.setNull},
	        	   		{name:'incompleteReason',index:'incomplete_reason', width:100,align:"center",sortable:false,formatter:$.setNull},
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
	     * 获取左侧树形导航
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