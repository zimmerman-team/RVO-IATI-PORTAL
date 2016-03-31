/**
* Aggregations
* @namespace oipa.aggregations
*/
(function () {
    'use strict';

    angular
        .module('oipa.aggregations')
        .factory('Aggregations', Aggregations);

    Aggregations.$inject = ['$http', 'oipaUrl', 'reportingOrganisationId'];

    /**
    * @namespace Aggregations
    * @returns {Factory}
    */
    function Aggregations($http, oipaUrl, reportingOrganisationId) {

        var Aggregations = {
            aggregation: aggregation,
            prepare_url: prepare_url
        };

        return Aggregations;

        function prepare_url(group_by, aggregations, filters, order_by, page_size, page){
            var url = 'aggregations/?format=json&group_by='+group_by+'&aggregations='+aggregations
            if(reportingOrganisationId){
                url += '&reporting_organisation=' + reportingOrganisationId
            }
            if(filters !== undefined){
                url += filters;
            }
            if(order_by !== undefined){
                url += '&order_by=' + order_by;
            }
            if(page_size !== undefined){
                url += '&page_size=' + page_size;
            }
            
            if(page !== undefined){
                url += '&page=' + page;
            }
            return url;
        }

        function aggregation(group_by, aggregations, filters, order_by, page_size, page){

            var url = oipaUrl + '/activities/' + prepare_url(group_by, aggregations, filters, order_by, page_size, page);
            return $http.get(url, { cache: true });
        }
    }
})();