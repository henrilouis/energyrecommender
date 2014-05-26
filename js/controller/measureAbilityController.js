var MeasureAbilityController = function(model, view){
		
		view.yesButton.click(function(){
			model.setUserMeasure("yes");
		});

		view.noButton.click(function(){
			model.setUserMeasure("no");
		});

		view.notusefulButton.click(function(){
			model.setUserMeasure("nvt");
		});

}