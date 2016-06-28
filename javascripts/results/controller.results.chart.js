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
        x: function(d){ return d.chart_name; },
        y: function(d){ return d.actual; },
        color: d3.scale.category10().range(),
        transitionDuration: 300,
        showControls: false,
        xAxis: {
            axisLabel: '',
            tickFormat: function(d) {
            	return d;
            },
            showMaxMin: false,
            staggerLabels: false
        },
        yAxis: {
            axisLabel: '',
            tickFormat: function(d){
            	return d;
            },
            axisLabelDistance: 20,
            ticks: 4
        },
        
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

    vm.roundMax = function(maxValue){

      var roundBy = 1;
      if(maxValue > 10000000){
        roundBy = 1000000;
      } else if(maxValue > 1000000){
        roundBy = 200000;
      } else if(maxValue > 100000){
        roundBy = 10000;
      } else if(maxValue > 20000){
        roundBy = 5000;
      } else if(maxValue > 10000){
        roundBy = 2000;
      } else if(maxValue > 5000){
        roundBy = 1000;
      }else if(maxValue > 2000){
        roundBy = 500;
      } else if(maxValue > 1000){
        roundBy = 200;
      } else if(maxValue > 100){
        roundBy = 100;
      } else if(maxValue > 10){
        roundBy = 10;
      }

      var roundMax = Math.ceil(maxValue / roundBy) * roundBy;
      return roundMax;
    }

    vm.update = function(){
      // use level 2 as category
      // use parent category for level 3 colors

      var values = [];
      var colors = ['#6296c7', '#aac76d', '#c86361', '#c7c26d']
      var categories = {};
      var valueNames = [];
      var actuals = [];

      for(var i = 0; i < vm.selectedIndicators.length;i++){
        if(vm.indicators[vm.selectedIndicators[i]].actual > 0 && vm.indicators[vm.selectedIndicators[i]].level == 2){
          categories[vm.indicators[vm.selectedIndicators[i]].chart_group] = {'name': vm.indicators[vm.selectedIndicators[i]].chart_group, values: []}
        }
      }

      for(var i = 0; i < vm.selectedIndicators.length;i++){
        if(vm.indicators[vm.selectedIndicators[i]].actual > 0 && vm.indicators[vm.selectedIndicators[i]].level > 1){
          valueNames.push(vm.indicators[vm.selectedIndicators[i]].chart_name);
          actuals.push(vm.indicators[vm.selectedIndicators[i]].actual);
          categories[vm.indicators[vm.selectedIndicators[i]].chart_group].values.push(vm.indicators[vm.selectedIndicators[i]]);
        }
      }

      valueNames = _.uniq(valueNames);

      _.each(categories, function(category){
        var setValueNames = _.map(category.values, function(value){
          return value.chart_name;
        });

        _.each(valueNames, function(value_name){
          if(setValueNames.indexOf(value_name) == -1){
            category.values.push({'actual': 0, 'chart_name': value_name});
          }
        });
      });

      var data = [];
      var color_count = 0;

      _.each(categories, function(category){
        data.push({key: category.name, values: category.values, color: colors[color_count]});
        color_count++;
      });

      // calculate max y row
      var yRows = {};

      if(_.size(categories)){
        _.each(categories, function(category){
          _.each(category.values, function(value){
            yRows[value.chart_name] = []
          });
        });

        _.each(categories, function(category){
          _.each(category.values, function(value){
            yRows[value.chart_name].push(value.actual);
          });
        });
      }

      var maxValue = _.max(_.map(yRows, function(row){
          var rowValue = _.reduce(row, function(memo, num){ return memo + num; }, 0);
          return rowValue;
        })
      );

      // create dummy bars to prevent too wide bars
      if(data.length > 0){
        var cur_length = data[0].values.length;

        _.each([0,1,2,3], function(num){

          if(cur_length > num){
            return false;
          }

          for(var i = 0; i < data.length;i++){
            data[i].values.push({'actual': 0, 'activity_count': 0, chart_name: ''});
          }
        });
      }

      if(actuals.length){
        var roundedMax = vm.roundMax(maxValue);
        vm.transactionChartOptions.chart.yDomain = [0, roundedMax]
        $scope.data = data;
      } else {
        $scope.data = [];
      }
    }

    activate();
  }
})();