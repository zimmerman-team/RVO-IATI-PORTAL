(function () {
  'use strict';

  angular
    .module('oipa.results')
    .directive('results', results);

  results.$inject = ['templateBaseUrl'];

  function results(templateBaseUrl) {

    var directive = {
      controller: 'ResultsController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        hasToContain: '@',
      },
      templateUrl: templateBaseUrl + '/templates/results/results.html'
    };

    return directive;
  }
})();