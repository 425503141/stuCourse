/**
 * ------------------------------------------------------------------
 * 我的资料
 * ------------------------------------------------------------------
 */
$(function(){
	$('.ui-submenu').hide();
	$('.J_navbar li').removeClass('active');//当页面再个人中心界面时，顶部菜单选中的是应用监控？ （应该去掉选中状态）
	userInfo.loadUserInfoById();//获取个人信息
	//取消按钮
	$('.J_myInfoCancel').click(function(){
    	$(".J_confirmDlg").confirm({
			 	height:"auto",
			 	title:"提示",
			 	content:'确定放弃所填内容？',
			 	callback:function(){
			 		userInfo.loadUserInfoById();//重新获取个人信息
			 	}
		   	})
	});
	//确定保存按钮
	$('.J_myInfoSave').click(function(){
		userInfo.saveMyInfo();
	});
	//上传头像按钮
	$("#filePicBox").on("change","#filePic",function(){
		var ssg = window.sessionStorage;
		if(ssg){
			var userId = ssg.getItem("userId");
			var token = ssg.getItem("token");
		}
	  	$.fileUpload({
	  		url:$.ctx + "/api/sys/user/userPicUpload",
	  		fileElementId:"filePic",
	  		data:{"userId":userId},
	  		dataType:'json',
	  		type:"POST",
	  		success:function(data){
  				if(data.status == 200){
  					$(".J_fileMsg").removeClass('visibility-hidden').text("上传成功");
  					//$('.J_userPicUp').attr('src',$.context+'/public/'+data.data);
  					$('input[name=userPic]').val(data.data);
  					$(".J_userPicUp").attr("src",$.ctx + "/api/sys/outPutPic?token="+token+"&userPic="+data.data);
  				}else{
  					$(".J_fileMsg").removeClass('visibility-hidden').text(data.message);
  					var file = $("#filePic");  
  					file.after(file.clone().val(""));     
  					file.remove();   
  				}
	  		}
	  	});
	 });
	//校验手机号
	$('#userTel').change(function(){
		userInfo.validatePhoneNO(event,this);
	});
})

