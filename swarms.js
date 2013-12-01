var setDimentions = function(){
	var newHeight = document.documentElement.clientHeight;
	$('.content').height(newHeight);
	$('.sidebar').height(newHeight);
	$('.container').height(newHeight);
	$('#canvas').height(newHeight);

	var newWidth = document.documentElement.clientWidth;
	$('#canvas').width(newWidth);
};

$( document ).ready(setDimentions);
$( window ).resize(setDimentions);