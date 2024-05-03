<?php
	session_start();
	include_once "../Shared/basic.php";
	include_once "../Shared/sessions.php";
	//include_once "../../coursesyspw.php";
	include_once "../Shared/toast.php";
	pdoConnect();

	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
	}else{
		$userid="00";
	}

	if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['githubInsert']) && isset($_POST['lid']) && !empty($_POST['githubDir'])) {
		global $pdo;
		$githubDir = $_POST['githubDir'];
		$lid = $_POST['lid'];
		updateGithubDir($pdo, $githubDir, $lid);
	}

	function updateGithubDir($pdo, $githubDir, $lid) {
		try {
			$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$query = $pdo->prepare("UPDATE listentries SET githubDir = :githubdir WHERE lid = :lid");
			$query->bindParam(':githubdir', $githubDir);
			$query->bindParam(':lid',$lid);
			if($query->execute()) {
				echo "<script>console.log('Update Successful!');</script>";
			} else {
				echo "<script>console.log('Update Failed.');</script>";
			} 
		}
		catch(PDOException $exception) {
			echo "<script>console.log('Update Failed: " . addslashes($exception->getMessage()) . "');</script>";
		}
	}
?>

<!DOCTYPE html>
<html lang="en">

<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title id="sectionedPageTitle">Section Editor</title>

	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<!-- <link type="text/css" href="../Shared/css/blackTheme.css" rel="stylesheet"> -->
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<link id="themeBlack" type="text/css" href="../Shared/css/blackTheme.css" rel="stylesheet">
	
	<script src="darkmodeToggle.js"></script>
	<script src="../Shared/loadingButton.js"></script>
	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="sectioned.js"></script>
	<script src="backToTop.js"></script>
	
</head>
<body onload="setup();">

	<?php
		$noup="COURSE";
		include '../Shared/navheader.php';
		$_SESSION['should-validate'] = "TRUE";

		if(checklogin()){
			echo '<script type="text/javascript">',
				'IsLoggedIn(true);',
				'</script>'
			;
			
		}else if(!checklogin()){
			echo '<script type="text/javascript">',
			'IsLoggedIn(false);',
			'</script>'
		;
			
		}
	?>

	<!-- content START -->
	<!-- Div that apper as an alert when a New Item has been created -->
	<div style="z-index: 1500;" id="createAlert"></div>
	<div style="z-index: 1500;" id="updateAlert"></div>
	<div id="content">

		

		<!-- Scroll up START -->

		<div class='fixedScroll' id='fixedScroll'>
			<span class='tooltiptextScroll'>Back to top</span>
			<i class='arrow up' id='scrollUp'></i>
		</div>

		<!-- Scroll up END -->

		<!-- MOTD dropdown -->
		<div id='motdArea' style='display: none;'>
			<?php
				echo "<tr>";
				echo "		<div class='motdBoxheader' >";
				echo "			<h3>Message of the day</h3>";
				echo "				<div class='cursorPointerMOTD' onclick='closeMOTD()'  >x</div>";
				echo "	</div>";
				echo "  <div id='motdContent' style='text-align:center'>";
				echo "		<p style='text-align:center' id='motd'></p>";
				echo" 	</div>";
				echo "</tr>";
			?>
		</div>
		<!-- MOTD dropdown END -->

		<!-- Announcement box -->
		<div id="announcementBoxOverlay">
			<div id="announcementBox">
				<div id="actionLogDisplay">
					<?php 		

					if (isset($_SESSION["announcementcreated"])) {
						echo '<div class="announcementcreated"><span>'.$_SESSION["announcementcreated"].'</span><span onclick="closeActionLogDisplay();" class="closeActionLogDisplay" title="Close">&times;</span></div>';
					}elseif (isset($_SESSION['announcementupdated'])) {
						echo '<div class="announcementupdated"><span>'.$_SESSION["announcementupdated"].'</span><span onclick="closeActionLogDisplay();" class="closeActionLogDisplay" title="Close">&times;</span></div>';
					}elseif(isset($_SESSION['announcementdeleted'])){
						echo '<div class="announcementdeleted"><span>'.$_SESSION["announcementdeleted"].'</span><span onclick="closeActionLogDisplay();" class="closeActionLogDisplay" title="Close">&times;</span></div>';

					}

					unset($_SESSION['announcementcreated']);
					unset($_SESSION['announcementupdated']);
					unset($_SESSION['announcementdeleted']);

					?>
				</div>
				<div id="formContainer">
				<?php 
				$_SESSION['courseid'] = $_GET['courseid'];
				$_SESSION['coursename'] = $_GET['coursename'];
				$_SESSION['coursevers'] = $_GET['coursevers'];
				//include "../Shared/announcementBox.php"; 

				?>
				</div>
				<div id="displayAnnouncements">
					<div id="announcementCards"></div>
				</div>
			</div>
		</div>

		<!-- + button --->


		<div id='Sectionlist'>

		<div class='course' style='display:flex; align-items:center; justify-content:flex-end; '>
			
			<!-- Undo button -->
			<input id="undoButton" value="&#9851;" type="button" class='submit-button-newitem' title="Undo deleted example" style="position: absolute; padding-right:5px; margin-right:165px; display: none;" onclick="cancelDelete();">
			<!-- Undo button END -->

			<!-- Hide button -->
		
			<div class='fixed-action-button3 sectioned3'  id="HIDEStatic" style="display:none">
				<!-- <input id='tabElement'  type='button' value="&#8633;" style="padding-right:5px" class='submit-button-newitem' title='Tab items' onclick='confirmBox("openTabConfirmBox");'> -->
				<input id='showElements'  type='image' src='../Shared/icons/eye_icon.svg' style="padding-right:5px; margin-right: 10px;" class='submit-button-newitem' title='Show hidden items' onclick='confirmBox("openItemsConfirmBox");'>
				<input id='hideElement'  type='image' src='../Shared/icons/ghost_icon.svg' style="padding-right:5px; margin-right: 10px;" class='submit-button-newitem' title='Hide marked items' onclick='confirmBox("openHideConfirmBox");'>
				<input id='addElement'  type='button' value='+' style="top:-493px; margin-right:10px;" class='submit-button-newitem' title='New Item'>
			</div>
		
			<!-- end hide button -->

			<!-- Small FAB Button in top in the header of sectioned -->
		
			<div style="margin:10px;">
				<img src="../Shared/icons/right_complement.svg" alt='Show List Content' id="sectionList_arrowStatisticsOpen">
				<img src="../Shared/icons/desc_complement.svg" alt='Hide List Content' id="sectionList_arrowStatisticsClosed">
			</div>
			<div class='fixed-action-button2 sectioned2'  id="FABStatic2" style="display:none">
				<input id='addElement'  type='button' value='+' style="margin-right:20px; top:-493px" class='submit-button-newitem' title='New Item' >
				<ol class='fab-btn-list2' style='display: none;'  reversed id='fabBtnList2'>
							<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out' tabindex='0' data-tooltip='Heading' onclick='createFABItem("0","New Heading","TOP");'><img alt='heading format icon' class='fab-icon' src='../Shared/icons/heading-icon.svg'></a></li>
							<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out' tabindex='0' data-tooltip='Section' onclick='createFABItem("1","New Section","TOP");'><img alt='section format icon' class='fab-icon' src='../Shared/icons/section-icon.svg'></a></li>
							<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out' tabindex='0' data-tooltip='Moment' onclick='createFABItem("4","New Moment","TOP");'><img alt='moment format icon' class='fab-icon' src='../Shared/icons/moment-icon.svg'></a></li>
							<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out' tabindex='0' data-tooltip='Test' onclick='createFABItem("3","New Test","TOP");'><img alt='test document icon' class='fab-icon' src='../Shared/icons/test-icon.svg'></a></li>
							<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out noselect centered-icon' tabindex='0' data-tooltip='Link' onclick='createFABItem("5","New Link","TOP");'><i alt='link chain icon' class='material-icons'>link</i></a></li>
							<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out' tabindex='0' data-tooltip='Code' onclick='createFABItem("2","New Code","TOP");'><img alt='code tag icon' class='fab-icon' src='../Shared/icons/code-icon.svg'></a></li>
							<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out' tabindex='0' data-tooltip='Group activity' onclick='createFABItem("6","New Group","TOP");'><img alt='multiple users icon' class='fab-icon' src='../Shared/icons/group-icon.svg'></a></li>
							<li><a class='btn-floating fab-btn-sm2 scale-transition scale-out noselect' tabindex='0' data-tooltip='Message' onclick='createFABItem("7","New Quote","TOP");'><i alt='quotation mark icon' class='material-icons'>format_quote</i></a></li>
					</ol>
			</div>
			
			<!-- Hide button -->
		
			<!-- <div class='fixed-action-button3 sectioned3'  id="HIDEStatic" style="display:none">
				<input id='tabElement'  type='button' value="&#8633;" style="padding-right:5px" class='submit-button-newitem' title='Tab items' onclick='confirmBox("openTabConfirmBox");'>
				<input id='hideElement'  type='image' src='../Shared/icons/ghost_icon.svg' style="padding-right:5px; margin-right: 10px;" class='submit-button-newitem' title='Hide marked items' onclick='confirmBox("openHideConfirmBox");'>
			</div> -->
		
			<!-- end hide button -->
			
			<div id='course-label' style='flex-grow:1'>
					<span id='course-coursename' class='nowrap ellipsis' >UNK</span>
					<span id='course-coursecode' style='margin-right:10px;'>UNK</span>
					<span id='course-versname' class='courseVersionField'>UNK</span>
			</div>


			<div id='course-newitem' style='display: flex;'>

			</div>

			<!-- test #1 -->

			<div id='course-coursevers' style='display:none; margin-right:10px;' >UNK</div>
			<div id='course-courseid' style='display:none; margin-right:10px;' >UNK</div>

		</div>

		<!-- + button END -->
		
		<!-- FAB Start -->
		<!-- Big FAB Button in the bottom of the page -->
		<div class='fixed-action-button extra-margin' id="FABStatic" style="display:none">
				<a class='btn-floating fab-btn-lg noselect' id='fabBtn' tabindex='0' onclick='incrementItemsToCreate();'>+</a>
				<ol class='fab-btn-list' style='margin: 0; padding: 0; display: none;' reversed id='fabBtnList'>
					<li><a class='btn-floating fab-btn-sm scale-transition scale-out noselect' tabindex='0' data-tooltip='Heading' onclick='createFABItem("0","New Heading","undefined");'><img alt='heading format icon' class='fab-icon' src='../Shared/icons/heading-icon.svg'></a></li>
					<li><a class='btn-floating fab-btn-sm scale-transition scale-out noselect' tabindex='0' data-tooltip='Section' onclick='createFABItem("1","New Section","undefined");'><img alt='section format icon' class='fab-icon' src='../Shared/icons/section-icon.svg'></a></li>
					<li><a class='btn-floating fab-btn-sm scale-transition scale-out noselect' tabindex='0' data-tooltip='Moment' onclick='createFABItem("4","New Moment","undefined");'><img alt='moment format icon' class='fab-icon' src='../Shared/icons/moment-icon.svg'></a></li>
					<li><a class='btn-floating fab-btn-sm scale-transition scale-out noselect' tabindex='0' data-tooltip='Test' onclick='createFABItem("3","New Test","undefined");'><img alt='test document icon' class='fab-icon' src='../Shared/icons/test-icon.svg'></a></li>
					<li><a class='btn-floating fab-btn-sm scale-transition scale-out noselect centered-icon' tabindex='0' data-tooltip='Link' onclick='createFABItem("5","New Link","undefined");'><i alt='link chain icon' class='material-icons'>link</i></a></li>
					<li><a class='btn-floating fab-btn-sm scale-transition scale-out noselect' tabindex='0' data-tooltip='Code' onclick='createFABItem("2","New Code","undefined");'><img alt='code tag icon' class='fab-icon' src='../Shared/icons/code-icon.svg'></a></li>
					<li><a class='btn-floating fab-btn-sm scale-transition scale-out noselect' tabindex='0' data-tooltip='Group activity' onclick='createFABItem("6","New Group","undefined");'><img alt='multiple users icon' class='fab-icon' src='../Shared/icons/group-icon.svg'></a></li>
					<li><a class='btn-floating fab-btn-sm scale-transition scale-out noselect' tabindex='0' data-tooltip='Message' onclick='createFABItem("7","New Message","undefined");'><i alt='message mark icon' class='material-icons'>format_quote</i></a></li>
				</ol>
		</div>
		

		<!-- FAB END -->

		<div id='courseList'>

		<!-- Section List -->

		<div id='Sectionlisti'>
		
		</div>
		
	</div>
	
	<!-- <div class="course">
		<span style="text-align: center;">
			<a href="../Shared/calendar.php?courseid=<?php echo $_GET['courseid']; ?>&coursevers=<?php echo $_GET['coursevers']; ?>" style="color:#fff">Subscribe for deadlines in your personal calendar</a>
		</span>
	</div> -->
	<!-- content END -->

	<?php
		include '../Shared/loginbox.php';
	?>			

		<!-- Edit Section Dialog START -->

		<div id='editSection' onkeyup="validateSectName('sectionname');" onmouseover="validateSectName('sectionname'); validateDate2('setDeadlineValue','dialog8');"  class='loginBoxContainer' style='display:none;'>
		<div class='loginBox DarkModeBackgrounds DarkModeText' style='width:460px;'>

			<div class='loginBoxheader'>
				<h3 id='editSectionDialogTitle'>Edit Item</h3>
				<div class='cursorPointer' onclick='closeWindows(); closeSelect();showSaveButton();'>x</div>
			</div>
			<div style='padding:5px;'>
				<input type='hidden' id='lid' value='Toddler' />
				<input type='hidden' id='comments'  />
				<div id='inputwrapper-name' class='inputwrapper'>
					<span>Name:</span>
					<input onkeyup="quickValidateForm('editSection', 'saveBtn');" onchange="validateSectName('sectionname')" placeholder='Enter section name'  type='text' class='textinput' id='sectionname' value='sectionname' maxlength="64"/>
				</div>
				<div class="formDialog" style="display: block; margin-left:40px; top:-35px;">
  		      		<span id="dialog10" style="display: none; left:0px;" class="formDialogText">Illegal characters found in the title!<br>Valid characters: A-Ö, 0-9.</span>
  		      	</div>
				<div id='inputwrapper-type' class='inputwrapper'>
					<span>Type:</span>
					 <!-- If you want to change the names of the spans, make sure that they fit with the dropdown box.
						If they don't, change the width of loginbox select in the CSS file -->
					<select id='type' value='type' onchange='changedType(document.getElementById("type").value);'></select>
					</div>
					<div id='inputwrapper-link' class='inputwrapper'><span>Link:</span><select id='link' ></select></div>
					<div id='inputwrapper-gradesystem' class='inputwrapper'><span>Grade system:</span><select id='gradesys' ></select></div>

					<div id='inputwrapper-deadline' class='inputwrapper'>
							<legend><h3>Deadline</h3></legend>
							<span>Absolute</span>
							<span style='float:right;margin-right:10px;'>
								<input onchange="quickValidateForm('editSection', 'saveBtn');" class='textinput' type='date' id='setDeadlineValue' value='' />
								<select style='width:55px;' id='deadlineminutes'></select>
								<select style='width:55px;' id='deadlinehours'></select>
								<input type='checkbox' id='absolutedeadlinecheck' style='margin:3px 5px; height:20px' onclick='checkDeadlineCheckbox(this); quickValidateForm("editSection", "saveBtn");'/>
							</span>
							<br />
							<span title="Relative deadline that relates to the start of the course instead of a set date">Relative</span>
							<span style='float:right;margin-right:10px;'>
								<select style='width:130px;margin:0 0 0 10px;' id='relativedeadlinetype'></select>
								<select style='width:55px;margin:0 0 0 10px;' id='relativedeadlineamount'></select>
								<select style='width:55px;margin:0 0 0 10px;' id='relativedeadlineminutes'></select>
								<select style='width:55px;margin:0 0 0 10px;' id='relativedeadlinehours'></select>
							</span>
							<div class="formDialogWide" style="display: block; left:40px; top:-35px;">
  		      					<span id="dialog8" style="font-size:11px; border:0px; margin-left: 20px; display:none;" class="formDialogText">Deadline has to be between start date and end date</span>
  		      				</div>
					</div>
					<!-- <div id='inputwrapper-tabs' class='inputwrapper'><span>Tabs:</span><select id='tabs' ></select></div> -->
					<div id='inputwrapper-highscore' class='inputwrapper'><span>High score:</span><select id='highscoremode' ></select></div>
					<div id='inputwrapper-moment' class='inputwrapper'><span>Moment:</span><select id='moment'></select></div>
					<div id='inputwrapper-visibility' class='inputwrapper'><span>Visibility:</span><select style='align:right;' id='visib'></select></div>
					<div id='inputwrapper-group' class='inputwrapper'><span>Group type:</span><select style='align:right;' id='grptype'></select></div>
					<div id='inputwrapper-Feedback' class='inputwrapper'><span>Enable Student Feedback:</span><input type="checkbox"  style='align:center;' id='fdbck' title='Student feedback checkbox' onchange='showFeedbackquestion()'></input></div>
					<div id='inputwrapper-FeedbackQuestion' class='inputwrapper' style='display:none;'><span>Student Feedback Question:</span><input type="input"  class='textinput' id='fdbckque' value='How would you grade the dugga?'></input></div>
				</div>

				<!-- Error message, no duggas present-->
				<div style='padding:20px;'>
					<input style='display:none; float:left;' class='submit-button deleteDugga' type='button' value='Delete' onclick='deleteItem();' />
					<input style='display:block; float:left;' class='submit-button closeDugga' type='button' value='Cancel' onclick='closeWindows(); closeSelect();' />
					<input id="submitBtn" style='display:none; float:right;' class='submit-button submitDugga' type='button' value='Submit' onclick='newItem(); showSaveButton();' />
					<input id="saveBtn" onmouseover='quickValidateForm("editSection", "saveBtn");' style='float:right;' class='submit-button updateDugga' type='button' value='Save' onclick='validateForm("editSection"); clearHideItemList();' />
				</div>
			</div>
		</div>
	<!-- Edit Section Dialog END -->

	<!-- Confirm Section Dialog START -->
	<div id='sectionConfirmBox' class='loginBoxContainer' style='display:none;'>
		<div class='loginBox DarkModeBackgrounds DarkModeText' style='width:460px;'>
			<div class='loginBoxheader'>
					<h3>Confirm deletion</h3>
					<div class="cursorPointer" onclick='confirmBox("closeConfirmBox");' title="Close window">x</div>
			</div>
			<div style='text-align: center;'>
					<h4>Are you sure you want to delete this item?</h4>
					<p>(You can always undo!)</p>
			</div>
			<div style='display:flex; align-items:center; justify-content: center;'>
				<input style='margin-right: 5%;' class='submit-button' id="delete-item-button" type='button' value='Yes' title='Yes' onclick='confirmBox("deleteItem");' />
				<input style='margin-left: 5%;' class='submit-button' id="close-item-button" type='button' value='No' title='No' onclick='confirmBox("closeConfirmBox");' />
			</div>
		</div>
	</div>


	<!-- Canvas Link Dialog -->
	<div id='canvasLinkBox' class='loginBoxContainer' style='display:none;'>
		<div class='loginBox DarkModeBackgrounds DarkModeText' style='min-width:250px;'>
			<div class='loginBoxheader'>
					<h3 style='text-align: center;'>Link Copied To Clipboard</h3>
					<div class="cursorPointer" onclick='showCanvasLinkBox("close",this);' title="Close window">x</div>
			</div>
			<div style='text-align: center; padding-top:25px;'>
					<input type="text" id="canvasLinkText" readonly value="">
			</div>
		</div>
	</div>

	<!-- Confirm Edit Section Dialog END -->

	<!-- Confirm Section Hide Dialog START -->
	<div id='sectionHideConfirmBox' class='loginBoxContainer' style='display:none;'>
		<div class='loginBox DarkModeBackgrounds DarkModeText' style='width:460px;'>
			<div class='loginBoxheader'>
					<h3>Confirm hiding</h3>
					<div class="cursorPointer" onclick='confirmBox("closeConfirmBox");' title="Close window">x</div>
			</div>
			<div style='text-align: center;'>
					<h4>Are you sure you want to hide this item?</h4>
			</div>
			<div style='display:flex; align-items:center; justify-content: center;'>
				<input style='margin-right: 5%;' class='submit-button' id="hide-item-button" type='button' value='Yes' title='Yes' onclick='confirmBox("hideItem");' />
				<input style='margin-left: 5%;' class='submit-button' id="close-item-button" type='button' value='No' title='No' onclick='confirmBox("closeConfirmBox");' />
			</div>
		</div>
	</div>
	<!-- Confirm Edit Section Hide Dialog END -->

	<!-- Confirm Section Hide Dialog START -->
	<div id='sectionShowConfirmBox' class='loginBoxContainer' style='display:none;'>
		<div class='loginBox DarkModeBackgrounds DarkModeText' style='width:460px;'>
			<div class='loginBoxheader'>
					<h3>Confirm show items</h3>
					<div class="cursorPointer" onclick='confirmBox("closeConfirmBox");' title="Close window">x</div>
			</div>
			<div style='text-align: center;'>
					<h4>Are you sure you want to show this item?</h4>
			</div>
			<div style='display:flex; align-items:center; justify-content: center;'>
				<input style='margin-right: 5%;' class='submit-button' id="hide-item-button" type='button' value='Yes' title='Yes' onclick='confirmBox("showItems");' />
				<input style='margin-left: 5%;' class='submit-button' id="close-item-button" type='button' value='No' title='No' onclick='confirmBox("closeConfirmBox");' />
			</div>
		</div>
	</div>
	<!-- Confirm Edit Section Hide Dialog END -->

	<!-- Cofirm Section Tab Dialog START -->
	<div id='tabConfirmBox' class='loginBoxContainer' style='display:none;'>
		<div class='loginBox' style='width:460px;'>
			<div class='loginBoxheader'>
					<h3>Confirm tab</h3>
					<div class="cursorPointer" onclick='confirmBox("closeConfirmBox");' title="Close window">x</div>
			</div>
			<div style='text-align: center;'>
					<h4>How many tabs?</h4>
			</div>
			<div style='display:flex; align-items:center; justify-content: center;'>
				<div id='inputwrapper-tabs' class='inputwrapper'><span>Tabs:</span>
					<select id='tabs'>
						<option value="0">0 tabs</option>
						<option value="1">1 tabs</option>
						<option value="2">2 tabs</option>
						<option value="3">3 tabs</option>
						<option value="4">1 tabs + end</option>
						<option value="5">2 tabs + end</option>
						<option value="6">3 tabs + end</option>
					</select>
				</div>
			</div>
			<div style='display:flex; align-items:center; justify-content: center;'>
				<input style='margin-right: 5%;' class='submit-button' id="hide-item-button" type='button' value='OK' title='OK' onclick='confirmBox("tabItem");' />
			</div>
		</div>
	</div>
	<!-- Cofirm Edit Section Tab Dialog END -->

	<!-- Confirm Missing Material Dialog START -->
	<div id='noMaterialConfirmBox' class='loginBoxContainer' style='display:none;'>
		<div class='loginBox' style='width:460px;'>
				<div class='loginBoxheader'>
					<h3>Error: Missing material</h3>
					<div class="cursorPointer" onclick='confirmBox("closeConfirmBox");' title="Close window">x</div>
				</div>
				<div style='text-align: center;'>
					<h4 id="noMaterialText"></h4>
				</div>
				<div style='display:flex; align-items:center; justify-content: center;'>
					<input style='margin-right: 5%;' class='submit-button' type='button' value='OK' title='OK' onclick='confirmBox("closeConfirmBox");'/>
				</div>
		</div>
	</div>
	<!-- Confirm Missing Material Dialog END -->

		<!-- New Version Dialog START -->
		<div id='newCourseVersion' class='loginBoxContainer' style='display:none;'>
    	<div class='loginBox DarkModeBackgrounds DarkModeText' style='width:464px; overflow:hidden;'>
			<div class='loginBoxheader'>
				<h3>New Course Version</h3>
				<div class="cursorPointer" onclick='closeWindows();' title="Close window">x</div>
			</div>
			<div style='padding:5px;'>
				<div class='inputwrapper'>
					<span>Version ID:</span>
					<div class="formDialog versionDialog" >
						<span id="dialog2" class="formDialogText">3 to 8 numbers required</span>
					</div>
					<input onkeyup="quickValidateForm('newCourseVersion', 'submitCourseMotd');" class='textinput' type='text' id='cversid' placeholder='Version ID' maxlength='8'/>
				</div>
				<div class='inputwrapper'>
					<span>Version Name:</span>
					<div class="formDialog versionDialog">
						<span id="dialog" class="formDialogText">Must be in of the form HTNN, VTNN or STNN</span>
					</div>
					<input onkeyup="quickValidateForm('newCourseVersion', 'submitCourseMotd'); " class='textinput' type='text' id='versname' placeholder='Version Name' />
				</div>
				<div class='inputwrapper'>
					<span>Start Date:</span>
					<div class="formDialog versionDialog">
						<span id="dialog3" class="formDialogText formDialogTextHalfDownShift">Start date has to be before end date</span>
					</div>
					<input onchange="quickValidateForm('newCourseVersion', 'submitCourseMotd'); " class='textinput' type='date' id='startdate' value='' />
				</div>
				<div class='inputwrapper'>
					<span>End Date:</span>
					<input onchange="quickValidateForm('newCourseVersion', 'submitCourseMotd'); " class='textinput' type='date' id='enddate' value='' />
				</div>
				<div class='inputwrapper'>
					<span>MOTD:</span>
					<div class="formDialog versionDialog" >
						<span id="dialog4" class="formDialogText formDialogSplitUp">Prohibited symbols</span>
						<span id="dialog42" class="formDialogText formDialogSplitDown">Max 50 characters</span>
					</div>
					<input onkeyup="quickValidateForm('newCourseVersion', 'submitCourseMotd'); " class='textinput' type='text' id='vmotd' placeholder='MOTD' value='' />
				</div>
				<div class='inputwrapper'><span>Change this to default version</span><input type="checkbox" name="makeactive" id="makeactive" title='default version checkbox' value="yes"></div>
				<div class='inputwrapper'><span>Copy content from:</span><select id='copyvers'></select></div>
			</div>
			<div style='padding:5px;'>
				<input id='submitCourseMotd' class='submit-button' type='button' value='Create' disabled title='Create new version' onmouseover="quickValidateForm('newCourseVersion', 'submitCourseMotd');" onclick="validateForm('newCourseVersion')" />
			</div>
		</div>
	</div>
	<!-- New Verison Dialog END -->

<!-- Edit Version Dialog START -->

<div id='editCourseVersion' onmouseover="quickValidateForm('editCourseVersion', 'submitEditCourse');" class='loginBoxContainer' style='display:none;'>
		<div class='loginBox DarkModeBackgrounds DarkModeText' style='width:464px; overflow:hidden;'>

			<div class='loginBoxheader'>
				<h3>Edit Course Version</h3>
				<div class='cursorPointer' onclick='closeWindows();'>x</div>
			</div>
			<div style='padding:5px;'>
				<input type='hidden' id='cid' value='Toddler' />
				<div class='inputwrapper'><span>Version ID:</span><input class="greyedout-textinput" disabled type='text' id='eversid' placeholder='Version ID' /></div>
				<div class='inputwrapper'><span>Version Name:</span><input onkeyup="quickValidateForm('editCourseVersion', 'submitEditCourse'); " class='textinput' type='text' id='eversname' placeholder='Version Name'/></div>
				<div class="formDialog" style="display: block; left:54px; top:-36px;"><span id="dialog5" style="display: none; left:0px;" class="formDialogText">Must be in of the form HTNN, VTNN or STNN</span></div>
				<div class='inputwrapper'><span>Start Date:</span><input onchange="quickValidateForm('editCourseVersion', 'submitEditCourse');" class='textinput' type='date' id='estartdate' title='Start date input' value='' /></div>
				<div class='inputwrapper'><span>End Date:</span><input onchange="quickValidateForm('editCourseVersion', 'submitEditCourse');" class='textinput' type='date' id='eenddate' title='End date input' value='' /></div>
				<div class="formDialog" style="display: block; left:54px; top:-50px;"><span id="dialog6" style="display: none; left:0px;" class="formDialogText">Start date has to be before end date</span></div>
				<div class='inputwrapper'><span>MOTD:</span><input onkeyup="quickValidateForm('editCourseVersion', 'submitEditCourse'); " class='textinput' type='text' id='eMOTD' placeholder='MOTD'/></div>
				<div class="formDialog" style="display: block; left:54px; top:-40px;"><span id="dialog9" style="display: none; left:0px;" class="formDialogText">Prohibited symbols</span></div>
				<div class="formDialog" style="display: block; left:54px; top:-22px;"><span id="dialog92" style="display: none; left:0px;" class="formDialogText">Max 50 characters</span></div>
				<div class='inputwrapper'><span>Change this to default version</span><input type="checkbox" name="emakeactive" id="emakeactive" title='Default version checkbox' value="yes"></div>
			</div>
			<div style='padding:5px;'>
				<input id='submitEditCourse' class='submit-button' type='button' value='Save' title='Save changes' onclick="validateForm('editCourseVersion')" />
			</div>
		</div>
	</div>
	<!-- Edit Version Dialog END -->

<!-- Group Members Table START -->
<div id='grptblContainer' class='loginBoxContainer' style='display:none;'>
		<div class='loginBox'>
			<div class='loginBoxheader'>
				<h3>Group Members</h3>
				<div class='cursorPointer' onclick='closeWindows();'>x</div>
			</div>
			<div style='padding:5px;'>
				<div id='grptbl'></div>
			</div>
		</div>
	</div>
	<!-- Group Members Table END -->


	<!-- HighscoreBox START -->
	<div id='HighscoreBox' class='loginBoxContainer' style='display:none;'>
		<div class='loginBox' style='width:500px;'>
			<div class='loginBoxheader'>
				<h3>Highscore</h3>
				<div class='cursorPointer' onclick='closeWindows();'>x</div>
			</div>
			<table id ='HighscoreTable' width='100%'>
				<tr></tr>
			</table>
		</div>
	</div>
	<!-- HighscoreBox END -->

	<!-- User Feedback Dialog START -->
    <div id='userFeedbackDialog' class='loginBoxContainer' style='display:none;'>
      <div class='loginBox' id='variantBox'>
        <div class='loginBoxheader'>
          <h3 id="userFeedbackTitle">User Feedback</h3> 
          <div class='cursorPointer' onclick='closeWindows();'>x</div>
        </div>
		<h2 id="duggaFeedbackQuestion"></h2>
		<div id="statscontainer">
			<div class="statsdiv"><p id="avg-feedback"></p>Average value</div>
			<div class="statsdiv"><p id="median-feedback"></p>Highest/lowest</div>
			<div class="statsdiv"><p id="total-feedback"></p>Amount of feedbacks</div>
		</div>
		<div id="feedbacktablecontainer">
		</div>
      </div>
    </div>
    <!-- User Feedback Dialog END -->

	
	<!-- Load Dugga Popup (Enter hash to get redirected to specified dugga) -->
	<div id='loadDuggaBox' class="loginBoxContainer" style="display:none">
	  <div class="loadDuggaBox loginBox DarkModeBackgrounds DarkModeText" style="max-width:400px; overflow-y:visible;">
			<div class='loginBoxheader'><h3>Load dugga with hash</h3><div class='cursorPointer' onclick="hideLoadDuggaPopup()">x</div></div>
			<div id='loadDuggaInfo'></div>
    		<div id='loadDuggaPopup' style="display:block">
				<div class='inputwrapper'><span>Enter your hash:</span><input class='textinput' type='text' id='hash' placeholder='Hash' value=''/></div>
				<div class="button-row">
					<input type='button' class='submit-button' onclick="loadDugga();" value='Load Dugga'>
					<input type='button' class='submit-button' onclick="hideLoadDuggaPopup();" value='Close'>
				</div>
    		</div>
      </div>
	</div>
	<!-- Load Dugga Popup (Enter hash to get redirected to another dugga) End! -->


	<!-- github moments box  -->
	<form action="" method="POST" id="form">
		<div id='gitHubBox' class='loginBoxContainer' style='display:none;'>
			<div class='loginBox DarkModeBackgrounds DarkModeText' style='width:460px;'>
				<div class='loginBoxheader'>
					<h3>Github Moment</h3>
					<div class="cursorPointer" onclick='confirmBox("closeConfirmBox");' title="Close window">x</div>
				</div>
				<div class='inputwrapper'>
					<span>Github Directory:</span>
						<select name="githubDir" placeholder='Github Folder' onchange='saveLocalStorage(this)'>
							<!-- Below inputs are made that are fed into the "if-statement" in the top of the code, just before "updateGithubDir" -->
							<?php
								// Gets "cid" via getOPG.
								$cid = getOPG('courseid');
								// Traverses the github map for the respective course, only fetches directories.
								$dirs = glob("../courses/$cid/Github/*", GLOB_ONLYDIR);
								foreach ($dirs as $dir) {
									$dirname = basename($dir);
									// Creates an option for each directory containing the string "Examples". 
									echo "<option value='$dirname'>$dirname</option>";	
								}			
							?>
						</select>
					</div>
				<input type="hidden" name="lid" id="lidInput">
				<!-- Hidden input using the "lid" from "getLidFromButton" -->
				<input type="submit" name="githubInsert" value="Submit!">
			</div>
		</div>
	</form>
	
	<!--error window opened when github repo not found-->
	<div id="githubPopupWindow" class="loginBoxContainer" style="display: none;">
		<div class="loginBox DarkModeBackgrounds" style='width:464px;overflow:hidden;'>	
			<div class= "loginBoxheader">
  					<h3>Github repo</h3>
		  			<div class='cursorPointer'	onclick='closeWindows();'>x</div>
			</div>
			<div style="padding:5px; padding-top:20px;">
  				<span>There is currently no valid github repo. Add one?</span>
			</div>
			<div style='padding:5px;'>
				<input type='hidden' id='cidTrue' value='<?php echo $_GET["courseid"];?>'/>
				<form action="" method="POST" id="repoLink">
					<div class= 'inputwrapper'><span>Github repo link:</span><input type="text" id="gitRepoURL" class="textinput" name="reponame" placeholder="https://github.com/username/repository"/></div>
				</form>
			</div>
			<div style='padding-top:15px; width: 464px;'>
				<div id="buttonContainerSaveRepo"></div>
			</div>
		</div>
	</div>

	<!-- github template  -->
		<div id='gitHubTemplate' class="loginBoxContainer" style="display:none;">
				<div id='chooseTemplate' class='loginBox DarkModeBackgrounds' style='width:464px;'>
					<div class='loginBoxheader'>
						<h3>Choose Template</h3>
						<div class='cursorPointer' onclick='confirmBox("closeConfirmBox");'>x</div>
					</div>
					<table width="100%">
						<tr>
							<td id="templat1" class="tmpl"><input id="templateno" type="hidden" value="0" />
								<img class='templatethumbicon wiggle' onclick='changetemplate("1");' src='../Shared/icons/template1_butt.svg' />
							</td>
							<td id="templat2" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("2");' src='../Shared/icons/template2_butt.svg' /></td>
							<td id="templat3" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("3");' src='../Shared/icons/template3_butt.svg' /></td>
							<td id="templat4" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("4");' src='../Shared/icons/template4_butt.svg' /></td>
							<td id="templat5" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("5");' src='../Shared/icons/template5_butt.svg' /></td>
							<td id="templat6" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("6");' src='../Shared/icons/template6_butt.svg' /></td>
							<td id="templat7" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("7");' src='../Shared/icons/template7_butt.svg' /></td>
							<td id="templat8" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("8");' src='../Shared/icons/template8_butt.svg' /></td>
							<td id="templat9" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("9");' src='../Shared/icons/template9_butt.svg' /></td>
							<td id="templat10" class="tmpl"><img class='templatethumbicon wiggle' onclick='changetemplate("10");' src='../Shared/icons/template10_butt.svg' /></td>
						</tr>
					</table>
					<table id="templateOptions" width="100%">
					</table>
					<table width="100%">
					    <tr> 
				            <td align='right'><input class='submit-button' type='button' value='Save' onclick='fetchGitCodeExamples(<?php echo $_GET["courseid"]; ?>);' /></td>
						</tr>
						<div class='inputwrapper'><span>Name:</span><input class='textinput' type='text' id='fileName' placeholder='Name.type' value=''/></div>
						<div class='inputwrapper'><span>GithubUrl:</span><input class='textinput' type='text' id='githubURL' placeholder='GitHubDownloadUrl' value=''/></div>
						<div class='inputwrapper'><span>Filepath:</span><input class='textinput' type='text' id='filePath' placeholder='no' value=''/></div>
                        
					</table>
				</div>
				
		</div>
<?php
//Insert into gitRepo DB
function insertIntoSqLiteGitRepo($cid, $githubURL){
	//First query: Check if a row with same cid already exists. If not, insert into db.
	$pdoLite = new PDO('sqlite:../../githubMetadata/metadata2.db');
	$query = $pdoLite->prepare("SELECT COUNT(*) FROM gitRepos WHERE cid = ?");
	$query->execute([$cid]);
	$count = $query->fetchColumn();

	if($count > 0){
		//A repo with the same cid primary key already exists. Do nothing.
	} else {
		$query = $pdoLite->prepare("INSERT OR REPLACE INTO gitRepos (cid, repoURL) VALUES (:cid, :repoURL)"); 
		$query->bindParam(':cid', $cid);
		$query->bindParam(':repoURL', $githubURL);
		if (!$query->execute()) {
			$error = $query->errorInfo();
			echo "Error updating entry in gitRepos" . $error[2];
		}
	}
}

//Insert files into gitFiles DB
function insertIntoSqLiteGitFiles($cid, $fileNames, $filePaths, $fileURLS, $downloadURLS, $fileTypes, $SHA){
    $pdoLite = new PDO('sqlite:../../githubMetadata/metadata2.db');
    $successInsert = true;
    $count = count($fileNames);
    for($i = 0; $i < $count; $i++){
        $query = $pdoLite->prepare('REPLACE INTO gitFiles (cid, fileName, fileType, fileURL, downloadURL, fileSHA, filePath) VALUES (:cid, :fileName, :fileType, :fileURL, :downloadURL, :fileSHA, :filePath)');
        $query->bindParam(':cid', $cid);
        $query->bindParam(':fileName', $fileNames[$i]);
        $query->bindParam(':fileType', $fileTypes[$i]);
        $query->bindParam(':fileURL', $fileURLS[$i]);
        $query->bindParam(':downloadURL', $downloadURLS[$i]);
        $query->bindParam(':fileSHA', $SHA[$i]);
        $query->bindParam(':filePath', $filePaths[$i]);
        $success = $query->execute();
        if(!$success){
            $successInsert = false;
            echo "Insertion into gitFiles failed. File: " . $fileNames[$i];
        }
    }
    if($successInsert){
        echo "All insertions into gitFiles were successful.";
    }
}

//Creates courses directory in root if it doesnt exist and courses folder inside
function writeCoursesDir($path, $pathCoursesRoot){
    //Creats courses folder if it doesnt already exist.
    if(!is_dir($pathCoursesRoot)){
        mkdir($pathCoursesRoot, 0775, true);
    }
    // Creates the directory for the corresponding course if it doesnt exist.
    if (!file_exists($path)) {
        mkdir($path, 0775, true);
    }
    if(is_dir($path)){
        echo "Successfully created courses folder or it already exists!";
    }
}

//Writes code example files to course directory
function writeFilesInDir($path, $fileNames, $content){
    $WriteFilesSuccess = true;
    $success = true;
    $count = count($content);
    for($i = 0; $i < $count; $i++){
        $WriteFilesSuccess = file_put_contents($path . '/' . $fileNames[$i], $content[$i]);
        if($WriteFilesSuccess === false){
            echo "File failed to write: " . $fileNames[$i];
            $success = false;
        }else{
            echo "File written successfully: " . $fileNames[$i];
        }
    }
    if ($success) {
        echo "All files written successfully!";
    }
}

function insertIntoFileLinkDB($cid, $fileNames, $filePaths, $fileURLS, $downloadURLS, $fileTypes, $CeHiddenParam, $fileSizes) {
	global $pdo;
	$count = count($fileNames);
	for($i = 0; $i < $count; $i ++) {
		$query = $pdo->prepare("SELECT count(*) FROM fileLink WHERE cid=:cid AND UPPER(filename)=UPPER(:filename);");
		$query->bindParam(':filename', $fileNames[$i]);
		$query->bindParam(':cid', $cid);
		$query->execute();
		$norows = $query->fetchColumn();
		if($norows == 0) {
			//TODO: Kind value should be fixed to dynamic
			//TODO: add filesize with insert. Can be fetched from codeExamplesContent in sectioned.js 
			$query = $pdo->prepare("INSERT INTO fileLink(filename,kind,cid,filesize) VALUES(:fileName,'3',:cid,:filesize);");
			$query->bindParam(':cid', $cid);
			$query->bindParam(':fileName', $fileNames[$i]);
			$query->bindParam(':filesize', $fileSizes[$i]);
			if (!$query->execute()) {
				$error = $query->errorInfo();
				echo "Error updating entries" . $error[2];
			} else {
				echo "File stored successfully in fileLink";
			}
		}
	}
}
function updateCodeExampleDB($cid, $fileNames, $filePaths, $fileURLS, $downloadURLS, $fileTypes, $CeHiddenParam, $templateid){
	global $pdo;
	//Can update later to allow the Name input from user in gitpopup to update the codeExample here? also sectionname?
	$query = $pdo->prepare( "UPDATE codeexample SET runlink = :playlink, templateid = :templateno WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;");
	$query->bindParam(':playlink', $fileNames[0]);
	$query->bindParam(':templateno', $templateid);
	$query->bindParam(':exampleid', $CeHiddenParam[0]);
	$query->bindParam(':cid', $cid);
	$query->bindParam(':cvers', $CeHiddenParam[3]);
	if(!$query->execute()) {
		$error=$query->errorInfo();
		echo "Error updating entries in codeexample" . $error[2];
	} else{
		echo "Row updated successfully in codeexample";
	}
}

function insertIntoBoxDB($cid, $fileNames, $filePaths, $fileURLS, $downloadURLS, $fileTypes, $CeHiddenParam, $templateid){
	global $pdo;
	$count = count($fileNames);
	$boxContent = "Code";
	$wordlistID = "3";
	$y = 1;
	for($i = 0; $i < $count; $i++){
		//TODO: Change boxcontent to be named dynamicly.
		// Maybe change filenameNoExt to something better named. Also what is wordlistid?
		$query = $pdo->prepare('INSERT INTO box (boxid, exampleid, boxtitle, boxcontent, filename, settings, wordlistid, fontsize) VALUES (:boxid, :exampleid, :boxtitle, :boxcontent, :filename, "[viktig=1]", :wordlistid, "9") ON DUPLICATE KEY UPDATE boxtitle = VALUES(boxtitle), boxcontent = VALUES(boxcontent), filename = VALUES(filename), settings = VALUES(settings), wordlistid = VALUES(wordlistid), fontsize = VALUES(fontsize)');
		$query->bindParam(':boxid', $y);
		$query->bindParam(':exampleid', $CeHiddenParam[0]);
		$filenameNoExt = preg_replace('/\.[^.]*$/', "", $fileNames[$i]);
		$query->bindParam(':boxtitle', $filenameNoExt);
		$query->bindParam(':boxcontent', $boxContent);
		$query->bindParam(':filename', $fileNames[$i]);
		$query->bindParam(':wordlistid', $wordlistID);
	    
		if (!$query->execute()) {
			$error = $query->errorInfo();
			echo "Error updating entries" . $error[2];
		} else {
			echo "File stored successfully in box";
		}
		$y++;
	}
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	//Retrieval of JSON data sent through POST and GET
	$cid = $_GET['cid'];
	$githubURL = $_GET['githubURL'];
	$postDataContent = file_get_contents('php://input');
	$requestDataContent = json_decode($postDataContent, true);
	$codeExamplesContent = isset($requestDataContent['codeExamplesContent']) ? $requestDataContent['codeExamplesContent'] : null;
	$SHA = isset($requestDataContent['SHA']) ? $requestDataContent['SHA'] : null;
	$fileNames = isset($requestDataContent['fileNames']) ? $requestDataContent['fileNames'] : null;
	$filePaths = isset($requestDataContent['filePaths']) ? $requestDataContent['filePaths'] : null;
	$fileURLS = isset($requestDataContent['fileURLS']) ? $requestDataContent['fileURLS'] : null;
	$downloadURLS = isset($requestDataContent['downloadURLS']) ? $requestDataContent['downloadURLS'] : null;
	$fileTypes = isset($requestDataContent['fileTypes']) ? $requestDataContent['fileTypes'] : null;
	$CeHiddenParam = isset($requestDataContent['codeExamplesLinkParam']) ? $requestDataContent['codeExamplesLinkParam'] : null;
	$templateid = isset($requestDataContent['templateid']) ? $requestDataContent['templateid'] : null;
	$fileSizes = isset($requestDataContent['fileSizes']) ? $requestDataContent['fileSizes'] : null;
	$path = '../../LenaSYS/courses/' . $cid;
	$pathCoursesRoot = '../../LenaSYS/courses';

	writeCoursesDir($path, $pathCoursesRoot);
	writeFilesInDir($path, $fileNames, $codeExamplesContent);
	insertIntoSqLiteGitRepo($cid, $githubURL);
	insertIntoSqLiteGitFiles($cid, $fileNames, $filePaths, $fileURLS, $downloadURLS, $fileTypes, $SHA); 
	insertIntoFileLinkDB($cid, $fileNames, $filePaths, $fileURLS, $downloadURLS, $fileTypes, $CeHiddenParam, $fileSizes);
	updateCodeExampleDB($cid, $fileNames, $filePaths, $fileURLS, $downloadURLS, $fileTypes, $CeHiddenParam, $templateid);
	insertIntoBoxDB($cid, $fileNames, $filePaths, $fileURLS, $downloadURLS, $fileTypes, $CeHiddenParam, $templateid);
}
?>
</body>

</html>