<?php
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
pdoConnect();

$dir = '../../testingdb';
$file = 'testmodels.sql';

// Create directory where sql model is to be stored
if (!file_exists('../../testingdb')) {
	mkdir('../../testingdb', 0777, true);

	echo "<p>Creating '".$dir."' directory</p>";
}
else{
	echo "<p>Directory '".$dir."' already exists </p>";

}

$dbName = DB_NAME . 'testingdb';

// Check if database exists
$query = $pdo->prepare('SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '."'".$dbName."'");
if(!$query->execute()) {
	$error = $query->errorInfo();
	echo "<h4> Error checking for database: ".$error[2]."</h4>";
	exit;
}
else{
	// drop database, removing all changes
	echo "<h3>Database exists already, resetting...</h3>";
	
	$query = $pdo->prepare('DROP DATABASE '.$dbName);
	if(!$query->execute()) {
		$error = $query->errorInfo();
		echo "<h4> Error dropping database: ".$error[2]."</h4>";
		exit;
	}
	else{
		echo "<h2>Database reset</h2>";
	}
}

// create database
$query = $pdo->prepare("CREATE DATABASE IF NOT EXISTS ".$dbName);

if(!$query->execute()) {
	$error = $query->errorInfo();
	echo "<h4> Error creating database: ".$error[2]."</h4>";
	exit;
}
else{
	echo "<h4>Database: ".$dbName." created/already exists, no errors</h4>";
}

// add data to database
if(file_exists($dir."/".$file))
{
	echo "<p>".$dir." exists </p>";
	echo "<p>Installing into: ".$dbName."</p>";
	$ret = shell_exec('mysql --user='.DB_USER.' --password='.DB_PASSWORD.' '.$dbName.' < '.$dir."/".$file);
	echo "<h2>".$ret."</h2>";
}
else{
	echo "<h3> File doesn't exist: ".$file."</h3>";
	exit;
}

updateCoursesyspw($dbName);


// Update coursesyspw.php to include testdatabase
function updateCoursesyspw($name) {
	$filename = "../../coursesyspw.php";
	if(!file_exists($filename))
	{
		echo $filename." doesn't exist<br>";
	}

	$str = 'define("DB_TESTING", "'.$name.'");';
	$contents = file_get_contents($filename);
	$pos = strpos($contents, $str);

	if($pos === false)
	{
		$find = strpos($contents, '?>');
		$pre = substr($contents, 0, $find);
		$post = substr($contents, $find);
		$write = $pre.$str.$post;

		if(file_put_contents($filename, $write) === false)
		{
			echo "can't write to file<br>";
			exit;
		}
		echo "Success writing to {$filename}";
	}
	else{
		echo $str." already exists in 'coursesyspw.php'<br>";
		exit;
	}
}

?>
