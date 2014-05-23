<?php

	require 'medoo.min.php';

	$database = new medoo();

	$data = $database->select("setQuestions","*");

	echo json_encode($data);

?>