/**
* Collection
* @namespace oipa.countries
*/
(function () {
  'use strict';

  angular
    .module('oipa.countries')
    .directive('countriesGeoMap', countriesGeoMap);

  countriesGeoMap.$inject = ['templateBaseUrl'];

  /**
  * @namespace Collection
  */
  function countriesGeoMap(templateBaseUrl) {

    /**
    * @name directive
    * @desc The directive to be returned
    * @memberOf oipa.countries.countriesListDirective
    */
    var directive = {
      controller: 'CountriesMapController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        mapHeight: '@',
      },
      templateUrl: templateBaseUrl + '/templates/countries/countries-map.html'
    };

    return directive;
  }
})();