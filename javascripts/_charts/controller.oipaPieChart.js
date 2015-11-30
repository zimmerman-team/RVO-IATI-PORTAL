(function () {
  'use strict';

  angular
    .module('oipa.charts')
    .controller('OipaPieChartController', OipaPieChartController);

  OipaPieChartController.$inject = ['$scope', 'Aggregations'];

  /**
  * @namespace ActivitiesController
  */
  function OipaPieChartController($scope, Aggregations) {
    
    var vm = this;
    vm.groupBy = $scope.groupBy;
    vm.aggregationKey = $scope.aggregationKey;
    vm.aggregationFilters = $scope.aggregationFilters;
    vm.hasToContain = $scope.hasToContain;
    vm.xAxis = $scope.chartXAxis;
    vm.yAxis = $scope.chartYAxis;
    vm.chartData = [];
    vm.chartOptions = {
      chart: {
        type: 'pieChart',
        height: 300,
        margin : {
            top: -45,
            right: 0,
            bottom: -30,
            left: 0
        },
        x: function(d){ return d[0]; },
        y: function(d){ return d[1]; },
        color: d3.scale.category10().range(),
        transitionDuration: 300,
        useInteractiveGuideline: true,
        clipVoronoi: false,
        showControls: false,
        showLabels: false,
        duration: 500,
        labelTreshhold: 0.01,
        labelSunbeamLayout: true,
        donut: true,
        donutRatio: 0.35,
        padding: 0,
        showLegend: false,
        growOnHover: false,
        xAxis: {
            axisLabel: vm.xAxis,
            tickFormat: function(d) {
                return d3.format("")(d);
            },
            showMaxMin: false
        },
        yAxis: {
            axisLabel: vm.yAxis,
            tickFormat: function(d){
                return d3.format(",.0f")(d);
            },
            showMaxMin: false,
        }
      }
    };


    vm.loadData = function(){
      Aggregations.aggregation(vm.groupBy, vm.aggregationKey, vm.aggregationFilters).then(succesFn, errorFn);

      function succesFn(data, status, headers, config){
        vm.chartData = vm.reformatData(data.data.results);
      }

      function errorFn(data, status, headers, config){
        console.warn('error getting data for controller.stackedBarChart');
      }
    }

    function activate() {
      console.log('TO DO: per program pie chart');
      
      $scope.$watch('aggregationFilters', function (aggregationFilters) {

        if(vm.hasToContain != undefined){
          if(aggregationFilters.indexOf(vm.hasToContain) < 0){
            return false;
          }
        }
        vm.groupBy = $scope.groupBy;
        vm.groupById = $scope.groupById;
        vm.aggregationFilters = aggregationFilters;
        vm.loadData();
      }, true);
    }
    activate();

 

    vm.reformatData = function(data){
      var values = [];

      for (var i = 0; i < data.length;i++){
        values.push([data[i][vm.groupBy].name, data[i][vm.aggregationKey]]);
      }

      return values;
    }

  }
})();