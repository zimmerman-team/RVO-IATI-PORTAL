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

      

    }

    // get count on all sdg tags


    activate();
  }
})();