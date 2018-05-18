$(function(){	
		loginFunc();
});
//登录
function loginFunc(){
	$.AIGet({
		url:$.ctx+"/api/auth/publicity",
		error:function (XMLHttpRequest, textStatus, errorThrown) {
			if(XMLHttpRequest.status == 401){
				window.location.href= $.publicityUrl;//认证失败跳转到平台展示
			}
		},
		success: function(data){
//			console.log(data)
			 var ssg = window.sessionStorage;
			if(ssg){
				ssg.setItem("token",data.token);
				ssg.setItem("division","3");
			}
			window.location.href= $.forward;
	    },
	});
}

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
	}