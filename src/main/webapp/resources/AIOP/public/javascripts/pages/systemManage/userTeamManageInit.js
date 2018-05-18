/**
 * ------------------------------------------------------------------
 * 用户组管理 
 * ------------------------------------------------------------------
 */
$(function(){
	userGroupManage.loadUserGroupGrid();//初始化加载用户组列表
	userGroupManage.loadUserGroupTree();//初始化加载所属用户组的ztree
	//查询按钮
	$("#searchUserTeamManage").click(function(){
		userGroupManage.refreshGridUserTeamManage();
		//用来服务器记录log
		$.AILog({
			  "action": "查询",//动作
			  "detail": "",//详情,默认为空
			  "module": "sys_manage_group"//二级菜单名称，如无二级菜单 使用一级菜单名称
		});
	});
	//新建按钮
	$('#userGroupAddBtn').click(function(){
		userGroupManage.insertOrUpdateUserGroup(this,'0');
	});
	//校验用户组名称
	$('#groupName').change(function(){
		userGroupManage.validateUserName('groupName');
	});
});
