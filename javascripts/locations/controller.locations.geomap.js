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
    vm.hasToContain = $scope.hasToContain;

    vm.markerIcon = { html: '<div class="fa fa-map-marker fa-stack-1x fa-inverse marker-circle marker-circle-Other"></div>',type: 'div',iconSize: [28, 35],iconAnchor: [14, 18],markerColor: 'blue',iconColor: 'white',};

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
        lat: -59.204,
        lng: -131.484,
        zoom: 5
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

      $scope.$watch('vm.filterSelection.selectionString', function (selectionString, oldSelectionString) {
        //if(selectionString == oldSelectionString){ return false; }
        vm.selectionString = selectionString;
        vm.updateMap();
      }, true);
    }

    vm.hasContains = function(){

      if(vm.hasToContain !== undefined){
        var totalString = vm.filterSelection.selectionString + vm.extraSelectionString;
        if(totalString.indexOf(vm.hasToContain) < 0){
          return false;
        }
      }
      return true;
    }

    vm.updateMap = function(){
      if (!vm.hasContains()) return false;

      Activities.locations(vm.selectionString).then(function(data,status,headers,config){
        vm.deleteAllMarkers();
        var newMarkers = {};
        var results = data.data.results;

        for (var r in results){
          for (var l in results[r].locations){
            var message = '<h4>'+results[r].title.narratives[0].text+'</h4><hr><a target="_blank" href="'+homeUrl+'/projects/'+results[r].id+'/"><i class="icon graph"></i>Go to project overview</a>';

            var lat = parseFloat(results[r].locations[l].point.pos.latitude);
            var lng = parseFloat(results[r].locations[l].point.pos.longitude);

            if (lat < -180 || lat > 180 || lng < -180 || lng > 180){ continue; }

            newMarkers[r + '_' + l] = {
              lat: lat,
              lng: lng,
              layer: 'locations',
              message: message,
              icon: vm.markerIcon,
            };
          }
        }
        vm.markers = newMarkers;

        leafletData.getMap().then(function(map) {
            map.fitBounds(vm.getBounds());
            map.addOneTimeEventListener('moveend', function() {
              if(map._zoom > 1){
                map.setZoom(map._zoom - 1);
              }
            });
        });

      }, function(data,status,headers,config){
        console.log('failed');
      });
    }

    vm.getBounds = function(){
        var minlat = 0;
        var maxlat = 0;
        var minlng = 0;
        var maxlng = 0;
        var first = true;
        for (var marker in vm.markers){

            var value = vm.markers[marker];
            var curlat = value.lat;
            var curlng = value.lng;

            if (first){
                minlat = curlat;
                maxlat = curlat;
                minlng = curlng;
                maxlng = curlng;
            }

            if (curlat < minlat){
                minlat = curlat;
            }
            if (curlat > maxlat){
                maxlat = curlat;
            }
            if (curlng < minlng){
                minlng = curlng;
            }
            if (curlng > maxlng){
                maxlng = curlng;
            }

            first = false;
        }

        return [[minlat, minlng],[maxlat, maxlng]];
    }


    vm.deleteAllMarkers = function(){

      for (var obj in vm.markers) {
        delete vm.markers[obj];
      }
    }
    

    activate();
  }
})();
