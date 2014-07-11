<?php

	require 'medoo.min.php';

	$database = new medoo();

	/*****************************************
			Script to echo the DB
	*****************************************/

	function echoUser( $database ){

		// get al the data with the database calls
		$measures 			= $database->select( "measures" , "*" );
		$user 				= $database->select( "users" , "*" );
		$setQuestions 		= $database->select( "setQuestions" , "*" );
		$userSetQuestions 	= $database->select( "userSetQuestions","*" );
		$userSetQuestions 	= array_sort($userSetQuestions, 'questionId', SORT_ASC);

		// Create the table headings
		echo "<h1>PER USER</h1>";
		echo "<table>";
		echo "<tr>";
		foreach ( $user[0] as $key => $value ){
			echo "<td>".$key."</td>";
		}
		// Extra echo for chosen difficulty
		echo "<td>chosenDifficulty</td>";
		foreach ( $setQuestions as $key => $value ){
			echo "<td>setQuestion".$value['id']."</td>";
		}
		echo "</tr>";

		foreach ( $user as $key => $value ){
			echo "<tr>";

			// echo for the user columns
			foreach ($value as $k => $v) {
				if($k == "ability"){
					echo "<td>".number_format($v,2,",","")."</td>";
				}else{
					echo "<td>".$v."</td>";
				}
				
			}

			// Extra echo for chosen difficulty
			foreach($measures as $k => $v) {
				if( $v['id'] == $value['chosenId'] ){
					echo "<td>".number_format($v['difficulty'],2,",","")."</td>";
				}
			}

			// echo for the set question columns
			foreach ($userSetQuestions as $k => $v) {
				if( $v['userId'] == $value['id'] ){
					echo "<td>".$v['answer']."</td>";
				}	
			}
			echo "</tr>";
		}
		echo "</table>";
	}

	function echoUserMeasure( $database ){

		// get al the data with the database calls
		$measures 					= $database->select( "measures" , "*" );
		$user 						= $database->select( "users" , "*" );
		$userMeasureQuestions		= $database->select( "userMeasureQuestions" , "*" );
		$userMeasureRecommendations	= $database->select( "userMeasureRecommendations" , "*" );

		// Create the table headings
		echo "<h1>PER USERMEASUREQUESTION</h1>";
		echo "<table>";
		echo "<tr>";
		echo "<td>id</td><td>measureId</td><td>difficulty</td><td>userId</td><td>gender</td><td>condition</td><td>ability</td><td>rating</td><td>doing</td><td>position</td>";
		echo "</tr>";

		foreach( $userMeasureQuestions as $key => $value ){

			if($value['questionId'] == 1){

				echo "<tr>";

				echo "<td>".$value['id']."</td>";
				echo "<td>".$value['measureId']."</td>";
				
				echo "<td>";
				foreach( $measures as $k => $v ){
					if( $value['measureId'] == $v['id'] ){
						echo number_format($v['difficulty'],2,",","");
					}
				}
				echo "</td>";

				echo "<td>".$value['userId']."</td>";
				foreach( $user as $k => $v ){
					if( $value['userId'] == $v['id'] ){
						echo "<td>".$v['gender']."</td>";
						echo "<td>".$v['condition']."</td>";
						echo "<td>".number_format($v['ability'],2,",","")."</td>";
					}
				}
				echo "<td>".$value['answer']."</td>";

				echo "<td>";
				foreach( $userMeasureQuestions as $k => $v ){
					if( $v['questionId'] == 2 && $value['measureId'] == $v['measureId'] && $value['userId'] == $v['userId']  ){
						echo $v['answer'];
					}
				}
				echo "</td>";

				echo "<td>";
				foreach( $userMeasureRecommendations as $k => $v ){
					if( $value['userId'] == $v['userId'] && $value['measureId'] == $v['measureId'] ){
						echo $v['position'];
					}
				}
				echo "</td>";

				echo "</tr>";

			}

			
		}
		echo "</table>";
	}
	
	function array_sort($array, $on, $order=SORT_ASC)
	{
	    $new_array = array();
	    $sortable_array = array();

	    if (count($array) > 0) {
	        foreach ($array as $k => $v) {
	            if (is_array($v)) {
	                foreach ($v as $k2 => $v2) {
	                    if ($k2 == $on) {
	                        $sortable_array[$k] = $v2;
	                    }
	                }
	            } else {
	                $sortable_array[$k] = $v;
	            }
	        }

	        switch ($order) {
	            case SORT_ASC:
	                asort($sortable_array);
	            break;
	            case SORT_DESC:
	                arsort($sortable_array);
	            break;
	        }

	        foreach ($sortable_array as $k => $v) {
	            $new_array[$k] = $array[$k];
	        }
	    }

	    return $new_array;
	}

	echoUser( $database );
	echoUserMeasure( $database );

	/*------------------------*\

		A LITTLE STYLING

	\*------------------------*/	

	$css = "
		table{
			width: 100%;
		}
		tr:nth-child(even){
			background: #efefef;
		}

		tr:nth-child(odd){
			background: #ffffff;
		}
		td{
			max-width: 120px;
			
			overflow: hidden;
		}
		";
		
	echo "<style>".$css."</style>";
?>