<?php
$loggingDataJSON = file_get_contents("php://input"); // JSON string from dugga.js

$logFileName = "log.json";
$latestLogFileName = "latestlog.json";

function getEarlierLogs(){
    if(file_exists($logFileName)){
        $fileContent = file_get_contents($logFileName);
        $fileContentArray = json_decode($fileContent);
        array_push($fileContentArray, $loggingDataJSON);
        return json_encode($fileContentArray);
    }
    else{
        $newJSONData = $loggingDataJSON;
    }
}

// Write to all log file
$fp = fopen($logFileName, 'w');
fwrite($fp, getEarlierLogs());
fclose($fp);

// Write latest log
$fp = fopen($latestLogFileName, 'w');
fwrite($fp, $loggingDataJSON);
fclose($fp);


echo json_encode(['success wirting to log file'=>true]);

?>