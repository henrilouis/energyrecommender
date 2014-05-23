<?php

	require 'medoo.min.php';

	$database = new medoo();
	
	$data = $database->insert("userSetQuestions",array(

			"userId" 		=> $_POST['userId'],
			"questionId" 	=> $_POST['questionId'],
			"answer"		=> $_POST['answer']
			
	));

?>