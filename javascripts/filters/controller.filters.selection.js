/**
* FiltersSelectionController
* @namespace oipa.filters.controllers
*/
(function () {
  'use strict';

  angular
    .module('oipa.filters')
    .controller('FiltersSelectionController', FiltersSelectionController);

  FiltersSelectionController.$inject = ['$scope', '$state', '$stateParams', '$location', 'FilterSelection', 'Programmes', 'Countries', 'Budget', 'Sectors', 'Transaction', 'ImplementingOrganisations', 'ActivityStatus', 'Search', 'programmesMapping'];

  function FiltersSelectionController($scope, $state, $stateParams, $location, FilterSelection, Programmes, Countries, Budget, Sectors, Transaction, ImplementingOrganisations, ActivityStatus, Search, programmesMapping) {
    var vm = this;
    vm.selectedCountries = Countries.selectedCountries;
    vm.selectedSectors = Sectors.selectedSectors;
    vm.selectedProgrammes = Programmes.selectedProgrammes;
    vm.selectedImplementingOrganisations = ImplementingOrganisations.selectedImplementingOrganisations;
    vm.selectedActivityStatuses = ActivityStatus.selectedActivityStatuses;
    vm.selectedBudget = Budget.budget;
    vm.selectedTransactionYear = Transaction.year;
    vm.filterSelection = FilterSelection;
    vm.search = Search;
    vm.currentPage = null;
    vm.state = $state;
    vm.filterCount = 0;

    vm.updateFilterCount = function(){
      var count = 0;
      if(vm.currentPage != 'country'){ count += vm.selectedCountries.length; }
      if(vm.currentPage != 'programmes'){ count += vm.selectedProgrammes.length; }
      if(vm.currentPage != 'sector'){ count += vm.selectedSectors.length; }
      if(vm.currentPage != 'organisation'){ count += vm.selectedImplementingOrganisations.length; }
      count += vm.selectedActivityStatuses.length;
      count += vm.search.searchString.length;
      if(vm.selectedBudget.on){ count += 1; }
      if(vm.selectedTransactionYear.on){ count += 1; }
      if(count != vm.filterCount){ vm.filterCount = count; }
    }

    function activate(){

      vm.parametersToSelection();

      $scope.$watch('vm.state.current.name', function(name){
        if(name){
          vm.currentPage = name;
        }
      }, true);

      $scope.$watch('vm.filterSelection.selectionString', function(selectionString){
        if(!selectionString.length){
          if(vm.filterCount != 0){
            vm.filterCount = 0;
          }
        } else {
          vm.updateFilterCount();
        }

        // update url string
        vm.selectionToParameters();
      }, true);
    }

    vm.selectionToParameters = function(){

      var path = $state.current.url.split('?')[0];

      if(vm.filterSelection.selectionString.length){
        $location.path(path).search('filters', vm.filterSelection.selectionString);
      } else {
        $location.path(path).search('filters',null);
      }
    }

    function errorFn(data, status, headers, config){
      console.warn('error getting filter name');
    }

    vm.parametersToSelection = function(){
      // parametersToSelection
      //
      // description: 

      // get parameters
      var filters = decodeURIComponent($stateParams.filters);

      var filter_headers = filters.split('&');

      var filter_obj = {};

      for(var i = 0;i < filter_headers.length;i++){
        var name_value = filter_headers[i].split('=');
        filter_obj[name_value[0]] = name_value[1];
      }

      // add to filters under the right header (with the wrong name)
      if(filter_obj['related_activity_id'] != undefined){
        var related_activity_ids = filter_obj['related_activity_id'].split(',');

        for(var i = 0;i < related_activity_ids.length; i++){

          if(programmesMapping[related_activity_ids[i]] != undefined){
            vm.selectedProgrammes.push({'activity_id': related_activity_ids[i], 'name': programmesMapping[related_activity_ids[i]]}); 
          }
          
        }
      }

      // add to filters under the right header (with the wrong name)
      if(filter_obj['recipient_country'] != undefined){
        Countries.getCountries(filter_obj['recipient_country']).then(function(data, status, headers, config){

          for(var i = 0;i < data.data.results.length; i++){
            vm.selectedCountries.push(data.data.results[i]);
          }
          vm.filterSelection.save();
        }, errorFn);
      }

      // add to filters under the right header (with the wrong name)
      if(filter_obj['sector'] != undefined){
        Sectors.getSectors(filter_obj['sector']).then(function(data, status, headers, config){

          for(var i = 0;i < data.data.results.length; i++){
            vm.selectedSectors.push(data.data.results[i]);
          }
          vm.filterSelection.save();
        }, errorFn);
      }

      // add to filters under the right header (with the wrong name)
      if(filter_obj['activity_status'] != undefined){
        ActivityStatus.getStatuses(filter_obj['activity_status']).then(function(data, status, headers, config){

          for(var i = 0;i < data.data.results.length; i++){
            vm.selectedActivityStatuses.push(data.data.results[i]);
          }
          vm.filterSelection.save();
        }, errorFn);
      }
      
      // add to filters under the right header (with the wrong name)
      if(filter_obj['participating_organisation_name'] != undefined){
        var participating_organisation_names = filter_obj['participating_organisation_name'].split(',');

        for(var i = 0;i < participating_organisation_names.length; i++){
          vm.selectedImplementingOrganisations.push({'name': participating_organisation_names[i]}); 
        } 
      }

      // transaction year filter
      if(filter_obj['transaction_date_year'] != undefined){
        vm.selectedTransactionYear.on = true;
        vm.selectedTransactionYear.value = filter_obj['transaction_date_year'];
      }

      // search filter
      if(filter_obj['q'] != undefined){
        vm.search.searchString = filter_obj['q'];
      }

      if(filter_obj['activity_aggregation_incoming_fund_value_gte'] != undefined && filter_obj['activity_aggregation_incoming_fund_value_lte'] != undefined){

        Budget.budget.on = true;
        Budget.budget.value = [filter_obj['activity_aggregation_incoming_fund_value_gte'], filter_obj['activity_aggregation_incoming_fund_value_lte']];
      }

      vm.filterSelection.save();
    }

    vm.removeFilter = function(selectedArr, name, item_id) {

      for (var i = 0; i < selectedArr.length;i++){
        if(name == 'activity_id'){
          if(selectedArr[i]['activity_id'] == item_id){
            selectedArr.splice(i, 1);
            break;
          }
        }
        //mooier maken? lelijk voor org filter 
        else if(typeof selectedArr[i][name] != 'undefined') {
          if(selectedArr[i][name].code == item_id){
            selectedArr.splice(i, 1);
            break;
          }
        }
        else if(selectedArr[i].name == item_id){
          selectedArr.splice(i, 1);
          break;
        }
      }
      FilterSelection.save();
    }

    vm.removeAll = function(selectedArr){
      FilterSelection.removeAll(selectedArr);
    }

    vm.removeBudgetFilter = function(){
      vm.selectedBudget.on = false;
      vm.selectedBudget.value = [0,30000000];
      FilterSelection.save();
      Budget.toReset = true;
    }

    vm.removeTransactionYearFilter = function(){
      vm.selectedTransactionYear.on = false;
      vm.selectedTransactionYear.year = 2015;
      FilterSelection.save();
      Transaction.toReset = true;
    }  


    vm.removeSearch = function(){
      Search.searchString = '';
      FilterSelection.save();
    }

    activate();

  }
})();