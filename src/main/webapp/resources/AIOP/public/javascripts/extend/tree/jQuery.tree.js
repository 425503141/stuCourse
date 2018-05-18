
/**
 * ztree 封装
 */
	function Ztree(){
		this.instance;	//ztree对象
		this.setting;	//设置信息
		this.treeData;	//初始化时加载的数据
		
		this.init = function(option){
			var defaults = {
					id:"",
					setting:{
						view: {
							selectedMulti: false
						}
					},
					treeData:[],
					expandAll:false,
					expandRoot:false,//是否展开根节点
					expandRootId:'0'//根节点的id
					
			};
			option = $.extend(defaults,option);
			this.setting = setting =  option.setting;
			var id = option.id ,treeData = option.treeData,expandAll= option.expandAll;
			this.treeData = treeData;
			this.instance = $.fn.zTree.init($("#" + id), setting,treeData);
			
			
			if (expandAll) {
				this.instance.expandAll(expandAll);
			} else {
				this.instance.expandAll(false);
			}
			if(option.expandRoot){//option.expandRoot为true时 展开一级节点
				var node = this.getNodeById(option.expandRootId);
				this.instance.expandNode(node, true, false, true);
			}
			
		};
		
		this.getInstance = function(){
			return this.instance;
		}
		
		//选中id列表所指定的节点
		this.setCheckedNodesById = function(checkedIds){
			var instance = this.instance;
			for(var i=0; i<checkedIds.length; i++){
				var id = checkedIds[i];
				var node = instance.getNodeByParam('id',id,null);
				if(node){
					node.checked = true;
					instance.updateNode(node);				
				}				
			}
		},
		//获得选中节点id组成的数据
		this.getSelectedIdArray = function(){
			var nodes = this.instance.getCheckedNodes(true);
			var array = [];
			if(nodes != null && nodes.length > 0){
				for(var i=0; i<nodes.length; i++){
					array.push(nodes[i]['id']);
				}
			}
			if(array.length == 0){
				return "";
			}
			return array;
		}
		//获得全部节点数据
		this.getAllNodes = function(){
			var nodes = this.instance.transformToArray(this.instance.getNodes());
			return nodes;
		}
		//根据TID获得 数据
		this.getNodeByTId = function(tId){
			var node = this.instance.getNodeByTId(tId);
			return node;
		}
		//根据ID获得 数据
		this.getNodeById= function(id){
			return this.instance.getNodeByParam("id", id,null);
		}
		//获取编辑tree改变节点
		this.getChangeNodes = function(){
			var oldTreeNodes = this.treeData;
			var currentNodes = this.instance.transformToArray(this.instance.getNodes());
			var newNodes = $.grep( currentNodes, function(n,i){
				for(var j =0,len= oldTreeNodes.length;j<len;j++){
					if(oldTreeNodes[j].id == n.id){
						return n;
					}
				}
			}, true);
			return newNodes;
		}
//		this.addNodes = function(parentNode,newNodes){
//			this.instance.treeObj.addNodes(parentNode,newNodes);
//		}
	}
