var sessionkind=0;
var querystring=parseGet();
var filez;

AJAXService("GET",{cid:querystring['cid']},"FILE");

$(function() {
  $( "#release" ).datepicker({dateFormat: "yy-mm-dd"});
    $( "#deadline" ).datepicker({dateFormat: "yy-mm-dd"});
});

//----------------------------------------
// Commands:
//----------------------------------------

function closeEditFile()
{
		$("#editFile").css("display","none");
}

function deleteFile(fileid,filename){
		if(confirm("Do you really want to delete the file/link: "+filename)){
				AJAXService("DELFILE",{fid:fileid,cid:querystring['cid']},"FILE");
		}
}

function createLink()
{
		$("#editFile").css("display","block");
		$("#filey").css("display","none");
		$("#linky").css("display","block");
		$("#selecty").css("display","none");

		$("#kind").val("LINK");
		$("#cid").val(querystring['cid']);
		$("#coursevers").val(querystring['coursevers']);
		
				
}

function createFile(kind)
{
		if(kind=="MFILE"){
				var str="<option>NONE</option>";
				for(i=0;i<filez['lfiles'].length;i++){
						var item=filez['lfiles'][i];
						if(item!=".."&&item!=".") str+="<option>"+item+"</option>";
				}
				$("#selectedfile").html(str);
				$("#selecty").css("display","block");				
		}else if(kind=="GFILE"){
				var str="<option>NONE</option>";
				for(i=0;i<filez['gfiles'].length;i++){
						var item=filez['gfiles'][i];
						if(item!=".."&&item!=".") str+="<option>"+item+"</option>";
				}
				$("#selectedfile").html(str);		
				$("#selecty").css("display","block");				
		}else if(kind=="LFILE"||kind=="LINK"){
				$("#selecty").css("display","none");				
		}

		$("#editFile").css("display","block");
		$("#filey").css("display","block");
		$("#linky").css("display","none");
		if(kind!="LFILE") $("#selecty").css("display","block");

		$("#kind").val(kind);
		$("#cid").val(querystring['cid']);
		$("#coursevers").val(querystring['coursevers']);
}

function showLoginPopup()
{
		$("#loginBox").css("display","block");
		$("#overlay").css("display","block");
}

function hideLoginPopup()
{
		$("#loginBox").css("display","none");
		$("#overlay").css("display","none");
}

//----------------------------------------
// Renderer
//----------------------------------------
function returnedFile(data)
{

		filez = data;
		// Fill section list with information
		str1="";
		str2="";
		str3="";
		str4="";
			str1+="<table class='list' style='margin-bottom:8px;' >";

				str1+="<tr><th class='first' style='width:64px;'>ID</th><th>Link URL</th><th style='width:30px' class='last'></th></tr>";

		if (data['entries'].length > 0) {
				for(i=0;i<data['entries'].length;i++){
						var item=data['entries'][i];
						if(parseInt(item['kind'])==1){
								str1+="<tr class='fumo'>";
		
								str1+="<td>"+item['fileid']+"</td>";
								str1+="<td>"+item['filename']+"</td>";
								str1+="<td style='padding:4px;'>";
										str1+="<img id='dorf' style='float:right;margin-right:4px;' src='../Shared/icons/Trashcan.svg' ";
										str1+=" onclick='deleteFile(\""+item['fileid']+"\",\""+item['filename']+"\");' >";
								str1+="</td>";
								str1+="</tr>";

						}
				}

			str1+="</table>";

				//------------------------------------------------------------------------------------------------------------------------
				str2+="<table class='list' style='margin-bottom:8px;' >";

				str2+="<tr><th class='first' style='width:64px;'>ID</th><th>Global File</th><th style='width:30px' class='last'></th></tr>";

				
				for(i=0;i<data['entries'].length;i++){
						var item=data['entries'][i];
						if(parseInt(item['kind'])==2){
								str2+="<tr class='fumo'>";
		
								str2+="<td>"+item['fileid']+"</td>";
								str2+="<td>"+item['filename']+"</td>";
								str2+="<td style='padding:4px;'>";
										str2+="<img id='dorf' style='float:right;margin-right:4px;' src='../Shared/icons/Trashcan.svg' ";
										str2+=" onclick='deleteFile(\""+item['fileid']+"\",\""+item['filename']+"\");' >";
								str2+="</td>";
								str2+="</tr>";

						}
				}
					str2+="</table>";
				//------------------------------------------------------------------------------------------------------------------------
					str3+="<table class='list' style='margin-bottom:8px;' >";

				str3+="<tr><th class='first' style='width:64px;'>ID</th><th>Course Local File</th><th style='width:30px' class='last'></th></tr>";
				for(i=0;i<data['entries'].length;i++){
						var item=data['entries'][i];
						if(parseInt(item['kind'])==3){
								str3+="<tr class='fumo'>";
		
								str3+="<td>"+item['fileid']+"</td>";
								str3+="<td>"+item['filename']+"</td>";
								str3+="<td style='padding:4px;'>";
										str3+="<img id='dorf' style='float:right;margin-right:4px;' src='../Shared/icons/Trashcan.svg' ";
										str3+=" onclick='deleteFile(\""+item['fileid']+"\",\""+item['filename']+"\");' >";
								str3+="</td>";
								str3+="</tr>";
						}
				}
				
				str3+="</table>";
					str4+="<table class='list' style='margin-bottom:8px;' >";

				str4+="<tr><th class='first' style='width:64px;'>ID</th><th>Local File</th><th style='width:30px' class='last'></th></tr>";
				for(i=0;i<data['entries'].length;i++){
						var item=data['entries'][i];
						if(parseInt(item['kind'])==4){
								str4+="<tr class='fumo'>";
		
								str4+="<td>"+item['fileid']+"</td>";
								str4+="<td>"+item['filename']+"</td>";
								str4+="<td style='padding:4px;'>";
										str4+="<img id='dorf' style='float:right;margin-right:4px;' src='../Shared/icons/Trashcan.svg' ";
										str4+=" onclick='deleteFile(\""+item['fileid']+"\",\""+item['filename']+"\");' >";
								str4+="</td>";
								str4+="</tr>";
						}
				}
				str4+="</table>";
				
				
		var alllinks=document.getElementById("alllinks");
		alllinks.innerHTML=str1;
		/*                                         */
		var allglobalfiles=document.getElementById("allglobalfiles");
		allglobalfiles.innerHTML=str2;
		/*                                         */
		var allcoursefiles=document.getElementById("allcoursefiles");
		allcoursefiles.innerHTML=str3;
		/*                                         */
		var alllocalfiles=document.getElementById("alllocalfiles");
		alllocalfiles.innerHTML=str4;
	/*                                         */
		}else{

		}


	  if(data['debug']!="NONE!") alert(data['debug']);

}

