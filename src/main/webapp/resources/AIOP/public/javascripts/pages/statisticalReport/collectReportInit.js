/**
 *调度计划处理时间
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
					from:"#dateTime",
					to:"#dataTimeTo",
					dateFormat: "yyyy-MM",
					showButtonPanel: true,
//			        minDate:DateFmt.DateCalc(new Date(),"M",-6),
			    	maxDate:DateFmt.DateCalc(new Date(),"M",0),
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
					formValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"M",0),"yyyy-MM"),
					toValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"M",0),"yyyy-MM")
				});
				
			}else{
				DateFmt.loaddatepicker({
					from:"#dateTime",
					to:"#dataTimeTo",
					dateFormat: "yy-mm-dd",
//					minDate:DateFmt.DateCalc(new Date(),"d",-30),
			    		maxDate:DateFmt.DateCalc(new Date(),"d",-1),
					formValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",0),"yyyy-MM-dd"),
					toValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-1),"yyyy-MM-dd")
				});
			}
			
		}
	 });
	
	//加载日期控件

	DateFmt.loaddatepicker({
		from:"#dateTime",
		to:"#dataTimeTo",
		dateFormat: "yy-mm-dd",
//    	minDate:DateFmt.DateCalc(new Date(),"d",-30),
    	maxDate:DateFmt.DateCalc(new Date(),"d",-1),
		formValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-8),"yyyy-MM-dd"),
		toValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-1),"yyyy-MM-dd")
	});
	
	//统计日期
	$("#dateTime").val(DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-0),"yyyy-MM-dd")).datepicker({
		//minDate:DateFmt.DateCalddc(new Date(),"d",-31),
		changeMonth: true,
		changeYear: true,
		numberOfMonths:1,
		dateFormat: "yy-mm-dd",
		beforeShow :function(){
			$.datepicker.dpDiv.addClass("ui-datepicker-box");
		}
	});
	schedulePlanProcessing.loadGridSchedulePlanProcessing();//加载列表
	//全部分类
	schedulePlanProcessing.loadAllTypeList();
	$("#allTypeBtn").click(function(){
		if($(this).hasClass("active")){
			$(this).removeClass("active");
			$("#allTypeZtreeDlg").addClass("hidden");
		}else{
			$(this).addClass("active");
			$("#allTypeZtreeDlg").removeClass("hidden");
		}
	});
	//查询按钮
	$("#searchBtn").click(function(){
		var moreQueryIpnut = {"statisticDate" :$('#dateTime').val(),"circle" :$('#runFreq').val()};
		$("#gridSchedulePlanProcessing").jqGrid('setGridParam',{ 
            postData:moreQueryIpnut,page:1
        }).trigger("reloadGrid");
		$("#ui-grid-table1").jqGrid('setGridParam',{ 
            postData:moreQueryIpnut,page:1
        }).trigger("reloadGrid");
		$("#ui-grid-table2").jqGrid('setGridParam',{ 
            postData:moreQueryIpnut,page:1
        }).trigger("reloadGrid");
		$("#labelMarketData").jqGrid('setGridParam',{ 
            postData:moreQueryIpnut,page:1
        }).trigger("reloadGrid");
		$("#yijingInterface").jqGrid('setGridParam',{ 
            postData:moreQueryIpnut,page:1
        }).trigger("reloadGrid");
		$("#timeIntervalList").jqGrid('setGridParam',{ 
            postData:moreQueryIpnut,page:1
        }).trigger("reloadGrid");
		//用来服务器记录log
		/*$.AILog({
			  "action": "查询",//动作
			  "detail": "",//详情,默认为空
			  "module": "app_monitor_history"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    });*/
	});
	//全部下载按钮
	$("#downloadBtn").click(function(){
		var moreQueryIpnut = {"statisticDate" :$('#dateTime').val(),"circle" :$('#runFreq').val()};
		var ssg = window.sessionStorage;
	    var token="";
		if(ssg){
			token = ssg.getItem("token");
			if(token){
				moreQueryIpnut["token"]= token;
				moreQueryIpnut = $.convertData(moreQueryIpnut);
				window.open(encodeURI(encodeURI($.ctx + "/api/collectReport/report/sumery/export?"+moreQueryIpnut)));
			}
		}
		//用来服务器记录log
		/*$.AILog({
			  "action": "查询",//动作
			  "detail": "",//详情,默认为空
			  "module": "app_monitor_history"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    });*/
	});
	$("#downSimpleBtn").click(function(){
		var moreQueryIpnut = {"statisticDate" :$('#dateTime').val(),"circle" :$('#runFreq').val()};
		var ssg = window.sessionStorage;
	    var token="";
		if(ssg){
			token = ssg.getItem("token");
			if(token){
				moreQueryIpnut["token"]= token;
				moreQueryIpnut = $.convertData(moreQueryIpnut);
				window.open(encodeURI(encodeURI($.ctx + "/api/collectReport/report/list/export?"+moreQueryIpnut)));
			}
		}
	});
});