/**
* ProgrammesController
* @namespace oipa.programmes.controllers
*/
(function () {
  'use strict';

  angular
    .module('oipa.programmes')
    .controller('ProgrammesController', ProgrammesController);

  ProgrammesController.$inject = ['$scope', 'Aggregations', 'Activities', 'Programmes', 'programmesMapping', 'FilterSelection', 'templateBaseUrl'];

  /**
  * @namespace SectorsController
  */
  function ProgrammesController($scope, Aggregations, Activities, Programmes, programmesMapping, FilterSelection, templateBaseUrl) {
    var vm = this;
    vm.templateBaseUrl = templateBaseUrl;
    vm.programmes_list = [];
    vm.programmes = Programmes;
    vm.selectedProgrammes = Programmes.selectedProgrammes;
    vm.currentPage = 1;
    vm.pageSize = 4;
    vm.totalCount = 0;
    vm.q = '';
    vm.filterSelection = FilterSelection;

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf oipa.sectors.controllers.SectorsController
    */
    function activate() {

      vm.offset = 0;
      vm.update();

      $scope.$watch('vm.q', function(valueNew, valueOld){
        if (valueNew !== valueOld){
          vm.offset = 0;
          vm.currentPage = 1;
          vm.update();
        }
      }, true);

      $scope.$watch('vm.filterSelection.selectionString', function(valueNew, valueOld){
        if (valueNew !== valueOld){
          vm.offset = 0;
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
      var filterString = FilterSelection.selectionString.split('&');
      for(var i = 0;i < filterString.length;i++){
        if (filterString[i].indexOf('related_activity_id') > -1){
          delete filterString[i];
        }
      }
      filterString = filterString.join('&');
      
      Aggregations.aggregation('related_activity', 'count', filterString, 'related_activity', vm.pageSize, vm.currentPage).then(successFn, errorFn);

      function successFn(data, status, headers, config) {

        var results = data.data.results;
        for(var i = 0;i < results.length;i++){
          results[i].name = programmesMapping[results[i].related_activity];
        }
        vm.totalCount = data.data.count;
        vm.programmes_list = results;
      }

      function errorFn(data, status, headers, config) {
        console.log("getting sectors failed");
      }
    }

    vm.save = function(){
      FilterSelection.save();
    }

    activate();

  }
})();
