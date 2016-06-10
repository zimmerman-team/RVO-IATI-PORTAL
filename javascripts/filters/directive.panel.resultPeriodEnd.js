(function () {
  'use strict';

  angular
    .module('oipa.filters')
    .directive('filterPanelResultPeriodEndYear', filterPanelResultPeriodEndYear);

  filterPanelResultPeriodEndYear.$inject = ['templateBaseUrl'];

  function filterPanelResultPeriodEndYear(templateBaseUrl) {

    var directive = {
      controller: 'ResultPeriodEndController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {},
      templateUrl: templateBaseUrl + '/templates/filters/filter-panel-result-period-end.html'
    };

    return directive;
  }
})();