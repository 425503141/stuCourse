/* ========================================================================
 * jQuery-own: alert.js v1.0
 * ========================================================================
 * Copyright 2014-2017 asiainfo, Inc. 
 * author wangsen
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT 加载
  // ======================

  var dismiss = '[aibi-dismiss="alert"]';
  var content = 'aibi-content';
  var type = 'aibi-type';
  $(document).on("click", dismiss ,function(event){
	  $("#alert_"+random(8)).alert({
			dialogType:$(this).attr(type),//状态类型：success 成功，failed 失败，或者错误，info提示
			content:$(this).attr(content),
			 callback:function(obj){//确定按钮回调函数
				 console.log(obj);
			 }
		});
  });
  
}(jQuery);
 
+function ($) {
  'use strict';

  // confirm 加载
  // ======================

  var dismiss = '[aibi-dismiss="confirm"]';
  var content = 'aibi-content';
  $(document).on("click", dismiss ,function(event){
	  $("#confirm"+random(8)).confirm({
			content:$(this).attr(content),
			 callback:function(obj){//确定按钮回调函数
				 console.log(obj);
			 }
		});
  });
  
}(jQuery);

/* ========================================================================
 * jQuery-own: tabs.js v1.0
 * ========================================================================
 * Copyright 2014-2017 asiainfo, Inc. 
 * author wangsen
 * ======================================================================== */


+function ($) {
  'use strict';

  // tabs 加载
  // ======================

  var dismiss = '[aibi-dismiss="tabBar"]';
  $(function(){
	   
  });
  
}(jQuery);





function random(len, radix) { 
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); 
    var chars = CHARS, uuid = [], i; 
    radix = radix || chars.length; 
    if (len) { 
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix]; 
    } else { 
      var r; 
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'; 
      uuid[14] = '4'; 
      for (i = 0; i < 36; i++) { 
        if (!uuid[i]) { 
          r = 0 | Math.random()*16; 
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]; 
        } 
      } 
    } 
    return uuid.join(''); 
  }; 