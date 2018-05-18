/**
 * ------------------------------------------------------------------
 * 平台监控-主机监控
 * ------------------------------------------------------------------
 */
 // function hoverHostMonitorGrid(){
 //     hostMonitor.hoverHostMonitorGrid();
 //     console.log('123');
 //     $(".hoverBox").removeClass('hide');
 // }
// function hoverHostMonitorGrid1(){
////     hostMonitor.hoverHostMonitorGrid();
//     console.log('456');
//     $(".hoverBox").addClass('hide');
// }
var serverId = '';
var mountedOns = '';
var mountedOn = '';
var filePath = '';
var hostMonitor = (function (model){
	    model.userId = '';
         // model.serverId = '';
        // model.filePath = '';
	    model.getUserId = function(){
	    	var ssg = window.sessionStorage;
	    	if(ssg){
    			var token = ssg.getItem("token");
    			model.userId = ssg.getItem("userId");
    			$('#userIdHidden').val(model.userId);
    		}
	    }
        /**
         * @description 获取列表
         * @param  option
         * @return
         * ------------------------------------------------------------------
         */
        model.loadHostMonitorGrid = function(option) {
	        	$("#gridHostMonitor").AIGrid({
	        	   	url:$.ctx + '/api/serv/host/monitor/list',
	        		datatype: "json",
	        		postData:{"userId" :model.userId},
	        		colNames:['分类','系统', '用途', '主机名称','主机IP','系统类型','内存大小(G)','CPU数','CPU利用率','内存利用率','磁盘利用率','网络利用率','操作'],
	        	   	colModel:[
                        // {name:'serverId',index:"id",hidden:true,width:60},
	        	   		{name:'classify',index:'classify', width:60},//frozen : true固定列
	        	   		{name:'system',index:'system', width:50,align:"center"},
	        	   		{name:'purpose',index:'purpose', width:50, align:"center"},
	        	   		{name:'serverName',index:'server_name', width:50,align:"center"},
	        	   		{name:'ipAddr',index:'ip_addr', width:90, align:"center"},
	        	   		{name:'osType',index:'os_type', width:50, align:"center"},
	        	   		{name:'memorySize',index:'memory_size', width:80,align:"center",formatter:$.setNull},
	        	   		{name:'cpuNum',index:'cpu_num', width:50,align:"center",formatter:$.setNull},
	        	   		{name:'cpuUtilizationRate',index:'cpu_utilization_rate',width:80,align:"center",progressColor:'cpuLevelColor',formatter:$.setProgress},
	        	   		{name:'memoryUtilizationRate',index:'memory_utilization_rate', width:80, align:"center",progressColor:'memoryLevelColor',formatter:$.setProgress},
	        	   		{name:'diskUtilizationRate',index:'disk_utilization_rate', width:80, align:"center",classes:"boxShow",progressColor:'diskLevelColor',formatter:$.setProgress,cursor: "pointer"},//进度条划过
	        	   		{name:'packetLossRate',index:'packet_loss_rate', width:80,align:"center",progressColor:'packLevelColor',formatter:$.setProgress},
	        	   		{name:'op',index:'op', width:70,title:false, sortable:false,formatter:del,align:"center"}
	        	   	],
	        	   	rowNum:10,
	        	   	rowList:[10,20,30],
	        	   	pager: '#pagerHostMonitor',
	        	   	sortname: '',
	        	    viewrecords: true,
	        	    multiselect:false,
	        	    sord:'',
	        		rownumbers:false,
	        		jsonReader: {
	        			repeatitems : false,
	        			id: "0"
	        		},
	        		height: '100%',
	        		afterGridLoad:function(){
	        	    	$("#tableCellInfo,#appTableInfoPanel").addClass("hidden");
	        	    },
	        	});
	        	function del(cellvalue, options, rowObject){
	        		var rowObjectStr = JSON.stringify(rowObject) ;
                    //console.log(rowObjectStr)
	        		var html='<button type="button" class="btn btn-default  ui-table-btn ui-table-btn" data-serverId="'+rowObjectStr.serverId+'" onclick=\'hostMonitor.showTableCellInfo('+rowObjectStr+')\'>查看</button>';
	        		return html;
	        	}

        }
        //磁盘详情第二屏
        model.diskDetailsGrid = function(option) {
                // var serverId = option['serverId'];
                // debugger;
                //var mountedOn = option['mountedOn'];
                $("#diskDetails").AIGrid({
                    url:$.ctx + '/api/fileSystem/detail/disk',
                    datatype: "json",
                    postData:{"serverId": serverId,"isNew": false},
                    colNames:['文件系统','类型', '总容量', '已用容量','可用容量','已用%','挂载点'],
                    colModel:[
                        {name:'fileSystem',index:'fileSystem', width:210,align:"center"},
                        {name:'fileType',index:'fileType', width:200,align:"center"},
                        {name:'totalSize',index:'totalSize', width:200, align:"center"},
                        {name:'used',index:'used', width:200,align:"center"},
                        {name:'availableSize',index:'availableSize', width:240, align:"center"},
                        {name:'utilizationRate',index:'utilizationRate', width:200, align:"center"},
                        {name:'mountedOn',index:'mountedOn', width:230,align:"center",classes:"mountedXiaZuan"
                                // formatter : function typeformatter( cellvalue, options, rowObject) {
                                //     var selectHtml = "<a href='javascript:void(0)'; onclick='diskDetailsThirdGrid("+ rowObject.serverId + ")'; class='click_pop'>"
                                //         + cellvalue
                                //         + "</a>";
                                //     return selectHtml
                                // },
                            }//加点击的
                    ],
                    rowNum:10,
                    rowList:[10,20,30],
                    pager: '#diskDetailsPager',
                    sortname: '',
                    viewrecords: true,
                    multiselect:false,
                    sord:'',
                    rownumbers:false,
                    showNoResult:true,
                    jsonReader: {
                        repeatitems : false,
                        id: "0"
                    },
                    height: '100%',
                    autowidth:true,
                });
        }

        //鼠标滑过进度条
        model.hoverHostMonitorGrid = function(option) {
                // var serverId = option['serverId'];
                $("#hoverHostMonitor").AIGrid({
                    url:$.ctx + '/api/fileSystem/detail/disk',
                    datatype: "json",
                    postData:{"serverId":serverId,"isNew":false},
                    colNames:['文件系统','类型', '总容量', '已用容量','可用容量','已用%','挂载点'],
                    colModel:[
                        {name:'fileSystem',index:'fileSystem',width:150},//frozen : true固定列
                        {name:'fileType',index:'fileType',width:150,align:"center"},
                        {name:'totalSize',index:'totalSize',width:150, align:"center"},
                        {name:'used',index:'used',width:150,align:"center"},
                        {name:'availableSize',index:'availableSize',width:150, align:"center"},
                        {name:'utilizationRate',index:'utilizationRate',width:150, align:"center"},
                        {name:'mountedOn',index:'mountedOn',width:150,align:"center",formatter:$.setNull}
                    ],
                    rowNum:10,
                    rowList:[10,20,30],
                    // pager: '#hoverHostMonitorPager',
                    sortname: '',
                    viewrecords: true,
                    multiselect:false,
                    sord:'',
                    rownumbers:false,
                    jsonReader: {
                        repeatitems : false,
                        id: "0"
                    },
                    height: '100%',
                    // afterGridLoad:function(){
                    //     $("#tableCellInfo,#appTableInfoPanel").addClass("hidden");
                    // },
                });
        }

        //磁盘详情第三屏
        model.diskDetailsThirdGrid = function(option) {
                // var  mountedOn = option['mountedOn'];
                $("#diskDetailsThird").AIGrid({
                    url:$.ctx + '/api/fileSystem/detail/file/query',
                    datatype: "json",
                    postData:{"serverId":serverId,"filePath":mountedOn},
                    colNames:['名称','属性', '引用计数', '文件所有者','所属组','文件大小/byte','修改时间','操作'],
                    colModel:[
                        {name:'fileName',index:'fileName', width:180,key:true},//frozen : true固定列
                        {name:'fileAttr',index:'fileAttr', width:200,align:"center"},
                        {name:'referCount',index:'referCount', width:200, align:"center"},
                        {name:'fileOwner',index:'fileOwner', width:200,align:"center"},
                        {name:'fileGroup',index:'fileGroup', width:240, align:"center"},
                        {name:'fileSize',index:'fileSize', width:200, align:"center"},
                        {name:'updateTime',index:'updateTime', width:230,align:"center",formatter:$.setNull},
                        {name:'op',index:'op', width:270,title:false, sortable:false,formatter:del,align:"center"}
                    ],
                    rowNum:10,
                    rowList:[10,20,30],
                    pager:'#diskThirdPager',
                    sortname:'',
                    viewrecords: true,
                    multiselect:true,
                    sord:'',
                    rownumbers:false,
                    showNoResult:true,
                    jsonReader: {
                        repeatitems : false,
                        id: "0"
                    },
                    height: '100%',
                    autowidth:true,
                });
                function del(cellvalue, options, rowObject){
                    var rowObjectStr = JSON.stringify(rowObject) ;
                    // debugger
                    // var mountedOn = $(rowObject).attr('data-serverId');
                    var html='<button type="button" class="btn btn-default  ui-table-btn ui-table-btn" data-serverId="'+rowObject.serverId+'" data-name="'+rowObject.mountedOn+'" onclick="hostMonitor.deleteHostMonitor(this);" data-info='+ rowObjectStr +'>删除</button>'+'<button type="button" class="btn btn-default  ui-table-btn ui-table-btn" data-toggle="modal" data-target="#myModal">创建删除规则</button>';
                    return html;
                }
        }
        //磁盘详情第三屏删除
         /**
         * @description 删除应用
        */
        model.deleteHostMonitor = function(obj){
            var serverId = $(obj).attr('data-serverId');
            var param = JSON.parse(obj.dataset['info'])
            // debugger;
            var msg = '确认是否删除该应用?';//确认是否删除选中应用
            var url = $.ctx + "/api/fileSystem/detail/file/delete";
            var ajaxData = {"serverId":param.serverId,"fileInfoRes":[{"path":mountedOns,"attr":param.fileAttr}]};
            hostMonitor.deletehostMonitor(url,ajaxData,msg);
            //用来服务器记录log
            var detail = '应用ID:'+serverId+'&nbsp;&nbsp;&nbsp;&nbsp;应用名称:'+$(obj).attr('data-name');
            $.AILog({
                  "action": "删除",//动作
                  "detail": detail,//详情,默认为空
                  "module": "host_monitor_app"//二级菜单名称，如无二级菜单 使用一级菜单名称
            });
        };
        /**
         * @description 删除应用
         * url-接口地址,ajaxData-传参,msg-提示信息
        */
        model.deletehostMonitor = function(url,ajaxData,msg,ids){
            $("#hostMonitorDeleteDlg").confirm({
                height:"auto",
                title:"提示",
                content:msg,
                gridObj:model.gridObj,
                callback:function(){
                      $.AIDel({
                           url: url,
                           data: ajaxData,
                           async:true,
                           dataType:"json",
                           type:"DELETE",
                           success: function(data){
                               if(data.status == 200){
                                   $("#hostMonitorDeleteDlg" ).dialog( "close" );
                                   $("#hostMonitorDeleteDlg").deleteSuc({
                                       title:"提示",
                                       content:"删除成功",
                                       dialogType:"success",//状态类型：success 成功，failed 失败，或者错误，info提示
                                   });
                               }
                           },
                           error:function(){
                               $("#hostMonitorDeleteDlg").alert({
                                   title:"提示",
                                   content:"删除失败",
                                   dialogType:"failed",//状态类型：success 成功，failed 失败，或者错误，info提示
                               });
                           }
                      });
                      //用来服务器记录log
                        var detail = "应用ID集合："+ids;
                        $.AILog({
                              "action": "批量删除",//动作
                              "detail": "",//详情,默认为空
                              "module": "host_monitor_app"//二级菜单名称，如无二级菜单 使用一级菜单名称
                        });
                },
            })
        };
        /***
	     * 获取全部分类
	     */
	    model.loadAllTypeList = function() {
		    	var ztreeObj = new Ztree();
		    	$.AIGet({
	    			url:$.ctx + "/api/serv/host/monitor/classifies",
	    			datatype:"json",
	    			data:{"userId" :model.userId,"classifyName":$.trim($('#searchAllType').val())},
	    			success:function(result){
	    			 	ztreeObj.init({
		    		    		id:"appType",
		    		    		expandRoot:true,//是否展开根节点
		    					expandRootId:'000',//根节点的id
		    		    		setting:{
		    		    			view: {
		    		    				selectedMulti: false,
		    		    			},
		    		    			callback: {
		    		    				onClick: function(event, treeId, treeNode){
		    		    					//点击刷新列表
		    		    					$("#gridHostMonitor").jqGrid('setGridParam',{
		    		    				        postData:{classifyId:treeNode.id}
		    		    				    }).trigger("reloadGrid");
		    		    					hostMonitor.loadStatusNumber("#statusContent");//更新状态按钮列表
		    		    				},
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
		    	$("#searchAllType").keyup(function(e){
		    		e= e|| window.event;
		    		if(e.keyCode == 13){
		    			var  key=$(this).val();
		    			model.loadAllTypeList(key);
		    		}
		    	});
		    	$("#searchAllType").next().click(function(e){
	    			var  key=$("#searchAllType").val();
	    			model.loadAllTypeList(key);
		    	});
	    };
        /***
	     * 获取状态列表以及对应个数
	     */
	    model.loadStatusNumber = function(obj) {
	    	var treeObj=$.fn.zTree.getZTreeObj("appType");
          	var classifyId = treeObj&&treeObj.getSelectedNodes()[0] ? treeObj.getSelectedNodes()[0].id : "";
	    	var moreQueryIpnut = {"userId":model.userId,"search":$("#searchTxt").val(),"classifyId":classifyId};
		 	$.AIGet({
		    		url:$.ctx + "/api/serv/host/monitor/items",
		    		datatype:"json",
		    		data:moreQueryIpnut,
		    		success:function(result){
		    			var html = '';
		    			if(!result.data){return;}
		    			for(var i=0;i<result.data.length;i++){
		    				var item = result.data[i];
		    				html+='<a class="btn btn-default" style="background-color:'+item.statusColor+'" data-statusCode="'+item.statusCode+'" href="javascript:;" role="button">'+
		    							'<span class="fleft">'+item.statusName+'</span>'+
		    							'<span class="ui-btn-number fright">'+item.statusNbr+'</span>'+
		    					   '</a>';
		    			}
		    			$(obj).html(html);
		    		}
			})
	    };
	    /***
	     * 查看按钮
	     */
	    model.showTableCellInfo=function(rowObject){
			var scrollTop = $("#tableCellInfo").removeClass("hidden").offset().top;
			$('html,body').animate({"scrollTop": scrollTop }, 500 );
			/*$("#hostDate").datepicker({
				defaultDate:new Date(),
				onSelect:function(date){
					$("#gridDiskUse").jqGrid('setGridParam',{
			            postData:{"serverId":rowObject.serverId,"date":date}
			        }).trigger("reloadGrid");
					model.getDelayConditionCharts(rowObject,date);
				}
			});*/
            serverId = rowObject.serverId;
			$.datepicker.dpDiv.addClass("ui-datepicker-box");
			hostMonitor.loadHostInfo(rowObject);//查询当前行主机详情
			$("#gridDiskUse").jqGrid('setGridParam',{
	            postData:{"serverId":rowObject.serverId,"date":""}
	        }).trigger("reloadGrid");
			hostMonitor.loadDiskUseGrid(rowObject);//磁盘使用情况列表
			hostMonitor.getDelayConditionCharts(rowObject,$("#hostDate").val());//echarts图表
	    };
	    /**
	     * 查询当前行主机详情
	     */
	    model.loadHostInfo=function(rowObject,date){
	     	$.AIGet({
				url:$.ctx + "/api/serv/host/monitor/detail/hostInfo",
				datatype:"json",
				data:{"serverId":rowObject.serverId},
				success:function(result){
					var data = result.data;
					$("#ipAddr").html(data.ipAddr).attr('title',data.ipAddr);
					$("#nodeName").html(data.nodeName).attr('title',data.nodeName);
					$("#osType").html(data.osType).attr('title',data.osType);
					$("#passWord").html(data.passWord).attr('title',data.passWord);
					$("#port").html(data.port).attr('title',data.port);
					$("#serverName").html(data.serverName).attr('title',data.serverName);
					$("#userName").html(data.userName).attr('title',data.userName);
				}
		    });
	    };
	    /**
         * @description 第二屏磁盘使用情况列表
         * @param  option
         * @return
         * ------------------------------------------------------------------
         */
        model.loadDiskUseGrid = function(rowObject) {
	        	$("#gridDiskUse").AIGrid({
	        	   	url:$.ctx + '/api/serv/host/monitor/detail/disk',
	        		datatype: "json",
	        		postData:{"serverId":rowObject.serverId,"date":$.trim($('#hostDate').val())},
	        		colNames:['磁盘','磁盘使用率', '可用磁盘空间'],
	        	   	colModel:[
	        	   		{name:'diskUrl',index:'disk_url', width:90,align:"center"},
	        	   		{name:'utilizationRate',index:'utilization_rate', width:90,align:"center"},
	        	   		{name:'available',index:'available', width:100,align:"center"},
	        	   	],
	        	   	rowNum:'',
	        	   	rowList:[10,20,30],
	        	   	pager: '',
	        	   	sortname: '',
	        	    viewrecords: true,
	        	    multiselect:false,
	        	    sord:'',
	        		rownumbers:false,
	        		jsonReader: {
	        			repeatitems : false,
	        			id: "0"
	        		},
	        		height: '176',
	        	});
        }
	    /**
	     * 7天数据图表
	     */
	    model.getDelayConditionCharts = function (rowObject,date){
	    	var itemStyleObj = {"lineColor":["#45bd6f","#f39800","#ff78cb",'#599ef4','#fae2a1','rgb(249,205,173)','rgb(200,200,169)','rgb(131,175,155)']};//折线颜色等
	    	//网卡流量
	    	model.getChartsData('CPU使用率',{"lineColor":["#f6b37f"]},rowObject,date,'cpuCharts',$.ctx + "/api/serv/host/monitor/detail/cpu",'1');
	    	//内存使用率
	    	model.getChartsData('内存使用率',{"lineColor":["#45bd6f"]},rowObject,date,'memoryCharts',$.ctx + "/api/serv/host/monitor/detail/memory",'1');
	    	//网卡流量(Receive)
	    	model.getChartsData('网卡流量(Receive)',itemStyleObj,rowObject,date,'receiveCharts',$.ctx + "/api/serv/host/monitor/detail/receive");
	    	//网卡流量(Send)
	    	model.getChartsData('网卡流量(Send)',itemStyleObj,rowObject,date,'sendCharts',$.ctx + "/api/serv/host/monitor/detail/send");
	    	//服务器连通性
	    	model.getChartsData('服务器连通性',{"lineColor":["#00b0ca"]},rowObject,date,'packLossCharts',$.ctx + "/api/serv/host/monitor/detail/packloss");
	    };
	    /**
         * @description 取得折线图数据
         * @param  titleTxt 图表名称  itemStyleObj:折线样式 isPercent 是否使用% 1-是 0 否
         * @return
         * ------------------------------------------------------------------
         */
        model.getChartsData = function(titleTxt,itemStyleObj,rowObject,date,chartsId,url,isPercent) {
        	var formatterY = isPercent && (isPercent == '1') ? '{value}%' : '{value}';
        	var option = {
        		    title: {
        		    	top:20,
        		        text: titleTxt,
        		        x:'center',
        		        textStyle:{
        		        	fontSize:14,
        		        	fontWeight:'normal',
        		        },
        		    },
        		    legend: {
        		        icon:'circle',
        		        data:[],//'邮件营销'
        		       	orient: 'horizontal',
        		        left: 'center',
        		        bottom:'1%',

        		    },
        		    tooltip: {
        		        trigger: 'axis',
        		    },
        		    toolbox: {},
        		    xAxis:  {
        		        type: 'category',
        		        boundaryGap: false,
        		        data: [],
        		        axisLabel : {
        		            interval : 12,
        		        },
        		        splitNumber : 10
        		    },
        		    yAxis: {
        		        type: 'value',
        		        axisLabel: {
        		            formatter: formatterY
        		        },
        		    },
        		    series: []
        		};
        	var postData = {"serverId":rowObject.serverId,"date":date};
	    	$.AIGet({
				url:url,
				datatype:"json",
				data:postData,
				success:function(result){
					    var data = result.data;
					    var myChart = echarts.init(document.getElementById(chartsId));
					    myChart.clear();
					    if(result.status=='201'){return;}
						option.xAxis.data = data.xaxis.data;
						var changeColorSeries = [];
						data.series.map(function (item,index) {
							item.symbol ='circle';//空心圆改为实心圆
							if(itemStyleObj){ //itemStyleObj 为{}时用插件的默认色
								item.itemStyle = {
		                                normal : {
		                                	color:itemStyleObj.lineColor[index],//折线点颜色
		                                    lineStyle:{
		                                        color:itemStyleObj.lineColor[index] //折线线条颜色
		                                    }
		                                }
		                            }
							}
							//debugger
							changeColorSeries.push(item)
			                return changeColorSeries;
			            })
						option.series = changeColorSeries;
						option.legend.data = data.legendData
						// 使用刚指定的配置项和数据显示图表。
						myChart.setOption(option,true);
					}
		    	});
        }
        return model;
   })(window.hostMonitor || {});

$(function(){
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
    // $('#myTabs li a').click(function (e) {
    //     // alert('ok')
    //   e.preventDefault()
    //   $(this).tab('show')
    // });
    // 划过进度条
    $('body').on("mouseenter",'.boxShow',function(){
        $(".hoverBox").removeClass('hide');
        hostMonitor.hoverHostMonitorGrid();
        // $("#hoverHostMonitor").jqGrid('setGridParam',{
        //     postData:{"serverId":serverId,"isNew":false}
        // }).trigger("reloadGrid");
    });
    $('body').on("click",'.boxShow',function(){
        $(".hoverBox").addClass('hide');
        var scrollTop = $("#tableCellInfo").removeClass("hidden").offset().top;
        $('html,body').animate({"scrollTop": scrollTop }, 500 );
        hostMonitor.diskDetailsThirdGrid();
        // $("#hoverHostMonitor").jqGrid('setGridParam',{
        //     postData:{"serverId":serverId,"isNew":false}
        // }).trigger("reloadGrid");
    });
    $('body').on("mouseleave",'.boxShow',function(){
        // hostMonitor.hoverHostMonitorGrid();
        $(".hoverBox").addClass('hide');
    });
    //点击第二屏挂载点跳到第三屏
    $('body').on("click",'.mountedXiaZuan',function(rowObject){
      mountedOns = $(this).attr('title');
        var scrollTop = $("#diskDetailsInfo").removeClass("hidden").offset().top;
        $('html,body').animate({"scrollTop": scrollTop }, 500 );
            // var html = "<ul class='breadcrumb backgroundNone'>"+
            //              "<li>"+
            //               "<a>" + mountedOns + "</a> <span class='divider'></span>"+
            //              "</li>"+
            //            "</ul>";
          var str = mountedOns.split('/');
          var _html = '';
          for(var i = 0; i < str.length; i++){
            _html += '<li>\
                        <a href="#">' + str[i] + '</a>\
                        <span class="divider"></span>\
                      </li>'
          }
            $('.breadcrumb').html(_html);
        hostMonitor.diskDetailsThirdGrid() || $("#diskDetailsThird").jqGrid('setGridParam',{
            postData:{"serverId":serverId,"isNew":false}
        }).trigger("reloadGrid");
    });
    //磁盘详情第三屏模糊查询
    $( "#searchFile").AIAutoComplete({
        url:$.ctx + "/api/fileSystem/detail/file/query",
        data:{"searchFile":"serverId"},//dom ID ：参数名称,
        jsonReader:{item:"search"}//返回结果中用于展示使用的字段名
    });
})
