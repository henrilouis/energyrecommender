var HeaderView = function ( model, container ){

	/***********************************************************
					  Variable Declarations
	***********************************************************/
	var h2 						= $( "<h2>Welkom!</h2>" );
	var p 						= $( "<p></p>" );

	container.append( h2,p );

	/***********************************************************
						Private Variables
	***********************************************************/

	/***********************************************************
						Public Variables
	***********************************************************/

	/***********************************************************
							 Update
	***********************************************************/
	
	model.addObserver( this );
	this.update = function( args ){

		if( args == "userCreated" ){
			h2.html("Vragen");
			p.html("Als onderdeel van ons aanbevelingssysteem stellen we u eerst een aantal vragen over uw huidige positie in energiebesparing.");
		}

		if( args == "recommendationReady" ){
			h2.html( "Uw aanbevelingen" );
			p.html( "Wij bevelen u de volgende maatregelen aan om energiezuiniger te leven. Klik de maatregel aan die u het waarschijnlijkst zou uitvoeren." );
		}

		if( args == "measureChosen" ){
			h2.html( "Vragenlijst aanbevelingsset" );
			p.html( "Hier volgen een kort aantal vragen over de set aanbevelingen. Vul in wat het beste bij u past." );
		}

		if( args == "setQuestionsDone"){
			h2.html( "Vragenlijst aanbevelingen" );
			p.html( "Wat vond je van de aanbevelingen? Hier volgen een tweetal vragen per aanbeveling. Halve sterren zijn ook mogelijk." );
		}

		if( args == "measureQuestionsDone" ){
			h2.html( "Bedankt voor uw deelname!" );
			p.html( "Om mee te doen aan de loting voor de 5 bol.com waardebonnen t.w.v. €20,- hebben we uw e-mail adres nodig." );
		}
		
	}

}