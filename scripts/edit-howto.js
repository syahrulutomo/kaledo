
new Vue({
	el: '#edit-howto-container',
	
	data: {
		title: '',
		articles: '',
		thumbnail: '',
		idArticles: []
	}

	, mounted: function(){

		var self = this;
		var idHowto = localStorage.getItem('idHowto');

		fetch('https://kaledo-backend.herokuapp.com/api/howto/'+idHowto)
		.then(function(response){
			return response.json();
		})
		.then(function(data){
			self.title = data['title'];
			var dataArticles = data['articleList']
			var articles = '';

			dataArticles.forEach(function(item){
				articles = articles + item['article'] +"\n";
				self.idArticles.push(item['id']);
			})
			articles = articles.substring(0, articles.length-1);

			self.articles = articles;	
			self.thumbnail = data['thumbnail'];
		});
		console.log(self.idArticles);
	}

	,methods: {

		saveHowto: function(){

			if(fetch){
				document.querySelector('.loader').style.display = "inline";
			}

			let self = this;

			var idHowto = localStorage.getItem('idHowto');
			var email = localStorage.getItem('email');
			var thumbnail = localStorage.getItem('howtoThumbnail');
			
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
					  alert(error);
				}, function() {					

					// Handle successful uploads on complete
					uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {

					var obj = new Object();

					obj	=	{	
								title: self.title,
								thumbnail: downloadURL
					    	}
					
					fetch('https://kaledo-backend.herokuapp.com/api/howto'+idHowto+'/user'+email, {
						method: 'PUT',
						headers: {
									"Content-Type": "application/json; charset=utf-8",
								 },	
						body: JSON.stringify(obj)
											
					}).then(function(){

						async function postArticle(array,idHowto){
							for (var i = 0 ; i < array.length; i++){
								await axios.post('https://kaledo-backend.herokuapp.com/api/article/howto/'+idHowto,{
									article: array[i]
								})
							}

							localStorage.setItem('articles','done');

							if(localStorage.getItem('articles') == 'done' ){
								localStorage.removeItem('articles');
								window.location = 'profil.html';
							}
						}

						function deleteArticle(idArticle){
					
							axios.delete('https://kaledo-backend.herokuapp.com/api/article/'+idArticle)
																																
						}

						var article = document.querySelector('.articles').value.split("\n");
						var idHowto = localStorage.getItem('idHowto');
						
						var idArticles = self.idArticles;

						idArticles.forEach(function(item){

							deleteArticle(item);

						});

						postArticle(article,idHowto);					
						
					});

						
								    						
				});	// end of uploadTask.snapshot 

				}	// end of anonymous func to handle successfull upload

				); //end of uploadTask.on('state_changed', function(snapshot){	



			} else {

					var obj1 = new Object();

					obj1	=	{	
								title: self.title,
								thumbnail: localStorage.getItem('howtoThumbnail')
					    	}
					
					fetch('https://kaledo-backend.herokuapp.com/api/howto'+idHowto+'/user'+email, {
						method: 'PUT',
						headers: {
									"Content-Type": "application/json; charset=utf-8",
								 },	
						body: JSON.stringify(obj1)
											
					}).then(function(){

						async function postArticle(array,idHowto){
							for (var i = 0 ; i < array.length; i++){
								await axios.post('https://kaledo-backend.herokuapp.com/api/article/howto/'+idHowto,{
									article: array[i]
								})
							}

							localStorage.setItem('articles','done');

							if(localStorage.getItem('articles') == 'done' ){
								localStorage.removeItem('articles');
								window.location = 'profil.html';
							}
						}

						function deleteArticle(idArticle){
					
							axios.delete('https://kaledo-backend.herokuapp.com/api/article/'+idArticle)
																																
						}

						var article = document.querySelector('.articles').value.split("\n");
						var idHowto = localStorage.getItem('idHowto');
						
						var idArticles = self.idArticles;

						idArticles.forEach(function(item){

							deleteArticle(item);

						});

						postArticle(article,idHowto);				
						
					});


			}

		} //end of saveRecipe
	}
})