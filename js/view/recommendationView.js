var RecommendationView = function( model,container ){

	/***********************************************************
					  Variable Declarations
	***********************************************************/

	var h2 						= $( "<h2>Bedankt voor uw gegevens!</h2>" );
	var p 						= $( "<p>Wij bevelen u de volgende maatregelen aan om uw huis energiezuiniger te maken. Klik de maatregel aan die u het waarschijnlijkst zou uitvoeren.</p>" );
	var hr 						= $( "<hr>" );
	var recommendationList		= $( "<div id='recommendationList' class='list-group'>" );

	container.append( h2, p, hr, recommendationList );
	
	/***********************************************************
						Private Variables
	***********************************************************/
	
	updateRecommendationList = function(){

		recommendationList.empty();
		var recommendation = model.getRecommendation();
		for( i=0; i<recommendation.length; i++ ){

			var a 				= $("<a class='list-group-item'>");
				a.attr('id', recommendation[i].id);
			var title 			= $("<h4 class='list-group-item-heading'>");
				title.html(recommendation[i].name);
			var content			= $("<p class='list-group-item-text'>");
				content.html(recommendation[i].description)
			
			a.append( title,content );
			recommendationList.append( a );

			a.click(function(){
				model.setChosen($(this).attr('id'));
			});

		}
	}

	/***********************************************************
						Public Variables
	***********************************************************/

	this.recommendationList = recommendationList;

	/***********************************************************
							 Update
	***********************************************************/

	model.addObserver( this );
	this.update = function( args ){
		if( args == "recommendationReady" ){
			container.show();
			updateRecommendationList();
		}
		if( args == "measureChosen" ){
			container.hide();
		}
	}

	// hide on start
	container.hide();
}