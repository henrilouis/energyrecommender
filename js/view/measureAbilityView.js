var MeasureAbilityView = function(model, container){

	/***********************************************************
					  Variable Declarations
	***********************************************************/

	var h2 						= $( "<h3 style='font-family: Lato, sans-serif;' class='text-center'>Voert u deze maatregel al uit?</h3>" );
	var list					= $( "<div class='list-group'>" );
	var item					= $( "<div class='list-group-item'>" );
	var h3						= $( "<h3 class='list-group-item-heading'>" );
	var description	 			= $( "<p style='font-style: italic;' class='list-group-item-text'>" );
	var yesButton				= $( "<a class='btn btn-default' role='button'>Ja</a>" );
	var noButton				= $( "<a class='btn btn-default' role='button'>Nee</a>" );
	var notusefulButton			= $( "<a class='btn btn-default' role='button'>N.V.T</a>" );
	var buttonGroup 			= $( "<div class='btn-group btn-group-justified'> ")
		buttonGroup 			.append( noButton, notusefulButton, yesButton );
		list 					.append( item );
		item 					.append( h3, description )
	container.append( h2, list, buttonGroup );

	/***********************************************************
						Private Variables
	***********************************************************/

	updateMeasure = function(){
		var measure = model.getMeasure();
			h3.html(measure.name);
			description.html(measure.description);
	}

	/***********************************************************
						Public Variables
	***********************************************************/

	this.yesButton 				= yesButton;
	this.noButton 				= noButton;
	this.notusefulButton 		= notusefulButton;

	/***********************************************************
							 Update
	***********************************************************/

	model.addObserver( this );
	this.update = function( args ){
		if( args == "userCreated" ){
			container.show();
		}
		if( args == "measureReady" ){
			updateMeasure();
		}
		if( args == "recommendationReady" ){
			container.hide();
		}
	}
	
	// hide on start
	container.hide();
}