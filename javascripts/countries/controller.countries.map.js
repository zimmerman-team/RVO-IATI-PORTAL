/**
* CountriesMapController
* @namespace oipa.countries
*/

(function () {
  'use strict';

  angular
    .module('oipa.countries')
    .controller('CountriesMapController', CountriesMapController);

  CountriesMapController.$inject = ['$scope', 'leafletData', 'Aggregations', 'templateBaseUrl', 'homeUrl', 'FilterSelection', '$sce', '$filter', 'countryLocations'];

  /**
  * @namespace CountriesMapController
  */
  function CountriesMapController($scope, leafletData, Aggregations, templateBaseUrl, homeUrl, FilterSelection, $sce, $filter, countryLocations) {
    var vm = this;
    vm.mapHeight = $scope.mapHeight;
    vm.templateBaseUrl = templateBaseUrl;

    vm.currentHoverText = '';

    vm.defaults = {
      tileLayer: 'https://{s}.tiles.mapbox.com/v3/zimmerman2014.deb5109d/{z}/{x}/{y}.png',
      maxZoom: 12,
      minZoom: 2,
      attributionControl: false,
      scrollWheelZoom: false,
      zoomControlPosition: 'topright'
    };
    vm.center = {
        lat: 14.505,
        lng: 18.00,
        zoom: 2
    };

    vm.layers = {
      baselayers: {
        osm: {
          name: 'OpenStreetMap',
          type: 'xyz',
          url: 'https://{s}.tiles.mapbox.com/v3/zimmerman2014.deb5109d/{z}/{x}/{y}.png',
          layerOptions: {
              subdomains: ['a', 'b', 'c'],
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }
        }
      },
    };

    vm.markers = {};
    vm.markerIcon = { html: '<div class="fa fa-map-marker fa-stack-1x fa-inverse marker-circle marker-circle-Other2"></div>',type: 'div',iconSize: [28, 35],iconAnchor: [14, 18],markerColor: 'blue',iconColor: 'white',};

    vm.filterSelection = FilterSelection;
    vm.selectionString = '';

    vm.countryMarkerData = [];

    vm.resultCounter = 0;

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf oipa.countries.controllers.CountriesController
    */
    function activate() {

      $scope.$watch('vm.filterSelection.selectionString', function (selectionString) {
        vm.selectionString = selectionString;
        vm.updateMap();
      }, true);
    }

    vm.updateMap = function(){

        Aggregations.aggregation('recipient_country', 'count,incoming_fund', vm.selectionString).then(countrySuccessFn, errorFn);
        
        function countrySuccessFn(data, status, headers, config) {
            vm.countryMarkerData = data.data.results;
            vm.updateCountryMarkers();
        }

        function errorFn(data, status, headers, config) {
            console.log("getting countries failed");
        }
    }

    vm.hoverIn = function(id){
      vm.buttonTexts[id].hoverShow = true;
      vm.currentHoverText =  $sce.trustAsHtml(vm.buttonTexts[id].text);
    };

    vm.hoverOut = function(id){
        vm.buttonTexts[id].hoverShow = false;
    };

    vm.deleteAllMarkers = function(){

      for (var obj in vm.markers) {
        delete vm.markers[obj];
      }
    }

    vm.updateCountryMarkers = function(markerData) {
      
      vm.deleteAllMarkers();

      for (var i = 0; i < vm.countryMarkerData.length;i++){
       
        var message = '<h4><span class="flag-icon flag-icon-'+vm.countryMarkerData[i].recipient_country.code.toLowerCase()+'"></span>'+vm.countryMarkerData[i].recipient_country.name+'</h4>'+
              '<hr>'+
              '<p><i class="icon lightbulb"></i><b>Projects:</b> '+vm.countryMarkerData[i]['count']+'</p>'+
              '<p><i class="icon euro"></i><b>Total budget:</b> '+ $filter('shortcurrency')(vm.countryMarkerData[i]['incoming_fund'],'€') +'</p>'+
              // '<p><i class="icon medal"></i><b>Sectors:</b> '+ vm.countryMarkerData[i]['sector_count'] +'</p>'+
              '<hr>'+
              '<a href="'+homeUrl+'/countries/'+vm.countryMarkerData[i].recipient_country.code+'/"><i class="icon graph"></i>Go to country overview</a>';

        if(vm.markers[vm.countryMarkerData[i].recipient_country.code] === undefined){
          if(countryLocations[vm.countryMarkerData[i].recipient_country.code] != undefined){
            var coordinates = countryLocations[vm.countryMarkerData[i].recipient_country.code].location.coordinates;
            vm.markers[vm.countryMarkerData[i].recipient_country.code] = {
              lat: parseInt(coordinates[1]),
              lng: parseInt(coordinates[0]),
              icon: vm.markerIcon,
            }
          }
        }
        vm.markers[vm.countryMarkerData[i].recipient_country.code].message = message;   
      }
    }

    activate();
  }
})();
