var MeasureQuestionsView = function( model, container ){

	/***********************************************************
					  Variable Declarations
	***********************************************************/

	var measureQuestionList		= $( "<div class='list-group'>" );
	var volgendeButton	 		= $( "<a class='btn btn-default pull-right' role='button'>Volgende &raquo;</a>" );
	var clearfix				= $( '<div class="clearfix">' );

	container.append( measureQuestionList, volgendeButton, clearfix );

	/***********************************************************
						Private Variables
	***********************************************************/

	updateMeasureQuestionList = function(){
		
		measureQuestionList.empty();
		var recommendation 				= model.getRecommendation();
		var measureQuestions			= model.getMeasureQuestions();
		for( i=0; i<recommendation.length; i++ ){

			var item 					= $( "<div class='list-group-item'>" );
				item 					.attr( 'id', recommendation[i].id );
			var title 					= $( "<h4 class='list-group-item-heading'>" );
				title 					.html( recommendation[i].name );
			var content					= $( "<p style='font-style: italic;' class='list-group-item-text'>" );
				content 				.html( recommendation[i].description );
			var helemaalOneens			= $( "<span>Helemaal oneens</span>" );
			var helemaalEens 			= $( "<span>Helemaal eens</span>" );
			var neutraal				= $( "<span>Neutraal</span>" );
			var legend 					= $( "<div id='legend'>" );
				legend 					.append( helemaalOneens, neutraal, helemaalEens )
			var questions 				= $( "<div>" );
				//questions 				.append( legend );
				
			for( j=0; j<measureQuestions.length; j++ ){

				if( measureQuestions[j].scale == 10 ){
					var question 			= $( "<div class='radio-group' style='margin-top:10px'>" );
						question.attr('id',measureQuestions[j].id);
					var p 					= $( "<p style='margin-top:5px; display:inline-block; width:50%' class='list-group-item-text'>" );
						p.html( measureQuestions[j].question );
						question.append( p );
					var radioContainer		= $( "<div class='radioContainer'>" );
					var stars 				= $( "<div class='rating'>" );
						stars.attr('id',measureQuestions[j].id);
						radioContainer.append(stars);
				}
				else{
					var question 			= $( "<div class='radio-group' style='margin-top:10px'>" );
						question.attr('id',measureQuestions[j].id);
					var p 					= $( "<p style='margin-top:5px; display:inline-block; width:50%' class='list-group-item-text'>" );
						p.html( measureQuestions[j].question );
						question.append( p );
					var radioContainer		= $( "<div class='radioContainer'>" );

					for( k=0; k<measureQuestions[j].scale; k++ ){
						var label = $( '<label class="radio-inline">' );
						var radio = $( '<input type="radio">' );
							radio.attr( 'value', k+1 );
							radio.attr( 'name', 'r'+recommendation[i].id+'q'+measureQuestions[j].id);
							label.append( radio );
							if( measureQuestions[j].scale > 3 ){
								label.append( k+1 );
							}
							else if( k == 0 ){
								label.append( "Ja" );
							}
							else if( k == 1) {
								label.append( "Nee" );
							}
							else if( k == 2) {
								label.append( "N.V.T." );
							}
							
						radioContainer.append( label );
					}
				}

				
				question.append( radioContainer );
				questions.append( question );
			}

			item.append( title, content, questions );
			measureQuestionList.append( item );
			
		}
		$(".rating").raty({ 
			path: 'img', 
			half: true,
			hints: ['zeer slecht', 'slecht', 'gemiddeld', 'goed', 'zeer goed']
		});
	}

	/***********************************************************
						Public Variables
	***********************************************************/

	this.volgendeButton					= volgendeButton;

	/***********************************************************
							 Update
	***********************************************************/

	model.addObserver( this );

	this.update = function( args ){
		if( args == "recommendationReady" ){
			updateMeasureQuestionList();
		}

		if( args == "setQuestionsDone"){
			container.show();
		}

		if( args == "measureQuestionsDone" ){
			container.hide();
		}
	}

	container.hide();
}
