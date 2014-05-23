<?php

	require 'medoo.min.php';

	$database = new medoo();
	
	$data = $database->insert("userMeasureRecommendations",array(

			"userId" 		=> $_POST['userId'],
			"measureId"		=> $_POST['measureId'],
			"position"		=> $_POST['position']

	));

?>