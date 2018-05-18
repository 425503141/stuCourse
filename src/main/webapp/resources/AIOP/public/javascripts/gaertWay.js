$(function(){	
		loginFunc();
});
//登录
function loginFunc(){
	var token=getQueryString("token");
	$.AIGet({
		url:$.ctx+"/api/auth/gateway",
		data:{"token":token},
		error:function (XMLHttpRequest, textStatus, errorThrown) {
			if(XMLHttpRequest.status == 401){
				window.location.href= $.gaertwayUrl;//认证失败跳转到 门户地址
			}
		},
		success: function(data){
//			console.log(data)
			 var ssg = window.sessionStorage;
			if(ssg){
				ssg.setItem("token",data.token);
				ssg.setItem("division","0");
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