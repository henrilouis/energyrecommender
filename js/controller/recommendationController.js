var RecommendationController = function( model, view ){
	view.volgendeButton.click(function(){
		if( $( '#recommendationList a.active' ).length > 0 ){
			model.setChosen($( '#recommendationList .active' ).attr( 'id' ));
		}
		else{
			alert( "Kies eerst uw maatregel door erop te klikken" );
		}
		
	});
}