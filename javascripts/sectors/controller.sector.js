/**
* CountriesController
* @namespace oipa.countries.controllers
*/
var sectorLayoutTest = null;
(function () {
  'use strict';

  angular
    .module('oipa.sectors')
    .controller('SectorController', SectorController);

  SectorController.$inject = ['$scope', 'Sectors', 'templateBaseUrl', '$stateParams', 'FilterSelection', 'Aggregations', 'sectorMapping', 'homeUrl', '$location'];

  /**
  * @namespace CountriesController
  */
  function SectorController($scope, Sectors, templateBaseUrl, $stateParams, FilterSelection, Aggregations, sectorMapping, homeUrl, $location) {
    var vm = this;
    vm.sector = null;
    vm.sector_id = parseInt($stateParams.sector_id);
    vm.sector_digit = 0;
    vm.filterSelection = FilterSelection;
    vm.selectedTab = 'samenvatting';
    vm.pageUrlDecoded = $location.absUrl();

    vm.tabs = [
      {'id': 'samenvatting', 'name': 'Summary', 'count': -1},
      {'id': 'programmes', 'name': 'Programmes', 'count': -1},
      {'id': 'activities', 'name': 'Projects', 'count': -1},
      {'id': 'countries', 'name': 'Countries', 'count': -1},
      {'id': 'implementing-organisations', 'name': 'Project partners', 'count': -1},
    ]

    // to do , make this smarter
    function findSector(needle, haystack){
      for(var i = 0; i < haystack.length; i++){
        if(haystack[i].sector_id == needle){
          vm.sector = haystack[i];
          break;
        }
        if(haystack[i].hasOwnProperty('children')){
          findSector(needle, haystack[i].children);
        }
      }
    }

    function listChildren(arr, sector){
      if(sector.hasOwnProperty('children')){
        for(var i = 0; i < sector.children.length; i++){
          if(parseInt(sector.children[i].sector_id) > 9999){
            arr.push(sector.children[i]);  
          }
          if(sector.children[i].hasOwnProperty('children')){
            arr = listChildren(arr, sector.children[i]);
          }
        }
      }
      return arr;
    }

    function activate() {


      if(vm.sector_id < 100){
        vm.sector_digit = 2;
      } else if(100 < vm.sector_id && vm.sector_id < 9999){
        vm.sector_digit = 3;
      } else {
        vm.sector_digit = 5;
      }
      findSector(vm.sector_id, sectorMapping.children);
      var sectors = listChildren([],vm.sector);

      if(vm.sector_digit == 5){
        Sectors.selectedSectors.push({'sector': {"code":vm.sector.sector_id,"name":vm.sector.name}});
      }

      for (var i = 0;i < sectors.length;i++){
        Sectors.selectedSectors.push({'sector': {"code":sectors[i].sector_id,"name":sectors[i].name}});
      }
      FilterSelection.save();



      $scope.$watch('vm.filterSelection.selectionString', function (selectionString) {
        vm.update(selectionString);
      }, true);
      vm.pageUrl = encodeURIComponent(vm.pageUrlDecoded);
      vm.shareDescription = encodeURIComponent('View the aid projects of the RVO on ' + vm.pageUrlDecoded);
    }

    function errorFn(data, status, headers, config) {
      console.log("getting sectors failed");
    }

    vm.setBudgetLeft = function(){
      vm.budgetLeft = Math.round(vm.disbursements / vm.budget * 100);
      vm.progressStyle = {'width': vm.budgetLeft + '%'}
    }

    vm.update = function(selectionString){

      if (selectionString.indexOf("sector") < 0){ return false;}

      Aggregations.aggregation('sector', 'disbursement', selectionString).then(function(data, status, headers, config){
        vm.disbursements = data.data.results.length ? data.data.results[0].disbursement : 0;
        vm.setBudgetLeft();
      }, errorFn);

      Aggregations.aggregation('sector', 'incoming_fund', selectionString).then(function(data, status, headers, config){
        vm.budget = data.data.results.length ? data.data.results[0].incoming_fund : 0;
        vm.setBudgetLeft();
      }, errorFn);

    }

    vm.download = function(format){
      var url = homeUrl + '/export/?format=json&filters='+encodeURIComponent(FilterSelection.selectionString);
      window.open(url);
    }

    activate();

  }
})();