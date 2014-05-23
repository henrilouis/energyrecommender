<?php

	require 'medoo.min.php';

	$database = new medoo();

	$data = $database->select("measures","*");

	echo json_encode($data);

?>