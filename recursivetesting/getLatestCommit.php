<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
	<script>
		// Get url from db/courseGitURL instead of hardcoding
		//var url = 'https://github.com/HGustavs/LenaSYS';
		//var urledit = url.replace('.git', ''); //remove ending

			
	</script>
</head>
<body>
	<?php 

		// Get the contents of the HTML page
		$html = file_get_contents("https://github.com/HGustavs/LenaSYS"); // Fails to load latest commit unless clearing cache on reload
		
		// Parse the HTML with DOM document 
		$dom = new DomDocument;
		$dom->preserveWhiteSpace = FALSE;
		$dom->loadHTML($html);

		$xpath = new DOMXPath($dom);

		$resource = $xpath->query("//div/a[@class='link--secondary']")->item(0);

		echo $resource->textContent;

		echo print_r($resource);
	?>
</body>
</html>