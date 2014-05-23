<?php

	require 'medoo.min.php';

	$database = new medoo();


	$data = $database->insert("userMeasureQuestions",array(

			"userId" 		=> $_POST['userId'],
			"measureId" 	=> $_POST['measureId'],
			"questionId" 	=> $_POST['questionId'],
			"answer"		=> $_POST['answer']
			
	));

?>