<?php 
include( 'constants.php' );
$format  = $_GET['format'];
$oipa_url = OIPA_URL . '/activities/';

function maybeEncodeCSVField($string) {
    if(strpos($string, ',') !== false || strpos($string, '"') !== false || strpos($string, "\n") !== false) {
        $string = '"' . str_replace('"', '""', $string) . '"';
    }
    return $string;
}

switch ($_GET['type']) {
    case 'activity-list':
        $oipa_url .= '?page_size=1000&fields=all&reporting_organisation=NL-KVK-27378529&format=' . $format;
        $oipa_filter  = $_GET['filters'];
        $url = $oipa_url . urldecode($oipa_filter);
        break;
    case 'activity-detail':
        $url = $oipa_url . '?format=' . $format . '&id=' . $_GET['detail'] . '&fields=all';
        break;
    case 'aggregated-list':
        $oipa_url = str_replace('activities', 'transactions', $oipa_url);
        
        // get the json, if format = csv re-format to csv here
        $aggregation_url  = $_GET['aggregation_url'];
        $url = $oipa_url . urldecode($aggregation_url);

        if($format == 'csv'){
            // get json data
            $url = str_replace('format=csv', 'format=json', $url);
            $json_str = file_get_contents($url);
            $json_obj = json_decode($json_str, true);

            // reformat to csv
            $group_by = $_GET['aggregation_group'];

            if($group_by == 'programme'){

                $prog_url = OIPA_URL . '/activities/?format=json&page_size=100&reporting_organisation=NL-KVK-27378529&hierarchy=1&fields=id,title';
                $prog_json_str = file_get_contents($prog_url);
                $prog_json_obj = json_decode($prog_json_str, true);
                $prog_results = $prog_json_obj['results'];

                $programme_names = array();
                foreach($prog_results as $prog){
                    $programme_names[$prog['id']] = $prog['title']['narratives'][0]['text'];
                }

                // init csv with headers
                $csv = array("code,name,count,budget\n");

                // add csv data
                foreach ($json_obj['results'] as $row) {
                    $code = maybeEncodeCSVField($row['related_activity']);
                    $name = maybeEncodeCSVField($programme_names[$row['related_activity']]);
                    $count = maybeEncodeCSVField($row['activity_count']);
                    $incoming_fund = maybeEncodeCSVField($row['incoming_fund']);

                    $row_arr = array();
                    array_push($row_arr, $code);
                    array_push($row_arr, $name);
                    array_push($row_arr, $count);
                    array_push($row_arr, $incoming_fund);
                    $row_str = implode(",", $row_arr) . "\n";
                    array_push($csv, $row_str);
                }
            } else if($group_by == 'participating_organisation'){
                // init csv with headers
                $csv = array("code,name,count\n");

                // add csv data
                foreach ($json_obj['results'] as $row) {
                    $code = maybeEncodeCSVField($row['ref']);
                    $name = maybeEncodeCSVField($row['name']);
                    $count = maybeEncodeCSVField($row['count']);

                    $row_arr = array();
                    array_push($row_arr, $code);
                    array_push($row_arr, $name);
                    array_push($row_arr, $count);
                    $row_str = implode(",", $row_arr) . "\n";
                    array_push($csv, $row_str);
                }
            } else {
                // init csv with headers
                $csv = array("code,name,count,budget\n");

                // add csv data
                foreach ($json_obj['results'] as $row) {
                    $code = maybeEncodeCSVField($row[$group_by]['code']);
                    $name = maybeEncodeCSVField($row[$group_by]['name']);
                    $count = maybeEncodeCSVField($row['count']);
                    $incoming_fund = maybeEncodeCSVField($row['incoming_fund']);

                    $row_arr = array();
                    array_push($row_arr, $code);
                    array_push($row_arr, $name);
                    array_push($row_arr, $count);
                    array_push($row_arr, $incoming_fund);
                    $row_str = implode(",", $row_arr) . "\n";
                    array_push($csv, $row_str);
                }
            }

            // // return to user
            header("Content-type: text/csv");
            header("Content-Disposition: attachment; filename=export.csv");
            header("Pragma: no-cache");
            header("Expires: 0");

            echo implode('', $csv);
            exit();

        }

        break;
    case 'sector-detail':
        $name = urldecode($_GET['sector_name']);
        $code = $_GET['detail'];
        $budget = $_GET['budget'];
        $expenditure = $_GET['expenditure'];

        if($format == 'json'){
            $json = array(
                'code'=>$code,
                'name'=>$name,
                'budget'=>$budget,
                'expenditure'=>$expenditure
            );
            header("Content-Type: application/octet-stream");
            header("Content-Disposition: attachment; filename=export.json");
            echo json_encode($json);
            exit();

        } else {
            // header row
            $row_arr = "code,name,budget,expenditure\n";
            $row = array();
            array_push($row, $code);
            array_push($row, $name);
            array_push($row, $budget);
            array_push($row, $expenditure);
            $row = implode(',', $row) . "\n";
            $csv = array($row_arr, $row);
            // // return to user
            header("Content-type: text/csv");
            header("Content-Disposition: attachment; filename=export.csv");
            header("Pragma: no-cache");
            header("Expires: 0");

            echo implode('', $csv);
            exit();

        }
        break;

    case 'implementing-org-detail':
        $code = $_GET['detail'];
        $budget = $_GET['budget'];
        $expenditure = $_GET['expenditure'];

        if($format == 'json'){
            $json = array(
                'name'=>$code,
                'budget'=>$budget,
                'expenditure'=>$expenditure
            );
            header("Content-Type: application/octet-stream");
            header("Content-Disposition: attachment; filename=export.json");
            echo json_encode($json);
            exit();

        } else {
            // header row
            $row_arr = "name,budget,expenditure\n";
            $row = array();
            array_push($row, $code);
            array_push($row, $budget);
            array_push($row, $expenditure);
            $row = implode(',', $row) . "\n";
            $csv = array($row_arr, $row);
            // // return to user
            header("Content-type: text/csv");
            header("Content-Disposition: attachment; filename=export.csv");
            header("Pragma: no-cache");
            header("Expires: 0");

            echo implode('', $csv);
            exit();

        }
        break;
    case 'country-detail':
        $endpoint = $_GET['endpoint'];
        $fields = $_GET['fields'];
        $code = $_GET['detail'];
        $budget = $_GET['budget'];
        $expenditure = $_GET['expenditure'];

        $url = $oipa_url = OIPA_URL . '/' . $endpoint . '/?format=json&fields=' . $fields . '&code=' . $code;
        $json_str = file_get_contents($url);
        $json_obj = json_decode($json_str, true);
        $fields_arr = explode(',', $fields);


        if($format == 'json'){
            $json_obj['results'][0]['budget'] = $budget;
            $json_obj['results'][0]['expenditure'] = $expenditure;

            header("Content-Type: application/octet-stream");
            header("Content-Disposition: attachment; filename=export.json");
            echo json_encode($json_obj['results'][0]);
            exit();

        } else {

            // header row
            $row_arr = array();
            foreach($fields_arr as $field){
                array_push($row_arr, $field);
            }
            array_push($row_arr, 'budget');
            array_push($row_arr, 'expenditure');
            $row = implode(',', $row_arr) . "\n";
            $csv = array($row);

            // reformat to csv
            foreach ($json_obj['results'] as $row) {

                $row_arr = array();

                foreach($fields_arr as $field){
                    $field_value = maybeEncodeCSVField($row[$field]);
                    array_push($row_arr, $field_value);
                }

                $budget = maybeEncodeCSVField($budget);
                $expenditure = maybeEncodeCSVField($expenditure);
                array_push($row_arr, $budget);
                array_push($row_arr, $expenditure);
                
                $row_str = implode(",", $row_arr) . "\n";
                array_push($csv, $row_str);

                // // return to user
                header("Content-type: text/csv");
                header("Content-Disposition: attachment; filename=export.csv");
                header("Pragma: no-cache");
                header("Expires: 0");

                echo implode('', $csv);
                exit();
            }
        }
        break;
    case 'results-list':
        // get the json, if format = csv re-format to csv here
        $oipa_filter  = $_GET['filters'];
        $indicator_title  = '&indicator_title=' . $_GET['indicator_title'];
        $url = OIPA_URL . '/activities/?format=json&page_size=100&fields=id,title,related_activities,results&reporting_organisation=NL-KVK-27378529' . urldecode($oipa_filter) . '&indicator_title=' . rawurlencode($_GET['indicator_title']);

        $indicator_titles = urldecode($_GET['indicator_title']);
        $indicator_titles = explode(',', $indicator_titles);

        $json_str = file_get_contents($url);
        $json_obj = json_decode($json_str, true);
        $activities = $json_obj['results'];

        $rows = array();
        $activity_count = count($activities);

        $programmaAfkortingen = array(
          'NL-KVK-27378529-18232'=>'KHED',
          'NL-KVK-27378529-19390'=>'ORIO',
          'NL-KVK-27378529-23188'=>'TF',
          'NL-KVK-27378529-23310'=>'2getthere-OS',
          'NL-KVK-27378529-23408'=>'PSI',
          'NL-KVK-27378529-23710'=>'FDW',
          'NL-KVK-27378529-23877'=>'FDOV',
          'NL-KVK-27378529-25403'=>'CBI',
          'NL-KVK-27378529-25588'=>'DRR-Team',
          'NL-KVK-27378529-25717'=>'GWW-FDW',
          'NL-KVK-27378529-26067'=>'PSD',
          'NL-KVK-27378529-26225'=>'LS&H4D',
          'NL-KVK-27378529-26663'=>'DGGF',
          'NL-KVK-27378529-26742'=>'DHKF',
          'NL-KVK-27378529-27115'=>'DSS',
          'NL-KVK-27378529-27528'=>'PDP III',
        );


        for ($i = 0; $i < $activity_count; $i++) {
            $results_length = count($activities[$i]['results']);
            for ($x = 0; $x < $results_length; $x++) {
                $indicator_length = count($activities[$i]['results'][$x]['indicator']);
                for ($y = 0; $y < $indicator_length; $y++) {
                    if (!in_array($activities[$i]['results'][$x]['indicator'][$y]['title']['narratives'][0]['text'], $indicator_titles)) {
                        continue;
                    }
                    $indicator_period_count = count($activities[$i]['results'][$x]['indicator'][$y]['period']);
                    for ($z = 0; $z < $indicator_period_count; $z++) {
                        

                        $result_indicator_description = '';
                        $result_indicator_description_short = '';
                        if ($activities[$i]['results'][$x]['indicator'][$y]['description'] != null){
                            $result_indicator_description = $activities[$i]['results'][$x]['indicator'][$y]['description']['narratives'][0]['text'];
                            $result_indicator_description_short = mb_substr($result_indicator_description, 0, 45);
                        }

                        array_push($rows, array(
                            'activity_id'=> $activities[$i]['id'],
                            'title'=> $activities[$i]['title']['narratives'][0]['text'],
                            'programme'=> $activities[$i]['related_activities'][0]['ref'],
                            'programme_afkorting'=>$programmaAfkortingen[$activities[$i]['related_activities'][0]['ref']],
                            'result_type'=>$activities[$i]['results'][$x]['type']['name'],
                            'result_indicator_title'=>$activities[$i]['results'][$x]['indicator'][$y]['title']['narratives'][0]['text'],
                            'result_indicator_description'=>$result_indicator_description,
                            'result_indicator_description_short'=>$result_indicator_description_short,
                            'baseline_value'=>$activities[$i]['results'][$x]['indicator'][$y]['baseline']['value'],
                            'baseline_year'=>$activities[$i]['results'][$x]['indicator'][$y]['baseline']['year'],
                            'period_target_value'=>$activities[$i]['results'][$x]['indicator'][$y]['period'][$z]['target']['value'],
                            'period_target_year'=>$activities[$i]['results'][$x]['indicator'][$y]['period'][$z]['period_end'],
                            'period_target_comment'=>$activities[$i]['results'][$x]['indicator'][$y]['period'][$z]['target']['comment'],
                            'period_actual_value'=>$activities[$i]['results'][$x]['indicator'][$y]['period'][$z]['actual']['value'],
                            'period_actual_year'=>$activities[$i]['results'][$x]['indicator'][$y]['period'][$z]['period_end'],
                            'period_actual_comment'=>$activities[$i]['results'][$x]['indicator'][$y]['period'][$z]['actual']['comment'],
                        ));


                    }
                }
            }
        } 

        if($format == 'json'){
            header("Content-Type: application/octet-stream");
            header("Content-Disposition: attachment; filename=export.json");
            echo json_encode($rows);
            exit();
        }
        if($format == 'csv'){
            header("Content-type: text/csv");
            header("Content-Disposition: attachment; filename=export.csv");
            header("Pragma: no-cache");
            header("Expires: 0");
            echo implode('', $rows);
            exit();
        }
}
$filename = 'export.' . $format;
header("Content-Type: application/octet-stream");
header("Content-Disposition: attachment; filename=" . $filename);
readfile($url);
