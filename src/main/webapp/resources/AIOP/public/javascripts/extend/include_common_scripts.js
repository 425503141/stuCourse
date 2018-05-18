var Scripts = {
	//原生javascript加载js文件
	loadScript : function(option) {
		var defaults={
				src:"/assets/scripts/jQuery/jquery-ui-1.12.1.min.js",
				callback:function(){
					
				}
		};
		 option = Scripts.extend(defaults,option);
		  var script = document.createElement("script");
		  script.type = "text/javascript";
		  if(typeof(option.callback) != "undefined"){
		    if (script.readyState) {
		      script.onreadystatechange = function () {
		        if (script.readyState == "loaded" || script.readyState == "complete") {
		          script.onreadystatechange = null;
		          option.callback();
		        }
		      };
		    } else {
		      script.onload = function () {
		    	  	option.callback();
		      };
		    }
		  }
		  script.src = option.src;
		  document.head.appendChild(script);
		},
		//原生javascript加载CSS文件
		loadStyle : function(option) {
			var defaults={
					src:"../../assets/styles/base.css",
			};
			option = Scripts.extend(defaults,option);
			var link = document.createElement("link");
			link.rel="stylesheet";
			link.rev = "stylesheet";
			link.type = "text/css";
			link.href = option.src;
			document.head.appendChild(link);
		},
		/*
		 * @param {Object} target 目标对象。
		 *  @param {Object} source 源对象。 
		 *  @param{boolean} deep 是否复制(继承)对象中的对象。 
		 *   returns {Object} 返回继承了source对象属性的新对象。
		 */ 
		extend :  function(target, /* optional */source, /* optional */deep) { 
			target = target || {}; 
			var sType = typeof source, i = 1, options; 
			if( sType === 'undefined' || sType === 'boolean' ) { 
				deep = sType === 'boolean' ? source : false; 
				source = target; 
				target = this; 
			} 
			if( typeof source !== 'object' && Object.prototype.toString.call(source) !== '[object Function]' ) 
			source = {}; 
			while(i <= 2) { 
				options = i === 1 ? target : source; 
				if( options != null ) { 
					for( var name in options ) { 
						var src = target[name], copy = options[name]; 
						if(target === copy) 
						continue; 
						if(deep && copy && typeof copy === 'object' && !copy.nodeType) 
						target[name] = this.extend(src || (copy.length != null ? [] : {}), copy, deep); 
						else if(copy !== undefined) 
						target[name] = copy; 
					} 
				} 
				i++; 
			} 
			return target; 
		}
	
};
/****
 * 根据js加载进度 加载页面  重写window.onload
 */
var  mainPage={
	load:function(){
		var oldLoadFunc = window.onload;
		var mainObj = $("#mainPage");
		if(mainObj.length > 0){
			this.load();
		}
		
	}
};

/*******************************************************************************
 * 加载公用js、css v0.1
 * @author  wangsen3
 */
(function(Scripts){
	Scripts.loadStyle({src:"../../assets/styles/reset.css"});
	Scripts.loadStyle({src:"../../assets/styles/jQueryUI/jquery-ui-1.12.1.min.css"});
	Scripts.loadStyle({src:"../../assets/scripts/jQuery/gird/css/ui.jqgrid.css"});
	Scripts.loadStyle({src:"../../assets/styles/bootstrap/css/bootstrap.min.css"});
	Scripts.loadStyle({src:"../../assets/scripts/jQuery/gird/page/page.css"});
	Scripts.loadStyle({src:"../../assets/styles/bootstrap/css/bootstrap-multiselect.css"});
	Scripts.loadStyle({src:"../../assets/scripts/jQuery/gird/css/ui.jqgrid.owner.css"});
	Scripts.loadStyle({src:"../../assets/styles/jQueryUI/zTree/zTreeStyle/zTreeStyle.css"});
	Scripts.loadStyle({src:"../../assets/scripts/extend/dialog/alert/jquery.alert.css"});
	Scripts.loadStyle({src:"../../assets/styles/theme/default/header.css"});
	Scripts.loadStyle({src:"../../assets/styles/theme/default/main.css"});
	Scripts.loadScript({src:"../../assets/scripts/echart2.2.7/echarts-all.js"});
	Scripts.loadScript({src:"../../assets/scripts/vis/vis.min.js"});
	Scripts.loadScript({
		src:"../../assets/scripts/jQuery/jquery-1.12.4.js",
		callback:function(){
			Scripts.loadScript({src:"../../assets/scripts/profile.js"});
			Scripts.loadScript({src:"../../assets/scripts/extend/ajax/jQuery.ajax.js"});
			Scripts.loadScript({src:"../../assets/scripts/jQuery/gird/js/i18n/grid.locale-cn.js"});
			Scripts.loadScript({
				src:"../../assets/scripts/jQuery/gird/js/jquery.jqGrid.min.js",
				callback:function(){
					Scripts.loadScript({src:"../../assets/scripts/jQuery/gird/jquery.jqGrid.extend.js"});
					Scripts.loadScript({
						src:"../../assets/scripts/jQuery/jQueryUI/jquery-ui-1.12.1.min.js",
						callback:function(){
							$("#header").load($.ctx+"/pages/header.html",function(){
								mainPage.onload();
							});
						}
					});
				}
			});
			Scripts.loadScript({src:"../../assets/scripts/jQuery/gird/page/jquery.page.js"});
			Scripts.loadScript({src:"../../assets/scripts/extend/dialog/alert/jQuery.alert.js"});
			Scripts.loadScript({src:"../../assets/scripts/bootstrap/bootstrap.min.js"});
			Scripts.loadScript({src:"../../assets/scripts/bootstrap/bootstrap-multiselect.js"});
			Scripts.loadScript({src:"../../assets/scripts/extend/tree/jquery.ztree.all.min.js"});
			Scripts.loadScript({src:"../../assets/scripts/extend/tree/jQuery.tree.js"});
			Scripts.loadScript({src:"../../assets/scripts/extend/tree/jQuery.ComboTree.js"});
			Scripts.loadScript({src:"../../assets/scripts/extend/tooltip/tooltip.js"});
		}
	});
	
	
	
	
	
	
	
})(Scripts);