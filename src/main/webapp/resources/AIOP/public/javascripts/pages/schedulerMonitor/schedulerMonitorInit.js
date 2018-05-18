/***
 * 调度初始化
 */

$(function(){
	$('#runFreq').multiselect({
		nonSelectedText:"选择周期",
		buttonWidth:148,
		nSelectedText:"个选择",
		includeSelectAllOption:false,
		selectAllText: ' 全部',
		onChange:function(element, checked){
			if($(element).val() == "month"){
				DateFmt.loaddatepicker({
					from:"#dataTimeFrom",
					to:"#dataTimeTo",
					dateFormat: "yyyy-MM",
					showButtonPanel: true,
			        minDate:DateFmt.DateCalc(new Date(),"M",-6),
			    	maxDate:DateFmt.DateCalc(new Date(),"M",-1),
			        closeText:"确定" ,
		    		beforeShow :function(){
		    			$.datepicker.dpDiv.addClass("ui-hide-calendar");
		    			$("#ui-datepicker-div .ui-datepicker-year").off("change");
		    		},
			        onClose: function(dateText, inst) {
			            var month = $("#ui-datepicker-div .ui-datepicker-month option:selected").val();//得到选中的月份值
			            var year = $("#ui-datepicker-div .ui-datepicker-year option:selected").val();//得到选中的年份值
			            var dateStr = DateFmt.Formate(DateFmt.parseDate(year+'-'+(parseInt(month)+1)),"yyyy-MM");
			            $(this).val(dateStr);//给input赋值，其中要对月值加1才是实际的月份
			            if(this.id == "dataTimeTo"){
			            	var val = DateFmt.from.val();
			            	DateFmt.from.datepicker( "option", "maxDate", DateFmt.parseDate(this.value ) ).val(val);
			            }else{
			            	var val = DateFmt.to.val();
			            	DateFmt.to.datepicker( "option", "minDate", DateFmt.parseDate(this.value ) ).val(val);
			            }
			        },
					formValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"M",-6),"yyyy-MM"),
					toValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"M",-1),"yyyy-MM")
				});
				
			}else if($(element).val() == "quarter"){
				var currentMonth = DateFmt.DateCalc(new Date(),"q",-1).getMonth()+1;
				var currentYear = DateFmt.DateCalc(new Date(),"q",-1).getFullYear();
				var fromMonth = DateFmt.DateCalc(new Date(),"q",-2).getMonth()+1;
				var fromYear = DateFmt.DateCalc(new Date(),"q",-2).getFullYear();
				var minMonth = DateFmt.DateCalc(new Date(),"y",-1).getMonth()+1;
				var minYear = DateFmt.DateCalc(new Date(),"y",-1).getFullYear();
				var targetDate = {"1":3,"2":3,"3":3,"4":6,"5":6,"6":6,"7":9,"8":9,"9":9,"10":12,"11":12,"12":12};
				DateFmt.loaddatepicker({
					from:"#dataTimeFrom",
					to:"#dataTimeTo",
					dateFormat: "yyyy-MM",
					formValue: DateFmt.Formate(DateFmt.parseDate(fromYear + "-" + targetDate[fromMonth]),"yyyy-MM"),
					toValue:  DateFmt.Formate(DateFmt.parseDate(currentYear + "-" + targetDate[currentMonth]),"yyyy-MM"),
					isClickFuc:true,
					showButtonPanel: true,
 			        minDate:DateFmt.parseDate(minYear + "-" + targetDate[minMonth]),
 			    	maxDate:DateFmt.parseDate(currentYear + "-" + targetDate[currentMonth]),
 			        closeText:"确定",
 			        monthNames : [ '03', '06','09', '12' ],
 			    	monthNamesShort : [  '03', '06', '09','12' ],
 			        onClose: function(dateText, inst) {
 			            var month = $("#ui-datepicker-div .ui-datepicker-month").val();//得到选中的月份值
 			            var year = $("#ui-datepicker-div .ui-datepicker-year option:selected").val();//得到选中的年份值
 			            var dateStr = DateFmt.Formate(DateFmt.parseDate(year+'-'+(parseInt(month))),"yyyy-MM");
 			            $(this).val(dateStr);//给input赋值，其中要对月值加1才是实际的月份
// 			           if(this.id == "dataTimeTo"){
//			            	var val = DateFmt.from.val();
//			            	DateFmt.from.datepicker( "option", "maxDate", DateFmt.parseDate(this.value ) ).val(val);
//			            }else{
//			            	var val = DateFmt.to.val();
//			            	DateFmt.to.datepicker( "option", "minDate", DateFmt.parseDate(this.value ) ).val(val);
//			            }
 			        },
 			        beforeShow :function(){
 		    			$.datepicker.dpDiv.addClass("ui-hide-calendar");
 		    		}
					
				});
			}else if($(element).val() == "week"){
				DateFmt.loaddatepicker({
					from:"#dataTimeFrom",
					to:"#dataTimeTo",
					dateFormat: "yy-mm-dd",
			    	minDate:DateFmt.DateCalc(new Date(),"M",-3),
			    	maxDate:DateFmt.DateCalc(new Date(),"w",-1),
					formValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"M",-3),"yyyy-MM-dd"),
					toValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-1),"yyyy-MM-dd")
				});
			}else{
				DateFmt.loaddatepicker({
					from:"#dataTimeFrom",
					to:"#dataTimeTo",
					dateFormat: "yy-mm-dd",
					minDate:DateFmt.DateCalc(new Date(),"d",-30),
			    		maxDate:DateFmt.DateCalc(new Date(),"d",-1),
					formValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-8),"yyyy-MM-dd"),
					toValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-1),"yyyy-MM-dd")
				});
			}
			
		}
	 });
	$('#priLevel').multiselect({
		nonSelectedText:"选择重要程度",
		buttonWidth:148,
		nSelectedText:"个选择",
		includeSelectAllOption:false,
		selectAllText: ' 全部'
	  });
	
	/**自动补全**/
	$( "#searchSchedulerName" ).AIAutoComplete({
		url:$.ctx + "/api/sched/dispatch/lenovo",
	  	 data:{
		  		 "searchSchedulerName": "search",   // 获取输入框内容
		   },
		  jsonReader:{
			  item:"search",
		  }
	});
	//加载日期控件
	DateFmt.loaddatepicker({
		from:"#actualEndTimeFrom",
		to:"#actualEndTimeTo"
	});
	DateFmt.loaddatepicker({
		from:"#planStartTimeFrom",
		to:"#planStartTimeTo"
	});
	DateFmt.loaddatepicker({
		from:"#planEndTimeFrom",
		to:"#planEndTimeTo"
	});
	DateFmt.loaddatepicker({
		from:"#actualStartTimeFrom",
		to:"#actualStartTimeTo"
	});
	DateFmt.loaddatepicker({
		from:"#dataTimeFrom",
		to:"#dataTimeTo",
		dateFormat: "yy-mm-dd",
    	minDate:DateFmt.DateCalc(new Date(),"d",-30),
    	maxDate:DateFmt.DateCalc(new Date(),"d",-1),
		formValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-8),"yyyy-MM-dd"),
		toValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-1),"yyyy-MM-dd")
	});
	/**
	 * 查询主体列表
	  *查询按钮
	*/
	$("#searchSchedulerList").click(function(){
		var moreQueryIpnut = formFmt.formToObj($("#searchScheduler"));
		var dataTimeFrom = $("#dataTimeFrom").val();
		var dataTimeTo = $("#dataTimeTo").val();
		var search = $("#searchSchedulerName").val();
		var runFreq = $("#runFreq").val();
		moreQueryIpnut.runFreq = runFreq;
		moreQueryIpnut.dataTimeFrom = dataTimeFrom;
		moreQueryIpnut.dataTimeTo = dataTimeTo;
		moreQueryIpnut.search = search;
		schedulerMonitor.loadStatusNumber("#schedulerStatusNumber");
		$("#schedulerList").jqGrid('setGridParam',{ 
            postData:moreQueryIpnut
        },true).trigger("reloadGrid");
		//用来服务器记录log
		$.AILog({
			  "action": "查询",//动作
			  "detail": "",//详情,默认为空
			  "module": "proc_monitor"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    });
	});
	/***
     * 关闭详情页面按钮
     */
	$(".ui-moudle-title i.ui-close-panel").click(function(){
		$(this).parent().parent().addClass("hidden");
	});
	schedulerMonitor.loadSchedulerGrid({
		dataTimeFrom:$("#dataTimeFrom").val(),
		dataTimeTo:$("#dataTimeTo").val(),
		runFreq:$('#runFreq').val()
	});
	schedulerMonitor.loadStatusNumber("#schedulerStatusNumber");
	schedulerMonitor.loadStatusList("#runRtatus");
});