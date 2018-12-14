new Vue({
	el: 'main',
	data:{
		categories: [],
		subCategories: [],
		users: [],
		recipes: [],
		search: '', 
		footer: document.querySelector('.footer-recipe')
	},
	created: function(){
		var self = this;

		fetch('https://kaledo-backend.herokuapp.com/api/category')
		.then(function(response){
			return response.json();
		})
		.then(async function(data){

			var categoryName = new Array();
			var subCategory = new Array();
			var user = new Array();
			let obj = new Object();
			
			for (var i = 0; i < data['content'].length ; i++) {		
					
				if( categoryName.indexOf(data['content'][i]['categoryName']) === -1 ){
					categoryName.push(data['content'][i]['categoryName']);
					self.categories.push(data['content'][i]['categoryName']);
					
					var category_name = data['content'][i]['categoryName']; 
					var size = data['content'][i]['recipeList'].length;
					
					self.categories[category_name] = new Array(size);

					for(var j = 0; j < size; j++){

						if(subCategory.indexOf(data['content'][i]['recipeList'][j]['subCategory']) === -1 ){
						
							subCategory.push(data['content'][i]['recipeList'][j]['subCategory']);
							self.categories[category_name][j] = data['content'][i]['recipeList'][j]['subCategory'];			

						}else{
							self.categories[category_name][j] = null;
						}
						
						obj = data['content'][i]['recipeList'][j];

						await fetch('https://kaledo-backend.herokuapp.com/api/recipe/id'+data['content'][i]['recipeList'][j]['id'])
						.then(function(response){
							return response.json();
						}).then(function(dataUser){
							obj.firstName = dataUser['content'][0]['firstName'];
							obj.lastName = dataUser['content'][0]['lastName'];
							obj.profilPicture = dataUser['content'][0]['profilPicture'];
							
						})
						self.recipes.push(obj);
					}	
				}
				var footer = document.querySelector('.footer-search');

				if(self.recipes.length >= 2){
					footer.style.position = 'relative';
				}else{
					footer.style.position = 'absolute';
				}	

			}	
			
			
			
		})

			

			console.log(self.categories);
			console.log(self.subCategories);
			console.log(self.recipes);	

	},
	computed:{
		filteredRecipes: function(){

			return this.recipes.filter((recipe)=> {
				return this.subCategories.includes(recipe['subCategory']);
			});
			
		}
		
	},
	methods: {
		viewRecipe: function(){

			targetId = event.currentTarget.getAttribute('data-id');
  			console.log(targetId);
  			localStorage.setItem('idRecipe',targetId);
  			window.location = 'view-recipe.html'

		},
		openAppertizer: function(){
			var appertizer = document.querySelectorAll('.Appertizer');
			var main = document.querySelectorAll('.Main');
			var dessert = document.querySelectorAll('.Dessert');
			var drinks = document.querySelectorAll('.Drinks');
			
			if(event.currentTarget.getAttribute('id') === 'dropdown-0'){
				event.target.addEventListener('click', function(e){
					for(var i = 0; i < appertizer.length; i++){
						appertizer[i].classList.toggle('open');
						e.stopPropagation();
					}
				});
			}
			else if(event.currentTarget.getAttribute('id') === 'dropdown-1'){
				event.target.addEventListener('click', function(e){
					for(var i = 0; i < main.length; i++){
						main[i].classList.toggle('open');
						e.stopPropagation();
					}
				});
			}
			else if(event.currentTarget.getAttribute('id') === 'dropdown-2'){
				event.target.addEventListener('click', function(e){
					for(var i = 0; i < dessert.length; i++){
						dessert[i].classList.toggle('open');
						e.stopPropagation();
					}
				});
			}
			else if(event.currentTarget.getAttribute('id') === 'dropdown-3'){
				event.target.addEventListener('click', function(e){
					for(var i = 0; i < drinks.length; i++){
						drinks[i].classList.toggle('open');
						e.stopPropagation();
					}
				});
			}

		
		}
	}

})


document.addEventListener("DOMContentLoaded", function(event) {
    var filterToggle = document.querySelector('.filter-toggle');
		var filter = document.querySelector('.filter');

		filterToggle.addEventListener('click', function(e){
			filter.classList.toggle('open');
			e.stopPropagation();
		});

		var dropdown = document.querySelector('.dropdown-icon');
		var dropdown1 = document.querySelector('#dropdown-1');
		var dropdown2 = document.querySelector('#dropdown-2');
		var dropdown3 = document.querySelector('#dropdown-3');

		// var appertizer = document.querySelectorAll('.Appertizer');
		// var main = document.querySelectorAll('.Main');
		// var dessert = document.querySelectorAll('.Dessert');
		// var drinks = document.querySelectorAll('.Drinks');
				
		// dropdown[0].addEventListener('click', function(e){
		// 	for(var i = 0; i < appertizer.length; i++){
		// 		appertizer[i].classList.toggle('open');
		// 		e.stopPropagation();
		// 	}
			
		// });
		
		// dropdown1.addEventListener('click', function(e){
		// 	for(var i = 0; i < main.length; i++){
		// 		main[i].classList.toggle('open');
		// 		e.stopPropagation();
		// 	}
			
		// });

		// dropdown2.addEventListener('click', function(e){
		// 	for(var i = 0; i < dessert.length; i++){
		// 		dessert[i].classList.toggle('open');
		// 		e.stopPropagation();
		// 	}
			
		// });

		// dropdown3.addEventListener('click', function(e){
		// 	for(var i = 0; i < drinks.length; i++){
		// 		drinks[i].classList.toggle('open');
		// 		e.stopPropagation();
		// 	}
			
		// });
  });