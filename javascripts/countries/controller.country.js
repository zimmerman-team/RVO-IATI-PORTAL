/**
* CountryController
* @namespace oipa.countries
*/
(function () {
  'use strict';

  angular
    .module('oipa.countries')
    .controller('CountryController', CountryController);

  CountryController.$inject = ['$scope', 'Countries', 'templateBaseUrl', '$stateParams', 'FilterSelection', 'Aggregations', 'countryPageUrls', 'homeUrl', '$location', 'uploadBaseUrl'];

  /**
  * @namespace CountryController
  */
  function CountryController($scope, Countries, templateBaseUrl, $stateParams, FilterSelection, Aggregations, countryPageUrls, homeUrl, $location, uploadBaseUrl) {
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
    vm.loading = true;
    vm.uploadBaseUrl = uploadBaseUrl;
    vm.aggregated_transactions = {};

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
        vm.loading = false;

      }

      vm.pageUrl = encodeURIComponent(vm.pageUrlDecoded);
      vm.shareDescription = encodeURIComponent('View the aid projects of the RVO on ' + vm.pageUrlDecoded);
    }

    function errorFn(data, status, headers, config) {
      console.log("getting country failed");
      vm.loading = false;
    }

    vm.setBudgetLeft = function(){

      if('incoming_fund' in vm.aggregated_transactions){ vm.aggregated_transactions['incoming_fund'] = 0; }
      if('disbursement' in vm.aggregated_transactions){ vm.aggregated_transactions['disbursement'] = 0; }
      if('expenditure' in vm.aggregated_transactions){ vm.aggregated_transactions['expenditure'] = 0; }

      vm.budget = vm.aggregated_transactions['incoming_fund'];
      vm.disbursements = vm.aggregated_transactions['disbursement'] + vm.aggregated_transactions['expenditure'];;

      vm.budgetLeft = Math.round(vm.disbursements / vm.budget * 100);
      if (isNaN(vm.budgetLeft)) { vm.budgetLeft = 0; }
      vm.progressStyle = {'width': vm.budgetLeft + '%'}
    }

    vm.update = function(selectionString){
      if (selectionString.indexOf("recipient_country") < 0){ return false;}
      
      Aggregations.aggregation('recipient_country', 'recipient_country_percentage_weighted_disbursement,recipient_country_percentage_weighted_expenditure,recipient_country_percentage_weighted_incoming_fund', selectionString).then(function(data, status, headers, config){

        for(var i = 0;i < data.data.results.length;i++){
          if(data.data.results[i].recipient_country.code == vm.country_id){
            vm.aggregated_transactions = data.data.results[i];
          }
        }
        vm.setBudgetLeft();
      }, errorFn);
    }

    vm.download = function(format){
      var url = 'http://rvo.oipa.nl/api/countries/'+ vm.country.code +'/?format=json';
      window.open(url);
    }

    activate();

  }
})();
