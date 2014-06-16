var InformedConsentView = function(model, container, facebookApi){

	var p					= $( "<p>Dit is een onderzoek van de afdeling ‘Human-Technology Interaction’ van de Technische Universiteit Eindhoven, door Alain Starke onder supervisie van dr.ir. Martijn Willemsen. Tijdens dit onderzoek gaat u aan de slag met een energiebesparings-aanbevelingssysteem. Om u passende energiebesparende maatregelen te kunnen aanbevelen, dient u aan te geven welke maatregelen u uitvoert en welke niet. Aansluitend stellen we u nog enkele afsluitende vragen over uw ervaring met het systeem. Het onderzoek duurt ongeveer 5-10 minuten.</p><p>Onder de deelnemers worden 5 waardebonnen voor Bol.com verloot t.w.v. €20,-. Hiervoor dient u wel aan het einde van het onderzoek uw e-mailadres in te vullen. Mocht u op enig moment uw deelname aan dit onderzoek willen staken, dan hoeft u alleen uw browser te sluiten. Dit blijft verder zonder nadelige gevolgen.</p><p>Voor deelname dient u in te loggen met uw Facebook-account. Hiermee willen we de gedane aanbevelingen verbeteren. We zullen slechts uw schermnaam en die van uw vrienden hiervoor gebruiken. We plaatsen nooit iets ongevraagd op uw profiel of op dat van anderen. De gebruikte informatie wordt volledig geanonimiseerd en vertrouwelijk behandeld.</p><p>Alle onderzoeken van de afdeling Human-Technology Interaction voldoen aan de ethische code van het NIP (Nederlands Instituut voor Psychologen). Uw antwoorden worden altijd anoniem verwerkt en de rapportage zal alleen op groepsniveau plaats vinden.</p><p>Door op “Log in with Facebook” knop te klikken, bevestigt u dat u het bovenstaande heeft gelezen en gaat u akkoord met deelname aan dit onderzoek van de afdeling Human-Technology Interaction. Voor vragen kunt terecht bij m.c.willemsen@tue.nl. </p><p>Log in met Facebook en klik op 'Start' om het onderzoek te beginnen.</p>");
	var fbBox				= $( "<div id='fbBox'>");
	var loginButton 		= $( '<fb:login-button id="fbloginbtn" scope="public_profile,email" onlogin="location.reload();">' );
	var fbStatus 			= $( '<div id="status">' );
	var startButton	 		= $( "<a class='btn btn-default btn-lg pull-right' role='button'>Start</a>" );
	var logoutButton 		= $( "<a id='fblogout'>Log uit</a>");
		logoutButton.hide();

	fbBox.append( loginButton, logoutButton, fbStatus );
	container.append( p, fbBox, startButton ) ;

	/***********************************************************
						Public Variables
	***********************************************************/
	this.container = container;
	this.startButton = startButton;

	this.loginButton = loginButton;
	this.startButton = startButton;
	this.logoutButton = logoutButton;

	/***********************************************************
							 Update
	***********************************************************/

	model.addObserver( this );
	this.update = function( args ){
		if( args == "userCreated" ){
			container.hide();
		}
	}

}