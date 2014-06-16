var FacebookApi = function( model ){
// This is called with the results from from FB.getLoginStatus().

var loggedIn = false;

var isLoggedIn = function(){
  return loggedIn;
}
this.isLoggedIn = isLoggedIn;

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

function statusChangeCallback(response) {
  //console.log('statusChangeCallback');
  //sole.logsole.log(response);
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    loggedIn = true;
    testAPI();
    $("#fbloginbtn").hide();
    $("#fblogout").show();

  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
  }
}

var start = function(){
  createUser();
  model.newMeasure();
}
this.start = start;

function getFriends(){
  FB.api(
    "/v1.0/me/friends",
    function (response) {
      if (response && !response.error) {
        /* handle the result */
        // console.log(response);
        $.each( response.data, function( index,value ){
          getMutualFriends(value);
        });
      }
    }
  );
}

function getMutualFriends( friend ){
  FB.api(
    "/v1.0/me/mutualfriends/"+friend.id,
    function (response) {
      if (response && !response.error) {
        /* handle the result */
        model.insertFacebookFriend( friend,response.data.length );
      }
    }
  );
}



window.fbAsyncInit = function() {
FB.init({
  appId      : '1399494550320514',
  cookie     : true,  // enable cookies to allow the server to access 
                      // the session
  xfbml      : true,  // parse social plugins on this page
  version    : 'v1.0' // use version 2.0
});

// Now that we've initialized the JavaScript SDK, we call 
// FB.getLoginStatus().  This function gets the state of the
// person visiting this page and can return one of three states to
// the callback you provide.  They can be:
//
// 1. Logged into your app ('connected')
// 2. Logged into Facebook, but not your app ('not_authorized')
// 3. Not logged into Facebook and can't tell if they are logged into
//    your app or not.
//
// These three cases are handled in the callback function.

FB.getLoginStatus(function(response) {
  statusChangeCallback(response);
});

};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.

function createUser(){
  FB.api('/me', function(response) {
    //console.log(response);
    var gender;
    if( response.gender == "male" ){
      gender = 1;
    }
    else if( response.gender == "female" ){
      gender = 0;
    }
    model.createUser(response.id, response.email, gender);
    getFriends();
  });
}

function logout(){
  FB.logout(function(response) {
      location.reload();
  });
}
this.logout = logout;

function testAPI() {
  //console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function(response) {
    document.getElementById('status').innerHTML =
      'Ingelogd als ' + response.name + '!';
  });
}
}
