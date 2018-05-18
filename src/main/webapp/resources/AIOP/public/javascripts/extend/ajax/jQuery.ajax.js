
/**
 *  ajax 封装处理
 */
(function(){
	$.extend({
		fetch:function(option){
			var token = null;
			  var defaults = {
				  url: " ",
				   data: {},
				   async:true,
				   dataType:"json",
				   headers:{
					   "Content-Type": "application/json; charset=utf-8",
					   'Access-Control-Allow-Origin': '*',
				   },
				   success: function(data){
					   
				   },
				   beforeSend:function (XMLHttpRequest) {
					    // this;// 调用本次AJAX请求时传递的options参数
				   },
				   complete:function (XMLHttpRequest, textStatus) {
					    //this; // 调用本次AJAX请求时传递的options参数
				   },
				   error:function (XMLHttpRequest, textStatus, errorThrown) {
					    // 通常 textStatus 和 errorThrown 之中
					    // 只有一个会包含信息
					    //this; // 调用本次AJAX请求时传递的options参数
					   if(XMLHttpRequest.status == 401){
//						   alert("会话已过期，请重新登录！");
						   window.location.href= $.loginURL;
					   }
					   try{
//						   alert("请求出错~！");
						   console.log(errorThrown);
//						   window.location.href= $.loginURL;
					   }catch(error){
//						   window.location.href= $.loginURL;
					   }
				   }
			  };
			 var ssg = window.sessionStorage;
			if(ssg){
				token = ssg.getItem("token");
				if(token){
					defaults.headers['X-Authorization'] = token;
				}
			}
			option = $.extend(defaults,option);
			$.ajax(option);
		} ,
		/****
		 * 创建方法
		 */
		AIPost:function(option){
			  var defaults = {
					  url: " ",
					   data: {},
					   async:true,
					   dataType:"json",
					   type:"POST",
					   success: function(data){
						   
					   } 
				  };
			  option = $.extend(defaults,option);
			  var data = option.data;
			  if($.type(data) != "string"){
				  option.data = JSON.stringify(data);
			  }
			$.fetch(option);
		} ,
		/****
		 * 删除方法
		 */
		AIDel:function(option){
			var defaults = {
					url: " ",
					data: {},
					async:true,
					dataType:"json",
					type:"DELETE",
					success: function(data){
						
					} 
			};
			option = $.extend(defaults,option);
			 var data = option.data;
			  if($.type(data) != "string"){
				  option.data = JSON.stringify(data);
			  }
			$.fetch(option);
		} ,
		/****
		 * 修改方法
		 */
		AIPut:function(option){
			var defaults = {
					url: " ",
					data: {},
					async:true,
					dataType:"json",
					type:"PUT",
					success: function(data){
						
					} 
			};
			var data = option.data;
			  if($.type(data) != "string"){
				  option.data = JSON.stringify(data);
			  }
			option = $.extend(defaults,option);
			$.fetch(option);
		},
		/****
		 * 查询方法
		 */
		AIGet:function(option){
			var defaults = {
					url: " ",
					data: {},
					async:true,
					dataType:"json",
					type:"GET",
					success: function(data){
						
					} 
			};
			option = $.extend(defaults,option);
			$.fetch(option);
		},
		/****
		 * 用来服务器记录log
		 */
		AILog:function(option){
			$.AIPost({
				url:$.ctx + "/api/log",
				datatype:"json",
				data:option,
				success:function(result){
					//console.log('记录日志成功')
				}
			})
		},
		/**
		 * 原生ajax
		 */
		xhr:function() {  
		    if(typeof XMLHttpRequest != 'undefined'){  
		        return new XMLHttpRequest();  
		    }  
		    else if(typeof ActiveXObject != 'undefined'){  
		        if(typeof arguments.callee.activeXString != 'string'){  
		            var versions = ['MSXML2.XMLHttp.6.0','MSXML2.XMLHttp.3.0' ,'MSXML2.XMLHttp'], // ie browser different vesions  
		                i,len;  
		            for(i=0,len=versions.length; i<len;i++){  
		                try{  
		                    new ActiveXObject(versions[i]);  
		                    arguments.callee.activeXString = versions[i];  
		                    break;  
		                }  
		                catch(ex){  
		                    // jump  
		                }  
		            }  
		        }  
		        return new ActiveXObject(arguments.callee.activeXString);  
		          
		    }  
		    else{  
		        throw new Error('No XHR object available.');  
		    }  
		},
		/**
		 * 发送请求
		 */
		xhrRequest:function(option){  
			var defaults={
				type:"get",
				url:"",
				success:function(xhr){
					
				},
				data:{},
				sync:true
			};
			option = $.extend(defaults,option);
		    var xhr = $.xhr();  
		    xhr.onreadystatechange = function(){  
		        if(xhr.readyState == 4){  
		            if((xhr.status >= 200 && xhr.status<300) || xhr.status == 304){  //200 表示相应成功 304 表示缓存中存在请求的资源  
		                // 对响应的信息写在回调函数里面  
//		                var str = xhr.status+' '+xhr.responseText;  
		            		option.success(xhr);  
		            }  
		            else{  
		                return 'request is unsucessful '+xhr.status;  
		            }  
		        }  
		    }  
		    option.url = option.url+"?"+ $.convertData(option.data);
		    xhr.open(option.type,option.url,option.sync);  
		    var ssg = window.sessionStorage;
		    var token="";
			if(ssg){
				token = ssg.getItem("token");
				if(token){
					xhr.setRequestHeader("X-Authorization", token);
					xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
				}
			}
		    xhr.send(); 
		} ,
		convertData:function (data){ 
	    	  if( typeof data === 'object' ){ 
	    	    var convertResult = "" ;  
	    	    for(var c in data){  
	    	      convertResult+= c + "=" + data[c] + "&";  
	    	    }  
	    	    convertResult=convertResult.substring(0,convertResult.length-1) 
	    	    return convertResult; 
	    	  }else{ 
	    	    return data; 
	    	  } 
	    	} 
	  });
})($);