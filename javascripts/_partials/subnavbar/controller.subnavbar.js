/**
* TopNavBarController
* @namespace oipa.partials
*/
(function () {
  'use strict';

  angular
    .module('oipa.partials')
    .controller('SubNavbarController', SubNavbarController);

  SubNavbarController.$inject = ['$scope', '$location'];

  /**
  * @namespace CountriesController
  */
  function SubNavbarController($scope, $location) {
    var vm = this;
    vm.tabs = $scope.tabs;

    function activate(){
      var parameters = $location.search();
      if(parameters['tab'] != undefined){
        vm.openTab(parameters['tab']);
      }
    }

    vm.openTab = function(id){
      $scope.selectedTab = id;
      $location.search('tab', id);

      setTimeout(function(){
        window.dispatchEvent(new Event('resize'));
      }, 10);
    }

    vm.isOpenedTab = function(id){
      return $scope.selectedTab == id;
    }

    activate();
  }
})();
