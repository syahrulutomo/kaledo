document.addEventListener("DOMContentLoaded", function(event) {

	var select = document.querySelector('#select-category');

	fetch('https://kaledo-backend.herokuapp.com/api/category')
	.then(function(response){
		return response.json();
	})
	.then(function(data){
		
		var category = data['content'];
		
		category.forEach(function(item){
			
			var name = item['categoryName'];
			
			var option = document.createElement("option");
			option.text = name;
			option.value = name;
			option.setAttribute('data-id',item['id']);

			select.appendChild(option);
		});		

	
		
	});

})


new Vue({
	el: '#add-recipe-container',
	data:{
		title: '',
		description: '',
		ingredients: '',
		directions: '',
		category: '',
		subCategory: '',
		photo: '',
		time: ''

	},
	methods:{
		saveRecipe: function(){

			if(fetch){
				document.querySelector('.loader').style.display = "inline";
			}

			var idCategory = document.querySelector('#select-category').options[document.querySelector('#select-category').selectedIndex].getAttribute('data-id');
			var email = localStorage.getItem('email');

			axios.post('https://kaledo-backend.herokuapp.com/api/recipe/category'+idCategory+'/user'+email,{
				title: this.title,
				description: this.description,
				subCategory: this.subCategory,
				time: this.time
			})
			.then(function(response){
				console.log(response);
				var title =  document.querySelector('.recipe-title').value;

				if(response.status == 201){
					fetch('https://kaledo-backend.herokuapp.com/api/recipe/title'+title+'/user'+email)
					.then(function(responseGetRecipe){
						console.log(responseGetRecipe);
						return responseGetRecipe.json();
					}).then(function(data){
						console.log(data);
						return data.id;
					}).then(function(id){
						var ingredient = document.querySelector('.recipe-ingredients').value.split("\n");
						var direction = document.querySelector('.recipe-directions').value.split("\n");

						async function postIngredients(array){
							for (var i = 0 ; i < array.length; i++){
								await axios.post('https://kaledo-backend.herokuapp.com/api/ingredient/recipe'+id,{
									article: array[i]
								})
							}

							console.log('post article done!');
						}

						async function postDirections(array){
							for (var i = 0 ; i < array.length; i++){
								await axios.post('https://kaledo-backend.herokuapp.com/api/direction/recipe'+id,{
									article: array[i]
								})
							}

							console.log('post article done!');
						}

						postIngredients(ingredient);
						
						postDirections(direction);

						if(document.querySelector('.recipe-photo').value !== ''  || document.querySelector('.recipe-photo').files[0] !== undefined){


						var config = {
								    apiKey: "AIzaSyB4tu8OwisUwHb-AOZSOG1_sJXGTVIyZKo",
								    authDomain: "kaledostorage.firebaseapp.com",
								    databaseURL: "https://kaledostorage.firebaseio.com",
								    projectId: "kaledostorage",
								    storageBucket: "kaledostorage.appspot.com",
								    messagingSenderId: "27410977713"
								};
					 
							firebase.initializeApp(config);
						 

							var file =  document.querySelector(".recipe-photo").files[0];
							var fileName = file.name;
							
							var storageRef = firebase.storage().ref('user_'+email+'/recipe/'+  fileName);	

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

								  	firebase.database().ref('users'+emailString+'/recipe/').set({
								  		title: document.querySelector('.recipe-title').value,
								  		description: document.querySelector('.recipe-description').value,
								  		url: downloadURL
								  	});
									
									
								    objRecipe = {
						        		title: document.querySelector('.recipe-title').value,
										description: document.querySelector('.recipe-description').value,
										subCategory: document.querySelector('.sub-category').value,
										time: document.querySelector('.cook-time').value,
										photos: downloadURL
						        	};

									fetch('https://kaledo-backend.herokuapp.com/api/recipe/'+id, {
							        	method: 'PUT',
							        	// mode: "no-cors", // no-cors, cors, *same-origin
								        headers: {
								            "Content-Type": "application/json; charset=utf-8",
								            // "Content-Type": "application/x-www-form-urlencoded",
								        },	
							        	body: JSON.stringify(objRecipe)
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




