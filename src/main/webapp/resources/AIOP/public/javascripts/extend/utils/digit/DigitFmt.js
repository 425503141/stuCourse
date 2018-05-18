/**
 * ------------------------------------------------------------------
 * 日期模版对象方法描述总计：
 *   model.ScaleConvert  进制转换
 * 	 model.Formate       格式化数字 
 *   model.FmtMoney      把数字转换成货币的格式        
 * ------------------------------------------------------------------
 */
var DigitFmt = (function (model){

        //开发版本号
        model.version = "1.0.0";
        model.author  = "xiaoyx";
        model.email   = "xiaoyx@asiainfo.com";
		/**
		 * 进制转换
         * @param  [number] [要格式化的数字] 
         * @param  [scale] [转换的进制的参数 2 8 10 16] 
		 * ------------------------------------------------------------------
		 */ 
		model.ScaleConvert = function(number , scale ){

              number = parseInt(number , 10);
              scale  = parseInt(scale,10);

              return number.toString(scale);
		}

        /**
         *
         *  @description  格式化数字
         *  @param  [num] [要格式化的数字]
         *  @param  [precision] [保留小数点位数]
         *  @param  [separator] [数字之间分割符号]
         *  Formate(10000)="10,000"
         *  Formate(10000, 2)="10,000.00"
         *  Formate(10000.123456, 2)="10,000.12"
         *  Formate(10000.123456, 2, ' ')="10 000.12"
         *  Formate(.123456, 2, ' ')="0.12"
         *  Formate(56., 2, ' ')="56.00"
         *  Formate(56., 0, ' ')="56"
         *  Formate('56.')="56"
         *  Formate('56.a')=NaN
         * ------------------------------------------------------------------
         */
        model.Formate = function (num, precision, separator) {
            var parts;
            // 判断是否为数字
            if (!isNaN(parseFloat(num)) && isFinite(num)) {
                // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
                // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
                // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
                // 的值变成了 12312312.123456713
                num = Number(num);
                // 处理小数点位数 :toFixed() 方法可把 Number 四舍五入为指定小数位数的数字。
                num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
                // 分离数字的小数部分和整数部分
                parts = num.split('.');
                // 整数部分加[separator]分隔, 借用一个著名的正则表达式
                parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));

                return parts.join('.');
            }
            return NaN;
        }

        /**
         *
         *  @description  把数字转换成货币的格式
         *  @param  [number] [要格式化的数字]
         *  @param  [places] [保留小数点位数]
         *  @param  [symbol] [金钱的标识符"$、￥"]
         *  @param  [thousand] [千分位分割符]
         *  @param  [decimal] [小数点分割符]
         *  FmtMoney(54321) = $54,321 
         *  FmtMoney(12345, 0, "£ ") = £ 12,345
         * ------------------------------------------------------------------
         */
        model.FmtMoney = function (number, places, symbol, thousand, decimal) {
            number = number || 0;
            places = !isNaN(places = Math.abs(places)) ? places : 2;
            symbol = symbol !== undefined ? symbol : "$";
            thousand = thousand || ",";
            decimal = decimal || ".";
            var negative = number < 0 ? "-" : "",
                i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
                j = (j = i.length) > 3 ? j % 3 : 0;

            return symbol + negative + (j ? i.substr(0, j) + thousand : "") 
                          + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) 
                          + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
        }

        /**
         *
         *  @description  数字转换为整数
         *  @param  [number ,string] [要格式化的数字]
         * ------------------------------------------------------------------
         */
        model.toInt = function (number) {

            
           
            return Infinity === number ? 0 : (number*1 || 0).toFixed(0)*1;
        }


       return model;


   })(window.DigitFmt || {});