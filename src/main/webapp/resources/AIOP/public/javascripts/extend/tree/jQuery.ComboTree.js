
/**
 * 弹框提示 alert
 *  确认提示框 confirm
 */
(function(){
	$.fn.extend({
		comboTree:function(option){
			var defaults={
				treeUrl:"",
				noneSelectedText:"请选择",
				ajaxType:"get",
				id:"treeList",
				ajaxData:{},
				showCheckBox:false,//是否显示复选框
				allChecekdValue:'全部',//全选时输入框的值
				expandRoot:false,//是否展开根节点
				expandRootId:'0'//根节点的id
			};
			var _self = $(this);
			option = $.extend(defaults,option);
			var html='<div class="has-feedback ui-tree-list">'
		                  + '<input type="text" class="form-control" id="'+option.id+'_value" placeholder="'+option.noneSelectedText+'" readonly="readonly">'
						  +'<span class="glyphicon form-control-feedback" aria-hidden="true"></span>'
						  +'</div><ul class="ztree none ui-ztree-dlg" id="'+option.id+'_tree" style="max-height:'+option.maxHeight+'px"></ul>';
			
			_self.html(html);
			_self.off("click","#"+option.id+"_value").on("click","#"+option.id+"_value",function(){
				if(!$("#"+option.id+"_tree").is(":hidden")){
					$("#"+option.id+"_tree").empty().hide();
					return;
				}else{
					$("#"+option.id+"_tree").removeClass('hidden');
				}
				$(".ui-ztree-dlg").empty().hide();
				var $this = $(this);
				var width = option.width ? option.width : $(this).parent().width()-15;
				$.fetch({
					url: option.treeUrl,
					   data: option.ajaxData,
					   dataType:"json",
					   type:option.ajaxType,
//					   headers:{
//						   "Content-Type": "application/json; charset=utf-8",
//					   },
					   success: function(result){
						  // 
						   $("#"+option.id+"_tree").width(width).show();
						   var ztreeObj = new Ztree();
							ztreeObj.init({
								id:option.id+"_tree",
								setting:{
									view: {
										selectedMulti:  false,
									},
									check: {
										enable: option.showCheckBox
									},
									data: {
				    		    				simpleData: {
				    		    					enable: true,
				    		    					idKey: "id",
				    		    					pIdKey: "pid",
				    		    					rootPId: 0
				    		    				}
				    		    			},
									callback: {
										onClick:function(event, treeId, treeNode) {
										    //TODO
											if(!option.showCheckBox){
									
												$this.attr({"node-id":treeNode.id}).val(treeNode.name);
												 $("#"+option.id+"_tree").hide();
											}
											if(option.showCheckBox){ //如果是复选框
												/* var treeObj=$.fn.zTree.getZTreeObj(option.id+"_tree");
												 treeObj.checkNode(treeNode, !treeNode.checked, true); */
												var obj = treeNode.tId;
												$('#'+obj+'_check').trigger('click')
											}
										},
										onCheck:function(event, treeId, treeNode) {
											var treeObj = $.fn.zTree.getZTreeObj(option.id+"_tree");
											var nodes = treeObj.getCheckedNodes(true);
											var moduleNames = [];
											var checkedIds = [];
									        for(var i=0;i<nodes.length;i++){
									            if(nodes[i].isParent!=true){
									            	moduleNames.push(nodes[i].name);
									            	checkedIds.push(nodes[i].id);
									            }
									        }
									        var allNodes = treeObj.transformToArray(treeObj.getNodes());
									        moduleNames = allNodes.length == nodes.length ? option.allChecekdValue :moduleNames.join(',')
									        checkedIds = checkedIds.length==0 ? '' : checkedIds.join(',');
											$this.attr({"node-ids":checkedIds});
									        $this.val(moduleNames).attr({"node-ids":checkedIds,'title':moduleNames});
										/*	var treeObj=$.fn.zTree.getZTreeObj(option.id+"_tree");
											nodes=treeObj.getCheckedNodes(true);
											var ids = [];
											var names = [];
											var childIds = "";
											for(var i=0;i<nodes.length;i++){ 
												if(nodes[i].isParent){//本身是父节点,并且是全选的父节点 则不管子节点
													if(nodes[i].getCheckStatus().half){//半选父节点
														console.log('是半选父节点。 不存储')
														console.log(nodes[i].name)
													}else{//全选节点(本身是父节点) 查看他的父节点是不是全选 
														var parent = nodes[i].getParentNode();
														if(parent==null){//本身父节点为空 表示是全选根节点 应该存储 
															console.log('是全选父节点。 父节点为空，表示是全选根节点 应该存储')
															console.log(nodes[i].name)
															ids.push(nodes[i].id);
															names.push(nodes[i].name);
														}else{//判断父节点不为空
															if(!parent.getCheckStatus().half){
																console.log("------"+nodes[i].name+"是全选父节点。 父节点是"+parent.name+", 父节点不是半选 不存储 本节点<br>");
															}else{
																console.log("------<span style='color:red;'>"+nodes[i].name+"</span>是全选父节点。 父节点是"+parent.name+", 父节点半选 存储 本节点（自己是全选父节点）<br>");
																ids.push(nodes[i].id);
																names.push(nodes[i].name);
																var childs = nodes[i].children;
																if(childs){//获得所有子节点
																	for(var j=0;j<childs.length;j++){
																		childIds += " id="+childs[j].id+" name="+childs[j].name;
																	}
																}
															}
														}
													}
												}else{//本身是叶子节点 父节点选中，则不存 父节点半选或者不选 则存下来
													var parent = nodes[i].getParentNode();
													if(parent==null){//全选叶子节点 父节点为空 即只有一个根节点 保存
														console.log("--<span style='color:red;'>"+nodes[i].name+"</span>是全选叶子节点。 父节点为空，即只有一个根节点 保存 <br>");
														ids.push(nodes[i].id);
														names.push(nodes[i].name);
													}else{//全选叶子节点 有父节点
															if(parent.getCheckStatus().half){//父节点半选 存储
																console.log("----<span style='color:red;'>"+nodes[i].name+"</span>是全选叶子节点。 父节点是"+parent.name+"父节点半选 存储本节点 <br>");
																ids.push(nodes[i].id);
																names.push(nodes[i].name);
															}else{//父节点全选 不存储
																console.log("----"+nodes[i].name+"是全选叶子节点。 父节点是"+parent.name+"父节点全选 不存储 <br>");
															}
														}
													}
												}
												console.log(ids)
												console.log(names)
												var inputVal = names.length==0 ? option.allChecekdValue : names.join(',');
												var checkedIds = ids.length==0 ? '' : ids.join(',');
												$this.attr({"node-ids":checkedIds}).val(inputVal);*/ 
										},
									}
								},
								treeData:result.nodes,
								expandAll:false
							});
							if(option.expandRoot){//option.expandRoot为true时 展开一级节点
								var treeObj = $.fn.zTree.getZTreeObj(option.id+"_tree");
								var nodes = treeObj.getNodesByParam("id", option.expandRootId, null);
								treeObj.expandNode(nodes[0], true, false, true);
							}
					   }
				});
			});
		}
	  });
})($);
		
