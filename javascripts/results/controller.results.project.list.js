(function () {
  'use strict';

  angular
    .module('oipa.results')
    .controller('ResultsProjectListController', ResultsProjectListController);

  ResultsProjectListController.$inject = ['$scope', 'Activities', 'FilterSelection', 'homeUrl', 'programmaAfkortingen', 'templateBaseUrl', '$filter', 'Results'];

  function ResultsProjectListController($scope, Activities, FilterSelection, homeUrl, programmaAfkortingen, templateBaseUrl, $filter, Results) {

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

    vm.resultsYear = Results.year
    vm.currentYear = 2016

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



      $scope.$watch("vm.resultsYear.value", function (year) {

        if(year != vm.currentYear && vm.resultsYear.on == true){
          
          vm.currentYear = year
          vm.page = 1
          vm.rows = []
        
        } else if(vm.currentYear != '2016' && vm.resultsYear.on == false){

          vm.currentYear = '2016'
          vm.page = 1
          vm.rows = []
        }
      }, true)



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

    vm.getPeriodValue = function(indicatorTitle, periodValue, periodYear){
      if(periodValue != null){
        var value = Math.round(periodValue);

        if(indicatorTitle.indexOf('co-investment') > -1){
          periodValue = '€';
        } else {
          periodValue = '';
        }
        periodValue += $filter('thousandsSeparator')(value);
        periodValue += ' (' + periodYear.substr(0,4) + ')';
      }
      return periodValue;
    }

    vm.reformatPerPeriod = function(activities){

      var rows = [];

      var curI = -1;
      var curX = -1;
      var curY = -1; // = result indicator counter
      var lastActual = '0000-00-00';
      var updated = false;
      
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

              var period_actual_value = activities[i].results[x].indicator[y].period[z].actual.value;
              var period_actual_year = activities[i].results[x].indicator[y].period[z].period_end;
              var period_actual_comment = activities[i].results[x].indicator[y].period[z].actual.comment;

              if(period_actual_year.substring(0,4) != vm.currentYear){ continue; }
              
              var period_target_value = activities[i].results[x].indicator[y].period[z].target.value;
              var period_target_year = activities[i].results[x].indicator[y].period[z].period_end;
              var period_target_comment = activities[i].results[x].indicator[y].period[z].target.comment;

              if(period_actual_value == null || period_actual_value == 0){
                continue;
              }

              if(yearShouldBe != 'all'){
                if(period_actual_year.substr(0,4) != yearShouldBe){
                  continue;
                }
              }

              var indicatorTitle = activities[i].results[x].indicator[y].title.narratives[0].text;

              period_actual_value = vm.getPeriodValue(indicatorTitle, period_actual_value, period_actual_year)
              period_target_value = vm.getPeriodValue(indicatorTitle, period_target_value, period_target_year)

              if(curI == i && curY == y && curX == x){

                var curIndex = rows.length - 1;

                if(rows[curIndex].period_target_value == null){

                }

                // check if target in here
                if(period_target_year != null){
                  rows[curIndex].period_target_value = period_target_value;
                  rows[curIndex].period_target_year = period_target_year;
                  rows[curIndex].period_target_comment = period_target_comment;
                }

                // check if actual in here
                if(period_actual_year != null && period_actual_value != null && lastActual.substr(0,4) < period_actual_year.substr(0,4)){
                  // update actual
                  rows[curIndex].period_actual_value = period_actual_value;
                  rows[curIndex].period_actual_year = period_actual_year;
                  rows[curIndex].period_actual_comment = period_actual_comment;
                }

                updated = true;
              }

              curX = x;
              curY = y;
              curI = i;
              lastActual = activities[i].results[x].indicator[y].period[z].period_end;

              // update
              if(updated == true){
                updated = false
                continue;
              }

              var result_indicator_description = '';
              var result_indicator_description_short = '';
              if (activities[i].results[x].indicator[y].description != null){
                result_indicator_description = activities[i].results[x].indicator[y].description.narratives[0].text;
                result_indicator_description_short = result_indicator_description.substr(0, 45);
              }

              rows.push({
                'activity_id': activities[i].id,
                'title': activities[i].title.narratives[0].text,
                'programme': activities[i].related_activities[0].ref,
                'programme_afk': programmaAfkortingen[activities[i].related_activities[0].ref],
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
        vm.totalActivities = 30;
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