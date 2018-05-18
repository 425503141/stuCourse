
/**
 * 手风琴效果
 */
(function(){
	$.fn.extend({
		dataAccordion:function(option){
			  var defaults = {
				   data:[
				    {
				        title:{
				        		name:"",
				        		id:"",
				        		value:""
				        },
				        content:"<div></div>"
				     },
				     {
					        title:{
					        		name:"",
					        		id:"",
					        		value:""
					        },
					        content:"<div></div>"//$(DOM)
					     },//title accordion的标题也就是菜单，content：内容区域 可以是html片段也可以是jQuery对象
				   ],//数据
				   accordion:{
					   active:0,//默认第几个打开
					   animate:{},//设置动画可是string  number object  boolean
					   event: "click",//设置打开方式“click”，‘mouseover’
					   heightStyle:"content",//"auto":tab将被设置为页面高度。 "fill": tab和父类高度一致 "content":和内容高度一致
					   icons: {
						   "header": "ui-icon-triangle-1-e",
						   "activeHeader": "ui-icon-triangle-1-s"
						 },//设置手风琴图标
						 activate: function( event, ui ) {},
						 beforeActivate: function( event, ui ) {},
						 create: function( event, ui ) {}
			      }
			   }
			  var data = $.extend(defaults.data,option.data);
			  var options = $.extend(defaults.accordion,option.accordion);
			  var _this = this;
			  for(var i = 0,len= data.length;i<len;i++){
				  var title = ' <h3 id="'+data[i].title.id+'" data-value="'+data[i].title.value+'">'+data[i].title.name+'</h3>';
				  var content=data[i].content;
				  $( _this ).append(title).append(content);
			  }
			  $( _this ).accordion(options);
		} 
	  });
})($);