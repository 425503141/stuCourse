var interfaceStatus = (function(model){
	var gridTypes = ['loadCountStatus','arriveCountStatus','ftpCountStatus','loadCountStatus'],
		colNames = ['时间段','延迟未完成','延迟完成','计划中','按时完成','总数'],
		option = '',
        token = window.sessionStorage && window.sessionStorage.getItem('token'),
        getTime = function(tag){
            return $('#uploadActual' + tag).val();
        };
    model.setTime = function(e){
        // console.log(e);
        var href = $(e).attr('href');
        href.indexOf('&statDateFrom=') === -1 && (href += '&statDateFrom=' + getTime('MinTime'));
        window.location.href = href;
        console.log(href)
    }
	/*
	 *渲染表格
	 */
	model.renderGrids = function(){
		var selectRow = function(rowid,status){

		}
        var fromDate = getTime('MinTime'),
            toDate = getTime('MaxTime');
        option = {
            'X-Authorization':token,
            'statDate':fromDate
        }

		gridTypes.forEach(function(item,index){
			option.statusType=item;
			var getParams = function(rowObj,name){
				//console.log(rowObj)
	            var res = 'timeSlotFrom=' + rowObj.timeSlotFrom+
	            '&statusType=' + rowObj.statusType+
	                '&timeSlotTo=' + rowObj.timeSlotTo +
	                '&' + 'pushStatus=' + rowObj[name + 'Status'];
	            console.log(res)
	            return res;
	        }
	        //获取格式化方法
	        var setFormatter = function(name,cellValue,option,rowObj){
	        	var pushObj={};
				 pushObj.statusType=rowObj.statusType;
				 pushObj.pushStatus=rowObj[name+'Status'];
//				 console.log(rowObj,[name+'Status'])

	            return '<span style="cursor:pointer;color:' + rowObj[name + 'Color'] + '" href="../pushInterface/erjingMonitor.min.html?' + getParams(rowObj,name) + '" onclick="interfaceStatus.setTime(this)">' +
	                     rowObj[name] +
	                    '</span>'
	        }
			var gridWidth = $('.' + item).width(),
                colModel = [{name:'timeStage',align:'center',width:gridWidth / 6},
                            {name:'delayUnfinished',align:'center',width:gridWidth / 6,formatter:setFormatter.bind(this,'delayUnfinished')},
                            {name:'delayFinish',align:'center',width:gridWidth / 6,formatter:setFormatter.bind(this,'delayFinish')},
                            {name:'planWorking',align:'center',width:gridWidth / 6,formatter:setFormatter.bind(this,'planWorking')},
                            {name:'finish',align:'center',width:gridWidth / 6,formatter:setFormatter.bind(this,'finish')},
                            {name:'timeCount',align:'center',width:gridWidth / 6}];
			$('.' + item).AIGrid({
				url:$.ctx + '/api/inter/interfaceInput/' + item,
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
    return model;
})(window.interfaceStatus || {});