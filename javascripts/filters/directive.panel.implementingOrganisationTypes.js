/**
* filterPanelImplementingOrganisationType
* @namespace oipa.filters
*/
(function () {
  'use strict';

  angular
    .module('oipa.filters')
    .directive('filterPanelImplementingOrganisationType', filterPanelImplementingOrganisationType);

  filterPanelImplementingOrganisationType.$inject = ['templateBaseUrl'];

  /**
  * @namespace filterPanelImplementingOrganisationType
  */
  function filterPanelImplementingOrganisationType(templateBaseUrl) {

    /**
    * @name directive
    * @desc The directive to be returned
    * @memberOf oipa.filters.filterPanelImplementingOrganisationType
    */
    var directive = {
      controller: 'ImplementingOrganisationTypeController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {},
      templateUrl: templateBaseUrl + '/templates/filters/filter-panel-implementing-organisation-types.html'
    };

    return directive;
  }
})();
