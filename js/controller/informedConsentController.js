var InformedConsentController = function(model, view){

	view.loginButton.click(function(){

		model.createUser();
		model.newMeasure();

	});

}