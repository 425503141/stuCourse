/**
 * ------------------------------------------------------------------
 *数据源配置
 * ------------------------------------------------------------------
 */
var sourceSetting = (function (model){ 
	/**
	   * @description 加载左侧业务名称
	 */
    model.loadMenuList = function() {
		$.AIGet( {
	   	   url:$.ctx + "/api/sys/config/configMenuName",
	   	   data:{},
	   	   success:function(result) {
	   		   		var data = result.data;
	   		   	    var menuStr = '';
	   		   		for(var i=0;i<data.length;i++){
	   		   			var menuId = data[i].menuId;
	   		   			var menuName = data[i].menuName;
	   		   			var panelId = 'source-'+menuId;
	   		   			var className = menuId=='2' ? 'active' :'';//默认第一次点击DACP配置
	   		   		    menuStr+='<li id="sourceMenu-'+menuId+'" role="presentation" class="'+panelId+' '+className+'" onclick="sourceSetting.loadSourceInfoById('+menuId+')">'+
							    	'<a href="#'+panelId+'" aria-controls="'+panelId+'" role="tab" data-toggle="tab">'+
							    		'<i class="source-icon"></i>'+
							    		'<span>'+menuName+'</span>'+
							    	'</a>'+
							    '</li>'	
	   		   		}
	   		   		$('#menuList').html(menuStr);
	   	  		}
	     });
   };
   /**
	   * @description 数据库类型下拉列表
	 */
	model.loadDatabaseType = function() {
		   $.AIGet({
		   	   url:$.ctx + "/api/sys/config/configDatabaseType",
			   data:{},
			   success:function(result) {
				   		var data = result.data;
				   	    var menuStr = '';
				   		for(var i in data){
				   		    menuStr+='<option value="'+data[i].databaseName+'">'+data[i].databaseName+'</option>'	
				   		}
				   		$('.J_configDatabaseType').html(menuStr);
			   	}
			  });
	};
	/**
	   * @description 根据id查询数据源配置
	 */
   model.loadSourceInfoById = function(menuId) {
		$.AIGet( {
	   	   url:$.ctx + "/api/sys/config/sysDatabaseConfig",
	   	   data:{"menuId":menuId},
	   	   success:function(result) {
	   		        if(result.status=='201'){
	   		        	$("#SMStelDlg").alert({
						   title:"提示",
						   content:result.message,
						   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
					    });
	   		        	return;
	   		        }
	   		   		var data = result.data;
	   		   		var tabpanelId = 'source-'+data.menuId;
	   		   		var $curBox = $('#'+tabpanelId);
	   		   	    $curBox.find('.J_head').html(data.menuName);
	   		   	    $curBox.find('input[name=menuId]').val(data.menuId);
	   		   	    $curBox.find('input[name=businessName]').val(data.businessName);
	   		   	    $curBox.find('input[name=serverName]').val(data.serverName);
	   		   	    $curBox.find('select[name=databaseType]').find('option[value='+data.databaseType+']').attr('selected','selected');//数据库类型没有id
	   		   	    $curBox.find('input[name=ip]').val(data.ip);
	   		   	    $curBox.find('input[name=port]').val(data.port);
	   		   	    $curBox.find('input[name=userName]').val(data.userName);
	   		   	    $curBox.find('input[name=password]').val(data.password);
		   		   	$curBox.find('input[name=databaseName]').val(data.databaseName);
		   		   	$curBox.find('.J_test,.J_sourceSave,.J_sourceCancel').attr('data-menuId',data.menuId);
		   		   	if(data.menuId=='4' || data.menuId=='5' || data.menuId=='6'){//一经上传配置&&接口入库配置&&短信网关配置时才有数据库表名字段（或者4，5模式名(schema)）
		   		   		$curBox.find('select[name=databaseType]').find('option[value=DB2]').attr('selected','selected');
		   		   	    $('#source-4,#source-5,#source-6').find('.J_configDatabaseType').attr('disabled','disabled');//一经上传配置&&接口入库配置&&短信网关配置
		   		   		$curBox.find('input[name=tableName]').val(data.tableName); 
		   		   	}
	   	  		}
	     });
   };
   /**
	   * @description 数据库链接测试
	 */
	model.dataBaseLinkTest = function(menuId) {
		    var $curBox = $("#source-"+menuId);
		    var saveObj = formFmt.formToObj($curBox.find('form'));
		   // model.checkName(saveObj);//所属业务唯一性校验
		    var checkObj = sourceSetting.beforeSaveCheck(saveObj);
		    var checkObjName = sourceSetting.checkName(saveObj);//所属业务唯一性校验
		    if(!checkObjName[1]){
				  $("#SMStelDlg").alert({
					   title:"提示",
					   content:checkObjName[0],
					   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
				   });
			}
		    if(!checkObj[1]){
	   			//$curBox.find('.J_sourceSave').addClass('disabled');
			    $("#SMStelDlg").alert({
					   title:"提示",
					   content:checkObj[0],
					   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
			    });
			}
		    if(checkObjName[1] && checkObj[1]){
				  $.AIGet( {
				   	   url:$.ctx + "/api/sys/config/test",
				   	   data:saveObj,
				   	   success:function(result) {
						   		var dialogType = result.status == '200' ? "success" : "failed";
			   		   			$("#SMStelDlg").alert({
								   title:"提示",
								   content:result.message,
								   dialogType:dialogType
			   		   			});
				   	  		  }
				     });
			  }
	};
	/**
	   * @description 所属业务唯一性校验
	 */
	 model.checkName = function(data){
		 var $curBox = $("#source-"+data.menuId);
		 var checkObj = [];
			checkObj[1]=true;
		   $.AIGet({
				url : $.ctx + "/api/sys/config/checkBusinessName",
				data : {"businessName" : data.businessName,"menuId" : data.menuId},
				datatype:"json",
				async:false,
				success:function(result){
					if(result.data.checkResult == false){
	   		   			//$curBox.find('.J_sourceSave').addClass('disabled');
						checkObj[0] = result.message;
						checkObj[1] =false;
						return checkObj;
					}
				}
			});
		   return checkObj;
	 }
	/**
	 * @description 保存前的验证
	 */
	model.beforeSaveCheck = function(data){
		var checkObj = [];
		checkObj[1]=true;
	    switch (true){
            case !data.businessName: 
            	checkObj[0] ='请输入所属业务';
    			checkObj[1] =false;
    			return checkObj;
    			break;
            case !data.serverName:
				checkObj[0] ='请输入服务器名称';
				checkObj[1] =false;
				return checkObj;
				break;
            case !data.ip:
            	checkObj[0] ='请输入数据库IP地址';
    			checkObj[1] =false;
    			return checkObj;
				break;
            case !data.port:
            	checkObj[0] ='请输入数据库端口';
    			checkObj[1] =false;
    			return checkObj;
				break;
            case !data.userName:
            	checkObj[0] ='请输入数据库用户名';
    			checkObj[1] =false;
    			return checkObj;
				break;
            case !data.password:
				checkObj[0] ='请输入数据库密码';
				checkObj[1] =false;
				return checkObj;
				break;
            case !data.password:
				checkObj[0] ='请输入数据库密码';
				checkObj[1] =false;
				return checkObj;
				break;
            case !data.databaseName:
				checkObj[0] ='请输入数据库名';
				checkObj[1] =false;
				return checkObj;
				break;
           /* case !data.databaseName && data.menuId!=7:
				checkObj[0] ='请输入数据库名';
				checkObj[1] =false;
				return checkObj;
				break;*/
            case (!data.tableName && data.menuId==4) || (!data.tableName && data.menuId==5):
				checkObj[0] ='请输入模式名(schema)';
				checkObj[1] =false;
				return checkObj;
				break;
            case !data.tableName && data.menuId==6:
				checkObj[0] ='请输入数据库表名';
				checkObj[1] =false;
				return checkObj;
				break;
            default:
            	return checkObj;
	      }
	};
	/**
	   * @description 修改数据源配置 保存
	 */
	model.dataBaseUpdate = function(menuId) {
			    var $curBox = $("#source-"+menuId);
			    var saveObj = formFmt.formToObj($curBox.find('form'));
			   // model.checkName(saveObj);//所属业务唯一性校验
			    var checkObj = sourceSetting.beforeSaveCheck(saveObj);
			    var checkObjName = sourceSetting.checkName(saveObj);//所属业务唯一性校验
			    if(!checkObjName[1]){
					  $("#SMStelDlg").alert({
						   title:"提示",
						   content:checkObjName[0],
						   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
					   });
				}
			    if(!checkObj[1]){
		   			//$curBox.find('.J_sourceSave').addClass('disabled');
				    $("#SMStelDlg").alert({
						   title:"提示",
						   content:checkObj[0],
						   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
				    });
				}
			    if(checkObjName[1] && checkObj[1]){
			    	$.AIPut({
					   	   url:$.ctx + "/api/sys/config/update",
					   	   data:saveObj,
					   	   success:function(result) {
						   		   	if(result.status=='200'){
						   		   	   $("#appManageDeleteDlg").alert({
										   title:"提示",
										   content:'保存成功',
										   dialogType:"success",//状态类型：success 成功，failed 失败，或者错误，info提示
									   });
					   		   		}else{
					   		   			$("#appManageDeleteDlg").alert({
										   title:"提示",
										   content:'保存失败',
										   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
									   });
					   		   		}
					   	  		  }
					    });
			    }
			//用来服务器记录log
			$.AILog({
				  "action": "保存",//动作
				  "detail": "",//详情,默认为空
				  "module": "sys_db_setting"//二级菜单名称，如无二级菜单 使用一级菜单名称
			});
	};
   return model;
})(window.sourceSetting || {});
