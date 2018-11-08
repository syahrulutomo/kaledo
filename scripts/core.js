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


var email = localStorage.getItem('email');


if(email !== null && email !== ''){
    document.querySelector('.profil-link').href = 'profil.html';
    document.querySelector('.profil-link-index').href = 'static/profil.html';
}else{
	document.querySelector('.profil-link').href = 'signin.html';
	document.querySelector('.profil-link-index').href = 'static/signin.html';
}