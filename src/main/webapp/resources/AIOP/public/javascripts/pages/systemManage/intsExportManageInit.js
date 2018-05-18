$(function(){
	var token = intsExportManage.token;
	$('#menuList li').removeClass('active');
	$('#menuList li.J_nav_intsExport').addClass('active');
	intsExportManage.loaddatepicker({
		from:'#intsExportStartTime',
		to:'#intsExportEndTime'
	});
	intsExportManage.loaddatepicker({
		from:'#intsExportStartTime',
		to:'#intsExportOutlineTime'
	});
	// intsExportManage.loaddatepicker({
	// 	from:'#intsExportPlanStartTime'
	// });
	
	$('#intsExportPlanStartTime').datetimepicker({
		changeMonth: true, //显示月份
		changeYear: true, //显示年份
		showButtonPanel: true, //显示按钮
		timeFormat: "HH:mm",
		dateFormat: "dd日",
		controlType:"select",
		timeOnlyTitle:"选择时间",
		timeText: '已选择',
		hourText: '时',
		minuteText: '分',
		second_slider:false,
		currentText:"当前时间",
		closeText: '确定'
	});
	$( "#intsExportPlanStartTime_D").timepicker({
		timeFormat: "HH:mm",
		showSecond: false,
		controlType:"select",
		timeOnlyTitle:"选择时间",
		timeText: '已选择',
		hourText: '时',
		minuteText: '分',
		second_slider:false,
		currentText:"当前时间",
		closeText: '确定',
		onClose:function(time){
			  var time = time ? time : "00:00";
			  $(this).val(time);
		  }
	});
	// $( "#intsExportPlanStartTime").val('12:00')
	intsExportManage.loaddatepicker({
		from:'#intsExportMissionStartTime',
		to:'#intsExportMissionEndTime'
	});
	//全部分类
	$("#allTypeBtn").click(function(){
		if($(this).hasClass("active")){
			$(this).removeClass("active");
			$("#allTypeZtreeDlg").addClass("hidden");
		}else{
			$(this).addClass("active");
			$("#allTypeZtreeDlg").removeClass("hidden");
			intsExportManage.loadIntsExportManageTree();
		}
	});

	//左侧树的取消按钮
	$('.J_treeCancel').click(function(){
		intsExportManage.loadAppManageTree();//重新加载左侧树
	});
	//左侧树的确定即增加节点按钮
	$('.J_treeAdd').click(function(){
		var treeObj = $.fn.zTree.getZTreeObj("appType");
		var changNodes = intsExportManage.ztreeObj.getChangeNodes();//返回新加treeNode数组
		if(changNodes.length<=0){return;}
		$.AIPost({
			url: $.ctx+'/api/sys/tdInterfaceUseClassify/addUseClassify',
			data: {"useClassifys":changNodes},
			success: function(data){
				   if(data.status == 200){
					   $("#intsExportManageDeleteDlg").alert({
						   title:"提示",
						   content:'保存成功',
						   dialogType:"success"
					   });
					   hostManage.loadAppManageTree();//重新加载左侧树
				   }else{
					   $("#intsExportManageDeleteDlg").alert({
						   title:"提示",
						   content:'添加节点保存失败',
						   dialogType:"failed"
					   });
				   }
			},
		});
	});

	//模糊查询输入框
	$('#searchTxt').AIAutoComplete({
		url:$.ctx + '/api/sys/tdNpExportFtpTemp/searchTextList',
		data:{
			'searchTxt':'searchText'
		},
		jsonReader:{
			item:'searchText'
		}
	})

	//渲染下拉框
	$('#isEffect').multiselect({
		nonSelectedText:"是否有效",
		buttonWidth:134,
		nSelectedText:"个选择",
		includeSelectAllOption:true,
		selectAllText: '全部',
	});
	intsExportManage.renderIntsStatus();

	//渲染表格
	intsExportManage.renderGrid();

	//查询按钮刷新列表
	$('#searchIntsExportManage').on('click',intsExportManage.refreshGrid);

	//批量删除
	$('#intsExportManageDeleteBatch').on('click',intsExportManage.deleteBatch);

	//添加
	$('#intsExportManageAddBtn').on('click',intsExportManage.addInt);

	//关闭审核页面
	$("#closeAppTablePanel").click(function(){
		var scrollTop = $("#tableCellInfo").offset().top;
		$('html,body').stop().animate({"scrollTop": scrollTop }, 500 );
		$(this).parent().parent().addClass("hidden");
		$(this).parent().parent().find(".tab-pane").eq(0).addClass("active").siblings(".tab-pane").removeClass("active");
		$(".ui-tabs-box #tabList  li").eq(0).addClass("active").siblings("li").removeClass("active")
	});

})