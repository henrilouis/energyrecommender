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
			p.html("Als onderdeel van ons aanbevelingssysteem stellen we u eerst een aantal vragen over uw huidige positie in energiebesparing. Als de maatregel voor u niet mogelijk is druk dan op N.V.T.");
		}

		if( args == "recommendationReady" ){
			h2.html( "Uw aanbevelingen & Keuze" );
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
			h2.html( "Loting & vervolgonderzoek" );
			p.html( "Om mee te doen aan de loting voor de 5 bol.com waardebonnen t.w.v. €20,- hebben we uw e-mail adres nodig. We hebben (indien mogelijk) al uw facebook emailadres ingevuld. U kunt dit hieronder nog wijzigen als u dat wenst." );
		}
		
	}

}