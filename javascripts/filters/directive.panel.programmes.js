/**
* filterPanelRecipientCountries
* @namespace oipa.filters
*/
(function () {
  'use strict';

  angular
    .module('oipa.filters')
    .directive('filterPanelProgrammes', filterPanelProgrammes);

  filterPanelProgrammes.$inject = ['templateBaseUrl'];

  /**
  * @namespace Oipa.filters
  */
  function filterPanelProgrammes(templateBaseUrl) {

    /**
    * @name directive
    * @desc The directive to be returned
    * @memberOf oipa.filters.filterPanelRecipientCountries
    */
    var directive = {
      controller: 'ProgrammesController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {},
      templateUrl: templateBaseUrl + '/templates/filters/filter-panel-programmes.html'
    };

    return directive;
  }
})();