var SetQuestionsView = function( model, container ){

	/***********************************************************
					  Variable Declarations
	***********************************************************/

	var h2 						= $( "<h2>Bedankt voor uw gegevens!</h2>" );
	var p 						= $( "<p>Hier volgen een kort aantal vragen over de set aanbevelingen. Vul in wat het beste bij u past.</p>" );
	var hr 						= $( '<hr>' );
	var measureQuestionList		= $( "<div class='list-group'>" );
	var volgendeButton	 		= $( "<a class='btn btn-primary pull-right' role='button'>Volgende &raquo;</a>" );
	var questions;

	container.append( p, hr, measureQuestionList, volgendeButton );

	/***********************************************************
						Private Variables
	***********************************************************/

	updateQuestions = function(){

		var questions 			= model.getSetQuestions();
		measureQuestionList.empty();

		var helemaalOneens			= $( "<span>Helemaal oneens</span>" );
		var helemaalEens 			= $( "<span>Helemaal eens</span>" );
		var neutraal				= $( "<span>Neutraal</span>" );
		var legend 					= $( "<div id='legend'>" );
			legend 					.append( helemaalOneens, neutraal, helemaalEens )
			measureQuestionList.append( legend );

		$.each( questions, function(key, value) {
			var item 			= $( "<div class='list-group-item'>" );
				item 			.attr( 'id', value.id );
			var text 			= $( "<p style='margin-top:5px; display:inline-block; width:50%' class='list-group-item-text'>" );
				text 			.html(value.question)
				item 			.append(text);
			var radioContainer  = $( "<div class='radioContainer'>" );

			for( i=0; i < value.scale; i++ ){
				var label = $( '<label class="radio-inline">' );
					var radio = $( '<input type="radio">' );
						radio.attr( 'value', i+1 );
						radio.attr( 'name', value.id );
						label.append( radio );
						label.append( i+1 );
					radioContainer.append( label );
			}
			item.append( radioContainer );
			measureQuestionList.append( item );
		});

	}	

	/***********************************************************
						Public Variables
	***********************************************************/

	this.volgendeButton 		= volgendeButton;

	/***********************************************************
							 Update
	***********************************************************/
	
	model.addObserver( this );

	this.update = function( args ){

		if( args == "measureQuestionsDone" ){
			container.show();
		}
		if( args == "setQuestionsReady" ){
			updateQuestions();
		}
		if( args == "setQuestionsDone" ){
			container.hide();
		}
	}

	container.hide();

}