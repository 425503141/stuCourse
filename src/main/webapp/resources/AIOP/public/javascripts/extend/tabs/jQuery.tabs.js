
/**
 * 基于jQueryUI  tab 插件处理
 *  @param option  js对象
 */
(function(){
	$.fn.extend({
		tabBar:function(option){
			  var defaults = {
				   data:[{ //tab数据信息
					     name:"新建策略",
						 type:"div",//以div方式加载tab ，
						 id:"tabs_"+random(10),//以DIV加载要传入参数，否则随机生成ID	 
						// url:"https://www.baidu.com/"//以iframe加载的必须传递参数，否则默认跳转百度首页
						 content:"<a href='58.com'>58同城</a>"//jQuery对象或者html
				   },
				   { //tab数据信息
					     name:"策略列表",
						 type:"page",// 以iframe类型加载，
						// id:"#tad1",//以DIV加载要传入参数，否则随机生成ID	 
						 url:"https://www.baidu.com/"//以iframe加载的必须传递参数，否则默认跳转百度首页
				   }],
				   tabAttr:{
					   active:false,//面板是否打开
					   classes:{//指定那个元素添加Class
						   "ui-tabs": "ui-corner-all",
						   "ui-tabs-nav": "ui-corner-all",
						   "ui-tabs-tab": "ui-corner-top",
						   "ui-tabs-panel": "ui-corner-bottom"
						 },
						 isClose:true,//tab框是否可以关闭
						 collapsible:false,//是否可折叠
						 disabled:false,//是否禁用
						 event: "click",//如何打开tab选项卡 例： mouseover
						 heightStyle:"content",//"auto":tab将被设置为页面高度。 "fill": tab和父类高度一致 "content":和内容高度一致
						 hide: null,//{ effect: "explode", duration: 1000 },//如何隐藏面板 以何种动画方式 （参考jQueryUI的 hide动画类型)
						 show:null,// { effect: "blind", duration: 800 },//同hide参数
						 create: function( event, ui ) {},//tab创建回调
						 beforeLoad: function( event, ui ) {
					        ui.jqXHR.fail(function() {
					          ui.panel.html("页面请求失败，请重试！" );
					        });
					      }
				    }
			  };
			  var data = $.extend(defaults.data,option.data);
			  var tab = $.extend(defaults.tabAttr,option.tabAttr);
			  var $this = this;
			  var $ul = $('<ul></ul>');
			  $($this).append($ul);
			  var currentDom ="";
			  for(var i=0,len=data.length;i<len;i++){
				  if(data[i].type == "div"){
					  var id = data[i].id? data[i].id :id = "tabs_"+random(10);
					  currentDom = $('<li><a href="#'+id+'">'+data[i].name+'</a></li>');//TODO 拼tab头和内容
					  var tabContent = $(' <div id="'+id+'"></div>').append(data[i].content);
				  }else if(data[i].type == "page"){
					  currentDom = $('<li><a href="'+data[i].url+'">'+data[i].name+'</a></li>');//TODO 拼tab头和内容
				  }
				  if(tab.isClose){
					  currentDom.append('<span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span>');
				  }
				  $($this).append(tabContent);
				  $ul.append(currentDom);
			  }
			  var tabs = $(this).tabs(tab);//加载tab插件
			  tabs.on( "click", "span.ui-icon-close", function() {
			      var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
			      $( "#" + panelId ).remove();
			      tabs.tabs( "refresh" );
		     });
			  
			  function random(len, radix) { 
			    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); 
			    var chars = CHARS, uuid = [], i; 
			    radix = radix || chars.length; 
			    if (len) { 
			      // Compact form
			      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix]; 
			    } else { 
			      // rfc4122, version 4 form
			      var r; 
			      // rfc4122 requires these characters
			      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'; 
			      uuid[14] = '4'; 
			      // Fill in random data. At i==19 set the high bits of clock sequence as
			      // per rfc4122, sec. 4.1.5
			      for (i = 0; i < 36; i++) { 
			        if (!uuid[i]) { 
			          r = 0 | Math.random()*16; 
			          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]; 
			        } 
			      } 
			    } 
			    return uuid.join(''); 
			  }; 
		  } 
	  });
})($);