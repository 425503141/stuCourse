(function($) {
	$.fn.extend({
		loadSubMenu : function(options) {
			var defaults={
				subData:[],//{name:"",url:"",target:"",isSelect:true},{name:"",url:"",target:""}二级菜单
				firstMenu:""
			};
			var opts = $.extend(defaults, options);
			var data = opts.subData;
			var html ="";
			for(var i = 0, len = data.length;i<len;i++){
				var target = data[i].target ? data[i].target : "";
				html +=  '<li><a href="'+$.context+data[i].url+'" tatget="'+target+'">'+data[i].name+'</a></li>';
			}
			$(this).html(html);
			$(".J_navbar li").removeClass("active");
			$(opts.firstMenu).parent().addClass("active");
			var href = window.location.href;
			var selectedMenu = $(this).find("a[href *='"+href+"']");
			$(this).find("li").removeClass("active");
			$(selectedMenu).parent().addClass("active");
			var ssg = window.sessionStorage;
		}
	});
})(jQuery); 
$(function(){
	loadTopMenus();
	//鼠标经过头像
	$('.J_userInfoBox').hover(function(){
		$('.J_userInfoHide').toggleClass('hidden');
	});
	//搜索条件右侧得更多按钮
	$("#moreSearchBox").click(function(){
		if($(this).hasClass("active")){
			$(this).removeClass("active");
			$("#moreSearchCondition").addClass("hidden");
			$(this).find(">span").text("更多");
			$("#moreSearchCondition form")[0].reset();
			$("#moreSearchCondition select").val("");
			$("#moreSearchCondition select").multiselect('rebuild');
		}else{
			$(this).addClass("active");
			$("#moreSearchCondition").removeClass("hidden");
			$(this).find(">span").text("精简");
		}
	});
	$(document).on("click","#allTypeBtn,#statusContent>a,#queryAppMonitorList,#moreSearchBox,#schedulerStatusNumber > a ,#searchSchedulerList",function(event){
		event.stopPropagation();
		$("#tableCellInfo,#appTableInfoPanel").addClass("hidden");
		return false;
	});
	//退出
	$('#logOut').click(function(){
		try{			
			var ssg = window.sessionStorage;		
			if(!ssg.getItem("division").indexOf("0")){					
				window.sessionStorage.clear();
				window.close();
			}else if(!ssg.getItem("division").indexOf("3")){
				window.sessionStorage.clear();
				window.location.href = $.loginURL;	
			}else{
				window.sessionStorage.clear();
				window.location.href = $.loginURL;				
			}				
		}catch(error){
			window.location.href = $.loginURL;
		}
	})
});
function loadTopMenus(){
	var href = window.location.href;
	href = $.trim(href.replace($.context,""));
	var firstMenuArr = $(".J_navbar a.ui-menu");
	for(var i = 0,len = firstMenuArr.length;i<len;i++){
		var subMenuArr = $(firstMenuArr[i]).attr("data-subMenu");
		subMenuArr = subMenuArr ? $.parseJSON(subMenuArr) : [];
		var firstMenuHref = $(firstMenuArr[i]).attr("href");
		firstMenuHref = firstMenuHref ? firstMenuHref.split("/")[firstMenuHref.split("/").length-1] : "";
		firstHref = href.split("/")[href.split("/").length-1];
		if(subMenuArr &&subMenuArr.length>0){
			for(var j=0,length= subMenuArr.length;j<length;j++){
				if($.trim(subMenuArr[j].url).indexOf(href) != -1){
					$("#subheaderBox").loadSubMenu({
						subData:subMenuArr,
						firstMenu:firstMenuArr[i]
					});
					break;
				}
			}
		}else if($.trim(firstMenuHref) == firstHref){
			$("#subheaderBox").loadSubMenu({
				subData:[],
				firstMenu:firstMenuArr[i]
			});
			$(".ui-main-header .ui-submenu").hide();
			break;
		}
	}
	//三级菜单 保证二级菜单存在 && 树形菜单点击后 保证二级菜单存在
	var $secondMenuArr = $(".J_thirdMenu");
	if($secondMenuArr.length>0){
		var firstMenuId =  $(".J_thirdMenu").attr('data-firstMenuId');
		var subMenuArr = $('#'+firstMenuId).attr("data-subMenu");
		subMenuArr = subMenuArr ? $.parseJSON(subMenuArr) : [];
		$("#subheaderBox").loadSubMenu({
			subData:subMenuArr,
			firstMenu:'#'+firstMenuId
		});
		for(var i = 0,len = subMenuArr.length;i<len;i++){
			var hasChildren = subMenuArr[i].hasChildren;
			if(hasChildren){
				$('#subheaderBox').find('a[href="'+$.ctx+subMenuArr[i].url+'"]').parent().addClass('active');
			}
		}
	}
	loadUserInfoHeader();
}
//加载用户头像  并将用户id和用户权限存在session中
function loadUserInfoHeader(){
	 var ssg = window.sessionStorage;
	if(ssg){
		var token = ssg.getItem("token");
		$.AIGet({
			url:$.ctx+"/api/auth/me",
			data:{"token":token},
			success: function(data){
				$('#userNameHeader').html(data.data.userName);
				ssg.setItem("userId",data.data.userId);//个人中心使用
				$('#commonUserId').val(data.data.userId);//登录用户id取值使用
				ssg.setItem("authType",data.data.authType);//权限
				setUserRight(data);
			    setUserRightPic(data.data.userId,token);////导航右侧用户名头像
		    },
		});
	}
}
//根据登录用户权限不同 展示不同权限下的菜单
function setUserRight(param){
	var data = param.data;
	if(data.sysManage == 1){
		$("#systemManager").show();
		for(var key in data){
			if(key == "sysManageApp" ){
				var selectedMenu = $("#subheaderBox").find("a[href *='appManage']");
				if(data[key] == 1){
					selectedMenu.show();
				}else{
					selectedMenu.hide();
				}
			}else if(key == "sysManageUser"){
				var selectedMenu = $("#subheaderBox").find("a[href *='userManage']");
				if(data[key] == 1){
					selectedMenu.show();
				}else{
					selectedMenu.hide();
				}
			
			}else if(key == "sysManageGroup"){
				var selectedMenu = $("#subheaderBox").find("a[href *='userTeamManage']");
				if(data[key] == 1){
					selectedMenu.show();
				}else{
					selectedMenu.hide();
				}
				
			}else if(key == "sysManageAuth"){
				var selectedMenu = $("#subheaderBox").find("a[href *='rightsManage']");
				if(data[key] == 1){
					selectedMenu.show();
				}else{
					selectedMenu.hide();
				}
			}else if(key == "sysManageLog"){
				var selectedMenu = $("#subheaderBox").find("a[href *='operateLog']");
				if(data[key] == 1){
					selectedMenu.show();
				}else{
					selectedMenu.hide();
				}
			}else if(key == "sysDbSetting"){ //sysDbSetting
				var selectedMenu = $("#subheaderBox").find("a[href *='sourceSetting']");
				if(data[key] == 1){
					selectedMenu.show();
				}else{
					selectedMenu.hide();
				}
			}else if(key == "sysDaqPlan"){ 
				var selectedMenu = $("#subheaderBox").find("a[href *='acquisitionCyclePlan']");
				if(data[key] == 1){
					selectedMenu.show();
				}else{
					selectedMenu.hide();
				}
			}
		}
	}else{
		$("#systemManager").hide();
	}
}
//导航右侧用户名头像
function setUserRightPic(userId,token){
	$.AIGet({
	   	   url:$.ctx + "/api/sys/personCenter/getByUserId",
	   	   data:{"userId":userId},
	   	   success:function(result) {
	   		        if(result.status=='200' && result.data){
	   		        	var data = result.data;
	   		        	if(!data.userPic){
	   		        		$(".J_userPicHead,.J_userPic").attr("src","../public/avatar.png");
	   		        	}else{
	   		        		$(".J_userPicHead,.J_userPic").attr("src",$.ctx + "/api/sys/outPutPic?token="+token+"&userPic="+data.userPic);
	   		        	}
	   		        }
	   	  	}
	});
}
