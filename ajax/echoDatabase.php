<?php

	require 'medoo.min.php';

	$database = new medoo();
	
	/*****************************************
			Script to echo the DB
	*****************************************/
	
	function echoTable( $name, $database ){

		$data = $database->select($name,"*");
	
		echo "<h2>".$name."</h2>";
		echo "<table>";
		echo "<tr>";
		foreach ( $data[0] as $key => $value ){
			echo "<td>".$key."</td>";
		}
		echo "</tr>";

		foreach ( $data as $key => $value ){
			echo "<tr>";
			foreach ($value as $k => $v) {
				echo "<td>".$v."</td>";
			}
			echo "</tr>";
		}

		echo "</table>";
	}

	echoTable( "measures",$database );
	echoTable( "newMeasures",$database );
	echoTable( "measureQuestions",$database );
	echoTable( "setQuestions",$database );
	echoTable( "users",$database );
	echoTable( "userMeasure",$database );
	echoTable( "userNewMeasure",$database );
	echoTable( "userMeasureQuestions",$database );
	echoTable( "userMeasureRecommendations",$database );
	echoTable( "userSetQuestions",$database );

	echoTable( "friends",$database );
	echoTable( "userFriends",$database );
	
?>