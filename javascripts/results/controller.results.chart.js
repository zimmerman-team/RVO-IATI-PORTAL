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
    vm.transactionChartOptions = {
      chart: {
        type: 'multiBarChart',
        stacked: true,
        height: 450,
        margin : {
            top: 20,
            right: 0,
            bottom: 60,
            left: 75
        },
        x: function(d){ return d[0]; },
        y: function(d){ return d[1]; },
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
            ticks: 10
        },
        yDomain: [0, 110]
      }
    };



    

    function activate() {

        if($scope.hasToContain != undefined) vm.hasToContain = $scope.hasToContain; 

        $scope.$watch('vm.filterSelection.selectionString', function (selectionString) {
            vm.update(selectionString);
        }, true);

        vm.reformatTransactionData();
    }

    vm.update = function(selectionString){

      // if (selectionString.indexOf(vm.hasToContain) < 0){ return false;}

      // function errorFn(data, status, headers, config){
      //   console.log(data);
      // }

      // Aggregations.aggregation('transaction_date_year', 'disbursement,incoming_fund,expenditure', selectionString, 'year').then(function(data, status, headers, config){
      //   vm.data_by_year = data.data.results;
      //   vm.reformatTransactionData();
      // }, errorFn);
    }

    vm.reformatTransactionData = function(){

      // var data = [
      //     {
      //         values: [],      //values - represents the array of {x,y} data points
      //         key: 'Budget', 
      //         color: '#2077B4'  
      //     },
      //     {
      //         values: [],
      //         key: 'Expenditure',
      //         color: '#FF7F0E'
      //     },
      // ];
      // var values = [];
      // for (var i = 0;i < vm.data_by_year.length;i++){
      //   data[0].values.push([
      //     vm.data_by_year[i].year, 
      //     vm.data_by_year[i].incoming_fund])

      //   data[1].values.push([
      //     vm.data_by_year[i].year, 
      //     (vm.data_by_year[i].disbursement + vm.data_by_year[i].expenditure)])
      // }

      var data = [        
          {
              values: [
              	['Total', 10],
              	['Local female entrepreneurs', 30],
              	['Local young entrepreneurs', 20],
              	['Local entrepreneurs from fragile states', 12]
              ],      //values - represents the array of {x,y} data points
              key: 'Dutch companies', 
              color: '#6296c7'
          },
          {
              values: [
              	['Total', 10],
              	['Local female entrepreneurs', 0],
              	['Local young entrepreneurs', 0],
              	['Local entrepreneurs from fragile states', 0]
              ],      //values - represents the array of {x,y} data points
              key: 'Local companies', 
              color: '#cc6761'
          },
          {
              values: [
              	['Total', 80],
              	['Local female entrepreneurs', 0],
              	['Local young entrepreneurs', 0],
              	['Local entrepreneurs from fragile states', 0]
              ],      //values - represents the array of {x,y} data points
              key: 'Other', 
              color: '#abc371'  
          },
      ];
      // console.log(d3.max(data, function(x) { 
      // 	var total = 0;
      // 	for (var i = 0;i < x.values.length;i++){
      // 		total += x.values[i][1];
      // 	}
      //  return total; } ))
      // vm.transactionChartOptions.chart.yDomain = [0, d3.max(data, function(x) { return x.N; } )]
      $scope.data = data;

      // vm.transactionChartOptions.chart.yDomain[1] += 10;

      // setTimeout(function(){ $scope.api.update(); }, 10000);
      
    }

    activate();
  }
})();