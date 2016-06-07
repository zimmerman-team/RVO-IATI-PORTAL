(function () {
	'use strict';

	angular
		.module('oipa.results')
		.factory('Results', Results);

	Results.$inject = ['$http', 'oipaUrl', 'reportingOrganisationId'];

	function Results($http, oipaUrl, reportingOrganisationId) {
		var m = this;

		var Results = {
			aggregation: aggregation
		};

        function aggregation(group_by, aggregations, filters, order_by){

            var url = oipaUrl + '/results/aggregations/?format=json&group_by='+group_by+'&aggregations='+aggregations
            if(reportingOrganisationId){
                url += '&reporting_organisation=' + reportingOrganisationId
            }
            if(filters !== undefined){
                url += filters
            }
            if(order_by !== undefined){
                url += '&order_by=' + order_by
            }
            return $http.get(url, { cache: true });
        }

		return Results;

	}

})();