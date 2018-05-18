$(function(){
	interfaceStatus.loaddatepicker({
		from:'#uploadActualMinTime'
		// to:'#uploadActualMaxTime'
	});
	// $("#uploadActualMinTime").datepicker({
 //    	//defaultDate: "+1w",
 //    	changeMonth: true,
 //    	numberOfMonths:1,
 //    	dateFormat: "yy-mm-dd"
	// });
	/*
	 *获取前几天
	 *@param day 前多少天
	 */
	var getEarlierDay = function(day){
		var now = new Date().getTime();
		return new Date(now - day * 24 * 3600 * 1000);
	}
	$('#uploadActualMinTime').datepicker( 'setDate' , getEarlierDay(0));
	// $('#uploadActualMaxTime').datepicker( 'setDate' , getEarlierDay(1));
	interfaceStatus.renderGrids();

	var token = window.sessionStorage && window.sessionStorage.getItem('token');
	if(!token) return;
	/*
	 *查询表格信息
	 */
	var queryDetails = function(e){
		e.stopPropagation();
		e.preventDefault();
		var gridTypes = ['loadCountStatus','arriveCountStatus','ftpCountStatus','loadCountStatus'],
			fromTime = $('#uploadActualMinTime').val(),//开始时间
			option = {
				'X-Authorization':token,
	            'statDate':fromTime
			}
		gridTypes.forEach(function(item){
			// $('.' + item).jqGrid('clearGridData');
			$('.' + item).jqGrid('setGridParam',{
				postData:option
			},true).trigger('reloadGrid');
		})
		// interfaceStatus.renderGrids();
	}
	$('.ints-query').on('click',queryDetails);

	/*
	 *导出文件
	 */
	var exportDetails = function(e){
		e.stopPropagation();
		e.preventDefault();
		var fromTime = $('#uploadActualMinTime').val();//开始时间 
			option = {
				'token':token,
				'X-Authorization':token,
				'statDate':fromTime
			};
		option = $.convertData(option);
		window.open(encodeURI(encodeURI($.ctx + '/api/inter/interfaceInput/exportCountCsv?' + option)))
	}
	$('.ints-export').on('click',exportDetails);
});