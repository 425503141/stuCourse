/**
 * ------------------------------------------------------------------
 * form 表单常用操作
 * ------------------------------------------------------------------
 */
var formFmt = (function (model){

        //开发版本号
        model.version = "1.0.0";
        model.author  = "xiaoyx";
        model.email   = "xiaoyx@asiainfo.com";

        /**
         * @description 将form 中的查询条件转化为json格式对象
         * @param {Jquery} [formObj] [form表单对象]
         * @return {Object} json 格式的对象
         * ------------------------------------------------------------------
         */
        
        model.formToObj = function(formObj) {
            var data={};  
//            var array = $(formObj).serializeArray();
            var array =this.serialize($(formObj)[0]);
            //方法一  
          /*  $(array).each(function(){  
                    if(data[this.name]){  
                        if($.isArray(data[this.name])){  
                            data[this.name].push(this.value);  
                        }else{  
                            data[this.name]=[data[this.name],this.value];  
                        }  
                    }else{  
                        data[this.name]=this.value;   
                    }  
                });*/
            //方法二
            array.map(function(x){
              if (data[x.name] !== undefined ) {
                        if (!data[x.name].push) {
                            data[x.name] = [data[x.name]];
                        }
                        data[x.name].push(x.value || '');
                    } else {
                        data[x.name] = x.value || '';
                    }
             });
            
            return data;  
        };
        model.serialize=function(form) { // form为form元素的引用// 序列化
            var arr = new Array(),
            elements = form.elements,
            checkboxName = null;
            for(var i = 0, len = elements.length; i < len; i++ ) {
                field = elements[i];
                // 不发送禁用的表单字段
               /* if(field.disabled) {
                    continue;
                }*/
                switch (field.type) {
                    // 选择框的处理
                    case "select-one":
                    case "select-multiple":
                    		if($.trim(field.name).length > 0){
                    			var obj = {};
                    			obj["name"] = field.name;
                    			obj["value"] = formFmt.getSelectValue(field);
                    			arr.push(obj);
                    		}
                        break;
                    
                    // 不发送下列类型的表单字段    
                    case undefined :
                    case "button" :
                    case "submit" :
                    case "reset" :
                    case "file" :
                        break;
                    
                    // 单选、多选和其他类型的表单处理     
                    case "checkbox" :
                        if(checkboxName == null) {
	                    		if($.trim(field.name).length > 0){
	                    			var obj = {};
	                    			obj["name"] = field.name;
	                    			obj["value"] = formFmt.getCheckboxValue(form.elements[checkboxName]);
	                    			arr.push(obj);
	                    		}
                        }
                        break;
                    case "radio" :
                        if(!field.checked) {
                            break;
                        }
                    default:
                        if(field.name.length > 0) {
	                    		if($.trim(field.name).length > 0){
	                    			var obj = {};
	                    			obj["name"] = field.name;
	                    			obj["value"] = field.value;
	                    			arr.push(obj);
	                    		}
                        } 
                }
            }
            return arr;
        } ;
        model.getRadioValue=function(elements) {// 获取单选按钮的值，如有没有选的话返回null
            // elements为radio类的集合的引用
            var value = null; // null表示没有选中项
            // 非IE浏览器
	        	if(!elements){
	        		return "";
	        	}
            if(elements.value != undefined && elements.value != '') {
                value = elements.value;
            } else {
                // IE浏览器
                for(var i = 0, len = elements.length; i < len; i++ ) {
                    if(elements[i].checked) {
                        value = elements[i].value;
                        break;
                    }
                }
            }
            return value;
        };
        
        // 获取多选按钮的值，如有没有选的话返回null
        // elements为checkbox类型的input集合的引用
        model.getCheckboxValue= function(elements) {
	        	if(!elements){
	        		return "";
	        	}
            var arr = new Array();
            for(var i = 0, len = elements.length; i < len; i++ ) {
                if(elements[i].checked) {
                    arr.push(elements[i].value);
                }
            }
            if(arr.length > 0) {
                return arr;
            } else {
                return null; // null表示没有选中项
            }    
        };
        // 获取下拉框的值
        // element为select元素的引用
        model.getSelectValue= function(element) {
            if(element.selectedIndex == -1) {
                return ""; // 没有选中的项时返回null
            };
            if(element.multiple) {
                // 多项选择
                var arr = new Array(), options = element.options;
                for(var i = 0, len = options.length; i < len; i++) {
                    if(options[i].selected) {
                        arr.push(options[i].value);
                    }
                }
                return arr;
            }else{
                // 单项选择
                return element.options[element.selectedIndex].value;
            }
        };
        return model;

   })(window.formFmt || {});