<?php

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "./newUpdateTime_ms.php";

function refreshCheck($cid, $user) {
    global $shortdeadline, $longdeadline;

    // Connect to database and start session
    pdoConnect();
    session_start();

    // Fetching the latest update of the course from the MySQL database
    global $pdo;
    $query = $pdo->prepare('SELECT updated FROM course WHERE cid = :cid;');
    $query->bindParam(':cid', $cid);
    $query->execute();

    // Save the result in a variable
    $updated = "";
    foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
        $updated = $row['updated'];
    }

    // Log fetched data
    error_log("Fetched update time: " . $updated);

    $currentTime = time(); // Get the current time as a Unix timestamp
    $updateTime = strtotime($updated); // Format the update-time as Unix timestamp

    $_SESSION["updatetGitReposCooldown"][$cid] = $updateTime;

    $_SESSION["lastFetchTime"] = date("Y-m-d H:i:s", $currentTime);
    $fetchCooldown = $longdeadline - (time() - $updateTime);
    if($fetchCooldown < 0){
        $_SESSION["fetchCooldown"] = 0;
    } else {
        $_SESSION["fetchCooldown"] = $fetchCooldown;
    }

    // Log calculated times
    error_log("Current time: " . $currentTime);
    error_log("Update time: " . $updateTime);
    error_log("Fetch cooldown: " . $_SESSION["fetchCooldown"]);

    // Check if the user has superuser privileges
    if($user == 1) { // 1 = superuser
        if(($currentTime - $_SESSION["updatetGitReposCooldown"][$cid]) < $shortdeadline) { // If they do, use the short deadline
            print "Too soon since last update, please wait.";
            return false;
        } else {
            newUpdateTime($pdo, $currentTime, $cid);
            return true;
        }
    } else { 
        if(($currentTime - $_SESSION["updatetGitReposCooldown"][$cid]) > $longdeadline) { // Else use the long deadline
            newUpdateTime($pdo, $currentTime, $cid);
            return true;
        } else {
            print "Too soon since last update, please wait.";
            return false;
        }
    }
}

// Get parameters and call the function
$cid = $_GET['cid'];
$user = $_GET['user'];
$hash = $_GET['hash']; // Assuming hash is also a required parameter

error_log("Parameters - CID: $cid, User: $user, Hash: $hash");

$response = array(
    'cid' => $cid,
    'user' => $user
);

header('Content-Type: application/json');
echo json_encode($response);

refreshCheck($cid, $user);
