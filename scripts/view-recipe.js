
new Vue({
	el: '.view-recipe-container',
	data: {
		recipe: {}
	},
	created: function(){
		var self = this;

		var id = localStorage.getItem('idRecipe');

		fetch('https://kaledo-backend.herokuapp.com/api/recipe/'+id)
		.then(function(response){
			return response.json();
		})
		.then(function(data){

			self.recipe = data;
			

		})
	}
});