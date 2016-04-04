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

    function activate() {

      vm.update();

      $scope.$watch('vm.filterSelection.selectionString', function(valueNew, valueOld){
        if (valueNew !== valueOld){
          vm.update();
        }
      }, true);
    }

    vm.update = function(){
      // for each active activity status, get the results
      var filterString = FilterSelection.selectionString.split('&');
      for(var i = 0;i < filterString.length;i++){
        if (filterString[i].indexOf('participating_organisation_type') > -1){
          delete filterString[i];
        }
      }
      filterString = filterString.join('&');

      Aggregations.aggregation('participating_organisation_type', 'distinct_count', filterString + '&hierarchy=2', 'participating_organisation_type', 999, 1).then(successFn, errorFn);

      function successFn(data, status, headers, config) {
        vm.totalCount = data.data.count;
        vm.implementingOrganisationTypes = data.data.results;
      }

      function errorFn(data, status, headers, config) {
        console.log("getting activity statuses failed");
      }
    }

    vm.save = function(){
      FilterSelection.save();
    }

    activate();

  }
})();
