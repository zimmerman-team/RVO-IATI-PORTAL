/**
* topNavBar
* @namespace oipa.partials
*/
(function () {
  'use strict';

  angular
    .module('oipa.partials')
    .directive('totalsBar', totalsBar);

  totalsBar.$inject = ['templateBaseUrl'];

  function totalsBar(templateBaseUrl) {

    var directive = {
      controller: 'TotalsController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: { 
        'updateOnInit': '=',
      },
      templateUrl: templateBaseUrl + '/templates/_partials/totals/totals-bar.html'
    };

    return directive;
  }
})();