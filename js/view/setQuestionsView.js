var SetQuestionsView = function( model, container ){

	/***********************************************************
					  Variable Declarations
	***********************************************************/

	var measureQuestionList		= $( "<div class='list-group'>" );
	var volgendeButton	 		= $( "<a class='btn btn-default pull-right' role='button'>Volgende &raquo;</a>" );
	var questions;

	container.append( measureQuestionList, volgendeButton );

	/***********************************************************
						Private Variables
	***********************************************************/

	updateQuestions = function(){

		var questions 			= model.getSetQuestions();
		measureQuestionList.empty();

		var legend 					= $( "<div id='legend'><span>Helemaal oneens</span><span>Neutraal</span><span>Helemaal eens</span>" );
		var clearfix				= $( '<div class="clearfix">' );
		$.each( questions, function(key, value) {
			var item 			= $( "<div class='list-group-item'>" );
				item 			.attr( 'id', value.id );
			var text 			= $( "<p style='margin-top:5px; float:left; width:50%' class='list-group-item-text'>" );
				text 			.html(value.question)
				item 			.append(text);
			var radioContainer  = $( "<div class='radioContainer'>" );

			for( i=0; i < value.scale; i++ ){
				var label = $( '<label class="radio-inline">' );
					var radio = $( '<input type="radio">' );
						radio.attr( 'value', i+1 );
						radio.attr( 'name', value.id );
						label.append( radio );
						//label.append( i+1 );
					radioContainer.append( label );
			}
			item.append( radioContainer );
			if( key % 6 === 0 ){
				legend.clone().appendTo( measureQuestionList );
			}
			clearfix.clone().appendTo( item );
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

		if( args == "measureChosen" ){
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