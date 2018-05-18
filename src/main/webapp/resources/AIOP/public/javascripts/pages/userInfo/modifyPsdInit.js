/**
 * ------------------------------------------------------------------
 * 修改密码
 * ------------------------------------------------------------------
 */
$(function(){
	$('.ui-submenu').hide();
	$('.J_navbar li').removeClass('active');//当页面再个人中心界面时，顶部菜单选中的是应用监控？ （应该去掉选中状态）
	userInfo.loadUserInfoById();
	//取消按钮
	$('.J_myInfoCancel').click(function(){
    	$(".J_confirmDlg").confirm({
			 	height:"auto",
			 	title:"提示",
			 	content:'确定放弃密码修改？',
			 	callback:function(){
			 		alert('此处清空所有值 回到初始状态')
			 	}
		   	})
	});
	//确定保存按钮
	$('.J_myInfoSave').click(function(){
		userInfo.saveModifyPsd();
	});
})

