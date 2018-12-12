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
	el: '#add-recipe-container',

	mounted: function(){
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
			})
		
	},

	data:{
		title: '',
		description: '',
		ingredients: '',
		directions: '',
		category: '',
		subCategorySelect: '',
		subCategoryInput: '',
		photo: '',
		time: '',
		appertizers: '',
		mainCourses: '',
		desserts: '',
		drinks: ''

	},

	methods:{
		saveRecipe: function(){

			if(fetch){
				document.querySelector('.loader').style.display = "inline";
			}

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
						

					fetch('https://kaledo-backend.herokuapp.com/api/recipe/category'+idCategory+'/user'+email, {
						method: 'POST',
						headers: {
									"Content-Type": "application/json; charset=utf-8",
								 },	
						body: JSON.stringify(objRecipe1)
											
					}).then(function(response){

						var title =  document.querySelector('.recipe-title').value;

						fetch('https://kaledo-backend.herokuapp.com/api/recipe/title'+title+'/user'+email)
						.then(function(responseID){
						
							return responseID.json();
						
						}).then(function(data){
							
							return data.id;

						}).then(function(id){

							var ingredient = document.querySelector('.recipe-ingredients').value.split("\n");
							var direction = document.querySelector('.recipe-directions').value.split("\n");

							async function postIngredients(array){
								for (var i = 0 ; i < array.length; i++){
									await axios.post('https://kaledo-backend.herokuapp.com/api/ingredient/recipe'+id,{
										ingredient: array[i]
									})
								}
												
								localStorage.setItem('ingredients','done');

								if(localStorage.getItem('directions') == 'done' && localStorage.getItem('ingredients') == 'done'){
									localStorage.removeItem('directions');
									localStorage.removeItem('ingredients');
									window.location = 'profil.html';
								}		
											
							}

							async function postDirections(array){
								for (var i = 0 ; i < array.length; i++){
									await axios.post('https://kaledo-backend.herokuapp.com/api/direction/recipe'+id,{
										direction: array[i]
									})
								}

								localStorage.setItem('directions','done');

								if(localStorage.getItem('directions') == 'done' && localStorage.getItem('ingredients') == 'done'){
									localStorage.removeItem('directions');
									localStorage.removeItem('ingredients');
									window.location = 'profil.html';
								}

							}

							postIngredients(ingredient);

							postDirections(direction);

						})
					
					})

								    						
				});	// end of uploadTask.snapshot 

				}	// end of anonymous func to handle successfull upload

				); //end of uploadTask.on('state_changed', function(snapshot){	


									

			} else {

				var objRecipe = new Object();

					if(document.querySelector('.sub-category').value !== 'Other')
					{
						objRecipe	=	{	title: document.querySelector('.recipe-title').value,
											description: document.querySelector('.recipe-description').value,
											subCategory: document.querySelector('.sub-category').value,
											time: document.querySelector('.cook-time').value,
										}

					}else if(document.querySelector('.sub-category').value === 'Other'){

						var subCategoryInput = document.querySelector('#subCategory-box').value.toLowerCase().split(' ');

						for(var i = 0; i < subCategoryInput.length; i++ ){
							subCategoryInput[i] =  subCategoryInput[i].charAt(0).toUpperCase() + subCategoryInput[i].substring(1);	 
						}

						subCategoryInput  = subCategoryInput.join(' ');

						objRecipe	=	{	title: document.querySelector('.recipe-title').value,
											description: document.querySelector('.recipe-description').value,
											subCategory: subCategoryInput,
											time: document.querySelector('.cook-time').value,
							    		}

					}		

					fetch('https://kaledo-backend.herokuapp.com/api/recipe/category'+idCategory+'/user'+email, {
						method: 'POST',
						headers: {
									"Content-Type": "application/json; charset=utf-8",
								 },	
						body: JSON.stringify(objRecipe)
											
					}).then(function(response){

						var title =  document.querySelector('.recipe-title').value;
					
						fetch('https://kaledo-backend.herokuapp.com/api/recipe/title'+title+'/user'+email)
						.then(function(responseGetRecipe){
						
							return responseGetRecipe.json();
						
						}).then(function(data){
							
							return data.id;

						}).then(function(id){
							var ingredient = document.querySelector('.recipe-ingredients').value.split("\n");
							var direction = document.querySelector('.recipe-directions').value.split("\n");

							async function postIngredients(array){
								for (var i = 0 ; i < array.length; i++){
									await axios.post('https://kaledo-backend.herokuapp.com/api/ingredient/recipe'+id,{
										ingredient: array[i]
									})
								}
												
								localStorage.setItem('ingredients','done');
											
									if(localStorage.getItem('directions') == 'done' && localStorage.getItem('ingredients') == 'done'){
										localStorage.removeItem('directions');
										localStorage.removeItem('ingredients');
										window.location = 'profil.html';
									}
							}

							async function postDirections(array){
								for (var i = 0 ; i < array.length; i++){
									await axios.post('https://kaledo-backend.herokuapp.com/api/direction/recipe'+id,{
										direction: array[i]
									})
								}

								localStorage.setItem('directions','done');
						
									if(localStorage.getItem('directions') == 'done' && localStorage.getItem('ingredients') == 'done'){
										localStorage.removeItem('directions');
										localStorage.removeItem('ingredients');
										window.location = 'profil.html';
									}
							}

							postIngredients(ingredient);

							postDirections(direction);

						})
					
					})
			}
			
		} // end of saveRecipe
		
	} //end of methods
}) //end of vue instance




