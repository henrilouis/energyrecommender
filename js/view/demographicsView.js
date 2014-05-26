var DemographicsView = function( model, container ){

	/***********************************************************
					  Variable Declarations
	***********************************************************/

	var h2 						= $( "<h2>Bedankt voor uw deelname!</h2>" );
	var p 						= $( "<p>Om mee te doen aan de loting voor de waardebonnen hebben we uw e-mail adres nodig.</p>" );
	var hr 						= $( '<hr>' );
	var bedankt 				= $( '<h3>De gegevens zijn verzonden, u kunt het venster nu sluiten.</h3>' );
	var form					= $( "<form role='form'>" );
	var emailContainer			= $( "<div class='form-group'>" );
	var emailLabel 				= $( "<label for='emailInput'>Email</label>" );
	var emailInput				= $( "<input type='email' class='form-control' id='emailInput' placeholder='uw email adres'>");
	var meedoenContainer		= $( "<div class='form-group'>" );
	var meedoenLabel 			= $( "<label for='meedoenInput'>Wilt u eventueel mee deelnemen aan vervolgonderzoek?</label>");
	var meedoenInput			= $( "<input type='radio' name='geslachtRadio' id='meedoenInput' value='1'>" );
	var meedoenInput2			= $( "<input type='radio' name='geslachtRadio' id='meedoenInput2' value='0'>" );
	var volgendeButton	 		= $( "<a class='btn btn-primary pull-right' role='button'>Versturen</a>" );

	emailContainer.append( emailLabel, emailInput );
	meedoenContainer.append( meedoenLabel, "<br/>", meedoenInput, " Ja",  "<br/>", meedoenInput2, " Nee" );
	form.append( emailContainer, meedoenContainer );
	container.append( h2, p, hr, form, bedankt, volgendeButton );
	bedankt.hide();

	/***********************************************************
						Private Variables
	***********************************************************/

	/***********************************************************
						Public Variables
	***********************************************************/

	this.volgendeButton 		= volgendeButton;
	this.form 					= form;
	this.bedankt 				= bedankt;
	this.emailInput				= emailInput;
	this.meedoenContainer		= meedoenContainer;

	/***********************************************************
							 Update
	***********************************************************/
	
	model.addObserver( this );

	this.update = function( args ){

		if( args == "setQuestionsDone" ){
			container.show();
		}
	}

	container.hide();
}