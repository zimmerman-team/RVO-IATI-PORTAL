(function () {
  'use strict';

  angular
    .module('oipa.charts')
    .controller('OipaPieChartController', OipaPieChartController);

  OipaPieChartController.$inject = ['$scope', 'FilterSelection', 'TransactionAggregations','$filter','templateBaseUrl', 'programmesMapping', '$state'];

  /**
  * @namespace ActivitiesController
  */
  function OipaPieChartController($scope, FilterSelection, TransactionAggregations, $filter,templateBaseUrl, programmesMapping, $state) {
    
    var vm = this;
    vm.templateBaseUrl = templateBaseUrl;
    vm.chartLoaded = '';
    vm.groupBy = $scope.groupBy;
    vm.filterSelection = FilterSelection;
    vm.aggregations = $scope.aggregations;
    vm.aggregationKey = $scope.aggregationKey;
    vm.hasToContain = $scope.hasToContain;
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
        pie: {
          dispatch: {
            elementClick: function(e){
              var item = e.data[0];
              if(item.recipient_country != undefined){
                $state.go('country', { country_id: item.recipient_country.code, tab: 'summary' });
              } else if(item.sector != undefined){
                $state.go('sector', { sector_id: item.sector.code, tab: 'summary' });
              } else if(item.related_activity != undefined){
                $state.go('programme', { programme_id: item.related_activity.code, tab: 'summary' });
              } else if(item.recipient_region != undefined){
                $state.go('region', { region_id: item.recipient_region.code, tab: 'summary' });
              }
            }
          }
        },
        tooltip: {
          contentGenerator: function(key, date, e, graph){
            var name = key.data[0][vm.groupBy].name;
            var flag = '';
            if (vm.groupBy == 'recipient_country'){
              flag = '<span class="flag-icon flag-icon-'+key.data[0][vm.groupBy].code.toLowerCase()+'"></span> ';
            }
            var content = '<h4>'+flag+name+'</h4>'+
                          '<hr>'+
                          '<p><i class="icon lightbulb"></i><b>Projects:</b>'+key.data[0].activity_count+'</p>'+
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

    vm.loadData = function(filterString){

      TransactionAggregations.aggregation(vm.groupBy, vm.aggregations, filterString + '&hierarchy=2').then(succesFn, errorFn);

      function succesFn(data, status, headers, config){
        vm.chartData = vm.reformatData(data.data.results);
        vm.chartLoaded = true;
      }

      function errorFn(data, status, headers, config){
        console.warn('error getting data for controller.stackedBarChart');
      }
    }

    function activate() {

      $scope.$watch("vm.filterSelection.selectionString", function (selectionString, oldString) {
        if (vm.hasToContain != undefined && selectionString.indexOf(vm.hasToContain) < 0){
          return false;
        }

        vm.loadData(selectionString);
        
      }, true);
    }

    activate();

    vm.reformatData = function(data){
      var values = [];

      if(vm.groupBy == 'related_activity'){
        for (var i = 0; i < data.length;i++){
          data[i][vm.groupBy] = {'code': data[i]['related_activity'], 'name': programmesMapping[data[i]['related_activity']] }
        }
      }

      for (var i = 0; i < data.length;i++){
        values.push([data[i], data[i][vm.aggregationKey]]);
      }

      return values;
    }

  }
})();
