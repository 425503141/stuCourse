/**
 * ------------------------------------------------------------------
 * 数据源配置
 * ------------------------------------------------------------------
 */
$(function(){
	sourceSetting.loadMenuList();//加载左侧业务名称
	sourceSetting.loadDatabaseType();//加载数据库类型
	sourceSetting.loadSourceInfoById('2');
	//测试按钮
	$('.J_test').click(function(){
		var menuId = $(this).attr('data-menuId');
		sourceSetting.dataBaseLinkTest(menuId);
	});
	//保存按钮
	$('.J_sourceSave').click(function(){
		var menuId = $(this).attr('data-menuId');
		sourceSetting.dataBaseUpdate(menuId);
	});
	//取消按钮
	$('.J_sourceCancel').click(function(){
		var menuId = $(this).attr('data-menuId');
		var $curBox = $("#source-"+menuId);
		$curBox.find('.J_testFailed,.J_testSuccess').addClass('hidden');
		sourceSetting.loadSourceInfoById(menuId);
	});
})

