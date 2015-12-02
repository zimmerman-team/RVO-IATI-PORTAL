/**
* LocationsGeoMapController
* @namespace oipa.locations
*/
(function () {
  'use strict';

  angular
    .module('oipa.locations')
    .controller('LocationsGeoMapController', LocationsGeoMapController);

  LocationsGeoMapController.$inject = ['$scope', 'leafletData', 'Aggregations', 'Activities', 'templateBaseUrl', 'homeUrl', 'FilterSelection', '$filter'];

  /**
  * @namespace LocationsGeoMapController
  */
  function LocationsGeoMapController($scope, leafletData, Aggregations, Activities, templateBaseUrl, homeUrl, FilterSelection, $filter) {
    var vm = this;
    vm.mapHeight = $scope.mapHeight;
    vm.mapDropdown = $scope.mapDropdown;
    vm.templateBaseUrl = templateBaseUrl;

    vm.defaults = {
      maxZoom: 10,
      minZoom: 2,
      attributionControl: false,
      scrollWheelZoom: false,
      zoomControlPosition: 'topright'
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
              continuousWorld: false
          }
        }
      },
      overlays: {
        locations: {
            name: 'locations',
            type: 'markercluster',
            visible: true
        }
      }, 
    }

    vm.center = {
        lat: 14.505,
        lng: 18.00,
        zoom: 5
    };

    vm.markers = {};
    vm.markerIcon = { html: '<div class="fa fa-map-marker fa-stack-1x fa-inverse marker-circle marker-circle-Other2"></div>',type: 'div',iconSize: [28, 35],iconAnchor: [14, 18],markerColor: 'blue',iconColor: 'white',};

    vm.filterSelection = FilterSelection;
    vm.selectionString = '';

    vm.countryMarkerData = [];
    
    vm.resultCounter = 0;

    vm.geoLocation = null;

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf oipa.countries.controllers.CountriesController
    */
    function activate() {

      if($scope.exactLocation !== undefined){
        
        $scope.$watch('exactLocation', function (exactLocation) {
          if(exactLocation){
            vm.geoLocation = exactLocation;
            vm.showExactLocation();
          }
          
        }, true);

      } else {
        $scope.$watch('vm.filterSelection.selectionString', function (selectionString) {
          vm.selectionString = selectionString;
          vm.updateMap();
        }, true);
      }
    }

    vm.showExactLocation = function() {

      if(!vm.geoLocation.center_longlat){
        return false;
      }

      var location = vm.geoLocation.center_longlat.replace('POINT (', '').replace(')', '');
      location = location.split(' ');

      vm.center.lat = parseInt(location[1]);
      vm.center.lng = parseInt(location[0]);

      vm.markers['location'] = {
        lat: parseInt(location[1]),
        lng: parseInt(location[0]),
      }

      if (vm.geoLocation.code === parseInt(vm.geoLocation.code, 10))
        vm.markers['location'].icon = { html: '<div class="region-marker-circle"></div>' ,type: 'div',iconSize: [200, 200],iconAnchor: [100, 100],markerColor: 'blue',iconColor: 'white',};
      else
        vm.markers['location'].icon = { html: '<div class="fa fa-map-marker fa-stack-1x fa-inverse marker-circle marker-circle-Other2"></div>',type: 'div',iconSize: [28, 35],iconAnchor: [14, 18],markerColor: 'blue',iconColor: 'white',};
      
        
    };


    vm.updateMap = function(){

      Activities.locations(vm.selectionString).then(function(data,status,headers,config){

        vm.deleteAllMarkers();
        var newMarkers = {};
        var results = data.data.results;

        for (var r in results){
          for (var l in r.locations){

            console.log(l);

            var message = '<h4>'+results[r].title.narratives[0].text+'</h4><hr><a target="_blank" href="'+homeUrl+'/projects/'+results[r].id+'/"><i class="icon graph"></i>Go to project overview</a>';

            newMarkers[r + '_' + l] = {
              lat: parseInt(r.locations[l].point.pos.latitude),
              lng: parseInt(r.locations[l].point.pos.longitude),
              layer: 'locations',
              message: message
            };
          }
        }
        vm.markers = newMarkers;

      }, function(data,status,headers,config){
        console.log('failed');
        console.log(data);
      });

    }

    vm.deleteAllMarkers = function(){

      for (var obj in vm.markers) {
        delete vm.markers[obj];
      }
    }
    

    activate();
  }
})();