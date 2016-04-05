/**
* subNavbar
* @namespace oipa.partials
*/
(function () {
  'use strict';

  angular
    .module('oipa.partials')
    .directive('shareLinks', shareLinks);

  shareLinks.$inject = ['templateBaseUrl'];

  function shareLinks(templateBaseUrl) {

    var directive = {
      controller: 'ShareLinksController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {},
      templateUrl: templateBaseUrl + '/templates/_partials/sharelinks/share-links.html'
    };

    return directive;
  }
})();