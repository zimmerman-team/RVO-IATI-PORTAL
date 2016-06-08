/**
 * SectorsVisualisationController
 * @namespace oipa.sectors
 */
(function () {
    'use strict';

    angular
    .module('oipa.sectors')
    .controller('SectorsVisualisationController', SectorsVisualisationController);

    SectorsVisualisationController.$inject = ['$scope', 'FilterSelection', 'TransactionAggregations', 'sectorMapping'];

    /**
     * @namespace SectorsVisualisationController
     */
    function SectorsVisualisationController($scope, FilterSelection, TransactionAggregations, sectorMapping) {
        var vm = this;
        vm.filterSelection = FilterSelection;
        vm.selectionString = '';
        vm.sunburstData = '';
        vm.refreshSunburst = false;
        vm.searchValue = '';
        vm.submitSearch = false;

        activate();

        function activate() {
            FilterSelection.reset();

            $scope.$watch('vm.submitSearch', function(submitSearch){
                if(submitSearch){
                    vm.submitSearch = false;
                }
            }, true);

            $scope.$watch('vm.filterSelection.selectionString', function (selectionString) {
                vm.selectionString = selectionString;
                vm.activateSunburst();
            }, true);

        }

        vm.activateSunburst = function(){
            TransactionAggregations.aggregation('sector', 'activity_count,incoming_fund', vm.selectionString + '&hierarchy=2').then(successFn, errorFn);

            function successFn(data, status, headers, config) {
                vm.reformatSunburstData(data.data.results);
            }

            function errorFn(data, status, headers, config) {
                console.log("getting sectors failed");
            }
        }

        vm.reformatSunburstData = function(data){

            var sector5 = {};
            for(var i = 0;i < data.length;i++){
                sector5[data[i].sector.code] = {'incoming_fund':data[i].incoming_fund, 'count': data[i].activity_count};
            }

            var mapping = angular.copy(sectorMapping);

            function loopChildren(arr){
                for (var i = 0;i < arr.length;i++){
                    if(arr[i].hasOwnProperty('children')){
                        loopChildren(arr[i].children);
                    } else{
                        if(sector5[arr[i].sector_id] != undefined){
                            arr[i].incoming_fund = sector5[arr[i].sector_id].incoming_fund;
                            arr[i].count = sector5[arr[i].sector_id].count;
                        } else {
                            arr[i].incoming_fund = 0;
                            arr[i].count = 0;
                        }
                    }
                }
            }

            function updateTransactions(sector) { 
                if(!sector.hasOwnProperty('children')) {
                    return [sector.incoming_fund, sector.count];
                }
                var incoming_fund = 0;
                var count = 0;
                for (var i = 0; i < sector.children.length; i++) {
                    var values = updateTransactions(sector.children[i])
                    // if (values[0]) incoming_fund += values[0];
                    if (values[1]) count += values[1];
                }
                // sector.incoming_fund = incoming_fund;
                sector.count = count;
                return [incoming_fund, count];
            }

            loopChildren(mapping.children);

            _.each(mapping.children, updateTransactions)

            vm.sunburstData = angular.copy(mapping);
            vm.refreshSunburst = true;


        }

    }
})();
