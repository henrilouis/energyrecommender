<?php

	require 'medoo.min.php';

	$database = new medoo();

	$data = $database->select("measureQuestions","*");

	echo json_encode($data);

?>