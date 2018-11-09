
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
     // console.log('Welcome!  Fetching your information.... ');
     // console.log(response);
     FB.api('/me', { locale: 'en_US', fields: 'id, name, email' },  
      function(response) {

        console.log(response);

        userFb['id'] = response.id;
        userFb['firstName']= JSON.stringify(response.name).split(' ')[0];
        userFb['lastName']= JSON.stringify(response.name).split(' ')[1];
        userFb['email'] = response.email;
        userFb['profilPicture'] = 'https://graph.facebook.com/v3.1/'+response.id+'/picture?height=80&type=square';

        document.querySelector('.profil-img').src = 'https://graph.facebook.com/v3.1/'+response.id+'/picture?height=80&type=square';

        localStorage.setItem('email',userFb['email']);
        localStorage.setItem('firstName',userFb['firstName']);
        localStorage.setItem('lastName',userFb['lastName']);
        localStorage.setItem('profilPicture',userFb['profilPicture']);

        var objUser = new Object();
        objUser =  checkUser(localStorage.getItem('email'));

        if(objUser == null){
            var name = userFb['name'];
            postData('https://kaledo-backend.herokuapp.com/api/users/',userFb);
        }else if(objUser !== null){
            localStorage.setItem('firstName',objUser['firstName']);
            localStorage.setItem('lastName',objUser['lastName']);
            localStorage.setItem('profilPicture',objUser['profilPicture']);
        }

        // location.reload();

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
	  console.log(user);

    userGoogle['email']  = user.email;
    userGoogle['firstName']= JSON.stringify(user.displayName).split(' ')[0];
    userGoogle['lastName']= JSON.stringify(user.displayName).split(' ')[1];
    userGoogle['profilPicture'] = user.photoURL; 

    document.querySelector('.profil-img').src = userGoogle['url_photo'];

    localStorage.setItem('email',userGoogle['email']);
    localStorage.setItem('firstName',userGoogle['firstName']);
    localStorage.setItem('lastName',userGoogle['lastName']);
    localStorage.setItem('profilPicture',userGoogle['profilPicture']);

    var objUser = new Object();
    objUser =  checkUser(localStorage.getItem('email'));

    if(objUser == null){
        var name = userGoogle['name'];
        postData('https://kaledo-backend.herokuapp.com/api/users/',userGoogle);
    }else if(objUser !== null){
        localStorage.setItem('firstName',objUser['firstName']);
        localStorage.setItem('lastName',objUser['lastName']);
        localStorage.setItem('profilPicture',objUser['profilPicture']);
    }


    // location.reload();


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



function checkUser(email){
    
    return fetch('https://kaledo-backend.herokuapp.com/api/users/'+email)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        return data;
    })
}


function postData(url,data){
    fetch(url,{
      method:'POST',
      body: data
    }).then(function(response){
      return response.json();
    }).then(function(data){
      console.log('berhasil input');
    })
}