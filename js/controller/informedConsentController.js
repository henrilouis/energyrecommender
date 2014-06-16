var InformedConsentController = function(model, view, facebookApi){

	view.startButton.click(function(){
		if(facebookApi.isLoggedIn() == true){
			facebookApi.start();
		}
		else{
			alert("Log eerst in met facebook");
		}
	});

	view.logoutButton.click(function(){
		if(facebookApi.isLoggedIn() == true){
			facebookApi.logout();
		}
		else{
			alert("Je bent niet ingelogd");
		}
	});

}