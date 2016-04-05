/**
* TopNavBarController
* @namespace oipa.partials
*/
(function () {
  'use strict';

  angular
    .module('oipa.partials')
    .controller('ShareLinksController', ShareLinksController);

  ShareLinksController.$inject = ['$location', '$rootScope'];

  /**
  * @namespace CountriesController
  */
  function ShareLinksController($location, $rootScope) {
    var vm = this;
    vm.pageUrl = '';
    vm.shareDescription = '';

    function updateShareLinks(){
      var pageUrlDecoded = $location.absUrl();
      vm.pageUrl = encodeURIComponent(pageUrlDecoded);
      vm.shareDescription = encodeURIComponent('View the aid projects of the RVO on ' + pageUrlDecoded);
    }

    function activate(){

        $rootScope.$on('$locationChangeSuccess', function(e, newUrl, oldUrl) {
            updateShareLinks();
        });

        updateShareLinks();
    }

    activate();
  }
})();
