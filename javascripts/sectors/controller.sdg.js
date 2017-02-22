(function () {
  'use strict';

  angular
    .module('oipa.sectors')
    .controller('SdgController', SdgController);

  SdgController.$inject = ['$scope', 'Sdgs', 'templateBaseUrl', '$stateParams', 'FilterSelection', 'TransactionAggregations', 'homeUrl', 'sdgTargetTitles'];

  /**
  * @namespace CountriesController
  */
  function SdgController($scope, Sdgs, templateBaseUrl, $stateParams, FilterSelection, TransactionAggregations, homeUrl, sdgTargetTitles) {
    var vm = this;
    vm.sector = null;

    vm.sector_id = $stateParams.sdg_id;
    vm.filterSelection = FilterSelection;
    vm.selectedTab = 'summary';
    vm.aggregated_transactions = null;

    vm.tabs = [
      {'id': 'summary', 'name': 'Summary', 'count': -1},
      {'id': 'programmes', 'name': 'Programmes', 'count': -1},
      {'id': 'activities', 'name': 'Projects', 'count': -1},
      {'id': 'countries', 'name': 'Countries', 'count': -1},
      {'id': 'implementing-organisations', 'name': 'Project partners', 'count': -1},
    ]

    function activate() {
        vm.sector = {
            sector_id: vm.sector_id,
            name: sdgTargetTitles[vm.sector_id]
        }

        Sdgs.selectedSdgs.push({'sector': {"code":vm.sector_id,"name":vm.sector.name}});
        FilterSelection.save();

        $scope.$watch('vm.filterSelection.selectionString', function (selectionString) {
          vm.update(selectionString);
        }, true);
    }

    function errorFn(data, status, headers, config) {
      console.log("getting sectors failed");
    }

    vm.setBudgetLeft = function(){
      var budget = 0
      var expenditure = 0;

      function stringStartsWith (string, prefix) {
        return string.toString().slice(0, prefix.length) == prefix;
      }

      var sector_id = vm.sector_id.toString();
      for(var i = 0;i < vm.aggregated_transactions.length;i++){
        if(stringStartsWith(vm.aggregated_transactions[i].sector.code, sector_id)){
          budget += vm.aggregated_transactions[i].incoming_fund;
          expenditure += vm.aggregated_transactions[i].disbursement + vm.aggregated_transactions[i].expenditure;
        }
      }

      vm.budget = budget;
      vm.expenditure = expenditure;

      vm.budgetLeft = Math.round(vm.expenditure / vm.budget * 100);
      if (isNaN(vm.budgetLeft)) { vm.budgetLeft = 0; }
      vm.progressStyle = {'width': vm.budgetLeft + '%'}
    }

    vm.update = function(selectionString){

      if (selectionString.indexOf("sector") < 0){ return false;}

      TransactionAggregations.aggregation('sector', 'disbursement,expenditure,incoming_fund', selectionString + '&hierarchy=2').then(function(data, status, headers, config){
        vm.aggregated_transactions = data.data.results;
        vm.setBudgetLeft();
      }, errorFn);
    }

    vm.download = function(format){
      var url = homeUrl + '/export/?type=sector-detail&detail=' + vm.sector_id + '&format='+format+'&sector_name='+encodeURIComponent(vm.sector.name)+'&budget=' + vm.budget + '&expenditure=' + vm.expenditure;
      window.open(url);
    }

    activate();
  }
  
})();