(function () {
  'use strict';

  angular
    .module('oipa.charts')
    .directive('resultsChart', resultsChart);

  resultsChart.$inject = ['templateBaseUrl'];

  function resultsChart(templateBaseUrl) {

    var directive = {
      controller: 'ResultsChartController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {},
      templateUrl: templateBaseUrl + '/templates/results/results-chart.html'
    };

    return directive;
  }
})();