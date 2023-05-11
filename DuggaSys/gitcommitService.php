<?php 
	// -------------==============######## Setup ###########==============-------------

	// Used to display errors on screen since PHP doesn't do that automatically.
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);

	// Include basic application services!
	include_once "../Shared/basic.php";
	include_once "../Shared/sessions.php";
	include_once "../recursivetesting/FetchGithubRepo.php";

	global $pdo;

	//Get data from AJAX call in courseed.js and then runs the function getCourseID or refreshGithubRepo depending on the action
	if(isset($_POST['action'])) 
	{
		if($_POST['action'] == 'getCourseID') 
		{
			getCourseID($_POST['githubURL']);
		}
		else if($_POST['action'] == 'refreshGithubRepo') 
		{
			refreshGithubRepo($_POST['cid']);
		}
	};

	// -------------==============######## Creating New Course ###########==============-------------

	//--------------------------------------------------------------------------------------------------
	// getCourseID: Fetch the course ID from MySQL with Github URL, then fetch the latest commit from the repo
	//--------------------------------------------------------------------------------------------------

	function getCourseID($githubURL) {
		// Connect to database and start session
		pdoConnect();
		session_start();

		// Translates the url to the same structure as in mysql
		// The "/" needs to be "&#47;" for the query to work
		$newURL = str_replace("/", "&#47;", $githubURL);

		// Fetching from the database
		global $pdo;
		$query = $pdo->prepare('SELECT cid FROM course WHERE courseGitURL = :githubURL;');
		$query->bindParam(':githubURL', $newURL);
		$query->execute();

		$cid = "";
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			$cid = $row['cid'];
			// TODO: Limit this to only one result
		}

		// Get the latest commit from the URL
		// $latestCommit = getCommit($githubURL);

		// Check if not null, else add it to Sqlite db
		// && $latestCommit != ""
		if($cid != null) {
			insertIntoSQLite($githubURL, $cid);
			//, $latestCommit
		} //else if ($latestCommit == "") {
			//print_r("Latest commit not valid");
		//} 
		else {
			print_r("No matches in database!");
		}
	}

	//--------------------------------------------------------------------------------------------------
	// insertIntoSQLite: Insert into Sqlite db when new course is created
	//--------------------------------------------------------------------------------------------------

	function insertIntoSQLite($url, $cid) { //, $commit
		$pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
		$query = $pdolite->prepare("INSERT OR REPLACE INTO gitRepos (cid, repoURL) VALUES (:cid, :repoURL)"); // , lastCommit , :commits
		$query->bindParam(':cid', $cid);
		$query->bindParam(':repoURL', $url);
		//$query->bindParam(':commits', $commit);
		$query->execute();
		if (!$query->execute()) {
			$error = $query->errorInfo();
			echo "Error updating file entries" . $error[2];
			$errorvar = $error[2];
			print_r($error);
			echo $errorvar;
		} else {
			bfs($url, $cid, "REFRESH");
		}
	}

	// -------------==============######## Refresh Github Repo in Course ###########==============-------------

	//--------------------------------------------------------------------------------------------------
	// refreshGithubRepo: Updates the metadata from the github repo if there's been a new commit
	//--------------------------------------------------------------------------------------------------

	function refreshGithubRepo($cid){
		// Get old commit and URL from Sqlite 
		$pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
		$query = $pdolite->prepare('SELECT lastCommit, repoURL FROM gitRepos WHERE cid = :cid');
		$query->bindParam(':cid', $cid);
		$query->execute();

		$commmit = "";
		$url = "";
		foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			$commit = $row['lastCommit'];
			$url = $row['repoURL'];
		}

		//If both values are valid
		if($commit == "" && $url == "") {
			print_r("Error! Couldn't get url and commit from SQLite db");
		} 
		// else if($url != "" && $commit == NULL) {
		// 	// Get the latest commit from the URL
		// 	$latestCommit = getCommit($url);

		// 	// Compare old commit in db with the new one from the url
		// 	if($latestCommit != $commit) {
		// 		// Update the SQLite db with the new commit
		// 		$query = $pdolite->prepare('UPDATE gitRepos SET lastCommit = :latestCommit WHERE cid = :cid');
		// 		$query->bindParam(':cid', $cid);
		// 		$query->bindParam(':latestCommit', $latestCommit);
		// 		$query->execute();

		// 		// Update metadata
		// 		bfs($url, $cid, "REFRESH");
		// 		print "The course has been updated!";
		// 	}
		else {
			// Get the latest commit from the URL
			$latestCommit = getCommit($url);

			// Compare old commit in db with the new one from the url
			if($latestCommit != $commit) {
				// Update the SQLite db with the new commit
				$query = $pdolite->prepare('UPDATE gitRepos SET lastCommit = :latestCommit WHERE cid = :cid');
				$query->bindParam(':cid', $cid);
				$query->bindParam(':latestCommit', $latestCommit);
				$query->execute();

				// Update metadata
				bfs($url, $cid, "REFRESH");
				print "The course has been updated!";
			} else {
				print "The course is already up to date!";
			}
		}
	}
	
	// -------------==============######## Get latest commit from URL ###########==============-------------

	//--------------------------------------------------------------------------------------------------
	// getCommit: Gets the latest commit from a URL using DOM
	//--------------------------------------------------------------------------------------------------

	function getCommit($url) {
		// Turn the HTML from the URL into an DOM document
		$html = file_get_contents($url);
		$dom = new DomDocument;
		$dom->preserveWhiteSpace = FALSE;
		
		// Because of how dom works with html, this is necessary to not fill the screen with errors - the page still prints
		libxml_use_internal_errors(true); 
		$dom->loadHTML($html);
		libxml_use_internal_errors(false);

		// Find the HTML element that holds the latest commit value
		$href = "";
		$elements = $dom->getElementsByTagName('a');
		foreach ($elements as $element) {		
			if($element->getAttribute('class')=='d-none js-permalink-shortcut'){
				$value = $element->getAttribute("href");
				$href = $value;
			}
		}
	
		// Regex to only keep the commit numbers, instead of the entire URL
		$regex = "/^(.*?)\/tree\//";

		// Splitting the string to only keep the commit numbers, then return the value
		if($href != "") {
			$latestCommit = preg_replace($regex, "", $href);
			return $latestCommit;
		} else {
			print_r("No matches in database!");
		}
	}
?>