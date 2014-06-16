var RecommendationView = function( model,container ){

	/***********************************************************
					  Variable Declarations
	***********************************************************/

	var recommendationList		= $( "<div id='recommendationList' class='list-group'>" );

	container.append( recommendationList );
	
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
			var content			= $("<p style='font-style: italic;' class='list-group-item-text'>");
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