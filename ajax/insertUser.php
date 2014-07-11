<?php

	require 'medoo.min.php';

	$database = new medoo();

	$max = $database->max("users",'id');
	
	$data = $database->insert("users",array(

			"id"			=> $max+1,
			"facebookId"	=> $_POST['facebookId'],
			"email"			=> $_POST['email'],
			"gender"		=> $_POST['gender'],
			"condition" 	=> $_POST['condition'],
			"userAgent"		=> $_POST['userAgent'],
			"referrer"		=> $_POST['referrer']
			
	));
	
	echo $max+1;

?>