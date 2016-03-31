<?php 
include( 'constants.php' );
$format  = $_GET['format'];
$oipa_url = OIPA_URL . '/activities/';

$oipa_url .= '?limit=1000&fields=all&reporting_organisation=NL-KVK-27378529&format=' . $format;
    
if(empty($_GET['detail'])){
    $oipa_filter  = $_GET['filters'];
    $url = $oipa_url . urldecode($oipa_filter);
} else {
    $url = $oipa_url . '&id=' . $_GET['detail'];
}

$filename = 'export.' . $format;
header("Content-Type: application/octet-stream");
header("Content-Disposition: attachment; filename=" . $filename);
readfile($url);
