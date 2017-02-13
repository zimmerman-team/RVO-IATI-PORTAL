/**
* Sectors
* @namespace oipa.implementingOrganisations
*/
(function () {
  'use strict';

  angular
    .module('oipa.programmes')
    .directive('programmeSdgs', programmeSdgs);

  programmeSdgs.$inject = ['templateBaseUrl'];

  /**
  * @namespace Sectors
  */
  function programmeSdgs(templateBaseUrl) {

    /**
    * @name directive
    * @desc The directive to be returned
    * @memberOf oipa.sectors.sectorsList
    */
    var directive = {
      controller: 'ProgrammeSdgsController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        hasToContain: '@'
      },
      templateUrl: templateBaseUrl + '/templates/programmes/programme-view-detail-sdgs.html'
    };

    return directive;
  }
})();