
new Vue({
	el: 'main',
	data:{
		howtos: [],
		users: [],
		search: '', 
	},
	created: function(){
		var self = this;

		fetch('https://kaledo-backend.herokuapp.com/api/howto/users')
		.then(function(response){
			return response.json();
		})
		.then(function(data){

			for (var i = data['content'].length - 1; i >= 0  ; i--) {		
				
				self.howtos.push(data['content'][i][0]);
				self.users.push(data['content'][i][1]);	
			
			}

			var footer = document.querySelector('.footer-search');

			if(self.howtos.length >= 2){
				footer.style.position = 'relative';
			}else{
				footer.style.position = 'absolute';
			}	

		})

		
	},

	computed:{
		filteredHowtos: function(){

			return this.howtos.filter(howto => {
        		return howto.title.toLowerCase().match(this.search.toLowerCase())
      		})
			

		}
	},

	methods: {
		viewHowto: function(){

			targetId = event.currentTarget.getAttribute('data-id');
  			localStorage.setItem('idHowto',targetId);
  			window.location = 'view-howto.html'

		}
	}

})