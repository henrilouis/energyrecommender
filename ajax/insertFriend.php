<?php

	require 'medoo.min.php';

	$database = new medoo();
	
	$data = $database->insert("friends",array(

			"id" 					=> $_POST['friendId'],
			"name"					=> $_POST['friendName'],

	));

	$data2 = $database->insert("userFriends",array(

			"facebookId" 				=> $_POST['facebookId'],
			"friendId"					=> $_POST['friendId'],
			//"score" 					=> $_POST['score'],

	));


?>