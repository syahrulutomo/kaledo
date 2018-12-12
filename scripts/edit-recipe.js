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

			}).then(function(){

				fetch("https://kaledo-backend.herokuapp.com/api/recipe/"+localStorage.getItem('idRecipe'))
				.then(function(response){ 

					return response.json(); 
				
				}).then(function(data){ 
					
					self.title = data.title;
					self.description = data.description;

					var ingredients = data.ingredirentList;
					var dataIngredient = '';

					ingredients.forEach(function(item){
						dataIngredient = dataIngredient + item['ingredient']+"\n";
						self.idIngredients.push(item['id']);
					})
					dataIngredient = dataIngredient.substring(0, dataIngredient.length-1);
					self.ingredients = dataIngredient;

					var directions = data.directionList;
					var dataDirection = '';

					directions.forEach(function(item){
						dataDirection = dataDirection + item['direction']+"\n";
						self.idDirections.push(item['id']);
					})
					dataDirection = dataDirection.substring(0, dataDirection.length-1);
					self.directions = dataDirection;
					
					fetch('https://kaledo-backend.herokuapp.com/api/category')
					.then(function(response){
						return response.json();
					})
					.then(function(data){

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

			if(fetch){
				document.querySelector('.loader').style.display = "inline";
			}

			let self = this;

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
						

					fetch('https://kaledo-backend.herokuapp.com/api/recipe'+idRecipe+'/category'+idCategory+'/user'+email, {
						method: 'PUT',
						headers: {
									"Content-Type": "application/json; charset=utf-8",
								 },	
						body: JSON.stringify(objRecipe1)
											
					}).then(function(){

						async function postIngredients(array,idRecipe){
							for (var i = 0 ; i < array.length; i++){
								await axios.post('https://kaledo-backend.herokuapp.com/api/ingredient/recipe'+idRecipe,{
									ingredient: array[i]
								})
							}

							localStorage.setItem('ingredients','done');

							if(localStorage.getItem('directions') == 'done' && localStorage.getItem('ingredients') == 'done'){
								localStorage.removeItem('directions');
								localStorage.removeItem('ingredients');
								localStorage.removeItem('recipeThumbnail');
								localStorage.removeItem('idRecipe');
								window.location = 'profil.html';
							}
						}

						function deleteIngredients(idIngredients){
					
							axios.delete('https://kaledo-backend.herokuapp.com/api/ingredient/'+idIngredients)
																																
						}

						var ingredient = document.querySelector('.recipe-ingredients').value.split("\n");
						var idRecipe = localStorage.getItem('idRecipe');
						
						var idIngredients = self.idIngredients;

						idIngredients.forEach(function(item){

							deleteIngredients(item);

						});

						postIngredients(ingredient,idRecipe);
						
						async function postDirections(array,idRecipe){
							for (var i = 0 ; i < array.length; i++){
								await axios.post('https://kaledo-backend.herokuapp.com/api/direction/recipe'+idRecipe,{
									direction: array[i]
								})
							}

							localStorage.setItem('directions','done');
						
							if(localStorage.getItem('directions') == 'done' && localStorage.getItem('ingredients') == 'done'){
								localStorage.removeItem('directions');
								localStorage.removeItem('ingredients');
								localStorage.removeItem('recipeThumbnail');
								localStorage.removeItem('idRecipe');
								window.location = 'profil.html';
							}
						}
						
						function deleteDirections(idDirections){

							axios.delete('https://kaledo-backend.herokuapp.com/api/direction/'+idDirections)
									
						}

						var direction = document.querySelector('.recipe-directions').value.split("\n");
						var idRecipe = localStorage.getItem('idRecipe');
						
						var idDirections = self.idDirections;

						idDirections.forEach(function(item){

							deleteDirections(item);

						});

						postDirections(direction, idRecipe);
					});

						
								    						
				});	// end of uploadTask.snapshot 

				}	// end of anonymous func to handle successfull upload

				); //end of uploadTask.on('state_changed', function(snapshot){	



			} else {

					var objRecipe1 = new Object();

					if(document.querySelector('.sub-category').value !== 'Other')
					{
						objRecipe1	=	{	title: document.querySelector('.recipe-title').value,
											description: document.querySelector('.recipe-description').value,
											subCategory: document.querySelector('.sub-category').value,
											time: document.querySelector('.cook-time').value,
											photos: localStorage.getItem('recipeThumbnail')
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
											photos: localStorage.getItem('recipeThumbnail')
							    		}

					}
						

					fetch('https://kaledo-backend.herokuapp.com/api/recipe'+idRecipe+'/category'+idCategory+'/user'+email, {
						method: 'PUT',
						headers: {
									"Content-Type": "application/json; charset=utf-8",
								 },	
						body: JSON.stringify(objRecipe1)
											
					}).then(function(){

						async function postIngredients(array,idRecipe){
							for (var i = 0 ; i < array.length; i++){
								await axios.post('https://kaledo-backend.herokuapp.com/api/ingredient/recipe'+idRecipe,{
									ingredient: array[i]
								})
							}

							localStorage.setItem('ingredients','done');
					
							if(localStorage.getItem('directions') == 'done' && localStorage.getItem('ingredients') == 'done'){
								localStorage.removeItem('directions');
								localStorage.removeItem('ingredients');
								localStorage.removeItem('recipeThumbnail');
								localStorage.removeItem('idRecipe');
								window.location = 'profil.html';
							}
						}

						function deleteIngredients(idIngredients){
					
							axios.delete('https://kaledo-backend.herokuapp.com/api/ingredient/'+idIngredients)
																																
						}

						var ingredient = document.querySelector('.recipe-ingredients').value.split("\n");
						var idRecipe = localStorage.getItem('idRecipe');
						
						var idIngredients = self.idIngredients;

						idIngredients.forEach(function(item){

							deleteIngredients(item);

						});

						postIngredients(ingredient,idRecipe);
						
						async function postDirections(array,idRecipe){
							for (var i = 0 ; i < array.length; i++){
								await axios.post('https://kaledo-backend.herokuapp.com/api/direction/recipe'+idRecipe,{
									direction: array[i]
								})
							}

							localStorage.setItem('directions','done');
						
							if(localStorage.getItem('directions') == 'done' && localStorage.getItem('ingredients') == 'done'){
								localStorage.removeItem('directions');
								localStorage.removeItem('ingredients');
								localStorage.removeItem('recipeThumbnail');
								localStorage.removeItem('idRecipe');
								window.location = 'profil.html';
							}
						}
						
						function deleteDirections(idDirections){

							axios.delete('https://kaledo-backend.herokuapp.com/api/direction/'+idDirections)
									
						}

						var direction = document.querySelector('.recipe-directions').value.split("\n");
						var idRecipe = localStorage.getItem('idRecipe');
						
						var idDirections = self.idDirections;

						idDirections.forEach(function(item){

							deleteDirections(item);

						});

						postDirections(direction, idRecipe);
					});



			}

		} //end of saveRecipe
	}
})