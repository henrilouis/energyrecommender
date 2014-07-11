var DemographicsView = function( model, container ){

	/***********************************************************
					  Variable Declarations
	***********************************************************/

	var bedankt 				= $( '<h3>Bedankt voor uw deelname, u kunt uw browser venster nu sluiten.</h3>' );
	var form					= $( "<form role='form'>" );
	var emailContainer			= $( "<div class='form-group'>" );
	var emailLabel 				= $( "<label for='emailInput'>Email</label>" );
	var emailInput				= $( "<input type='email' class='form-control' id='emailInput' placeholder='uw email adres'>");
	var meedoenContainer		= $( "<div class='form-group'>" );
	var meedoenLabel 			= $( "<label for='meedoenInput'>Wilt u eventueel deelnemen aan het vervolgonderzoek?</label>");
	var meedoenP 				= $( "<p style='font-style:italic'>Op basis van de resultaten van dit onderzoek zullen we binnenkort een vervolgonderzoek houden waarin we wederom energieadvies zullen geven. We zijn daarbij erg geholpen als we u dan weer mogen uitnodigen om aan dit onderzoek deel te nemen.</p>");
	var meedoenInput			= $( "<input type='radio' name='geslachtRadio' id='meedoenInput' value='1'>" );
	var meedoenInput2			= $( "<input type='radio' name='geslachtRadio' id='meedoenInput2' value='0'>" );
	var volgendeButton	 		= $( "<a class='btn btn-default pull-right' role='button'>Versturen</a>" );
	var clearfix				= $( '<div class="clearfix">' );
	var shareBox				= $( '<div style="width:100%; text-align:center; height: 50px; margin-top: 37px;">');
	var share 					= $( '<div class="fb-share-button" data-href="http://besparingshulp.nl" data-type="button">');


	emailContainer.append( emailLabel, emailInput );
	meedoenContainer.append( meedoenLabel, meedoenP, meedoenInput, "  Ja, u mag mij uitnodigen voor het vervolgonderzoek",  "<br/>", meedoenInput2, " Nee, ik ontvang liever geen uitnodiging meer" );
	form.append( emailContainer, meedoenContainer );
	shareBox.append( share );
	container.append( form, bedankt, shareBox, volgendeButton, clearfix );
	bedankt.hide();
	shareBox.hide();

	/***********************************************************
						Private Variables
	***********************************************************/

	/***********************************************************
						Public Variables
	***********************************************************/

	this.volgendeButton 		= volgendeButton;
	this.form 					= form;
	this.bedankt 				= bedankt;
	this.share 					= share;
	this.shareBox				= shareBox;
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