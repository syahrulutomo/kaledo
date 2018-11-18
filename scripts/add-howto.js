new Vue({
	el: '#add-howto-container',
	data:{
		title: '',
		articles: '',
		thumbnail: '',
		
	},
	methods:{
		saveHowto: function(){

			if(fetch){
				document.querySelector('.loader').style.display = "inline";
			}

			var email = localStorage.getItem('email');

			axios.post('https://kaledo-backend.herokuapp.com/api/howto/user'+email,{
				title: this.title
			})
			.then(function(response){
				console.log(response);
				var title =  document.querySelector('.howto-title').value;

				if(response.status == 201){
					fetch('https://kaledo-backend.herokuapp.com/api/howto/title'+title+'/user'+email)
					.then(function(responseGetHowto){
						console.log(responseGetHowto);
						return responseGetHowto.json();
					}).then(function(data){
						console.log(data);
						return data.id;
					}).then(function(id){
						var articles = document.querySelector('.articles').value.split("\n");
						console.log(articles);

						articles.forEach(function(item){
							axios.post('https://kaledo-backend.herokuapp.com/api/article/howto/'+id,{
								article: item
							}).then(function(response){
								console.log(response);
							})
						})
							
						

						if(document.querySelector('.howto-photo').value !== ''  || document.querySelector('.howto-photo').files[0] !== undefined){

						var config = {
								    apiKey: "AIzaSyB4tu8OwisUwHb-AOZSOG1_sJXGTVIyZKo",
								    authDomain: "kaledostorage.firebaseapp.com",
								    databaseURL: "https://kaledostorage.firebaseio.com",
								    projectId: "kaledostorage",
								    storageBucket: "kaledostorage.appspot.com",
								    messagingSenderId: "27410977713"
								};
					 
							firebase.initializeApp(config);
						 

							var file =  document.querySelector(".howto-photo").files[0];
							var fileName = file.name;
							
							var storageRef = firebase.storage().ref('user_'+email+'/howto/'+  fileName);	

							var uploadTask = storageRef.put(file);

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

							  		emailString = email.replace('.','dot');

								  	firebase.database().ref('users'+emailString+'/howto/').set({
								  		title: document.querySelector('.howto-title').value,
								  		url: downloadURL
								  	});
									
									
								    objHowto = {
						        		title: document.querySelector('.howto-title').value,
										thumbnail: downloadURL
						        	};

									fetch('https://kaledo-backend.herokuapp.com/api/howto/'+id, {
							        	method: 'PUT',
							        	// mode: "no-cors", // no-cors, cors, *same-origin
								        headers: {
								            "Content-Type": "application/json; charset=utf-8",
								            // "Content-Type": "application/x-www-form-urlencoded",
								        },	
							        	body: JSON.stringify(objHowto)
							        })
									.then(function(){
										
										document.location.reload(true);
										
									});

								  	});	// end of uploadTask.snapshot  

									});	// end of anonymous func to handle successfull upload

								}else{
										
									document.location.reload(true);
								}
								
					})

				} //end of if	
			})	
					
		}
	}
})




