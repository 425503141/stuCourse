
/**
 * 弹框提示 alert
 *  确认提示框 confirm
 */
(function(){
	$.fn.extend({
		alert:function(option){
			  var defaults = {
				  title: "提示框",
				  dialogClass: "alert",
				  width:400,
				  height:200,
				  draggable: true,
				  modal: true,
				  position: { my: "center", at: "center", of: window },
				  resizable: false,
				  autoOpen: true,
				  content:"alert弹alert弹框alert弹框alert弹框框",
				  dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
				  callback:function(){},
				  buttons:[ 
						{
							"class":"ui-aiop-btn",
							type:"ok",
							text: "确定",
							click: function() { 
								option.callback(this);
								$( this ).dialog( "close" );
							} 
						}
					]
			  };
			option = $.extend(defaults,option);
			var $this = $(this);
			var $id= this.selector;
			var html = '<div id="'+$id.replace("#","")+'" class="alert-content clearfix"><span class="alert-icon alert-'+option.dialogType+'"></span><span class="alert-text alert-text-'+option.dialogType+'"><span class="alert-text-inner">'+option.content+'</span></span></div>';
			$($id).remove();
			$(html).appendTo("body").dialog(option);
		},
		//删除成功提示框 不要  确定按钮，点击其他地方弹窗提示消失
		deleteSuc:function(option){
			  var defaults = {
				  title: "提示框",
				  dialogClass: "alert",
				  width:400,
				  height:150,
				  draggable: true,
				  modal: true,
				  position: { my: "center", at: "center", of: window },
				  resizable: false,
				  autoOpen: true,
				  content:"alert弹alert弹框alert弹框alert弹框框",
				  dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
				  callback:function(){},
			  };
			option = $.extend(defaults,option);
			var $this = $(this);
			var $id= this.selector;
			var html = '<div id="'+$id.replace("#","")+'" class="alert-content clearfix"><span class="alert-icon alert-'+option.dialogType+'"></span><span class="alert-text alert-text-'+option.dialogType+'"><span class="alert-text-inner">'+option.content+'</span></span></div>';
			$($id).remove();
			$(html).appendTo("body").dialog(option);
			// $(document).bind('click',function(){ //点击其他地方消失
			// 	$($id).remove();
			// 	$(document).off('click');
			// }); 
			$($id).bind('click',function(e){ //阻止冒泡
				if(e.stopPropagation){
					e.stopPropagation();
				}else{
					e.cancelBubble = true;
				}
			}); 
		},
		confirm:function(option){
			  var defaults = {
				  title: "确认操作",
				  dialogClass: "alert",
				  width:400,
				  height:200,
				  draggable: true,
				  modal: true,
				  position: { my: "center", at: "center", of: window },
				  resizable: false,
				  autoOpen: true,
				  content:"alert弹alert弹框alert弹框alert弹框框",
				  dialogType:"warnning",//状态类型：warnning警告
				  gridObj:"",//重新加载得表格 解决每次关闭第一列checkbox选中问题
				  callback:function(){},
				  buttons:[{
						"class":"ui-aiop-cancel-btn mr10",
						type:"Cancel",
						text: "取消",
						click: function() { 
							$( this ).dialog( "close" );
							if(option.gridObj){
								$(option.gridObj).trigger("reloadGrid");
							}
						}
			  		},
					{
						"class":"ui-aiop-btn",
						type:"ok",
						text: "确定",
						click: function() { 
							option.callback(this);
							$( this ).dialog( "close" );
						} 
					}
				]
			  };
			option = $.extend(defaults,option);
			var $this = $(this);
			var $id= this.selector;
			var html = '<div id="'+$id.replace("#","")+'" class="alert-content clearfix"><span class="alert-icon alert-'+option.dialogType+'"></span><span class="alert-text alert-text-'+option.dialogType+'"><span class="alert-text-inner">'+option.content+'</span></span></div>';
			$($id).remove();
			$(html).appendTo("body").dialog(option);
		},
		aiDialog:function(option){
			 var defaults = {
					  title: "新增/修改",
					  width:400,
					  height:200,
					  draggable: true,
					  modal: true,
					  position: { my: "center", at: "center", of: window },
					  resizable: false,
					  autoOpen: true,
					  create: function( event, ui ) {
						  
					  },
					  gridObj:"",//重新加载得表格 解决每次关闭第一列checkbox选中问题
					  callback:function(){},
					  callbackExport:function(){},
					  buttons:[{
							"class":"ui-aiop-cancel-btn mr10",
							type:"Cancel",
							text: "取消",
							click: function() { 
								$( this ).dialog( "close" );
								if(option.gridObj){
									$(option.gridObj).trigger("reloadGrid");
								}
							}
				  		},
						{
							"class":"ui-aiop-btn",
							type:"ok",
							text: "确定",
							click: function() { 
								option.callback(this);
//								$( this ).dialog( "close" );
							} 
						}
					]
				  };
				option = $.extend(defaults,option);
				var $this = $(this);
				var id= this.id;
				if($this.find("form")[0]){
					$this.find("form")[0].reset();
				}
				$($this).dialog(option);
		}
	  });
})($);