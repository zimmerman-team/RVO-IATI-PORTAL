(function () {
  'use strict';

  angular
    .module('oipa.charts')
    .controller('FinancialsLinechartController', FinancialsLinechartController);

  FinancialsLinechartController.$inject = ['$scope', 'TransactionAggregations', 'FilterSelection', '$filter'];


  function FinancialsLinechartController($scope, TransactionAggregations, FilterSelection, $filter) {
    var vm = this;
    vm.filterSelection = FilterSelection;
    var loadedCount = 0;
    var hasToContain = '';
    vm.transactionData = [];
    vm.transactionChartOptions = {
      chart: {
        type: 'multiBarChart',
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
                return d3.format('r')(d);
                // return d3.time.format('%Y-%m-%d')(new Date(d))
            },
            showMaxMin: false,
            staggerLabels: true
        },
        yAxis: {
            axisLabel: '',
            tickFormat: function(d){
              return $filter('shortcurrency')(d,'€');
            },
            axisLabelDistance: 20
        }
      }
    };

    activate();

    function activate() {

        if($scope.hasToContain != undefined) vm.hasToContain = $scope.hasToContain; 

        $scope.$watch('vm.filterSelection.selectionString', function (selectionString) {
            vm.update(selectionString);
        }, true);
    }

    vm.update = function(selectionString){

      if (selectionString.indexOf(vm.hasToContain) < 0){ return false;}

      function errorFn(data, status, headers, config){
        console.log(data);
      }

      TransactionAggregations.aggregation('transaction_date_year', 'disbursement,incoming_fund,expenditure', selectionString, 'transaction_date_year').then(function(data, status, headers, config){
        vm.data_by_year = data.data.results;
        vm.reformatTransactionData();
      }, errorFn);
    }

    vm.reformatTransactionData = function(){

      var data = [
          {
              values: [],      //values - represents the array of {x,y} data points
              key: 'Budget', 
              color: '#2077B4'  
          },
          { 
              values: [],
              key: 'Expenditure',
              color: '#FF7F0E'
          },
      ];
      var values = [];
      for (var i = 0;i < vm.data_by_year.length;i++){
        data[0].values.push([
          vm.data_by_year[i].transaction_date_year, 
          vm.data_by_year[i].incoming_fund])

        data[1].values.push([
          vm.data_by_year[i].transaction_date_year, 
          (vm.data_by_year[i].disbursement + vm.data_by_year[i].expenditure)])
      }
      
      vm.transactionData = data;
    }
  }
})();