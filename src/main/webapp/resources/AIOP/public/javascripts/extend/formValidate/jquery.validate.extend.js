/**
 * addMethod(name,method,message)方法 
 * name-验证方法的名字 --- method-接收三个参数 (元素的值,元素本身,参数) --- message-自定义的错误提示
 */
(function( $ ) {
	$.validator.setDefaults({
		errorElement: 'span',
		errorPlacement: function(error, element) {
			var validateErrorMsgDivLen = element.parent().next('div.validate-error-msg').length;
			if(validateErrorMsgDivLen > 0){
				error.appendTo(element.parent().next('div'));
			}else{
				error.appendTo(element.parent());
			}
		},
		success: function(label) {  //验证成功后的执行的回调函数
			//label指向上面那个错误提示信息标签span
			label.text(" ")  //清空错误提示消息
			.addClass("success"); //加上自定义的success类
		},
		submitHandler: function() {
		    alert("提交事件!");
		}
	});
	//身份证
	$.validator.addMethod("idCard", function (value, element) {
	    var isIDCard1=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;//(15位)
	    var isIDCard2=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;//(18位)
	    return this.optional(element) || (isIDCard1.test(value)) || (isIDCard2.test(value));
	}, "请输入正确的身份证号");
	// 邮政编码验证       
	$.validator.addMethod("isPostCode", function(value, element) {       
	    var tel = /^[0-9]{6}$/;       
	    return this.optional(element) || (tel.test(value));       
	}, "请正确填写您的邮政编码"); 
	//传真
	$.validator.addMethod("isFax",function(value,element){
	    var fax = /^(\d{3,4})?[-]?\d{7,8}$/;
	    return this.optional(element) || (fax.test(value));
	},"传真格式如：0371-68787027");
	// 手机号码验证       
	$.validator.addMethod("isMobile", function(value, element) {       
	    var length = value.length;   
	    var mobile =/^[1][3-8]+\\d{9}/;   
	   return this.optional(element) || (length == 11 && mobile.test(value));       
	}, "请正确填写您的手机号码");       
	 // 电话号码验证       
	$.validator.addMethod("isTel", function(value, element) {       
	    var tel = /^\d{3,4}-?\d{7,9}$/;    //电话号码格式010-12345678   
	    return this.optional(element) || (tel.test(value));       
	}, "请正确填写您的电话号码");   
	// 联系电话(手机/电话皆可)验证   
	$.validator.addMethod("isPhone", function(value,element) {   
	    var length = value.length;   
	    var mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/;   
	    var tel = /^\d{3,4}-?\d{7,9}$/;   
	    return this.optional(element) || (tel.test(value) || mobile.test(value));   
	}, "请正确填写您的联系电话");
    //用户名最短5位，最长12位，请使用英文字母、数字和_（下划线），用户名首字符必须为字母或数字。
    $.validator.addMethod("userNameReg", function(value,element) {   
	    var usernameReg = /^(?!_)[a-zA-Z0-9_]{5,12}/;   
	    return this.optional(element) || (usernameReg.test(value));   
	}, "用户名最短5位，最长12位，请使用英文字母、数字和_（下划线），用户名首字符必须为字母或数字");
})(jQuery);