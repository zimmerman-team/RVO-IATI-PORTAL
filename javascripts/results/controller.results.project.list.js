(function () {
  'use strict';

  angular
    .module('oipa.results')
    .controller('ResultsProjectListController', ResultsProjectListController);

  ResultsProjectListController.$inject = ['$scope', 'Activities', 'FilterSelection', 'homeUrl', 'templateBaseUrl', '$filter', 'Results'];

  function ResultsProjectListController($scope, Activities, FilterSelection, homeUrl, templateBaseUrl, $filter, Results) {
    var vm = this;
    vm.filterSelection = FilterSelection;
    vm.activities = [];
    vm.order_by = 'title';
    vm.pageSize = 25;
    vm.page = 1;
    vm.totalActivities = 0;
    vm.hasToContain = $scope.hasToContain;
    vm.busy = true;
    vm.extraSelectionString = '';
    vm.rows = [];
    vm.selectedIndicators = $scope.selectedIndicators;
    vm.templateBaseUrl = templateBaseUrl;
    vm.programmaAfkortingen = {
      'NL-KVK-27378529-18232': 'KHED',
      'NL-KVK-27378529-19390': 'ORIO',
      'NL-KVK-27378529-23188': 'TF',
      'NL-KVK-27378529-23310': '2getthere-OS',
      'NL-KVK-27378529-23408': 'PSI',
      'NL-KVK-27378529-23710': 'FDW',
      'NL-KVK-27378529-23877': 'FDOV',
      'NL-KVK-27378529-25403': 'CBI',
      'NL-KVK-27378529-25588': 'DRR-Team',
      'NL-KVK-27378529-25717': 'GWW-FDW',
      'NL-KVK-27378529-26067': 'PSD',
      'NL-KVK-27378529-26225': 'LS&H4D',
      'NL-KVK-27378529-26663': 'DGGF',
      'NL-KVK-27378529-26742': 'DHKF',
      'NL-KVK-27378529-27115': 'DSS',
      'NL-KVK-27378529-27528': 'PDP III',
    }

    function activate() {
      $scope.$watch("selectedIndicators", function (selectedIndicators) {
        vm.selectedIndicators = selectedIndicators;
        vm.rows = [];
        vm.update();
      }, true);

      $scope.$watch("vm.filterSelection.selectionString", function (selectionString) {
        vm.update(selectionString);
      }, true);

      $scope.$watch("searchValue", function (searchValue) {
        if (searchValue == undefined) return false; 
        searchValue == '' ? vm.extraSelectionString = '' : vm.extraSelectionString = '&q='+searchValue;
        vm.update();
      }, true);

      // do not prefetch when the list is hidden
      if($scope.shown != undefined){
        $scope.$watch("shown", function (shown) {
            vm.busy = !shown ? true : false;
        }, true);
      }
    }

    vm.toggleOrder = function(){
      vm.update(vm.filterSelection.selectionString);
    }

    vm.hasContains = function(){
      return vm.selectedIndicators.length;
    }

    vm.update = function(){
      if (!vm.hasContains()) return false;

      vm.busy = true;

      vm.page = 1;

      var resultAddition = '&indicator_title=' + vm.selectedIndicators.join(',');

      Activities.resultList(vm.filterSelection.selectionString + vm.extraSelectionString + resultAddition, vm.pageSize, vm.order_by, vm.page).then(succesFn, errorFn);

      function succesFn(data, status, headers, config){
        vm.rows = [];
        vm.reformatPerPeriod(data.data.results);
        vm.totalActivities = data.data.count;
        $scope.count = vm.totalActivities;
        vm.busy = false;      
      }

      function errorFn(data, status, headers, config){
        console.warn('error getting data for activity.list.block');
      }
    }

    vm.reformatPerPeriod = function(activities){
      var rows = [];
      var yearShouldBe = 'all';
      if(Results.year.on == true){
        yearShouldBe = Results.year.value; 
      }
      // lol
      for(var i = 0;i < activities.length;i++){
        for(var x = 0;x < activities[i].results.length;x++){
          for(var y = 0;y < activities[i].results[x].indicator.length;y++){

            if(vm.selectedIndicators.indexOf(activities[i].results[x].indicator[y].title.narratives[0].text) == -1){ continue; }

            for (var z = 0;z < activities[i].results[x].indicator[y].period.length;z++){

              if(activities[i].results[x].indicator[y].period[z].actual.value == null || activities[i].results[x].indicator[y].period[z].actual.value == 0){
                continue;
              }
              if(yearShouldBe != 'all'){
                if(activities[i].results[x].indicator[y].period[z].period_end.substr(0,4) != yearShouldBe){
                  continue;
                }
              }

              var result_indicator_description = '';
              var result_indicator_description_short = '';
              if (activities[i].results[x].indicator[y].description != null){
                result_indicator_description = activities[i].results[x].indicator[y].description.narratives[0].text;
                result_indicator_description_short = result_indicator_description.substr(0, 45);
              }

              var indicatorTitle = activities[i].results[x].indicator[y].title.narratives[0].text;

              var period_actual_value = '';
              if(activities[i].results[x].indicator[y].period[z].actual.value != null){

                if(indicatorTitle.indexOf('co-invest') > -1){
                  period_actual_value += '€';
                }
                var actual_value = activities[i].results[x].indicator[y].period[z].actual.value;
                period_actual_value += $filter('thousandsSeparator')(Math.round(actual_value));
                period_actual_value += ' (' + activities[i].results[x].indicator[y].period[z].period_end.substr(0,4) + ')';
              }

              var period_target_value = '';
              if(activities[i].results[x].indicator[y].period[z].target.value != null){

                if(indicatorTitle.indexOf('co-invest') > -1){
                  period_target_value += '€';
                }
                var target_value = activities[i].results[x].indicator[y].period[z].target.value;
                period_target_value += $filter('thousandsSeparator')(Math.round(target_value));
                period_target_value += ' (' + activities[i].results[x].indicator[y].period[z].period_end.substr(0,4) + ')';
              }

              rows.push({
                'activity_id': activities[i].id,
                'title': activities[i].title.narratives[0].text,
                'programme': activities[i].related_activities[0].ref,
                'programme_afk': vm.programmaAfkortingen[activities[i].related_activities[0].ref],
                'result_type': activities[i].results[x].type.name,
                'result_indicator_title': indicatorTitle,
                'result_indicator_description': result_indicator_description,
                'result_indicator_description_short': result_indicator_description_short,
                'short': true,
                'baseline_value': activities[i].results[x].indicator[y].baseline.value,
                'baseline_year': activities[i].results[x].indicator[y].baseline.year,
                'period_target_value': period_target_value,
                'period_target_comment': activities[i].results[x].indicator[y].period[z].target.comment,
                'period_actual_value': period_actual_value,
                'period_actual_comment': activities[i].results[x].indicator[y].period[z].actual.comment,
              });
            }
          }
        }
      }

      if(rows.length == 0){
        vm.nextPage();
      } else {
        var new_rows = angular.copy(vm.rows);
        new_rows = new_rows.concat(rows);
        vm.rows = new_rows;
        if(rows.length < 5){
          vm.nextPage();
        }
      }
    }

    vm.nextPage = function(){
      if (!vm.hasContains() || vm.busy || (vm.totalActivities <= (vm.page * vm.pageSize))) return;
      var resultAddition = '&indicator_title=' + vm.selectedIndicators.join(',');

      vm.busy = true;
      vm.page += 1;
      Activities.resultList(vm.filterSelection.selectionString + vm.extraSelectionString + resultAddition, vm.pageSize, vm.order_by, vm.page).then(succesFn, errorFn);

      function succesFn(data, status, headers, config){
        vm.reformatPerPeriod(data.data.results);
        vm.busy = false;   
      }

      function errorFn(data, status, headers, config){
        console.warn('error getting data on lazy loading');
        // vm.totalActivities = 1;
        vm.busy = false;
      }
    };

    vm.download = function(format){
      var resultAddition = '&indicator_title=' + vm.selectedIndicators.join(',');
      var url = homeUrl + '/export/?type=results-list&format='+format+'&filters=' + encodeURIComponent(vm.filterSelection.selectionString)+'&indicator_title='+resultAddition;
      window.open(url);
    }

    activate();
  }
})();