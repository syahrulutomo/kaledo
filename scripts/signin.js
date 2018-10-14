var loginGoogleButton = document.querySelector('.login-google-button');
var loginFbButton = document.querySelector('.fb-login-button');

 // Initialize Firebase
  // TODO: Replace with your project's customized code snippet
  var config = {
    apiKey: "AIzaSyB4tu8OwisUwHb-AOZSOG1_sJXGTVIyZKo",
    authDomain: "kaledostorage.firebaseapp.com",
    databaseURL: "https://kaledostorage.firebaseio.com",
    projectId: "kaledostorage",
    storageBucket: "kaledostorage.appspot.com",
    messagingSenderId: "27410977713"
  };
  firebase.initializeApp(config);


  window.fbAsyncInit = function() {
  	
    FB.init({
      appId      : '257158954991797',
      cookie     : true,
      xfbml      : true,
      version    : 'v3.1'
    });
    
   function checkLoginState() {
	  FB.getLoginStatus(function(response) {
	    statusChangeCallback(response);
	  });
	} 

    FB.AppEvents.logPageView();   
      
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));


var providerGoogle = new firebase.auth.GoogleAuthProvider();
// var providerFb = new firebase.auth.FacebookAuthProvider();

loginGoogleButton.addEventListener('click',signInGoogle);
// loginFbButton.addEventListener('click',signInFacebook);


function signInGoogle(){
	firebase.auth().signInWithPopup(providerGoogle).then(function(result) {
	  // This gives you a Google Access Token. You can use it to access the Google API.
	  var token = result.credential.accessToken;
	  // The signed-in user info.
	  var user = result.user;
	  console.log(user);
	  // ...
	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // The email of the user's account used.
	  var email = error.email;
	  // The firebase.auth.AuthCredential type that was used.
	  var credential = error.credential;
	  // ...
	});
}


function signInFacebook(){
 
  firebase.auth().signInWithPopup(providerFb).then(function(result) {
  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
   console.log(user);
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});
}