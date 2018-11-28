
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
     FB.api('/me', { locale: 'en_US', fields: 'id, name, email' },  
      function(response) {

        userFb['id'] = response.id;
        var name = response.name;
        userFb['firstName'] = name.split(' ')[0];
        userFb['lastName'] = name.split(' ')[1];
        userFb['email'] = response.email;
        userFb['profilPicture'] = 'https://graph.facebook.com/v3.1/'+response.id+'/picture?height=80&type=square';

        document.querySelector('.profil-img').src = 'https://graph.facebook.com/v3.1/'+response.id+'/picture?height=80&type=square';

        localStorage.setItem('email',userFb['email']);
        localStorage.setItem('profilPicture',userFb['profilPicture']);

        localStorage.setItem('firstName',userFb['firstName']);
        localStorage.setItem('lastName',userFb['lastName']);
        

        var objUser = new Object();

        fetch('https://kaledo-backend.herokuapp.com/api/users/'+userFb['email'])
        .then(res => res.json())
        .then(data => objUser = data)
        .then(function(objUser){
          if(objUser === null){
            axios.post(`https://kaledo-backend.herokuapp.com/api/users`,{
              email: userFb['email'],
              firstName: userFb['firstName'],
              lastName: userFb['lastName'],
              profilPicture: userFb['profilPicture']   
            })
            .then(function(response){
              if(response.status === 201){
                window.location = 'profil.html';
              }
            })
            .catch(e => {
            })

            
          }else{
            
            localStorage.setItem('firstName',objUser['firstName']);
            localStorage.setItem('lastName',objUser['lastName']);
            localStorage.setItem('profilPicture',objUser['profilPicture']);

            window.location = 'profil.html';

          }
        });

      })

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

    userGoogle['email']  = user.email;
    var name = user.displayName;
    userGoogle['firstName'] = name.split(' ')[0];
    userGoogle['lastName'] = name.split(' ')[1];
    userGoogle['profilPicture'] = user.photoURL; 

    document.querySelector('.profil-img').src = userGoogle['profilPicture'];

    localStorage.setItem('email',userGoogle['email']);
    localStorage.setItem('profilPicture',userGoogle['profilPicture']);

    localStorage.setItem('firstName',userGoogle['firstName']);
    localStorage.setItem('lastName',userGoogle['lastName']);

     var objUser = new Object();

    fetch('https://kaledo-backend.herokuapp.com/api/users/'+userGoogle['email'])
      .then(res => res.json())
      .then(data => objUser = data)
      .then(function(objUser){
        if(objUser === null){
          axios.post(`https://kaledo-backend.herokuapp.com/api/users`,{
            email: userGoogle['email'],
            firstName: userGoogle['firstName'],
            lastName: userGoogle['lastName'],
            profilPicture: userGoogle['profilPicture']   
          })
          .then(function(response){
              if(response.status === 201){
                window.location = 'profil.html';
              }
          })
          .catch(e => {
          })

        }else{

          localStorage.setItem('firstName',objUser['firstName']);
          localStorage.setItem('lastName',objUser['lastName']);
          localStorage.setItem('profilPicture',objUser['profilPicture']);
          localStorage.setItem('objUser',JSON.stringify(objUser));

          window.location = 'profil.html';
      }
      });
    

    


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






    
