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


    console.log('TODO: tabs met inhoud fixen');
    vm.tabs = [
      {'id': 'samenvatting', 'name': 'Summary', 'count': -1},
      // {'id': 'programmes', 'name': 'Programmes', 'count': -1},
      // {'id': 'activities', 'name': 'Projects', 'count': -1},
      // {'id': 'sectors', 'name': 'Sectors', 'count': -1},
      // {'id': 'countries', 'name': 'Countries', 'count': -1},
    ]


    activate();

    function activate() {
      ImplementingOrganisations.selectedImplementingOrganisations.push({'organisation_id': vm.organisation_id, 'name': ''});

      $scope.$watch('vm.filterSelection.selectionString', function (selectionString) {
        vm.update(selectionString);
      }, true);

      ImplementingOrganisations.get(vm.organisation_id).then(successFn, errorFn);
      ImplementingOrganisations.getActivities(vm.organisation_id).then(successFnActivities, errorFnActivities);
    

      function successFnActivities(data, status, headers, config) {
        vm.part_org_activities = data.data.results;
      }

      function errorFnActivities(data, status, headers, config) {
        console.log("getting implementing organisation activities failed");
      }


      function successFn(data, status, headers, config) {

        vm.organisation = data.data;
        ImplementingOrganisations.selectedImplementingOrganisations[0] = {'organisation_id':vm.organisation.code,'name':vm.organisation.name};
        vm.filterSelection.save();
        setTimeout(function(){ vm.update(vm.filterSelection.selectionString); }, 3000);
      }
      vm.pageUrl = encodeURIComponent(vm.pageUrlDecoded);
      vm.shareDescription = encodeURIComponent('View the aid projects of the RVO on ' + vm.pageUrlDecoded);

    }

    function errorFn(data, status, headers, config) {
      console.log("getting implementing organisation failed");
    }

    vm.update = function(selectionString){

      if (selectionString.indexOf("participating_organisations__organisation__code__in") < 0) return false;

      Aggregations.aggregation('transaction__transaction-date_year', 'disbursement', selectionString).then(function(data, status, headers, config){
        vm.disbursements_by_year = data.data.results;
        
      }, errorFn);

      Aggregations.aggregation('transaction__transaction-date_year', 'commitment', selectionString).then(function(data, status, headers, config){
        vm.commitments_by_year = data.data.results;
      }, errorFn);

      Aggregations.aggregation('reporting-org', 'budget__value', selectionString).then(function(data, status, headers, config){
        vm.budget_by_year = data.data.results;
      }, errorFn);

    }

    vm.download = function(format){
      var url = homeUrl + '/export/?format=json&filters='+encodeURIComponent(FilterSelection.selectionString);
      if(vm.currentPage == 'activity'){
        url = homeUrl + '/export/?format=json&detail='+$scope.activityId+'&filters=';
      }
      window.open(url);
    }

    

  }
})();
