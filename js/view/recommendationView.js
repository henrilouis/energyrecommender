var RecommendationView = function( model,container ){

	/***********************************************************
					  Variable Declarations
	***********************************************************/

	var recommendationList		= $( "<div id='recommendationList' class='list-group'>" );
	var volgendeButton	 		= $( "<a class='btn btn-default pull-right' role='button'>Volgende &raquo;</a>" );
	var progressContainer		= $( "<div class='progress progress-striped active'>" );
	var progressBar				= $( "<div class='progress-bar' role='progressbar' aria-valuenow='45' aria-valuemin='0' aria-valuemax='100' style='width:0%'>");
		progressContainer.append( progressBar );
	
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
				$('#recommendationList .list-group-item').each(function(){
					$(this).removeClass('active');
				});
				$(this).addClass('active');
			});

		}
	}

	/***********************************************************
						Public Variables
	***********************************************************/

	this.recommendationList 	= recommendationList;
	this.volgendeButton 		= volgendeButton;

	/***********************************************************
							 Update
	***********************************************************/

	model.addObserver( this );
	this.update = function( args ){
		if( args == "recommendationReady" ){
			container.show();
			updateRecommendationList();
			container.append( progressContainer );
			setTimeout(function() {
			    progressBar.css('width','25%');
			}, 1000);
			setTimeout(function() {
			    progressBar.css('width','50%');
			}, 2500);
			setTimeout(function() {
			    progressBar.css('width','75%');
			}, 3000);
			setTimeout(function() {
			    progressBar.css('width','100%');
			}, 3500);
			setTimeout(function() {
			    progressContainer.hide();
			    container.slideUp();
			    container.append( recommendationList, volgendeButton );
			    container.slideDown();
			}, 4000);
		}
		if( args == "measureChosen" ){
			container.hide();
			model.updateUser();
		}
	}

	// hide on start
	container.hide();
}