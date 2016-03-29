/**
* Posts
* @namespace oipa.activityStatus
*/
(function () {
	'use strict';

	angular
		.module('oipa.activityStatus')
		.factory('ImplementingOrganisationType', ImplementingOrganisationType);

	ImplementingOrganisationType.$inject = ['$http', 'oipaUrl', 'reportingOrganisationId'];

	/**
	* @namespace ImplementingOrganisationType
	* @returns {Factory}
	*/
	function ImplementingOrganisationType($http, oipaUrl, reportingOrganisationId) {

        var m = this;
        m.selectedImplementingOrganisationTypes = [];

		var ImplementingOrganisationType = {
            selectedImplementingOrganisationTypes: m.selectedImplementingOrganisationTypes,
            getStatuses: getStatuses
		};

		function getStatuses(statuses) {

            var url = oipaUrl + '/activities/aggregations/?format=json&group_by=participating_organisation_type&aggregations=count';
            if(reportingOrganisationId){
                url += '&reporting_organisation__in=' + reportingOrganisationId;
            }
            url += '&participating_organisation_type=' + statuses;
            return $http.get(url, { cache: true });
        }

		return ImplementingOrganisationType;
	}
})();
