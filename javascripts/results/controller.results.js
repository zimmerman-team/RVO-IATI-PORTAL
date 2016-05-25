/**
* ResultsController
* @namespace oipa.countries.controllers
*/
(function () {
  'use strict';

  angular
    .module('oipa.countries')
    .controller('ResultsController', ResultsController);

  ResultsController.$inject = ['$scope', 'Aggregations', 'Results', 'FilterSelection', 'templateBaseUrl', '$sce'];

  /**
  * @namespace ResultsController
  */
  function ResultsController($scope, Aggregations, Results, FilterSelection, templateBaseUrl, $sce) {
    var vm = this;
    // vm.templateBaseUrl = templateBaseUrl;
    // vm.recipientCountries = [];
    // vm.countries = Countries;
    // vm.selectedCountries = Countries.selectedCountries;
    // vm.filterSelection = FilterSelection;
    // vm.q = '';
    // vm.currentPage = 1;
    // vm.page_size = 4;
    // vm.totalCount = 0;

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf oipa.countries.controllers.ResultsController
    */

    vm.indicatorTitle = $sce.trustAsHtml("Number of jobs supported");
    vm.indicatorDescription = $sce.trustAsHtml("Definite (DCED): 0a. Number of jobs supported (direct/indirect; male/female)<br>&nbsp;<br>Number of direct and indirect jobs in the companies, sector or value chain targeted by the intervention at the end of the reporting period (2015), converted in full-time equivalent. Report direct and indirect (e.g. outgrower) jobs separately. Disaggregate by gender. Convert in Full Time Equivalents (FTE) pro rata, based on local definition of a working week. According to DCED definition. For RVO programmes for start-ups (PSI, DGGF), count jobs at end of reporting period as verified during RVO mission.");
    
    vm.clickCheckbox = function(){
      vm.indicatorTitle = $sce.trustAsHtml("Number of companies with supported plans to invest or trade");
      vm.indicatorDescription = $sce.trustAsHtml("Aantal bedrijven dat betrokken is (geweest) en dat vanuit het project financiering/subsidie/betaling/opdrachten heeft ontvangen. <br>&nbsp;<br>Kunnen dubbel tellingen in zitten: bedrijven die in meerdere projecten (en programma’s) supported worden, deze tellen dan dus voor elk project apart mee. Bij partners kan aantal projecten per bedrijf worden gevonden. Alle bedrijven <50% state owned. Alleen hoofdaannemer/bedrijf waaraan betaald wordt: er kan ook nog sprake zijn van onderaannemers");
    }

    function activate() {

      // vm.update();

      // $scope.$watch('vm.q', function(valueNew, valueOld){
      //   if (valueNew !== valueOld){
      //     vm.currentPage = 1;
      //     vm.update();
      //   }
      // }, true);

      // $scope.$watch('vm.filterSelection.selectionString', function(valueNew, valueOld){
      //   if (valueNew !== valueOld){
      //     vm.currentPage = 1;
      //     vm.update();
      //   }
      // }, true);
    }

    // vm.pageChanged = function(newPageNumber){
    //   vm.currentPage = newPageNumber;
    //   vm.update();
    // }

    // vm.update = function(){
    //   // for each active country, get the results
    //   var filterString = FilterSelection.selectionString.split('&');
    //   for(var i = 0;i < filterString.length;i++){
    //     if (filterString[i].indexOf('recipient_country') > -1){
    //       delete filterString[i];
    //     }
    //   }
    //   filterString = filterString.join('&');
      
    //   if(vm.q != ''){
    //     filterString += '&q=' + vm.q;
    //   }

    //   Aggregations.aggregation('recipient_country', 'count', filterString, 'recipient_country', vm.page_size, vm.currentPage).then(successFn, errorFn);

    //   /**
    //   * @name collectionsSuccessFn
    //   * @desc Update collections array on view
    //   */
    //   function successFn(data, status, headers, config) {
    //     vm.totalCount = data.data.count;
    //     vm.recipientCountries = data.data.results;
    //   }

    //   function errorFn(data, status, headers, config) {
    //     console.log("getting countries failed");
    //   }
    // }

    // vm.save = function(){
    //   FilterSelection.save();
    // }

    activate();

  }
})();