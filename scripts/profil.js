
Vue.component('tab-account',{
	data: function(){
		return {
			email: '',
			firstName: '',
			lastName: '',
			password: '',
			profilPicture: '',
			errors: []
		}},
		template: `
			<section id="profil-account">
		<div class="account-form">
			<p>Email</p>
			<input v-model="email" id="email" type="text" name="">
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
			<p>Password</p>
			<input v-model="password" id="password" type="text" name="">
		</div>
		<div class="account-form">
			<img id="profil-picture" src="../assets/grey.jpg" alt="">
			<input  id="file" type="file" class="file" placeholder="Upload Photo">
		 	<label class="label-file" for="file">Upload Photo</label>
			<button id="upload-button">submit</button>
		</div>
		<button v-on:click="postData()" id="submit-account">Save</button>
	</section>

		`,
		methods: {
			postData: function(){
				axios.post(`https://kaledo-backend.herokuapp.com/api/users`,{
					email: this.email,
					firstName: this.firstName,
					lastName: this.lastName,
					password: this.password		
			})
			.then(response => {})
			.catch(e => {
		      this.errors.push(e)
		    })
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
		<div id="add-personal-recipe">
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
  	
  `
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
		<div id="add-personal-howto">
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
  	
  `
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




var file =  document.querySelector("#file");
var uploadButton = document.querySelector('#upload-button');
var selectedFile = '';

uploadButton.style.display = "none";

document.addEventListener('DOMContentLoaded',function() {
    document.querySelector('#file').onchange=changeEventHandler;
},false);

function changeEventHandler(event) {
    selectedFile = event.target.files[0];
    uploadButton.style.display = "inline-block";
    document.querySelector('.label-file').innerHTML	 = event.target.files[0].name;
}

uploadButton.addEventListener('click',uploadFile);

function uploadFile(){
	var fileName = selectedFile.name;

	var storageRef = firebase.storage().ref('kaledo-recipe/' + fileName);	

	var uploadTask = storageRef.put(selectedFile);

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
	  	var id = 1234;
	  	firebase.database().ref('recipe/' +id).set({
	  		username: 'syahrul',
	  		category: 'main course',
	  		subCategory: 'beef',
	  		url: downloadURL
	  	})
	    console.log('File available at', downloadURL);
	  });
	});

}


