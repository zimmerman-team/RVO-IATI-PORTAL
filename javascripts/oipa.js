(function () {
    'use strict';

    angular
        .module('oipa', [
            // 'ngAnimate',
            'checklist-model',
            'ui.bootstrap-slider',
            'ncy-angular-breadcrumb',
            'angularUtils.directives.dirPagination',
            'nvd3',
            'leaflet-directive',
            'infinite-scroll',
            'oipa.constants',
            'oipa.config',
            'oipa.routes',
            'oipa.layout',
            'oipa.partials',
            'oipa.charts',
            'oipa.search',
            'oipa.toolbar',
            'oipa.aggregations',
            'oipa.countries',
            'oipa.programmes',
            'oipa.locations',
            'oipa.sectors',
            'oipa.filters',
            'oipa.budget',
            'oipa.activityStatus',
            'oipa.pages',
            'oipa.implementingOrganisations',
            'oipa.implementingOrganisationType',
            'oipa.bubbleChart',
            'oipa.sunburst',
            'oipa.tabs',
            'oipa.activities',
            'oipa.policyMarkers',
            'oipa.stackedBarChart',
            'oipa.searchPage',
        ]);

    angular
        .module('oipa.constants', []);

    angular
        .module('oipa.config', ['angularUtils.directives.dirPagination']);

    angular
        .module('oipa.routes', ['ui.router']);

    angular
        .module('oipa')
        .run(run);

    run.$inject = ['$http', '$rootScope', '$urlRouter', '$location', '$state'];

    function run($http, $rootScope, $urlRouter, $location, $state) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';

        var original = $location.path;
        $location.path = function (path, reload) {
            $location.reload = false;
            return original.apply($location, [path]);
        };


        $rootScope.$on('$locationChangeSuccess', function(e, newUrl, oldUrl) {
          // Prevent $urlRouter's default handler from firing
          e.preventDefault();

           if($location.reload != undefined){
            delete $location['reload'];
           } else {
            $urlRouter.sync();
           }

        });
        // Configures $urlRouter's listener *after* your custom listener
        $urlRouter.listen();
    }

})();
