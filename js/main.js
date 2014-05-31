$(function(){

	var random = Math.floor((Math.random() * 4) + 1);
	var options;

	if( random == 1 ){
		var options = {
			recommendationAllignment		: "below", 		// can either be center, below, above or random
		}
		console.log("condition = 1 (below)");
	}
	else if( random ==2 ){
		var options = {
			recommendationAllignment		: "above", 		// can either be center, below, above or random
		}
		console.log("condition = 2 (above)");
	}
	else if( random == 3 ){
		var options = {
			recommendationAllignment		: "center", 		// can either be center, below, above or random
		}
		console.log("condition = 3 (center)");
	}
	else if( random == 4 ){
		var options = {
			recommendationAllignment		: "random", 		// can either be center, below, above or random
		}
		console.log("condition = 4 (random)");
	}

	var rashRecommenderModel 			= new RashRecommenderModel( options );

	// The random condition assignment
	// Condition 1

	var informedConsentView 			= new InformedConsentView( rashRecommenderModel, $( "#informedConsent" ) );
	var informendConsentController 		= new InformedConsentController( rashRecommenderModel, informedConsentView );

	var measureAbilityView				= new MeasureAbilityView( rashRecommenderModel, $( "#measureAbility" ) );
	var measureAbilityController		= new MeasureAbilityController( rashRecommenderModel, measureAbilityView );

	var recommendationView				= new RecommendationView( rashRecommenderModel, $( "#recommendation" ) );
	var recommendationController 		= new RecommendationController( rashRecommenderModel, recommendationView );

	var setQuestionsView				= new SetQuestionsView( rashRecommenderModel, $( "#setQuestions" ) );
	var setQuestionsController 			= new SetQuestionsController( rashRecommenderModel, setQuestionsView );

	var measureQuestionsView			= new MeasureQuestionsView( rashRecommenderModel, $( "#measureQuestions" ) );
	var measureQuestionsController 		= new MeasureQuestionsController( rashRecommenderModel, measureQuestionsView );
	
	var demographicsView				= new DemographicsView( rashRecommenderModel, $( "#demographics" ) );
	var demographicsController 			= new DemographicsController( rashRecommenderModel, demographicsView );

	var facebookApi 					= new FacebookApi( rashRecommenderModel );

})