<?php

	require 'medoo.min.php';

	$database = new medoo();

	$data = $database->select("newMeasures","*");

	echo json_encode($data);

?>