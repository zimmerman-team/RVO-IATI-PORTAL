/**
* Sectors
* @namespace oipa.implementingOrganisations
*/
(function () {
  'use strict';

  angular
    .module('oipa.programmes')
    .directive('programmeList', programmeList);

  programmeList.$inject = ['templateBaseUrl'];

  /**
  * @namespace Sectors
  */
  function programmeList(templateBaseUrl) {

    /**
    * @name directive
    * @desc The directive to be returned
    * @memberOf oipa.sectors.sectorsList
    */
    var directive = {
      controller: 'ProgrammeListController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        hasToContain: '@',
        count: '=?',
        searchValue: '=?',
        shown: '=?'
      },
      templateUrl: templateBaseUrl + '/templates/programmes/programmes-list.html'
    };

    return directive;
  }
})();