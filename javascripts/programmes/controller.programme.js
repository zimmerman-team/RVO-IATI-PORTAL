/**
* CountriesController
* @namespace oipa.countries.controllers
*/
(function () {
  'use strict';

  angular
    .module('oipa.programmes')
    .controller('ProgrammeController', ProgrammeController);

  ProgrammeController.$inject = ['Activities', '$stateParams', 'FilterSelection', '$filter', 'templateBaseUrl'];

  /**
  * @namespace ActivitiesController
  */
  function ProgrammeController(Activities, $stateParams, FilterSelection, $filter, templateBaseUrl) {
    var vm = this;
    vm.activity = null;
    vm.programmeId = $stateParams.programme_id;
    vm.templateBaseUrl = templateBaseUrl;
    vm.filterSelection = FilterSelection;
    vm.selectedTab = 'summary';

    vm.tabs = [
      {'id': 'summary', 'name': 'Summary', 'count': -1},
      {'id': 'activities', 'name': 'Projects', 'count': -1},
      {'id': 'countries', 'name': 'Countries', 'count': -1},
      {'id': 'sectors', 'name': 'Sectors', 'count': -1},
      {'id': 'implementing-organisations', 'name': 'Organisations', 'count': -1},
    ]

    activate();

    function activate() {      
      Activities.get(vm.programmeId).then(successFn, errorFn);
      Activities.getTransactions(vm.programmeId).then(procesTransactions, errorFn);

      function successFn(data, status, headers, config) {
        vm.activity = data.data;
      }

      function procesTransactions(data, status, headers, config){
        vm.transactionData = data.data.results;
      }

      function errorFn(data, status, headers, config) {
        console.log("getting activity failed");
      }
    }

  }
})();