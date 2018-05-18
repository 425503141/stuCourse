/**
 * ------------------------------------------------------------------
 * js操作url(window.location)对象
 *   model.GetLocation       获取URL地址
 *   model.QueryString       查找当前url中name对应value值
 *   model.Stringify         将obj对象转换为String
 *   model.ParseQuery        解析url参数
 *   model.UpdateSearchParam 增加、修改、删除 url中的参数
 *   model.GetAgreement      获取URL协议
 *   model.GetHost           获取URL主机
 *   model.GetPath           获取URL地址
 *   model.GetPost           获取URL端口
 *   model.GetHash           获取URL锚点
 * ------------------------------------------------------------------
 */
var UrlFmt = (function (model){

        //开发版本号
        model.version = "1.0.0";
        model.author  = "xiaoyx";
        model.email   = "xiaoyx@asiainfo.com";
        /**
         * @description 获取当前页面的URL地址，但不包括域名
         *
         * @return {String} 当前页面url 地址
         * ------------------------------------------------------------------
         */
        model.GetLocation = function () {
            return window.location.pathname + window.location.search + window.location.hash;
        }

        /**
         * @description 查找当前url中name对应value值
         * 
         * @param {String}  name url中参数名称
         * @param {Boolean} notDecoded 是否将获取的参数值进行转码
         * @return {String} name参数对应的 value
         * ------------------------------------------------------------------
         */
        model.QueryString = function(name, notDecoded) {

            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
            var results = regex.exec(location.search);
            var encoded = null;

            if (results === null) {
                return "";
            } else {
                encoded = results[1].replace(/\+/g, " ");
                if (notDecoded) {
                    return encoded;
                }
                return decodeURIComponent(decodeURIComponent(encoded));
            }
        }
        /**
         * @description  将obj对象转换为String 
         * 
         * @param {Object} queryObj 必须是单一的对象.
         * @return {String} 单一的字符串方式.
         */
        model.Stringify = function (queryObj) {

            if (!queryObj || queryObj.constructor !== Object) {
                throw new Error("Query object should be an object.");
            }

            var stringified = "";
            Object.keys(queryObj).forEach(function(c) {
                stringified += c + "=" + encodeURIComponent(queryObj[c]) + "&";
            });

            stringified = stringified.replace(/\&$/g, "");
            return stringified;
        }
        /**
         * 
         * @description 解析url参数
         *
         * @name parseQuery
         * @function
         * @param {String} search An optional string that should be parsed (default: `window.location.search`).
         * @return {Object} 返回当前地址的{"key":value} 对象
         */
        model.ParseQuery = function(search) {
            var query = {};

            if (typeof search !== "string") {
                //不传递参数怎么获取当前的地址
                search = window.location.search;
            }

            search = search.replace(/^\?/g, "");

            if (!search) {
                return {};
            }

            var a = search.split("&");
            var b = null;
            var i = 0;
            var iequ;
            for (; i < a.length; ++i) {
                iequ = a[i].indexOf("=");
                if (iequ < 0) iequ = a[i].length;
                query[decodeURIComponent(a[i].slice(0, iequ))] = decodeURIComponent(a[i].slice(iequ+1));
            }

           return query;
        }

        /**
         * @description  增加、修改、删除 url中的参数
         *
         * @name updateSearchParam
         * @function
         * @param {String} param 参数 name.
         * @param {String|undefined} value 参数值，如果不传递则判断为删除参数
         * @return {Url} 返回操作后的完整的URL.
         */
        
        model.UpdateSearchParam = function (param, value) {

                var searchParsed = this.ParseQuery();

                // Delete the parameter
                if (value === undefined) {
                    delete searchParsed[param];
                } else {
                    // Update or add
                    value = encodeURIComponent(value); //中文转码
                    if (searchParsed[param] === value) { //如果参数值没有变动怎么不做处理
                        return;
                    }
                    searchParsed[param] = value; 
                }

                var newSearch = "?" + this.Stringify(searchParsed);
                window.history.replaceState(null, "", newSearch + location.hash);

                //return Url;
        }
     
        /**
         * @description  url 通信协议
         *
         * @return {String} 协议字符串
         */
        
        model.GetAgreement = function () {
            console.log(window.location);
            return window.location.protocol;
        }

        /**
         * @description  服务器(计算机)域名系统 (DNS) 主机名或 IP 地址
         *
         * @return {String} 协议字符串
         */
        
        model.GetHost= function () {
            return window.location.host;
        }
        /**
         * @description  服务器(计算机)域名系统 (DNS) 主机名或 IP 地址
         *
         * @return {String} 协议字符串
         */
        
        model.GetPath= function () {
            return window.location.pathname;
        }
        /**
         * @description  服务器(计算机)域名系统 (DNS) 主机名或 IP 地址
         *
         * @return {String} 协议字符串
         */
        
        model.GetPort= function () {
            return window.location.port;
        }     

        /**
         * @description  锚点
         *
         * @return {String} "#love"
         */
        
        model.GetHash= function () {
            return window.location.hash;
        }
   

        return model;

   })(window.UrlFmt || {});