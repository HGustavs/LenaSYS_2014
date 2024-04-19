<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";


// Connect to database and start session
pdoConnect();
session_start();


// Gets username based on uid, USED FOR LOGGING
$query = $pdo->prepare("SELECT username FROM user WHERE uid = :uid");
$query->bindParam(':uid', $userid);
$query->execute();

// This while is only performed if userid was set through _SESSION['uid'] check above, a guest will not have it's username set, USED FOR LOGGING
while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
	$username = $row['username'];
}   


?>