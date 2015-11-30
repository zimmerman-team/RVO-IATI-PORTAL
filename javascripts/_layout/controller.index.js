/**
* IndexController
* @namespace oipa.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('oipa.layout')
    .controller('IndexController', IndexController);

  IndexController.$inject = ['$scope', '$sce', 'FilterSelection'];

  function IndexController($scope, $sce, FilterSelection) {
    var vm = this;

    activate();

    function activate() {

      FilterSelection.reset();
    }
    
  }
})();