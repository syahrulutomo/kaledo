
new Vue({
	el: 'main',
	data:{
		categories: [],
		subCategories: [],
		recipes: [],
		users: [],
		search: '', 
		footer: document.querySelector('.footer-recipe')
	},
	created: function(){
		var self = this;

		fetch('https://kaledo-backend.herokuapp.com/api/category/recipe/user')
		.then(function(response){
			return response.json();
		})
		.then(function(data){

			var categoryName = new Array();
			var subCategory = new Array();
			
			for (var i = data['content'].length - 1; i >= 0  ; i--) {		
					
				if( categoryName.indexOf(data['content'][i][0]['categoryName']) === -1 ){
					categoryName.push(data['content'][i][0]['categoryName']);
					self.categories.push(data['content'][i][0]['categoryName']);
					
					var category_name = data['content'][i][0]['categoryName']; 
					var size = data['content'][i][0]['recipeList'].length;
					
					self.categories[category_name] = new Array(size);

					for(var j = 0; j < size; j++){

						if(subCategory.indexOf(data['content'][i][0]['recipeList'][j]['subCategory']) === -1 ){
						
							subCategory.push(data['content'][i][0]['recipeList'][j]['subCategory']);
							self.categories[category_name][j] = data['content'][i][0]['recipeList'][j]['subCategory'];			
						
						}else{
							self.categories[category_name][j] = null;
						}

						self.recipes.push(data['content'][i][0]['recipeList'][j]);
						self.users.push(data['content'][i][1]);	

					}
				}
			}

			var footer = document.querySelector('.footer-search');

			if(self.recipes.length >= 2){
				footer.style.position = 'relative';
			}else{
				footer.style.position = 'absolute';
			}	

		})

		console.log(self.subCategories);
		console.log(self.recipes);

		
		
	},

	updated: function(){

		var self = this;
		var filterToggle = document.querySelector('.filter-toggle');
		var filter = document.querySelector('.filter');

		filterToggle.addEventListener('click', function(e){
			filter.classList.toggle('open');
			e.stopPropagation();
		});

		var dropdown0 = document.querySelector('#dropdown-0');
		var dropdown1 = document.querySelector('#dropdown-1');
		var dropdown2 = document.querySelector('#dropdown-2');
		var dropdown3 = document.querySelector('#dropdown-3');

		var appertizer = document.querySelectorAll('.Appertizer');
		var main = document.querySelectorAll('.Main');
		var dessert = document.querySelectorAll('.Dessert');
		var drinks = document.querySelectorAll('.Drinks');
				
		dropdown0.addEventListener('click', function(e){
			for(var i = 0; i < appertizer.length; i++){
				appertizer[i].classList.toggle('open');
				e.stopPropagation();
			}
			
		});
		
		dropdown1.addEventListener('click', function(e){
			for(var i = 0; i < main.length; i++){
				main[i].classList.toggle('open');
				e.stopPropagation();
			}
			
		});

		dropdown2.addEventListener('click', function(e){
			for(var i = 0; i < dessert.length; i++){
				dessert[i].classList.toggle('open');
				e.stopPropagation();
			}
			
		});

		dropdown3.addEventListener('click', function(e){
			for(var i = 0; i < drinks.length; i++){
				drinks[i].classList.toggle('open');
				e.stopPropagation();
			}
			
		});


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

		}
	}

})