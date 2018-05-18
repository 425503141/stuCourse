var intsExportManage = (function(model){
	var token = model.token = window.sessionStorage && window.sessionStorage.getItem('token');
	model.ztreeObj = new Ztree();

	var filterDefault = function(id,value){
		var res = $(id).val();
		return res === value ? '' : res;
	}
	//用于渲染下拉列表
	var urls = [{url:'useClassifys',statusCode:'useClassifyId',statusName:'useClassifyName'},
				{url:'sysExportCycles',statusCode:'cycleType',statusName:'cycleName'},
				{url:'sysExportSources',statusCode:'sourceId',statusName:'sourceName'},
				{url:'sysInterfaceTypes',statusCode:'interfaceType',statusName:'typeName'},
				{url:'sysPushDelimiters',statusCode:'delimiterCode',statusName:'delimiterName'},
				{url:'sysPushFileModes',statusCode:'modeCode',statusName:'modeName'},
				{url:'sysPushFileTypes',statusCode:'fileTypeCode',statusName:'fileTypeName'},
				{url:'sysRequireLevels',statusCode:'requireLevel',statusName:'requireLevelName'},
				{url:'sysUsers',statusCode:'userId',statusName:'userName'},
				{url:'pushOrderids',statusCode:'orderidCode',statusName:'orderidName'},
				{url:'sysConfigAuditor',statusCode:'userId',statusName:'userName'},
				{url:'sysPushExportTags',statusCode:'tagCode',statusName:'tagName'}];
	//用于缓存新建修改页面下拉列表
	model.dropDwonList = {}
	/*
	 *生成全部分类树
	 *@param nodeName 节点名称，用于搜索
	 */
	model.loadIntsExportManageTree = function(){
		$.AIGet({
			url:$.ctx + "/api/sys/tdInterfaceUseClassify/list",
			datatype:"json",
			data:{'token':token},
			success:function(result){
			 	intsExportManage.ztreeObj.init({
		    		id:"appType",
		    		expandRoot:true,//是否展开根节点
					expandRootId:'0000',//根节点的id
		    		setting:{
		    			view: {
		    				selectedMulti: false,
		    				addHoverDom:model.addHoverDom,
		    				removeHoverDom:model.removeHoverDom
		    			},
		    			edit: {
	    					enable: true,
	    					showRenameBtn:true,
	    					setRemoveBtn:true,
	    					editNameSelectAll: true,  
	    					renameTitle: "编辑",
	    					removeTitle: "删除",
	    				},
		    			callback: {
		    				beforeDrag:function(treeId, treeNodes){return false;},//禁止拖拽
		    				beforeRename: model.zTreeBeforeRename,
	    					beforeRemove:model.beforeRemove,
		    				onClick: function(event, treeId, treeNode){
		    					intsExportManage.refreshGrid();
		    				}
		    			},
		    			data: {
		    				simpleData: {
		    					enable: true,
		    					idKey: "id",
		    					pIdKey: "pid",
		    					rootPId: 0
		    				}
		    			}
		    		},
		    		treeData:result.nodes,
		    		expandAll:false
		    	});

			}
    	});
	}

	/**
     * @description 重命名树节点
    */
    model.zTreeBeforeRename = function(treeId, treeNode, newName, isCancel) {
    	//如果 beforeRename 返回 false，则继续保持编辑名称状态，直到名称符合规则位置 （按下 ESC 键可取消编辑名称状态，恢复原名称）如果未设置 beforeRename 或 beforeRename 返回 true，则结束节点编辑名称状态，更新节点名称，并触发 setting.callback.onRename 回调函数。
    	var zTree = model.ztreeObj.instance;
    	if (newName.length == 0) {
    		 $("#intsExportManageDeleteDlg").alert({
    			   title:"提示",
    			   content:'节点名称不能为空',
    			   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
    		   });
    		//setTimeout(function(){zTree.editName(treeNode)}, 10);
    		return false;
    	}
        var nodes = zTree.getNodes();
    	var nodesSave = zTree.transformToArray(zTree.getNodes());//获取已存在的所有节点信息
    	var allNames = [];
    	for(var i in nodesSave){
    		allNames.push(nodesSave[i].name);//获取已存在的所有节点的name属性
    	}
    	//console.log(treeNode.name!=newName)
    	if(treeNode.name!=newName && jQuery.inArray(newName, allNames) > -1){//该应用分类名称已存在
    		 $("#intsExportManageDeleteDlg").alert({
    			   title:"提示",
    			   content:'该节点名称已存在',
    			   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
    		   });
    		return false;
    	}
    	if(treeNode.name!=newName && jQuery.inArray(newName, allNames) <= -1){
    		var useClassifys = {
    			useClassifyName:newName,
    			useClassifyId:treeNode.id,
    			parentClassifyId:treeNode.pid
    		}
    		$.AIPut({
    			url: $.ctx + '/api/sys/tdInterfaceUseClassify/updateUseClassify',
    			data: {
    				'token':token,
    				useClassifyName:newName,
	    			useClassifyId:treeNode.id,
	    			parentClassifyId:treeNode.pid
    			},
    			success: function(data){
    				   if(data.status == 200){
    					   //alert('修改节点成功成功');
    				   }
    			},
    		});
    	}
    	zTree.updateNode(treeNode);
    	return true;
    }

    /**
     * @description 删除树节点
    */
    //如果未设置 beforeRemove 或 beforeRemove 返回 true，则删除节点并触发 setting.callback.onRemove 回调函数。
     model.beforeRemove = function(treeId, treeNode) {
    	var zTree = model.ztreeObj.instance;
    	zTree.selectNode(treeNode);
    	if(treeNode.isCanDel==true && treeNode.id!=0){//可删除
    		$.AIDel({
    			   url: $.ctx+'/api/sys/tdInterfaceUseClassify/deleteUseClassify',
    			   data: {'X-Authorization':token,useClassifyId:treeNode.id},
    			   async:true,
    			   dataType:"json",
    			   type:"DELETE",
    			   success: function(data){
    				   if(data.status == 201){
    					   $("#intsExportManageDeleteDlg").alert({
    						   title:"提示",
    						   content:data.message,
    						   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
    					   });
    				   }
    			   }
    		});
    	}
    	if(treeNode.id==0){//全部分类不可删除
    		 $("#intsExportManageDeleteDlg").alert({
    			   title:"提示",
    			   content:'全部分类不可删除',
    			   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
    		  });
    		 return false;
    	}else{
    		if(treeNode.isCanDel==false){//不可删除
	    		 $("#intsExportManageDeleteDlg").alert({
	    			   title:"提示",
	    			   content:'有属于当前节点的接口，不允许删除当前节点',
	    			   dialogType:"failed"
	    		  });
	    		 return false;
	    	}
    	}
    }

    /**
     * @description 添加名树节点
    */
    model.newCount = 1;
    model.addHoverDom = function(treeId, treeNode) {
    	var sObj = $("#" + treeNode.tId + "_span");
    	if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
    	if(treeNode.level=='1'){//如果是三级节点隐藏加号
    		var addStr = '';
    	}else{
    		var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
    		+ "' title='add node' onfocus='this.blur();'></span>";
    	}
    	sObj.after(addStr);
    	var btn = $("#addBtn_"+treeNode.tId);
    	if (btn) btn.bind("click", function(){
    		var zTree = model.ztreeObj.instance;
    		zTree.addNodes(treeNode, {id:('100' + model.newCount), pId:treeNode.id, name:"new node" + (model.newCount++)});
    		
    		zTree.updateNode(treeNode);
    		return false;
    	});
    };
    model.removeHoverDom = function(treeId, treeNode) {
    	$("#addBtn_"+treeNode.tId).unbind().remove();
    };

    /*
	 *日期控件
     */
    model.loaddatepicker = function(option,fmt){
    		var defaults={
    			from:"",
    			to:""
    		};
    		option = $.extend(defaults,option);
    		var dateFormat = fmt || "yy-mm-dd",
        from = $( option.from )
        .datepicker({
        	//defaultDate: "+1w",
        	changeMonth: true,
        	numberOfMonths:1,
        	dateFormat: dateFormat,
    		beforeShow :function(){
    			$.datepicker.dpDiv.removeClass("ui-hide-calendar");
    		}
        })
        .on( "change", function() {
        	to.datepicker( "option", "minDate", getDate( this ) );
        }),
        to = $( option.to ).datepicker({
        	//defaultDate: "+1w",
        	changeMonth: true,
        	numberOfMonths:1,
        	dateFormat: dateFormat,
    		beforeShow :function(){
    			$.datepicker.dpDiv.removeClass("ui-hide-calendar");
    		}
        })
        .on( "change", function() {
        	from.datepicker( "option", "maxDate", getDate( this ) );
        });
    		$.datepicker.dpDiv.addClass("ui-datepicker-box");
        function getDate( element ) {
        	var date;
        	try {
        		date = $.datepicker.parseDate( dateFormat, element.value );
        	} catch( error ) {
        		date = null;
        	}
        	return date;
        }
    };

    /**
	* @description 加载周期&重要程度下拉列表-搜索条件
	*/
	model.loadRunSelectList = function(obj,data,pref) {
		var str = pref ? '<option value="pref">' + pref + '</option>' : '';
		for(var i in data){
		 str+='<option value="'+i+'">'+data[i]+'</option>'
		}
		$(obj).html(str);
	};

	/*
	 *格式化下拉列表所需options
	 *@param arr 需要做格式化的数组
	 */
	var formatIntsStatus = function(arr,statusCode,statusName){
		var res = {},
			items = arr.concat();
			// prefObj = {};
		// setPref && items.unshift(prefObj);
		items.forEach(function(item){
			res[item[statusCode]] = item[statusName];
		});
		return res;
	}

	/*
	 *渲染审核状态下拉框
	 */
	model.renderIntsStatus = function(){
		var self = this;
		$.AIGet({
			url:$.ctx + '/api/sys/tdNpExportFtpTemp/exportStatuss',
			datatype:'json',
			postData:{'token':token},
			success:function(response){
				var intsStatus = formatIntsStatus(response.data,'statusCode','statusName');
				self.loadRunSelectList('#intsStatus',intsStatus,'审核状态');
				$('#intsStatus').multiselect({
					nonSelectedText:"接口状态",
					buttonWidth:134,
					nSelectedText:"个选择",
					includeSelectAllOption:true,
					selectAllText: '全部',
					keepOrder:true
				});
			}
		})
	}

	/*
	 *渲染表格
	 */
	model.renderGrid = function(){
		$('#gridIntsExportManage').AIGrid({
			url:$.ctx + '/api/sys/tdNpExportFtpTemp/List',
			dataType:'json',
		   	colNames:["用途分类",'接口编码','接口名称', '接口类型', '推送周期','数据接收方','生效日期','失效日期','接口状态','更新时间','操作'],
		   	colModel:[
                {name:'useClassifyName',index:"use_classify_name",width:60,align:'center'},
		   		{name:'exportId',index:'export_id', width:60,align:'center'},
		   		{name:'exportName',index:'export_name', width:60,align:"center"},
		   		{name:'typeName',index:'type_name', width:60,align:"center"},
		   		{name:'cycleName',index:'cycle_name', width:60, align:"center"},
		   		{name:'sourceName',index:'source_name', width:60, align:"center"},
		   		{name:'startDate',index:'start_date', width:90,formatter:DateFmt.dataDateFormate,align:"center"},
		   		{name:'endDate',index:'end_date', width:90,formatter:DateFmt.dataDateFormate,align:"center"},
		   		{name:'statusName',index:'status_name', width:60,align:"center"},
		   		{name:'updateTime',index:'update_time', width:100,formatter:DateFmt.dateFormatter,align:"center"},
		   		{name:'op',index:'op', width:150, sortable:false,title:false,formatter:del,align:"center"}
		   	],
		   	rowNum:10,
		   	rowList:[10,20,30],
		   	pager: '#pagerIntsExportManage',
		   	sortname: '',
		   	rownumbers: false,
		    viewrecords: true,
		    sortorder: "desc",
			jsonReader: {
				repeatitems : false,
				id: "0"
			},
			height: '100%'
		});
		//操作
		function del(cellvalue, options, rowObject){
			console.log(rowObject);
			var html='<button type="button" class="btn btn-default ui-table-btn" data-exportId="'+rowObject.exportId+'" data-name="'+rowObject.statusName+'" style="margin:0" onclick="intsExportManage.auditInt(this);" title="审核">审核</button>'+
					'<button type="button" class="btn btn-default ui-table-btn" data-exportId="'+rowObject.exportId+'" data-name="'+rowObject.statusName+'" style="margin:0" onclick="intsExportManage.deletInt(this);" title="删除">删除</button>'+
					'<button type="button" class="btn btn-default ui-table-btn" data-exportId="'+rowObject.exportId+'" data-name="'+rowObject.statusName+'" style="margin:0" onclick="intsExportManage.updateInt(this,\'1\')" title="修改">修改</button>';
			return html;
		}
	}

	/*
	 *刷新表格
	 */
	model.refreshGrid = function(){
		var treeObj=$.fn.zTree.getZTreeObj("appType"),
			nodeId = treeObj&&treeObj.getSelectedNodes()[0] ? treeObj.getSelectedNodes()[0].id : "",
			option = {
				searchText:$('#searchTxt').val(),
				ifVaild:filterDefault('#isEffect','pref'),
				statusCode:filterDefault('#intsStatus','pref'),
				useClassifyId:nodeId
			};
		$('#gridIntsExportManage').jqGrid('setGridParam',{
			postData:option
		}).trigger('reloadGrid');
	}

	/*
	 *删除单个
	 */
	model.deletInt = function(target){
		var urls = {
				'未通过审核':'/api/sys/tdNpExportFtpTemp/deleteMysql',
				'配置中':'/api/sys/tdNpExportFtpTemp/deleteMysql',
				'已审核':'/api/sys/tdNpExportFtpTemp/deleteGbase'
			},
			type = $(target).attr('data-name');
		if(type === '待审核'){
			$('#intsExportManageDeleteDlg').alert({
				title:'提示',
				content:'待审核内容无法删除',
				dialogType:'failed'
			});
			return;
		}
		var	url = urls[type],
			id = $(target).attr('data-exportId');
		intsExportManage.delete(url,{exportId:id},'确定删除已选中内容？');
	}

	var confirmOperation = function(option){
		if(!option || !option.callback || typeof option.callback !== 'function')return;
		$('#intsExportManageDeleteDlg').confirm({
			height:'auto',
			title:'提示',
			content:option.msg || '是否确认进行该操作',
			gridObj:option.gridObj || '',
			callback:option.callback
		});
	}

	/*
	 *删除操作
	 */
	model.delete = function(url,option,msg){
		/*
		 *删除成功后操作
		 */
		deleteSuccess = function(res){
			if(res === '200'){
				$('#intsExportManageDeleteDlg').dialog('close');
				$('#intsExportManageDeleteDlg').deleteSuc({
					title:'提示',
					content:'删除成功',
					dialogType:'success'
				});
			}
			// location.reload();
			intsExportManage.loadIntsExportManageTree();
			intsExportManage.refreshGrid();
			// $('#intsStatus').html('');
			// $('#intsStatus').next().remove();
			// intsExportManage.renderIntsStatus();
			// intsExportManage.renderIntsStatus();
			// $('#isEffect').multiselect({
			// 	nonSelectedText:"是否有效",
			// 	buttonWidth:134,
			// 	nSelectedText:"个选择",
			// 	includeSelectAllOption:true,
			// 	selectAllText: '全部',
			// });
		}
		var callbackFn = function(){
			$.AIDel({
				url:$.ctx + url,
				data: option,
				async:true,
				dataType:"json",
				type:"DELETE",
				success:function(res){
					deleteSuccess(res.status);
				},
				error:function(){
					$('#intsExportManageDeleteDlg').alert({
						title:'提示',
						content:'删除失败',
						dialogType:'failed'
					});
				}
			});
		}
		var confirmOption = {
			msg:msg,
			gridObj:'#gridIntsExportManage',
			callback:callbackFn
		}
		confirmOperation(confirmOption);
	}

	/*
	 *批量删除
	 */
	model.deleteBatch = function(){
		var rows = $('#gridIntsExportManage').jqGrid('getSelectedJsonArray'),
			intTypes = {
				'未通过审核':'/api/sys/tdNpExportFtpTemp/deleteMysqlList',
				'配置中':'/api/sys/tdNpExportFtpTemp/deleteMysqlList',
				'已审核':'/api/sys/tdNpExportFtpTemp/deleteList'
			}
			trueRows = rows.filter(function(item){
				return item.statusName !== '待审核';
			});
			if(!trueRows || trueRows.length <= 0) return;
			var url = intTypes[trueRows[0].statusName];
			ids = trueRows.map(function(item){
				return item.exportId;
			}),
			msg = '确定删除已选中内容？',
			option = {exportIds:ids.join(',')};
		intsExportManage.delete(url,option,msg);
	}

	//渲染带默认字段的下拉框
	var renderDefaultList = function(width){
		var defaultList = ['#exportMission','#isSMSMonitor','#exportTableNameFormat','#e-statType','#codeType'];
		$(defaultList.toString()).multiselect({
			nonSelectedText:'请选择',
			buttonWidth:width,
			nSelectedText:'个选择',
			includeSelectAllOption:true,
			selectAllText:'全部',
			maxHeight:200
		});
	}

	/*
	 *计划推送时间初始化
	 */
	var initExportCycles = function(){
		var value = arguments[0].val ? arguments[0].val() : arguments[0],
			maps = $.intsExportPlanStartTimeMap;
		for(var i in maps){
			var ele = document.querySelector('.' + maps[i]),
				classList = ele.classList;
			if(i === value + ''){
				classList.contains('hidden') && classList.remove('hidden');
			}else{
				!classList.contains('hidden') && classList.add('hidden');
			}
		}
	}
	
	//渲染后台接收的字段的下拉框
	var initDropDownLists = function(urls,width){
		var dfd = new $.Deferred(),
			leafDfd = {length:0};
		/*
		 *渲染下拉框
		 */
		var renderDropDown = function(id,options,width){
			intsExportManage.loadRunSelectList(id,options,'请选择');
			//初始化下拉框的值
			var initVal = function(id){
				$(id).val('').multiselect('refresh');
				$("#isSMSMonitor").val('').multiselect('refresh');
				$("#exportTableNameFormat").val('').multiselect('refresh');
			}
			var option = {
				nonSelectedText:'请选择',
				buttonWidth:width,
				nSelectedText:'个选择',
				includeSelectAllOption:true,
				selectAllText:'全部',
				maxHeight:200
			}
			//联动
			var callBack = {
				'#e-sysPushFileModes':function(option,checked){
					var maps = {
						'0':'1',
						'1':'0',
						'2':'0'
					}
					var value = option.val();
					$('#exportMission').val(maps[value]).multiselect('refresh');
				},
				'#e-sysExportCycles':initExportCycles
			}
			callBack[id] && (option.onChange = callBack[id]); 
			$(id).multiselect(option);
			initVal(id);
		}
		//判断是否所有的下拉列表都已经渲染
		var judgeAllResolve = function(leafDfd,urls){
			if(!leafDfd || leafDfd.length !== urls.length) return false;
			var res = true;
			for(var i in leafDfd){
				if(!leafDfd[i]) return res = false;
			}
			return res;
		}
		urls.forEach(function(item,index){
			if(intsExportManage.dropDwonList[item.url]){
				renderDropDown('#e-' + item.url,intsExportManage.dropDwonList[item.url],width);
				dfd.resolve();
			}else{
				leafDfd[index] = false;
				$.AIGet({
					url:$.ctx + (item.trueUrl || ('/api/sys/tdNpExportFtpTemp/' + item.url)),
					datatype:'json',
					token:token,
					success:function(response){
						var options = formatIntsStatus(response.data || response.nodes,item.statusCode,item.statusName);
						intsExportManage.dropDwonList[item.url] = options;
						renderDropDown('#e-' + item.url,options,width);
						leafDfd[index] = true;
						leafDfd.length++;
						judgeAllResolve(leafDfd,urls) && dfd.resolve();
					}
				});
			}
		});
		return dfd;
	}

	/*
	 *是否展示维护输入表单
	 */
	var isShowUpData = function(flag){
		var ele = document.querySelector('#containerUpdataIntsExportManage'),
			classList = ele.classList;
		if(flag){
			classList.contains('hidden') && ele.classList.remove('hidden');
		}else{
			!classList.contains('hidden') && ele.classList.add('hidden');
		}
	}

	/*
	 *获取内容节点
	 *@param pNode 父节点
	 */
	var getTextNode = function(pNode){
		return pNode.find('select') && pNode.find('select').length >= 1 ? pNode.find('select') : pNode.find('input');
	}
	//获取表单下所有内容
	var getAllNodes = function(id){
		var node = $(id).find('.control-label'),
			textNodes = [];
		Array.prototype.forEach.call(node,function(item){
			var contentNode = getTextNode($(item).next());
			textNodes.push(contentNode);
		});
		return textNodes;
	}
	//设置无法选择
	var setDisabled = function(flag){
		var disabledList = ['exportTableName','exportDelimiter','exportFileName','fileType','exportFileFtpUserPasswd','exportTag','startDate','endDate','offlineDate'],
			insertNodes = getAllNodes('#formSaveIntsExportManage'),
			updataNodes = getAllNodes('.formUpdataIntsExportManage'),
			textNodes = insertNodes.concat(updataNodes),
			inputToggle = function(flag,jqDom){
				flag ? jqDom.attr('disabled','disabled') : jqDom.removeAttr('disabled');
			},
			selectToggle = function(flag,jqDom){
				flag ? jqDom.multiselect('disable') : jqDom.multiselect('enable');
			};
		textNodes.forEach(function(item){
			var name = item.attr('name'),
				disabledNames = ['exportId','exportWorkType'];
			if(disabledList.indexOf(name) === -1 && disabledNames.indexOf(name) === -1 && item.attr('id') !== 'intsExportPlanStartTime_T'){
				item[0].nodeName === 'SELECT' ? selectToggle(flag,item) : inputToggle(flag,item);
			}
		});
	}
	
	/*
	 *空校验提示
	 *@param name 空字段名
	 */
	var showWarn = function(name){
		if(name === '接口编码') return true;
		$('#intsExportManageDeleteDlg').alert({
			title:'提示',
			content:name + '不能为空',
			dialogType:'failed'
		});
		return false;
	}

	//获取计划推送时间，由于存在三个控件，只需其中一个的值
	var getExecTime = function(){
		var value = $('#e-sysExportCycles').val(),
			map = $.intsExportPlanStartTimeMap;
		return $('.' + map[value]).find('input').val();
	}
	
	/*
	 *表单空校验
	 *@param form 表单D
	 */
	var checkParam = function(form){
		if(!form || $(form).length<=0) return false;
		var necessaryParam = $(form).find('.ui-red-star');
		if(!necessaryParam || necessaryParam.length<=0) return true;
		var name = '',
			node = '',
			flag = '';
		for(var i = 0,length = necessaryParam.length;i<length;i++){
			var item = necessaryParam[i];
			node = $(item).parent();
			name = node.text().slice(0,-2);
			var text = getTextNode(node.next()).val();
			var value = $('#e-sysExportCycles').val(),
			map = $.intsExportPlanStartTimeMap;
			if(name == '计划推送时间'){
				if($('.' + map[value]).find('input').attr('id') === 'intsExportPlanStartTime_T') continue;
				console.log($('.' + map[value]).find('input').attr('id'));
				if($('.' + map[value]).find('input').attr('id') === 'intsExportPlanStartTime_D' || $('.' + map[value]).find('input').attr('id') === 'intsExportPlanStartTime'){
					text = getExecTime();
				}
			}
			
			flag = (!!text && text !== 'pref') || showWarn(name);
			if(!flag) break;
		}
		return flag;
	}

	/*
	 *添加
	 */
	model.addInt = function(){
		var width;

		$('#intsExportManageAddDlg').aiDialog({
			width:940,
			height:600,
			title:'新增/修改推送接口',
			gridObj:'#gridIntsExportManage',
			callback:function(){
				var option = formFmt.formToObj($('#formSaveIntsExportManage'));
				if(!checkParam('#formSaveIntsExportManage')) return;
				$.AIPost({
					url:$.ctx + '/api/sys/tdNpExportFtpTemp/insert',
					dataType:'json',
					token:token,
					data:option,
					success:function(response){
						if(parseInt(response.status) === 200){
							$('#intsExportManageAddDlg').dialog('close');
							$('#intsExportManageDeleteDlg').alert({
								title:'提示',
								content:'添加成功',
								dialogType:'success'
							});
							intsExportManage.refreshGrid();
						}else{
							$('#intsExportManageDeleteDlg').alert({
								title:'提示',
								content:response.message,
								dialogType:'failed'
							});
						}
					}
				});
			},
			open:function(){
				width = $('#e-interfaceCode').parent().width();
				isShowUpData(false);
				renderDefaultList(width);
				initDropDownLists(urls,width).then(setDisabled.bind(this,false));
			}
		});
	}

	/*
	 *修改
	 */
	model.updateInt = function(dom){
		var type = $(dom).attr('data-name');
		
		if(type === '待审核'){
			$('#intsExportManageDeleteDlg').alert({
				title:'提示',
				content:'待审核内容无法修改',
				dialogType:'failed'
			});
			return;
		}
		var GMmap = {
			'已审核':'Gbase',
			'未通过审核':'Mysql',
			'配置中':'Mysql'
		}
		//转换字段
		var interfaceNameMap = $.interfaceNameMap;
		var converse = function(type,name){
			var trueType = GMmap[type];
			return interfaceNameMap[name][trueType];
		}
		var setContent = function(nodes,data){
			if(!data || data.length <= 0) return;
			var dateNode = ['intsExportStartTime','intsExportEndTime','intsExportOutlineTime',
							'intsExportPlanStartTime','intsExportMissionStartTime','intsExportMissionEndTime',
							'intsExportPlanStartTime_D'];
			nodes.forEach(function(item){
				if(dateNode.indexOf(item.attr('id')) !== -1){
					// console.log(data[item.attr('name')] + ' ' + item.attr('name'));
					if(item.attr('name')!="execTime"){
						item.datepicker( 'setDate' , data[item.attr('name')] ? new Date(data[item.attr('name')]) : new Date());
					}else if(item.attr('name')=="execTime"&& data.execTime!=""&&data.execTime!=null){
						if(data.cycleName=="M"){
							$(item).val(data[item.attr('name')]);
							$("#e-sysExportCycles").change(function(event){
								event.preventDefault();
								if($(this).val()=="1"){
									$("#loadDelays option[value='1']").attr("selected","selected");
									var time=data[item.attr('name')].substring(4);
									$(item).val(time);
								}else if($(this).val()=="3"){
									$("#intsExportPlanStartTime_T").val("");
								}else if($(this).val()=="2"){
									$(item).val(data[item.attr('name')]);
								}
							})
						}else if(data.cycleName=="D"){
							$(item).val(data[item.attr('name')]);
							$("#e-sysExportCycles").change(function(event){
								event.preventDefault();
								if($(this).val()=="2"){
									$("#loadDelays option[value='2']").attr("selected","selected");
									var day=DateFmt.Formate((new Date()),"dd");
									console.log(day)
									var time=day+"日 "+data[item.attr('name')];
									$(item).val(time);
								}else if($(this).val()=="3"){
									console.log($(item))
									$("#intsExportPlanStartTime_T").val("");
								}else if($(this).val()=="1"){
									$(item).val(data[item.attr('name')]);
								}
							})
						}else if(data.cycleName=="T"){
							$("#intsExportPlanStartTime_T").val("");
							$("#e-sysExportCycles").change(function(event){
								event.preventDefault();
								if($(this).val()=="2"){
									$("#loadDelays option[value='2']").attr("selected","selected");
									var day=DateFmt.Formate((new Date()),"dd");
									var hour=DateFmt.Formate((new Date()),"HH:mm");
									var time=day+"日 "+hour+data[item.attr('name')];
									$(item).val(time);
								}else if($(this).val()=="3"){
									$("#intsExportPlanStartTime_T").val("");
									
								}else if($(this).val()=="1"){
									$("#loadDelays option[value='1']").attr("selected","selected");
									var time=DateFmt.Formate((new Date()),"HH:mm");
									$(item).val(time);
								}
							})
						}
					}else if(item.attr('name')=="execTime"&&data.execTime==null){
						var day=DateFmt.Formate((new Date()),"dd");
						var hour=DateFmt.Formate((new Date()),"HH:mm");
						if(data.cycleName=="T"){
							$("#intsExportPlanStartTime_T").val("");
						}else if(data.cycleName=="M"){
							var time=day+"日 "+hour;
							$(item).val(time);
						}else{
							$(item).val(hour);
						}
						$("#e-sysExportCycles").change(function(event){
							event.preventDefault();
							if($(this).val()=="2"){
								$("#loadDelays option[value='2']").attr("selected","selected");
								var time=day+"日 "+hour;
								$(item).val(time);
							}else if($(this).val()=="3"){
								$("#intsExportPlanStartTime_T").val("");
								
							}else if($(this).val()=="1"){
								$("#loadDelays option[value='1']").attr("selected","selected");
								$(item).val(hour);
							}
						})
					}
					
				}else{
					var name = interfaceNameMap[item.attr('name')] ? converse(type,item.attr('name')) : '';
					item.attr('name') === 'execCycle' && initExportCycles(data[(name || item.attr('name'))]);
					item[0].nodeName === 'SELECT' ? item.val(data[(name || item.attr('name'))]).multiselect('refresh') : item.val(data[(name || item.attr('name'))]);
				}
			})
			
		}
		//回显
		var renderDatas = function(dom){
			var urls = {
				'未通过审核':'/api/sys/tdNpExportFtpTemp/getByExportId',
				'配置中':'/api/sys/tdNpExportFtpTemp/getByExportId',
				'已审核':'/api/sys/tdNpExportFtpTemp/getByGbaseExportId'
			}
			$.AIGet({
				url:$.ctx + urls[type],
				data:{
					exportId:$(dom).attr('data-exportId')
				},
				success:function(response){
					console.log(response);
					var insertNodes = getAllNodes('#formSaveIntsExportManage'),
						updataNodes = getAllNodes('.formUpdataIntsExportManage');
					setContent(insertNodes,response.data);
					setContent(updataNodes,response.data);
					type === '已审核' ? setDisabled(true) : setDisabled(false);
				}
			});
		}
		//获取计划推送时间，由于存在三个控件，只需其中一个的值
		/*var getExecTime = function(){
			var value = $('#e-sysExportCycles').val(),
				map = $.intsExportPlanStartTimeMap;
			return $('.' + map[value]).find('input').val();
		}*/
		$('#intsExportManageAddDlg').aiDialog({
			width:940,
			height:600,
			title:'新增/修改推送接口',
			gridObj:'#gridIntsExportManage',
			callback:function(){
				var insertOption = formFmt.formToObj($('#formSaveIntsExportManage'));
					updataOption = formFmt.formToObj($('.formUpdataIntsExportManage')),
					option = $.extend(insertOption,updataOption);
				option.userName = $('#e-sysConfigAuditor').find('option:selected').text();
				option.execTime = getExecTime();
				if(!checkParam('#formSaveIntsExportManage') || !checkParam('.formUpdataIntsExportManage')) return;
				console.log(option);
				$.AIPut({
					url:$.ctx + (type === '已审核' ? '/api/sys/tdNpExportFtpTemp/updateByGbaseExportId' : '/api/sys/tdNpExportFtpTemp/updateByExportId'),
					dataType:'json',
					token:token,
					data:option,
					success:function(response){
						if(parseInt(response.status) === 200){
							$('#intsExportManageAddDlg').dialog('close');
							$('#intsExportManageDeleteDlg').alert({
								title:'提示',
								content:'修改成功',
								dialogType:'success'
							});
							intsExportManage.refreshGrid();
						}else{
							$('#intsExportManageDeleteDlg').alert({
								title:'提示',
								content:response.message,
								dialogType:'failed'
							});
						}
					}
				});
			},
			open:function(){
				width = $('#e-interfaceCode').parent().width();
				isShowUpData(true);
				renderDefaultList(width);
				initDropDownLists(urls,width).then(renderDatas.bind(this,dom));
			}
		});
	}
	/*
	 *审核
	 */
	model.auditInt = function(dom){
		var type = $(dom).attr('data-name');
		//验证是否可以打开审核页面
		var typesVerify = function(type){
			if(!type) return false;
			var res = true,
				alertCantAudit = function(type){
					var msg = {
						'配置中':'配置中数据无法审核',
						'已审核':'数据已审核通过'
					}
					if(!msg[type]) return true;
					$('#intsExportManageDeleteDlg').alert({
						title:'提示',
						content:msg[type],
						dialogType:'failed'
					});
					return false;
				};
			!alertCantAudit(type) && (res = false);
			return res;
		}
		if(!typesVerify(type))return;
		/*
		 *初始化审核列表的每一行
		 */
		var getAuditHTML = function(data){
			if(!data) return '';
			var res = '';
			for(var i in data){
				if(i === 'operationEngineer' || i === 'createTime') continue;
				var dateArr = ['startDate','endDate','offlineDate','exportStartDatetime','exportEndDatetime'],
					value = data[i] ? dateArr.indexOf(i) === -1 ? data[i] : DateFmt.Formate(new Date(data[i]),'yyyy-MM-dd') : '--';
				res += '<tr>'+
			   			'	<td width="20%" class="text-center" style="vertical-align:middle;"><label>' + $.intsExportJson[i] + '</label></td>'+
			   			'	<td width="80%" style="word-break:break-all; word-wrap:break-all;overflow:hidden;" class="" id="e-' + i + '" name="' + i + '">' + (value || '--') + '</td>'+
			   			'</tr>';
			}
			return res;
		}
		/*
		 *初始化审核列表
		 */
		var initAuditGrid = function(data){
			if(!data) return;
			var gridHTML = getAuditHTML(data);
			$('#intsExportManageAudit').html(gridHTML);
			var scrollTop = $("#tableCellInfo").removeClass("hidden").offset().top;
			$('html,body').animate({"scrollTop": scrollTop }, 500 );
		}

		/*
		 *添加审核按钮
		 */
		var addAuditBtn = function(data){
			var btnHTML = '<button id="e-auditPass" class="btn btn-default ui-aiop-btn col-md-1 navbar-right" onclick="intsExportManage.auditPass">通过</button>'+
							'<button id="e-auditRefused" class="btn btn-default col-md-1 ui-aiop-cancel-btn mr10 navbar-right" onclick="intsExportManage.auditRefused">未通过</button>';
			$('.intsExportManageAuditBtn').html(btnHTML);
			$('#e-auditPass').on('click',intsExportManage.auditPass.bind(this,data));
			$('#e-auditRefused').on('click',intsExportManage.auditRefused.bind(this,data));
		}
		$.AIGet({
			url:$.ctx + '/api/sys/tdNpExportFtpTemp/StatusExportFtp',
			datatype:'json',
			token:token,
			data:{
				exportId:$(dom).attr('data-exportId')
			},
			success:function(response){
				initAuditGrid(response.data);
				addAuditBtn(response.data);
			}
		});
	}
	/*
	 *通过审核
	 */
	model.auditPass = function(data){
		var auditSuccess = function(){
			$.AIPut({
				url:$.ctx + '/api/sys/tdNpExportFtpTemp/updateAndInsert',
				data:data,
				success:function(response){
					if(response.status === '200'){
						$('#intsExportManageDeleteDlg').alert({
							title:'提示',
							content:'操作成功',
							dialogType:'success'
						});
					}else{
						$('#intsExportManageDeleteDlg').alert({
							title:'提示',
							content:'操作失败',
							dialogType:'failed'
						});
					}
					$('#closeAppTablePanel').click();
					intsExportManage.refreshGrid();
				}
			});
		}
		var confirmOption = {
			msg:'确认是否审核通过',
			gridObj:'',
			callback:auditSuccess
		}
		confirmOperation(confirmOption);
	}

	/*
	 *审核不通过
	 */
	model.auditRefused = function(data){
		var callback = function(){
			$.AIPut({
				url:$.ctx + '/api/sys/tdNpExportFtpTemp/updateExportStatus',
				data:{
					operationEngineer : data.operationEngineer,
					exportDevelopUser : data.exportDevelopUser,
					exportId : data.exportId,
					exportName : data.exportName,
					createTime : data.createTime
				},
				success:function(response){
					if(response.status === '200'){
						$('#intsExportManageDeleteDlg').alert({
							title:'提示',
							content:'操作成功',
							dialogType:'success'
						});
					}else{
						$('#intsExportManageDeleteDlg').alert({
							title:'提示',
							content:'操作失败',
							dialogType:'failed'
						});
					}
					$('#closeAppTablePanel').click();
					intsExportManage.refreshGrid();
				}
			});
		}
		var confirmOption = {
			msg:'确认是否不通过审核',
			gridObj:'',
			callback:callback
		}
		confirmOperation(confirmOption);
	}
	return model;
})(window.intsExportManage || {})