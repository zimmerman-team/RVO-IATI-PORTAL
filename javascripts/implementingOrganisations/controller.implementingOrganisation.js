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
    vm.part_org_activities = '';
    vm.loading = true;

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

      vm.organisation_id = vm.organisation_id;

      ImplementingOrganisations.getActivities(encodeURIComponent(vm.organisation_id)).then(successFnActivities, errorFn);

      function successFnActivities(data, status, headers, config) {
        vm.part_org_activities = data.data.results;
        vm.loading = false;
      }

      function errorFn(data, status, headers, config) {
        console.log("getting implementing organisation or its activities failed");
        vm.loading = false;
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

      vm.budget = 0;
      vm.disbursements = 0;
      Aggregations.aggregation('transaction_receiver_org_narrative', 'transaction_value', '&transaction_receiver_organisation_name=' + encodeURIComponent(vm.organisation_id)).then(function(data, status, headers, config){

        for(var i = 0; i < data.data.results.length;i++){
          if((data.data.results[i].transaction_type == '3' || data.data.results[i].transaction_type == '4') && data.data.results[i].name == vm.organisation_id){
            vm.disbursements += data.data.results[i].value;
          }
          if(data.data.results[i].transaction_type == '2' && data.data.results[i].name == vm.organisation_id){
            vm.budget += data.data.results[i].value;
          }
        }

        vm.setBudgetLeft();
      }, errorFn);
    }

    vm.download = function(format){
      var url = homeUrl + '/export/?format=json&filters='+encodeURIComponent(FilterSelection.selectionString);
      window.open(url);
    }

    

  }
})();
