var RashRecommenderModel = function(){

	/***********************************************************
							 Options
	***********************************************************/

	// These options should be set from outside the model with
	// the random conditions assigned

	var defaults = {

		range                   		: 100,
		measureStepSize					: [25,20,15,10,5], 	// Stepsize for consecutive measures
		measureRange					: 10,				// Range for each sample measure
		maxSteps						: 16,
		maxStepRepeat					: 3,				// Maximum times going back and forth
		recommendationAllignment		: "center", 		// can either be center, below, above or random
		recommendationNumber			: 7,

	};

	var options = $.extend(defaults,options);
	var o = options;

	/***********************************************************
						Variable Declarations
	***********************************************************/
	var measures, setQuestions, measureQuestions, currentUserId, 
		email, currentMeasure, stepDirection, chosenMeasureId,
		measureHistory = [], recommendation = [],
		stepRepeat = 0, currentStep = 0, stepCounter = 0,
		ability = o.range/2,
		interested = false,
		currentStage = "informedConsent";

	// Get all the required data from the database

	// Fill the array with all the measures in the database
	$.get( "ajax/selectMeasures.php", function( data ){
		measures = $.parseJSON( data );
	});

	// Fill the array with all the questions about the set in the database
	$.get( "ajax/selectSetQuestions.php", function( data ){
		setQuestions = $.parseJSON( data );
		notifyObservers( "setQuestionsReady" );
	});

	// Fill the array with all the questions per measure in the database
	$.get( "ajax/selectMeasureQuestions.php", function( data ){
		measureQuestions = $.parseJSON( data );
		console.log( measureQuestions );
	});
	
	currentUserId = 1; // remove
	

	/***********************************************************
						Helper Functions
	***********************************************************/

	shuffle = function( array ){
		var currentIndex = array.length, 
		temporaryValue, randomIndex;

	  	// While there remain elements to shuffle...
	  	while ( 0 !== currentIndex ) {
		    // Pick a remaining element...
		    randomIndex = Math.floor( Math.random() * currentIndex );
		    currentIndex -= 1;

		    // And swap it with the current element.
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
	  	}

	  	return array;
	}

	getClosest = function( array,value ){
		var closest = null;
		$.each( array, function(){
			if ( closest == null ){ 
				closest = this;
			}
			else if( Math.abs( this.difficulty - value ) < Math.abs( closest.difficulty - value ) ){
				closest = this;
			}
		})
		return closest;
	}

	/***********************************************************
						Private Functions
	***********************************************************/

	// Create the user, add it to the database, and assign the
	// experimental condition.
	createUser = function(){

		$.post( "ajax/insertUser.php", 
			{ 
				condition: o.recommendationAllignment
			}).done( function( data ) {
			currentUserId = data;
		});

		notifyObservers('userCreated');
	}

	// After the user has filled out everything, update the
	// user data.
	updateUser = function(){

		var intBool = interested ? 1 : 0;
		$.post( "ajax/updateUser.php", 
			{ 
				id: currentUserId,
				ability: ability,
				chosenId: chosenMeasureId,
				email: email, 
				interested: intBool, 
			}
		);
	}

	// Get a measure to present to the user, check if it's in range and if it hasnt
	// been shown before
	newMeasure = function(){
		if(stepCounter < o.maxSteps){

			var selectedMeasures = [];
			for( i=0; i<measures.length; i++ ){
				if( ( measures[i].difficulty >= ( ability - ( o.measureRange / 2 ) ) ) 
				 && ( measures[i].difficulty <= ( ability + ( o.measureRange / 2 ) ) ) 
				 && ( $.inArray(measures[i], measureHistory ) == -1) ){
					selectedMeasures.push(measures[i]);
				}
			}

			// Check if results come up, else we're done
			if( selectedMeasures.length > 0 ){
				var randomSelection = Math.floor( Math.random() * selectedMeasures.length );
				currentMeasure = selectedMeasures[randomSelection];
				measureHistory.push( selectedMeasures[randomSelection] );
				stepCounter++;
				notifyObservers( 'measureReady' );
			}
			else{
				notifyObservers( 'measureAbilityDone' );
				createRecommendation();
			}
			
		}
		else{
			notifyObservers( 'measureAbilityDone' );
			createRecommendation();
		}
	}

	// Used when the user votes, can take either "yes", "no" or "nvt" as parameters.
	setUserMeasure = function( value ){
		var change;
		// If the user is already applying the measure
		if( value == "yes" ){

			// Check if last time the user went in the oppsite direction
			// and if the step hasn't been repeated too often
			if( stepDirection == "-" ){
				stepRepeat ++;
				if( stepRepeat >= o.maxStepRepeat ){
					stepRepeat = 0;
					if( currentStep < o.measureStepSize.length - 1 ){
						currentStep ++;
					}
				}
			}
			else if( stepDirection != null ){
				if( currentStep < o.measureStepSize.length - 1 ){
					currentStep ++;
				}
			}
			
			// Set the last direction
			stepDirection = "+";

			// Check if ability hasn't reached the max/min and update it
			change = o.measureStepSize[ currentStep ]
			if( ( ability + change ) <= o.range ){
				ability += change;
			}
			else{
				change = o.range - ability;
				ability = o.range;
			}
			
		}
		// If the user is not applying the measure
		else if (value == "no"){

			// Check if last time the user went in the oppsite direction
			// and if the step hasn't been repeated too often
			if( stepDirection == "+" ){
				stepRepeat ++;
				if( stepRepeat >= o.maxStepRepeat ){
					stepRepeat = 0;
					if( currentStep < o.measureStepSize.length - 1 ){
						currentStep ++;
					}
				}
			}
			else if( stepDirection != null ){
				if( currentStep < o.measureStepSize.length - 1 ){
					currentStep ++;
				}
			}

			// Set the last direction
			stepDirection = "-";

			// Check if ability hasn't reached the max/min and update it
			change = -o.measureStepSize[ currentStep ];
			if( ( ability + change ) >= 0 ){
				ability += change;
			}
			else{
				change = -ability;
				ability = 0;
			}
			
		}
		// If the measure would not be useful or possible
		else if ( value == "nvt" ){
			change = 0;
		}

		$.post( "ajax/insertUserMeasure.php", 
			{ 
				userId: currentUserId,
				measureId: currentMeasure.id,
				currentAbility: ability,
				abilityChange: change
			}).done(function(){

			// When measure is saved get the next one
			newMeasure();

		});

		
	}

	// Create the recommendation from the ability depending
	// on the condition.
	createRecommendation = function(){
		var recomArray = [];
		for( i=0; i<measures.length; i++ ){
			if( $.inArray( measures[i],measureHistory ) == -1 ){
				if( o.recommendationAllignment == "center" || o.recommendationAllignment == "random" ){
						recomArray.push( measures[i] );
				}
				else if ( o.recommendationAllignment == "below" ){
					if( measures[i].difficulty <= ability ){
						recomArray.push( measures[i] );
					}
				}
				else if ( o.recommendationAllignment == "above" ){
					if( measures[i].difficulty >= ability ){
						recomArray.push( measures[i] );
					}
				}
			}
		}
		
		// Still randomize the recommendations, this shuffles the array
		
		if( o.recommendationAllignment == "center" || o.recommendationAllignment == "below" || o.recommendationAllignment == "above" ){
			for( i=0; i<o.recommendationNumber; i++ ){
				var closest = getClosest( recomArray, ability );
				recommendation.push( closest );
				// Remove the recommendation from the temp list
				recomArray = $.grep( recomArray, function( value ) {
					return value != closest;
				});
			}
			shuffle(recommendation);
		}
		else{
			shuffle(recomArray);
			for( i=0; i<o.recommendationNumber; i++ ){
					recommendation.push( recomArray[i] );
			}
		}
		

		// Write the recommendations to the database
		for( i=0; i<recommendation.length; i++ ){
			$.post( "ajax/insertRecommendation.php", 
			{ 
				userId: currentUserId,
				measureId: recommendation[i].id,
				position: i+1
			});
		}

		console.log(recommendation);

		notifyObservers( "recommendationReady" );
	}

	// Register an answer to a question about a specific measure
	setUserMeasureQuestion = function( measureId, questionId, answer ){
		$.post( "ajax/insertUserMeasureQuestion.php", 
			{ 
				userId: currentUserId,
				measureId: measureId,
				questionId: questionId,
				answer: answer
			});
	}

	setMeasureQuestionsDone = function(){
		notifyObservers( "measureQuestionsDone" );
	}

	setSetQuestionsDone = function(){
		notifyObservers( "setQuestionsDone" );
	}

	// Register an answer to a question about the entire set
	setUserSetQuestion = function ( questionId, answer ){
		$.post( "ajax/insertUserSetQuestion.php", 
			{ 
				userId: currentUserId,
				questionId: questionId,
				answer: answer
			});
	}

	getMeasure = function(){
		return currentMeasure;
	}

	getRecommendation = function(){
		return recommendation;
	}

	getSetQuestions = function(){
		return setQuestions;
	}

	getMeasureQuestions = function(){
		return measureQuestions;
	}

	// Set the users email
	setEmail = function( value ){
		email = value;
	}

	// Set if the user is interested in more studies
	setInterested = function( value ){
		interested = value;
	}

	// The measure chosen by the user
	setChosen = function( value ){
		chosenMeasureId = value;
		notifyObservers( "measureChosen" );
	}

	/***********************************************************
						Public Functions
	***********************************************************/

	this.createUser 					= createUser;
	this.updateUser 					= updateUser;
	this.newMeasure 					= newMeasure;
	this.createRecommendation 			= createRecommendation;

	this.getMeasure						= getMeasure;
	this.getRecommendation				= getRecommendation;
	this.getSetQuestions				= getSetQuestions;
	this.getMeasureQuestions			= getMeasureQuestions;

	this.setUserMeasure 				= setUserMeasure;
	this.setChosen						= setChosen;
	this.setUserMeasureQuestion 		= setUserMeasureQuestion;
	this.setMeasureQuestionsDone		= setMeasureQuestionsDone;
	this.setUserSetQuestion 			= setUserSetQuestion;
	this.setSetQuestionsDone			= setSetQuestionsDone;
	this.setEmail						= setEmail;
	this.setInterested					= setInterested;

	/***********************************************************
						Observable Pattern
	***********************************************************/

	var listeners = [];

	notifyObservers = function( args ){
		for ( var i = 0; i < listeners.length; i++ ){
	        listeners[i].update(args);
	    }
	};

	this.addObserver = function( listener ){
		listeners.push( listener );
	};

}