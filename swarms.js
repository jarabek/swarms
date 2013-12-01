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

var move = function(e){
	$('#x').val(e.offsetX);
	$('#y').val(e.offsetY);
}

var clickDown = function(e){
	e.preventDefault();
	$('#button').val(e.button);
}

var clickUp = function(e){
	e.preventDefault();
	$('#button').val('None');
}

$('#canvas').bind('mousemove', move);
$('#canvas').bind('mousedown', clickDown);
$('#canvas').bind('mouseup', clickUp);
