/**
* CountriesController
* @namespace oipa.countries.controllers
*/
(function () {
  'use strict';

  // General comparison function for convenience
  function compare(x, y) {
    if (x === y) {
      return 0;
    }
    return x > y ? 1 : -1;
  }

  angular
    .module('oipa.activities')
    .controller('ActivityController', ActivityController);

  ActivityController.$inject = ['Activities', '$stateParams', 'FilterSelection', '$filter', 'templateBaseUrl', 'homeUrl','programmesMapping', '$sce'];

  /**
  * @namespace ActivitiesController
  */
  function ActivityController(Activities, $stateParams, FilterSelection, $filter, templateBaseUrl, homeUrl, programmesMapping, $sce) {
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
    vm.busy = true;
    vm.selectedTab = 'summary';

    vm.relatedVimeo = [];
    vm.relatedYoutube = [];
    vm.relatedImages = [];
    vm.relatedDocuments = [];
    vm.featuredImage = vm.templateBaseUrl + '/images/Develop2Build header.jpg';

    vm.resultRows = [];

    vm.tabs = [
      {'id': 'summary', 'name': 'Summary', 'count': -1},
      {'id': 'detailedreport', 'name': 'Detailed report', 'count': -1},
      {'id': 'mediapage', 'name': 'Media', 'count': -1},
      {'id': 'results', 'name': 'Results', 'count': -1},
    ]

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
      Activities.get(vm.activityId).then(successFn, errorFn);
      Activities.getTransactions(vm.activityId).then(procesTransactions, errorFn);

      function successFn(data, status, headers, config) {
        vm.activity = data.data;

        vm.activity.participating_organisations = vm.activity.participating_organisations.sort(function(a,b){
          if(a.role.code < b.role.code){
            return -1;
          }
          if(a.role.code > b.role.code){
            return 1;
          }
          return 0;
        });

        vm.busy = false;
        vm.description = null;
        vm.sortDocs(vm.activity.document_links);
        var desc = '';

        if(vm.activity.descriptions.length){

          for (var i = 0; i < vm.activity.descriptions.length;i++){
            if(vm.activity.descriptions[i].type.code == '1'){
              desc += vm.activity.descriptions[i].narratives[0].text;
            }
          }

          vm.description = $sce.trustAsHtml(desc.replace(/\\n/g, '<br>'));
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

        processResults(data.data);
      }

      function processResults(activity){
        var results = activity.results;
        var rows = [];
        for(var x = 0;x < results.length;x++){
          for(var y = 0;y < results[x].indicator.length;y++){
            for (var z = 0;z < results[x].indicator[y].period.length;z++){

              var result_indicator_description = '';
              var result_indicator_description_short = '';
              if (results[x].indicator[y].description != null){
                result_indicator_description = results[x].indicator[y].description.narratives[0].text;
                result_indicator_description_short = result_indicator_description.substr(0, 75);
              }
              
              rows.push({
                'activity_id': activity.id,
                'title': activity.title.narratives[0].text,
                'programme': activity.related_activities[0].ref,
                'programme_afk': vm.programmaAfkortingen[activity.related_activities[0].ref],
                'result_type': results[x].type.name,
                'result_indicator_title': results[x].indicator[y].title.narratives[0].text,
                'result_indicator_description': result_indicator_description,
                'result_indicator_description_short': result_indicator_description_short,
                'baseline_value': results[x].indicator[y].baseline.value,
                'baseline_year': results[x].indicator[y].baseline.year,
                'period_target_value': results[x].indicator[y].period[z].target.value,
                'period_target_year': results[x].indicator[y].period[z].period_end,
                'period_target_comment': results[x].indicator[y].period[z].target.comment,
                'period_actual_value': results[x].indicator[y].period[z].actual.value,
                'period_actual_year': results[x].indicator[y].period[z].period_end,
                'period_actual_comment': results[x].indicator[y].period[z].actual.comment,
              });
            }
          }
        }

        vm.resultRows = rows.sort(function(x, y) {
          var rtx = x.result_type;
          var rty = y.result_type;
          if (rtx !== rty) {
            return compare(rtx, rty);
          }
          var ritx = x.result_indicator_title;
          var rity = y.result_indicator_title;
          if (ritx !== rity) {
            return compare(ritx, rity);
          }
          return compare(x.period_actual_year, y.period_actual_year);
        });



        _.sortBy(rows, function(row){ return row.result_type; });
        vm.resultRows = rows;
      }

      function procesTransactions(data, status, headers, config){

        var results = data.data.results;
        var incoming_funds = [];
        var commitments = [];
        var disbursements_expenditures = [];
        var other_transactions = [];

        var transactionDateSort = function(a, b){
          a = new Date(a.value_date);
          b = new Date(b.value_date);
          return a>b ? 1 : a<b ? -1 : 0;
        };

        for(var i = 0;i < results.length;i++){
          switch(results[i].transaction_type.code){
            case '1':
              incoming_funds.push(results[i]);
              break;
            case '2':
              commitments.push(results[i]);
              break;
            case '3':
              disbursements_expenditures.push(results[i]);
              break;
            case '4':
              disbursements_expenditures.push(results[i]);
              break;
            default:
              other_transactions.push(results[i]);
          }
        }

        incoming_funds = incoming_funds.sort(transactionDateSort)
        commitments = commitments.sort(transactionDateSort)
        disbursements_expenditures = disbursements_expenditures.sort(transactionDateSort)

        var orderedTransactions = incoming_funds.concat(commitments).concat(disbursements_expenditures).concat(other_transactions)

        vm.transactionData = orderedTransactions
        vm.reformatTransactionData(orderedTransactions)
      }

      function errorFn(data, status, headers, config) {
        console.log("getting activity failed");
        vm.busy = false;
      }
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
        useInteractiveGuideline: false,
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
      var url = homeUrl + '/export/?type=activity-detail&format='+format+'&detail='+vm.activityId;
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
            key: 'Expenditure',
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
        } else if(transactions[i].transaction_type.code == 3 || transactions[i].transaction_type.code == 4){
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

      vm.budgetLeft = Math.round(vm.disbursements / vm.budget * 100);
      if (isNaN(vm.budgetLeft)) { vm.budgetLeft = 0; }
      vm.progressStyle = {'width': vm.budgetLeft + '%'}

      vm.transactionChartData = data;
    }

    vm.sortDocs = function(documents) {
      for (var i =0; i < documents.length;i++){
        var obj = {};

        if(documents[i].title){
          obj.title = documents[i].title.narratives[0].text;
        }

        if ( documents[i].format.code == 'text/html' && documents[i].url.indexOf('vimeo') != -1 ) {
          obj.url = $sce.trustAsResourceUrl(documents[i].url);
          vm.relatedVimeo.push(obj);
        }
        else if (documents[i].format.code == 'text/html' && documents[i].url.indexOf('youtube') != -1 ) {
          obj.url = $sce.trustAsResourceUrl(documents[i].url);
          vm.relatedYoutube.push(obj);
        }
        else if (documents[i].format.code == 'image/jpeg' || documents[i].format.code == 'image/png') {
          obj.url = documents[i].url;
          if (obj.title != undefined && obj.title.indexOf('eatured') != -1) {
            vm.featuredImage = obj.url;
          }
          else {
            vm.relatedImages.push(obj);
          }
        }
        else {
          var fileType = '';
          if (documents[i].format.code == 'application/pdf') { fileType = 'Adobe PDF'; }
          else if (documents[i].format.code == 'application/msword' || documents[i].format.code == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') { fileType = 'MS Word'; }
          else if (documents[i].format.code == 'application/vnd.ms-excel' || documents[i].format.code == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') { fileType = 'MS Excel'; }
          else if (documents[i].format.code == 'text/csv') { fileType = 'Comma separated'; }
          else if (documents[i].format.code == 'application/vnd.oasis.opendocument.text') { fileType = 'Open Office'; }
          else { fileType = 'Other'; }
          obj.filetype = fileType;
          if(documents[i].title){
            obj.language = documents[i].title.narratives[0].language.name;
          }
          obj.categories = documents[i].categories;
          obj.url = documents[i].url;
          vm.relatedDocuments.push(obj);
        }
      }
    }

    activate();

  }
})();