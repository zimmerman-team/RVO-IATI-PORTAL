/**
* CountriesController
* @namespace oipa.countries.controllers
*/
(function () {
  'use strict';

  angular
    .module('oipa.programmes')
    .controller('ProgrammeController', ProgrammeController);

  ProgrammeController.$inject = ['Activities', '$stateParams', 'FilterSelection', 'templateBaseUrl', 'Programmes', 'homeUrl'];

  /**
  * @namespace ActivitiesController
  */
  function ProgrammeController(Activities, $stateParams, FilterSelection, templateBaseUrl, Programmes, homeUrl) {
    var vm = this;
    vm.activity = null;
    vm.programmeId = $stateParams.programme_id;
    vm.templateBaseUrl = templateBaseUrl;
    vm.filterSelection = FilterSelection;
    vm.selectedTab = 'summary';
    vm.programmeUrls = {
      "NL-KVK-27378529-23408": "http://english.rvo.nl/subsidies-programmes/psi",
      "NL-KVK-27378529-26663": "http://english.rvo.nl/subsidies-programmes/dutch-good-growth-fund-dggf",
      "NL-KVK-27378529-19390": "http://english.rvo.nl/subsidies-programmes/facility-infrastructure-development-orio",
      "NL-KVK-27378529-25403": "https://www.cbi.eu/",
      "NL-KVK-27378529-26225": "http://english.rvo.nl/subsidies-programmes/life-sciences-health-development-lsh4d",
      "NL-KVK-27378529-23188": "http://english.rvo.nl/subsidies-programmes/transition-facility-tf",
      "NL-KVK-27378529-23310": "http://www.rvo.nl/subsidies-regelingen/pilot-2gthere-os",
      "NL-KVK-27378529-26067": null,
      "NL-KVK-27378529-26742": "http://www.rvo.nl/subsidies-regelingen/projectuitvoering-dhk",
      "NL-KVK-27378529-18232": "http://english.rvo.nl/subsidies-programmes/archief-daey-ouwens-fund/archief-projects",
      "NL-KVK-27378529-25588": "http://english.rvo.nl/subsidies-programmes/dutch-risk-reduction-team-drr-team",
      "NL-KVK-27378529-27115": "http://english.rvo.nl/subsidies-programmes/dutch-surge-support-dss-water",
      "NL-KVK-27378529-23877": "http://english.rvo.nl/subsidies-programmes/facility-sustainable-entrepreneurship-and-food-security-fdov",
      "NL-KVK-27378529-23710": "http://english.rvo.nl/subsidies-programmes/sustainable-water-fund-fdw",
      "NL-KVK-27378529-25717": "http://english.rvo.nl/subsidies-programmes/ghana-wash-window",
    }
    vm.programmeUrl = null;
    vm.budgetLeft = 0;
    vm.progressStyle = {};
    vm.loading = true;
    vm.expenditure = 'Data to be added';

    vm.tabs = [
      {'id': 'summary', 'name': 'Summary', 'count': -1},
      {'id': 'activities', 'name': 'Projects', 'count': -1},
      {'id': 'countries', 'name': 'Countries', 'count': -1},
      {'id': 'sectors', 'name': 'Sectors', 'count': -1},
      {'id': 'implementing-organisations', 'name': 'Project partners', 'count': -1},
      {'id': 'results', 'name': 'Results', 'count': -1},
    ]

    activate();

    function activate() {

      if(vm.programmeUrls[vm.programmeId] != undefined){
        vm.programmeUrl = vm.programmeUrls[vm.programmeId];
      }

      Activities.get(vm.programmeId).then(successFn, errorFn);
      Activities.getTransactions(vm.programmeId).then(procesTransactions, errorFn);

      function successFn(data, status, headers, config) {
        vm.activity = data.data;
        Programmes.selectedProgrammes.push({'related_activity': vm.activity.id, 'count': 0, 'name': vm.activity.title.narratives[0].text});
        FilterSelection.save();
        vm.setBudgetLeft();
        vm.loading = false;
      }

      function procesTransactions(data, status, headers, config){
        vm.transactionData = data.data.results;
      }

      function errorFn(data, status, headers, config) {
        console.log("getting activity failed");
        vm.loading = false;
      }
    }

    vm.setBudgetLeft = function(){
      vm.expenditure = 0;

      if(vm.activity.aggregations.activity_children.expenditure_value != null){
        vm.expenditure += vm.activity.aggregations.children.expenditure_value;
      }

      if(vm.activity.aggregations.activity_children.disbursement_value != null){
        vm.expenditure += vm.activity.aggregations.children.disbursement_value;
      }

      vm.budgetLeft = Math.round(vm.expenditure / vm.activity.aggregations.children.incoming_funds_value * 100);
      if (isNaN(vm.budgetLeft) || !isFinite(vm.budgetLeft)) {
        vm.budgetLeft = 0;
      }
      vm.progressStyle = {'width': vm.budgetLeft + '%'}
    }

    vm.download = function(format){
      var url = homeUrl + '/export/?type=activity-detail&format='+format+'&detail='+vm.programmeId;
      window.open(url);
    }

  }
})();