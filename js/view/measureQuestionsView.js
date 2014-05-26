var MeasureQuestionsView = function( model, container ){

	/***********************************************************
					  Variable Declarations
	***********************************************************/

	var h2 						= $( "<h2>Bedankt voor uw gegevens!</h2>" );
	var p 						= $( "<p>Hier volgen een kort aantal vragen over elke aanbeveling. Vul in wat het beste bij u past.</p>" );
	var hr 						= $( '<hr>' );
	var measureQuestionList		= $( "<div class='list-group'>" );
	var volgendeButton	 		= $( "<a class='btn btn-primary pull-right' role='button'>Volgende &raquo;</a>" );

	container.append( p, hr, measureQuestionList, volgendeButton );

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
			var content					= $( "<p class='list-group-item-text'>" );
				content 				.html( recommendation[i].description );
			var helemaalOneens			= $( "<span>Helemaal oneens</span>" );
			var helemaalEens 			= $( "<span>Helemaal eens</span>" );
			var neutraal				= $( "<span>Neutraal</span>" );
			var legend 					= $( "<div id='legend'>" );
				legend 					.append( helemaalOneens, neutraal, helemaalEens )
			var questions 				= $( "<div>" );
				questions 				.append( legend );
				
			for( j=0; j<measureQuestions.length; j++ ){
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
						label.append( k+1 );
					radioContainer.append( label );
				}
				question.append( radioContainer );
				questions.append( question );
			}

			item.append( title, content, questions );
			measureQuestionList.append( item );

		}
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
		if( args == "measureChosen" ){
			updateMeasureQuestionList();
			container.show();
		}

		if( args == "measureQuestionsDone" ){
			container.hide();
		}
	}

	container.hide();
}
