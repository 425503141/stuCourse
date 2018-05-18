/**
 * ------------------------------------------------------------------
 *个人中心
 * ------------------------------------------------------------------
 */
var userInfo = (function (model){ 
	/**
	   * @description 根据id查询用户个人信息
	 */
   model.loadUserInfoById = function() {
	    var ssg = window.sessionStorage;
		if(ssg){
			var userId = ssg.getItem("userId");
			var token = ssg.getItem("token");
			$.AIGet({
			   	   url:$.ctx + "/api/sys/personCenter/getByUserId",
			   	   data:{"userId":userId},
			   	   success:function(result) {
			   		        if(result.status=='201'){
			   		        	$("#SMStelDlg").alert({
								   title:"提示",
								   content:result.message,
								   dialogType:"failed"//状态类型：success 成功，failed 失败，或者错误，info提示
							    });
			   		        	return;
			   		        }
			   		        if(result.status=='200' && result.data){
			   		        	var data = result.data;
			   		        	//$('.J_userPicHead').attr('src',$.context+'/public/'+data.userPic);
			   		        	//$('.J_userPic').attr('src',$.context+'/public/'+data.userPic);
			   		        	if(!data.userPic){
			   		        		$(".J_userPicHead,.J_userPic").attr("src","../public/avatar.png");
			   		        	}else{
			   		        		$(".J_userPicHead,.J_userPic").attr("src",$.ctx + "/api/sys/outPutPic?token="+token+"&userPic="+data.userPic);
			   		        	}
			   		        	$('#userInfoName').text(data.userName);
			   		        	$('input[name=userId]').val(data.userId);
			   		        	$('input[name=userName]').val(data.userName);
			   		        	$('input[name=realName]').val(data.realName);
			   		        	$('input[name=userMail]').val(data.userMail);
			   		        	$('input[name=userTel]').val(data.userTel);
			   		        	$('input[name=userPic]').val(data.userPic);
			   		        	$('#createTime').val(DateFmt.Formate(data.createTime,"yyyy-MM-dd HH:mm:ss"));
			   		        }
			   	  		}
			     });
		}
   };
   /**
    * @description 我的资料 保存
   */
   model.saveMyInfo = function() {
	   var ajaxData = formFmt.formToObj($("#myInfoForm"));
		$.AIPut({
		   	   url:$.ctx + "/api/sys/personCenter/update",
		   	   data:ajaxData,
		   	   success:function(result) {
		   		        if(result.status=='201'){
		   		        	$("#SMStelDlg").alert({
							   title:"提示",
							   content:result.message,
							   dialogType:"failed"
						    });
		   		        	return;
		   		        }
		   		        if(result.status=='200'){
		   		        	$("#SMStelDlg").alert({
								   title:"提示",
								   content:'修改个人资料成功',
								   dialogType:"success"
							});
		   		        	userInfo.loadUserInfoById();//获取个人信息
		   		        }
		   	  		}
		     });
   };
   /**
    * @description 修改密码 保存
   */
   model.saveModifyPsd = function() {
	   var ajaxData = formFmt.formToObj($("#modifyPsdForm"));
		$.AIPut({
		   	   url:$.ctx + "/api/sys/personCenter/updatePsd",
		   	   data:ajaxData,
		   	   success:function(result) {
		   		        if(result.status=='201'){
		   		        	$("#SMStelDlg").alert({
							   title:"提示",
							   content:result.message,
							   dialogType:"failed"//状态类型：success 成功，failed 失败，或者错误，info提示
						    });
		   		        	return;
		   		        }
		   		        if(result.status=='200'){
		   		        	$("#SMStelDlg").alert({
								   title:"提示",
								   content:'修改密码成功',
								   dialogType:"success"
							});
		   		        	$('#logOut').click();//修改成功之后退出重新登录
		   		        }
		   	  		}
		     });
   };
   /**
    * @description 手机号校验
   */
   model.validatePhoneNO = function(event,obj){
   	var userPhone = $.trim($(obj).val());
   	var phoneNOReg = /^1[3|4|5|7|8][0-9]{9}$/;
   	if(!phoneNOReg.test(userPhone)){
   		$(".userTelTip .J_message span").text("请输入正确的手机号").removeClass("has-success").addClass("has-error");
   		return;
   	}else{
   		$(".userTelTip .J_message span").text("").removeClass("has-error").addClass("has-success");
   	}
   }
   return model;
})(window.userInfo || {});
