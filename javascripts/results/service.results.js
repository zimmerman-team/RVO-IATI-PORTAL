(function () {
	'use strict';

	angular
		.module('oipa.results')
		.factory('Results', Results);

	Results.$inject = ['$http', 'oipaUrl', 'reportingOrganisationId'];

	function Results($http, oipaUrl, reportingOrganisationId) {
		var m = this;

		var Results = {
		};

		return Results;

	}

})();