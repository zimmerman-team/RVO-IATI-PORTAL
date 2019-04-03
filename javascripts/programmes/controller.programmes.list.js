/**
* CountriesController
* @namespace oipa.countries
*/
(function () {
  'use strict';

  angular
    .module('oipa.programmes')
    .controller('ProgrammeListController', ProgrammeListController);

  ProgrammeListController.$inject = ['$scope', 'Activities', 'FilterSelection', 'TransactionAggregations', 'programmesMapping', 'homeUrl'];

  /**
  * @namespace CountriesExploreController
  */
  function ProgrammeListController($scope, Activities, FilterSelection, TransactionAggregations, programmesMapping, homeUrl) {
    var vm = this;
    vm.filterSelection = FilterSelection;
    vm.activities = [];
    vm.order_by = 'related_activity';
    vm.page_size = 50;
    vm.page = 1;
    vm.totalActivities = 0;
    vm.hasToContain = $scope.hasToContain;
    vm.busy = false;
    vm.extraSelectionString = '';

    function activate() {
      $scope.$watch("vm.filterSelection.selectionString", function (selectionString) {
        vm.update(selectionString);
      }, true);

      $scope.$watch("searchValue", function (searchValue) {
        if (searchValue == undefined) return false; 
        searchValue == '' ? vm.extraSelectionString = '' : vm.extraSelectionString = '&q_fields=title&q='+searchValue;
        vm.update();
      }, true);

      // do not prefetch when the list is hidden
      if($scope.shown != undefined){
        $scope.$watch("shown", function (shown) {
            vm.busy = !shown ? true : false;
        }, true);
      }
    }

    vm.changeOrderBy = function(){
      
      var descending = false;

      if(vm.order_by.charAt(0) == '-'){
        descending = true;
      }
      // by budget
      if(vm.order_by.indexOf('incoming_fund') > -1){
        vm.activities = _.sortBy(vm.activities, 'incoming_fund');
      } else {
      // by title
        vm.activities = _.sortBy(vm.activities, 'name');
      }

      if(descending){
        vm.activities.reverse();
      }
    }

    vm.hasContains = function(){
      if(vm.hasToContain !== undefined){
        var totalString = vm.filterSelection.selectionString + vm.extraSelectionString;
        if(totalString.indexOf(vm.hasToContain) < 0){
          return false;
        }
      }
      return true;
    }

    vm.update = function(){
      if (!vm.hasContains()) return false;
      vm.page = 1;

      TransactionAggregations.aggregation('related_activity', 'activity_count,incoming_fund', vm.filterSelection.selectionString + vm.extraSelectionString, vm.order_by, vm.perPage, vm.page).then(aggregationSuccessFn, errorFn);

      function aggregationSuccessFn(data, status, headers, config){
        var results = data.data.results;
        var filteredResults = [];

        for(var i = 0;i < results.length;i++){
          if (programmesMapping[results[i].related_activity]) {
            results[i].name = programmesMapping[results[i].related_activity];
            filteredResults.push(results[i]);
          }
        }

        vm.activities = filteredResults;
        vm.totalActivities = filteredResults.length;
        $scope.count = vm.totalActivities;
        vm.changeOrderBy();

      }

      function errorFn(data, status, headers, config){
        console.warn('error getting data for activity.list.block');
      }
    }

    vm.download = function(format){
      var aggregation_url = TransactionAggregations.prepare_url('related_activity', 'activity_count,incoming_fund', vm.filterSelection.selectionString + vm.extraSelectionString, vm.order_by);
      var url = homeUrl + '/export/?type=aggregated-list&format='+format+'&aggregation_group=programme&aggregation_url=' + encodeURIComponent(aggregation_url);
      window.open(url);
    }

    activate();
  }
})();
