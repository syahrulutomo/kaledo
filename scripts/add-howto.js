new Vue({
	el: '#add-howto-container',
	data:{
		title: '',
		articles: '',
		thumbnail: '',
		
	},
	methods:{
		saveHowto: function(){

			var email = localStorage.getItem('email');

			if(fetch){
				document.querySelector('.loader').style.display = "inline";
			}

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

				uploadTask.on('state_changed', function(snapshot){
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

						uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {

							objHowto = {
								title: document.querySelector('.howto-title').value,
								thumbnail: downloadURL
							};

							fetch('https://kaledo-backend.herokuapp.com/api/howto/user'+email, {
							
								method: 'POST',
								headers: {
											"Content-Type": "application/json; charset=utf-8",
									     },	
								body: JSON.stringify(objHowto)
							
							})
							.then(function(){

								var title =  document.querySelector('.howto-title').value;

								fetch('https://kaledo-backend.herokuapp.com/api/howto/title'+title+'/user'+email)
								.then(function(responseID){
								
									return responseID.json();
								
								}).then(function(data){
									
									return data.id;

								}).then(function(id){

									var articles = document.querySelector('.articles').value.split("\n");
									
									async function postArticle(array){
										for (var i = 0 ; i < array.length; i++){
											await axios.post('https://kaledo-backend.herokuapp.com/api/article/howto/'+id,{
												article: array[i]
											})
										}

										localStorage.setItem('articles','done');
									
										if(localStorage.getItem('articles') == 'done'){
									
												localStorage.removeItem('articles');
												window.location = 'profil.html';
										}	

									}
										
									postArticle(articles);

								});
											
							});

					  	});	// end of uploadTask.snapshot  

				});	// end of anonymous func to handle successfull upload

			}
			
			else {
				objHowto = {
								title: document.querySelector('.howto-title').value,
						   };

				fetch('https://kaledo-backend.herokuapp.com/api/howto/user'+email, {
							
					method: 'POST',
					headers: {
								"Content-Type": "application/json; charset=utf-8",
						     },	
					body: JSON.stringify(objHowto)
							
				})
				.then(function(){

					var title =  document.querySelector('.howto-title').value;

					fetch('https://kaledo-backend.herokuapp.com/api/howto/title'+title+'/user'+email)
					.then(function(responseID){
								
						return responseID.json();
								
					}).then(function(data){
									
						return data.id;

					}).then(function(id){

						var articles = document.querySelector('.articles').value.split("\n");
				
						async function postArticle(array){
							for (var i = 0 ; i < array.length; i++){
								await axios.post('https://kaledo-backend.herokuapp.com/api/article/howto/'+id,{
									article: array[i]
								})
							}

							localStorage.setItem('articles','done');
						
							if(localStorage.getItem('articles') == 'done'){
						
									localStorage.removeItem('articles');
									window.location = 'profil.html';
							}	
						
						}
										
						postArticle(articles);
									
					});
											
				});

			}

			
					
		}
	}
})




