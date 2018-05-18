(function($) {
	$.fn.extend({
		AIGrid : function(options) {
		 var _self  = $(this);
		 var thisId = $(this).attr("id");
		 var defaults={        
			   	url:'./grid.json',
				datatype: "json",
				mtype:"GET",
			   	colNames:[ ],
			   	colModel:[ ],
			   	rowNum:10,
			   	rowList:[],
			   	pager: '#pager_'+Math.random()*100,
			   	sortname: 'id',
			    viewrecords: true,
			    sortorder: "desc",
				jsonReader: {
					repeatitems : false,
					id: "0"
				},
				height: '100%',
				multiselect:true,
				setGroupHeaders:false,
//				width: $(_self).parent().width()-15 ,
				autowidth:true,
				rownumbers:true,
				showNoResult:false,//是否展示无数据时的样式
				afterGridLoad:function(){
//					console.log(settings);
				},
				loadError:function(xhr,status,error){
					 if(xhr.status == 401){
						   alert("会话已过期，请重新登录！");
						   window.location.href= $.loginURL;
					   }
				},
				loadBeforeSend:function(){
				},
				loadComplete:function(data){
					var pageBox = '<div class="clearfix"><div class="fleft totalPage"><span class="fleft">共'+data.records+'条记录，'+data.total+'页，当前第'+data.page+'页</span></div><div id="'+thisId+'_pager" class="tcdPageCode"></div></div>';
					$(opts.pager).html(pageBox);
					$(opts.pager).find("#"+thisId+"_pager").createPage({
				        pageCount:data.total,
				        current:data.page,
				        gridId:thisId,
				        backFn:function(current){
				        	$(_self).jqGrid('setGridParam',{ 
				                page:current 
				            }).trigger("reloadGrid");
				        }
				   });
					var rowList = opts.rowList;
					var rowNum = $(_self).jqGrid('getGridParam',"rowNum");
					for(var i=0,len = rowList.length;i<len;i++){
						if(rowNum == rowList[i]){
							$("#"+thisId+"_listbox").append('<option role="option" value="'+rowList[i]+'" selected="selected">'+rowList[i]+'</option>');
						}else{
							$("#"+thisId+"_listbox").append('<option role="option" value="'+rowList[i]+'">'+rowList[i]+'</option>');
						}
					}
					$('.grid-nodata-box').remove();
					//showNoResult为true时调用展示无结果图片
					if(opts.showNoResult){
						if(data.status=='203' || (data.status=='200' && data.rows.length<=0) || (data.status=='200' && !data.rows)){//203表不存在时  目前只适用于一经和二经监控
							var message = data.message ? data.message : "暂无数据&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
							$('.grid-nodata-box').remove();
							$(opts.pager).before('<div class="grid-nodata-box"><p class="no-data-icon"></p><div class="no-data-msg text-center color-666">'+message+'</div></div>');
						}
					}
				},
				gridComplete:function(){
//					var pgselbox = $(opts.pager).find(".ui-pg-selbox");
//					$("#"+thisId+"_listbox").html(pgselbox);
					if($(".frozen-bdiv.ui-jqgrid-bdiv").css("top")){
						$(".frozen-bdiv.ui-jqgrid-bdiv").css("top",$(".frozen-bdiv.ui-jqgrid-bdiv").css("top").replace(/px/,"")-1);
					}
					$(_self).find(".ui-delay-icon").parent().parent().addClass("ui-btn-delay-row");
					$(opts.pager).on("change","#"+thisId+"_listbox",function(){
						var rowNum = $(this).val();
						$(_self).jqGrid('setGridParam',{ 
							"rowNum": rowNum,
			            }).trigger("reloadGrid");
			        });
					//固定操作列
					var colModel = $(_self).jqGrid('getGridParam',"colModel");
					var op = colModel[colModel.length-1];
					if(op && op.frozen){
						var rows = $(_self).jqGrid('getGridParam',"rowNum");
						$(".right-frozen-bdiv").remove();
						var height = rows * 40;
						var fDiv = '<div style="position: absolute; right: 0px; top: 48px; overflow-y: hidden;width:'+op.width+'px; height: '+height+'px;" class="frozen-bdiv right-frozen-bdiv ui-jqgrid-bdiv" ><table class="table table-striped ui-jqgrid-btable ui-common-table" tabindex="0" role="presentation" aria-multiselectable="false" aria-labelledby="gbox_jsonmap" style="width: 1px;"></table></div>';
						$(_self).parents(".ui-jqgrid-bdiv").after(fDiv);
						var tdArr = $(_self).find('tr').find("td:last").clone();
						for(var i =0;i< tdArr.length;i++){
							var tr=$('<tr role="row"id="'+i+'_f" tabindex="-1" class="jqgrow ui-row-ltr ui-widget-content" style="height: 42px;"></tr>')
							if(i == 0){
								tr=$('<tr role="row"id="'+i+'_f" tabindex="-1" class="jqgfirstrow ui-row-ltr ui-widget-content" style="height: 0px;"></tr>')
							}
							$(tr).append(tdArr[i]);
							$(".right-frozen-bdiv > table").append(tr);
						}
						var thBox ='<div style="position: absolute; right: 0; top: 0px; height: 48px;" class="frozen-div right-frozen-div ui-jqgrid-hdiv ui-state-default"><table class="ui-jqgrid-htable ui-common-table "style="width: 1px; height: 100%;" role="presentation"aria-labelledby="gbox_jsonmap"><thead><tr class="ui-jqgrid-labels" role="row" style="height: 50px;"><th id="'+op.name+'_th" role="columnheader"class="ui-th-column ui-th-ltr ui-state-default" style="width: '+op.width+'px;"><span class="ui-jqgrid-resize ui-jqgrid-resize-ltr" style="cursor: col-resize;">&nbsp;</span><div class="ui-th-div ui-jqgrid-sortable" id="jqgh_'+op.name+'_th">操作 </div></th></tr></thead></table> </div>';
						$(_self).parents(".ui-jqgrid-bdiv").after(thBox);
					}
					opts.afterGridLoad();
				}
			};
		 var opts = $.extend(defaults, options);
		 var ssg = window.sessionStorage;
		 var token =null;
		if(ssg){
			token = ssg.getItem("token");
			var ajaxOption ={
				headers:{
					'X-Authorization':token,
					'Access-Control-Allow-Origin': '*',
					"Content-Type": "application/json; charset=utf-8",
				},
				beforeSend :function(){
					$("#load_"+thisId).show()//.removeClass("preloader_2").addClass("preloader_2").html('<span></span><span></span><span></span><span></span>');
				}
		    };
			opts.ajaxGridOptions = ajaxOption;
		}
		 var jqGridObj = $(_self).jqGrid(opts);
		 if(opts.setGroupHeaders){
			 jqGridObj.jqGrid('setGroupHeaders', opts.setGroupHeaders);
		 }
		 $("#load_"+thisId).removeClass("preloader_2").addClass("preloader_2").html('<span></span><span></span><span></span><span></span>');
		 $(window).resize(function(){
			 var width = $(_self).parents(".ui-grid-box").width(); 
			 $(_self).setGridWidth(width);
		 });
		 /**
		  * 封装获取选中列数据
		  */
		 $.jgrid.extend({
			"getSelectedJsonArray":function(){
				var rowIds = $(_self).jqGrid('getGridParam','selarrrow');
				var array=[];
				if(!rowIds){
					return array;
				}
				for(var i = 0,len = rowIds.length;i<len;i++){
					var obj=$(_self).jqGrid('getRowData',rowIds[i]);   
					array.push(obj);
				}
				return array;
		   },
		   "getSelectedIdsArray":function(param){
			   var jsonRaaderdefaults={
					"key":"appId"   
			   };
			   param = $.extend(jsonRaaderdefaults,param)
			   var rowIds = $(this).jqGrid('getGridParam','selarrrow');
				var array=[];
				if(!rowIds){
					return array;
				}
				for(var i = 0,len = rowIds.length;i<len;i++){
					var obj=$(this).jqGrid('getRowData',rowIds[i]);   
					array.push(obj[param.key]);
				}
				return array;
		   }
		 });
		 return jqGridObj;
	   }
	   
	});
	$.extend({
		/***
		 * 100	延迟未完成	red
		*	101	延迟完成	orange
		*	102	正常运行中	blue
		*	103	延迟运行中	turquoise
		*	104	按时完成	green
		*	105	计划中	purple
		*	900	下线中	gray
		 */
		setStatus:function(cellvalue, options, rowObject){
			var  statusName = cellvalue;
			var fontColor ={
					red:"#f85454 ",                           
					orange:"#faa918",
					skyblue:"#1DB6E1",//天空蓝
					pink:"#EA86C6",//粉色
					green:"#45bd6f ",
					purple:"#9B7DF6 ",
					gray:"#b6b6b6"
			};
			var statusColor = rowObject[options.colModel.color];
			var color = fontColor[statusColor] ? fontColor[statusColor] : "#666";
    			statusName = '<span class="appMonitor" style="color:'+color+';">'+(statusName || '--')+'</span>'
    			return statusName;
	    	},
    	/***
		 * 百分比进度条
		 */
    	setProgress:function(cellvalue, options, rowObject){
			var progressColor = rowObject[options.colModel.progressColor];
			var progressRate = rowObject[options.colModel.name]+'%';
			var html = '';
			if(!cellvalue){
				html = '-';
			}else{
				html = '<div class="progress table-progress">'+
				      	  '<div class="progress-bar" role="progressbar" aria-valuenow="'+progressRate+'" aria-valuemin="0" aria-valuemax="100" style="width: '+progressRate+';background-color:'+progressColor+';">'+
				      	    progressRate+
				      	  '</div>'+
				       '</div>';
			}
			return html;
	    },
	    /**
	     * 重要程度 数字专转为文案
		 */
		setImpLevel:function(cellvalue, options, rowObject){
			var priLevel = cellvalue;
    		var priLevelObj =$.priLevelObj;
    		//{3:"高",2 :"中",1:"低"}
    		if(priLevel && priLevel!='1' && priLevel!='2' && priLevel!='3'){
    			//>40高 >20中 <20低
    			if(priLevel>=40){
    				priLevel = priLevelObj["3"];
    			}
    			if(priLevel>=20 && priLevel<40){
    				priLevel = priLevelObj["2"];
    			}
    			if(priLevel<20){
    				priLevel = priLevelObj["1"];
    			}
    		}
    		if(priLevel=='1' || priLevel=='2' || priLevel=='3'){
    			priLevel = priLevelObj[priLevel]
    		}
    		if(!priLevel){
    			priLevel = '-';
    		}
    		return priLevel;
	    },
	    /**
	     * 后台无返回值时 用'-'展示
		 */
	    setNull:function(cellvalue, options, rowObject){
	    	var content = cellvalue ? cellvalue : '-';
    		return content;
	    },
	    /**
	     * 平台监控-数据库监控连通状态后台无返回值时 用'-'展示
		 */
	    setIsOn:function(cellvalue, options, rowObject){
			var html='';
			if(!cellvalue){
				html = '-';
			}
			if(cellvalue=='ON'){
				html='<span class="green">已连通</span>'
			}
			if(cellvalue=='OFF'){
				html='<span class="red">未连通</span>'
			}
			return html;
		},
		/**
	     * 平台监控-性能采集状态后台无返回值时 用'-'展示
		 */
	    setCollectStatus:function(cellvalue, options, rowObject){
			var html='';
			if(!cellvalue){
				html = '-';
			}
			if(cellvalue=='ON'){
				html='<span class="green">开启</span>'
			}
			if(cellvalue=='OFF'){
				html='<span>未开启</span>'
			}
			return html;
		},
		/***
		 * 告警级别
		 */
    	setColor:function(cellvalue, options, rowObject){
			var color = rowObject[options.colModel.color];
			var html = '';
			if(!cellvalue){
				html = '-';
			}else{
				html = '<span style="color:'+color+'">'+cellvalue+'</span>'
			}
			return html;
	    },
	});
})(jQuery); 


