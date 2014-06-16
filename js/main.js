$(function(){

	var random = Math.floor((Math.random() * 4) + 1);
	var options;

	if( random == 1 ){
		var options = {
			recommendationAllignment		: "random",
		}
		console.log("condition = 1 (random)");
	}
	else if( random == 2 ){
		var options = {
			recommendationAllignment		: "center",
		}
		console.log("condition = 2 (center)");
	}
	else if( random == 3 ){
		var options = {
			recommendationAllignment		: "above",
		}
		console.log("condition = 3 (above)");
	}
	else if( random == 4 ){
		var options = {
			recommendationAllignment		: "centerbig",
		}
		console.log("condition = 4 (centerbig)");
	}

	var rashRecommenderModel 			= new RashRecommenderModel( options );

	// The random condition assignment
	// Condition 1

	var facebookApi 					= new FacebookApi( rashRecommenderModel );

	var headerView 						= new HeaderView( rashRecommenderModel, $( "#boxHeader" ) );
	var headerController 				= new HeaderController( rashRecommenderModel, informedConsentView );

	var informedConsentView 			= new InformedConsentView( rashRecommenderModel, $( "#informedConsent" ), facebookApi );
	var informendConsentController 		= new InformedConsentController( rashRecommenderModel, informedConsentView, facebookApi );

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

	// initialize star rating stuff with defaults
	$("#input-id").rating();

})