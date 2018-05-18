
/**
 * 手风琴效果
 */
(function(){
	$.extend({
		fileUpload:function(option){
			var defaults={
                    url: '/upload.do', //用于文件上传的服务器端请求地址
                    secureuri: false, //是否需要安全协议，一般设置为false
                    fileElementId: $(_this).attr("id"), //文件上传域的ID
                    dataType: 'json', //返回值类型 一般设置为json
                    headers:{
 					   "Content-Type": "application/json; charset=utf-8",
 					   'Access-Control-Allow-Origin': '*',
 				   },
                    data:{},//传输的数据
                    success: function (data, status){  //服务器成功响应处理函数
                        if (typeof (data.error) != 'undefined') {
                            if (data.error != '') {
                                alert(data.error);
                            } else {
                                alert(data.msg);
                            }
                        }
                    },
                    error: function (data, status, e){//服务器响应失败处理函数
                        alert(e);
                    }
                };
			var _this = this;
			option =  $.extend(defaults,option);
			//传给后台token
			var ssg = window.sessionStorage;
			if(ssg){
				token = ssg.getItem("token");
				if(token){
					defaults.headers['X-Authorization'] = token;
					option.data.token = token;
				}
			}
			$.ajaxFileUpload(option);
		}
			 
	  });
})($);