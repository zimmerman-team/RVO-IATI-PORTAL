/**
* CountriesController
* @namespace oipa.countries.controllers
*/
(function () {
  'use strict';

  angular
    .module('oipa.implementingOrganisations')
    .controller('ImplementingOrganisationController', ImplementingOrganisationController);

  ImplementingOrganisationController.$inject = ['$scope', '$stateParams', 'ImplementingOrganisations', 'FilterSelection', 'TransactionAggregations', 'homeUrl'];

  /**
  * @namespace CountriesController
  */
  function ImplementingOrganisationController($scope, $stateParams, ImplementingOrganisations, FilterSelection, TransactionAggregations, homeUrl) {
    var vm = this;
    vm.organisation = null;
    vm.organisation_id = $stateParams.organisation_id;
    vm.filterSelection = FilterSelection;
    vm.selectionString = '';
    vm.selectedTab = 'summary';
    vm.part_org_activities = '';
    vm.busy = true;
    vm.budget = null;
    vm.disbursements = null;

    vm.tabs = [
      {'id': 'summary', 'name': 'Summary', 'count': -1},
      {'id': 'programmes', 'name': 'Programmes', 'count': -1},
      {'id': 'activities', 'name': 'Projects', 'count': -1},
      {'id': 'sectors', 'name': 'Sectors', 'count': -1},
      {'id': 'countries', 'name': 'Countries', 'count': -1},
    ]

    activate();

    function activate() {
      FilterSelection.reset();
      
      ImplementingOrganisations.selectedImplementingOrganisations.push({'organisation_id': vm.organisation_id, 'name': vm.organisation_id, 'participating_organisation': vm.organisation_id });

      $scope.$watch('vm.filterSelection.selectionString', function (selectionString) {
        vm.update(selectionString);
      }, true);

      ImplementingOrganisations.getActivities(encodeURIComponent(vm.organisation_id)).then(successFnActivities, errorFn);

      function successFnActivities(data, status, headers, config) {
        vm.part_org_activities = data.data.results;
        vm.busy = false;
      }

      function errorFn(data, status, headers, config) {
        console.log("getting implementing organisation or its activities failed");
        vm.busy = false;
      }

      vm.pageUrl = encodeURIComponent(vm.pageUrlDecoded);
      vm.shareDescription = encodeURIComponent('View the aid projects of the RVO on ' + vm.pageUrlDecoded);

    }

    function errorFn(data, status, headers, config) {
      console.log("getting implementing organisation failed");
    }

    vm.setBudgetLeft = function(){
      vm.budgetLeft = Math.round(vm.disbursements / vm.budget * 100);
      if (isNaN(vm.budgetLeft)) { vm.budgetLeft = 0; }
      vm.progressStyle = {'width': vm.budgetLeft + '%'}
    }

    vm.update = function(selectionString){

      if (selectionString.indexOf("participating_organisation_name") < 0) return false;

      vm.budget = 0;
      vm.disbursements = 0;

      var adjustedSelectionString = selectionString;
      var group_by = "";

      if ($stateParams.type === "funding") {
        adjustedSelectionString = selectionString.replace('participating_organisation_name', 'provider_organisation_name');
        group_by = "provider_org";
      } else {
        adjustedSelectionString = selectionString.replace('participating_organisation_name', 'receiver_organisation_name');
        group_by = "receiver_org";
      }

      TransactionAggregations.aggregation(group_by, 'commitment,disbursement,expenditure', adjustedSelectionString).then(function(data, status, headers, config){
        vm.disbursements = data.data.results[0].disbursement + data.data.results[0].expenditure;
        vm.budget = data.data.results[0].commitment;
        vm.setBudgetLeft();
      }, errorFn);
    }

    vm.download = function(format){
      var url = homeUrl + '/export/?type=implementing-org-detail&detail=' + vm.organisation_id + '&format='+format+'&budget=' + vm.budget + '&expenditure=' + vm.disbursements;
      window.open(url);
    }
  }
})();
