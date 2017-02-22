(function () {
  'use strict';

  angular
    .module('oipa.charts')
    .directive('sdgPieChart', sdgPieChart);

  sdgPieChart.$inject = ['templateBaseUrl','$http'];

  function sdgPieChart(templateBaseUrl) {

    var directive = {
      controller: 'SdgPieChartController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        hasToContain: '@',
        groupBy: '@',
        groupById: '=',
        aggregations: '@',
        groupByName: '@',
        aggregationKey: '@',
        aggregationKeyId: '@',
        extraFilter: '@'
      },
      templateUrl: templateBaseUrl + '/templates/_charts/sdg-pie-chart.html'
    };

    return directive;
  }
})();