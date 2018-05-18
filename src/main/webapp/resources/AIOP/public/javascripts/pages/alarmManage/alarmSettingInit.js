/**
 * ------------------------------------------------------------------
 * 告警管理-告警设置
 * ------------------------------------------------------------------
 */
$(function(){
	//资源类型下拉
	hostManage.loadResourceTypeList('#resourceType','150');
	//告警类型下拉 -根据资源类型选择进行联动
	hostManage.loadAlarmTypeList('#alarmType','150','');
	$('#resourceType').change(function(){
		var deviceType = $(this).val();
		hostManage.loadAlarmTypeList('#alarmType','180',deviceType);
	});
	hostManage.loadHostManageGrid();//初始化加载列表
	//查询按钮
	$("#searchHostManage").click(function(){
		hostManage.refreshGridHostManage();
		//用来服务器记录log
    	/*$.AILog({
			  "action": "查询",//动作
			  "detail": "",//详情,默认为空
			  "module": "sys_daq_plan"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    });*/
	});
	//新增-主机告警
	$("#hostAlarmAdd").click(function(){
		hostManage.insertOrUpdateHostAlarm(this,'0');
	});
	//阈值校验
	$('#thresholdCrit').keyup(function(){
		var thisVal = $(this).val();
		var reg = new RegExp("^(\\d|[1-9]\\d|100)$");  
		var desc = $('input:radio[name="alarmIndexId"]:checked').attr('title')+'超过'+thisVal+'%,严重告警';
			desc = thisVal ? desc : "";
		$('#descCrit').val(desc);
		if(!reg.test(thisVal)) {  
		       alert("请输入0-100的整数！"); 
		       $(this).val('');
		       $('#descCrit').val('');
		} 
	});
	$('#thresholdWarn').keyup(function(){
		var thisVal = $(this).val();
		var reg = new RegExp("^(\\d|[1-9]\\d|100)$");  
		var desc = $('input:radio[name="alarmIndexId"]:checked').attr('title')+'超过'+thisVal+'%,警告告警';
			desc = thisVal ? desc : "";
		$('#descWarn').val(desc);
		if(!reg.test(thisVal)) {  
		       alert("请输入0-100的整数！"); 
		       $(this).val('');
		       $('#descWarn').val('');
		} 
	});
	//正整数的限制
	$('#timesCont,#periodAccu,#timesAccu').keyup(function(){
		var thisVal = $(this).val();
		var reg = new RegExp("^[0-9]*[1-9][0-9]*$");  
		if(!reg.test(thisVal)) {  
		       alert("请输入正整数！"); 
		       $(this).val('');
		       $(this).val('');
		} 
	});
});