(function () {
  'use strict';

  angular
    .module('oipa.sectors')
    .controller('SdgsExploreController', SdgsExploreController);

  SdgsExploreController.$inject = ['$scope', 'FilterSelection', 'TransactionAggregations'];

  /**
  * @namespace SectorsController
  */
  function SdgsExploreController($scope, FilterSelection, TransactionAggregations) {
    
    var vm = this
    vm.sdg_goal_ids = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]



    function activate() {
      FilterSelection.reset();

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


    vm.update = function(){

      Aggregations.aggregation('sector', 'count', filterString + '&sector_vocabulary=8', 'sector', 400, 1).then(successFn, errorFn);

      function successFn(data, status, headers, config) {
        vm.totalCount = data.data.count;
        vm.recipientSectors = data.data.results;
      }

      function errorFn(data, status, headers, config) {
        console.log("getting sectors failed");
      }
    }

    vm.save = function(){
      FilterSelection.save();
    }




    // get count on all sdg tags


    activate();
  }
})();