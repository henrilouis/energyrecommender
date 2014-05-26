var DemographicsController = function( model, view ){

	view.volgendeButton.click(function(){
		var email = view.emailInput.val();
		console.log(email);
		var meedoen = view.meedoenContainer.find("input:checked").val();
		console.log(meedoen);

		if(email != "" && meedoen != null){
			model.setEmail(email);
			if(meedoen == 1){
				model.setInterested(true);
			}
			else{
				model.setInterested(false);
			}
			model.updateUser();

			$(view.form).hide();
			$(view.bedankt).show();
			$(view.volgendeButton).hide();
		}
		else{
			alert( 'U bent waarschijnlijk een vraag vergeten!' );
		}
	});

}