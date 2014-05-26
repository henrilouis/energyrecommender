$(function(){

	var rashRecommenderModel 			= new RashRecommenderModel();

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

})