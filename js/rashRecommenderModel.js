var RashRecommenderModel = function( options ){

	/***********************************************************
							 Options
	***********************************************************/

	// These options should be set from outside the model with
	// the random conditions assigned

	var defaults = {

		range                   		: 100,
		measureRange					: 10,				// Range for each sample measure
		stepConstant					: 0.375,
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
		facebookId, email, currentMeasure, prevAbility,  
		chosenMeasureId, stepSize, prevStep, lastChange,
		measureHistory = [], recommendation = [],
		change = 25 ,stepRepeat = 0, currentStep = 0, stepCounter = 0,
		ability = o.range/2,
		interested = false;

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
	});
	

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
	createUser = function( fbid, mail, gender ){

		$.post( "ajax/insertUser.php", 
			{
				facebookId: fbid,
				email: mail,
				gender: gender,
				condition: o.recommendationAllignment
			}).done( function( data ) {
			currentUserId = data;
			email = mail;
			facebookId = fbid;
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

	// To add a facebook friend to a user. Accepts the facebook friend object
	insertFacebookFriend = function( friend, score ){
		$.post( "ajax/insertFriend.php", 
			{
				facebookId: facebookId,
				friendId: friend.id,
				friendName: friend.name,
				score: score,
			}
		);
	}

	// Get a measure to present to the user, check if it's in range and if it hasnt
	// been shown before. This one needs to be upgraded to use closest instead of
	// the range.
	newMeasure = function(){

		if( stepCounter < o.maxSteps && Math.abs( change ) > 1 ){

			var tempMeasures = [];
			var selectedMeasures = [];

			for( i=0; i<measures.length; i++ ){
				if( $.inArray(measures[i], measureHistory ) == -1){
					tempMeasures.push(measures[i]);
				}
			}

			// Taking only the 5 closest measures, this number might have to be lower
			// when the ability is further away from the center, because there are
			// less measures there. When we implement the first four questions the 
			// whole iteration should be gone! <------------------------
			// This seems to work pretty well though
			for ( i=0; i<5; i++ ){
				var closest = getClosest( tempMeasures, ability );
				selectedMeasures.push( closest );
				// Remove the recommendation from the temp list
				tempMeasures = $.grep( tempMeasures, function( value ) {
					return value != closest;
				});
			}

			// Select a measure at random
			var randomSelection = Math.floor( Math.random() * selectedMeasures.length );
			currentMeasure = selectedMeasures[randomSelection];
			measureHistory.push( selectedMeasures[randomSelection] );
			stepCounter++;
			notifyObservers( 'measureReady' );
			
		}
		else{
			// Create the recommendation when the conditions are met
			createRecommendation();
		}
	}

	// Used when the user votes, can take either "yes", "no" or "nvt" as parameters.
	setUserMeasure = function( value ){
		if( value == "nvt" ){
			change = 0;
			lastChange = 0;
		}
		else{
			// Check if this is the first step
			if( prevStep == null ){
				change = Math.pow( 0.85, currentStep ) * ( o.stepConstant * ( ( o.range / 2 ) - Math.sqrt( Math.pow( ability - ( o.range / 2 ), 2 ) ) ) );
			}
			// Check if last time the user went in the oppsite direction
			// and if the step hasn't been repeated too often
			else if( prevStep != value ){
				stepRepeat ++;
				if( stepRepeat >= o.maxStepRepeat ){
					stepRepeat = 0;
					currentStep ++;
					change = Math.pow( 0.85, currentStep ) * ( o.stepConstant * ( ( o.range / 2 ) - Math.sqrt( Math.pow( ability - ( o.range / 2 ), 2 ) ) ) );
				}
				else{
					change = lastChange;
				}
			}
			else{
				stepRepeat = 0;
				currentStep ++;
				change = Math.pow( 0.85, currentStep ) * ( o.stepConstant * ( ( o.range / 2 ) - Math.sqrt( Math.pow( ability - ( o.range / 2 ), 2 ) ) ) );
			}

			// Save the last direction and change
			prevStep = value;
			lastChange = change;

			// Set to minus or plus and apply change
			change = ( value == "yes" ? change : -change );
			ability += change;
			
		}

		console.log(ability);

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
		
		if( o.recommendationAllignment == "center" || o.recommendationAllignment == "below" || o.recommendationAllignment == "above" ){
			
			// Check if there are enough available recommendations and use them
			// This might not be the case but i'm not sure what to do with this yet.
			if( recomArray.length >= o.recommendationNumber ){
				for( i=0; i<o.recommendationNumber; i++ ){

					var closest = getClosest( recomArray, ability );
					recommendation.push( closest );
					// Remove the recommendation from the temp list
					recomArray = $.grep( recomArray, function( value ) {
						return value != closest;
					});

				}
			}
			else{
				for( i=0; i<recomArray.length; i++ ){

					var closest = getClosest( recomArray, ability );
					recommendation.push( closest );
					// Remove the recommendation from the temp list
					recomArray = $.grep( recomArray, function( value ) {
						return value != closest;
					});
					
				}
			}

			
			// Still randomize the recommendations, this shuffles the array
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
	this.insertFacebookFriend			= insertFacebookFriend;
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