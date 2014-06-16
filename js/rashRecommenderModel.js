var RashRecommenderModel = function( options ){

	/***********************************************************
							 Options
	***********************************************************/

	// These options should be set from outside the model with
	// the random conditions assigned

	var defaults = {

		measurSetSize					: 7,				// Size for each sample measure
		numberOfRecommendations			: 7,
		recommendationAllignment		: "center", 		// can either be center, below, above or random
		logitSize  						: 13.44519164,		// the size of a logit in the used scale
		newMeasureNumber				: 2,

	};

	var options = $.extend(defaults,options);
	var o = options;

	/***********************************************************
						Variable Declarations
	***********************************************************/
	var measures, newMeasures, setQuestions, measureQuestions, currentUserId,
		facebookId, email, currentMeasure, chosenMeasureId, numberOfSets,
		measureHistory = [], recommendation = [], selectedMeasures = [],
		setArray = [], abilitySet = [],
		change = 25 ,stepRepeat = 0, currentStep = 0, stepCounter = 0,
		ability = 0, yes = 0, nvt = 0,
		interested = false;

	// Get all the required data from the database

	// Fill the array with all the measures in the database
	$.get( "ajax/selectMeasures.php", function( data ){
		measures = $.parseJSON( data );
		// Sort according to difficulty
		measures = measures.sort(function (a,b){
			return a.difficulty-b.difficulty;
		});
	}).done(function(){
		getNewQuestions();
	});

	var getNewQuestions = function(){
		// Get the new measures for calculating the level on rash scale
		$.get( "ajax/selectNewMeasures.php", function( data ){
			newMeasures = $.parseJSON( data );
		}).done(function(){
			createMeasures();
		});	
	}
	

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

	// Array shuffle function
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

	// Array split function
	split = function( a, n ){
		var len = a.length, out = [], i = 0;
		while ( i < len ){
			var size = Math.ceil( ( len - i ) / n--);
			out.push( a.slice( i, i+= size ));
		}
		return out;
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

	// Take samples from the pool of measures after they've been loaded
	createMeasures = function(){
			selectedMeasures 	= [];
		    numberOfSets 		= Math.ceil( measures.length / o.measurSetSize );

		setArray = split( measures, numberOfSets );

		for( i=0; i < numberOfSets; i++ ){
			var rand = Math.floor( Math.random() * setArray[i].length );
			selectedMeasures.push( setArray[i][rand] );
		}

		// Add two of the new measures to the list
		for( i=0; i < o.newMeasureNumber; i++ ){
			shuffle( newMeasures );
			selectedMeasures.push( newMeasures[i] );
		}
		// randomize the order of the selected measures
		shuffle( selectedMeasures );
	}
	
	// Get a measure to present to the user
	newMeasure = function(){
		if( stepCounter < numberOfSets + o.newMeasureNumber ){
			currentMeasure = selectedMeasures[stepCounter];
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
		var answer;
		// This checks if the measure is a existing one or one we are testing to put
		// on the rasch scale as new. The new ones dont have difficulty yet ofcourse.
		if(currentMeasure.difficulty == null){
			if( value == "yes" ){
				answer = 1;
			}
			if( value == "no" ){
				answer = 0;
			}
			if( value == "nvt" ){
				answer = 2;
			}
			$.post( "ajax/insertUserNewMeasure.php", 
				{ 
					userId: currentUserId,
					measureId: currentMeasure.id,
					answer: answer
				}).done(function(){
			});
		}
		else{

			if( value == "yes" ){
				yes ++;
				answer = 1;
				// only pushed to history if the answer is yes or nvt
				measureHistory.push( currentMeasure );
			}
			else if( value == "no" ){
				answer = 0;
			}
			else if( value == "nvt"){
				answer = 2;
				nvt++;
				measureHistory.push( currentMeasure );
			}

			$.post( "ajax/insertUserMeasure.php", 
				{ 
					userId: currentUserId,
					measureId: currentMeasure.id,
					answer: answer
				}).done(function(){

				// When measure is saved get the next one
			});
		}
		
		newMeasure();
	}

	// Create the recommendation from the ability depending
	// on the condition.
	createRecommendation = function(){

		// If someone has 0 'yes' answers we give him one so we have 
		// someting to recommend
		if( yes == 0 ) {
			yes = 1;
		}
		// Check if questions were NVT and extrapolate accordingly
		abilitySet 	 		= setArray[Math.round( yes + ( ( yes / numberOfSets ) * nvt ) ) - 1];

		// calculate mean ability of set
		var count 			= 0;
		$.each(abilitySet,function(index){
			count 			+= Number(this.difficulty);
		});
		ability 			= count / abilitySet.length;

		console.log("ability: "+ability);

		var recomArray 		= [];
		for( i=0; i<measures.length; i++ ){
			// Not adding recommendations that user is already doing
			if( $.inArray( measures[i],measureHistory ) == -1 ){
				if( o.recommendationAllignment == "center" || o.recommendationAllignment == "random" ){
						recomArray.push( measures[i] );
				}
				else if ( o.recommendationAllignment == "centerbig" ){
					if( measures[i].difficulty >= ( ability - o.logitSize ) && measures[i].difficulty <= ( ability + o.logitSize ) ){
						recomArray.push( measures[i] );
					}
				}
				else if ( o.recommendationAllignment == "above" ){
					if( measures[i].difficulty >= ability && measures[i].difficulty <= ability + o.logitSize ){
						recomArray.push( measures[i] );
					}
				}
			}
		}
		
		if( o.recommendationAllignment == "center" ){
			
			// Check if there are enough available recommendations and use them
			// This might not be the case but i'm not sure what to do with this yet.
			if( recomArray.length >= o.numberOfRecommendations ){
				for( i=0; i<o.numberOfRecommendations; i++ ){

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
			shuffle( recommendation );
		}
		// All other conditions take a sample from the recomArray to distribute
		// the recommendations better around the scale
		else{
			if( recomArray.length >= o.numberOfRecommendations ){
				var recomSetArray 	= split( recomArray, o.numberOfRecommendations )
				for( i=0; i<o.numberOfRecommendations; i++ ){
					shuffle( recomSetArray[i] );
					recommendation.push( recomSetArray[i][0] );
				}
			}
			else{
				for( i=0; i<recomArray.length; i++ ){
					recommendation.push( recomArray[i] );
				}
			}
			shuffle( recommendation );
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
		console.log("recommendation: ", recommendation);
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
	this.createMeasures					= createMeasures;
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