/*
 * Open the drawer when the menu icon is clicked.
 */
	
var menu = document.querySelector('.burger');
var main = document.querySelector('main');
var drawer = document.querySelector('.navbar-expanded');

menu.addEventListener('click', function(e) {
  drawer.classList.toggle('open');
  document.querySelector('body').style.transform = 'translate(0,168.78)';
   e.stopPropagation();
});
  
main.addEventListener('click', function() {
   drawer.classList.remove('open');
});

if(window.location.href == 'https://kaledocooking.github.io/index.html' ){
  new Vue({
	  el: '#header-index',
	  data: {
	  	email: localStorage.getItem('email')
	  }
  });	
}
else{
  new Vue({
  	el: '.header',
  	data: {
  		email: localStorage.getItem('email')
  	}
  });	
}



if(localStorage.getItem('photo') !== null){
	document.querySelector('.profil-img').src = localStorage.getItem('photo');
}