/**
 * ------------------------------------------------------------------
 * 系统管理-存储管理
 * ------------------------------------------------------------------
 */
$(function(){
	//左侧导航选中
	$('#menuList li').removeClass('active');
	$('#menuList li.J_nav_memory').addClass('active');
	memoryManagement.loadmemoryManagementGrid();//初始化加载列表
	memoryManagement.lookMemoryZhuJi();
	//模糊查询输入框
	$('#searchTxt').AIAutoComplete({
		url:$.ctx + '/api/sys/storage/manager/leveno',
		data:{
			'searchTxt':'search'
		},
		jsonReader:{
			item:'search'
		}
	});
	//创建规则弹框
    // $('#memoryManagementAdd').click(function(){
    // $('#memoryManagementAdd').aiDialog({
    //         width:940,
    //         height:600,
    //         title:'新增/修改推送接口',
    //         gridObj:'#gridMemory',
    //         callback:function(){
    //             var option = formFmt.formToObj($('#formAddMemory'));
    //             if(!checkParam('#formAddMemory')) return;
    //             $.AIPost({
    //                 url:$.ctx + '/api/sys/storage/manager/createOrUpdate',
    //                 dataType:'json',
    //                 token:token,
    //                 data:option,
    //                 success:function(response){
    //                     if(parseInt(response.status) === 200){
    //                         $('#memoryManagementAddDlg').dialog('close');
    //                         $('#memoryManagementDeleteDlg').alert({
    //                             title:'提示',
    //                             content:'添加成功',
    //                             dialogType:'success'
    //                         });
    //                         intsExportManage.refreshGrid();
    //                     }else{
    //                         $('#memoryManagementDeleteDlg').alert({
    //                             title:'提示',
    //                             content:response.message,
    //                             dialogType:'failed'
    //                         });
    //                     }
    //                 }
    //             });
    //         },

    //         open:function(){
    //             width = $('#e-interfaceCode').parent().width();
    //             // isShowUpData(false);
    //             // renderDefaultList(width);
    //             // initDropDownLists(urls,width).then(setDisabled.bind(this,false));
    //         }
    //     });
    //     });
    // debugger;
	$('body').on('click', '.goRight', function(){
        $('.radioRightBoxs').append($(".radioLeftBoxs input:checkbox:checked").prop("checked", false).parent())
    });
    $('body').on('click', '.goLeft', function(){
        $('.radioLeftBoxs').append($(".radioRightBoxs input:checkbox:checked").prop("checked", false).parent())
    });
    $('body').on('click', '.radioEach', function(){
        $(this).prop("checked");
        if($(this).prop("checked")){
             $(this).parent().next().find("div input:checkbox").prop("checked", true)
        }else{
             $(this).prop("checked", false).parent().next().find("div input:checkbox").prop("checked", false)
        }
    });
});