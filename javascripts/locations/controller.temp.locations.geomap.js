/**
* LocationsGeoMapController
* @namespace oipa.locations
*/
(function () {
  'use strict';

  angular
    .module('oipa.locations')
    .controller('TempLocationsGeoMapController', TempLocationsGeoMapController);

  TempLocationsGeoMapController.$inject = ['$scope', 'leafletData', 'Aggregations', 'Activities', 'templateBaseUrl', 'homeUrl', 'FilterSelection', '$filter'];

  /**
  * @namespace LocationsGeoMapController
  */
  function TempLocationsGeoMapController($scope, leafletData, Aggregations, Activities, templateBaseUrl, homeUrl, FilterSelection, $filter) {
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
        zoom: 3
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

      function countrySuccessFn(data, status, headers, config) {
          vm.countryMarkerData = data.data.results;
          vm.updateCountryMarkers();
      }


      function errorFn(data, status, headers, config) {
          console.log("getting countries failed");
      }
    }

    vm.deleteAllMarkers = function(){

      for (var obj in vm.markers) {
        delete vm.markers[obj];
      }
    }

    vm.updateCountryMarkers = function(markerData) {
      console.log('TO DO (if needed): update or delete updateCountryMarkers');
 
        vm.deleteAllMarkers();

        for (var i = 0; i < vm.countryMarkerData.length;i++){
         
            var message = '<span class="flag-icon flag-icon-'+vm.countryMarkerData[i].country_id.toLowerCase()+'"></span>'+
                  '<h4>'+vm.countryMarkerData[i].name+'</h4>'+
                  '<p><b>Activities:</b> '+vm.countryMarkerData[i]['activity_count']+'</p>'+
                  '<p><b>Total budget:</b> '+ $filter('shortcurrency')(vm.countryMarkerData[i]['total_disbursements'],'€') +'</p>'+
                  '<a class="btn btn-default" href="'+homeUrl+'/landen/'+vm.countryMarkerData[i].country_id+'/">Go to country overview</a>';

            if(vm.markers[vm.countryMarkerData[i].country_id] === undefined){
              if(vm.countryMarkerData[i].location != null){
                var location = vm.countryMarkerData[i].location.substr(6, (vm.countryMarkerData[i].location.length - 7));
                location = location.split(' ');
                var flag = vm.countryMarkerData[i].country_id;
                var flag_lc = flag.toLowerCase();
                vm.markers[vm.countryMarkerData[i].country_id] = {
                  lat: parseInt(location[1]),
                  lng: parseInt(location[0]),
                  icon: vm.markerIcon,
                }
              }
            }
            vm.markers[vm.countryMarkerData[i].country_id].message = message;
          }
      }
    

    activate();
  }
})();