
/**
 * 生成多维查询
 */
(function(){
	$.fn.extend({
		multiQuery:function(option){
			  var defaults = {
				   data:[
				      {
				        	 "name":"品牌",
				        	 id:"brand",
				        	 children:[{"name":"apple","value":"a1","id":"a3"},{"name":"三星","value":"a2","id":"a4"}] , 
				        	 exclusive:false
				     },
				     {
				        	 "name":"储存",
				        	 id:"Storage",
				        	 children:[
				        	           {"name":"16G","value":"16","id":"a5","children":[{"name":"","id":"","children":[ {"name":"32G","value":"32","id":"a6"}, {"name":"64G","value":"64","id":"a7"}]},{"name":"16G","value":"64","id":"a7"}]},
				        	           {"name":"32G","value":"32","id":"a6"},
				        	           {"name":"64G","value":"64","id":"a7"}
				        	 ] , 
				        	 exclusive:false
				     }//互斥  true互斥，false不互斥//互斥  true互斥，false不互斥
				   ],//数据
				   "getSelectedData":function(){
					  var list = [];
					  var currentDOMList = $("#selectedCondition > li");
					  for(var i = 0 ,len = currentDOMList.length;i<len;i++){
						  var value = $(currentDOMList[i]).attr("data-value");
						  var pId =  $(currentDOMList[i]).attr("pId");
						  var id =  $(currentDOMList[i]).attr("id").replace("selected_","");
						  var name = $(currentDOMList[i]).find("a").first().text();
						  list.push({id:id,name:name,pId:pId,value:value});
					  }
				    	 return list;
				   }
			  };
			if(defaults[option] && typeof option === 'string' ){
				return defaults[option].apply(this, Array.prototype.slice.call(arguments, 1));
			}else if (typeof option === 'object'){
				option = $.extend(defaults,option);
			}
			var $this = $(this);
			var queryConditionList = $(' <ul class="query-condition-list"></ul>');
			var selectedDom = ('<div class="selected-condition-box clearfix"><label>已选条件：</label><div><ul class="clearfix" id="selectedCondition"></ul></div></div>');
			var data = option.data;
			for(var i=0 , len = data.length ; i< len ; i++ ){
				var conditionDOM = $('<li class="clearfix" data-exclusive ="'+data[i].exclusive+'" id="'+data[i].id+'"><label>'+data[i].name+'：</label><div><ul class="clearfix"></ul></div></li>');
				conditionLoop(data[i],conditionDOM);
				queryConditionList.append(conditionDOM);
			}
			$this.append( queryConditionList ).append( selectedDom );
			var clearTime;
			$($this).on("mouseover",".J_condition[isHaveChild]",function(){
				$(".ui-child-box").remove();
				var $parent = $(this).parent();
				var $secCondotion = $('<div class="ui-child-box"></div>');
				var secConditionList = $(' <ul class="query-condition-list"></ul>');
				var data = $(this).data("conditionChildren") ? $(this).data("conditionChildren") : [];
				for(var i=0,len = data.length;i<len; i++){
					var $title = $('<label>'+data[i].name+'</label>').bind("click",function(){
						conditionClick(event,this);
					});
					var conditionDOM = $('<li class="clearfix" data-exclusive ="'+data[i].exclusive+'" id="'+data[i].id+'"><div><ul class="clearfix"></ul></div></li>');
					conditionDOM.find(">div").before($title);
					conditionLoop(data[i],conditionDOM);
					secConditionList.append(conditionDOM);
				}
				$secCondotion.html(secConditionList);
				$parent.after($secCondotion);
				$(this).addClass("hover");
				if(clearTime){
					clearTimeout(clearTime);
				}
			});
			$($this).on("mouseover",".ui-child-box",function(){
				if(clearTime){
					clearTimeout(clearTime);
				}
			});
			$($this).on("mouseout",".ui-child-box",function(){
				clearTime = setTimeout(function(){
					$(".ui-child-box").remove();
					$(".J_condition[isHaveChild]").removeClass("hover");
					if(clearTime){
						clearTimeout(clearTime);
					}
		 		},3000);
			});
			function conditionClick(event,_this){
				var exclusive = $(_this).attr("data-exclusive");
				var _class = $(_this).attr("class");
				var dataValue = $(_this).attr("data-value");
				var pId = $(_this).attr("pId");
				var name = $(_this).text();
				var id = _this.id;
				if(exclusive == "true"){
					$(_this).parents("li ").find(".active").removeClass("active");
					$("#selectedCondition").find("."+_class).remove();	
				} 
				if(!$(_this).hasClass("active")){
					$(_this).addClass("active");
					var $selectedDOM = $('<li class="'+_class+'" id="selected_'+id+'" pId ="'+pId+'" data-value ="'+dataValue+'"><a href="javascript:void(0);">'+name+'</a></li>');
					var delSelectedDom = $('<a href="javascript:void(0);" class="del-selected-condittion"  id="del_'+id+'" data-value ="'+dataValue+'">×</a>').bind("click",function(){
						var id = this.id.replace("del_","");
						$("#"+id).removeClass("active");
						$(this).parent().remove();
					});
					$selectedDOM.append(delSelectedDom);
					$("#selectedCondition").append($selectedDOM);
				}
			}
			function conditionLoop(data,conditionDOM){
				var dataList = data.children ? data.children : [];
				for( var j = 0, length = dataList.length; j < length ; j++ ){
					var conditionChildren= dataList[j].children ? dataList[j].children : [];
					var item = $('<li  class="J_condition" data-value = "'+dataList[j].value+'" pId ="'+data.id+'" id="'+dataList[j].id+'"  data-exclusive="'+data.exclusive+'"></li>').bind("click",function(){
						conditionClick(event,this);
					});
					if(conditionChildren.length>0){
						item.attr("isHaveChild",true).data("nextCondition",conditionChildren);
					}
					item.append('<a href="javascript:void(0);" class="J_condition'+i+'" data-value = "'+dataList[j].value+'" data-exclusive="'+data.exclusive+'">'+dataList[j].name+'</a>').data("conditionChildren",conditionChildren);
					conditionDOM.find("> div > ul").append(item);
				}
			}
		} 
	  });
})($);