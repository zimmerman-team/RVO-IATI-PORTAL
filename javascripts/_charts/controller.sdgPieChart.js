(function () {
  'use strict';

  angular
    .module('oipa.charts')
    .controller('SdgPieChartController', SdgPieChartController);

  SdgPieChartController.$inject = ['$scope', '$filter', 'sdgTargetTitles'];

  function SdgPieChartController($scope, $filter, sdgTargetTitles) {
    var vm = this;
   
    vm.sdgTargetTitles = sdgTargetTitles;

    vm.sdgFilter = function(input, curSymbol) {
      var curSymbol = curSymbol || "$";
      var out = '';
      var minus = input < 0;
      var addDot = false;
      input = Math.abs(input);

      if(input > 999999999){
        out = (input / 1000000000).toFixed(2) + ' mld';
      } else if(input > 999999){
        out = (input / 1000000).toFixed(2) + ' mln';
      } else if(input > 1000){
        input = input.toFixed(0);
        addDot = true;
      }else {
        out = input.toFixed(0); 
      }
      // openaid -> comma's
      out = out.replace('.', ',');

      if(addDot == true){
        input = input.toString();
        out = input.substring(0, (input.length - 3)) + '.' + input.substring((input.length - 3), input.length);
      }

      if(minus){
        return "-" + curSymbol + out;
      } else{
        return curSymbol + out;
      }

    };

    vm.sdgTooltip = function(key, date, e, graph){
      var name = key.data[0]['sector'].code + '. ' + vm.sdgTargetTitles[key.data[0]['sector'].code];

      var content = '<div class="sdg-title">'+name+'</div>'+
                    '<hr>'+
                    '<p><i class="icon lightbulb"></i><b>Projects:</b>'+key.data[0].activity_count+'</p>'+
                    '<p><i class="icon euro"></i><b>Total budget:</b>'+ vm.sdgFilter(key.data[0].incoming_fund,'€') +'</p>';
      return content;
    }
  }
})();
