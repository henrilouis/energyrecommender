var MeasureQuestionsController = function( model, view ){
	
	view.volgendeButton.click(function(){
		var totalNumber = model.getRecommendation().length * (model.getMeasureQuestions().length - 1); // the -1 is for the star ratings
		if( $( '#measureQuestions .radio-group input:checked' ).length < totalNumber ){
			alert( 'U bent waarschijnlijk een vraag vergeten!' );
		}
		else{
			$("#measureQuestions .list-group-item").each(function(){
				var measureId = $(this).attr('id');
				$(this).find('.radio-group').each(function(){
					var questionId 	= $(this).attr('id');
					var val			= $(this).find('input:checked').val();
					if(!val){
						val 		= $(this).find('input').val()*2;
					}

					// Save the answers to the database
					model.setUserMeasureQuestion( measureId,questionId,val );
				});
			}).promise().done(function(){
				model.setMeasureQuestionsDone();
			});
		}
	});

}