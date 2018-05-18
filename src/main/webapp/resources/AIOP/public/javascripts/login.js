$(function(){
	$(".btn-submit").click(function(){
		loginFunc();
	});
	$("#captcha,#pwd,#userName,.btn-submit").keyup(function(e){
		e = e || window.event;
		if(e.keyCode == 13){
			loginFunc();
		}
	});
	$("#loginCaptcha").attr("src",$.ctx+"/captcha").click(function(){
		$(this).attr("src",$.ctx+"/captcha?_="+Math.random());
	});
});
//登录
function loginFunc(){
	var formData = formFmt.formToObj($("#loginForm"));
	if($.trim(formData.username).length == 0){
		$("#errrorMessage").html("请输入用户名");
		return false;
	}else if($.trim(formData.password).length == 0){
		$("#errrorMessage").html("请输入密码");
		return false;
	}else if($.trim(formData.captcha).length == 0){
		$("#errrorMessage").html("请输入验证码");
		return false;
	}else{
		$("#errrorMessage").empty();
	}
	
	formData.code = getCookie("code");
	$.AIPost({
		url:$.ctx+"/api/auth/login",
		data:formData,
		error:function (XMLHttpRequest, textStatus, errorThrown) {
			if(XMLHttpRequest.status == 401){
				$("#errrorMessage").html(XMLHttpRequest.responseJSON.message);
			}
		},
		success: function(data){
//			console.log(data)
			 var ssg = window.sessionStorage;
			if(ssg){
				ssg.setItem("token",data.token);
				ssg.setItem("division","1");
			}
			window.location.href= $.forward;
	    },
	});
}
function getCookie(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}