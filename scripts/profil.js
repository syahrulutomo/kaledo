var file =  document.querySelector("#file");
var uploadButton = document.querySelector('#upload-button');
var selectedFile = '';

var loginGoogleButton = document.querySelector('.login-google-button');

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


var provider = new firebase.auth.GoogleAuthProvider();


loginGoogleButton.addEventListener('click',signIn);


function signIn(){
	firebase.auth().signInWithPopup(provider).then(function(result) {
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

uploadButton.style.display = "none";




document.addEventListener('DOMContentLoaded',function() {
    document.querySelector('#file').onchange=changeEventHandler;
},false);

function changeEventHandler(event) {
    selectedFile = event.target.files[0];
    uploadButton.style.display = "inline-block";
    document.querySelector('.label-file').innerHTML	 = event.target.files[0].name;
}

uploadButton.addEventListener('click',uploadFile);

function uploadFile(){
	var fileName = selectedFile.name;

	var storageRef = firebase.storage().ref('kaledo-recipe/' + fileName);	

	var uploadTask = storageRef.put(selectedFile);

	// Register three observers:
	// 1. 'state_changed' observer, called any time the state changes
	// 2. Error observer, called on failure
	// 3. Completion observer, called on successful completion
	uploadTask.on('state_changed', function(snapshot){
	  // Observe state change events such as progress, pause, and resume
	  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
	  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
	  console.log('Upload is ' + progress + '% done');
	  switch (snapshot.state) {
	    case firebase.storage.TaskState.PAUSED: // or 'paused'
	      console.log('Upload is paused');
	      break;
	    case firebase.storage.TaskState.RUNNING: // or 'running'
	      console.log('Upload is running');
	      break;
	  }
	}, function(error) {
	  // Handle unsuccessful uploads
	}, function() {
	  // Handle successful uploads on complete
	  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
	  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
	  	var id = 1234;
	  	firebase.database().ref('recipe/' +id).set({
	  		username: 'syahrul',
	  		category: 'main course',
	  		subCategory: 'beef',
	  		url: downloadURL
	  	})
	    console.log('File available at', downloadURL);
	  });
	});

}
