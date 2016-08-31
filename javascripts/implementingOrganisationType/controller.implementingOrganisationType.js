(function () {
  'use strict';

  angular
    .module('oipa.activityStatus')
    .controller('ImplementingOrganisationTypeController', ImplementingOrganisationTypeController);

  ImplementingOrganisationTypeController.$inject = ['$scope', 'Aggregations', 'ImplementingOrganisationType', 'FilterSelection', 'templateBaseUrl'];

  function ImplementingOrganisationTypeController($scope, Aggregations, ImplementingOrganisationType, FilterSelection, templateBaseUrl) {
    var vm = this;
    vm.templateBaseUrl = templateBaseUrl;
    vm.activityStatuses = [];
    vm.statuses = ImplementingOrganisationType;
    vm.selectedImplementingOrganisationTypes = ImplementingOrganisationType.selectedImplementingOrganisationTypes;
    vm.filterSelection = FilterSelection;
    vm.q = '';
    vm.currentPage = 1;
    vm.page_size = 4;
    vm.totalCount = 0;

    function activate() {

      vm.update();

      $scope.$watch('vm.q', function(valueNew, valueOld){
        if (valueNew !== valueOld){
          vm.currentPage = 1;
          vm.update();
        }
      }, true);

      $scope.$watch('vm.filterSelection.selectionString', function(valueNew, valueOld){
        if (valueNew !== valueOld){
          vm.currentPage = 1;
          vm.update();
        }
      }, true);
    }

    vm.pageChanged = function(newPageNumber){
      vm.currentPage = newPageNumber;
      vm.update();
    }

    vm.update = function(){
      // for each active implementing organisation type, get the results
      var filterString = FilterSelection.selectionString.split('&');
      for(var i = 0;i < filterString.length;i++){
        if (filterString[i].indexOf('participating_organisation_type') > -1){
          delete filterString[i];
        }
      }
      filterString = filterString.join('&');
      
      if(vm.q != ''){
        filterString += '&q=' + vm.q;
      }

      Aggregations.aggregation('participating_organisation_type', 'count_distinct', filterString + '&hierarchy=2', 'participating_organisation_type', vm.page_size, vm.currentPage).then(successFn, errorFn);

      function successFn(data, status, headers, config) {
        vm.totalCount = data.data.count;
        vm.implementingOrganisationTypes = data.data.results;
      }

      function errorFn(data, status, headers, config) {
        console.log("getting implementing organisation types failed");
      }
    }

    vm.save = function(){
      FilterSelection.save();
    }

    activate();

  }
})();
