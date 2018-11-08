
var email = localStorage.getItem('email');


if(email !== null){
    window.location = 'profil.html';
    document.querySelector('profil-link').href = 'profil.html';
    document.querySelector('profil-link-index').href = 'profil.html';  
}else{
    window.location = 'signin.html';
    document.querySelector('profil-link').href = 'signin.html';
    document.querySelector('profil-link-index').href = 'signin.html';
}


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
     
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

var userFb = new Object();
loginFbButton.onclick = function(){
  FB.login(function(response) {
    if (response.authResponse) {
     console.log('Welcome!  Fetching your information.... ');
     console.log(response);
     FB.api('/me', { locale: 'en_US', fields: 'id, name, email' },  
      function(response) {
        console.log('Good to see you, ' + response.name + '.');
        console.log('Your email is ' + response.email + '.');
        console.log('id, ' + response.id + '.');

        userFb['id'] = response.id;
        userFb['name'] = response.name;
        userFb['email'] = response.email;
        userFb['url_photo'] = 'https://graph.facebook.com/v3.1/'+response.id+'/picture?height=80&type=square';

        document.querySelector('.profil-img').src = 'https://graph.facebook.com/v3.1/'+response.id+'/picture?height=80&type=square';

        localStorage.setItem('email',userFb['email']);
        localStorage.setItem('name',userFb['name']);
        localStorage.setItem('photo',userFb['url_photo']);

      });

    // console.log(userFb);

    } else {
     console.log('User cancelled login or did not fully authorize.');
    }
});

}


var providerGoogle = new firebase.auth.GoogleAuthProvider();
loginGoogleButton.addEventListener('click',signInGoogle);


var userGoogle = new Object();
function signInGoogle(){
	firebase.auth().signInWithPopup(providerGoogle).then(function(result) {
	  // This gives you a Google Access Token. You can use it to access the Google API.
	  var token = result.credential.accessToken;
	  // The signed-in user info.
	  var user = result.user;
	  // console.log(user);

    userGoogle['email']  = user.email;
    userGoogle['name'] = user.displayName;
    userGoogle['url_photo'] = user.photoURL; 

    localStorage.setItem('email',userGoogle['email']);
    localStorage.setItem('name',userGoogle['name']);
    localStorage.setItem('photo',userGoogle['url_photo']);


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
