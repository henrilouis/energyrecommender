<?php

	require 'medoo.min.php';

	$database = new medoo();
	
	$data = $database->insert("userMeasure",array(

			"userId" 				=> $_POST['userId'],
			"measureId"				=> $_POST['measureId'],
			"currentAbility" 		=> $_POST['currentAbility'],
			"abilityChange"			=> $_POST['abilityChange']

	));

?>