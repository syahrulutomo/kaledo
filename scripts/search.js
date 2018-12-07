new Vue({
	el: '.recipes-container',
	data:{
		recipes: [],
		users: [],
	},
	created: function(){
		var self = this;
		var title = localStorage.getItem('recipeTitle');

		fetch('https://kaledo-backend.herokuapp.com/api/recipe/title'+title)
		.then(function(response){
			return response.json();
		})
		.then(function(data){
			
			for(var i = data['content'].length -1 ; i >= 0  ; i--){
				self.recipes.push(data['content'][i][0]);
				self.users.push(data['content'][i][1]);
			}

			var footer = document.querySelector('.footer-search');

			if(self.recipes.length === 0){
				footer.style.position = 'absolute';
				console.log('absolute');
			}else{
				footer.style.position = 'relative';
				console.log('relative');
			}	

			console.log(data)
		})
	}

})