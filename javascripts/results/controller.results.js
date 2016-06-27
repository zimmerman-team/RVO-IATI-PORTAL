(function () {
  'use strict';

  angular
    .module('oipa.results')
    .controller('ResultsController', ResultsController);

  ResultsController.$inject = ['$scope', 'Results', 'FilterSelection', 'templateBaseUrl', '$sce'];

  function ResultsController($scope, Results, FilterSelection, templateBaseUrl, $sce) {
    var vm = this;
    vm.filterSelection = FilterSelection;
    vm.programmeId = $scope.programmeId;

    vm.job_indicators = {
      'Number of jobs supported': {
        'level': 0, 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Number of jobs supported'},
      'Number of full-time (equivalent) direct and indirect jobs supported - Total': {
        'level': 1, 
        'chart_name': 'Total', 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Number of jobs supported'},
      'Number of full-time (equivalent) direct jobs supported - Total': {
        'level': 2, 
        'chart_group': 'Direct jobs',
        'chart_name': 'Total',
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Number of jobs supported'},
      'Number of full-time (equivalent) direct jobs supported - Female': {
        'level': 3, 
        'chart_group': 'Direct jobs',
        'chart_name': 'Female', 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Number of jobs supported'},
      'Number of full-time (equivalent) direct jobs supported - Young (15-25)': {
        'level': 3, 
        'chart_group': 'Direct jobs',
        'chart_name': 'Young', 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Number of jobs supported'},
      'Number of full-time (equivalent) direct jobs supported - Rural': {
        'level': 3, 
        'chart_group': 'Direct jobs',
        'chart_name': 'Rural', 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Number of jobs supported'},
      'Number of full-time (equivalent) direct jobs supported - Urban': {
        'level': 3, 
        'chart_group': 'Direct jobs',
        'chart_name': 'Urban', 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Number of jobs supported'},
      'Number of full-time (equivalent) direct jobs supported - Vulnerable groups': {
        'level': 3, 
        'chart_group': 'Direct jobs',
        'chart_name': 'Vulnerable groups', 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Number of jobs supported'},
      'Number of full-time (equivalent) direct jobs supported - Fragile states': {
        'level': 3, 
        'chart_group': 'Direct jobs',
        'chart_name': 'Fragile states', 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Number of jobs supported'},
      'Number of full-time (equivalent) direct jobs supported - Senior positions': {
        'level': 3, 
        'chart_group': 'Direct jobs',
        'chart_name': 'Senior positions', 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Number of jobs supported'},
      'Number of full-time (equivalent) indirect jobs supported - Total': {
        'level': 2, 
        'chart_group': 'Indirect jobs', 
        'chart_name': 'Total', 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Number of jobs supported'},
    }

    vm.coi_indicators = {
      'Amount of generated co-investment': {
        'level': 0, 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Amount of generated co-investment'},
      'Amount of co-investment generated by ODA - Total': {
        'level': 1, 
        'chart_name': 'Total', 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Amount of generated co-investment'},
      'Amount of co-investment generated by ODA - by private sector/companies': {
        'level': 2, 
        'chart_group': 'Private sector/companies',
        'chart_name': 'Total',
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Amount of generated co-investment'},
      'Amount of co-investment generated by ODA - by private sector/financial institutions': {
        'level': 2, 
        'chart_group': 'private sector/financial institutions',
        'chart_name': 'Total', 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Amount of generated co-investment'},
      'Amount of co-investment generated by ODA - by donors': {
        'level': 2, 
        'chart_group': 'donors',
        'chart_name': 'Total', 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Amount of generated co-investment'},
      'Amount of co-investment generated by ODA - by (local) government': {
        'level': 2, 
        'chart_group': '(local) government',
        'chart_name': 'Total', 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Amount of generated co-investment'},
      'Amount of co-investment generated by ODA - by NGOs and foundations': {
        'level': 2, 
        'chart_group': 'NGOs and foundations', 
        'chart_name': 'Total', 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Amount of generated co-investment'},
      'Amount of co-investment generated by ODA - by knowledge institutions': {
        'level': 2, 
        'chart_group': 'knowledge institutions', 
        'chart_name': 'Total',
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Amount of generated co-investment'}, 
    }

    vm.noc_indicators = {
      'Number of companies': {
        'level': 0, 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Number of companies'},
      'Number of companies with supported plans to invest or trade - Total': {
        'level': 1, 
        'chart_name': 'Total', 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Number of companies'},
      'Number of companies with supported plans to invest or trade - Dutch companies': {
        'level': 2, 
        'chart_group': 'Dutch companies',
        'chart_name': 'Total', 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Number of companies'},
      'Number of companies with supported plans to invest or trade - Local companies': {
        'level': 2, 
        'chart_group': 'Local companies',
        'chart_name': 'Total', 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Number of companies'},
      'Number of companies with supported plans to invest or trade - Other companies': {
        'level': 2, 
        'chart_group': 'Other companies', 
        'chart_name': 'Total',
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Number of companies'},
      'Number of companies with supported plans to invest or trade - Local female entrepreneurs': {
        'level': 3, 
        'chart_group': 'Other companies',
        'chart_name': 'Local female entrepreneurs', 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Number of companies'},
      'Number of companies with supported plans to invest or trade - Local young entrepreneurs <35 years': {
        'level': 3, 
        'chart_group': 'Other companies',
        'chart_name': 'Local young entrepreneurs <35 years', 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Number of companies'},
      'Number of companies with supported plans to invest or trade - Local entrepreneurs from fragile states': {
        'level': 3, 
        'chart_group': 'Other companies',
        'chart_name': 'Local entrepreneurs from fragile states', 
        'actual': 0, 
        'activity_count': 0,
        'parent': 'Number of companies'},
    }

    // other companies = total - dutch - local

    /*
    - CHECK De result area wordt samengesteld door het IATI veld Result title – Result description. Dit is nu nog maar een result area, maar in de toekomst zullen er meer result areas toegevoegd worden. (zie resultatenrapportage BZ)
    - CHECK De result group is in feite alleen een titel boven de (hoofd)indicator (niveau 1). Hier kan men op klikken om de hoofdindicator + alle subs uit te vouwen.
    - Er zijn 3 indicator niveaus: 
    1. CHECK  Er kan maar 1 indicator (result group) tegelijk in de grafiek worden weergegeven. Je kunt op indicator niveau 1 dus niks bij elkaar optellen: Ja kan alleen iets uit A of uit B of uit C kiezen. 
    Sommige niveau 1 indicatoren staan niet in OIPA/IATI, en moeten gegenereerd worden  door de optelling van de niveau 2 indicatoren: A = A1 + A2.
    2.  CHECK Niveau 2 telt op tot het totaal van niveau 1: A1 + A2 = A. 
    Indien de niveau 1 indicator wel ingevuld staat (bijv. B), en de optelling van de niveau 2 indicatoren niet uitkomt, dan moet er een “other” worden gegenereerd: bijvoorbeeld: “Other companies” = B – (B1+B2) 
    Als B2 =10 en B2 = 10 en B = 100 dan dient in de tabel weergegeven te worden als:
    B1: Dutch companies = 10
    B1: Local Companies = 10
    Other Companies = 80
    3.  TO DO Het 3e niveau mag en kan niet bij elkaar worden opgeteld. Deze informatie kan alleen in aparte staven worden weergegeven. Bijv. female, young, senior jobs, etc. dit kan namelijk overlappen en dubbel geteld worden. 
    - Via een selectieveld kies je de indicatoren waarvan het resultaat in het staafdiagram dient te komen. Een selectieveld kan geplaatst worden op alle nivo’s vanaf het nivo 1 en lager.
    Als het een groep  geselecteerd is, dan komen alle niveau 1 en 2 indicatoren in het diagram te staan die onder de groep vallen vallen, dus:
    o Number of full-time (equivalent) direct and indirect jobs supported - Total
    o Number of full-time (equivalent) direct jobs supported -  Total
    o Number of full-time (equivalent) indirect jobs supported – Total
    ??? Als het nivo A geselecteerd is, dan kunnen de nivo’s B en C niet meer geselecteerd worden, ook niet afzonderlijke indicatoren uit B en C.
    TO DO Niveau 3 indicatoren worden niet automatisch geselecteerd (omdat hier veel overlap in zit, en de grafiek ingewikkeld/onoverzichtelijk maakt). Mensen kunnen deze wel actief selecteren.
    - Als het gewenst is om uit C maar twee indicatoren in het diagram te zien, dan kan eerst C gekozen worden (waardoor de niveau 1 en 2 indicatoren onder C geselecteerd zijn). Vervolgens kunnen de individuele indicatoren gedeselecteerd worden.
    - Later komen er nog een extra onderwerpen (Result Title) bij naast ‘Sustainable trade and investment’ – deze kunnen onderaan de lijst worden toegevoegd.
    - TO DO Achter elke indicator komt te staan (x Projects). x is het aantal projecten waarbij bij de indicator de actual waarde is ingevuld met een waarde anders dan 0 en niet leeg is.
    - Als een indicator 0 projecten heeft dan niet tonen (dus ook niet in de selectie-lijst naast de grafiek)
    */

    vm.indicatorMeta = {
      'Number of jobs supported': {
        'title': 'Number of jobs supported',
        'description': 'For the measurement of the number of jobs supported (direct/indirect; male/female, etc.) we follow the DCED definition: “Number of direct and indirect jobs in the companies, sector or value chain targeted by the intervention at the end of the reporting period, converted in full-time equivalent. Report direct and indirect (e.g. outgrower) jobs separately. Disaggregate by gender. Convert in Full Time Equivalents (FTE) pro rata, based on local definition of a working week.” However, some programmes (such as PSI) follow the former DCED definition and measure the number of additional (created) jobs. The exact definition on programme or project level can be found in the table below under ‘result indicator description’. '
      },
      'Number of companies': {
        'title': 'Number of companies with supported plans to invest or trade',
        'description': 'The indicator ‘Number of companies with supported plans to invest or trade’ measures the number of companies which is or has been supported by means of a subsidy, financing or an assignment. In the case of an assignment, only the main contractor is included (companies which have signed a contract and/or received payments on behalf of the project). The total number of supported companies is thus larger in reality, because subcontractors may be hired (often local companies). State companies (more than 50% state owned) are not included under this indicator. The exact definition on programme or project level can be found in the table below under ‘result indicator description’. By aggregating the number of companies on project level, there may be some double counting since companies may be supported by more than one  project. The names of the companies are available on the project level under ‘project partners’. Under the project partners tab of this site, a list of all companies is available (project partner type: private sector), as well as information about the projects in which these companies are involved. '
      },
      'Amount of generated co-investment': {
        'title': 'Amount of co-investment generated by ODA',
        'description': 'Most programmes executed by the Netherlands Enterprise Agency provide a part (percentage) of the total project costs and require a (private) co-investment by companies or financial institutions (e.g. commercial loans). In the case of PPPs or public (infrastructure) projects, co-financing might also be provided by a local government, knowledge institutions, NGOs and foundations or other donors. (Impact investors are included under financial institutions if they are privately funded and under donors if they are donor funded.) Co-financing is not reported for each reporting period (due to high management costs), instead the total co-financing is reported at project completion. '
      }
    }

    vm.selectedIndicators = [];

    vm.update = function(){
      var programme_addition = ''; 
      if(vm.programmeId != undefined){
        programme_addition = '&related_activity=' + vm.programmeId;
      }
      Results.aggregation('result_indicator_title', 'activity_count,actual', vm.filterSelection.selectionString + programme_addition + '&indicator_period_actual_not=0&indicator_period_actual_null=False', 'result_indicator_title').then(succesFn, errorFn);

      function succesFn(data, status, headers, config){
        var results = data.data.results;
        var job_indicators = angular.copy(vm.job_indicators);
        var noc_indicators = angular.copy(vm.noc_indicators);
        var coi_indicators = angular.copy(vm.coi_indicators);

        // Co-investment indicators
        for(var i = 0;i < results.length;i++){
          if (job_indicators[results[i].result_indicator_title] != undefined){
            job_indicators[results[i].result_indicator_title].actual = results[i].actual;
            job_indicators[results[i].result_indicator_title].activity_count = results[i].activity_count;
          } else if (noc_indicators[results[i].result_indicator_title] != undefined){
            noc_indicators[results[i].result_indicator_title].actual = results[i].actual;
            noc_indicators[results[i].result_indicator_title].activity_count = results[i].activity_count;
          } else if (coi_indicators[results[i].result_indicator_title] != undefined){
            coi_indicators[results[i].result_indicator_title].actual = results[i].actual;
            coi_indicators[results[i].result_indicator_title].activity_count = results[i].activity_count;
          }
        }

        job_indicators['Number of full-time (equivalent) direct and indirect jobs supported - Total'].activity_count = _.reduce(job_indicators, function(memo, indicator){ 
          var value;
          (indicator.level == 2) ? value = memo + indicator.activity_count: value = memo;
          return value;
        }, 0);

        noc_indicators['Number of companies with supported plans to invest or trade - Total'].activity_count = _.reduce(noc_indicators, function(memo, indicator){ 
          var value;
          (indicator.level == 2) ? value = memo + indicator.activity_count: value = memo;
          return value;
        }, 0);

        coi_indicators['Amount of co-investment generated by ODA - Total'].activity_count = _.reduce(coi_indicators, function(memo, indicator){ 
          var value;
          (indicator.level == 2) ? value = memo + indicator.activity_count: value = memo;
          return value;
        }, 0);

        var indicators = job_indicators;
        for (var attrname in noc_indicators) { indicators[attrname] = noc_indicators[attrname]; }
        for (var attrname in coi_indicators) { indicators[attrname] = coi_indicators[attrname]; }
        vm.indicators = indicators;
      }
    }

    function activate() {

      $scope.$watch('vm.filterSelection.selectionString', function(valueNew, valueOld){
        console.log(valueNew)
        vm.update();
      }, true);
    }

    function errorFn(data, status, headers, config) {
      console.log("getting countries failed");
    }

    activate();
  }
})();