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
            getParticipatingOrgTypes: getParticipatingOrgTypes
		};

		function getParticipatingOrgTypes(org_types) {

            var url = oipaUrl + '/activities/aggregations/?format=json&group_by=participating_organisation_type&aggregations=count';
            if(reportingOrganisationId){
                url += '&reporting_organisation=' + reportingOrganisationId;
            }
            url += '&participating_organisation_type=' + org_types;
            return $http.get(url, { cache: true });
        }

		return ImplementingOrganisationType;
	}
})();
