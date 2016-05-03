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
                $programme_names = array(
                  "NL-KVK-27378529-23408"=>"Private Sector Investment programme (PSI)",
                  "NL-KVK-27378529-26663"=>"Dutch Good Growth Fund (DGGF)",
                  "NL-KVK-27378529-19390"=>"Facility for Infrastructure Development (ORIO)",
                  "NL-KVK-27378529-25403"=>"Centre for the Promotion of Imports from developing countries (CBI)",
                  "NL-KVK-27378529-26225"=>"Life Sciences and Health for Development (LS&H4D)",
                  "NL-KVK-27378529-23188"=>"Transition Facility (TF)",
                  "NL-KVK-27378529-23310"=>"Pilot 2g@there-OS (2getthere-OS)",
                  "NL-KVK-27378529-26067"=>"PSD Apps",
                  "NL-KVK-27378529-26742"=>"Demonstration projects. Feasibility studies and Knowledge acquisition projects (DHKF)",
                  "NL-KVK-27378529-18232"=>"Daey Ouwens Fund - Kleinschalige hernieuwbare energieprojecten (KHED)",
                  "NL-KVK-27378529-25588"=>"Dutch Risk Reduction Team (DRR-Team)",
                  "NL-KVK-27378529-27115"=>"Dutch Surge Support (DSS Water)",
                  "NL-KVK-27378529-23877"=>"Facility for Sustainable Entrepreneurship and Food Security (FDOV)",
                  "NL-KVK-27378529-23710"=>"Sustainable Water Fund",
                  "NL-KVK-27378529-25717"=>"Ghana WASH Window (GWW-FDW)",
                  "NL-KVK-27378529-27528"=>"Product Development Partnerships III Fund"
                );

                // init csv with headers
                $csv = array("code,name,count,budget\n");

                // add csv data
                foreach ($json_obj['results'] as $row) {
                    $code = maybeEncodeCSVField($row['activity_id']);
                    $name = maybeEncodeCSVField($programme_names[$row['activity_id']]);
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
}
$filename = 'export.' . $format;
header("Content-Type: application/octet-stream");
header("Content-Disposition: attachment; filename=" . $filename);
readfile($url);
