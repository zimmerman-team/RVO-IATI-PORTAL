(function () {
  'use strict';

  angular
    .module('oipa.results')
    .controller('ResultsPageController', ResultsPageController);

  ResultsPageController.$inject = ['FilterSelection'];

  function ResultsPageController(FilterSelection) {
  	function activate() {
    	FilterSelection.reset();
    }

    activate();
  }
})();