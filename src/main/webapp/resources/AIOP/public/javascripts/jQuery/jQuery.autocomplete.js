
/**
 *  ajax 封装处理
 */
(function(){
	$.fn.extend({
		AIAutoComplete:function(option){
			var _self = $(this);
			  var defaults = {
				  url:"",
				  jsonReader:{
					  item:"appName",
					  id:null
				  },
				  data:{
					  "domId":"paramName"//dom ID ：参数名称
				  }
			  };
			opts = $.extend(defaults,option);
			var jsonReader = $.extend(defaults.jsonReader,option.jsonReader);
			$( _self ).autocomplete({
			      source:  function( request, response ) {
			    	  	var data ={};
		    	  		  for(var i in opts.data){
		    	  			data[opts.data[i]] = $("#"+i).val();
					  }
			          $.AIGet( {
			        	  	url:opts.url,//$.ctx + "/api/appMonitor/common/appNames",
			        	  	 data:data,
			        	  	success:function( data) {
			        	  		response($.map(data.data, function( item ) { // 此处是将返回数据转换为 JSON对象，并给每个下拉项补充对应参数
			                    if(opts.jsonReader.id){
			                    		return {
			                             // 设置item信息
			                        		label:item[jsonReader.item],
			                        		value: item[jsonReader.item], // 下拉项显示内容
			                        		id:item[jsonReader.id]
			                        }
			                    }else{
				                    	return {
				                    		// 设置item信息
				                    		label:item[jsonReader.item],
				                    		value: item[jsonReader.item] // 下拉项显示内容
				                    	}
			                    }   
			                    }));
			        	  		}
			          });
			      }
		    });
		}  
	  });
})($);