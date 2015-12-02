/**
* CountryController
* @namespace oipa.countries
*/
(function () {
  'use strict';

  angular
    .module('oipa.countries')
    .controller('CountryController', CountryController);

  CountryController.$inject = ['$scope', 'Countries', 'templateBaseUrl', '$stateParams', 'FilterSelection', 'Aggregations', 'countryPageUrls', 'homeUrl', '$location'];

  /**
  * @namespace CountryController
  */
  function CountryController($scope, Countries, templateBaseUrl, $stateParams, FilterSelection, Aggregations, countryPageUrls, homeUrl, $location) {
    var vm = this;
    vm.country = null;
    vm.country_id = $stateParams.country_id;
    vm.filterSelection = FilterSelection;
    vm.selectedTab = 'samenvatting';
    vm.countryPageUrl = null;
    vm.disbursements = null;
    vm.budget = null;
    vm.budgetLeft = 0;
    vm.progressStyle = {};
    vm.templateBaseUrl = templateBaseUrl;
    vm.pageUrlDecoded = $location.absUrl();

    vm.tabs = [
      {'id': 'samenvatting', 'name': 'Summary', 'count': -1},
      {'id': 'programmes', 'name': 'Programmes', 'count': -1},
      {'id': 'activities', 'name': 'Projects', 'count': -1},
      {'id': 'sectors', 'name': 'Sectors', 'count': -1},
      {'id': 'implementing-organisations', 'name': 'Project partners', 'count': -1},
    ]

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf oipa.countries.controllers.CountryController
    */
    function activate() {

      $scope.$watch('vm.filterSelection.selectionString', function (selectionString) {
        vm.update(selectionString);
        console.log('TO DO: set filters to oipaPieChart?');
      }, true);

      if(countryPageUrls[vm.country_id] != undefined){
        vm.countryPageUrl = countryPageUrls[vm.country_id].url;  
      }
      
      // for each active country, get the results
      Countries.getCountry(vm.country_id).then(successFn, errorFn);
    

      function successFn(data, status, headers, config) {
        vm.country = data.data;
        Countries.selectedCountries.push({'count': 0, 'recipient_country': {'code':vm.country.code,'name':vm.country.name}});
        FilterSelection.save();
      }

      vm.pageUrl = encodeURIComponent(vm.pageUrlDecoded);
      vm.shareDescription = encodeURIComponent('View the aid projects of the RVO on ' + vm.pageUrlDecoded);
    }

    function errorFn(data, status, headers, config) {
      console.log("getting country failed");
    }

    vm.setBudgetLeft = function(){
      vm.budgetLeft = Math.round(vm.disbursements / vm.budget * 100);
      vm.progressStyle = {'width': vm.budgetLeft + '%'}
      console.log(vm.budgetLeft);
      console.log(vm.progressStyle);
    }

    vm.update = function(selectionString){
      if (selectionString.indexOf("recipient_country") < 0){ return false;}
      
      Aggregations.aggregation('recipient_country', 'disbursement', selectionString).then(function(data, status, headers, config){
        console.log(data);
        vm.disbursements = data.data.results[0].disbursement;
        if(vm.budget){
          vm.setBudgetLeft();
        }
      }, errorFn);

      Aggregations.aggregation('recipient_country', 'incoming_fund', selectionString).then(function(data, status, headers, config){
        vm.budget = data.data.results[0].incoming_fund;
        if(vm.disbursements){
          vm.setBudgetLeft();
        }
      }, errorFn);

    }

    vm.download = function(format){
      var url = homeUrl + '/export/?format=json&filters='+encodeURIComponent(FilterSelection.selectionString);
      if(vm.currentPage == 'activity'){
        url = homeUrl + '/export/?format=json&detail='+$scope.activityId+'&filters=';
      }
      window.open(url);
    }

    activate();

  }
})();