<?php

	require 'medoo.min.php';

	$database = new medoo();

	$data = $database->select("userMeasureQuestions","*");

	echo json_encode($data);

?>