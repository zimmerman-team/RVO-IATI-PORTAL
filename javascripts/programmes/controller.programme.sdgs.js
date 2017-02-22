(function () {
  'use strict';

  angular
    .module('oipa.programmes')
    .controller('ProgrammeSdgsController', ProgrammeSdgsController);

  ProgrammeSdgsController.$inject = ['$scope', 'TransactionAggregations', 'FilterSelection', 'templateBaseUrl', 'sdgGoals', 'sdgTargetTitles'];

  function ProgrammeSdgsController($scope, TransactionAggregations, FilterSelection, templateBaseUrl, sdgGoals, sdgTargetTitles) {
    
    var vm = this

    vm.filterSelection = FilterSelection
    vm.hasToContain = $scope.hasToContain
    vm.templateBaseUrl = templateBaseUrl

    vm.sdg_targets = []
    vm.sdg_goal_ids = []
    
    vm.sdg_goals = sdgGoals
    vm.sdg_target_titles = sdgTargetTitles

    vm.tooltip = function(goalId){
      var targets = [];

      for(var i = 0;i < vm.sdg_targets.length; i++){
        if(vm.sdg_targets[i].sector.code.split('.')[0] == goalId){
          targets.push("<p>&#8226; "+vm.sdg_target_titles[vm.sdg_targets[i].sector.code]+".</p>")
        }
      }

      var plural = targets.length > 1 ? 's' : ''

      return '<div><h4>SDG Goal: '+vm.sdg_goals[goalId]+'</h4><hr/>'
      + '<div><b>Reported SDG Target'+plural+' </b>'
      + targets.join('')
      + '</div>'
      + '</div>';
    }

    activate()

    function activate() {

        if($scope.hasToContain != undefined) vm.hasToContain = $scope.hasToContain; 

        $scope.$watch('vm.filterSelection.selectionString', function (selectionString) {
            vm.update(selectionString)
        }, true);
    }

    vm.update = function(selectionString){

      if (selectionString.indexOf(vm.hasToContain) < 0){ return false;}

        TransactionAggregations.aggregation('sector', 'activity_count', selectionString + '&sector_vocabulary=8').then(function(data, status, headers, config){

            var results = data.data.results

            vm.sdg_targets = results
            // SDG functionality
            for(var i = 0;i < results.length;i++){
                var sdg_goal_code = results[i].sector.code.split('.')[0]
                vm.sdg_goal_ids.push(parseInt(sdg_goal_code))
            }

            if(vm.sdg_goal_ids.length > 0){
              var uniqueNames = [];
              $.each(vm.sdg_goal_ids, function(i, el){
                  if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
              });
              vm.sdg_goal_ids = uniqueNames.sort(function(a,b){return a - b})
            }

        // end SDG functionality

      }, errorFn);
    }

    function errorFn(data, status, headers, config) {
        console.log("getting activity failed")
        vm.busy = false
    }
  }
})();