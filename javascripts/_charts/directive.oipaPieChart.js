(function () {
  'use strict';

  angular
    .module('oipa.charts')
    .directive('oipaPieChart', oipaPieChart);

  oipaPieChart.$inject = ['templateBaseUrl','$http'];

  function oipaPieChart(templateBaseUrl) {

    var directive = {
      controller: 'OipaPieChartController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        aggregationFilters: '=',
        hasToContain: '@',
        groupBy: '@',
        groupById: '=',
        aggregations: '@',
        groupByName: '@',
        aggregationKey: '@',
        aggregationKeyId: '@',
        chartXAxis: '@',
        chartYAxis: '@',
        chartType: '@',
        chartYAxisLabelDistance: '@',
        mapping: '@',
        colorRange: '@',
        leftMargin: '@',
        chartYAxisEuroFormat: '@',
        chartXAxisEuroFormat: '@',
        chartXAxisStaggerLabels: '@',
      },
      templateUrl: templateBaseUrl + '/templates/_charts/oipa-pie-chart.html'
    };

    return directive;
  }
})();