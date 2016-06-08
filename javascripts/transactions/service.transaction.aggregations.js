(function () {
    'use strict';

    angular
        .module('oipa.aggregations')
        .factory('TransactionAggregations', TransactionAggregations);

    TransactionAggregations.$inject = ['$http', 'oipaUrl', 'reportingOrganisationId'];

    function TransactionAggregations($http, oipaUrl, reportingOrganisationId) {

        var TransactionAggregations = {
            aggregation: aggregation,
            prepare_url: prepare_url,
        };

        return TransactionAggregations;

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

            var url = oipaUrl + '/transactions/' + prepare_url(group_by, aggregations, filters, order_by, page_size, page);
            return $http.get(url, { cache: true });
        }
    }
})();