/**
 *平台监控-主机监控
 */
$(function(){
	hostMonitor.getUserId();//获取用户id
	hostMonitor.loadHostMonitorGrid();//加载主机监控列表
    //hostMonitor.hoverHostMonitorGrid();//进度条划过进度条显示
	hostMonitor.loadStatusNumber("#statusContent");//首次加载状态按钮列表
	 //hostMonitor.diskDetailsThirdGrid();//磁盘详情第三屏
	// 点击下钻
	$('body').on('click','#pFloatLeftNone',function(){
		var scrollTop = $("#tableCellInfo").removeClass("hidden").offset().top;
		$('html,body').animate({"scrollTop": scrollTop }, 500 );
	})
	//点击磁盘详情
	$('body').on('click','#diskMain',function(){
		var scrollTop = $("#tableCellInfo").removeClass("hidden").offset().top;
		$('html,body').animate({"scrollTop": scrollTop }, 500 );
		hostMonitor.diskDetailsGrid();//磁盘详情第二屏
	});
	//立即更新按钮
	$('body').on('click','.updateNow',function(){
		$("#diskDetails").jqGrid('setGridParam',{
		    datatype:'json',
		    postData:{"serverId": serverId,"isNew": true}, //发送数据
		    page:1
		}).trigger("reloadGrid"); //重新载入
	});
	//批量删除
	$('#delChecked').click(function(){
		var ids = $("#diskDetailsThird").jqGrid('getSelectedIdsArray',{key:"appId"});
			ids = ids.join(',');
    	var msg = '确认是否删除选中应用?';
    	var url = $.ctx + "/api/fileSystem/detail/file/delete";
		var ajaxData = {"ids":ids};
		if(!ids){
			$("#appManageDeleteDlg").alert({
				   title:"提示",
				   content:"请选择要删除的应用",
				   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
			   });
		}else{
			appManage.deleteAppManage(url,ajaxData,msg,ids);
		}
	});
	// $('body').on('click','#diskDetailsInfo',function(){
	// 	// alert(1)
	// 	hostMonitor.diskDetailsThirdGrid()//磁盘详情第二屏
	// });
	// $('#delChecked').click(function(e){
	// 	e.stopPropagation()
	// 	alert("ok")
	// 	hostMonitor.delThis();//磁盘详情第二屏删除
	// });

	//全部分类
	$("#allTypeBtn").click(function(){
		if($(this).hasClass("active")){
			$(this).removeClass("active");
			$("#allTypeZtreeDlg").addClass("hidden");
		}else{
			$(this).addClass("active");
			$("#allTypeZtreeDlg").removeClass("hidden");
			hostMonitor.loadAllTypeList();
		}
	});
	//输入框联想输入
	$( "#searchTxt").AIAutoComplete({
		url:$.ctx + "/api/serv/dispatch/lenovo",
	  	 data:{"searchTxt":"search","userIdHidden":"userId"},//dom ID ：参数名称,
		 jsonReader:{item:"search"}//返回结果中用于展示使用的字段名
	});


	//查询按钮
	$("#searchBtnHostMonitor").click(function(){
		var treeObj=$.fn.zTree.getZTreeObj("appType");
      	var classifyId = treeObj&&treeObj.getSelectedNodes()[0] ? treeObj.getSelectedNodes()[0].id : "";
		var moreQueryIpnut = {"userId":hostMonitor.userId,"search":$("#searchTxt").val(),"classifyId":classifyId};
		$("#gridHostMonitor").jqGrid('setGridParam',{
            postData:moreQueryIpnut
        },true).trigger("reloadGrid");
		hostMonitor.loadStatusNumber("#statusContent");//更新状态按钮列表
		//用来服务器记录log
		/*$.AILog({
			  "action": "查询",//动作
			  "detail": "",//详情,默认为空
			  "module": "app_monitor_history"//二级菜单名称，如无二级菜单 使用一级菜单名称
	    });*/
	});
	//点击状态按钮
	$("#statusContent").on("click",".btn",function(){
		 var statusCode = $(this).attr("data-statusCode");
	 	$("#gridHostMonitor").jqGrid('setGridParam',{
	        postData:{"statusCode":statusCode}
	    }).trigger("reloadGrid");
	});
    // 关闭第二屏主机详情页面按钮
	$(".ui-moudle-title i.ui-close-panel").click(function(){
		$(this).parent().parent().addClass("hidden");
	});
});