var SetQuestionsController = function( model, view ){
	view.volgendeButton.click(function(){
		if( $( '#setQuestions .radioContainer input:checked' ).length < model.getSetQuestions().length ){
			alert( 'U bent waarschijnlijk een vraag vergeten!' );
		}
		else{
			$("#setQuestions .list-group-item").each(function(){
				var questionId = $(this).attr('id');
				var val 	   = $(this).find('input:checked').val();
				model.setUserSetQuestion( questionId, val );
			}).promise().done(function(){
				model.setSetQuestionsDone();
			});;
		}
	});
}