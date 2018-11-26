document.addEventListener("DOMContentLoaded", function(event) {

	var selectCategory = document.querySelector('#select-category');

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

			selectCategory.appendChild(option);
		});

	});

})

new Vue({
	el: '#edit-recipe-container',
	
	data: {
		title: '',
		description: '',
		ingredients: '',
		directions: '',
		category: '',
		subCategorySelect: '',
		subCategoryInput: '',
		photos: '',
		time: '',
		appertizers: '',
		mainCourses: '',
		desserts: '',
		drinks: '',
		idDirections: [],
		idIngredients: []
	}

	, mounted: function(){

		var self = this;

		fetch('https://kaledo-backend.herokuapp.com/api/category')
			.then(function(response){
				return response.json();
			})
			.then(function(data){
				self.appertizers = data['content'][0]['recipeList'];
				self.mainCourses = data['content'][1]['recipeList'];
				self.desserts = data['content'][2]['recipeList'];
				self.drinks = data['content'][3]['recipeList'];	

				console.log(self.appertizer);
			}).then(function(){

				fetch("https://kaledo-backend.herokuapp.com/api/recipe/"+localStorage.getItem('idRecipe'))
				.then(function(response){ 

					return response.json(); 
				
				}).then(function(data){ 
					
					console.log(data);

					self.title = data.title;
					self.description = data.description;

					var ingredients = data.ingredirentList;
					var dataIngredient = '';

					ingredients.forEach(function(item){
						dataIngredient = dataIngredient + item['ingredient']+"\n";
						self.idIngredients.push(item['id']);
					})

					self.ingredients = dataIngredient;

					var directions = data.directionList;
					var dataDirection = '';

					directions.forEach(function(item){
						dataDirection = dataDirection + item['direction']+"\n";
						self.idDirections.push(item['id']);
					})

					self.directions = dataDirection;
					
					fetch('https://kaledo-backend.herokuapp.com/api/category')
					.then(function(response){
						return response.json();
					})
					.then(function(data){
						console.log(data);

						var idRecipe =  localStorage.getItem('idRecipe');
						var content = data['content'];
						var category = '';

						content.forEach(function(item){

							var recipe = item.recipeList;
							var categoryName = item.categoryName;

							recipe.forEach(function(item){
								if(item['id'] === idRecipe){
									category = categoryName;
								}
							})

						})

						console.log(category);
						self.category = category;
					
					})


					self.subCategorySelect = data.subCategory;
					self.photos = data.photos;
					self.time = data.time;

				})

			})

		
	}

	,methods: {

		saveRecipe: function(){

			var idRecipe = localStorage.getItem('idRecipe');
			var email = localStorage.getItem('email');
			var idCategory = document.querySelector('#select-category').options[document.querySelector('#select-category').selectedIndex].getAttribute('data-id');

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

					emailString = email.replace('.','dot');

					firebase.database().ref('users'+emailString+'/recipe/').set({
						title: document.querySelector('.recipe-title').value,
						description: document.querySelector('.recipe-description').value,
						url: downloadURL
					});
					
					var objRecipe1 = new Object();

					if(document.querySelector('.sub-category').value !== 'Other')
					{
						objRecipe1	=	{	title: document.querySelector('.recipe-title').value,
											description: document.querySelector('.recipe-description').value,
											subCategory: document.querySelector('.sub-category').value,
											time: document.querySelector('.cook-time').value,
											photos: downloadURL
							    		}

					}else if(document.querySelector('.sub-category').value === 'Other'){

						var subCategoryInput = document.querySelector('#subCategory-box').value.toLowerCase().split(' ');

						for(var i = 0; i < subCategoryInput.length; i++ ){
							subCategoryInput[i] =  subCategoryInput[i].charAt(0).toUpperCase() + subCategoryInput[i].substring(1);	 
						}

						subCategoryInput  = subCategoryInput.join(' '); 

						objRecipe1	=	{	title: document.querySelector('.recipe-title').value,
											description: document.querySelector('.recipe-description').value,
											subCategory: subCategoryInput,
											time: document.querySelector('.cook-time').value,
											photos: downloadURL
							    		}

					}
						

					fetch('https://kaledo-backend.herokuapp.com/api/recipe/'+idRecipe, {
						method: 'PUT',
						headers: {
									"Content-Type": "application/json; charset=utf-8",
								 },	
						body: JSON.stringify(objRecipe1)
											
					}).then(function(){
						console.log(self.idDirections);
						console.log(self.idIngredients);

							async function putIngredients(array,idIngredients,idRecipe){
								
									for (var i = 0 ; i < array.length; i++){
										await axios.delete('https://kaledo-backend.herokuapp.com/api/ingredient/'+idIngredients[i])
									}

									for (var i = 0 ; i < array.length; i++){
											await axios.post('https://kaledo-backend.herokuapp.com/api/ingredient/'+idRecipe,{
												ingredient: array[i]
											})
										}
														
									localStorage.setItem('ingredients','done');
									console.log('put ingredients done!');	

									if(localStorage.getItem('directions') == 'done' && localStorage.getItem('ingredients') == 'done'){
										localStorage.removeItem('directions');
										localStorage.removeItem('ingredients');
										window.location = 'profil.html';
									}																		
							}

							var ingredient = document.querySelector('.recipe-ingredients').value.split("\n");
							putIngredients(ingredient,self.idIngredients,idRecipe);
						
							async function putDirections(array,idDirections,idRecipe){

								var idDirections =  self.idDirections;
								var idRecipe = localStorage.getItem('idRecipe');

									for (var i = 0 ; i < array.length; i++){
										await axios.delete('https://kaledo-backend.herokuapp.com/api/direction/'+idDirections[i])
									}

									for (var i = 0 ; i < array.length; i++){
										await axios.post('https://kaledo-backend.herokuapp.com/api/direction/'+idRecipe,{
											direction: array[i]
										})
									}

									localStorage.setItem('directions','done');
									console.log('put directions done!');

									if(localStorage.getItem('directions') == 'done' && localStorage.getItem('ingredients') == 'done'){
										localStorage.removeItem('directions');
										localStorage.removeItem('ingredients');
										window.location = 'profil.html';
									}
							}

							var direction = document.querySelector('.recipe-directions').value.split("\n");
							putDirections(direction,idDirections,idRecipe);


					});

						
								    						
				});	// end of uploadTask.snapshot 

				}	// end of anonymous func to handle successfull upload

				); //end of uploadTask.on('state_changed', function(snapshot){	



			} else {



			}

		} //end of saveRecipe
	}
})