function makesvg(percentage, inner_text,word){
  var inner_text = "";
  var abs_percentage = Math.abs(percentage).toString();
  var percentage_str = percentage.toString();
  var word = '运行成功率';
  var classes = ""

  if(percentage <= 50){
    classes = "danger-stroke circle-chart__circle--negative";
  } else if(percentage > 50 && percentage <= 80){
    classes = "warning-stroke";
  } else{
    classes = "success-stroke";
  }

 var svg = '<svg class="circle-chart" viewbox="0 0 33.83098862 33.83098862" xmlns="http://www.w3.org/2000/svg">'
     + '<circle class="circle-chart__background" cx="18" cy="16" r="12" />'
     + '<circle class="circle-chart__circle '+classes+'"'
     + 'stroke-dasharray="'+ abs_percentage+',100" cx="18" cy="16" r="12" />'
     + '<g class="circle-chart__info">'
     + '   <text class="circle-chart__percent" x="18" y="12">'+percentage_str+'%</text>'
     + '   <text class="circle-chart__percent" x="18" y="15">'+word+'</text>';
  if(inner_text){
    svg += '<text class="circle-chart__subline" x="16.91549431" y="22">'+inner_text+'</text>'
  }

  svg += ' </g></svg>';

  return svg
}

(function( $ ) {

    $.fn.circlechart = function() {
        this.each(function() {
            var percentage = $(this).data("percentage");
            var inner_text = $(this).text();
            $(this).html(makesvg(percentage, inner_text));
        });
        return this;
    };

}( jQuery ));