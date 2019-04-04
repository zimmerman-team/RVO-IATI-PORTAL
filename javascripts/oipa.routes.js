(function () {
    'use strict';

    angular
      .module('oipa.routes')
      .config(config);

    config.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'templateBaseUrl', ];

    var filters = '?filters&tab';

    /**
    * @name config
    * @desc Define valid application routes
    */
    function config($stateProvider, $locationProvider, $routeProvider, templateBaseUrl){

      $locationProvider.html5Mode(true);
      $routeProvider.otherwise('/');

      $stateProvider
        .state({
            name:         'home',
            url:          '/',
            controller:   'IndexController',
            controllerAs: 'vm',
            templateUrl:  templateBaseUrl + '/templates/_layout/index.html',
            ncyBreadcrumb: {
                label: 'Home'
            }
        })
        .state({
            name:         'activities',
            url:          '/projects/' + filters,
            reloadOnSearch: false,
            controller:   'ActivitiesExploreController',
            controllerAs: 'vm',
            templateUrl:  templateBaseUrl + '/templates/activities/activities-view-list-map.html',
            ncyBreadcrumb: {
                label: 'IATI Explorer'
            }
        })
        .state({
            name:         'activities-list',
            url:          '/projects/lijst/' + filters,
            reloadOnSearch: false,
            controller:   'ActivitiesExploreController',
            controllerAs: 'vm',
            templateUrl:  templateBaseUrl + '/templates/activities/activities-view-list.html',
            ncyBreadcrumb: {
                label: 'IATI Explorer'
            }
        })
        .state({
            name:        'activiteit',
            url:         '/projects/:activity_id/?tab',
            controller:  'ActivityController',
            controllerAs: 'vm',
            templateUrl: templateBaseUrl + '/templates/activities/activity-view-detail.html',
            ncyBreadcrumb: {
                label: 'IATI Activiteit detail pagina'
            }
        })
        .state({
            name:        'locations-map',
            url:         '/countries/list/' + filters,
            reloadOnSearch: false,
            controller:  'LocationsMapListController',
            controllerAs: 'vm',
            templateUrl: templateBaseUrl + '/templates/locations/locations-view-map-list.html',
            ncyBreadcrumb: {
                label: 'Locaties'
            }
        })
        .state({
            name:        'locations-polygonmap',
            url:         '/countries/map/' + filters,
            reloadOnSearch: false,
            controller:  'LocationsPolygonGeoMapController',
            controllerAs: 'vm',
            templateUrl: templateBaseUrl + '/templates/locations/locations-view-map-polygons.html',
            ncyBreadcrumb: {
                label: 'Locaties'
            }
        })
        .state({
            name:        'country',
            url:         '/countries/:country_id/' + filters,
            reloadOnSearch: false,
            controller:  'CountryController',
            controllerAs: 'vm',
            templateUrl: templateBaseUrl + '/templates/countries/country-view-detail.html',
            ncyBreadcrumb: {
                parent: 'countries',
                label: '{{vm.country.name}}'
            }
        })
        .state({
            name:        'organisations',
            url:         '/organisations/' + filters,
            reloadOnSearch: false,
            controller:  'ImplementingOrganisationsExploreController',
            controllerAs: 'vm',
            templateUrl: templateBaseUrl + '/templates/implementingOrganisations/implementing-organisations-view-list.html'
        })
        .state({
            name:        'organisation',
            url:         '/organisations/:organisation_id/:type' + filters,
            reloadOnSearch: false,
            controller:  'ImplementingOrganisationController',
            controllerAs: 'vm',
            templateUrl: templateBaseUrl + '/templates/implementingOrganisations/implementing-organisation-view-detail.html'
        })
        .state({
            name:        'programmes',
            url:         '/programmes/' + filters,
            reloadOnSearch: false,
            controller:  'ProgrammesExploreController',
            controllerAs: 'vm',
            templateUrl: templateBaseUrl + '/templates/programmes/programmes-view-list.html'
        })
        .state({
            name:        'programme',
            url:         '/programmes/:programme_id/?tab',
            reloadOnSearch: false,
            controller:  'ProgrammeController',
            controllerAs: 'vm',
            templateUrl: templateBaseUrl + '/templates/programmes/programme-view-detail.html'
        })
        .state({
            name:        'sectors',
            url:         '/sectors/' + filters,
            reloadOnSearch: false,
            controller:  'SectorsExploreController',
            controllerAs: 'vm',
            templateUrl: templateBaseUrl + '/templates/sectors/sectors-view-list.html'
        })
        .state({
            name:        'sectors-vis',
            url:         '/sectors/vis/' + filters,
            reloadOnSearch: false,
            controller:  'SectorsVisualisationController',
            controllerAs: 'vm',
            templateUrl: templateBaseUrl + '/templates/sectors/sectors-view-visualisation.html'
        })
        .state({
            name:        'sector',
            url:         '/sectors/:sector_id/' + filters,
            reloadOnSearch: false,
            controller:  'SectorController',
            controllerAs: 'vm',
            templateUrl: templateBaseUrl + '/templates/sectors/sector-view-detail.html'
        })
        .state({
            name:        'about',
            url:         '/about/',
            controller:  'PagesController',
            controllerAs: 'vm',
            templateUrl: templateBaseUrl + '/templates/pages/pages.html',
            ncyBreadcrumb: {
                label: '{{vm.title}}'
            }
        })
        .state({
            name:        'iati-publiceren',
            url:         '/iati-publiceren/',
            controller:  'PagesController',
            controllerAs: 'vm.post.title',
            templateUrl: templateBaseUrl + '/templates/pages/pages.html'
        })
        .state({
            name:         'results',
            url:          '/results/' + filters,
            reloadOnSearch: false,
            controller:   'ResultsPageController',
            controllerAs: 'vm',
            templateUrl:  templateBaseUrl + '/templates/results/results-page.html',
        })
        .state({
            name:        'search',
            url:         '/search/?search&tab&filters',
            controller:  'SearchPageController',
            controllerAs: 'vm',
            templateUrl: templateBaseUrl + '/templates/search/search-page.html'
        });
    }
})();
