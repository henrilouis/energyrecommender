<?php

	require 'medoo.min.php';

	$database = new medoo();

	$data = $database->update("users",array(

			"ability" 		=> $_POST['ability'],
			"email"			=> $_POST['email'],
			"interested" 	=> $_POST['interested']
	),
	array(
			"id"			=> $_POST['id']
	));

?>