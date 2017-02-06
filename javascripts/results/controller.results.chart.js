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
            left: 70
        },
        x: function(d){ return d.chart_name; },
        y: function(d){ return d.actual; },
        transitionDuration: 300,
        showControls: false,
        showLegend: true, 
        xAxis: {
            axisLabel: '',
            tickFormat: function(d) {
            	return d;
            },
            showMaxMin: false,
            staggerLabels: false,
            width: 0.1
        },
        yAxis: {
            axisLabel: '',
            tickFormat: function(d){
            	return $filter('thousandsSeparator')(d);
            },
            axisLabelDistance: 20,
            ticks: 4
        },
        multibar: {
            xRange: [0,160]
        },
        tooltip: {
          contentGenerator: function(key, date, e, graph){
            var valuePrefix = (key.data.parent == "Amount of generated co-investment in EUR") ? '€': '';
            var sub = key.data.key.split(' - ')[1]
            var content = '<h4>'+key.data.chart_group+' - '+sub+'</h4>'+
                          '<hr>'+
                          '<p><b>Projects: </b>'+key.data.activity_count+'</p>'+
                          '<p><b>Value:</b> '+valuePrefix + $filter('thousandsSeparator')(Math.round(key.data.actual)) +'</p>';
            return content;
          }
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
      var subColors = ['#4177AC', '#26619A', '#8CB6DF']
      var categories = {};
      var valueNames = [];
      var actuals = [];
      var categoryNames = [];

      var color_count = 0;
      var sub_color_count = 0;
      for(var i = 0; i < vm.selectedIndicators.length;i++){

        var level = vm.indicators[vm.selectedIndicators[i]].level;
        var actual = vm.indicators[vm.selectedIndicators[i]].actual;

        if(actual > 0 && level > 1){

          var value = vm.indicators[vm.selectedIndicators[i]];
          value.chart_name = 'Total'

          var color = colors[color_count]
          if(level == 3){
            color = subColors[sub_color_count]
            sub_color_count++
          } else {
            color_count++
          }
          
          // TODO: remove level 2 indicator if exists
          if(vm.selectedIndicators[i] == 'Number of full-time (equivalent) direct jobs supported - Total'){
            value.actual = 1;
          }
          categories[vm.selectedIndicators[i]] =  {key: vm.selectedIndicators[i], values: [value], color: color}

          valueNames.push('Total');
          actuals.push(actual);
        }
      }

      var data = [];
      _.each(categories, function(category){
        data.push(category);
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

      var maxValue = 0
      _.each(yRows, function(row){
        var rowValue = _.reduce(row, function(memo, num){ return memo + num; }, 0);
        maxValue += rowValue
      });

      // create dummy bars to prevent too wide bars
      // if(data.length > 0){
      //   var valuesToBeAdded = 3 - data[0].values.length;

      //   var chart_name = '';
      //   for(var i = 0; i < data.length;i++){
      //     chart_name = '';
      //     for (var y = 0; y < valuesToBeAdded;y++){
      //       chart_name += ' ';
      //       data[i].values.push({'actual': 0, 'activity_count': 0, chart_name: chart_name});
      //     }
      //   }
      // }

      if(actuals.length){
        var roundedMax = vm.roundMax(maxValue);
        vm.transactionChartOptions.chart.yDomain = [0, roundedMax]
        $scope.data = data;
        $scope.api.refresh();
      } else {
        $scope.data = []
      }
    }

    activate();
  }
})();