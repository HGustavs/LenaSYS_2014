// -------------==============######## Globals ###########==============-------------

var querystring = parseGet();
var retdata;
var newversid;
var active_lid;
var isClickedElementBox = false;
var testsAvailable;
var nameSet = false;
var hoverMenuTimer;
var xelink;
var momentexists = 0;
var resave = false;
var versnme = "UNK";
var versnr;
var motd="UNK";
var hideItemList = [];
var hasDuggs = false;
var dateToday = new Date().getTime();
var compareWeek = -604800000;
let width = screen.width;
var delArr = [];
var delTimer;
var lid;
var collectedLid = [];
var updatedLidsection;
var numberOfItems;
var backgroundColorTheme;
var isLoggedIn = false;

function IsLoggedIn(bool){
  bool ? isLoggedIn = true : isLoggedIn = false ;
}

/*navburger*/
function navBurgerChange(operation = 'click') {

  var x = document.getElementById("navBurgerBox");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }

}

//function to change darkmode from burger menu
function burgerToggleDarkmode(operation = 'click'){
  const storedTheme = localStorage.getItem('themeBlack');
    if(storedTheme){
        themeStylesheet.href = storedTheme;
    }
    const themeToggle = document.getElementById('theme-toggle');
    // if it's light -> go dark
    if(themeStylesheet.href.includes('blackTheme')){
      themeStylesheet.href = "../Shared/css/whiteTheme.css";
      localStorage.setItem('themeBlack',themeStylesheet.href)
      backgroundColorTheme = "#121212";
    }
    else if(themeStylesheet.href.includes('whiteTheme')) {
      // if it's dark -> go light
      themeStylesheet.href = "../Shared/css/blackTheme.css";
      localStorage.setItem('themeBlack',themeStylesheet.href)
      backgroundColorTheme = "#fff";
    }

  //const themeToggle = document.getElementById('theme-toggle');
  //themeToggle.addEventListener('click', () => {});
}
// Stores everything that relates to collapsable menus and their state.
var menuState = {
  idCounter: 0,
  /* Used to give elements unique ids. This might? brake
		 because an element is not guaranteed to recieve the
		 same id every time. */
  hiddenElements: [], // Stores the id of elements who's childs should be hidden.
  arrowIcons: [] // Stores ids of arrows whose state needs to be remembered.
}

function setup() {
  // Disable ghost button when page is loaded
  document.querySelector('#hideElement').disabled = true;
  document.querySelector('#hideElement').style.opacity = 0.7;
  //   Disable eye button when page is loaded
  document.querySelector('#showElements').disabled = true;
  document.querySelector('#showElements').style.opacity = 0.7;
  AJAXService("get", {}, "SECTION");
  numberOfItems = 1;
}

// -------------==============######## Internal Help Functions ###########==============-------------

// Save ids of all elements, whose state needs to be remembered, in local storage.
function saveHiddenElementIDs(clickedElement) {
  addOrRemoveFromArray(clickedElement, menuState.hiddenElements);
  localStorage.setItem('hiddenElements', JSON.stringify(menuState.hiddenElements));
}

// Save ids of all arrows, whose state needs to be remembered, in local storage.
function saveArrowIds(clickedElement) {
  var childNodes = document.getElementById(clickedElement).firstChild.childNodes;
  for (var i = 0; i < childNodes.length; i++) {
    if (childNodes[i].nodeName == "IMG") {
      addOrRemoveFromArray(childNodes[i].id, menuState.arrowIcons);
    }
  }
  localStorage.setItem('arrowIcons', JSON.stringify(menuState.arrowIcons));
}

/* Hide all child elements to the moment and section elements in the
   hiddenElements array. */
function hideCollapsedMenus() {
  $('.header, .section, .code, .test, .link, .group, .statisticsContent, .message').show();
  for (var i = 0; i < menuState.hiddenElements.length; i++) {
    var ancestor = findAncestor($("#" + menuState.hiddenElements[i])[0], "moment");
    if ((ancestor != undefined || ancestor != null) && ancestor.classList.contains('moment')) {
      jQuery(ancestor).nextUntil('.moment').hide();
      $('#selectionDrag'+menuState.hiddenElements[i]).hide();
    }
    ancestor = findAncestor($("#" + menuState.hiddenElements[i])[0], "section");
    if ((ancestor != undefined || ancestor != null) && ancestor.classList.contains('section')) {
      jQuery(ancestor).nextUntil('.section').hide();
      $('#selectionDrag'+menuState.hiddenElements[i]).hide();
    }

    if (menuState.hiddenElements[i] == "statistics") {
      $(".statistics").nextAll().hide();
    }
  }
}

/* Show down arrow by default and then hide this arrow and show the right
   arrow if it is in the arrowIcons array.*/
// The other way around for the statistics section.
function toggleArrows(id) {
  $('.arrowComp').show();
  $('.arrowRight').hide();
  $('#selectionDrag'+id).toggle();
  for (var i = 0; i < menuState.arrowIcons.length; i++) {
    if (menuState.arrowIcons[i].indexOf('arrowComp') > -1) {
      $('#' + menuState.arrowIcons[i]).hide();
    } else {
      $('#' + menuState.arrowIcons[i]).show();
    }
  }

  $('#arrowStatisticsOpen').show();
  $('#arrowStatisticsClosed').hide();
  for (var i = 0; i < menuState.hiddenElements.length; i++) {
    if (menuState.hiddenElements[i] == "statistics") {
      $('#arrowStatisticsOpen').hide();
      $('#arrowStatisticsClosed').show();
    }
  }
}
menuState
// Finds all ancestors to the element with classname Hamburger and toggles them.
// Added some if-statements so escapePress wont always toggle
function hamburgerChange(operation = 'click') {

  if (operation != "click") {
    if (findAncestor(document.getElementById("hamburgerIcon"), "change") != null) {
      toggleHamburger();
    }
  } else {
    toggleHamburger();
  }
}

$(document).on('click', function(e) {
  if ($(e.target).closest("#hamburgerIcon").length === 0) {
      $("#hamburgerBox").hide();
  }
});

function toggleHamburger() {

  var x = document.getElementById("hamburgerBox");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }

}


// -------------==============######## Dialog Handling ###########==============-------------

//----------------------------------------------------------------------------------
// selectItem: Prepare item editing dialog after cog-wheel has been clicked
//----------------------------------------------------------------------------------

function selectItem(lid, entryname, kind, evisible, elink, moment, gradesys, highscoremode, comments, grptype, deadline, relativeDeadline, tabs, feedbackenabled, feedbackquestion) {
  console.log("myConsole lid: "+ lid);
  console.log("myConsole typeof: "+ typeof lid);
  document.getElementById("sectionname").focus();
  toggleTab(true);
  enableTab(document.getElementById("editSection"));
  // Variables for the different options and values for the deadlne time dropdown meny.
  var hourArrOptions=["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
  var hourArrValue=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
  var minuteArrOptions=["00","05","10","15","20","25","30","35","40","45","50","55"];
  var minuteArrValue=[0,5,10,15,20,25,30,35,40,45,50,55];
  var amountArrOptions=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23", "24", "25", "26", "27", "28", "29", "30"];
  var amountArrValue=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
  var typeArrOptions=["Days", "Weeks", "Months"];
  var typeArrValue=[1,2,3];


  nameSet = false;
  if (entryname == "undefined") entryname = "New Header";
  if (kind == "undefined") kind = 0;
  xelink = elink;
  // Display Select Marker
  $(".item").css("border", "none");
  $(".item").css("box-shadow", "none");
  $("#I" + lid).css("border", "2px dashed #FC5");
  $("#I" + lid).css("box-shadow", "1px 1px 3px #000 inset");

  // Default showing of gradesystem. Will show if has type "Test" or "Moment"
    document.querySelector("#inputwrapper-gradesystem").style.display = "none";


  // Default showing of set deadline. Will show if has type "Test" only
  if (kind != 3) {
      document.querySelector("#inputwrapper-deadline").style.display = "none";
      document.querySelector("#dialog8").style.display = "none";
  } else {
     document.querySelector("#inputwrapper-deadline").style.display = "block";
  }

  // Set GradeSys, Kind, Visibility, Tabs (tabs use gradesys)
  $("#gradesys").html(makeoptions(gradesys, ["-", "U-G-VG", "U-G"], [0, 1, 2]));
  $("#type").html(makeoptions(kind, ["Header", "Section", "Code", "Test", "Moment", "Link", "Group Activity", "Message"], [0, 1, 2, 3, 4, 5, 6, 7]));
  $("#visib").html(makeoptions(evisible, ["Hidden", "Public", "Login"], [0, 1, 2]));
  $("#tabs").html(makeoptions(tabs, ["0 tabs", "1 tabs", "2 tabs", "3 tabs", "0 tab + end", "1 tab + end", "2 tabs + end", "3 tabs + end"], [0, 1, 2, 3, 7, 4, 5, 6]));
  $("#highscoremode").html(makeoptions(highscoremode, ["None", "Time Based", "Click Based"], [0, 1, 2]));
  if(deadline !== undefined){
    $("#deadlinehours").html(makeoptions(deadline.substr(11,2),hourArrOptions,hourArrValue));
    $("#deadlineminutes").html(makeoptions(deadline.substr(14,2),minuteArrOptions,minuteArrValue));
    $("#setDeadlineValue").val( !retdata['startdate'] ? "" : deadline.substr(0,10));
  }
  // Handles relative deadlines
  if(relativeDeadline !== undefined) {
    var splitdeadline = relativeDeadline.split(":");
    // relativeDeadline = amount:type:hour:minute
    $("#relativedeadlinehours").html(makeoptions(splitdeadline[2],hourArrOptions,hourArrValue));
    $("#relativedeadlineminutes").html(makeoptions(splitdeadline[3],minuteArrOptions,minuteArrValue));

    $("#relativedeadlineamount").html(makeoptions(splitdeadline[0],amountArrOptions,amountArrValue ));
    $("#relativedeadlinetype").html(makeoptions(splitdeadline[1],typeArrOptions,typeArrValue));

    if (relativeDeadline !== "null") {
      if (calculateRelativeDeadline(relativeDeadline).getTime() !== new Date(deadline).getTime()) {
        checkDeadlineCheckbox($("#absolutedeadlinecheck"), true);
      } else {
        checkDeadlineCheckbox($("#absolutedeadlinecheck"), false);
      }
    } else {
      checkDeadlineCheckbox($("#absolutedeadlinecheck"), true);
    }
  }
  if (relativeDeadline == "null" && deadline == "null") {
    checkDeadlineCheckbox($("#absolutedeadlinecheck"), false);
  }
  var groups = [];
  for (var key in retdata['groups']) {
    // Skip loop if the property is from prototype
    if (!retdata['groups'].hasOwnProperty(key)) continue;
    groups.push(key);
  }
  $("#grptype").html("<option value='UNK'>Select Group type</option>" + makeoptions(grptype, groups, groups));

  // Set Link
  $("#link").val(elink);
  changedType(kind);

  // Set Moments - requires iteration since we only process kind 4
  str = "";
  if (retdata['entries'].length > 0) {

    // Account for null
    if (moment == "") str += "<option selected='selected' value='null'>&lt;None&gt;</option>"
    else str += "<option value='null'>&lt;None&gt;</option>";

    // Account for rest of moments!
    for (var i = 0; i < retdata['entries'].length; i++) {
      var item = retdata['entries'][i];
      if (item['kind'] == 4) {
        if (parseInt(moment) == parseInt(item['lid'])) str += "<option selected='selected' " +
        "value='" + item['lid'] + "'>" + item['entryname'] + "</option>";
      else str += "<option value='" + item['lid'] + "'>" + item['entryname'] + "</option>";
      }
    }
  }

  $("#moment").html(str);
  $("#editSectionDialogTitle").text(entryname);

  // Set Name
  $("#sectionname").val(entryname);
  $("sectionnamewrapper").html(`<input type='text' class='form-control textinput'
  id='sectionname' value='${entryname}' style='width:448px;'/>`);


  // Set Comment
  $("#comments").val(comments);
  $("sectionnamewrapper").html(`<input type='text' class='form-control textinput'
  id='comments' value='${comments}' style='width:448px;'/>`);

  // Set Lid
  $("#lid").val(lid);

  // Display Dialog
  $("#editSection").css("display", "flex");

  //------------------------------------------------------------------------------
  // Checks if feedback is enabled and enables input box for feedbackquestion choice.
  //------------------------------------------------------------------------------
  if(kind == 3){
    $('#inputwrapper-Feedback').css("display","block");
    if(feedbackenabled == 1){
      $( "#fdbck" ).prop( "checked", true );
      $("#inputwrapper-FeedbackQuestion").css("display","block");
      $("#fdbckque").val(feedbackquestion);
    }else{
      $( "#fdbck" ).prop( "checked", false );
      $("#inputwrapper-FeedbackQuestion").css("display","none");
    }
  }else{
    $("#inputwrapper-FeedbackQuestion").css("display","none");
    $('#inputwrapper-Feedback').css("display","none");
    $( "#fdbck" ).prop( "checked", false );
  }
}
// Handles the logic behind the checkbox for absolute deadline
function checkDeadlineCheckbox(e, check) {

  if (check !== undefined) e.checked = check;

  if (e.checked) {
    $("#absolutedeadlinecheck").prop("checked", true);
    $("#setDeadlineValue").prop("disabled", false);
    $("#deadlineminutes").prop("disabled", false);
    $("#deadlinehours").prop("disabled", false);
  } else {
    $("#absolutedeadlinecheck").prop("checked", false);
    $("#setDeadlineValue").prop("disabled", true);
    $("#deadlineminutes").prop("disabled", true);
    $("#deadlinehours").prop("disabled", true);
  }
}
// Takes a relative deadline format and returns a readable string ex: "Course Week 5, 15:00"
function formatRelativeDeadlineToString(rDeadline) {
  rDeadlineArr = rDeadline.split(":");
  str = "Course ";
  str += rDeadlineArr[1] == 1 ? "Day" : (rDeadlineArr[1] == 2 ? "Week" : "Month");
  str += " " + rDeadlineArr[0];
  if (!/^[0]+$/.test(new String(rDeadlineArr[2] + rDeadlineArr[3]))) {
    rDeadlineArr[2] = rDeadlineArr[2].length == 1 ? "0" + rDeadlineArr[2] : rDeadlineArr[2];
    rDeadlineArr[3] = rDeadlineArr[3].length == 1 ? "0" + rDeadlineArr[3] : rDeadlineArr[3];
    str += ", " + rDeadlineArr[2] + ":"+ rDeadlineArr[3];
  }
  return str;
}
// Calculates the relative deadline string into a real date relative to the course startdate
function calculateRelativeDeadline(rDeadline) {
  // rDeadline = [amount, type, hour, minute]

  rDeadline = rDeadline === null ? "1:1:0:0" : rDeadline;

  if (typeof rDeadline === "undefined") {
    rDeadline =  getRelativeDeadlineInputValues();
  }

  rDeadlineArr = rDeadline.split(":");
  var daysToAdd;
  switch (rDeadlineArr[1]) {
    case "1":
      var daysToAdd = parseInt(rDeadlineArr[0]);
      break;
    case "2":
      var daysToAdd = parseInt(rDeadlineArr[0]) * 7;
      break;
    case "3":
      var daysToAdd = parseInt(rDeadlineArr[0]) * 30;
      break;
    default:
      var daysToAdd = parseInt(rDeadlineArr[0]);
      break;
  }

  var newDeadline = new Date(retdata['startdate']);
  newDeadline.setDate(newDeadline.getDate() + daysToAdd);
  newDeadline.setHours(parseInt(rDeadlineArr[2]));
  newDeadline.setMinutes(parseInt(rDeadlineArr[3]));
  return newDeadline;
}
// Takes a date object and returns it as a string as deadlines are stored in the database
function convertDateToDeadline(date) {
  var rDeadlineArr = date.toLocaleDateString("en-US").split("/");
  rDeadlineArr[0] = rDeadlineArr[0].length < 2 ? "0" + rDeadlineArr[0] : rDeadlineArr[0];
  rDeadlineArr[1] = rDeadlineArr[1].length < 2 ? "0" + rDeadlineArr[1] : rDeadlineArr[1];
  var newDeadline = rDeadlineArr[2] + "-" + rDeadlineArr[0]+ "-" + rDeadlineArr[1] + " " + date.toString().split(" ")[4].substr(0,5);
  return newDeadline;
}

// Returns the values of the currently chosen relative deadline input elements
function getRelativeDeadlineInputValues() {
  return $("#relativedeadlineamount").val() + ":" + $("#relativedeadlinetype").val() + ":" + $("#relativedeadlinehours").val() + ":" + $("#relativedeadlineminutes").val();
}

//---------------------------------------------------------------------------------------------
// changedType: When kind of section has been changed we must update dropdown lists accordingly
//---------------------------------------------------------------------------------------------


// If type "Test" or "Moment" then Grade system will be shown
function changedType(kind) {
  // Prepares option list for code example (2)/dugga (3) dropdown/links (5) / Not applicable
    document.querySelector("#inputwrapper-gradesystem").style.display = "none";
  if (kind == 2) {
    $("#link").html(makeoptionsItem(xelink, retdata['codeexamples'], 'sectionname', 'exampleid'));
  } else if (kind == 3) {
    document.querySelector("#inputwrapper-group").style.display = "none";
    document.querySelector("#inputwrapper-gradesystem").style.display = "block";
    $("#link").html(makeoptionsItem(xelink, retdata['duggor'], 'qname', 'id'));
  } else if (kind == 4) {
    document.querySelector("#inputwrapper-group").style.display = "block";
    document.querySelector("#inputwrapper-gradesystem").style.display = "block";
  } else if (kind == 5 || kind == 7) {
    $("#link").html(makeoptionsItem(xelink, retdata['links'], 'filename', 'filename'));
  } else {
    $("#link").html("<option value='-1'>-=# Not Applicable #=-</option>");
  }
}

//----------------------------------------------------------------------------------
// showEditVersion: Displays Edit Version Dialog
//----------------------------------------------------------------------------------

function showEditVersion() {
  var tempMotd = motd;
  toggleTab(true);
  enableTab(document.getElementById("editCourseVersion"));
	tempMotd = motd.replace(/&Aring;/g, "Å").replace(/&aring;/g, "å").replace(/&Auml;/g, "Ä").replace(/&auml;/g,
  "ä").replace(/&Ouml;/g, "Ö").replace(/&ouml;/g, "ö").replace(/&amp;/g, "&").replace(/&#63;/g, "?");
  $("#eversname").val(versnme);
  $("#eMOTD").val(tempMotd);
  $("#eversid").val(querystring['coursevers']);
  let sdate = retdata['startdate'];
  let edate = retdata['enddate'];
  if (sdate !== null) $("#estartdate").val(sdate.substr(0, 10));
  if (edate !== null) $("#eenddate").val(edate.substr(0, 10));
  $("#editCourseVersion").css("display", "flex");
}

// Delete items marked as deleted when page is unloaded
window.addEventListener('beforeunload', function(event) {
  var deletedElements = document.querySelectorAll(".deleted")
  for(i = 0; i < deletedElements.length; i++) {
    var lid = deletedElements[i].id.match(/\d+/)[0];
    AJAXService("DEL", {
      lid: lid
    }, "SECTION");
  }
});

// Close the "edit course version" and "new course version" windows by pressing the ESC button
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    toggleTab(false);
    $("#editCourseVersion").css("display", "none");
    $("#newCourseVersion").css("display", "none");
    $("#userFeedbackDialog").css("display", "none");
  }
})

function displaymessage() {
  $(".messagebox").css("display", "block");
}

function showSubmitButton() {
  $(".submitDugga").css("display", "inline-block");
  $(".updateDugga").css("display", "none");
  $(".closeDugga").css("display", "inline-block");
}

function showSaveButton() {
  $(".submitDugga").css("display", "none");
  $(".updateDugga").css("display", "block");
  $(".closeDugga").css("display", "block");
}


// Displaying and hidding the dynamic comfirmbox for the section edit dialog
function confirmBox(operation, item = null) {
  if (operation == "openConfirmBox") {
    active_lid = item ? $(item).parents('table').attr('value') : null;
    $("#sectionConfirmBox").css("display", "flex");
  } else if (operation == "openHideConfirmBox") {
    active_lid = item ? $(item).parents('table').attr('value') : null;
    $("#sectionHideConfirmBox").css("display", "flex");
    $('#close-item-button').focus();
  } else if (operation == "openTabConfirmBox") {
    active_lid = item ? $(item).parents('table').attr('value') : null;
    $("#tabConfirmBox").css("display", "flex");
    $("#tabs").val(0).change();
  } else if (operation == "openItemsConfirmBox"){
    $("#sectionShowConfirmBox").css("display", "flex");
    $('#close-item-button').focus();
  } else if (operation == "deleteItem") {
    deleteItem(active_lid);
    $("#sectionConfirmBox").css("display", "none");
  } else if (operation == "hideItem" && !hideItemList.length == 0) {
    hideMarkedItems(hideItemList)
    $("#sectionHideConfirmBox").css("display", "none");
  }else if (operation == "tabItem") {
    tabMarkedItems(active_lid);
      $("#tabConfirmBox").css("display", "none");
  }else if (operation == "openGitHubBox") {
    console.log("testworkornah2?");
    $("#gitHubBox").css("display", "flex");
  }
  //ändra 
  else if (operation == "openGitHubTemplate") {
    console.log("testworkornah?");
    $("#gitHubTemplate").css("display", "flex");


  } else if (operation == "closeConfirmBox") {
    $("#gitHubBox").css("display", "none");
    $("#sectionConfirmBox").css("display", "none");
    $("#tabConfirmBox").css("display", "none");
    $("#sectionHideConfirmBox").css("display", "none");
    $("#noMaterialConfirmBox").css("display", "none");
    $("#sectionShowConfirmBox").css("display", "none");
    $("#gitHubTemplate").css("display", "none");
  }
  else if (operation == "showItems"&& !hideItemList.length == 0) {
    showMarkedItems(hideItemList);
    $("#sectionShowConfirmBox").css("display", "none");
  }
  document.addEventListener("keypress", event => {
		if (event.key === 'Enter') {
			if(event.target.classList.contains("traschcanDelItemTab")){
        setTimeout(function(){
          $("#delete-item-button"). focus ();
        }, 400);
			}
			if(event.target.id == "delete-item-button"){
				deleteItem(active_lid);
        $("#sectionConfirmBox").css("display", "none");
			}
		}
	});
}

// Creates an array over all checked items
function markedItems(item = null){
  var removed = false;
  var kind = item ? $(item).parents('tr').attr('value') : null;
  active_lid = item ? $(item).parents('table').attr('value') : null;
  var subItems = [];

    //if the checkbox belongs to one of these kinds then all elements below it should also be selected.
    if(kind == "section" || kind == "moment"){
      var itemInSection = true;
      var sectionStart = false;
      $("#Sectionlist").find(".item").each(function (i) {
        var tempItem = $(this).attr('value');
        if(itemInSection && sectionStart){
          var tempDisplay = document.getElementById("lid"+tempItem).style.display;
          var tempKind = $(this).parents('tr').attr('value');
          if(tempDisplay != "none" && (tempKind == "section" || tempKind == "moment" || tempKind == "header")){
            itemInSection = false;
            //console.log("loop breaker: "+tempItem);
          }else{
            subItems.push(tempItem);
            //console.log("added: "+tempItem);
          }
        }else if(tempItem==active_lid) sectionStart=true;
      });

    }


    console.log("Active lid: "+active_lid);
    if (hideItemList.length != 0){
      for( var i = 0; i < hideItemList.length; i++){
        if ( hideItemList[i] === active_lid) {
          hideItemList.splice(i, 1);
          i--;
          var removed = true;
          console.log("Removed from list");
        }
        for(var j = 0; j < subItems.length; j++){
          if ( hideItemList[i] === subItems[j]) {
            $("#"+hideItemList[i]+"-checkbox").prop("checked", false);
            hideItemList.splice(i, 1);
            //console.log(subItems[j]+" Removed from list");
          }
        }
      } if(removed != true){
        hideItemList.push(active_lid);
        console.log("Adding !empty list");
        for(var j = 0; j < subItems.length; j++){
          hideItemList.push(subItems[j]);
          console.log(subItems[j]);
          $("#"+subItems[j]+"-checkbox").prop("checked", true);
        }
      }
    } else {
      hideItemList.push(active_lid);
      console.log("Added");
      for(var j = 0; j < subItems.length; j++){
        hideItemList.push(subItems[j]);
      }
      for(i=0; i<hideItemList.length; i++){
        $("#"+hideItemList[i]+"-checkbox").prop("checked", true);
        //console.log(hideItemList[i]+"-checkbox");
      }
      // Show ghost button when checkbox is checked
      document.querySelector('#hideElement').disabled = false;
      document.querySelector('#hideElement').style.opacity = 1;
      showVisibilityIcons();
    }
    if (hideItemList.length == 0) {
      // Disable ghost button when no checkboxes is checked
      document.querySelector('#hideElement').disabled = true;
      document.querySelector('#hideElement').style.opacity = 0.7;
      hideVisibilityIcons();

    }
    console.log(hideItemList);
}

 // Shows ghost and eye button
function showVisibilityIcons(){
 document.querySelector('#hideElement').disabled = false;
 document.querySelector('#hideElement').style.opacity = 1;
 document.querySelector('#showElements').disabled = false;
 document.querySelector('#showElements').style.opacity = 1;
}
//Disables ghost and eye button
function hideVisibilityIcons(){
    document.querySelector('#hideElement').disabled = true;
    document.querySelector('#hideElement').style.opacity = 0.7;
    document.querySelector('#showElements').disabled = true;
    document.querySelector('#showElements').style.opacity = 0.7;
}

//Changes visibility of hidden items
function showMarkedItems(){
  hideVisibilityIcons();
    for (i=0; i < hideItemList.length; i++) {
    var lid = hideItemList[i];
        AJAXService("PUBLIC", {
          lid: lid
        }, "SECTION");
        $("#editSection").css("display", "none");
      }
      hideItemList= [];
}

// Clear array of checked items - used in fabbuttons and in save to clear array.
// Without this, the array will be populated but checkboxes will not be reset.
function clearHideItemList(){
  hideItemList = [];
}


function closeSelect() {
  toggleTab(false);
  $(".item").css("border", "none");
  $(".item").css("box-shadow", "none");
  $("#editSection").css("display", "none");
  defaultNewItem();
}

function defaultNewItem() {

  $('#saveBtn').removeAttr('disabled'); // Resets save button to its default form
  $('#submitBtn').removeAttr('disabled'); // Resets submit button to its default form
  document.getElementById("sectionname").style.backgroundColor = backgroundColorTheme; // Resets color for name input
  $('#tooltipTxt').hide(); // Resets tooltip text to its default form
}

function showCreateVersion() {
    $("#newCourseVersion").css("display", "flex");
    toggleTab(true);
    enableTab(document.getElementById("newCourseVersion"));
}

function incrementItemsToCreate() {
  numberOfItems++;
}

// kind 0 == Header || 1 == Section || 2 == Code  || 3 == Test (Dugga)|| 4 == Moment || 5 == Link || 6 == Group Activity || 7 == Message
async function createFABItem(kind, itemtitle, comment) {
  if (kind >= 0 && kind <= 7) {
    for (var i = 0; i < numberOfItems; i++) {
      selectItem("undefined", itemtitle, kind, "undefined", "undefined", "0", "", "undefined", comment,"undefined", "undefined", "undefined", 0, null);
      clearHideItemList();
      await newItem(itemtitle); // Wait until the current item is created before creating the next item
    }
    console.log(numberOfItems + " " + itemtitle + "(s) created");
    numberOfItems = 1; // Reset number of items to create
  }
}

function addColorsToTabSections(kind, visible, spkind) {
  var retStr;
  if (kind === 0 || kind === 1) { // purple background
    retStr = `<td class='LightBoxFilled${visible}`;
  } else {
    retStr = `<td class='LightBox${visible}`;
  }

  if (spkind == "E") {
    retStr += "'><div class='spacerEnd'></div></td>";
  } else {
    retStr += "'><div class='spacerLeft'></div></td>";
  }

  return retStr;
}

// -------------==============######## Commands ###########==============-------------

//----------------------------------------------------------------------------------
// prepareItem: Prepare sectioneditor parameters
//----------------------------------------------------------------------------------

function prepareItem() {
  // Create parameter object and fill with information
  var param = {};
  var jsondeadline = {"deadline1":"", "comment1":"","deadline2":"", "comment2":"", "deadline3":"", "comment3":""};

  // Storing tabs in gradesys column!
  var kind = $("#type").val()
  if (kind == 0 || kind == 1 || kind == 2 || kind == 5 || kind == 6 || kind == 7) {
    param.tabs = $("#tabs").val();
  } else {
    param.gradesys = $("#gradesys").val();
  }

  param.lid = $("#lid").val();
  param.kind = kind;
  param.link = $("#link").val();
  param.highscoremode = $("#highscoremode").val();
  param.sectname = $("#sectionname").val();
  param.visibility = $("#visib").val();
  param.tabs = $("#tabs").val();
  param.moment = $("#moment").val();
  param.comments = $("#comments").val();
  param.grptype = $("#grptype").val();
  param.deadline = $("#setDeadlineValue").val()+" "+$("#deadlinehours").val()+":"+$("#deadlineminutes").val();
  param.relativedeadline = getRelativeDeadlineInputValues();
  // If absolute deadline is not checked, always use relative deadline
  if (!$('#absolutedeadlinecheck').prop('checked')) {
    param.deadline = convertDateToDeadline(calculateRelativeDeadline(param.relativedeadline));
  }

  if ($('#fdbck').prop('checked')){
    param.feedback = 1;
    param.feedbackquestion = $("#fdbckque").val();
  } else{
    param.feedback = 0;
    param.feedbackquestion = null;
  }

// Places new items at appropriate places by measuring the space between FABStatic2 and the top of the scrren
  var elementBtnTop = document.getElementById("FABStatic2").getBoundingClientRect();
  screenPos = Math.round((-1 * elementBtnTop.top)/350);
  if(screenPos < 1){
    screenPos = 5;
  }else{
    screenPos = 4 * screenPos;
  }
  param.pos = screenPos;

  return param;
}

//----------------------------------------------------------------------------------
// deleteItem: Deletes Item from Section List
//----------------------------------------------------------------------------------

function deleteItem(item_lid = null) {
  lid = item_lid ? item_lid : $("#lid").val();
  item = document.getElementById("lid" + lid);
  item.style.display = "none";
  item.classList.add("deleted");

  document.querySelector("#undoButton").style.display = "block";
  // Makes deletefunction sleep for 60 sec so it is possible to undo an accidental deletion
  delArr.push(lid);
  clearTimeout(delTimer);
  delTimer = setTimeout(() => {
    deleteAll();
   }, 60000);
}

// Permanently delete elements. Update: This function now calls DELETED in sectionserviced.php instead of DEL
function deleteAll(item)
{
  for(var i = delArr.length-1; i >= 0; --i){
    AJAXService("DEL", {
      lid: delArr.pop()
    }, "SECTION");
  }
  $("#editSection").css("display", "none");
  document.querySelector("#undoButton").style.display = "none";
  item.style.display = "none";
}

// Cancel deletion
function cancelDelete() {
  clearTimeout(delTimer);
  var deletedElements = document.querySelectorAll(".deleted")
  for(i = 0; i < deletedElements.length; i++) {
    deletedElements[i].classList.remove("deleted");
  }
  location.reload();
}

//----------------------------------------------------------------------------------
// getDeletedItems: Used to retrieve deleted list entries
//----------------------------------------------------------------------------------
function getDeletedListEntries(){
 var deletedEntries = document.write('<?php echo getDeletedEntries("DISPLAYDELETED"); ');
}
//----------------------------------------------------------------------------------
// hideMarkedItems: Hides Item from Section List
//----------------------------------------------------------------------------------

function hideMarkedItems() {
  // Since no boxes are checked ghost button is disabled
  hideVisibilityIcons();
  document.querySelector('#hideElement').disabled = true;     //can be removed
  document.querySelector('#hideElement').style.opacity = 0.7; //can be removed
  for (i=0; i < hideItemList.length; i++) {
    var lid = hideItemList[i];
      AJAXService("HIDDEN", {
        lid: lid
      }, "SECTION");
      $("#editSection").css("display", "none");
    }
    hideItemList = [];
  }

  //----------------------------------------------------------------------------------
  // tabMarkedItems: Tabs Item from Section List
  //----------------------------------------------------------------------------------
  function tabMarkedItems(lid) {
    var tabs = $("#tabs").val();
    AJAXService("UPDATETABS", {
      lid: lid,
      tabs: tabs
    }, "SECTION");
  }

//----------------------------------------------------------------------------------
// toggleTab: Toggles tab on all elements of the webpage
//----------------------------------------------------------------------------------

  function toggleTab(tabEnabled){
    var tabSwitch;
    if(tabEnabled){
      tabEnabled = false;
      tabSwitch = -1;
    }
    else {
      tabEnabled= true;
      tabSwitch = 0;
    }
    var tabbable = ['a', 'input', 'select', 'button', 'textarea'];

    for (var i = 0; i < tabbable.length; i++) {
      var elem = document.getElementsByTagName(tabbable[i]);
      for (var j = 0; j < elem.length; j++) {
        elem[j].setAttribute('tabindex', tabSwitch);
      }
    }
    var tabbable = ['settingIconTab', 'home-nav', 'theme-toggle-nav', 'messagedialog-nav', 'announcement-nav', 'editVers', 'newVers', 'loginbutton-nav', 'newTabCanvasLink', 'showCanvasLinkBoxTab', 'traschcanDelItemTab'];

    for (var i = 0; i < tabbable.length; i++) {
      var elem = document.getElementsByClassName(tabbable[i]);
      for (var j = 0; j < elem.length; j++) {
        elem[j].setAttribute('tabindex', tabSwitch);
      }
    }
  }

//----------------------------------------------------------------------------------
// enableTab: Enables tab on all children of of the id element
//----------------------------------------------------------------------------------

  function enableTab(id){
    var tabbable = ['a', 'input', 'select', 'button', 'textarea'];
    for (var i = 0; i < tabbable.length; i++) {
      var elem = id.getElementsByTagName(tabbable[i]);
      for (var j = 0; j < elem.length; j++) {
        elem[j].setAttribute('tabindex', 0);
      }
    }

  }
//----------------------------------------------------------------------------------
// updateItem: Updates Item from Section List
//----------------------------------------------------------------------------------

function updateItem() {
  console.log("Running updateItem");
  AJAXService("UPDATE", prepareItem(), "SECTION");

  $("#sectionConfirmBox").css("display", "none");
  $("#editSection").css("display", "none");
}

function updateDeadline() {
    var kind = $("#type").val();
    if (kind == 3) {
        AJAXService("UPDATEDEADLINE", prepareItem(), "SECTION");
    }
}

function setActiveLid(lid){
  updatedLidsection = lid;
};
//----------------------------------------------------------------------------------
// newItem: New Item for Section List
//----------------------------------------------------------------------------------

async function newItem(itemtitle) {

  // Continues when AJAX call is completed
  await AJAXService("NEW", prepareItem(), "SECTION");
  $("#editSection").css("display", "none");

  // Toggle for alert when create a New Item
  var element = document.getElementById("createAlert");
  element.classList.toggle("createAlertToggle");
  // Set text for the alert when create a New Item
  document.getElementById("createAlert").innerHTML = itemtitle + " has been created!";
  // Here we have to wait 1 tenth of a second so that the ajax service completes.
  setTimeout(function(){
    collectedLid.sort(function(a, b) {
    return b - a;
    });
    var element = document.getElementById('I'+collectedLid[0]).firstChild;
    if(element.tagName == 'DIV') {
    element = element.firstChild;
    element.classList.add("highlightChange");
    }else if (element.tagName == 'A'){
      document.getElementById('I'+collectedLid[0]).classList.add("highlightChange");
    }else if (element.tagName == 'SPAN'){
      document.getElementById('I'+collectedLid[0]).firstChild.classList.add("highlightChange");
    }
  },100);
  // Duration time for the alert before remove
  setTimeout(function(){
    $("#createAlert").removeClass("createAlertToggle");
    document.getElementById("createAlert").innerHTML = "";
  },3000);

  // setTimeout(scrollToBottom, 200);  Scroll to the bottom to show newly created items.
}

//----------------------------------------------------------------------------------
// createVersion: New Version of Course
//----------------------------------------------------------------------------------

function createVersion() {

  var param = {};
  // param.courseid = querystring['courseid'];
  param.cid = querystring['courseid'];
  param.versid = document.getElementById("cversid").value;
  param.versname = document.getElementById("versname").value;
  param.motd = document.getElementById("vmotd").value;
  param.copycourse = document.getElementById("copyvers").value;
  param.coursecode = retdata.coursecode;
  param.coursename = querystring["coursename"];
  param.makeactive = 2 + $("#makeactive").is(':checked');
  param.startdate = getDateFormat(new Date($("#startdate").val()));
  param.enddate = getDateFormat(new Date($("#enddate").val()));

  newversid = param.versid;

  if (param.versid == "" || param.versname == "") {
    alert("Version Name and Version ID must be entered!");
  } else {
    if (param.copycourse != "None") {
      // Create a copy of course version
      AJAXService("CPYVRS", param, "COURSE");
    } else {
      // Create a fresh course version
      AJAXService("NEWVRS", param, "COURSE");
    }
    $("#newCourseVersion").css("display", "none");
    changeCourseVersURL("sectioned.php?courseid=" + querystring["courseid"] + "&coursename=" +
    querystring["coursename"] + "&coursevers=" +document.getElementById("cversid").value );
  }
}

//----------------------------------------------------------------------------------
// updateVersion: Edit Version of Course
//----------------------------------------------------------------------------------

function updateVersion() {

  var param = {};

  param.courseid = querystring['courseid'];
  param.cid = querystring['courseid'];
  param.versid = document.getElementById("eversid").value;
  param.versname = document.getElementById("eversname").value;
  param.copycourse = document.getElementById("copyvers").value;
  param.coursecode = retdata.coursecode;
  param.coursename = querystring["coursename"];
  param.makeactive = 2 + $("#emakeactive").is(':checked');
  param.startdate = $("#estartdate").val();
  param.enddate = $("#eenddate").val();
  param.motd = document.getElementById("eMOTD").value;

  AJAXService("UPDATEVRS", param, "SECTION");

  $("#editCourseVersion").css("display", "none");
  changeCourseVersURL("sectioned.php?courseid=" + querystring["courseid"] + "&coursename=" +
  querystring["coursename"] + "&coursevers=" +document.getElementById("eversid").value );
}

// QueryString for coursename is added
function goToVersion(courseDropDown) {
  var value = courseDropDown.options[courseDropDown.selectedIndex].value;
  changeCourseVersURL("sectioned.php?courseid=" + querystring["courseid"] + "&coursename=" +
  querystring["coursename"] + "&coursevers=" + value);
}

function accessCourse() {
  var coursevers = $("#course-coursevers").text();
  window.location.href = "accessed.php?cid=" + querystring['courseid'] + "&coursevers=" + coursevers;
}

//----------------------------------------
// Renderer
//----------------------------------------

function returnedCourse(data) {
  if (data['debug'] != "NONE!") alert(data['debug']);
  window.setTimeout(function () {
    changeCourseVersURL("sectioned.php?courseid=" + querystring["courseid"] +
      "&coursename=" + querystring["coursename"] + "&coursevers=" + newversid);
  }, 1000);
}


function returnedGroups(data) {
  if (data['debug'] != "NONE!") alert(data['debug']);
  var grpmembers = data['grplst'];
  var str = "";
  let grp = "";
  let grpemail = "";
  let j = 1;
  for (let i = 0; i < grpmembers.length; i++) {
    let member = grpmembers[i];
    let cgrp = member[0];

    if (cgrp != grp) {
      j = 1;
      if (grp != "") {
        str += "</tbody>";
        str += "</table>";
        str += `<div style='text-align:right;border-top:2px solid #434343'>
        <a style='white-space:nowrap' href='mailto:${grpemail}'>Email group</a></div>`
        grpemail = "";
      }
      grp = cgrp;
      cgrp = cgrp.split('_');
      str += "<table>";
      str += `<thead><tr><th rowspan=2 style='text-align:left;'>Group ${cgrp[1]}</th></tr></thead>`;
      str += "<tbody>";
    }
    str += `<tr><td>" + (j++) + "</td><td><a  style='white-space:nowrap'
    href='mailto:${member[3]}'>${member[1]} ${member[2]}</a></td></tr>`;
    if (grpemail != "") grpemail += ",";
    grpemail += member[3];
  }
  if (grp != "") {
    str += "</tbody>";
    str += "</table>";
    str += `<div style='text-align:right;border-top:2px solid #434343'><a
    href='mailto:${grpemail}'>Email group</a></div>`
    grpemail = "";
  }
  if (str != "") {
    $("#grptbl").html(str);
    $("#grptblContainer").css("display", "flex");
  }
}

// Dugga row click functionality
function duggaRowClick(rowElement){
  let children = rowElement.parentNode.querySelectorAll("*"); //get all children + grandchildren of parent node.
  for(let i = 0; i < children.length;i++){
    if(children[i].href != null){                             //find the one with href
      window.location.assign(children[i].href);               //go to to the url.
      return;
    }
  }
}

function returnedSection(data) {
  retdata = data;
  if (data['debug'] != "NONE!") alert(data['debug']);

  // Data variable is put in localStorage which is then used in Codeviewer
	// To get the right order when going backward and forward in code examples
	localStorage.setItem("ls-section-data", JSON.stringify(data));

  var now = new Date();
  var startdate = new Date(retdata['startdate']);
  var enddate = new Date(retdata['enddate']);

  var numberOfParts = 0;
  for (var i = 0; i < retdata['entries'].length; i++) {
    var item = retdata['entries'][i];
    if (item['kind'] == 4) {
      numberOfParts++;
    }
  }

  // Fill section list with information
  if (querystring['coursevers'] != "null") {
    var versionname = "";
    if (retdata['versions'].length > 0) {
      for (var j = 0; j < retdata['versions'].length; j++) {
        var itemz = retdata['versions'][j];
        if (retdata['courseid'] == itemz['cid']) {
          var vversz = itemz['vers'];
          var vnamez = itemz['versname'];
          if (retdata['coursevers'] == vversz) {
              versionname = vnamez;
          }
        }
      }
    }

    // Update header with course information from data
    document.getElementById("course-coursecode").innerHTML = retdata['coursecode'];
    document.getElementById("course-coursename").innerHTML = retdata['coursename'];
    document.getElementById("course-versname").innerHTML = versionname;

    // Set motd before if-statement, so it's displayed for everyone, not just studentteachers and those with writeaccess
    motd = retdata['versions'].find(v => v.vers == querystring["coursevers"]).motd || 'UNK';

    var str = "";
    // Build dropdown and showing FAB-buttons for studentteacher and writeaccess users
    if (data['studentteacher'] || data['writeaccess']) {
      // Build dropdowns
      var bstr = "";
      for (var i = 0; i < retdata['versions'].length; i++) {
        var item = retdata['versions'][i];
        if (retdata['courseid'] == item['cid']) {
          bstr += "<option value='" + item['vers'] + "'";
          if (retdata['coursevers'] == item['vers']) {
            bstr += " selected";
          }
          bstr += ">" + item['versname'] + " - " + item['vers'] + "</option>";
        }
        // Save vers, versname and motd from table vers as global variables.
        versnme = versionname;
        if (querystring['coursevers'] == item['vers']) motd = item['motd'] ||'UNK';
        if (querystring['coursevers'] == item['vers']) versnr = item['vers'] || 'UNK';
      }

      document.getElementById("courseDropdownTop").innerHTML = bstr;
      bstr = "<option value='None'>None</option>" + bstr;
      document.getElementById("copyvers").innerHTML = bstr;

      // Show FAB / Menu
      document.getElementById("FABStatic").style.display = "Block";
      document.getElementById("FABStatic2").style.display = "Block";
      document.getElementById("HIDEStatic").style.display = "Block";
      // Show addElement Button
      document.getElementById("addElement").style.display = "Block";

      // Disable div used for table spacing in the navheader
      document.getElementById("menuHook").style.display =  "none"
    } else {
      // Hide FAB / Menu
      document.getElementById("FABStatic").style.display = "None";
      document.getElementById("FABStatic2").style.display = "None";
      // remove course-label margin
      document.getElementById("course-label").style.marginRight = "10px";
    }

    // Hide som elements if to narrow
    var hiddenInline = "";
    var showInline = true;
    if ($(window).width() < 480) {
      showInline = false;
      hiddenInline = "none";
    } else {
      showInline = true;
      hiddenInline = "inline";
    }


    //Swimlane and 'Load Dugga' button.



    str += "<div id='statisticsSwimlanes'>";
    str += "<svg id='swimlaneSVG' xmlns='http://www.w3.org/2000/svg'></svg>";
		str += "</div>";
    str += "<input id='loadDuggaButton' class='submit-button large-button' type='button' value='Load Dugga' onclick='showLoadDuggaPopup();' />";

    str += "<div id='Sectionlistc'>";
    // For now we only have two kinds of sections
    if (data['entries'].length > 0) {
      var kk = 0;

      for (i = 0; i < data['entries'].length; i++) {
        var item = data['entries'][i];
        var deadline = item['deadline'];
        var rDeadline = item['relativedeadline'];
        var released = item['release'];

        // Separating sections into different classes
        var valarr = ["header", "section", "code", "test", "moment", "link", "group", "message"];
        // New items added get the class glow to show they are new
        if((Date.parse(item['ts']) - dateToday) > compareWeek){
          str += "<div id='" + makeTextArray(item['kind'], valarr) + menuState.idCounter + data.coursecode + "' class='" + makeTextArray(item['kind'], valarr) +" glow"+ "' style='display:block'>";
        }
        else{
          str += "<div id='" + makeTextArray(item['kind'], valarr) + menuState.idCounter + data.coursecode + "' class='" + makeTextArray(item['kind'], valarr) + "' style='display:block'>";
        }

        menuState.idCounter++;
        // All are visible according to database

        // Content table
        str += `<table id='lid${item['lid']}' value='${item['lid']}'
        style='width:100%;table-layout:fixed;'><tr value='${makeTextArray(item['kind'], valarr)}' style='height:32px;' `;

        if (kk % 2 == 0) {
          str += " class='hi' ";
        } else {
          str += " class='lo' ";
        }
        str += " >";


        var hideState = "";
        if (parseInt(item['visible']) === 0) hideState = " hidden"
        else if (parseInt(item['visible']) === 3) hideState = " deleted"
        else if (parseInt(item['visible']) === 2) hideState = " login";

        // kind 0 == Header || 1 == Section || 2 == Code  ||�3 == Test (Dugga)|| 4 == Moment�|| 5 == Link || 6 Group-Moment || 7 Message
        var itemKind = parseInt(item['kind']);
        if (itemKind === 3 || itemKind === 4) {

          // If there exists atleast one test or moment swimlanes shall be hidden
          hasDuggs = true;

          var grady = -1;
          var status = "";
          var marked;
          var submitted;
          var lastSubmit = null;

          for (var jjj = 0; jjj < data['results'].length; jjj++) {
            var lawtem = data['results'][jjj];
            if ((lawtem['moment'] == item['lid'])) {
              grady = lawtem['grade'];
              status = "";

              var st = lawtem['submitted'];
              if (st !== null) submitted = new Date(st)
              else submitted = null;

              var mt = lawtem['marked'];
              if (mt !== null) marked = new Date(mt)
              else marked = null;

              if (itemKind === 3 || itemKind === 6) {
                if (lawtem["useranswer"] !== null && submitted !== null && marked === null) {
                  status = "pending";
                }
                if (submitted !== null && marked !== null && (submitted.getTime() > marked.getTime())) {
                  status = "pending";
                }
                if (lastSubmit === null) {
                  lastSubmit = submitted;
                } else if (submitted !== null) {
                  if (lastSubmit.getTime() < submitted.getTime()) {
                    lastSubmit = submitted;
                  }
                }
              }

            }
          }

          if (retdata['writeaccess']) {
          if (itemKind === 3) {
            if(isLoggedIn){
              str += "<td onmouseup='hideDeleted()' class='LightBox" + hideState + "'>";
              str += "<div class='dragbleArea'><img style='width: 53%; padding-left: 6px;padding-top: 5px;' alt='pen icon dugga' src='../Shared/icons/select.png'></div>";
            }
          } else if (itemKind === 4) {
            if(isLoggedIn){
              str += "<td onmouseup='hideDeleted()' style='background-color: #614875;' class='LightBox" + hideState + "'  >";
              str += "<div id='selectionDragI"+item['lid']+"' class='dragbleArea'><img style='width: 53%; padding-left: 6px;padding-top: 5px;' alt='pen icon dugga' src='../Shared/icons/select.png'></div>";
            }
          }
          str += "</td>";
      }
    }

      if (retdata['writeaccess']) {
        if (itemKind === 2 || itemKind === 5 || itemKind === 6 || itemKind === 7) { // Draggable area with white background
          str += "<td onmouseup='hideDeleted()' style'text-align: left;' class='LightBox" + hideState + "'>";
          str += "<div class='dragbleArea'><img style='width: 53%; padding-left: 6px;padding-top: 5px;' alt='pen icon dugga' src='../Shared/icons/select.png'></div>";

        }
        str += "</td>";
      }
        // Make tabs to align each section element
        // kind 0 == Header || 1 == Section || 2 == Code  ||�3 == Test (Dugga)|| 4 == Moment�|| 5 == Link || 6 == Group || 7 == Comment
        if (itemKind === 0 || itemKind === 1 || itemKind === 2 || itemKind === 3 || itemKind === 5 || itemKind === 6 || itemKind === 7) {
          var itemGradesys = parseInt(item['gradesys']);
          if (itemGradesys > 0 && itemGradesys < 4) {
            for (var numSpacers = 0; numSpacers < itemGradesys; numSpacers++) {
              str += addColorsToTabSections(itemKind, hideState, "L");
            }
          } else if (itemGradesys == 4) {
            str += addColorsToTabSections(itemKind, hideState, "L");
            str += addColorsToTabSections(itemKind, hideState, "E");
          } else if (itemGradesys == 5) {
            str += addColorsToTabSections(itemKind, hideState, "L");
            str += addColorsToTabSections(itemKind, hideState, "L");
            str += addColorsToTabSections(itemKind, hideState, "E");
          } else if (itemGradesys == 6) {
            str += addColorsToTabSections(itemKind, hideState, "L");
            str += addColorsToTabSections(itemKind, hideState, "L");
            str += addColorsToTabSections(itemKind, hideState, "L");
            str += addColorsToTabSections(itemKind, hideState, "E");
          }else if (itemGradesys == 7) {
            str += addColorsToTabSections(itemKind, hideState, "E");
          }
        }
        // Collecting all the id:s from the different duggas on the page so that we can use the highest value to see the newest entry.
        collectedLid.push(item['lid']);
        // kind 0 == Header || 1 == Section || 2 == Code  || 3 == Test (Dugga)|| 4 == Moment || 5 == Link
        if (itemKind === 0) {
          // Styling for header row
          str += `</td><td class='header item${hideState}' placeholder='${momentexists}'id='I${item['lid']}' `;
          kk = 0;

        } else if (itemKind === 1) {
          if(isLoggedIn){
            // Styling for Section row
            str += "<td onmouseup='hideDeleted()' style='background-color: #614875;' class='LightBox" + hideState + "'>";
            str += "<div id='selectionDragI"+item['lid']+"' class='dragbleArea'><img alt='pen icon dugga' style='width: 53%;padding-left: 6px;padding-top: 5px;' src='../Shared/icons/select.png'></div>";
          }
          str += `<td class='section item${hideState}' placeholder='${momentexists}'id='I${item['lid']}' style='cursor:pointer;' `;
          kk = 0;

        } else if (itemKind === 2) {


          str += `<td class='example item${hideState}' placeholder='${momentexists}' id='I${item['lid']}' `;

          kk++;

        } else if (itemKind === 3) {
          if (retdata['writeaccess']) {
            str += "<td class='LightBox" + hideState + "'>";
            str += "<div ><img class='iconColorInDarkMode' alt='pen icon dugga' src='../Shared/icons/PenT.svg'></div>";
          }

          if (item['highscoremode'] != 0 && itemKind == 3) {
            str += `<td style='width:20px;'><img class='iconColorInDarkMode' style=';' title='Highscore' src='../Shared/icons/top10.png'
            onclick='showHighscore(\"${item['link']}\",\"${item['lid']}\")'/></td>`;
          }
          str += `<td class='example item${hideState}' placeholder='${momentexists}' id='I${item['lid']}' `;
          kk++;

        } else if (itemKind === 4) {
          str += "<td class='LightBoxFilled" + hideState + "'>";
          str += "<div ><img alt='pen icon dugga' src='../Shared/icons/list_docfiles.svg'></div>";

          // New moment bool equals true
          momentexists = item['lid'];
          str += `<td class='moment item${hideState}' placeholder='${momentexists}' id='I${item['lid']}' style='cursor:pointer;' `;
          kk = 0;

        } else if (itemKind === 5) { // Link

          str += `<td class='example item' placeholder='${momentexists}' id='I${item['lid']}' `;
          kk++;

        } else if (itemKind === 6) { // Group
          // Alt 1
          let grpmembershp = data['grpmembershp'].split(" ");
          var grptype = item['grptype'] + "_";
          var grp = grptype + "UNK";

          if (document.getElementById("userName").innerHTML != "Guest") {
            for (let i = 0; i < grpmembershp.length; i++) {
              let g = grpmembershp[i].replace(grptype, "");
              if (g.length < grpmembershp[i].length) {
                if (grp !== grptype + "UNK") {
                  grp += ",";
                } else {
                  grp = "";
                }
                grp += grptype + g;
              }
            }
          }

          str += `<td style='width:32px;' onclick='getGroups(\"${grp}\");'><img src='../Shared/icons/group-iconDrk.svg'
          style='display:block;margin-right:4.5px;max-width:32px;max-height:32px;overflow:hidden;'></td>`;
          str += `<td class='section-message item' onclick='getGroups(\"${grp}\");
          ' placeholder='${momentexists}' id='I${item['lid']}' `;

        } else if (itemKind === 7) { // Message
          if (!(item['link'] == "" || item['link'] == "---===######===---")) {
            str += `<td style='width:32px;'><img title='Important message'
            src='../Shared/icons/warningTriangle.svg'></td>`;
          }
          str += `<td class='section-message item' placeholder='${momentexists}' id='I${item['lid']}' `;
        }

        // Close Information
        str += " value='"+item['lid']+"' onclick='duggaRowClick(this)' >";
        // Content of Section Item
        if (itemKind == 0) {
          // Header
          str += `<span style='margin-left:8px;' title='${item['entryname']}'>${item['entryname']}</span>`;
        } else if (itemKind == 1) {
          // Section
          str += `<div ('arrowComp${item['lid']}')" class='nowrap${hideState}' style='margin-left:8px;display:flex;align-items:center ;
          ' title='${item['entryname']}'>`;
          str += `<span class='ellipsis listentries-span'>${item['entryname']}</span>`;
          str += `<img src='../Shared/icons/desc_complement.svg' alt='Hide List Content' id='arrowComp${item['lid']}' class='arrowComp' style='display:block;'>`;
          str += `<img src='../Shared/icons/right_complement.svg' alt='Show List Content' id='arrowRight${item['lid']}' class='arrowRight' style='display:none;'></div>`;
        } else if (itemKind == 4) {
          // Moment
          var strz = makeTextArray(item['gradesys'], ["", "(U-G-VG)", "(U-G)"]);
          str += `<div class='nowrap${hideState}' style='margin-left:8px;display:flex;align-items:center;' title='${item['entryname']}'>`;
          str += `<span class='ellipsis listentries-span'>${item['entryname']} ${strz} </span>`;
          str += "<img src='../Shared/icons/desc_complement.svg' alt='Hide List Content' id='arrowComp" + item['lid'] + "' class='arrowComp' style='display:block;'>";
          str += "<img src='../Shared/icons/right_complement.svg' alt='Show List Content' id='arrowRight" + item['lid'] + "' class='arrowRight' style='display:none;'></div>";
          str += "</div>";
        } else if (itemKind == 2) {
          // Code Example
          var param = {
            'exampleid': item['link'],
            'courseid': querystring['courseid'],
            'coursename' : querystring['coursename'],
            'cvers': querystring['coursevers'],
            'lid': item['lid']
          };
                    str += `<div class='ellipsis nowrap'><span>${makeanchor("codeviewer.php",
                    hideState, "margin-left:8px;", item['entryname'], false, param)}</span></div>`;
        } else if (itemKind == 3) {
          // Test / Dugga
          var param = {
            'did': item['link'],
            'courseid': querystring['courseid'],
            'coursename': querystring['coursename'],
            'coursevers': querystring['coursevers'],
            'moment': item['lid'],
            'segment': momentexists,
            highscoremode: item['highscoremode'],
            comment: item['comments'],
            deadline: item['deadline'],
            'cid': querystring['courseid']
          };
          str += `<div class='ellipsis nowrap'><span>${makeanchor("showDugga.php", hideState,
          "cursor:pointer;margin-left:8px;", item['entryname'], false, param)}</span></div>`;
        } else if (itemKind == 5) {
          // Link
          if (item['link'].substring(0, 4) === "http") {
            str += makeanchor(item['link'], hideState, "cursor:pointer;margin-left:8px;",
            item['entryname'], false, {});
          } else {
            var param = {
              'exampleid': item['link'],
              'courseid': querystring['courseid'],
              'coursevers': querystring['coursevers'],
              'fname': item['link']
            };
            str += makeanchor("showdoc.php", hideState, "cursor:pointer;margin-left:8px;",
            item['entryname'], false, param);
          }
        } else if (itemKind == 6) {
          // Group
          str += `<a class='ellipsis nowrap' onclick='getGroups(\"${grp}\");'
          style='cursor:pointer;'>` + item['entryname'];
          let re = new RegExp(grptype, "g");
          grp = grp.replace(re, "");
          if (document.getElementById("userName").innerHTML == "Guest") {
            str += "  &laquo;Not logged in&raquo</span></div>";
          } else if (grp.indexOf("UNK") >= 0) {
            str += " &laquo;Not assigned yet&raquo</span></div>";
          } else {
            str += grp + "</span></a>";
          }
        } else if (itemKind == 7) {
          // Message
          str += `<span style='margin-left:8px;' title='${item['entryname']}'>
          ${item['entryname']}</span>`;
        }

        str += "</td>";

        // If none of the deadlines are null or undefined we need to add it to the page
        if ((itemKind === 3) && ((deadline !== null || deadline !== "undefined") || (rDeadline !== null || rDeadline !== "undefined"))) {
          // Both of them will need this html
          str += "<td onclick='duggaRowClick(this)' class='dateSize' style='text-align:right;overflow:hidden;'>"+
          "<div class='DateColorInDarkMode' style='white-space:nowrap;'>";

          // We prioritize absolute deadline and we dont want absolute deadlines if there's no startdate for course
          if ((deadline !== null && deadline !== "undefined") && retdata['startdate'] !== null) {
            deadline = convertDateToDeadline(new Date(deadline));
            deadlineArr = deadline.split(" ");
            str += deadlineArr[0];

            // If minute and hour contains nothing but 0 we dont show it
            if (!/^[0:]+$/.test(deadlineArr[1])) {
              str += " "+deadlineArr[1].split(":")[0]+":"+deadlineArr[1].split(":")[1];
            }

            // If there is only a relative deadline we display it instead
          } else if (rDeadline !== null && rDeadline !== "undefined") {
            str += formatRelativeDeadlineToString(rDeadline);
          }
          str += "</div></td>";
        }

        // Due to date and time format problems slice is used to make the variable submitted the same format as variable deadline
        if (submitted) {
          var dateSubmitted = submitted.toJSON().slice(0, 10).replace(/-/g, '-');
          var timeSubmitted = submitted.toJSON().slice(11, 19).replace(/-/g, '-');
          var dateTimeSubmitted = dateSubmitted + [' '] + timeSubmitted;

          // Create a warning if the dugga is submitted after the set deadline and withing the grace time period if one exists
          if ((status === "pending") && (dateTimeSubmitted > deadline)) {
            if (hasGracetimeExpired(deadline, dateTimeSubmitted)) {
              str += `<td style='width:25px;'><img style='width:25px; padding-top:3px'
              title='This dugga is not guaranteed to be marked due to submission after deadline.'
              src='../Shared/icons/warningTriangle.svg'/></td>`;
            }
          }
        }

        // Refresh button
        if (itemKind === 2 && data['writeaccess'] || data['studentteacher']) {
          str += `<td style='width:32px;'>`;
          str += `<img style='width:16px' alt='refresh icon' tabIndex='0'
                  id='dorf' class='refreshButton' title='Refresh code example' src='../Shared/icons/refresh.svg'`;
          str += " onclick='refreshCodeExample("+item['link']+")'"
          str += "</td>";
        }

        // Userfeedback
        if (data['writeaccess'] && itemKind === 3 && item['feedbackenabled'] == 1) {
          str += "<td style='width:32px;'>";
          str += `<img id='dorf' src='../Shared/icons/FistV.svg' title='Feedback'
          onclick='showUserFeedBack(\"${item['lid']}\",\"${item['feedbackquestion']}\");'>`;
          str += "</td>";
        }
        // Tab example button
        if ((itemKind != 4) && (data['writeaccess'] || data['studentteacher'])) {
          str += `<td style='width:32px;' class='${makeTextArray(itemKind, ["header", "section",
          "code", "test", "moment", "link", "group", "message"])} ${hideState}'>`;
          str += `<input type='button' style='border:none; background:transparent;' value='&#8633' id='tabElement'
            title='Tab example button' onclick='confirmBox("openTabConfirmBox",this);'>`
          str += "</td>";
        }
        if (itemKind != 4 && itemKind != 1 && itemKind != 0){ // dont create buttons for moments only for specific assignments
          //Generate new tab link
          str += `<td style='width:32px;' class='${makeTextArray(itemKind, ["header", "section",
          "code", "test", "moment", "link", "group", "message"])} ${hideState}'>`;
            str += `<img style='width:16px;' class="newTabCanvasLink" tabIndex="0" alt='canvasLink icon' id='NewTabLink' title='Open link in new tab' class=''
            src='../Shared/icons/link-icon.svg' onclick='openCanvasLink(this);'>`;
            str += "</td>";

          // Generate Canvas Link Button
          if (data['writeaccess'] || data['studentteacher']) {
            str += `<td style='width:32px;' class='${makeTextArray(itemKind, ["header", "section",
            "code", "test", "moment", "link", "group", "message"])} ${hideState}'>`;
            str += `<div class="showCanvasLinkBoxTab" tabIndex="0">`;
            str += `<img style='width:16px;' alt='canvasLink icon' id='dorf' title='Get Canvas Link' class=''
            src='../Shared/icons/canvasduggalink.svg' onclick='showCanvasLinkBox(\"open\",this);'>`;
            str += `</div>`;
            str += "</td>";
          }
        }

        // Cog Wheel
        if (data['writeaccess'] || data['studentteacher']) {
          str += `<td style='width:32px;' class='${makeTextArray(itemKind,
            ["header", "section", "code", "test", "moment", "link", "group", "message"])} ${hideState}'>`;


          str += "<img alt='settings icon'  tabIndex='0' id='dorf' title='Settings' class='settingIconTab' src='../Shared/icons/Cogwheel.svg' ";
          str += " onclick='setActiveLid("+item['lid']+");selectItem(" + makeparams([item['lid'], item['entryname'],
          item['kind'], item['visible'], item['link'], momentexists, item['gradesys'],
          item['highscoremode'], item['comments'], item['grptype'], item['deadline'], item['relativedeadline'],
          item['tabs'], item['feedbackenabled'], item['feedbackquestion']]) + "), clearHideItemList();' />";


          str += "</td>";
        }

        // Trashcan
        if (data['writeaccess'] || data['studentteacher']) {
          str += `<td style='width:32px;' class='${makeTextArray(itemKind, ["header", "section",
          "code", "test", "moment", "link", "group", "message"])} ${hideState}'>`;
          str += `<img  class="traschcanDelItemTab" alt='trashcan icon' tabIndex="0" id='dorf' title='Delete item' class=''
          src='../Shared/icons/Trashcan.svg' onclick='confirmBox(\"openConfirmBox\", this);'>`;
          str += "</td>";


        }


        // github icon for moments (itemKind 4 is moments)
        if (itemKind === 4 && data['writeaccess'] || data['studentteacher'])  {
          str += `<td style='width:32px;' class='${makeTextArray(itemKind, ["header", "section", 
          "code", "test", "moment", "link", "group", "message"])} ${hideState}'>`;
          str += `<img style='max-width: 60%;' class="githubPointer" alt='gitgub icon' tabIndex="0" id='dorf' title='Github repo' class='' 
          src='../Shared/icons/githubLink-icon.png' onclick='confirmBox(\"openGitHubBox\", this);'>`;
          str += "</td>";
        }
        // github icon for code (itemKind 2 is code)
        if (itemKind === 2 && data['writeaccess'] || data['studentteacher'])  {
          str += `<td style='width:32px;' class='${makeTextArray(itemKind, ["header", "section", 

          "code", "test", "moment", "link", "group", "message"])} ${hideState}'>`;
          str += `<img style='max-width: 60%;' class="githubPointer" alt='gitgub icon' tabIndex="0" id='dorf' title='Github' class=''
          src='../Shared/icons/githubLink-icon.png' onclick='confirmBox(\"openGitHubTemplate\", this);'>`;
          str += "</td>";
        }



        // Checkbox
        if (data['writeaccess'] || data['studentteacher']) {
          str += `<td style='width:25px;' class='${makeTextArray(itemKind,
            ["header", "section", "code", "test", "moment", "link", "group", "message"])} ${hideState}'>`;
            str += "<input type='checkbox' id='"+ item['lid'] + "-checkbox" + "' title='"+item['entryname'] + " - checkbox"+"' class='checkboxIconTab' onclick='markedItems(this)'>";
            str += "</td>";
        }

        str += "</tr>";
        str += "</table></div>";
      } // End of for-loop

    } else {
      // No items were returned!
      str += "<div id='noAccessMessage' class='bigg'>";
      str += "<span>You either have no access or there isn't anything under this course</span>";
      str += "</div>";
    }

    str += "</div></div>";

    var slist = document.getElementById('Sectionlisti');
    slist.innerHTML = str;

    if (resave == true) {
      str = "";
      $("#Sectionlist").find(".item").each(function (i) {
        if (i > 0) str += ",";
        ido = $(this).attr('id');
        phld = $(this).attr('placeholder')
        str += i + "XX" + ido.substr(1) + "XX" + phld;

      });
      AJAXService("REORDER", {
        order: str
      }, "SECTION");
      resave = false;
    }

    if (hasDuggs === false || navigator.vendor == ("Apple Computer, Inc.")){
      $("#statisticsSwimlanes").hide();
      $("#sectionList_arrowStatisticsOpen").hide();
      $("#sectionList_arrowStatisticsClosed").hide();
    }

    if (data['writeaccess']) {
      // Enable sorting always if we are superuser as we refresh list on update

      $("#Sectionlistc").sortable({
        handle: ".dragbleArea",
        helper: 'clone',
        update: function (event, ui) {
          str = "";
          $("#Sectionlist").find(".item").each(function (i) {
            if (i > 0) str += ",";
            ido = $(this).attr('id');
            phld = $(this).attr('placeholder')
            str += i + "XX" + ido.substr(1) + "XX" + phld;

          });

          AJAXService("REORDER", {
            order: str
          }, "SECTION");
          resave = true;
          return false;
        }

      });
      // But disable sorting if there is a #noAccessMessage
      if( $("#noAccessMessage").length) {
        $("#Sectionlistc").sortable("disable");
      }
    }
  } else {
    str = "<div class='err' style='z-index:500; position:absolute; top:60%; width:95%;'>"+
    "<span style='font-weight:bold; width:100%'>Bummer!</span> This version does not seem to exist!</div>";

    document.getElementById('Sectionlist').innerHTML+= str;
    $("#newCourseVersion").css("display", "block");




  }

  // Reset checkboxes
  // Prevents a bug if they are checked when for example an item is deleted and the table refreshes
  clearHideItemList();

  // The next 5 lines are related to collapsable menus and their state.
  getHiddenElements();
  hideCollapsedMenus();
  getArrowElements();
  toggleArrows();
  menuState.idCounter = 0;

  // Change title of the current page depending on which page the user is on.
  document.getElementById("sectionedPageTitle").innerHTML = data.coursename + " - " + data.coursecode;

  // Sets a title on the course heading name


  if(versionname){
    document.getElementById("course-coursename").title = data.coursename + " " + data.coursecode + " " + versionname;

    // If safari this will not load in
    if (navigator.vendor != ("Apple Computer, Inc.")) {
      drawSwimlanes(); // Create the swimlane used in the statistics section.
      }


    // Change the scroll position to where the user was last time.
    $(window).scrollTop(localStorage.getItem("sectionEdScrollPosition" + retdata.coursecode));

    // Replaces the link corresponding with dropdown choice ---===######===--- with dummylink, in this case error page 403
    replaceDefualtLink();



    addClasses();
    showMOTD();
  }
}

function openCanvasLink(btnobj){
  link = btnobj.parentNode.parentNode.querySelector('a').href;
  window.open(link, "_blank");
}

function showCanvasLinkBox(operation,btnobj){
  if(operation == "open"){

    var canvasLink = btnobj.parentNode.parentNode.querySelector('a').href; // "<p><iframe src=\"" + btnobj.parentNode.parentNode.querySelector('.internal-link').href + "\" width=\"800\" height=\"1200\"></iframe></p>";
    //var canvasLink = "<p><iframe src=\"" + btnobj.parentNode.parentNode.querySelector('a').href + "\" width=\"800\" height=\"1200\"></iframe></p>";

    if(canvasLink == null){
      canvasLink = "ERROR: Failed to get canvas link.";
    }
    // navigator.clipboard.writeText(canvasLink);  Method that requires local host or HTTPS which we dont have here.
    // Alternative route with a text area.
    let textArea = document.createElement("textarea");
    textArea.value = canvasLink;
    // Make the textarea out of viewport
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    textArea.remove();


    $("#canvasLinkBox").css("display", "flex");
    $('#close-item-button').focus();

    document.getElementById("canvasLinkText").value = canvasLink;
  }else if(operation == "close"){
    $("#canvasLinkBox").css("display", "none");
  }
}


// Displays MOTD if there in no MOTD cookie or if the cookie dosen't have the correcy values
function showMOTD(){
  if((document.cookie.indexOf('MOTD=') <= -1) || ((document.cookie.indexOf('MOTD=')) == 0 && ignoreMOTD())){
    if(motd == 'UNK' || motd == 'Test' || motd == null || motd == "") {
      document.getElementById("motdArea").style.display = "none";
    }else{
      document.getElementById("motdArea").style.display = "block";
      document.getElementById("motd").innerHTML = "<tr><td>" + motd + "</td></tr>";
      document.getElementById("FABStatic2").style.top = "auto";
    }
  }
}

function DisplayMSGofTDY() {
  document.getElementById("motdArea").style.display = "block";
  document.getElementById("motd").innerHTML = "<tr><td>" + motd + "</td></tr>";
  document.getElementById("FABStatic2").style.top = "auto";
  showMOTD();
}

// Checks if the MOTD cookie already have the current vers and versname
function ignoreMOTD(){
  var c_string = getCookie('MOTD');
  c_array = c_string.split(',');
  for(let i = 0; i<c_array.length;i+=2){
    if(c_array[i] == versnme && c_array[i+1] == versnr){
      return false;
    }
  }
  return true;
}

function resetMOTDCookieForCurrentCourse(){
  var c_string = getCookie('MOTD');
  if (c_string != ('') && c_string != null){
  c_array = c_string.split(',');
  for(let i = 0; i<c_array.length;i+=2){
    if(c_array[i] == versnme && c_array[i+1] == versnr){
      c_array.splice(i, 2);
    }
  }
  document.cookie = 'MOTD=' + c_array;
}
  showMOTD();
}

function closeMOTD(){
  if(document.cookie.indexOf('MOTD=') <= -1){
    document.cookie = 'MOTD=';
    setMOTDCookie();
  }else{
    setMOTDCookie();
  }
  document.getElementById('motdArea').style.display='none';
  document.getElementById("FABStatic2").style.top = "auto";
}
// Adds the current versname and vers to the MOTD cookie
function setMOTDCookie(){
  var c_string = getCookie('MOTD');
  c_string += versnme+","+versnr+",";
  document.cookie = 'MOTD=' + c_string;
}
// Returns the value based on the cookies name
function getCookie(c_name) {
  var c_value = " " + document.cookie;
  var c_start = c_value.indexOf(" " + c_name + "=");
  if (c_start == -1) {
      c_value = null;
  }
  else {
      c_start = c_value.indexOf("=", c_start) + 1;
      var c_end = c_value.indexOf(";", c_start);
      if (c_end == -1) {
          c_end = c_value.length;
      }
      c_value = unescape(c_value.substring(c_start,c_end));
  }
  return c_value;
}

function showHighscore(did, lid) {
  AJAXService("GET", {
    did: did,
    lid: lid
  }, "DUGGAHIGHSCORE");
}

function getGroups(grp) {
  AJAXService("GRP", {
    showgrp: grp
  }, "GRP");
}

function returnedHighscore(data) {

  var str = "";

  str += "<tr><th>Rank</th><th>Name</th><th>Score</th></tr>";

  if (data['highscores'].length > 0) {
    for (i = 0; i < data['highscores'].length; i++) {
      var item = data['highscores'][i];
      if (!isNaN(data["user"][0]) && data["user"][0] === i) {
        str += "<tr class='highscoreUser'>"
      } else {
        str += "<tr>";
      }
      str += "<td>" + (i + 1) + "</td>";
      str += "<td>" + item['username'] + "</td>";
      str += "<td>Score: " + item['score'] + "</td>";
      str += "</tr>";
    }
  }

  if (data["user"]["username"]) {
    str += "<tr class='highscoreUser'>";
    str += "<td></td>";
    str += "<td>" + data["user"]["username"] + "</td>";
    str += "<td>Score: " + data["user"]["score"] + "</td>";
    str += "</tr>";
  }

  var highscorelist = document.getElementById('HighscoreTable').innerHTML = str;
  $("#HighscoreBox").css("display", "block");
}



//----------------------------------------------------------------------------------
// drawSwimlanes: Draws schedule for deaadlines on all assignments is course
//----------------------------------------------------------------------------------

function drawSwimlanes() {

  var startdate = new Date(retdata['startdate']);
  var enddate = new Date(retdata['enddate']);

  var deadlineEntries = [];
  var momentEntries = [];
  // var current = new Date(2015, 02, 19);
  var current = new Date();

  var momentno = 0;

  for (var i = 0; i < retdata['entries'].length; i++) {
    var deadline = new Date(retdata['entries'][i].deadline);
    var start = new Date(retdata['entries'][i].qstart);
    if (retdata['entries'][i].kind == 3 && retdata['entries'][i].visible == "1") {
      var marked = null;
      var submitted = null;
      var grade = null;
      for (var j = 0; j < retdata['results'].length; j++) {
        if (retdata['results'][j].moment == retdata['entries'][i].lid) {
          marked = retdata['results'][j].marked;
          submitted = retdata['results'][j].submitted;
          grade = retdata['results'][j].grade;
        }
      }
      deadlineEntries.push({
        'deadline': deadline,
        'start': start,
        'text': retdata['entries'][i].entryname,
        'moment': retdata['entries'][i].moment,
        'marked': marked,
        'submitted': submitted,
        'grade': grade,
        'pos':parseInt(retdata['entries'][i].pos)
      });
    } else if (retdata['entries'][i].kind == 4) {
      momentEntries.push({
        'moment':retdata['entries'][i].moment,
        'momentname':retdata['entries'][i].entryname,
        'pos':retdata['entries'][i].pos,
      });
      momentno++;
    }
  }

  deadlineEntries.sort(function(a,b){
    return a.pos-b.pos;
  });

  momentEntries.sort(function(a,b){
    return a.pos-b.pos;
  });


  // var weekLength = weeksBetween(startdate, enddate);
  var weekLength = Math.ceil((enddate - startdate) / (7 * 24 * 60 * 60 * 1000));
  var currentWeek = weeksBetween(current, startdate);
  var daywidth = 10;
  var weekwidth = daywidth * 7;
  var colwidth = 60;
  var weekheight = 25;

  var str = "";
  // Fades a long text. Gradients on swimlane text depending on if dugga is submitted or not.
  str += "<defs><linearGradient gradientUnits='userSpaceOnUse' x1='0' x2='300' y1='0' y2='0' id='fadeTextGrey'>"+
  "<stop offset='85%' stop-opacity='1' stop-color='#000000' /><stop offset='100%' stop-opacity='0'/> </linearGradient> "+
  "<linearGradient gradientUnits='userSpaceOnUse' x1='0' x2='300' y1='0' y2='0' id='fadeTextRed'>"+
  "<stop offset='85%' stop-opacity='1' stop-color='#FF0000' /><stop offset='100%' stop-opacity='0'/> </linearGradient></defs>";

  for (var i = 0; i < weekLength; i++) {
    str += "<rect x='" + (i * weekwidth) + "' y='" + (15) + "' width='" +
    (weekwidth) + "' height='" + (weekheight * (deadlineEntries.length + 1)) + "' ";
    if ((i % 2) == 0) {
      str += "fill='#ededed' />";
    } else {
      str += "fill='#ffffff' />";
    }
    str += `<text x='${((i * weekwidth) + (weekwidth * 0.5))}' y='${(33)}'
    font-family='Arial' font-size='12px' fill='black' text-anchor='middle'>${(i + 1)}</text>`;
  }

  for (var i = 1; i < (deadlineEntries.length + 2); i++) {
    str += `<line x1='0' y1='${((i * weekheight) + 15)}' x2='
    ${(weekLength * weekwidth )}' y2='${((i * weekheight) + 15)}' stroke='black' />`;
  }

  var weeky = 15;
  for (var k = 0; k < momentEntries.length;k++) {
    const obj=momentEntries[k];
    for (var i = 0; i < deadlineEntries.length; i++) {
      const entry = deadlineEntries[i];
      if (obj.moment == entry.moment) {
        weeky += weekheight;
        // Now we generate a SVG element for this
        startday = Math.floor((entry.start - startdate) / (24 * 60 * 60 * 1000));
        let duggastart=new Date(entry.start).toLocaleDateString('sv-SE','YYYY-MM-DD');
        let duggaend=new Date(entry.deadline).toLocaleDateString('sv-SE','YYYY-MM-DD');
        duggalength = Math.ceil((new Date(duggaend) - new Date(duggastart)) / (24 * 60 * 60 * 1000));
        duggalength += 1; // A dugga will have at least 1 day of duration, i.e., if dugga starts and ends on the same day we want a duration of 1 day.

        // Yellow backgroundcolor if the dugga have been submitted but grade is pending.
        // Green backgroundcolor if the dugga have been submitted and the grade is passed.
        // Red backgroundcolor if the dugga have been submitted and the grade is failed.
        // Since we no longer keep track of graded dugas coloring is obsolete! Sholud be removed!
        var fillcol = "#620C5B80";
        if ((entry.submitted != null) && (entry.grade == undefined)) fillcol = "#FFEB3B"
        else if ((entry.submitted != null) && (entry.grade > 1)) fillcol = "#00E676"
        else if ((entry.submitted != null) && (entry.grade == 1)) fillcol = "#E53935";

        // Grey backgroundcolor & red font-color if no submissions of the dugga have been made.
        var textcol = `url("#fadeTextGrey")`;
        // var textcol = `#FFFFFF`;
        if (fillcol == "#BDBDBD" && entry.deadline - current < 0) {
          textcol = `url("#fadeTextRed")`;
        } else if((fillcol == "#FFEB3B") && (entry.deadline - current < 0) && (entry.submitted != null)) {
          textcol = `url("#fadeTextRed")`;
        }

        str += `<rect opacity='0.7' x='${(startday * daywidth)}' y='${(weeky)}' width='${(duggalength * daywidth)}' height='${weekheight}' fill='${fillcol}' />`;
        str += `<text x='${(12)}' y='${(weeky + 18)}' font-family='Arial' font-size='12px' fill='${textcol}' text-anchor='left'> <title> ${entry.text} </title>${entry.text}</text>`;
      }
    }
  }

  // Setting a temporary date on 'current' in case dates not updated in course
  // To adjust the red line showing the day in swimlanes
  var newCurrent;
  var daySinceStart;

  if(enddate.getFullYear() < current.getFullYear()) { // Guesstimate deadline for current year if course not updated
    var yearDifference = current.getFullYear() - enddate.getFullYear();
    var tempYear = new Date(current);

    tempYear.setFullYear(current.getFullYear() - yearDifference);
    newCurrent = new Date(tempYear);
    daySinceStart = Math.ceil(( newCurrent - startdate) / (24 * 60 * 60 * 1000));
  }
  else {                                           // When dates are updated and no guesstimation needed
       daySinceStart = Math.ceil(( current - startdate ) / (24 * 60 * 60 * 1000));
  }


  str += `<line opacity='0.7' x1='${(daySinceStart * daywidth)}'
  y1='${(15 + weekheight)}' x2='${(daySinceStart * daywidth) }'
  y2='${(((1 + deadlineEntries.length) * weekheight) + 15)}' stroke-width='4' stroke='red' />`;
  let svgHeight = ((1 + deadlineEntries.length) * weekheight) + 15;

  document.getElementById("swimlaneSVG").innerHTML = str;
  document.getElementById("swimlaneSVG").setAttribute("viewBox", "0 0 800 " + svgHeight);


  var minDistance;
  var min_index = -1;
  // Looks through all the deadline entries and finds the one with the shortest distance to current date
  for(var i = 0; i < deadlineEntries.length;i++) {
      if(deadlineEntries[i].deadline >= current) {
        if(deadlineEntries[i].deadline - current < minDistance || minDistance == undefined) {
          minDistance = deadlineEntries[i].deadline - current;
          min_index = i;
        }
      }
    }
   // index * height = topPos
  var topPos =  min_index * weekheight;
  document.getElementById('statisticsSwimlanes').scrollTop = topPos;

}

// -------------==============######## Setup and Event listeners ###########==============-------------

$(document).mouseover(function (e) {
    // showFabList(e);
    FABMouseOver(e);
});

$(document).mouseout(function (e) {
    FABMouseOut(e);
});

$(document).mousedown(function (e) {
  mouseDown(e);

  if (e.button == 0) {
    FABDown(e);
  }
});

$(document).mouseup(function (e) {
  mouseUp(e);


});

$(document).ready(function(){
$(fabBtn).on("touchstart", function (e) {
  if ($(e.target).parents(".fixed-action-button").length !== 0 &&
  $(e.target).parents(".fab-btn-list").length === 0) {
    e.preventDefault();
  }

  $("#fabBtnList").show();
  mouseDown(e);
  TouchFABDown(e);
});
});

$(document).on("touchend", function (e) {
  if ($(e.target).parents(".fixed-action-button").length !== 0 &&
  $(e.target).parents(".fab-btn-list").length === 0) {
    e.preventDefault();
  }
  mouseUp(e);
  TouchFABUp(e);
});

//----------------------------------------------------------------------------------
// mouseDown: make sure mousedown is only handled in one single place regardless if touch or mouse
//----------------------------------------------------------------------------------

function mouseDown(e) {

  var box = $(e.target);

  // Is the clicked element a loginbox? or is it inside a loginbox?
  if (box[0].classList.contains("loginBox")) {
    isClickedElementBox = true;
  } else if ((findAncestor(box[0], "loginBox") != null) &&
    (findAncestor(box[0], "loginBox").classList.contains("loginBox"))) {
    isClickedElementBox = true;
  } else {
    isClickedElementBox = false;
  }

}

//----------------------------------------------------------------------------------
// mouseUp: make sure mouseup is only handled in one single place regardless if touch or mouse
//----------------------------------------------------------------------------------

function mouseUp(e) {
  /* If the target of the click isn't the container nor a descendant of the container,
     or if we have clicked inside box and dragged it outside and released it */
  if ($('.loginBox').is(':visible') && !$('.loginBox').is(e.target) &&
  $('.loginBox').has(e.target).length === 0 && (!isClickedElementBox)) {

    event.preventDefault();

    closeWindows();
    closeSelect();
    showSaveButton();
  } else if (!findAncestor(e.target, "hamburgerClickable") && $('.hamburgerMenu').is(':visible')) {
    hamburgerChange("notAClick");
  }
}

//----------------------------------------------------------------------------------
// event handlers: Detect mouse / touch gestures uniformly
//----------------------------------------------------------------------------------

$(window).keyup(function (event) {
  var deleteButtonDisplay = ($('#sectionConfirmBox').css('display'));
  if (event.keyCode == 27) {
    // If key is escape
    showSaveButton();
     hamburgerChange("escapePress");
    document.activeElement.blur(); // To lose focus from the newItem button when pressing escape
  } else if (event.keyCode == 13) {
    // Remember that keycode 13 = enter button
    document.activeElement.blur();
    var saveButtonDisplay = ($('#saveBtn').css('display'));
    var editSectionDisplay = ($('#editSection').css('display'));
    var submitButtonDisplay = ($('#submitBtn').css('display'));
    var errorMissingMaterialDisplay = ($('#noMaterialConfirmBox').css('display'));
    if (saveButtonDisplay == 'block' && editSectionDisplay == 'flex') {
      //I don't know who did this but this call is not necessory
      updateItem();
      //Add class to element so it will be highlighted.
      setTimeout(function(){
        var element = document.getElementById('I'+updatedLidsection).firstChild;
        if(element.tagName == 'DIV') {
        element = element.firstChild;
        element.classList.add("highlightChange");
        }else if (element.tagName == 'A'){
          document.getElementById('I'+updatedLidsection).classList.add("highlightChange");
        }else if (element.tagName == 'SPAN'){
          document.getElementById('I'+updatedLidsection).firstChild.classList.add("highlightChange");
        }
      },200);

    } else if (submitButtonDisplay == 'block' && editSectionDisplay == 'flex') {
      newItem();
      showSaveButton();
    } else if (testsAvailable == true) {
      confirmBox("closeConfirmBox");
      testsAvailable = false;
    } else if (errorMissingMaterialDisplay == 'flex') {
      closeWindows();
    }
  }
    else if(event.keyCode == 37){
      if (deleteButtonDisplay == 'flex') {
        $('#delete-item-button').focus();
      }
    }
    else if(event.keyCode == 39){
      if (deleteButtonDisplay == 'flex') {
        $('#close-item-button').focus();
      }
    }
});

// React to scroll events
$(document).scroll(function (e) {
  if (typeof (retdata) !== "undefined") {
    localStorage.setItem("sectionEdScrollPosition" + retdata.coursecode, $(window).scrollTop());
  }
});

// Functions to prevent collapsing when clicking icons
$(document).on('click', '#corf', function (e) {
  e.stopPropagation();
});

$(document).on('click', '#dorf', function (e) {
  e.stopPropagation();
});

// The event handler returns two elements. The following two if statements gets the element of interest.
$(document).on('click', '.moment, .section, .statistics', function () {

  if (this.id.length > 0) {
    saveHiddenElementIDs(this.id);
  }
  if (this.id.length > 0) {
    saveArrowIds(this.id);
  }
  hideCollapsedMenus();
  toggleArrows(this.id);

});


// Setup (when loaded rather than when ready)
$(window).load(function () {
  accessAdminAction();
  $(".messagebox").hover(function () {
    $("#testbutton").css("background-color", "red");
  });
  $(".messagebox").mouseout(function () {
    $("#testbutton").css("background-color", "#614875");
  });
  $("#sectionList_arrowStatisticsOpen").click(function () {
    $("#sectionList_arrowStatisticsOpen").hide();
    $("#sectionList_arrowStatisticsClosed").show();
    $("#statisticsList").show();
    $("#statistics").hide();
    $(".statisticsContent").show();
    $("#courseList").css({
      'display':'flex',
      'flex-direction': 'column'
    });
    $(".statisticsContentBottom").show();
    if (hasDuggs) {
      $("#swimlaneSVG").show();
      $("#statisticsSwimlanes").show();
    }
  });
  $("#sectionList_arrowStatisticsClosed").click(function () {
    $("#sectionList_arrowStatisticsOpen").show();
    $("#sectionList_arrowStatisticsClosed").hide();
    $("#statisticsList").hide();
	$("#swimlaneSVG").hide();
    $("#statisticsSwimlanes").hide();

  });
  $("#announcement").click(function(){
    sessionStorage.removeItem("closeUpdateForm");
    $("#announcementBoxOverlay").toggle();
    if($("#announcementForm").is(":hidden")){
      $("#announcementForm").show();
    }

  });
  $("#announcementBurger").click(function(){
    sessionStorage.removeItem("closeUpdateForm");
    $("#announcementBoxOverlay").toggle();
    if($("#announcementForm").is(":hidden")){
      $("#announcementForm").show();
    }

  });
  $(".createBtn").click(function(){
    sessionStorage.setItem('closeUpdateForm', true);
  });

  // retrieveAnnouncementAuthor();
  // retrieveAnnouncementsCards();
  displayListAndGrid();
  displayAnnouncementBoxOverlay();
  multiSelect();
  // toggleFeedbacks();
});


// Show the full announcement
function showAnnouncement(){
  document.getElementById('fullAnnnouncementOverlay').style.display="block";
}

// Retrieve the announcment author
function retrieveAnnouncementAuthor(){
  var uname = $("#userName").html();
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if($("#userid").length > 0) {
          var parsed_data = JSON.parse(this.response);
          if(($("#announcementForm").length) > 0){
            document.getElementById("userid").value = parsed_data.uid;
            retrieveCourseProfile(parsed_data.uid);
          }
      }
    }
  };
  xmlhttp.open("GET","../Shared/retrieveUserid.php?uname="+uname,true);
  xmlhttp.send();

}

// Retrieve course profile
function retrieveCourseProfile(userid){
  $(".selectLabels label input").attr("disabled", true);
  var cid = '';
  $("#cid").change(function(){
    cid = $("#cid").val();
    if (($("#cid").val()) != '') {
      $("#versid").prop("disabled", false);
      $.ajax({
        url: "../Shared/retrievevers.php",
        data: {cid: cid},
        type: "POST",
        success: function(data){
          var item = JSON.parse(data);
          $("#versid").find('*').not(':first').remove();
          $.each(item.versids, function(index,item) {
              $("#versid").append("<option value="+item.versid+">"+item.versid+"</option>");
          });

        },
        error:function(){
          console.log("*******Error*******");
        }
      });

    }else{
      $("#versid").prop("disabled", true);
    }

  });
  if (($("#versid option").length) <= 2) {
    $("#versid").click(function(){
      getStudents(cid, userid);
    });
  }else if(($("#versid option").length) > 2){
    $("#versid").change(function(){
      getStudents(cid, userid);
    });
  }
}
function getStudents(cid, userid){
   var versid = '';
   versid = $("#versid").val();
   if (($("#versid").val()) != '') {
    $("#recipient").prop("disabled", false);
    $.ajax({
      url: "../Shared/retrieveuser_course.php",
      data: {cid: cid, versid:versid, remove_student:userid},
      type: "POST",
      success: function(data){
        var item = JSON.parse(data);
        $("#recipient").find('*').not(':first').remove();
        $("#recipient").append("<optgroup id='finishedStudents' label='Finished students'>"+
        "</optgroup>");
        $.each(item.finished_students, function(index,item) {
          $("#finishedStudents").append(`<option value=${item.uid}>${item.firstname}
          ${item.lastname}</option>`);
        });
        $("#recipient").append("<optgroup id='nonfinishedStudents' label='Non-finished students'>"+
        "</optgroup>");
        $.each(item.non_finished_students, function(index,item) {
          $("#nonfinishedStudents").append(`<option value=${item.uid}>${item.firstname}
          ${item.lastname}</option>`);
        });
        $(".selectLabels label input").attr("disabled", false);
        selectRecipients();
      },
      error:function(){
        console.log("*******Error user_course*******");
      }
    });
  }else{
    $("#recipient").prop("disabled", true);
  }
}

// Validate create announcement form
function validateCreateAnnouncementForm(){
  $("#announcementForm").submit(function(e){
    var announcementTitle = ($("#announcementTitle").val()).trim();
    var announcementMsg = ($("#announcementMsg").val()).trim();
    var cid = $("#cid").val();
    var versid = $("#versid").val();
    var recipients = $("#recipient").val();
    if (announcementTitle == null || announcementTitle == '') {
        $("#announcementTitle").addClass('errorCreateAnnouncement');
        e.preventDefault();
    }else if (announcementMsg == null || announcementMsg == '') {
        $("#announcementMsg").addClass('errorCreateAnnouncement');
        e.preventDefault();
    }else if (cid == null || cid == '') {
        $("#cid").addClass('errorCreateAnnouncement');
        e.preventDefault();
    }else if (versid == null || versid == '') {
        $("#versid").addClass('errorCreateAnnouncement');
        e.preventDefault();
    }else if (recipients == null || recipients == '') {
        $("#recipient").addClass('errorCreateAnnouncement');
        e.preventDefault();
    }
    $(".errorCreateAnnouncement").css({
      'border':'1px solid red'
    });
  });
}
function validateUpdateAnnouncementForm(){
  $("#announcementForm").submit(function(e){
    var announcementTitle = ($("#announcementTitle").val()).trim();
    var announcementMsg = ($("#announcementMsg").val()).trim();

    if (announcementTitle == null || announcementTitle == '') {
      $("#announcementTitle").addClass('errorCreateAnnouncement');
      e.preventDefault();
    }else if (announcementMsg == null || announcementMsg == '') {
      $("#announcementMsg").addClass('errorCreateAnnouncement');
      e.preventDefault();
    }
    $(".errorCreateAnnouncement").css({
      'border':'1px solid red'
    });
  });
}
// Retrive announcements
function retrieveAnnouncementsCards(){
  var currentLocation = $(location).attr('href');
  var url = new URL(currentLocation);
  var cid = url.searchParams.get("courseid");
  var versid = url.searchParams.get("coursevers");
  var uname = $("#userName").html();
  $.ajax({
    url: "../Shared/retrieveUserid.php",
    data: {uname:uname},
    type: "GET",
    success: function(data){
      var parsed_data = JSON.parse(data);
      var uid = parsed_data.uid;
     var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var parsed_data = JSON.parse(this.response);
          document.getElementById("announcementCards").innerHTML =
          parsed_data.retrievedAnnouncementCard;
          var unread_announcements = parsed_data.nRows;
          if(unread_announcements > 0){
            $("#announcement img").after("<span id='announcementnotificationcount'>0</span>");
            $("#announcementnotificationcount").html(parsed_data.nRows);
          }
          accessAdminAction();
          var paragraph = "announcementMsgParagraph";
          readLessOrMore(paragraph);
          showLessOrMoreAnnouncements();
          scrollToTheAnnnouncementForm();
          $(".deleteBtn").click(function(){
            sessionStorage.setItem('closeUpdateForm', true);

          });

        }
      };
      xmlhttp.open("GET","../Shared/retrieveAnnouncements.php?cid="+cid+
      "&versid="+versid+"&recipient="+uid,true);
      xmlhttp.send();
    }
  });
}
// Update anouncement form
function updateannouncementForm(updateannouncementid, cid, versid, tempFuction){
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        tempFuction(this, updateannouncementid, cid, versid);
    }
  };
  xmlhttp.open("GET","../Shared/updateAnnouncement.php?updateannouncementid="+
  updateannouncementid,true);
  xmlhttp.send();

}
function handleResponse(xhttp, updateannouncementid, cid, versid){
  var title, message;
  var parsed_data = JSON.parse(xhttp.response);
  title = parsed_data.title;
  message = parsed_data.message;
  if($("#announcementForm").is(":hidden")){
    $("#announcementForm").show();
  }
  $(".formTitle").html("Update announcement");
  $(".formSubtitle").html("Please fill in this form to update the announcement.");
  $("#announcementTitle").val(title);
  $("#announcementMsg").html(message);
  $(".createBtn").html("Update");
  $(".createBtn").attr("name", "updateBtn");
  $(".createBtn").attr("onclick", "validateUpdateAnnouncementForm()");
  $("#courseidAndVersid").remove();
  $("#recipientBox").remove();

  $("#announcementForm .announcementFormcontainer .clearfix")
  .before('<div><input type="hidden" name="updateannouncementid" id="updateannouncementid" value="'
  +updateannouncementid+'"></div>');
  $("#announcementForm .announcementFormcontainer .clearfix")
  .before('<div><input type="hidden" name="cid" id="cid" value="'+cid+'"></div>');
  $("#announcementForm .announcementFormcontainer .clearfix")
  .before('<div><input type="hidden" name="versid" id="versid" value="'+versid+'"></div>');


}

// Announcement card grid and list view
function displayListAndGrid(){
  $("#displayAnnouncements").prepend('<div id="btnContainer"><button class="btn listBtn">'+
  '<i alt="list icon" class="fa fa-bars"></i> List</button>'+
    '<button class="btn active gridBtn"><i alt="grid icon" class="fa fa-th-large">'+
    '</i> Grid</button></div><br>');

  var announcementCard = document.getElementsByClassName("announcementCard");
  var i;

  $(".listBtn").click(function(){
    for (i = 0; i < announcementCard.length; i++) {
      announcementCard[i].style.width = "100%";
    }
  });

  $(".gridBtn").click(function(){
    for (i = 0; i < announcementCard.length; i++) {
      announcementCard[i].style.width = "48%";
    }
  });

  var btnContainer = document.getElementById("btnContainer");
  var btns = btnContainer.getElementsByClassName("btn");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
  }

  $(window).resize(function() {
    if (($(window).width()) < 1050) {
      $(".gridBtn").removeClass("active");
      $(".listBtn").addClass("active");
    }else{
      $(".listBtn").removeClass("active");
      $(".gridBtn").addClass("active");
    }
  });
}
function accessAdminAction(){
  var adminLoggedin = $("#adminLoggedin").val();
  if(adminLoggedin == 'yes'){
    $("#announcementForm").add();
    $(".actionBtns").add();
  }else{
    $("#announcementForm").remove();
    $(".actionBtns").remove();
    if($("#announcementForm").is(":hidden") || ($("#announcementForm").length) == 0){
      $("#displayAnnouncements").css("margin-top", "0px");
    }else{
      $("#displayAnnouncements").css("margin-top", "20px");
    }
  }
}
function displayAnnouncementForm(reload){
  if ($("#updateannouncementid").length > 0) {
    location.reload();
    sessionStorage.setItem('closeUpdateForm', true);

  }else{
    $("#announcementForm").hide();
    sessionStorage.removeItem("closeUpdateForm");

  }

}
function displayAnnouncementBoxOverlay(){
  var closeUpdateForm = sessionStorage.getItem("closeUpdateForm");
  if(closeUpdateForm == 'true'){
    $("#announcementBoxOverlay").show();

  }
}
function scrollToTheAnnnouncementForm(){
  $(".editBtn").click(function() {
    $('html,body').animate({
        scrollTop: $("#announcementForm").offset().top},
        'slow');
  });
}
function closeActionLogDisplay(){
  $(".closeActionLogDisplay").parent().remove();
}
// Read less or more announcement card
function readLessOrMore(paragraph){
    var maxLength = 70;

    $("."+paragraph).each(function(){

      var myStr = $(this).text();

      if($.trim(myStr).length > maxLength){
        var newStr = myStr.substring(0, maxLength);
        var removedStr = myStr.substring(maxLength, $.trim(myStr).length);
        $(this).empty().html(newStr);
        $(this).append(' <a href="javascript:void(0);" class="read-more">read more...</a>');
        $(this).append('<span class="more-text">' + removedStr + '</span>');

      }

    });

    var announcementCard = document.getElementsByClassName("announcementCard");
    $(".read-more").click(function(){
      $(this).siblings(".more-text").contents().unwrap();
      $(this).remove();
      if(paragraph == 'announcementMsgParagraph'){
        for (i = 0; i < announcementCard.length; i++) {
          announcementCard[i].style.width = "100%";
        }
      }

    });
}

function showLessOrMoreAnnouncements(){
  var announcementCardLength = $(".announcementCard").length;
  if (announcementCardLength == 0) {
      $("#announcementCards").append("<p style='color:#775886;'>No announcements yet</p>");
  }else if(announcementCardLength > 6){
      $(".announcementCard:gt(5)").hide();
      $("#displayAnnouncements")
      .append('<div class="showmoreBtnContainer"><button class="showAllAnnouncement">'+
        '<span class="hvr-icon-forward"><span class="showmore">Show more</span>'+
        '<i class="fa fa-chevron-circle-right hvr-icon"></i></span>'+
        '</button></div>');
  }
   $('.showAllAnnouncement').on('click', function() {
    $('.announcementCard:gt(5)').toggle();
    $(".showmore").text() === 'Show more' ? $(".showmore").text('Show less') : $(".showmore").text('Show more');
  });

}
function updateReadStatus(announcementid, cid, versid){
  var uname = $("#userName").html();
  $.ajax({
    url: "../Shared/retrieveUserid.php",
    data: {uname: uname},
    type: "GET",
    success: function(data){
      var parsed_data = JSON.parse(data);
      var uid = parsed_data.uid;
      $.ajax({
        url: "../Shared/updateviewedAnnouncementCards.php",
        data: {announcementid : announcementid, uid : uid, cid : cid, versid : versid},
        type: "POST",
        success: function(data){
        }
      });
    }
  });

}
function selectRecipients(){
   $(".selectAll input").change(function() {
      if(this.checked) {
        $("#recipient option").not(":first").prop("selected", true);
        $("#recipient option").not(":first").attr("selected","selected");
        $(".selectFinished input, .selectNonFinished input").prop("checked", false);
      }else{
        $("#recipient option").attr("selected", false);
      }
  });
  $(".selectFinished input").change(function() {
    if(this.checked) {
      $("#finishedStudents option").prop("selected", true);
      $("#finishedStudents option").attr("selected","selected");
      $(".selectAll input, .selectNonFinished input").prop("checked", false);
      $("#nonfinishedStudents option").attr("selected", false);
    }else{
      $("#recipient option").attr("selected", false);
    }
  });
  $(".selectNonFinished input").change(function() {
    if(this.checked) {
      $("#nonfinishedStudents option").prop("selected", true);
      $("#nonfinishedStudents option").attr("selected","selected");
      $(".selectAll input, .selectFinished input").prop("checked", false);
      $("#finishedStudents option").attr("selected", false);

    }else{
      $("#recipient option").attr("selected", false);
    }
  });

}
function multiSelect(){
  $("#recipient").mousedown(function(e){
    e.preventDefault();

    var select = this;
    var scroll = select.scrollTop;

    e.target.selected = !e.target.selected;

    setTimeout(function(){select.scrollTop = scroll;}, 0);

    $(select).focus();
  }).mousemove(function(e){e.preventDefault()});
}
// Start of recent feedback from the teacher
function toggleFeedbacks(){
  let uname = $("#userName").html();
  let studentid, parsed_data, parsed_uid, duggaFeedback, feedbackComment, unseen_feedbacks;
  $.ajax({
    url: "../Shared/retrieveUserid.php",
    data: {uname:uname},
    type: "GET",
    success: function(data){
      parsed_uid = JSON.parse(data);
      studentid = parsed_uid.uid;
      $.ajax({
        url: "../Shared/retrieveFeedbacks.php",
        data: {studentid: studentid},
        type: "POST",
        async: true,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function(data){
          duggaFeedback = data.duggaFeedback;
          $(".feedbackContent").html(duggaFeedback);
          if ($(".recentFeedbacks").length == 0) {
             $(".feedbackContent").append("<p class='noFeedbacks'><span>There are no recent feedback to view.</span>"+
             "<span class='viewOldFeedbacks' onclick='viewOldFeedbacks();'>View old feedback</span></p>");
             $(".feedbackHeader").append("<span onclick='viewOldFeedbacks(); hideIconButton();' id='iconButton'>"+
             "<img src='../Shared/icons/oldFeedback.svg' title='Old feedbacks'></span>");
          }
          $(".oldFeedbacks").hide();
          feedbackComment = 'feedbackComment';
          readLessOrMore(feedbackComment);
          unseen_feedbacks = data.unreadFeedbackNotification;
          if(unseen_feedbacks > 0){
            $("#feedback img").after("<span id='feedbacknotificationcounter'>0</span>");
            $("#feedbacknotificationcounter").html(unseen_feedbacks);

          }
        },
        error:function(){
          console.log("Couldn't return feedback data");
        }

      });

    }

  });

  if ($("#feedback").length > 0) {
    $("header").after("<div id='feedbackOverlay'><div class='feedbackContainer'>"+
    "<div class='feedbackHeader'><span><h2>Recent Feedback</h2></span></div>"+
    "<div class='feedbackContent'></div></div></div>");

  }

  $("#feedback").click(function(){
    $("#feedbackOverlay").toggle();
     if ($("#feedbacknotificationcounter").length > 0) {
      var viewed = "YES";
      $.ajax({
        url: "../Shared/retrieveFeedbacks.php",
        data: {studentid: studentid, viewed:viewed},
        type: "POST",
        success: function(){
          $("#feedbacknotificationcounter").remove();
        }
      });
     }
  });
}
function viewOldFeedbacks(){
  $(".feedbackHeader h2").html("Old Feedback");
  $(".noFeedbacks").remove();
  $(".feedbackContent").append('<div id="loadMore"><span>Load More</span><div>');
  if ($(".feedback_card").length <= 5) {
     $("#loadMore").hide();
  }
  $(".feedback_card").slice(0, 5).show();
  $("#loadMore").on('click', function (e) {
    e.preventDefault();
    $(".feedback_card:hidden").slice(0, 5).slideDown();
    if ($(".feedback_card:hidden").length == 0) {
      $("#loadMore").hide();
    }
    $('html,body').animate({
      scrollTop: $(this).offset().top
    }, 1500);
  });
}
function hideIconButton(){
  $("#iconButton").hide();
}
// Checks if <a> link is external
function link_is_external(link_element) {
    return (link_element.host !== window.location.host);
}

// Replaces the link corresponding wtih the dropdown choices ---===######===--- with a link to errorpage instead
function replaceDefualtLink(){
  var links = document.getElementsByTagName('a');

  for(var i = 0; i < links.length; i++){
    if((links[i].getAttribute('href')) == ("showdoc.php?exampleid=---===######===---&courseid=" +
    querystring['courseid'] + "&coursevers=" +
    querystring['coursevers'] + "&fname=---===######===---")){
      links[i].href = "../errorpages/403.php";
    }
  }
}

// Adds classes to <a> element depending on if they are external / internal
function addClasses() {
  var links = document.getElementsByTagName('a');

  for (var i = 0; i < links.length; i++) {
    if(links[i].href.includes("github.com") || links[i].href.includes("youtube.com")){
      links[i].setAttribute('target', '_blank');}
    if ((links[i].innerHTML.toLowerCase().indexOf("example") !== -1) ||
    (links[i].innerHTML.toLowerCase().indexOf("exempel") !== -1) || (links[i].innerHTML.toLowerCase().indexOf("examples") !== -1)) {
      links[i].classList.add("example-link");
    } else if (link_is_external(links[i])) {
      links[i].classList.add("external-link");
    } else {
      links[i].classList.add("internal-link");
    }
  }
}

// Function for checking if a grace time exists and if the submition time is withing that grace time window
function hasGracetimeExpired(deadline, dateTimeSubmitted) {
  var m_dateTimeSubmitted = new Date(dateTimeSubmitted);
  var m_gracetime = new Date(deadline);
  var m_deadline = new Date(deadline);

  if ((m_deadline.getHours() >= 17) || (m_deadline.getDay() > 5)) {
    if (m_deadline.getDay() <= 4) {
      m_gracetime.setDate(m_deadline.getDate() + 1);
    }
    else if (m_deadline.getDay() == 5){
      m_gracetime.setDate(m_deadline.getDate() + 3);
    }
    else if (m_deadline.getDay() == 6){
      m_gracetime.setDate(m_deadline.getDate() + 2);
    }
      m_gracetime.setHours(8);
      m_gracetime.setMinutes(0);
      m_gracetime.setSeconds(0);
  }
  if (m_dateTimeSubmitted > m_gracetime) {
    return true;
  }
  else {
    return false;
  }
}

// ------ Validates all versionnames ------
function validateVersionName(versionName, dialogid) {
  //Regex for letters, numbers, and dashes
  //var Name = /^[A-Za-z0-9_ \-.]+$/;
  var Name = /^(HT|VT|ST){1}\d{2}$/;
  var name = document.getElementById(versionName);
  var x = document.getElementById(dialogid);
  var val = document.getElementById(versionName).value;

  //if versionname is 2 capital letters, 2 numbers
  if (val.match(Name)) {
    $(x).fadeOut();
    name.style.borderColor = "#383";
    name.style.borderWidth = "2px";

    //name.style.backgroundColor = "#fff";

    name.style.backgroundColor = backgroundColorTheme;

    //x.style.display = "none";
    if (versionName === 'versname') {
      window.bool3 = true;
    }
    if (versionName === 'eversname') {
      window.bool4 = true;
    }

    return true;
  } else {
    $(x).fadeIn();
    name.style.borderColor = "#E54";
    //name.style.backgroundColor = "#f57";
    //x.style.display = "block";
    name.style.borderWidth = "2px";

    if (versionName === 'versname') {
      window.bool3 = false;
    }
    if (versionName === 'eversname') {
      window.bool4 = false;
    }
    return false;
  }
}

// ------ Validate versionID ------
function validateCourseID(courseid, dialogid) {

  //regex numbers, letters and dashes, between 3 and 8 numbers
  var Code = /^[0-9]{3,8}$/;
  var code = document.getElementById(courseid);
  var x2 = document.getElementById(dialogid);
  var val = document.getElementById(courseid).value;

  if (val.match(Code)) {
    $(x2).fadeOut();
    code.style.borderColor = "#383";
    code.style.borderWidth = "2px";
    //code.style.backgroundColor = "#fff";

    code.style.backgroundColor = backgroundColorTheme;
    //x2.style.display = "none";
    window.bool = true;
  } else {
    $(x2).fadeIn();
    code.style.borderColor = "#E54";
    //code.style.backgroundColor = "#f57";
    code.style.borderWidth = "2px";
    //x2.innerHTML = "numbers, letters and dashes(between 3-8)";
    //x2.style.display = "block";
    window.bool = false;
    return false;
  }

  const versionIsValid = retdata["versions"].some(object => object.cid === retdata["courseid"] && object.vers === val);
  if(versionIsValid) {
    $(x2).fadeIn();
    code.style.borderColor = "#E54";
    //code.style.backgroundColor = "#f57";
    code.style.borderWidth = "2px";
    x2.innerHTML = "Version ID already exists, try another";
    //x2.style.display = "block";
    window.bool = false;
  }else{
    return true;
  }

  return false
}

function validateMOTD(motd,  syntaxdialogid, rangedialogid, submitButton){
  const saveButton = document.getElementById(submitButton);
  var emotd = document.getElementById(motd);
  var Emotd = /(^$)|(^[-a-zåäöA-ZÅÄÖ0-9_+§&%# ?!,.]*$)/;
  var EmotdRange = /^.{0,50}$/;
  var x4 = document.getElementById(syntaxdialogid);
	var x8 = document.getElementById(rangedialogid);
	if (emotd.value.match(Emotd) ) {
    $(x4).fadeOut()
		//x4.style.display = "none";
		window.bool9 = true;
  } else {
    $(x4).fadeIn()
		//x4.style.display = "block";
		window.bool9 = false;
  }

	if (emotd.value.match(EmotdRange)){
		$(x8).fadeOut()
		//x8.style.display = "none";
		window.bool9 = true;
	}else{
		$(x8).fadeIn()
		//x8.style.display = "block";
		window.bool9 = false;
	}
  if (emotd.value.match(Emotd) && emotd.value.match(EmotdRange) ){
    //emotd.style.backgroundColor = "#ffff";

    emotd.style.backgroundColor = backgroundColorTheme;
		emotd.style.borderColor = "#383";
		emotd.style.borderWidth = "2px";
		saveButton.disabled = false;
    return true;
	}else{
    //emotd.style.backgroundColor = "#f57";
		emotd.style.borderColor = "#E54";
		emotd.style.borderWidth = "2px";
		saveButton.disabled = true;
    return false;
	}
}

// ------ Validates that start date comes before end date ------
function validateDate(startDate, endDate, dialogID) {
  var sdate = document.getElementById(startDate);
  var edate = document.getElementById(endDate);
  var x3 = document.getElementById(dialogID);

  var date1 = new Date(sdate.value);
  var date2 = new Date(edate.value);

  // If one of the dates is not filled in
  if (sdate.value == 'yyyy-mm-dd' || sdate.value == "" || edate.value == 'yyyy-mm-dd' || edate.value == "") {
    sdate.style.borderColor = "#E54";
    edate.style.borderColor = "#E54";
    sdate.style.borderWidth = "2px";
    edate.style.borderWidth = "2px";
    //sdate.style.backgroundColor = "#f57";
    //edate.style.backgroundColor = "#f57";
    $(x3).fadeIn();
    x3.innerHTML = "Both start date and end date must be filled in";
    //x3.style.display = "block";
    return false;
  }
 // If start date is less than end date
  if (date1 < date2) {
    sdate.style.borderColor = "#383";
    edate.style.borderColor = "#383";
    sdate.style.borderWidth = "2px";
    edate.style.borderWidth = "2px";
    //sdate.style.backgroundColor = "#fff";
    //edate.style.backgroundColor = "#fff";

    sdate.style.backgroundColor = backgroundColorTheme;
    edate.style.backgroundColor = backgroundColorTheme;
    $(x3).fadeOut();
    //x3.style.display = "none";
    if (startDate === 'startdate' && endDate === 'enddate') {
      window.bool5 = true;
    }
    if (startDate === 'estartdate' && endDate === 'eenddate') {
      window.bool6 = true;
    }
    return true;
  }
  // If end date is less than start date
  if (date2 < date1) {
    sdate.style.borderColor = "#E54";
    edate.style.borderColor = "#E54";
    //sdate.style.backgroundColor = "#f57";
    //edate.style.backgroundColor = "#f57";
    $(x3).fadeIn();
    x3.innerHTML = "Start date has to be before end date";
    //x3.style.display = "block";
    sdate.style.borderWidth = "2px";
    edate.style.borderWidth = "2px";
    if (startDate === 'startdate' && endDate === 'enddate') {
      window.bool5 = false;
    }
    if (startDate === 'estartdate' && endDate === 'eenddate') {
      window.bool6 = false;
    }
    return false;
  }
}

function showCourseDate(ddate, dialogid){
  var isCorrect = validateDate2(ddate,dialogid);
  var startdate = convertDateToDeadline(new Date(retdata['startdate'])).split(" ")[0];
  var enddate = convertDateToDeadline(new Date(retdata['enddate'])).split(" ")[0];

  if (!$("#absolutedeadlinecheck").is(":checked")) {
    rDate = /^[0:]+$/.test(convertDateToDeadline(calculateRelativeDeadline()).split(" ")[1]) ? convertDateToDeadline(calculateRelativeDeadline()).split(" ")[0] : convertDateToDeadline(calculateRelativeDeadline());
    str = "The relative deadline will be set to ";
    str += !retdata['startdate'] ? formatRelativeDeadlineToString(getRelativeDeadlineInputValues()) : rDate;
  } else {
    if ( !retdata['startdate']) {
      $(ddate).val("");
      str = "There is no course start date, please add one or use relative deadlines.";
    } else {
      str = "The absolute deadline date has to be between " + startdate + " and " + enddate;
    }
  }
  $("#dialog8").html(str);
  return isCorrect;
}

// ------ Validates if deadline is between start and end date ------
function validateDate2(ddate, dialogid) {
  var inputDeadline = document.getElementById("inputwrapper-deadline");
  if (window.getComputedStyle(inputDeadline).display !== "none") {

  var ddate = document.getElementById(ddate);
  var deadlinehours = document.getElementById("deadlinehours");
  var deadlineminutes = document.getElementById("deadlineminutes");
  var x = document.getElementById(dialogid);
  var deadline = new Date(ddate.value);
  deadline.setHours(deadlinehours.options[deadlinehours.selectedIndex].value, deadlineminutes.options[deadlineminutes.selectedIndex].value);
  // Dates from database
  var startdate = new Date(retdata['startdate']);
  var enddate = new Date(retdata['enddate']);


  // If deadline is between start date and end date
  if (startdate <= deadline && enddate >= deadline && retdata['startdate'] && $("#absolutedeadlinecheck").is(":checked")) {
    ddate.style.borderColor = "#383";
    ddate.style.borderWidth = "2px";
    ddate.style.backgroundColor = backgroundColorTheme;
    $(x).fadeOut();
    //x.style.display = "none";
    window.bool8 = true;

    return true;
  } else if (!$("#absolutedeadlinecheck").is(":checked")) {
    // If absolute deadline is not being used
    $(x).fadeIn();
    ddate.style.borderWidth = "2px";
    ddate.style.backgroundColor = backgroundColorTheme;
    ddate.style.borderColor = "#aaa";
    // x.style.display = "block";
    window.bool8 = true;
    return true;

  } else {
    $(x).fadeIn();
    ddate.style.borderColor = "#E54";
    ddate.style.backgroundColor = "#f57";
    //x.style.display = "block";
    ddate.style.borderWidth = "2px";
    window.bool8 = false;
    }
  }
  else{
    window.bool8 = true;
  }
  return false;
}

function validateSectName(name){
  var emotd = document.getElementById(name);
  var tooltipTxt = document.getElementById("dialog10");
  tooltipTxt.style.left = 50 + "px";
  tooltipTxt.style.top = -50 + "px";
  emotd.style.borderWidth = "2px";
  // Valid string
  if (emotd.value.match(/^[A-Za-zÅÄÖåäö\s\d():_-]+$/)) {
    emotd.style.borderColor = "#383";
    emotd.style.borderWidth = "2px";
    emotd.style.backgroundColor = backgroundColorTheme;
    $('#dialog10').fadeOut();
    window.bool10 = true;
    return true;
  } else { // Invalid string
    emotd.style.borderColor = "#E54";
    emotd.style.backgroundColor = "#f57";
    emotd.style.borderWidth = "2px";
    window.bool10 = false;
    $('#dialog10').fadeIn();
    return false;
  }
}

// ------ Recursive functions to retrieve the deepest DOM element ------
function unNestElement(node){
  if(node == null)
    return;
  if(node.firstChild == null){
    return node;
  }
  return unNestElement(node.firstChild);
}

function unNestElements(htmlArray){
  let array = [];
  for(var i = 0; i<htmlArray.length; i++){
      var e = unNestElement(htmlArray[i]);
      if(e != undefined)
        array.push(e.textContent);
  }
  return array;
}

function removeGrade(string){
  var str1 = "(U-G)";
  var str2 = "(U-G-VG)";
  var array = string.split(" ");
  var result = [];
  for(var i = 0; i<array.length; i++){
    if(array[i] != str1 && str2){
      result.push(array[i]);
    }
  }
  result = result.join(' ');
  result = result.slice(0, -1);
  return result;
}

// ------ Write a function which gets all anchor elements of class "internal-link" ------
function getCourseElements(){
  let list = [];
  var duggor = Array.from(document.getElementsByClassName("ellipsis nowrap"));
  var rubriker = Array.from(document.getElementsByClassName("ellipsis listentries-span"));
  duggor = unNestElements(duggor);
  rubriker = unNestElements(rubriker);
  for(var i=0; i<duggor.length; i++){
    var e = duggor[i];
    list.push(e);
  }
  for(var i=0; i<rubriker.length; i++){
    var e = removeGrade(rubriker[i]);
    list.push(e);
  }
  return list;
}
//Validate form but do not perform it.
function quickValidateForm(formid, submitButton){
  const saveButton = document.getElementById(submitButton);
  var valid = true;
  //Validates Item form
  if (formid === 'editSection') {
    var sName = document.getElementById("sectionname").value;
    var deadDate = document.getElementById("setDeadlineValue").value;
    var item = document.getElementById("editSectionDialogTitle").innerHTML;
    var endialog = document.getElementById("EndDialog1");
    endialog.innerHTML = "";
    valid = true;
    var deadlinepart = document.getElementById('inputwrapper-deadline');
    var deadlinedisplayattribute = deadlinepart.style.display;
    valid = valid && validateSectName('sectionname');

    // Validates Deadline
    if (deadlinedisplayattribute != 'none'){
      valid = valid && showCourseDate('setDeadlineValue','dialog8');
    }


    //If fields empty
    if (sName == null || sName == "") {
      //alert("Fill in all fields");
      //endialog.innerHTML += "Fill in all fields </br>";
      valid = false;
    }

    //Name is a duplicate
    if(sName == item){
      window.bool11 = true;

    }

    if (valid){
      saveButton.disabled = false;
    }else{
      saveButton.disabled = true;
    }
  }
   //Validates new course version form
  if (formid === 'newCourseVersion') {
    var versName = document.getElementById("versname").value;
    var versId = document.getElementById("cversid").value;
    var endialog = document.getElementById("EndDialog2");
    endialog.innerHTML = "";
    valid = true;
    //Compilator is stupid. Cannot use one bool. Does not execute other methods if bool is already false.
    valid2 = true;
    valid3 = true;
    valid4 = true;


    valid = (valid && validateCourseID('cversid', 'dialog2'));

    //valid = (valid && validateVersionName('versname', 'dialog')); >:|
    valid2 = (valid2 && validateVersionName('versname', 'dialog'));

    valid3 = (valid3 && validateDate('startdate','enddate','dialog3'));

    valid4 = (valid4 && validateMOTD('vmotd','dialog4', 'dialog42', 'submitCourseMotd'));

    valid = valid && valid2 && valid3 && valid4

     //If fields empty
     if (versName == null || versName == "", versId == null || versId == "") {
      //alert("Fill in all fields");
      //endialog.innerHTML += "Fill in all fields </br>";
      valid = false;
    }

    if (valid){
      saveButton.disabled = false;
    }else{
      saveButton.disabled = true;
    }
  }

  // validates edit course version form
  if (formid === 'editCourseVersion') {
    var eversName = document.getElementById("eversname").value;
    var endialog = document.getElementById("EndDialog3");
    endialog.innerHTML = "";
    valid = true;

    valid = valid && validateVersionName('eversname', 'dialog5')
    valid = valid && validateDate('estartdate','eenddate','dialog6')
    valid = valid && validateMOTD('eMOTD', 'dialog9', 'dialog92', 'submitEditCourse')

    //If fields empty
    if (eversName == null || eversName == "") {
      //alert("Fill in all fields");
      //endialog.innerHTML += "Fill in all fields </br>";
      valid = false;
    }


    if (valid){
      saveButton.disabled = false;
    }else{
      saveButton.disabled = true;
    }
  }

}


/*Validates all forms*/

function validateForm(formid) {

  // Validates Item form
  if (formid === 'editSection') {
    var sName = document.getElementById("sectionname").value;
    var deadDate = document.getElementById("setDeadlineValue").value;
    var item = document.getElementById("editSectionDialogTitle").innerHTML;

    // If fields empty
    if (sName == null || sName == "") {
      alert("Fill in all fields");

    }

    //Name is a duplicate
    if(sName == item){
      window.bool11 = true;
    }
    else if(getCourseElements().indexOf(sName) >= 0){
      window.bool11 = false;
      alert('Name already exists, choose another one');
    }else{
      window.bool11 = true;
    }

    // if all information is correct
    if (window.bool10 == true && window.bool11 == true) {
      //delay added so that the loading process works correctly.
      setTimeout(function(){
      updateItem();
      updateDeadline();
      },10);
      //Toggle for alert when update a item
      var element = document.getElementById("updateAlert");
      element.classList.toggle("createAlertToggle");
      //Set text for the alert when update a item
      document.getElementById("updateAlert").innerHTML = "The item is now updated!";
      //Add class to element so it will be highlighted.
      setTimeout(function(){
        var element = document.getElementById('I'+updatedLidsection).firstChild;
        if(element.tagName == 'DIV') {
        element = element.firstChild;
        element.classList.add("highlightChange");
        }else if (element.tagName == 'A'){
          document.getElementById('I'+updatedLidsection).classList.add("highlightChange");
        }else if (element.tagName == 'SPAN'){
          document.getElementById('I'+updatedLidsection).firstChild.classList.add("highlightChange");
        }
      },200);
      //Duration time for the alert before remove
      setTimeout(function(){
        $("#updateAlert").removeClass("createAlertToggle");
        document.getElementById("updateAlert").innerHTML = "";
      },3000);
    } else {
      alert("You have entered incorrect information");
    }
  }
   //Validates new course version form
  if (formid === 'newCourseVersion') {
    var versName = document.getElementById("versname").value;
    var versId = document.getElementById("cversid").value;

    //If fields empty
    if (versName == null || versName == "", versId == null || versId == "") {
      alert("Fill in all fields");

    }
    // If all information is correct
    if (window.bool5 === true && window.bool3 === true && window.bool === true) {
      alert('New version created');
      createVersion();
      $('#newCourseVersion input').val("");

    } else {
      alert("You have entered incorrect information");
    }
  }

  // Validates edit course version form
  if (formid === 'editCourseVersion') {
    var eversName = document.getElementById("eversname").value;

    // If fields empty
    if (eversName == null || eversName == "") {
      alert("Fill in all fields");

    }

    // If all information is correct
    if (window.bool4 === true && window.bool6 === true && window.bool9 === true) {
      alert('Version updated');
      updateVersion();
      resetMOTDCookieForCurrentCourse();
    } else {
      alert("You have entered incorrect information");
    }
  }
}

//------------------------------------------------------------------------------
// This method is to be used to check if a code example should re-fetch the
// contents of a code example based on eventual changes in external github-repo
//------------------------------------------------------------------------------
async function refreshCodeExample(exampelid) {
  console.log("Should try to refresh a code example (check if re-fetching from external github repo is necessary)");
  AJAXService("REFGIT", {exampelid : exampelid});
}

//------------------------------------------------------------------------------
// Displays dialogue box and the content
//------------------------------------------------------------------------------
function showUserFeedBack(lid,feedbackquestion) {
	AJAXService("GETUF", { courseid: querystring['courseid'], moment: lid }, "USERFB");
  $("#userFeedbackDialog").css("display", "flex");
  $("#feedbacktablecontainer").html("");
  $("#statscontainer").css("display", "none");
  $("#duggaFeedbackQuestion").html(feedbackquestion);
}

//------------------------------------------------------------------------------
// Returns the feedbackdata and displays the feedback and statistics.
//------------------------------------------------------------------------------
function returnedUserFeedback(data){
  if(data.userfeedback.length == 0){
    $("#feedbacktablecontainer").html( "<p>No feedback available</p>" );
  }else{
    $("#statscontainer").css("display", "flex");
    var averagerating = parseFloat(data.avgfeedbackscore);
    var highestscore = 0;
    var lowestscore = 10;
    for(var i = 0; i<data.userfeedback.length; i++){
      if(parseInt(data.userfeedback[i].score) > highestscore){
        highestscore=data.userfeedback[i].score;

      }
      if(parseInt(data.userfeedback[i].score) < lowestscore){
        lowestscore=data.userfeedback[i].score;
      }
    }
    $("#avg-feedback").html(averagerating.toFixed(2));
    $("#median-feedback").html(highestscore+" / "+lowestscore);
    $("#total-feedback").html(data.userfeedback.length);
    $("#feedbacktablecontainer").html(createUserFeedbackTable(data));
  }

}
//------------------------------------------------------------------------------
// Creates a table with the Feedback data.
//------------------------------------------------------------------------------
function createUserFeedbackTable(data){
  var str = "<table id='feedbacktable'  style='border-collapse: collapse' class='list'>";
  str += "<thead><tr><th>Feedback ID</th>";
  str += "<th>Username</th>";
  str += "<th>Course ID</th>";
  str += "<th>Dugga ID</th>";
  str += "<th>Rating</th>";
  str += "<th>Contact student</th></tr></thead><tbody style='background-color: var(--color-background)'>";

  for(var i = 0; i < data.userfeedback.length; i++){
    str +="<tr>";
    str += "<td>"+data.userfeedback[i].ufid+"</td>";
    if(data.userfeedback[i].username === null){
      str += "<td>Anonymous</td>";
    }else{
      str += "<td>"+data.userfeedback[i].username+"</td>";
    }
    str += "<td>"+data.userfeedback[i].cid+"</td>";
    str += "<td>"+data.userfeedback[i].lid+"</td>";
    str += "<td style='font-weight: bold; font-size: 18px;'>"+data.userfeedback[i].score+"</td>";
    if(data.userfeedback[i].username === null){
      str += "<td style='width:1px;'><input class='inactive-button' type='button' value='Contact student'></td>";
    }else{
      str += `<td style='width:1px;'><input class='submit-button' type='button' value='Contact student'
      onclick='contactStudent(\"${data.userfeedback[i].entryname}\",\"${data.userfeedback[i].username}\")'></td>`;
    }
    str += "</tr>";
  }

  str += "</tbody></table>";
  return str;
}

//------------------------------------------------------------------------------
// Opens an email to the student
//------------------------------------------------------------------------------
function contactStudent(entryname,username){

  window.location = "mailto:" + username +
  "@student.his.se?Subject=Kontakt%20angående%20din%20feedback%20på%20dugga "+entryname;
}
//------------------------------------------------------------------------------
// Displays the feedback question input on enable-button toggle.
//------------------------------------------------------------------------------
function showFeedbackquestion(){
  if($("#fdbck").prop('checked')){
    $("#inputwrapper-FeedbackQuestion").css("display","block");
  }else{
    $("#inputwrapper-FeedbackQuestion").css("display","none");
  }
}
