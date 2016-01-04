/**
* ActivityGeoMapController
* @namespace oipa.locations
*/
(function () {
  'use strict';

  angular
    .module('oipa.activities')
    .controller('ActivityGeoMapController', ActivityGeoMapController);

  ActivityGeoMapController.$inject = ['$scope', 'leafletData', 'homeUrl'];

  /**
  * @namespace ActivityGeoMapController
  */
  function ActivityGeoMapController($scope, leafletData, homeUrl) {
    var vm = this;

    vm.defaults = {
      tileLayer: 'https://{s}.tiles.mapbox.com/v3/zimmerman2014.483b5b1a/{z}/{x}/{y}.png',
      maxZoom: 14,
      minZoom: 2,
      attributionControl: false,
      scrollWheelZoom: false,
      continuousWorld: false,
    };
    vm.center = {
        lat: 14.505,
        lng: 18.00,
        zoom: 8
    };
    vm.markers = {};
    vm.markerIcons = { 
      Country: { html: '<div class="fa fa-map-marker fa-stack-1x fa-inverse marker-circle marker-circle-Other"></div>',type: 'div',iconSize: [28, 35],iconAnchor: [14, 18],markerColor: 'blue',iconColor: 'white',},
    };

    vm.activity = $scope.activity;


    function activate() {

        $scope.$watch('activity', function(activity){
            if(activity){
                vm.activity = activity;
                vm.updateGeo();
            }
        }, true);
    }

    vm.updateGeo = function(){
        vm.updateCountryMarkers();

        console.log(vm.activity);

        leafletData.getMap().then(function(map) {
            map.fitBounds(vm.getBounds());
            if(map._zoom > 7){
              map.setZoom(7);
            }
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


    vm.updateCountryMarkers = function() {
      
      // to finish!
      //
      // if (vm.activity.locations.length == 0) {
      //   for (var i = 0; i < vm.activity.recipient_countries.length;i++){
      //     var country = vm.activity.recipient_countries[i];
      //     vm.markers[i] = {
      //         lat: parseFloat(0),
      //         lng: parseFloat(0),
      //         icon: vm.markerIcons['Country'],
      //     }
      //   }
      // }

      // else {

        for (var i = 0; i < vm.activity.locations.length;i++){

          var location = vm.activity.locations[i];
          vm.markers[i] = {
              lat: parseFloat(location.point.pos.latitude),
              lng: parseFloat(location.point.pos.longitude),
              icon: vm.markerIcons['Country'],
          }
        }

      //}

    }

    activate();
  }
})();