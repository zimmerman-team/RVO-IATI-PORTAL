/**
* Posts
* @namespace ncs.collections.services
*/
(function () {
	'use strict';

	angular
		.module('oipa.countries')
		.factory('Countries', Countries);

	Countries.$inject = ['$http', 'oipaUrl', 'reportingOrganisationId'];

	/**
	* @namespace Filters
	* @returns {Factory}
	*/
	function Countries($http, oipaUrl, reportingOrganisationId) {
		var m = this;
		m.selectedCountries = [];

		var Countries = {
			selectedCountries: m.selectedCountries,
			getCountry: getCountry,
		};

		return Countries;

	    function getCountry(code) {
	     	return $http.get(oipaUrl + '/countries/' + code + '/?format=json', { cache: true });
	    }
	}
})();