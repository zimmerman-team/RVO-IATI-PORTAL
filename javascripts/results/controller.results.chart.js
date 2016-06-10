(function () {
  'use strict';

  angular
    .module('oipa.charts')
    .controller('ResultsChartController', ResultsChartController);

  ResultsChartController.$inject = ['$scope', 'Aggregations', 'FilterSelection', '$filter'];


  function ResultsChartController($scope, Aggregations, FilterSelection, $filter) {
    var vm = this;
    vm.filterSelection = FilterSelection;
    var loadedCount = 0;
    var hasToContain = '';
    vm.transactionData = [];
    vm.indicators = $scope.indicators;
    vm.selectedIndicators = $scope.selectedIndicators;
    vm.transactionChartOptions = {
      chart: {
        type: 'multiBarChart',
        stacked: true,
        height: 350,
        margin : {
            top: 20,
            right: 20,
            bottom: 60,
            left: 60
        },
        x: function(d){ return d[0]; },
        y: function(d){ return d[1].actual; },
        color: d3.scale.category10().range(),
        transitionDuration: 300,
        // useInteractiveGuideline: true,
        // clipVoronoi: false,
        // interpolate: 'step',
        showControls: false,
        xAxis: {
            axisLabel: '',
            tickFormat: function(d) {
            	return d;
            },
            showMaxMin: false,
            staggerLabels: true
        },
        yAxis: {
            axisLabel: '',
            tickFormat: function(d){
            	return d;
            },
            axisLabelDistance: 20,
            ticks: 8
        },
        // yDomain: [0, 110]
      }
    };

    function activate() {

        if($scope.hasToContain != undefined) vm.hasToContain = $scope.hasToContain; 

        $scope.$watch('indicators', function(indicators){
          vm.indicators = indicators;
          vm.update();
        }, true);

        $scope.$watch('selectedIndicators', function(selectedIndicators){
          vm.selectedIndicators = selectedIndicators;
          vm.update();
        }, true);
    }

    vm.update = function(){
      var values = [];

      for(var i = 0; i < vm.selectedIndicators.length;i++){
        values.push([vm.selectedIndicators[i], vm.indicators[vm.selectedIndicators[i]]]);
      }

      var data = [{ values: values, color: '#6296c7'},];

      $scope.data = data;
    }

    activate();
  }
})();