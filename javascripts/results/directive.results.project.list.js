(function () {
  'use strict';

  angular
    .module('oipa.results')
    .directive('resultsProjectList', resultsProjectList);

  resultsProjectList.$inject = ['templateBaseUrl'];

  function resultsProjectList(templateBaseUrl) {

    var directive = {
      controller: 'ResultsProjectListController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        selectedIndicators: '=',
      },
      templateUrl: templateBaseUrl + '/templates/results/results-project-list.html'
    };

    return directive;
  }
})();