/**
 * 前端配置文件
 */
(function(){
	$.extend({ 
		ctx:"http://localhost:8080/AIOP",//获取服务器上下文和端口号等
		forward:"http://localhost:8080/AIOP/appMonitor/realTimeMonitoring.min.html",//登录成功跳转路径
		loginURL:"http://localhost:8080/AIOP/login.html",
		context:"http://localhost:8080/AIOP",		
		gaertwayUrl:"http://10.1.235.171:12005/dmc/dev/module/login/login.html",//门户地址
		publicityUrl:"http://10.1.236.113/#/Aiop/AsiainfoHomePage.html",//平台展示
		statusClass:{"100":"ui-btn-delay","101":"ui-btn-delay-update","102":'ui-btn-normal',"103":"ui-btn-delay-running","104":"ui-btn-completed","105":"ui-btn-alsoInPlan","900":"ui-btn-tape-out"},
		runFreqObj:{day:"日",week :"周",month:"月",quarter:"季"},
		priLevelObj :{3:"高",2 :"中",1:"低"},
		weekObj : {0:"周一",1 :"周二",2:"周三",3:"周四",4 :"周五",5:"周六",6:"周日"},
		weekObjCyclePlan : {1:"周日",2:"周一",3 :"周二",4:"周三",5:"周四",6 :"周五",7:"周六"},
		monthObj : {
						1:"1日",2 :"2日",3:"3日",4:"4日",5 :"5日",6:"6日",7:"7日",8 :"8日",9:"9日",10:"10日",11 :"11日",12:"12日",13 :"13日",14:"14日",
						15:"15日",16 :"16日",17:"17日",18:"18日",19 :"19日",20:"20日",21:"21日",22 :"22日",23:"23日",24:"24日",25 :"25日",26:"26日",27 :"27日",28:"28日"
				   },
		quarterObj : {1:"第一个月",2 :"第二个月",3:"第三个月"},
        isEffect:{0:'有效',1:'无效'},
        intsStatus:{1001:'配置中',1002:'待审核',1003:'未通过审核',1004:'已审核'},
		visOptions : {
	        interaction:{hover:true},//鼠标经过
	        nodes: {
        		shape: 'dot',
        		color:{
        			background:"#fff" ,
        			border:'#fff',//节点外侧边线颜色
        		},
        		
                font: {
                    size: 14,
                    color: '#333'
                },
              scaling: {
                min: 1,
                max: 15
              },
              physics:false
            },
            edges:{
                color: '#aaa', 
                smooth: true,
                arrows: {
                    to: {enabled: true, scaleFactor: 0.4},
                }
            },
            layout: {
                hierarchical: {
                    direction: "UD",
                    sortMethod: "directed",
                    levelSeparation:100,
                    parentCentralization:true,
                    edgeMinimization:true,
                    nodeSpacing:50,
                    blockShifting:true,
                }
            },
            interaction: {
                navigationButtons: true,
                keyboard: true
            }
        },
        intsExportJson:{
            cmccManagerName : '需求负责人' ,
            customerBore : '业务口径' ,
            cycleName : '推送周期' ,
            delimiterName : '分隔符' ,
            endDate : '结束时间' ,
            execTime : '计划推送时间' ,
            exportDateFormat : '导出表名格式' ,
            exportDevelopUser : '开发人员' ,
            exportEndDatetime : '导出任务结束时间' ,
            exportFileFtpDir : '推送路径' ,
            exportFileFtpIp : '推送服务器' ,
            exportFileFtpUserName : '推送服务器用户名' ,
            exportFileFtpUserPasswd : '推送服务器密码' ,
            exportFileName : '导出文件名称' ,
            exportId : '接口编码' ,
            exportName : '接口名称' ,
            exportProgramName : '导出程序名' ,
            exportSql : '导出sql' ,
            exportStartDatetime : '导出任务开始时间' ,
            exportTableName : '导出表名' ,
            exportTableSchema : '导出表所在模式名' ,
            exportWorkType : '导出任务工作方式' ,
            fileTypeName : '导出文件类型' ,
            iconvType : '编码类型' ,
            modeName : '导出文件方式' ,
            monitorFlag : '是否短信监控' ,
            offlineDate : '下线时间' ,
            orderidName : '任务优先级' ,
            outUserName : '推送服务器接口人' ,
            remarks : '活动标签' ,
            requireLevelName : '重要级别' ,
            requirePeople : '需求提出人' ,
            requirePeoplePhone : '需求提出人电话' ,
            requirementIdAndName : '需求名称' ,
            sourceName : '数据接收方' ,
            startDate : '开始时间' ,
            statType : '是否单表按天导出' ,
            tagName : '导出任务状态' ,
            typeName : '接口类型' ,
            useClassifyName : '用途分类',
            downThreshold:'波动阀值下',
            upThreshold:'波动阀值上',
        },
        interfaceNameMap : {
            exportType:{
                Mysql:'interfaceType',
                Gbase:'interfaceType'
            },
            execCycle:{
                Mysql:'cycleType',
                Gbase:'cycleType'
            },
            exportSource:{
                Mysql:'sourceId',
                Gbase:'sourceId'
            },
            monitorFlag:{
                Mysql:'monitorFlag',
                Gbase:'monitorFlag'
            },
            exportDateFormat:{
                Mysql:'exportDateFormat',
                Gbase:'exportDateFormat'
            },
            exportDelimiter:{
                Mysql:'delimiterCode',
                Gbase:'delimiterCode'
            },
            exportWorkType:{
                Mysql:'exportWorkType',
                Gbase:'exportWorkType'
            },
            fileType:{
                Mysql:'fileTypeCode',
                Gbase:'fileTypeCode'
            },
            operationEngineer:{
                Mysql:'userId',
                Gbase:'operationEngineerName'
            },
            exportFileNameType:{
                Mysql:'modeCode',
                Gbase:'modeCode'
            },
            useClassifyId:{
                Mysql:'useClassifyName',
                Gbase:'dataUse'
            },
            orderidCode:{
                Mysql:'orderidCode',
                Gbase:'orderidCode'
            },
            exportTag:{
                Mysql:'tagCode',
                Gbase:'tagCode'
            },
            statType:{
                Mysql:'statType',
                Gbase:'statType'
            },
            requireLevel:{
                Mysql:'requireLevel',
                Gbase:'requireLevel'
            },
            userId:{
                Mysql:'configAuditorId',
                Gbase:'configAuditorId'
            }
        },
        intsExportPlanStartTimeMap:{
            '1':'intsExportPlanStartTime_D_container',
            '2':'intsExportPlanStartTime_container',
            '3':'intsExportPlanStartTime_T_container'
        }
	});
})($);