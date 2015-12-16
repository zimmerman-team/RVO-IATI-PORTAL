/**
* CountriesController
* @namespace oipa.countries.controllers
*/
(function () {
  'use strict';

  angular
    .module('oipa.implementingOrganisations')
    .controller('ImplementingOrganisationController', ImplementingOrganisationController);

  ImplementingOrganisationController.$inject = ['$scope', '$stateParams', 'ImplementingOrganisations', 'FilterSelection', 'Aggregations', 'homeUrl', '$location'];

  /**
  * @namespace CountriesController
  */
  function ImplementingOrganisationController($scope, $stateParams, ImplementingOrganisations, FilterSelection, Aggregations, homeUrl, $location) {
    var vm = this;
    vm.organisation = null;
    vm.organisation_id = $stateParams.organisation_id;
    vm.filterSelection = FilterSelection;
    vm.selectionString = '';
    vm.selectedTab = 'samenvatting';
    vm.pageUrlDecoded = $location.absUrl();


    vm.tabs = [
      {'id': 'samenvatting', 'name': 'Summary', 'count': -1},
      {'id': 'programmes', 'name': 'Programmes', 'count': -1},
      {'id': 'activities', 'name': 'Projects', 'count': -1},
      {'id': 'sectors', 'name': 'Sectors', 'count': -1},
      {'id': 'countries', 'name': 'Countries', 'count': -1},
    ]


    activate();

    function activate() {
      ImplementingOrganisations.selectedImplementingOrganisations.push({'organisation_id': vm.organisation_id, 'name': ''});

      $scope.$watch('vm.filterSelection.selectionString', function (selectionString) {
        vm.update(selectionString);
      }, true);

      // ImplementingOrganisations.get(vm.organisation_id).then(successFn, errorFn);
      ImplementingOrganisations.getActivities(vm.organisation_id).then(successFnActivities, errorFnActivities);

      function successFnActivities(data, status, headers, config) {
        vm.part_org_activities = data.data.results;
      }

      function errorFnActivities(data, status, headers, config) {
        console.log("getting implementing organisation activities failed");
      }


      ImplementingOrganisations.selectedImplementingOrganisations[0] = {'organisation_id':vm.organisation_id,'name':vm.organisation_id};
      vm.filterSelection.save();

      vm.pageUrl = encodeURIComponent(vm.pageUrlDecoded);
      vm.shareDescription = encodeURIComponent('View the aid projects of the RVO on ' + vm.pageUrlDecoded);

    }

    function errorFn(data, status, headers, config) {
      console.log("getting implementing organisation failed");
    }

    vm.setBudgetLeft = function(){
      vm.budgetLeft = Math.round(vm.disbursements / vm.budget * 100);
      vm.progressStyle = {'width': vm.budgetLeft + '%'}
    }

    vm.update = function(selectionString){

      if (selectionString.indexOf("participating_organisation_name") < 0) return false;

      Aggregations.aggregation('participating_organisation', 'disbursement', selectionString).then(function(data, status, headers, config){
        vm.disbursements = data.data.results.length ? data.data.results[0].disbursement : 0;
        vm.setBudgetLeft();
      }, errorFn);

      Aggregations.aggregation('participating_organisation', 'incoming_fund', selectionString).then(function(data, status, headers, config){
        vm.budget = data.data.results.length ? data.data.results[0].incoming_fund : 0;
        vm.setBudgetLeft();
      }, errorFn);

      // Aggregations.aggregation('transaction__transaction-date_year', 'disbursement', selectionString).then(function(data, status, headers, config){
      //   vm.disbursements_by_year = data.data.results;
        
      // }, errorFn);

      // Aggregations.aggregation('transaction__transaction-date_year', 'commitment', selectionString).then(function(data, status, headers, config){
      //   vm.commitments_by_year = data.data.results;
      // }, errorFn);

      // Aggregations.aggregation('reporting-org', 'budget__value', selectionString).then(function(data, status, headers, config){
      //   vm.budget_by_year = data.data.results;
      // }, errorFn);

    }

    vm.download = function(format){
      var url = homeUrl + '/export/?format=json&filters='+encodeURIComponent(FilterSelection.selectionString);
      window.open(url);
    }

    

  }
})();
