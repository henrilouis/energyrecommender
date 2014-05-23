<?php

	require 'medoo.min.php';

	$database = new medoo();

	$max = $database->max("users",'id');
	
	$data = $database->insert("users",array(

			"id"			=> $max+1,
			"condition" 	=> $_POST['condition'],
			
	));
	
	echo $max+1;

?>