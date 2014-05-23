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
		recommendationAllignment		: "center", 		// can either be center, below or above attitude
		recommendationRange				: 10,				// Range for the recommendations
		condition						: 1

	};

	var options = $.extend(defaults,options);
	var o = options;

	/***********************************************************
						Variable Declarations
	***********************************************************/
	
	// An array with all the measures in the database
	var measures;
	$.get( "ajax/selectMeasures.php", function( data ){
		measures = $.parseJSON(data);
		getMeasure(); // remove
	});

	// An array with all the questions about the set in the database
	var setQuestions;
	$.get( "ajax/selectSetQuestions.php", function( data ){
		setQuestions = $.parseJSON(data);
	});

	// An array with all the questions per measure in the database
	var measureQuestions;
	$.get( "ajax/selectMeasureQuestions.php", function( data ){
		measureQuestions = $.parseJSON(data);
	});

	var currentUserId, email, currentMeasure, stepDirection;
		currentUserId = 1;
	var stepRepeat = 0;
	var currentStep = 0;
	var ability = 50;
	var interested = true;

	/***********************************************************
						Helper Functions
	***********************************************************/

	/***********************************************************
						Private Functions
	***********************************************************/

	// Create the user, add it to the database, and assign the
	// experimental condition.
	createUser = function(){

		$.post( "ajax/insertUser.php", 
			{ 
				condition: o.condition
			}).done( function( data ) {
			currentUserId = data;
		});
	}

	// After the user has filled out everything, update the
	// user data.
	updateUser = function(){

		var intBool = interested ? 1 : 0;
		$.post( "ajax/updateUser.php", 
			{ 
				id: currentUserId,
				ability: ability,
				email: email, 
				interested: intBool, 
			}
		);
	}

	// Get a measure to present to the user.
	getMeasure = function(){
		var selectedMeasures = [];
		for( i=0; i<measures.length; i++ ){
			if( ( measures[i].difficulty >= ( ability - ( o.measureRange / 2 ) ) ) 
			 && ( measures[i].difficulty <= ( ability + ( o.measureRange / 2 ) ) ) ){
				selectedMeasures.push(measures[i]);
			}
		}
		var randomSelection = Math.floor((Math.random()*selectedMeasures.length)+1);
		currentMeasure = selectedMeasures[randomSelection];

		setUserMeasure("yes");
		return currentMeasure;
	}

	// Used when the user votes, can take either "yes", "no" or "nvt" as parameters.
	setUserMeasure = function( value ){
		var change;
		// If the user is already applying the measure
		if( value == "yes" ){
			change = o.measureStepSize[ currentStep ]
			ability += change;
			
			// Check if last time the user went in the oppsite direction
			if( stepDirection == "-" ){
				stepRepeat ++;
				if( stepRepeat > o.maxStepRepeat ){
					stepRepeat = 0;
					if(currentStep < o.measureStepSize.length){
						currentStep ++;
					}
				}
			}
			else{
				if(currentStep < o.measureStepSize.length){
					currentStep ++;
				}
			}
			
			stepDirection = "+";
		}
		// If the user is not applying the measure
		else if (value == "no"){
			change = -o.measureStepSize[ currentStep ];
			ability += change;
			
			if( stepDirection == "+" ){
				stepRepeat ++;
				if( stepRepeat > o.maxStepRepeat ){
					stepRepeat = 0;
					if(currentStep < o.measureStepSize.length){
						currentStep ++;
					}
				}
			}
			else{
				if(currentStep < o.measureStepSize.length){
					currentStep ++;
				}
			}
			stepDirection = "-";
		}
		// If the measure would not be useful or possible
		else if (value == "nvt"){
			change = 0;
			stepDirection = "";
			stepRepeat = 0;
		}

		$.post( "ajax/insertUserMeasure.php", 
			{ 
				userId: currentUserId,
				measureId: currentMeasure.id,
				currentAbility: ability,
				abilityChange: change
			}
		);
	}

	// Create the recommendation from the ability depending
	// on the condition.
	createRecommendation = function(){

	}

	setEmail = function( value ){
		email = value;
	}

	setInterested = function( value ){

	}

	/***********************************************************
						Public Functions
	***********************************************************/

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