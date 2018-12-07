
new Vue({
	el: '.view-howto-container',
	data: {
		howto: {}
	},
	created: function(){
		var self = this;

		var id = localStorage.getItem('idHowto');

		fetch('https://kaledo-backend.herokuapp.com/api/howto/'+id)
		.then(function(response){
			return response.json();
		})
		.then(function(data){

			self.howto = data;
			

		})
	}
});