/**
 *作者：wangsen3 
 *一经监控入口 
 */
$(function(){

	
	//接口类型下拉
	$('#cycleType').multiselect({
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
				
			}else if($(element).val() == "day"){
				DateFmt.loaddatepicker({
					from:"#dataTimeFrom",
					to:"#dataTimeTo",
					dateFormat: "yy-mm-dd",
					minDate:DateFmt.DateCalc(new Date(),"d",-30),
			    		maxDate:DateFmt.DateCalc(new Date(),"d",-1),
					formValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-8),"yyyy-MM-dd"),
					toValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-1),"yyyy-MM-dd")
				});
			}else{//选择全部
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
	
	/**自动补全**/
	$( "#searchEngines" ).AIAutoComplete({
		url:$.ctx + "/api/first/partone/assco",
	  	 data:{
		       "searchEngines": "searchEngines"  //"前端页面ID"："后台传参"
//		       "dateTime": "dateTime"
		   },
		  jsonReader:{
			  item:"search",
		  }
	});
	yijingMonitor.loaddatepicker({
		from:"#statDateFrom",
		to:"#statDateTo"
	});
	yijingMonitor.loaddatepicker({
		from:"#dataTimeFrom",
		to:"#dataTimeTo"
	});
	yijingMonitor.loaddatepicker({
		from:"#uploadActualMinTime",
		to:"#uploadActualMaxTime"
	});
	yijingMonitor.loaddatepicker({
		from:"#fileReturnMinTime",
		to:"#fileReturnMaxTime"
	});
	yijingMonitor.loaddatepicker({
		from:"#recordReturnMinTime",
		to:"#recordReturnMaxTime"
	});
//	$('#cycleType').multiselect({
//		nonSelectedText:"--请选择--",
//		buttonWidth:148,
//		nSelectedText:"个选择",
//		includeSelectAllOption:false,
//	  });
	$("#dataTime").datepicker({
	    	//defaultDate: "+1w",
	    	changeMonth: true,
	    	numberOfMonths:1,
	    	dateFormat: "yy-mm-dd",
		beforeShow :function(){
			$.datepicker.dpDiv.removeClass("ui-hide-calendar");
		}
    });
	DateFmt.loaddatepicker({
		from:"#statDateFrom",
		to:"#statDateTo",
		dateFormat: "yy-mm-dd",
//    	minDate:DateFmt.DateCalc(new Date(),"d",-30),
//    	maxDate:DateFmt.DateCalc(new Date(),"d",-1),
		formValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-7),"yyyy-MM-dd"),
		toValue: DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",0),"yyyy-MM-dd")
	});
	$("#dateTime").val(DateFmt.Formate(DateFmt.DateCalc(new Date(),"d",-1),"yyyy-MM-dd")).datepicker({
		minDate:DateFmt.DateCalc(new Date(),"d",-31),
		changeMonth: true,
		numberOfMonths:1,
		dateFormat: "yy-mm-dd",
		beforeShow :function(){
			$.datepicker.dpDiv.removeClass("ui-hide-calendar");
		}
	});
	$("#searchyijing").click(function(){
		var moreQueryIpnut = formFmt.formToObj($("#yijingSearchList"));
		var dataTimeFrom = $("#dataTimeFrom").val();
		var dataTimeTo = $("#dataTimeTo").val();
		var statDateFrom = $("#statDateFrom").val();
		var statDateTo = $("#statDateTo").val();
		var searchEngines = $("#searchEngines").val();
		var interfaceType = $("#cycleType").val();
		moreQueryIpnut.unitType = interfaceType;
		moreQueryIpnut.txDateFrom = dataTimeFrom;
		moreQueryIpnut.txDateTo = dataTimeTo;
		moreQueryIpnut.statDateFrom = statDateFrom;
		moreQueryIpnut.statDateTo = statDateTo;
		moreQueryIpnut.search = searchEngines;
		yijingMonitor.loadStateList(moreQueryIpnut);
		$("#yijngGrid").jqGrid('setGridParam',{ 
            postData:moreQueryIpnut
        },true).trigger("reloadGrid");
		//用来服务器记录log
		$.AILog({
			  "action": "查询",//动作
			  "detail": "",//详情,默认为空
			  "module": "interface_monitor_inbound"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    });
	});
	//导出
	$("#opBtn").off("click").on("click",function(){
		var moreQueryIpnut = formFmt.formToObj($("#yijingSearchList"));
		var dataTimeFrom = $("#dataTimeFrom").val();
		var dataTimeTo = $("#dataTimeTo").val();
		var searchEngines = $("#searchEngines").val();
		var interfaceType = $("#cycleType").val();
		var statDateFrom = $("#statDateFrom").val();
		var statDateTo = $("#statDateTo").val();
		moreQueryIpnut.unitType = interfaceType;
		moreQueryIpnut.txDateFrom = dataTimeFrom;
		moreQueryIpnut.txDateTo = dataTimeTo;
		moreQueryIpnut.statDateFrom = statDateFrom;
		moreQueryIpnut.statDateTo = statDateTo;
		moreQueryIpnut.search = searchEngines;
		var colModel = $("#yijngGrid").jqGrid('getGridParam',"colModel");
		var colArr = [];
		for(var i = 0; i < colModel.length; i++){
			if(colModel[i].name != "handle"){
				colArr.push(colModel[i].name);
			}
		}
		moreQueryIpnut.column = colArr.join(',');
		var ssg = window.sessionStorage;
	    var token="";
		if(ssg){
			token = ssg.getItem("token");
			if(token){
				moreQueryIpnut["token"]= token;
				moreQueryIpnut = $.convertData(moreQueryIpnut);
				window.open(encodeURI(encodeURI($.ctx + "/api/first/partone/export?"+moreQueryIpnut)));
			}
		}
		//用来服务器记录log
		$.AILog({
			  "action": "导出",//动作
			  "detail": "",//详情,默认为空
			  "module": "interface_monitor_inbound"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    });
	});
	
	
	
	//显示列
	$("#showCol").click(function(){
		$("#showColDlg").aiDialog({
			 width:570,
			  height:"auto",
			  title:"显示列",
			  callback:function(){
				  //TODO
				  var checkedCol = $("#showColDlg > ul").find("input:checked");
				  var colModel = $("#yijngGrid").jqGrid('getGridParam',"colModel");
				  var colNames = $("#yijngGrid").jqGrid('getGridParam',"colNames");
				  if($(document).data("colModel")){
					  colModel = $(document).data("colModel");
					  colNames = $(document).data("colNames");
				  }
				  var currentModel =[];
				  var currentNames =[];
				  for(var i = 0; i < colModel.length; i++){
					  var isExist = false;
					  var colName = colModel[i].name
					  for(var j = 0; j < checkedCol.length; j++){
						  var columnName = $(checkedCol[j]).val();
				          if(columnName == colName){
				              isExist = true;
				              break;
				          } 
				      }
				      if(isExist){
				      	if(i<colModel.length-1){
				      		colModel[i].width= ($("#yijngGrid").width()-150)/(checkedCol.length-1);
				      	}
//				    	    colModel[i].width= $("#yijngGrid").width()/checkedCol.length;
				    	    colModel[colModel.length-1].width=150;
				    	  	currentModel.push(colModel[i]);
				    	  	currentNames.push(colNames[i]);
				      }
				  }
				   
				  $.jgrid.gridUnload("yijngGrid");
					var moreQueryIpnut = formFmt.formToObj($("#yijingSearchList"));
	        		var dataTimeFrom = $("#dataTimeFrom").val();
	        		var dataTimeTo = $("#dataTimeTo").val();
	        		var statDateFrom = $("#statDateFrom").val();
	        		var statDateTo = $("#statDateTo").val();
	        		var searchEngines = $("#searchEngines").val();
	        		var interfaceType = $("#cycleType").val();
	        		moreQueryIpnut.unitType = interfaceType;
	        		moreQueryIpnut.txDateFrom = dataTimeFrom;
	        		moreQueryIpnut.txDateTo = dataTimeTo;
	        		moreQueryIpnut.statDateFrom = statDateFrom;
	        		moreQueryIpnut.statDateTo = statDateTo;
	        		moreQueryIpnut.search = searchEngines;
				  yijingMonitor.loadyijingGrid({ 
					  colNames:currentNames,
					  colModel: currentModel,
					  postData:moreQueryIpnut
		            });
				  $("#showColDlg").dialog( "close" );
			  } ,
			  open:function(){
				  var columnArr=[
		                 [{column:"unitType",title:"接口类型"},{column:"txDate",title:"数据日期"},{column:"unitTop",title:"接口主题域"}],
		                 [{column:"upDeadline",title:"计划上传时间"},{column:"upTime",title:"实际上传时间"},{column:"isDealy",title:"上传状态"}],
		                 [{column:"groupFtpTime",title:"文件取走时间"},{column:"groupFtpDesc",title:"文件取走情况"},{column:"groupLoadTime",title:"文件入库时间"}],
		                 [{column:"groupLoadDesc",title:"文件入库情况"},{column:'handle',hidden:true},{column:'unitDesc',hidden:true},{column:'unitId',hidden:true}]
					 ];
				  
				  
				  $("#showColDlg > ul").empty();
				  for(var i=0,len= columnArr.length;i<len;i++){
					  var columnList =columnArr[i];
					  var $li = $('<li class="row"></li>');
					  $("#showColDlg > ul").append($li);
					  for(var j=0,leng= columnList.length;j<leng;j++){
						  var html ='';
						  if(columnList[j].hidden){
							  html ='<input type="checkbox" id="'+columnList[j].column+'" class="hidden" checked value="'+columnList[j].column+'"> ';
						  }else{
							 html ='<div class="col-md-4"><label class="checkbox-block"><input type="checkbox"  id="'+columnList[j].column+'" value="'+columnList[j].column+'"> '+columnList[j].title+'</label></div>';
						  }
						  $li.append(html);
					  }
				  }
				  
				  var colModel = $("#yijngGrid").jqGrid('getGridParam',"colModel");
				  for(var i=0,len= colModel.length;i<len;i++){
					  if(!colModel[i].hidden){
						  $("#"+ colModel[i].name).prop("checked",true);
						  $("#showColDlg > ul").find("#"+ colModel[i].name).prop("checked",true)
					  }else{
						  $("#"+ colModel[i].name).prop("checked",false);
					  }
				  }
			  }
		});
		
	});

	yijingMonitor.loadStatusList();
	yijingMonitor.loadTops();
	yijingMonitor.loadyijingGrid();
	yijingMonitor.loadStateList();
	
});