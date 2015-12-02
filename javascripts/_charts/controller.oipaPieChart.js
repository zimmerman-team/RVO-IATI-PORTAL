(function () {
  'use strict';

  angular
    .module('oipa.charts')
    .controller('OipaPieChartController', OipaPieChartController);

  OipaPieChartController.$inject = ['$scope', 'Aggregations','$filter','templateBaseUrl'];

  /**
  * @namespace ActivitiesController
  */
  function OipaPieChartController($scope, Aggregations, $filter,templateBaseUrl) {
    
    var vm = this;
    vm.templateBaseUrl = templateBaseUrl;
    vm.chartLoaded = '';
    vm.groupBy = $scope.groupBy;
    vm.aggregations = $scope.aggregations;
    vm.aggregationKey = $scope.aggregationKey;
    console.log(vm.aggregations);
    vm.aggregationFilters = $scope.aggregationFilters;
    vm.hasToContain = $scope.hasToContain;
    vm.xAxis = $scope.chartXAxis;
    vm.yAxis = $scope.chartYAxis;
    vm.chartData = [];
    vm.chartOptions = {
      chart: {
        type: 'pieChart',
        height: 250,
        margin : {
            top: -20,
            right: 0,
            bottom: -10,
            left: 0
        },
        x: function(d){ return d[0]; },
        y: function(d){ return d[1]; },
        color: d3.scale.category10().range(),
        transitionDuration: 200,
        useInteractiveGuideline: false,
        clipVoronoi: false,
        showControls: false,
        showLabels: false,
        duration: 500,
        labelTreshhold: 0.01,
        donut: true,
        donutRatio: 0.5,
        padding: 0,
        showLegend: false,
        growOnHover: false,
        noData: '',
        tooltip: {
          contentGenerator: function(key, date, e, graph){
            var name = key.data[0][vm.groupBy].name;

            var content = '<h4><span class="flag-icon flag-icon-"></span>'+name+'</h4>'+
                          '<hr>'+
                          '<p><i class="icon lightbulb"></i><b>Projects:</b>'+key.data[0].count+'</p>'+
                          '<p><i class="icon euro"></i><b>Total budget:</b>'+ $filter('shortcurrency')(key.data[0].incoming_fund,'€') +'</p>';
            return content;
          }
        },
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
        },
      },
    };

    vm.loadData = function(){
      Aggregations.aggregation(vm.groupBy, vm.aggregations, vm.aggregationFilters).then(succesFn, errorFn);

      function succesFn(data, status, headers, config){
        vm.chartData = vm.reformatData(data.data.results);
        vm.chartLoaded = true;
      }

      function errorFn(data, status, headers, config){
        console.warn('error getting data for controller.stackedBarChart');
      }
    }

    function activate() {
      
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

      if(vm.groupBy == 'sector'){

        var newData = [];

        var sectors = {
          "11": "Education",
          "12": "Health",
          "13": "Population policies / programmes and reproductive health",
          "14": "Water and sanitation",
          "15": "Government and civil society",
          "16": "Other social infrastructure and services",
          "21": "Transport and storage",
          "22": "communication",
          "23": "Energy generation and supply",
          "24": "Banking and financial services",
          "25": "business and other services",
          "31": "Agriculture / forestry / fishing",
          "32": "industry / mineral resources / construction",
          "33": "trade related / tourism",
          "41": "General environmental protection",
          "43": "Other multisector",
          "51": "General budget support",
          "52": "Developmental food aid/Food security assistance",
          "53": "Other commodity assistance",
          "60": "Action relating to debt",
          "72": "Emergency Response",
          "73": "Reconstruction relief and rehabilitation",
          "74": "Disaster prevention and preparedness",
          "91": "Administrative costs of donors",
          "92": "Support to Non- governmental organisations",
          "93": "Refugees in donor countries",
          "99": "Unallocated / Unspecified",
        }

        var filledSectors = {};

        for(var i = 0;i < data.length;i++){
          var dac2 = data[i].sector.code.substring(0,2);
          if(filledSectors[dac2] == undefined){
            filledSectors[dac2] = {};
            filledSectors[dac2].sector = {'code':dac2,  'name': sectors[dac2] };
            filledSectors[dac2]['incoming_fund'] = data[i]['incoming_fund'];
            filledSectors[dac2]['count'] = data[i]['count'];
          } else {
            filledSectors[dac2]['incoming_fund'] += data[i]['incoming_fund'];
            filledSectors[dac2]['count'] += data[i]['count'];
          }
        }

        data = [];
        for(var code in filledSectors){
          data.push(filledSectors[code]);
        }
      }

      if(vm.groupBy == 'related_activity'){
        for (var i = 0; i < data.length;i++){
          data[i][vm.groupBy] = {'name': data[i]['activity_id']}
        }
      }

      for (var i = 0; i < data.length;i++){
        values.push([data[i], data[i][vm.aggregationKey]]);
      }

      return values;
    }

  }
})();