var DemographicsView = function( model, container ){

	/***********************************************************
					  Variable Declarations
	***********************************************************/

	var bedankt 				= $( '<h3>De gegevens zijn verzonden, u kunt het venster nu sluiten.</h3>' );
	var form					= $( "<form role='form'>" );
	var emailContainer			= $( "<div class='form-group'>" );
	var emailLabel 				= $( "<label for='emailInput'>Email</label>" );
	var emailInput				= $( "<input type='email' class='form-control' id='emailInput' placeholder='uw email adres'>");
	var meedoenContainer		= $( "<div class='form-group'>" );
	var meedoenLabel 			= $( "<label for='meedoenInput'>Wilt u eventueel mee deelnemen aan het vervolgonderzoek?</label>");
	var meedoenP 				= $( "<p style='font-style:italic'>Om u zo goed mogelijk energiebesparende maatregelen te kunnen aanbevelen, nodigen wij u graag uit om ook deel te nemen aan het vervolgonderzoek. Ook dit zal wetenschappelijk onderzoek betreffen, waarin we u voorzien van energieadvies. U zal per e-mail op de hoogte worden gebracht, met een link naar het onderzoek.</p>");
	var meedoenInput			= $( "<input type='radio' name='geslachtRadio' id='meedoenInput' value='1'>" );
	var meedoenInput2			= $( "<input type='radio' name='geslachtRadio' id='meedoenInput2' value='0'>" );
	var volgendeButton	 		= $( "<a class='btn btn-default pull-right' role='button'>Versturen</a>" );

	emailContainer.append( emailLabel, emailInput );
	meedoenContainer.append( meedoenLabel, meedoenP, meedoenInput, " Ja",  "<br/>", meedoenInput2, " Nee" );
	form.append( emailContainer, meedoenContainer );
	container.append( form, bedankt, volgendeButton );
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

		if( args == "measureQuestionsDone" ){
			container.show();
		}
	}

	container.hide();
}