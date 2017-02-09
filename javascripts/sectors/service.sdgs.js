/**
* Posts
* @namespace oipa.sectors.services
*/
(function () {
    'use strict';

    angular
        .module('oipa.sectors')
        .factory('Sdgs', Sdgs);

    Sdgs.$inject = ['$http', 'oipaUrl', 'reportingOrganisationId'];

    /**
    * @namespace Sdgs
    * @returns {Factory}
    */
    function Sdgs($http, oipaUrl, reportingOrganisationId) {
        this.selectedSdgs = [];
        var Sdgs = {
            selectedSectors: this.selectedSectors,
            all: all,
            get: get,
            getSectors: getSectors
        };

        return Sdgs;

        ////////////////////

        /**
         * @name all
         * @desc Try to get all sectors
         * @returns {Promise}
         * @memberOf oipa.sectors.services.Sdgs
         */
        function all() {

            var url = oipaUrl + '/aggregate/?format=json&sector_vocabulary=8&group_by=sector&aggregation_key=iati-identifier';
            if(reportingOrganisationId){
                url += '&reporting_organisation__in=' + reportingOrganisationId;
            }
            return $http.get(url, { cache: true });
        }

        function getSectors(sectors) {

            var url = oipaUrl + '/activities/aggregations/?format=json&sector_vocabulary=8&group_by=sector&aggregations=count';
            if(reportingOrganisationId){
                url += '&reporting_organisation__in=' + reportingOrganisationId;
            }
            url += '&sector=' + sectors;
            return $http.get(url, { cache: true });
        }

        /**
         * @name get
         * @desc Get a specific sector
         * @param {string} filter_type The type to get filter options for
         * @returns {Promise}
         * @memberOf oipa.sectors.services.Sectors
         */
         function get(id) {
            return $http.get(oipaUrl + '/sectors/' + id + '/?format=json', { cache: true });
         }
    }
})();