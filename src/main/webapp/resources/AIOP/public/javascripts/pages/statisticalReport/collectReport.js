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
	        	   	url:$.ctx + '/api/collectReport/report/list',
	        		datatype: "json",
	        		postData:{"statisticDate" :$('#dateTime').val(),"circle" :$('#runFreq').val()},
	        		colNames:['应用分类','应用总数','按时完成个数', '延迟完成个数','未完成个数','下线个数'],
	        	   	colModel:[
	        	   		{name:'classifyName',index:'full_path_name', width:40,align:"center",sortable:false,formatter:$.setNull},//frozen : true固定列
	        	   		{name:'appCount',index:'app_count', width:40,align:"center",sortable:false,formatter:$.setNull},
	        	   		{name:'achieveCount',index:'achieve_count', width:80,align:"center",sortable:false,formatter:$.setNull},
	        	   		{name:'delayedCount',index:'app_classify_name', width:80,align:"center",sortable:false,formatter:$.setNull},
	        	   		{name:'uncompletedCount',index:'termination_count', width:80, align:"center",sortable:false,formatter:$.setNull},
	        	   		{name:'terminationCount',index:'proc_name_en', width:80, align:"center",sortable:false,formatter:$.setNull}	
	        	   	],
	        	   	rowNum:-1,
//	        	   	rowList:[10,20,30],
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
	        	$("#ui-grid-table1").AIGrid({        
	        	   	url:$.ctx + '/api/collectReport/report/inter',
	        		datatype: "json",
	        		postData:{"statisticDate" :$('#dateTime').val(),"circle" :$('#runFreq').val()},
	        		colNames:[' 接口类型',' 接口总数','正常入库接口个数','延迟入库接口个数', '未入库接口个数'],
	        	   	colModel:[
	        	   		{name:'interface_date_type',index:'interface_date_type', width:40,align:"center",sortable:false,formatter:$.setNull},//frozen : true固定列
	        	   		{name:'inter_count',index:'inter_count', width:40,align:"center",sortable:false,formatter:$.setNull},//frozen : true固定列
	        	   		{name:'less_count',index:'less_count', width:40,align:"center",sortable:false,formatter:$.setNull},
	        	   		{name:'greater_count',index:'greater_count', width:80,align:"center",sortable:false,formatter:$.setNull},
	        	   		{name:'null_count',index:'null_count', width:80,align:"center",sortable:false,formatter:$.setNull}
	        	   	],
	        	   	rowNum:-1,
//	        	   	rowList:[10,20,30],
	        	   	pager: '#ui-grid-pager1',
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
	        	$("#labelMarketData").AIGrid({        
	        	   	url:$.ctx + '/api/collectReport/report/market/collect',
	        		datatype: "json",
	        		postData:{"statisticDate" :$('#dateTime').val(),"circle" :$('#runFreq').val()},
	        		colNames:[' 集市更新总数',' 正常更新个数','延迟更新个数','延迟未更新个数'],
	        	   	colModel:[
	        	   		{name:'market_count',index:'market_count', width:40,align:"center",sortable:false,formatter:$.setNull},//frozen : true固定列
	        	   		{name:'market_achieve_count',index:'market_achieve_count', width:40,align:"center",sortable:false,formatter:$.setNull},//frozen : true固定列
	        	   		{name:'market_delayed_count',index:'market_delayed_count', width:40,align:"center",sortable:false,formatter:$.setNull},
	        	   		{name:'market_uncompleted_count',index:'market_uncompleted_count', width:80,align:"center",sortable:false,formatter:$.setNull}
	        	   	],
	        	   	rowNum:-1,
//	        	   	rowList:[10,20,30],
	        	   	//pager: '#ui-grid-pager1',
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
	        	$("#yijingInterface").AIGrid({        
	        	   	url:$.ctx + '/api/collectReport/report/partone/collect',
	        		datatype: "json",
	        		postData:{"statisticDate" :$('#dateTime').val(),"circle" :$('#runFreq').val()},
	        		colNames:[' 接口类型',' 接口总数','正常入库接口个数','延迟入库接口个数','未入库接口个数'],
	        	   	colModel:[
	        	   		{name:'unit_type',index:'unit_type', width:40,align:"center",sortable:false,formatter:$.setNull},//frozen : true固定列
	        	   		{name:'total_count',index:'total_count', width:40,align:"center",sortable:false,formatter:$.setNull},//frozen : true固定列
	        	   		{name:'achieve_count',index:'achieve_count', width:40,align:"center",sortable:false,formatter:$.setNull},//frozen : true固定列
	        	   		{name:'delay_count',index:'delay_count', width:40,align:"center",sortable:false,formatter:$.setNull},//frozen : true固定列
	        	   		{name:'without_count',index:'without_count', width:40,align:"center",sortable:false,formatter:$.setNull},//frozen : true固定列
	        	   	],
	        	   	rowNum:-1,
//	        	   	rowList:[10,20,30],
	        	   	//pager: '#ui-grid-pager1',
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
	        	$("#ui-grid-table2").AIGrid({        
	        	   	url:$.ctx + '/api/collectReport/report/afect',
	        		datatype: "json",
	        		postData:{"statisticDate" :$('#dateTime').val(),"circle" :$('#runFreq').val()},
	        		colNames:[' 问题','影响应用个数','应用分类', '影响应用'],
	        	   	colModel:[
	        	   		{name:'descr',index:'descr', width:40,align:"center",sortable:false,formatter:$.setNull},//frozen : true固定列
	        	   		{name:'aft_nbr',index:'aft_nbr', width:40,align:"center",sortable:false,formatter:$.setNull},
	        	   		{name:'app_classify_name',index:'app_classify_name', width:80,align:"center",sortable:false,formatter:$.setNull},
	        	   		{name:'app_name',index:'app_name', width:80,align:"center",sortable:false,formatter:$.setNull}
	        	   	],
	        	   	rowNum:-1,
//	        	   	rowList:[10,20,30],
	        	   	pager: '#ui-grid-pager2',
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
	        	$.AIGet({
	        		url:$.ctx + "/api/collectReport/report/slot/collect",
	    			datatype:"json",
	    			success:function(result){
	    				//console.log(result.data);
	    				var colNames=['应用分类'];
	    				var colModel=[{
	    					name:'app_classify_name',
	    					index:'app_classify_name', 
	    					width:40,
	    					align:"center",
	    					sortable:false,
	    					formatter:$.setNull
	    				}];
	    				for(var i=0;i<result.data.length;i++){
	    					colNames.push(result.data[i].time_slot_desc);
	    					var string='sect'+result.data[i].time_slot_order;
	    					//console.log('sect'+result.data[i].time_slot_order)
	    					colModel.push({
		    					name:string,
		    					index:string, 
		    					width:40,
		    					align:"center",
		    					sortable:false,
//		    					formatter:$.setNull
		    				})
	    				}
	    				$("#timeIntervalList").AIGrid({        
	    	        	   	url:$.ctx + '/api/collectReport/report/section/collect',
	    	        		datatype: "json",
	    	        		postData:{"statisticDate" :$('#dateTime').val(),"circle" :$('#runFreq').val()},
	    	        		colNames:colNames,
	    	        	   	colModel:colModel,
	    	        	   	rowNum:-1,
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
	    			}
	        	});
        }
        
        /***
	     * 获取左侧树形dd导航
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