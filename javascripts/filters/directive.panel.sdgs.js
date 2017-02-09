/**
* filterPanelSdgs
* @namespace oipa.filters
*/
(function () {
  'use strict';

  angular
    .module('oipa.filters')
    .directive('filterPanelSdgs', filterPanelSdgs);

  filterPanelSdgs.$inject = ['templateBaseUrl'];

  /**
  * @namespace filterPanelSdgs
  */
  function filterPanelSdgs(templateBaseUrl) {

    /**
    * @name directive
    * @desc The directive to be returned
    * @memberOf oipa.filters.filterPanelSdgs
    */
    var directive = {
      controller: 'SdgsController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {},
      templateUrl: templateBaseUrl + '/templates/filters/filter-panel-sdgs.html'
    };

    return directive;
  }
})();