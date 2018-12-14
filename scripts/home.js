document.addEventListener("DOMContentLoaded", function(event) { 

	var searchButton = document.querySelector('.search-btn');
	searchButton.addEventListener('click', function(){
		var searchBox = document.querySelector('.search-box').value;

		localStorage.setItem('recipeTitle',searchBox);
		window.location = 'static/search.html';
	});

});
 

new Vue({
	el: '.slider-container',
	data:{
		recipes: []
	},
	created: function(){
		var self = this;

		fetch('https://kaledo-backend.herokuapp.com/api/recipe')
		.then(function(response){
			return response.json();
		})
		.then(function(data){
			
			for(var i = data['content'].length - 1; i >  data['content'].length - 11 ; i--){
				self.recipes.push(data['content'][i]);
			}	

				

		})
	},
	methods: {
		viewRecipe: function(){

			targetId = event.currentTarget.getAttribute('data-id');
  			console.log(targetId);
  			localStorage.setItem('idRecipe',targetId);
  			window.location = 'static/view-recipe.html'

		}
	}
})


new Vue({
	el: '.recent-recipes',
	data:{
		categories: [],
		users: []
	},
	
	created: function(){
		var self = this;

		fetch('https://kaledo-backend.herokuapp.com/api/category/')
		.then(function(response){
			return response.json();
		})
		.then(function(data){

			var categoryName = new Array();
			var categories = new Array();
			var users = new Array();

			for (var i = 0; i < data['content'].length ; i++) {
				
				if( categoryName.indexOf(data['content'][i]['categoryName']) === -1 ){
					categoryName.push(data['content'][i]['categoryName']);
					self.categories.push(data['content'][i]);
					// self.users.push(data['content'][i]);
				}
				
			}

			var footer = document.querySelector('.footer-search');

			if(self.categories.length >= 2){
				footer.style.position = 'relative';
			}else{
				footer.style.position = 'absolute';
			}	

		})
	},
	methods: {
		viewRecipe: function(){

			targetId = event.currentTarget.getAttribute('data-id');
  			console.log(targetId);
  			localStorage.setItem('idRecipe',targetId);
  			window.location = 'static/view-recipe.html'

		}
	}

})	

