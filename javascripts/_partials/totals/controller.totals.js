/**
* TotalsController
* @namespace oipa.partials
*/
(function () {
  'use strict';

  angular
    .module('oipa.partials')
    .controller('TotalsController', TotalsController);

  TotalsController.$inject = ['$scope', 'Activities', 'Aggregations', 'FilterSelection', 'programmesMapping'];

  /**
  * @namespace TotalsController
  */
  function TotalsController($scope, Activities, Aggregations, FilterSelection, programmesMapping) {
    var vm = this;
    vm.filterSelection = FilterSelection;
    vm.programmeCount = null;
    vm.activityCount = null;
    vm.sectorCount = null;
    vm.countryCount = null;
    vm.updateOnInit = $scope.updateOnInit;

    

    function activate() {

      $scope.$watch("vm.filterSelection.selectionString", function (selectionString, oldString) {
        if(selectionString !== oldString){
          vm.update(selectionString);
        }
      }, true);
      if(vm.updateOnInit){
        vm.update(vm.filterSelection.selectionString);
      }
    }

    function errorFn(data, status, headers, config) {
      console.log("getting country failed");
    }

    vm.update = function(selectionString){
      Aggregations.aggregation('recipient_country', 'count', selectionString, 'recipient_country', 1).then(function(data, status, headers, config){
        vm.countryCount = data.data.count;
      }, errorFn);

      Aggregations.aggregation('related_activity', 'count', selectionString, 'related_activity', 100, 1).then(function(data, status, headers, config){
        var count = 0;
        var results = data.data.results;
        for(var i = 0;i < results.length;i++){
          if (programmesMapping[results[i].related_activity]) {
            count++;
          }
        }
        vm.programmeCount = count;
      }, errorFn);

      Aggregations.aggregation('sector', 'count', selectionString + '&sector_vocabulary=1', 'sector', 1).then(function(data, status, headers, config){
        vm.sectorCount = data.data.count;
      }, errorFn);

      Activities.list(selectionString + '&hierarchy=2', 1).then(function(data, status, headers, config){
        vm.activityCount = data.data.count;
      }, errorFn);

    }

    activate();
  }
})();