
var filterToggle = document.querySelector('.filter-toggle');
var filter = document.querySelector('.filter');

filterToggle.addEventListener('click', function(e){
	filter.classList.toggle('open');
	e.stopPropagation();
});

var dropdown = document.querySelectorAll('.dropdown-icon');
var appetizerList = document.querySelector('.appetizer-list');
var mainCourseList = document.querySelector('.main-course-list');
var dessertList = document.querySelector('.dessert-list');
var drinksList = document.querySelector('.drinks-list');

dropdown[0].addEventListener('click', function(e){
	appetizerList.classList.toggle('open');
	e.stopPropagation();
});

dropdown[1].addEventListener('click', function(e){
	mainCourseList.classList.toggle('open');
	e.stopPropagation();
});

dropdown[2].addEventListener('click', function(e){
	dessertList.classList.toggle('open');
	e.stopPropagation();
});

dropdown[3].addEventListener('click', function(e){
	drinksList.classList.toggle('open');
	e.stopPropagation();
});
