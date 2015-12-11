/**
* CountriesController
* @namespace oipa.countries
*/
(function () {
  'use strict';

  angular
    .module('oipa.programmes')
    .controller('ProgrammeListController', ProgrammeListController);

  ProgrammeListController.$inject = ['$scope', 'Activities', 'FilterSelection', 'Aggregations'];

  /**
  * @namespace CountriesExploreController
  */
  function ProgrammeListController($scope, Activities, FilterSelection, Aggregations) {
    var vm = this;
    vm.filterSelection = FilterSelection;
    vm.activities = [];
    vm.order_by = 'title';
    vm.page_size = 15;
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

    vm.toggleOrder = function(){
      vm.update(vm.filterSelection.selectionString);
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

      Activities.list(vm.filterSelection.selectionString + vm.extraSelectionString + '&hierarchy=1', vm.page_size, vm.order_by, vm.page).then(succesFn, errorFn);

      function succesFn(data, status, headers, config){

        vm.activities = data.data.results;
        vm.totalActivities = data.data.count;
        $scope.count = vm.totalActivities;

        Aggregations.aggregation('related_activity', 'count,incoming_fund', vm.filterSelection.selectionString).then(aggregationSuccessFn, errorFn);

      }

      function aggregationSuccessFn(data, status, headers, config){

        // make dict
        var results = data.data.results;
        var dict = {}
        for(var i = 0;i < results.length;i++){
          dict[results[i].activity_id] = results[i];
        }

        for(var i = 0;i < vm.activities.length;i++){
          if(dict[vm.activities[i].id] != undefined){
            vm.activities[i].count = dict[vm.activities[i].id].count;
            vm.activities[i].budget = dict[vm.activities[i].id].incoming_fund;
          }
        }
      }

      function errorFn(data, status, headers, config){
        console.warn('error getting data for activity.list.block');
      }
    }

    vm.nextPage = function(){
      if (!vm.hasContains() || vm.busy || (vm.totalActivities < (vm.page * vm.page_size))) return;

      vm.busy = true;
      vm.page += 1;
      Activities.list(vm.filterSelection.selectionString + vm.extraSelectionString, vm.page_size, vm.order_by, vm.page).then(succesFn, errorFn);

      function succesFn(data, status, headers, config){
        vm.activities.concat(data.data.results);
        vm.busy = false;   
      }

      function errorFn(data, status, headers, config){
        console.warn('error getting data on lazy loading');
      }
    };

    activate();
  }
})();