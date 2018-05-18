/**
 * ------------------------------------------------------------------
 * 日期模版对象方法描述总计：
 * 
 * 	 model.IsLeapYear    日期是否是闰年  
 *   model.Formate       日期格式化        
 *   model.DateCalc      日期计算          
 *   model.CountTime     日期间隔时间差值  
 *   model.GetMonthDays  日期月份天数统计
 *   model.CompareDate   日期大小比较
 *   model.getMonthLastDay    日期月份最后一天
 *   model.parseDate     将字符、数字等转换为日期类型
 * ------------------------------------------------------------------
 */
var DateFmt = (function (model){

        //开发版本号
        model.version = "1.0.0";
        model.author = "xiaoyx";
        model.email = "xiaoyx@asiainfo.com";
        model.from;
        model.to;
		/**
		 * 闰年定义 ：非整百年能被4整除的为闰年
		 * 判断闰年  @param dateParam 日期对象、数字、字符串(数字格式) 
		 * ------------------------------------------------------------------
		 */ 
		model.IsLeapYear = function(dateParam){

			var leapFlag = false;
			var yearNumber;
                if(dateParam instanceof Date){
                        yearNumber =  dateParam.getFullYear();
                }else{
                        yearNumber = parseInt(dateParam,10); //格式化数字
                }
                //console.log("日期年份："+yearNumber);
                if(!isNaN(yearNumber)){
                    if((0 == yearNumber % 4) && ((yearNumber%100 != 0)||(yearNumber % 400==0))){
                       leapFlag = true;
                    }
                }else{
                	console.log("传递的参数格式不正确！");
                }

                return leapFlag;
		}

        /**
		 * 将日期格式化成指定格式的字符串
         * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
         * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：
         * yyyy-MM-dd HH:mm:ss
         * @returns 返回格式化后的日期字符串
		 * ------------------------------------------------------------------
		 */ 
		model.Formate = function(dateObj, fmtStr){

			var weekArr = ['天', '一', '二', '三', '四', '五', '六'];
			    dateObj =this.parseDate(dateObj);

			    fmtStr = fmtStr || 'yyyy-MM-dd HH:mm:ss';
            var yearNumber =  dateObj.getFullYear() + "";
            var dayNumber  = dateObj.getDay();
            var objMap = {         
				    "M+" : dateObj.getMonth()+1, //月份         
				    "d+" : dateObj.getDate(), //日         
				    "h+" : dateObj.getHours()%12 == 0 ? 12 : dateObj.getHours()%12, //小时         
				    "H+" : dateObj.getHours(), //小时         
				    "m+" : dateObj.getMinutes(), //分         
				    "s+" : dateObj.getSeconds(), //秒         
				    "q+" : Math.floor((dateObj.getMonth()+3)/3), //季度         
				    "S" : dateObj.getMilliseconds() //毫秒         
			    };
			    //匹配年     
			    if(/(y+)/.test(fmtStr)){         
			        fmtStr = fmtStr.replace(RegExp.$1, yearNumber.substr(4 - RegExp.$1.length));         
			    }
			    //匹配周      
			    if(/(E+)/.test(fmtStr)){
			        fmtStr = fmtStr.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? '星期' : '周') : "") + weekArr[dayNumber]);         
			    }
			    for(var k in objMap){
			        if(new RegExp("("+ k +")").test(fmtStr)){
			            fmtStr = fmtStr.replace(RegExp.$1, (RegExp.$1.length==1) ? (objMap[k]) : (("00"+ objMap[k]).substr((""+ objMap[k]).length)));         
			        }         
			    }

			    return fmtStr;        
		}

	    /**
		 * 日期计算 
		 * @param s:秒
		 * @param m:分
		 * @param h:时
		 * @param d:天
		 * @param w:周
		 * @param q:季度
		 * @param M:月份
		 * @param y:年
		 * ------------------------------------------------------------------
		 */ 
		model.DateCalc = function(dateObj,fmt,number) {

			    dateObj =this.parseDate(dateObj);
			    var Y = dateObj.getFullYear(),
			        M = dateObj.getMonth(),
			        D = dateObj.getDate(),
			        H = dateObj.getDate(),
			        m = dateObj.getDate(),
			        s = dateObj.getDate(),
			        dateTemp = null;
			    switch (fmt) {   
			        case 's' :
			            dateTemp = new Date(Date.parse(dateObj) + (1000 * number));
			            break;
			        case 'm' :
			            dateTemp = new Date(Date.parse(dateObj) + (60000 * number));
			            break; 
			        case 'h' :
			            dateTemp = new Date(Date.parse(dateObj) + (3600000 * number));
			            break;   
			        case 'd' :
			            dateTemp = new Date(Date.parse(dateObj) + (86400000 * number));
			            break;  
			        case 'w' :
                        dateTemp = new Date(Date.parse(dateObj) + ((86400000 * 7) * number));
                        break;
			        case 'q' :
			            dateTemp = new Date(Y, M + number*3, D, H, m, s);
			            break;
			        case 'M' :
			            dateTemp = new Date(Y, M + number, D, H, m, s);
			            break; 
			        case 'y' :
			            dateTemp =  new Date((Y + number), M, D, H, m, s);
			            break; 
			         default:  
			            dateTemp =  new Date();
			    }
			    return dateTemp;
		}  
		  
		
		/**
		 * 计算2日期之间的时间
		 * @param startDate : 开始日期  日期对象(new Date())、"2017/01/12"、"2017-01-12" 
		 * @param endDate   : 结束日期 
		 * @param fmt:  返回日期间隔 
		 *  例如：s:秒、 m:分、h:时、d:天、w:周、M:月份、y:年
		 * ------------------------------------------------------------------
		 */ 
		model.CountTime = function( dateStart , dateEnd , fmt) {

			 dateStart =this.parseDate(dateStart);
			 dateEnd   =this.parseDate(dateEnd);

			var dateNumber,
			    dateDiff = dateEnd - dateStart;
                //console.log(typeof dateEnd );
		    switch (fmt) {   
		        case 's' :
		            dateNumber =  parseInt(dateDiff / 1000);
		            break;  
		        case 'm' :
		            dateNumber = parseInt(dateDiff / 60000);
                    break; 
		        case 'h' :
                    dateNumber = parseInt(dateDiff / 3600000);
                    break; 
		        case 'd' :
                    dateNumber = parseInt(dateDiff / 86400000);
                    break; 
		        case 'w' :
                    dateNumber = parseInt(dateDiff/(86400000 * 7) ,10);
                    break; 
		        case 'M' :
                    dateNumber = (dateEnd.getMonth()+1)+((dateEnd.getFullYear() - dateStart.getFullYear())*12) - (dateStart.getMonth()+1); 
                    break; 
		        case 'y' :
                    dateNumber =  dateEnd.getFullYear() - dateStart.getFullYear();
                    break;
                default :
                    console.log("传递的比较参数格式不存在!");
		    }
            return dateNumber;
		}

        /**
		 * 获取某年某个月的天数
		 * @param date : 日期类型或者字符串 
	     * 方式一：$.getMonthDays();
         * 方式二：$.getMonthDays(new Date());
         * 方式三：$.getMonthDays("2013-12"||"2013/12");
		 * ------------------------------------------------------------------
		 */ 
		model.GetMonthDays = function(date){

		    var y,m,d;

	            date =this.parseDate(date);

	            y = date.getFullYear();
	            m = date.getMonth()+1;
				d= new Date( y ,m ,0); 
			   return d.getDate();  
		}  
        /**
		 * 比较两个日期的大小
		 * @param dateStart : 开始日期  --参数类型 ：字符串、数字、日期Date
		 * @param dateEnd :   结束日期  --参数类型 ：字符串、数字、日期Date
		 * ------------------------------------------------------------------
		 */
		model.CompareDate = function(dateStart, dateEnd){
            
            dateStart =this.parseDate(dateStart);
            dateEnd =this.parseDate(dateEnd);
            //提取公共方法校验参数
			var timesBegin = dateStart.getTime();
			var timesEnd = dateEnd.getTime();
            console.log("timesBegin : " + timesBegin);
            console.log("timesEnd : " + timesEnd);
           /* if(isNaN()){

            }*/
			    if(timesBegin > timesEnd) {
			        //alert('开始时间大于离开时间,请检查!');
			        return 1;
			    }else if(timesBegin == timesEnd){
			        return 0;
			    }else{
                    return -1;
			    }
        }
        /**
		 * 获取某个月的最后一天日期
		 * @param date : 日期类型或者字符串 
	     * 方式一：$.getMonthDays();
         * 方式二：$.getMonthDays(new Date());
         * 方式三：$.getMonthDays("2013-12"||"2013/12");
		 * ------------------------------------------------------------------
		 */
		model.getMonthLastDay = function(date){
		    var y,m,d;
	            date =this.parseDate(date);
	            y = date.getFullYear();
	            m = date.getMonth()+1;
	            //取下一个月的第一天，方便计算（最后一天不固定）
				if(m > 11){     
					 m -=12;    //月份减     
					 y++;      //年份增     
				}     
				d= new Date( y ,m ,1);

			return (new Date(d.getTime()-1000*60*60*24)); //获取当月最后一天日期

		}

        /**
		 * 解析字符串为日期类型
		 * @param date : 日期类型或者字符串 
	     * 方式一：$.parseDate();
         * 方式二：$.parseDate(new Date());
         * 方式三：$.parseDate("2013-12"||"2013/12");
         * @return  Date 类型对象
		 * ------------------------------------------------------------------
		 */
        model.parseDate = function(date){
        	//
            if(date == undefined){
                date = new Date();
            }else if(typeof date == 'string' ){
            	date = new Date(Date.parse(date));
            }else if(typeof date == 'number'){
               date = new Date(date);
            }
            var times = date.getTime();
             //   console.log(times);
            if(isNaN(times)){//转化日期类型错误
                return null;
            }
            return date;

        }
        /**
         * 解析grid date转换
         * @param  cellvalue 列数据
         * @param  options  gird配置
         * @param  rowObject  gird行对象
         * ------------------------------------------------------------------
         */
        model.dateFormatter = function(cellvalue, options, rowObject){
        		if(cellvalue){
        			return DateFmt.Formate(cellvalue,"yyyy-MM-dd HH:mm:ss");
        		}else{
        			return "--";
        		}
        }
        /**
         * 解析grid date转换YYYY-MMM-DD
         * @param  cellvalue 列数据
         * @param  options  gird配置
         * @param  rowObject  gird行对象
         * ------------------------------------------------------------------
         */
        model.dataDateFormate = function(cellvalue, options, rowObject){
        		if(cellvalue){
        			return DateFmt.Formate(cellvalue,"yyyy-MM-dd");
        		}else{
        			return "--";
        		}
        }
        model.dataDateFormateMinute = function(cellvalue, options, rowObject){
    		if(cellvalue){
    			return DateFmt.Formate(cellvalue,"yyyy-MM-dd HH:mm");
    		}else{
    			return "--";
    		}
        }
        /**
         * 值为空时--显示
         * ------------------------------------------------------------------
         */
        model.gridDataNull = function(cellvalue, options, rowObject){
    		if(cellvalue){
    			return cellvalue;
    		}else{
    			return "--";
    		}
        }
        /**
         * 日期控件
         * 双日期加载
         */
        model.loaddatepicker=function(option){
        		var defaults={
        			from:"",
        			to:"",
        			minDate:null,
        			dateFormat:"yy-MM-dd",
        			maxDate:null,
        			minDate:null,
        			beforeShow:function(){
        				$.datepicker.dpDiv.removeClass("ui-hide-calendar");
						$("#ui-datepicker-div .ui-datepicker-year").off("change");
        			},
        			onClose:function(){},
        			showButtonPanel: false,
 			        closeText:"关闭",
        			isClickFuc:false
        		};
        		option = $.extend(defaults,option);
        		if(option.formValue && option.toValue){
        			$( option.from ).val(option.formValue );
        			$( option.to ).val(option.toValue );
        		}
        		$( option.from ).datepicker( "destroy" );
        		$( option.to ).datepicker( "destroy" );
        		var dateFormat = option.dateFormat,
	        from = $( option.from )
	        .datepicker({
	        	changeMonth: true,
	        	changeYear: true,
	        	numberOfMonths:1,
	        	showButtonPanel: option.showButtonPanel,
		        closeText: option.closeText ,
	        	minDate:option.minDate,
	        	"maxDate":getDate( $(option.to)[0] )||option.maxDate,
	        	dateFormat: dateFormat,
	        	beforeShow:option.beforeShow,
	        	onClose:option.onClose
	        }).off("click")
	        .on( "change", function() {
	        	to.datepicker( "option", "minDate", getDate( this ) );
	        }),
	        to = $( option.to ).datepicker({
	        	changeMonth: true,
	        	changeYear: true,
	        	numberOfMonths:1,
	        	showButtonPanel: option.showButtonPanel,
		        closeText: option.closeText ,
	        	"minDate":getDate( $(option.from)[0] )||option.minDate,
	        	maxDate:option.maxDate,
	        	dateFormat: dateFormat,
	        	beforeShow:option.beforeShow,
	        	onClose:option.onClose
	        }).off("click")
	        .on( "change", function() {
	        	from.datepicker( "option", "maxDate", getDate( this ) );
	        });
    		$.datepicker.dpDiv.addClass("ui-datepicker-box");
	        function getDate( element ) {
	        	var date;
	        	try {
        			date = DateFmt.parseDate( element.value );
	        	} catch( error ) {
	        		date = null;
	        	}
	        	
	        	return date;
	        }
	        model.from=from;
	        model.to=to;
	        if(!option.isClickFuc) return;
	        $(from).on("click",function(){
	        	DateFmt.swicthQuarter(option,this);
	        });
	        $(to).on("click",function(){
	        	DateFmt.swicthQuarter(option,this);
	        });
	       
        };
        model.swicthQuarter = function(option,_this){
        	var currentMonth = DateFmt.DateCalc(new Date(),"q",-1).getMonth()+1;
			var currentYear = DateFmt.DateCalc(new Date(),"q",-1).getFullYear();
			var minMonth = DateFmt.DateCalc(new Date(),"y",-1).getMonth()+1;
			var minYear = DateFmt.DateCalc(new Date(),"y",-1).getFullYear();
			var targetDate = {"1":3,"2":3,"3":3,"4":6,"5":6,"6":6,"7":9,"8":9,"9":9,"10":12,"11":12,"12":12};
        	if(!$.datepicker.dpDiv.is(":hidden")){
	    		var $monthSelect = $.datepicker.dpDiv.find(".ui-datepicker-month").clone();
	    		$.datepicker.dpDiv.find(".ui-datepicker-month").remove();
	    		$(".ui-datepicker-title").prepend($monthSelect);
	    		var monthNames = option.monthNames;
	    		var html = '';
	    		var year = $("#ui-datepicker-div .ui-datepicker-year option:selected").val();//得到选中的年份值
	    		var toYear = DateFmt.parseDate($( option.to ).val()).getFullYear();
	    		var toMonth = DateFmt.parseDate($( option.to ).val()).getMonth()+1;
	    		var fromYear = DateFmt.parseDate($( option.from ).val()).getFullYear();
	    		var fromMonth = DateFmt.parseDate($( option.from ).val()).getMonth()+1;
	    		for(var i=0,len = monthNames.length;i<len;i++){
    				if( $( option.from ).attr("id") == _this.id){
    					if( toMonth >= monthNames[i]&& year == currentYear&& year <= toYear){
	    					html += '<option value="'+monthNames[i]+'">'+monthNames[i]+'</option>';
	    	    		}
	    			} else{
	    				if( targetDate[currentMonth] >= monthNames[i]&& year == currentYear&& fromMonth <= monthNames[i]&&year >= fromYear){
	    					html += '<option value="'+monthNames[i]+'">'+monthNames[i]+'</option>';
	    	    		}
	    			}
	    		}
	    		$("#ui-datepicker-div .ui-datepicker-year").off("change").on("change",function(){
	    			var year = $("#ui-datepicker-div .ui-datepicker-year option:selected").val();//得到选中的年份值
	    			var html = "";
		    		for(var i=0,len = monthNames.length;i<len;i++){
		    			if( targetDate[currentMonth] >= monthNames[i]&& year == currentYear){
		    				html += '<option value="'+monthNames[i]+'">'+monthNames[i]+'</option>';
		    			}else if( targetDate[currentMonth] < monthNames[i]&& year == minYear){
		    				html += '<option value="'+monthNames[i]+'">'+monthNames[i]+'</option>';
		    			}
		    		}
		    		$monthSelect.html(html);
	    		});
	    		$monthSelect.html(html);
	    	}
	    	return false;
        }
        /**
         * 日期控件
         * 双日期 开始时间-结束时间 加载
         */
        model.loadDateTime=function(option){
    		var defaults={
    			  startTime:"",//开始时间输入框 如#startTime
    			  endTime:"",//结束时间输入框 如#endTime
    			  changeMonth: true, //显示月份
     		      changeYear: true, //显示年份
     		      showButtonPanel: true, //显示按钮
     		      timeFormat: "HH:mm",
     		      dateFormat: "yy-mm-dd",
     			  controlType:"select",
     			  timeOnlyTitle:"选择时间",
     			  timeText: '已选择',
     			  hourText: '时',
     			  minuteText: '分',
     			  second_slider:false,
     			  currentText:"当前时间",
     			  closeText: '确定',
    		};
    		option = $.extend(defaults,option);
    		$(option.startTime).datetimepicker(option);
    		$(option.endTime).datetimepicker(option);
  		    $(option.startTime).datetimepicker({
  			  onClose: function (selectedDate) {
  		          $(option.endTime).datepicker("option", "minDate", selectedDate);
  		       }
  	        });
  		    $(option.endTime).datetimepicker({
  			  onClose: function (selectedDate) {
  		          $(option.startTime).datepicker("option", "maxDate", selectedDate);
  		        }
  	        });
  			$.datepicker.dpDiv.addClass("ui-datepicker-box");//使用统一样式
        };
        /**
         * 把毫秒转换为几个小时几分几秒
         */
        model.MillisecondToDate = function(msd) {  
            var time = parseFloat(msd) /1000;  
            if (null!= time &&""!= time) {  
                if (time >60&& time <60*60) {  
                    time = parseInt(time /60.0) +"分钟"+ parseInt((parseFloat(time /60.0) -  
                    parseInt(time /60.0)) *60) +"秒";  
                }else if (time >=60*60&& time <60*60*24) {  
                    time = parseInt(time /3600.0) +"小时"+ parseInt((parseFloat(time /3600.0) -  
                    parseInt(time /3600.0)) *60) +"分钟"+  
                    parseInt((parseFloat((parseFloat(time /3600.0) - parseInt(time /3600.0)) *60) -  
                    parseInt((parseFloat(time /3600.0) - parseInt(time /3600.0)) *60)) *60) +"秒";  
                }else {  
                    time = parseInt(time) +"秒";  
                }  
            }else{  
                time = "0 时 0 分0 秒";  
            }  
            return time;  
        } 
        model.dateFormatterSecond = function(cellvalue, options, rowObject){
			if(cellvalue){
				return DateFmt.MillisecondToDate(cellvalue);
			}else{
				return "--";
			}
        };
        return model;
	})(window.DateFmt || {});