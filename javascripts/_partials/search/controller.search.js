/**
* SearchController
* @namespace oipa.search
*/
(function () {
  'use strict';

  angular
    .module('oipa.search')
    .controller('SearchController', SearchController);

  SearchController.$inject = ['$scope', '$state', 'Aggregations', 'Activities', 'templateBaseUrl'];

  /**
  * @namespace SearchController
  */
  function SearchController($scope, $state, Aggregations, Activities, templateBaseUrl) {
    var vm = this;
    vm.templateBaseUrl = templateBaseUrl;
    vm.searchString = '';
    vm.showResults = false;
    vm.currentPage = $scope.currentPage;

    vm.searchData = {
      'activities': {'total': 0, 'data': [], 'loaded': false},
      'countries': {'total': 0, 'data': [], 'loaded': false},
      'sectors': {'total': 0, 'data': [], 'loaded': false},
      'organisations': {'total': 0, 'data': [], 'loaded': false},
    }

    activate();
    
    function activate(){
      $scope.$watch('searchValue', function(searchValue){
        if(searchValue != ''){
          vm.searchString = searchValue;
        }
        vm.showResults = false;
      }, true);
    }

    vm.submit = function(){

      // set parameter search and go to search results page
      if(vm.currentPage == 'search'){
        $scope.searchValue = vm.searchString;
        vm.showResults = false;
      } else {
        $state.go('search', { search: vm.searchString });
      }
    }

    vm.search = function(){

      if(vm.searchString.length < 2){
        vm.showResults = false;
        return false;
      }

      function errorFn(data, status, headers, config){
        console.log(data);
      }

      // reset previous search, show results box with loaders
      for (var item in vm.searchData){
        vm.searchData[item].loaded = false;
        vm.searchData[item].data = [];
        vm.searchData[item].total = 0;
      }

      vm.showResults = true;

      // get results from activities
      Activities.list('&q='+vm.searchString, 3, 'count', 1).then(function(data, status, headers, config){
        vm.searchData.activities.data = data.data.objects;
        vm.searchData.activities.total = data.data.meta.total_count;
        vm.searchData.activities.loaded = true;
      }, errorFn);

      // get results from countries aggregation
      Aggregations.aggregation('recipient_country', 'count', '&q_fields=recipient_country&q=' + vm.searchString).then(function(data, status, headers, config){
        vm.searchData.countries.data = data.data.results.slice(0,3);
        vm.searchData.countries.total = data.data.count;
        vm.searchData.countries.loaded = true;
      }, errorFn);


      // get results from sectors aggregation
      Aggregations.aggregation('sector', 'count', '&q_fields=sector&q=' + vm.searchString).then(function(data, status, headers, config){
        vm.searchData.sectors.data = data.data.results.slice(0,3);
        vm.searchData.sectors.total = data.data.count;
        vm.searchData.sectors.loaded = true;
      }, errorFn);

      // get results from organisations aggregation
      Aggregations.aggregation('transaction__receiver-org', 'count', '&q_fields=participating_org&q=' + vm.searchString).then(function(data, status, headers, config){
        vm.searchData.organisations.data = data.data.results.slice(0,3);
        vm.searchData.organisations.total = data.data.count;
        vm.searchData.organisations.loaded = true;
      }, errorFn);
    }

  }
})();