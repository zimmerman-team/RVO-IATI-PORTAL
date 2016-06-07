(function () {
  'use strict';

  angular
    .module('oipa.results')
    .directive('resultsTable', resultsTable);

  resultsTable.$inject = ['templateBaseUrl'];

  function resultsTable(templateBaseUrl) {

    var directive = {
      controller: 'ResultsTableController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        indicators: '=',
        selectedGroup: '='
      },
      templateUrl: templateBaseUrl + '/templates/results/results-table.html'
    };

    return directive;
  }
})();