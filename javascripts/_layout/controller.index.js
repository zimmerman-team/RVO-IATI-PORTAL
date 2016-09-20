/**
* IndexController
* @namespace oipa.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('oipa.layout')
    .controller('IndexController', IndexController);

  IndexController.$inject = ['$scope', '$sce', 'FilterSelection', 'Aggregations', 'TransactionAggregations', 'Activities', '$http', '$filter'];

  function IndexController($scope, $sce, FilterSelection, Aggregations, TransactionAggregations, Activities, $http, $filter) {
    var vm = this;
    vm.countryCount = null;
    vm.activityCount = null;
    vm.budget = null;
    vm.date_updated = '';


    activate();

    function activate() {

      FilterSelection.reset();

      var selectionString = '';

      Aggregations.aggregation('recipient_country', 'count', selectionString + '&hierarchy=2', 'recipient_country', 1).then(function(data, status, headers, config){
        vm.countryCount = data.data.count;
      }, errorFn);

      Activities.list(selectionString + '&hierarchy=2', 1).then(function(data, status, headers, config){
        vm.activityCount = data.data.count;
      }, errorFn);

      TransactionAggregations.aggregation('reporting_organisation', 'incoming_fund', '&hierarchy=2').then(function(data, status, headers, config){
        vm.budget = data.data.results[0].incoming_fund;
      }, errorFn);

      $http.get("https://iatiregistry.org/api/3/action/package_show?id=rvo-01", { cache: true }).then(function(data, status, headers, config){
        var extras = data.data.result.extras
        for (var i = 0; i < extras.length;i++){
          if (extras[i].key == 'data_updated'){
            vm.date_updated = $filter('date')(new Date(extras[i].value),'dd-MM-yyyy');
            break;
          }
        }
      }, errorFn);

      

      function errorFn(data,status,heders,config){
        
      }
    }
  }
})();