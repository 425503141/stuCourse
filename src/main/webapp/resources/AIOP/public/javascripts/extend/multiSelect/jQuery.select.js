
/**
 * 基于jQuerymultiSelect 插件处理
 *  @param option  js对象
 *  el.multiselect('refresh');//刷新该插件
 */
(function(){
	$.fn.extend({
		multiSelect:function(option){
			var defaults = {
				multiple: false,
				header: "",//"请选择",
				noneSelectedText: "--请选择--",//没有选择的时候
				selectedList: 1,//选择个数1->N
				checkAllText: '全选',//全选按钮默认文本
			    uncheckAllText: '全不选',//全不选按钮默认文本
				position: {
					my: 'top',
					at: 'center'
				},//位置信息 
				click: function(event, ui){
			    },
			    beforeopen: function(){
			    },
			    open: function(){
			    },
			    beforeclose: function(){
			    },
			    close: function(){
			    },
			    checkAll: function(){
			    },
			    uncheckAll: function(){
			    },
			    optgrouptoggle: function(event, ui){
			    }
			};
			var _this = this;
			option = $.extend(defaults,option);
			return $("select").multiselect(option);
		}
	  });
})($);