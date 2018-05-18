/**
 * ------------------------------------------------------------------
 * 接口监控-推送监控
 * ------------------------------------------------------------------
 */
var sendMonitor = (function (model){
       	var gridTypes = ['interface_push','interface_wave','interface_num','interface_push'],
       	colNames = ['时间段','延迟未完成','延迟完成','计划中','按时完成','总数'],
		option = '',
        token = window.sessionStorage && window.sessionStorage.getItem('token');
	/*
	 *渲染表格
	 */
	model.renderGrids = function(){
		var selectRow = function(rowid,status){

		}
        var getTime = function(tag){

           return $('#uploadActual' + tag).val();
        }
        model.setTime = function(e){
            // console.log(e);
            var href = $(e).attr('href');
            href.indexOf('&statDateFrom=') === -1 && (href += '&statDateFrom=' + getTime('MinTime'));
            $(e).attr('href',href);
            window.location.href = href;

        }
        var fromDate = getTime('MinTime'),

        option = {
            'X-Authorization':token,
            'statDate':fromDate,
        }

      //获取格式化方法

		gridTypes.forEach(function(item,index){
			option.statusType=item;
			var getParams = function(rowObj,name){
//				 var res = 'statusType=' + rowObj.planning_type+
//                 '&doOpTime=' + rowObj.quantum +
//                 '&statDateFrom=' + fromDate +
//                 '&statDateTo=' + fromDate + '&' +
//                 'pushStatus=' + rowObj[name + '_status'];
//				 res=encodeURI(res);
				 var res = 'statusType=' + rowObj.planning_type+
                 '&doOpTime=' + rowObj.quantum +
                 '&' +'pushStatus=' + rowObj[name + '_status'];
				 res=encodeURI(res);
				 return res;

            }
			 var setFormatter = function(name,cellValue,option,rowObj){
				 //console.log(name,cellValue,option,rowObj)
					 var pushObj={};
					 pushObj.statusType=rowObj.planning_type;
					 pushObj.doOpTime=rowObj.quantum;
					 pushObj.statDateFrom=fromDate;
					 pushObj.statDateTo=fromDate;
					 pushObj.pushStatus=rowObj[name+'_status'];
					 return '<a style="color:' + rowObj[name + '_color'] + '" href="../pushInterface/sendMonitor_list.min.html?'+ getParams(rowObj,name) + '" onclick="sendMonitor.setTime(this)">' +
                     rowObj[name] +
                    '</a>'

		        }
			var gridWidth = $('.' + item).width(),
                colModel = [{name:'time_slot_desc',align:'center',width:gridWidth / 6},
                            {name:'delay_unfunish',align:'center',width:gridWidth / 6,formatter:setFormatter.bind(this,'delay_unfunish')},
                            {name:'delay_funish',align:'center',width:gridWidth / 6,formatter:setFormatter.bind(this,'delay_funish')},
                            {name:'planning',align:'center',width:gridWidth / 6,formatter:setFormatter.bind(this,'planning')},
                            {name:'funished',align:'center',width:gridWidth / 6,formatter:setFormatter.bind(this,'funished')},
                            {name:'lineSum',align:'center',width:gridWidth / 6}];
			$('.' + item).AIGrid({
				url:$.ctx + '/api/ring/push/tables',
				dataType:'json',
				postData:option,
				colNames:colNames,
				colModel:colModel,
				rowNum:10,
				width: gridWidth,
        	   	autowidth:false,
        	   	shrinkToFit: false,
        	   	sortname: '',
        	    viewrecords: true,
        	    multiselect:false,
        		rownumbers:false,
        	    sortorder: "asc",
        		jsonReader: {
        			repeatitems : false,
        		},
        		height: '100%',
        		showNoResult:true,
        		onSelectRow:selectRow,
			}).jqGrid('setFrozenColumns');

		});

	}

	/**
     * 日期控件
     */
    model.loaddatepicker=function(option){
    		var defaults={
    			from:"",
    			to:""
    		};
    		option = $.extend(defaults,option);
    		var dateFormat = "yy-mm-dd",
        from = $( option.from )
        .datepicker({
        	//defaultDate: "+1w",
        	changeMonth: true,
        	changeYear:true,
        	changeDay:true,
        	numberOfMonths:1,
        	dateFormat: dateFormat,
    		beforeShow :function(){
    			$.datepicker.dpDiv.removeClass("ui-hide-calendar");
    		}
        })
        .on( "change", function() {
        	to.datepicker( "option", "minDate", getDate( this ) );
        }),
        to = $( option.to ).datepicker({
        	//defaultDate: "+1w",
        	changeMonth: true,
        	numberOfMonths:1,
        	dateFormat: dateFormat,
    		beforeShow :function(){
    			$.datepicker.dpDiv.removeClass("ui-hide-calendar");
    		}
        })
        .on( "change", function() {
        	from.datepicker( "option", "maxDate", getDate( this ) );
        });
    		$.datepicker.dpDiv.addClass("ui-datepicker-box");
        function getDate( element ) {
        	var date;
        	try {
        		date = $.datepicker.parseDate( dateFormat, element.value );
        	} catch( error ) {
        		date = null;
        	}
        	return date;
        }
    };

        /**
	     * 打开短信弹框
	     */
	    model.sendSMSDlg= function(obj){
    		sendSMS.showSMSDlg({
    			ajaxUrl: $.ctx + "/api/out/messageSend",
				rowObj:obj,
				ajaxData:{
					appId:obj.appId
				}
    		},'sendMonitor');
	    };
        return model;

   })(window.sendMonitor || {});