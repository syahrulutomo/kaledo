document.querySelector('.profil-img').src = localStorage.getItem('profilPicture');
document.querySelector('.profil-pic').src = localStorage.getItem('profilPicture');
document.querySelector('.profil-name').innerHTML = localStorage.getItem('firstName')+" "+localStorage.getItem('lastName');


document.addEventListener("DOMContentLoaded", function(event) { 
  	var logoutButton = document.querySelector('#logout');

	logoutButton.onclick = logout;

	// document.querySelector('#add-personal-howto').addEventListener('click',function(){ window.location = 'add-howto.html' });
	// document.querySelector('#add-personal-recipe').addEventListener('click',function(){ window.location = 'add-recipe.html' });
	

	function logout(){
		localStorage.clear();
		logoutButton.href = 'signin.html';
		location.reload();
	} 
});



Vue.component('tab-account',{
	data: function(){
		return {
			email: localStorage.getItem('email'),
			firstName: localStorage.getItem('firstName'),
			lastName: localStorage.getItem('lastName'),
			profilPicture: localStorage.getItem('profilPicture'),
			errors: []
		}},
		template: `
		<section id="profil-account">
		<a id='delete_account' href="account-settings.html"><img src="../assets/setting.png"></a>
		<div class="account-form account-form-top">
			<p>Email</p>
			<input v-model="email" id="email" type="text" name="" readonly>
		</div>
		<div class="account-form">
			<p>First Name</p>
			<input v-model="firstName" id="first-name" type="text" name="">
		</div>
		<div class="account-form">
			<p>Last Name</p>
			<input v-model="lastName" id="last-name" type="text" name="">
		</div>
		<div class="account-form">
			<img id="profil-picture" src="../assets/grey.jpg" alt="">
			<input value="localStorage.getItem('profilPicture')" id="file" type="file" class="file" placeholder="Upload Photo">
		</div>
		<button v-on:click="handlerClick" id="submit-account">Save</button>
	</section>

		`,
		methods: {
			postData: function(){
				if(this.email !== '' && this.email !== null){
					 if(this.firstName !== '' && this.firstName !== null){
						if(this.lastName !== '' && this.lastName !== null){
							var reqBody = {
							        		email: this.email,
							        		firstName: this.firstName,
							        		lastName: this.lastName,
							        		profilPicture: this.profilPicture
							        	  };

							if(fetch){
								document.querySelector('.loader').style.display = "inline";
							}

							fetch('https://kaledo-backend.herokuapp.com/api/users/'+this.email, {
					        	method: "PUT", // *GET, POST, PUT, DELETE, etc.
						        // mode: "no-cors", // no-cors, cors, *same-origin
						        headers: {
						            "Content-Type": "application/json; charset=utf-8",
						            // "Content-Type": "application/x-www-form-urlencoded",
						        },	
					        	body: JSON.stringify(reqBody)
					        })
							.then(function(response){
								localStorage.setItem('email',reqBody['email']);
								localStorage.setItem('firstName',reqBody['firstName']);
								localStorage.setItem('lastName',reqBody['lastName']);
								
								return response;
							})
							.then(function(){

								if(document.querySelector('#file').value !== ''  || document.querySelector('#file').files[0] !== undefined){

								var config = {
								    apiKey: "AIzaSyB4tu8OwisUwHb-AOZSOG1_sJXGTVIyZKo",
								    authDomain: "kaledostorage.firebaseapp.com",
								    databaseURL: "https://kaledostorage.firebaseio.com",
								    projectId: "kaledostorage",
								    storageBucket: "kaledostorage.appspot.com",
								    messagingSenderId: "27410977713"
								};
					 
								firebase.initializeApp(config);
						 

								var file =  document.querySelector("#file").files[0];
								var fileName = file.name;
								var id = localStorage.getItem('email'); 
								var url = '';
								var storageRef = firebase.storage().ref('user_'+id+'/account/'+  fileName);	

								var uploadTask = storageRef.put(file);

								// Register three observers:
								// 1. 'state_changed' observer, called any time the state changes
								// 2. Error observer, called on failure
								// 3. Completion observer, called on successful completion
								uploadTask.on('state_changed', function(snapshot){
							  	// Observe state change events such as progress, pause, and resume
								// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
								  // Handle unsuccessful uploads
								}, function() {					

							  	// Handle successful uploads on complete
							 	// For instance, get the download URL: https://firebasestorage.googleapis.com/...
							  	uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {

								  	var id = JSON.stringify(localStorage.getItem('email'));
								  	id = id.replace('.','dot');

								  	firebase.database().ref('users'+id+'/account/').set({
								  		firstName: localStorage.getItem('firstName'),
								  		lastName: localStorage.getItem('lastName'),
								  		url: downloadURL
								  	});
									
									// putRequest(downloadURL);
									
									localStorage.setItem('downloadURL',downloadURL);
								    // console.log('File available at', downloadURL);

								    var email = localStorage.getItem('email');
									reqBody1 = {
						        		email: localStorage.getItem('email'),
						        		firstName: localStorage.getItem('firstName'),
						        		lastName: localStorage.getItem('lastName'),
						        		profilPicture: localStorage.getItem('downloadURL')
						        	};

									fetch('https://kaledo-backend.herokuapp.com/api/users/'+email, {
							        	method: 'PUT',
							        	// mode: "no-cors", // no-cors, cors, *same-origin
								        headers: {
								            "Content-Type": "application/json; charset=utf-8",
								            // "Content-Type": "application/x-www-form-urlencoded",
								        },	
							        	body: JSON.stringify(reqBody1)
							        })
									.then(function(){
										var url = localStorage.getItem('downloadURL');
										localStorage.setItem('profilPicture',url);
										
										document.location.reload(true);
										
									});

								  	});	// end of uploadTask.snapshot  

									});	// end of anonymous func to handle successfull upload

								}else{
										
									document.location.reload(true);
								}
								

							}); // end of then
							

						} //end of if lastName 
					} //end of if firtsName 
				} //end of if email
				
			},
			putRequest: function(downloadURL){

					fetch('https://kaledo-backend.herokuapp.com/api/users', {
			        	method: 'PUT',	
			        	body: {
			        		firstName: this.firstName,
			        		lastName: this.lastName,
			        		email: this.email,
			        		profilPicture: downloadURL
			        	}
			        })
					.then(response => response.json());
			},
			updateData: function(){
				 fetch(`https://kaledo-backend.herokuapp.com/api/users/`+this.email)
				.then(function(response){
					response.json();	
				})
				.then(function(data){

				console.log(data);
				localStorage.setItem('firstName',data['firstName']);
				localStorage.setItem('lastName',data['lastName']);
				localStorage.setItem('profilPicture',data['profilPicture']);
								    
				})
			},
			handlerClick: function(){
				this.postData();
				// this.putRequest(localStorage.getItem('downloadURL'));
				// this.updateData();
			}					
												
		}
		
		
})

Vue.component('tab-recipes', { 
  data: function () {
  	return {
      title: "",
      description: "",
      subCategory: "",
      directions: [],
      ingredients: [],
      photos: "",
      time: ""
    }
  },
	template: `
	<section id="personal-recipe-wrapper">
		<div v-on:click="addRecipe" id="add-personal-recipe">
			<img src="../assets/add-icons.png" alt="add recipe button">
		</div>
		<article class="personal-recipe">
			<div class="personal-recipe-left">
				<a class="personal-recipe-thumbnail-link" href=""><img class="personal-recipe-thumbnail" src="../assets/grey.jpg" alt=""></a>
			</div>
			<div class="personal-recipe-right">
				<a class="personal-recipe-link" href=""><h3 class="personal-recipe-title">Gastropub distillery Marfa</h3></a>
				<p class="personal-recipe-summary">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
		    </div> 
		</article>
		<article class="personal-recipe">
			<div class="personal-recipe-left">
				<a class="personal-recipe-thumbnail-link" href=""><img class="personal-recipe-thumbnail" src="../assets/grey.jpg" alt=""></a>
			</div>
			<div class="personal-recipe-right">
				<a class="personal-recipe-link" href=""><h3 class="personal-recipe-title">Gastropub distillery Marfa farm-to-table</h3></a>
				<p class="personal-recipe-summary">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
		    </div> 
		</article>
		<article class="personal-recipe">
			<div class="personal-recipe-left">
				<a class="personal-recipe-thumbnail-link" href=""><img class="personal-recipe-thumbnail" src="../assets/grey.jpg" alt=""></a>
			</div>
			<div class="personal-recipe-right">
				<a class="personal-recipe-link" href=""><h3 class="personal-recipe-title">Gastropub distillery Marfa farm-to-table</h3></a>
				<p class="personal-recipe-summary">adasafasf</p>
		    </div> 
		</article>
		<article class="personal-recipe">
			<div class="personal-recipe-left">
				<a class="personal-recipe-thumbnail-link" href=""><img class="personal-recipe-thumbnail" src="../assets/grey.jpg" alt=""></a>
			</div>		
			<div class="personal-recipe-right">
				<a class="personal-recipe-link" href=""><h3 class="personal-recipe-title">Gastropub distillery Marfa farm-to-table</h3></a>
				<p class="personal-recipe-summary">adasafasf</p>
		    </div> 
		</article>
		<article class="personal-recipe">
			<div class="personal-recipe-left">
				<a class="personal-recipe-thumbnail-link" href=""><img class="personal-recipe-thumbnail" src="../assets/grey.jpg" alt=""></a>
			</div>			
			<div class="personal-recipe-right">
				<a class="personal-recipe-link" href=""><h3 class="personal-recipe-title">Gastropub distillery Marfa farm-to-table</h3></a>
				<p class="personal-recipe-summary">adasafasf</p>
		    </div> 
		</article>
		<article class="personal-recipe">
			<div class="personal-recipe-left">
				<a class="personal-recipe-thumbnail-link" href=""><img class="personal-recipe-thumbnail" src="../assets/grey.jpg" alt=""></a>
			</div>			
			<div class="personal-recipe-right">
				<a class="personal-recipe-link" href=""><h3 class="personal-recipe-title">Gastropub distillery Marfa farm-to-table</h3></a>
				<p class="personal-recipe-summary">adasafasf</p>
		    </div> 
		</article>
	</section>
  	
  `,
  	methods:{
  		addRecipe: function(){
  			window.location = 'add-recipe.html'
  		}
  	}
})



Vue.component('tab-howto', { 
  data: function () {
  	return {
      title: "",
      thumbnail: "",
      articles: []
    }
  },
	template: `
	<section id="personal-howto-wrapper">
		<div v-on:click="addHowto" id="add-personal-howto">
			<img src="../assets/add-icons.png" alt="add howto button">
		</div>
		<article class="personal-howto">
			<div class="personal-howto-left">
				<a class="personal-howto-thumbnail-link" href=""><img class="personal-howto-thumbnail" src="../assets/grey.jpg" alt=""></a>
			</div>
			<div class="personal-howto-right">
				<a class="personal-howto-link" href=""><h3 class="personal-howto-title">Gastropub distillery Marfa</h3></a>
				<p class="personal-howto-summary">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
		    </div> 
		</article>
		<article class="personal-howto">
			<div class="personal-howto-left">
				<a class="personal-howto-thumbnail-link" href=""><img class="personal-howto-thumbnail" src="../assets/grey.jpg" alt=""></a>
			</div>
			<div class="personal-howto-right">
				<a class="personal-howto-link" href=""><h3 class="personal-howto-title">Gastropub distillery Marfa farm-to-table</h3></a>
				<p class="personal-howto-summary">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
		    </div> 
		</article>
		<article class="personal-howto">
			<div class="personal-howto-left">
				<a class="personal-howto-thumbnail-link" href=""><img class="personal-howto-thumbnail" src="../assets/grey.jpg" alt=""></a>
			</div>
			<div class="personal-howto-right">
				<a class="personal-howto-link" href=""><h3 class="personal-howto-title">Gastropub distillery Marfa</h3></a>
				<p class="personal-howto-summary">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
		    </div> 
		</article>
		<article class="personal-howto">
			<div class="personal-howto-left">
				<a class="personal-howto-thumbnail-link" href=""><img class="personal-howto-thumbnail" src="../assets/grey.jpg" alt=""></a>
			</div>
			<div class="personal-howto-right">
				<a class="personal-howto-link" href=""><h3 class="personal-howto-title">Gastropub distillery Marfa farm-to-table</h3></a>
				<p class="personal-howto-summary">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
		    </div> 
		</article>
		<article class="personal-howto">
			<div class="personal-howto-left">
				<a class="personal-howto-thumbnail-link" href=""><img class="personal-howto-thumbnail" src="../assets/grey.jpg" alt=""></a>
			</div>
			<div class="personal-howto-right">
				<a class="personal-howto-link" href=""><h3 class="personal-howto-title">Gastropub distillery Marfa</h3></a>
				<p class="personal-howto-summary">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
		    </div> 
		</article>
		<article class="personal-howto">
			<div class="personal-howto-left">
				<a class="personal-howto-thumbnail-link" href=""><img class="personal-howto-thumbnail" src="../assets/grey.jpg" alt=""></a>
			</div>
			<div class="personal-howto-right">
				<a class="personal-howto-link" href=""><h3 class="personal-howto-title">Gastropub distillery Marfa farm-to-table</h3></a>
				<p class="personal-howto-summary">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
		    </div> 
		</article>
	</section>
  	
  `,
  	methods:{
  		addHowto: function(){
  			window.location = 'add-howto.html'
  		}
  	}
})


new Vue({
	el: '#profil-container',
	data:{
		currentTab: 'Recipes',
		tabs: ['Account','Recipes','Howto'],
	},
	computed: {
		currentTabComponent: function() {
			return 'tab-' + this.currentTab.toLowerCase();
		}
	}
	
})



