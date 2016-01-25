/**
* CountriesController
* @namespace oipa.countries.controllers
*/
(function () {
  'use strict';

  angular
    .module('oipa.activities')
    .controller('ActivityController', ActivityController);

  ActivityController.$inject = ['Activities', '$stateParams', 'FilterSelection', '$filter', 'templateBaseUrl', 'homeUrl', '$location','programmesMapping', '$sce'];

  /**
  * @namespace ActivitiesController
  */
  function ActivityController(Activities, $stateParams, FilterSelection, $filter, templateBaseUrl, homeUrl, $location, programmesMapping, $sce) {
    var vm = this;
    vm.activity = null;
    vm.activityId = $stateParams.activity_id;
    vm.templateBaseUrl = templateBaseUrl;
    vm.start_date = null;
    vm.end_date = null;
    vm.start_planned = null;
    vm.start_actual = null;
    vm.end_planned = null;
    vm.end_actual = null;
    vm.pageUrlDecoded = $location.absUrl();
    vm.loading = true;
    vm.selectedTab = 'summary';

    vm.tabs = [
      {'id': 'summary', 'name': 'Summary', 'count': -1},
      {'id': 'detailedreport', 'name': 'Detailed report', 'count': -1},
      {'id': 'mediapage', 'name': 'Media', 'count': -1},
    ]

    

    function activate() {
      Activities.get(vm.activityId).then(successFn, errorFn);
      Activities.getTransactions(vm.activityId).then(procesTransactions, errorFn);

      function successFn(data, status, headers, config) {
        vm.activity = data.data;
        vm.loading = false;
        vm.description = null;

        console.log(vm.activity.document_links);

        if(vm.activity.descriptions.length){
          vm.description = $sce.trustAsHtml(vm.activity.descriptions[0].narratives[0].text.replace(/\\n/g, '<br>'));
        }

        for(var i = 0;i < vm.activity.activity_dates.length;i++){
          if(vm.activity.activity_dates[i].type.code == 1){
            vm.start_planned = vm.activity.activity_dates[i].iso_date;
          } else if(vm.activity.activity_dates[i].type.code == 2){
            vm.start_actual = vm.activity.activity_dates[i].iso_date;
          } else if(vm.activity.activity_dates[i].type.code == 3){
            vm.end_planned = vm.activity.activity_dates[i].iso_date;
          } else if(vm.activity.activity_dates[i].type.code == 4){
            vm.end_actual = vm.activity.activity_dates[i].iso_date;
          }
        }
        for (var i = 0; i < vm.activity.related_activities.length;i++){
          vm.activity.related_activities[i].name = programmesMapping[vm.activity.related_activities[i].ref];
        }

        if(vm.end_actual != null){
          vm.end_date = vm.end_actual;
        } else if(vm.end_planned != null){
          vm.end_date = vm.end_planned;
        } else {
          vm.end_date = 'Data to be added';
        }

        if(vm.start_actual != null){
          vm.start_date = vm.start_actual;
        } else if(vm.start_planned != null){
          vm.start_date = vm.start_planned;
        } else {
          vm.start_date = 'Data to be added';
        }
      }

      function procesTransactions(data, status, headers, config){
        vm.transactionData = data.data.results;
        vm.reformatTransactionData(data.data.results);
      }

      function errorFn(data, status, headers, config) {
        console.log("getting activity failed");
        vm.loading = false;
      }

      vm.pageUrl = encodeURIComponent(vm.pageUrlDecoded);
      vm.shareDescription = encodeURIComponent('View the aid projects of the RVO on ' + vm.pageUrlDecoded);
    }

    vm.transactionChartData = [];
    vm.transactionChartOptions = {
      chart: {
        type: 'lineChart',
        height: 450,
        margin : {
            top: 20,
            right: 20,
            bottom: 60,
            left: 85
        },
        x: function(d){ return d[0]; },
        y: function(d){ return d[1]; },
        color: d3.scale.category10().range(),
        transitionDuration: 300,
        useInteractiveGuideline: true,
        clipVoronoi: false,
        interpolate: 'step',
        xAxis: {
            axisLabel: '',
            tickFormat: function(d) {
              return d3.time.format('%Y-%m-%d')(new Date(d))
            },
            showMaxMin: false,
            staggerLabels: true
        },
        yAxis: {
            axisLabel: '',
            tickFormat: function(d){
              return $filter('shortcurrency')(d,'€');
            },
            axisLabelDistance: 20
        }
      }
    };

    vm.download = function(format){
      var url = homeUrl + '/export/?format=json&detail='+vm.activityId+'&filters=';
      window.open(url);
    }

    vm.reformatTransactionData = function(transactions){
      var data = [
        {
            values: [],
            key: 'Budget', 
            color: '#2077B4'  
        },
        {
            values: [],
            key: 'Disbursement',
            color: '#FF7F0E'
        },
      ];

      vm.disbursements = 0;
      vm.budget = 0;

      for (var i =0; i < transactions.length;i++){

        var date = transactions[i].transaction_date;
        var value = transactions[i].value;

        if(transactions[i].transaction_type.code == 1){ // 1 = incoming fund
          data[0]['values'].push([(new Date(date).getTime()), parseInt(value)]);
          vm.budget += parseInt(value);
        } else if(transactions[i].transaction_type.code == 3){
          data[1]['values'].push([(new Date(date).getTime()), parseInt(value)]);
          vm.disbursements += parseInt(value);
        }
      }

      function sortFunction(a, b) {
          if (a[0] === b[0]) {
              return 0;
          }
          else {
              return (a[0] < b[0]) ? -1 : 1;
          }
      }

      

      data[0]['values'].sort(sortFunction);
      data[1]['values'].sort(sortFunction);

      for (var i = 1; i < data[0]['values'].length;i++){
        data[0]['values'][i][1] += data[0].values[(i-1)][1];
      }

      for (var i = 1; i < data[1]['values'].length;i++){
        data[1]['values'][i][1] += data[1].values[(i-1)][1];
      }

      if(vm.budget > 0) {
        vm.budgetLeft = Math.round(vm.disbursements / vm.budget * 100);
        vm.progressStyle = {'width': vm.budgetLeft + '%'}
      }
      else {
        vm.budgetLeft = 0;
      }

      vm.transactionChartData = data;
    }

    activate();

  }
})();