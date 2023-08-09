<?php

//---------------------------------------------------------------------------------------------------------------
// updateCourse - Updates coursename, visibility, coursecode and courseGitURL of a given course
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

include('../shared_microservices/getUid_ms.php');

// Connect to database and start session
pdoConnect();
session_start();

$opt = getOP('opt');

$query = $pdo->prepare("UPDATE course SET coursename=:coursename, visibility=:visibility, coursecode=:coursecode, courseGitURL=:courseGitURL WHERE cid=:cid;");

$query->bindParam(':cid', $cid);
$query->bindParam(':coursename', $coursename);
$query->bindParam(':visibility', $visibility);
$query->bindParam(':coursecode', $coursecode);
$query->bindParam(':courseGitURL', $courseGitURL);

if(!$query->execute()) {
  $error=$query->errorInfo();
  $debug="Error updating entries\n".$error[2];
}

// Belongs to Logging 
if($visibility==0){
  $visibilityName = "Hidden";
}
else if($visibility==1){
  $visibilityName = "Public";
}
else if($visibility==2){
  $visibilityName = "Login";
}
else if($visibility==3){
  $visibilityName = "Deleted";
}

// Logging for editing of course
$description=$coursename." ".$coursecode." ".$visibilityName;
logUserEvent($userid, $username, EventTypes::EditCourse, $description);

?>