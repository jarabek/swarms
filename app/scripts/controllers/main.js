/*global $:false */
'use strict';

var swarms = {};

//The basic element of a swarm
swarms.particle = function(x, y, swarmSpread, particleDrawSize, particleMaxVelocity){
	//Initialize the swarm so that it is spread out.
	this.x = x - 50 + Math.floor(Math.random() * 50);
	this.y = y - 50 + Math.floor(Math.random() * 50);

	//Give each particle a varied velocity
	this.vx = -particleMaxVelocity + Math.floor(Math.random() * particleMaxVelocity);
	this.vy = -particleMaxVelocity + Math.floor(Math.random() * particleMaxVelocity);

	this.maxVel = particleMaxVelocity;
	this.swarmSpread = swarmSpread;
	this.drawSize = particleDrawSize;
};

//Move a particle to the given coordinates
swarms.particle.prototype.move = function(x, y){
	//Calculate the new x y based on the current new coordinates and the existing velocity
	this.vx += this.swarmSpread * Math.random() * Math.max(Math.min(x - this.x, 1), -1);
	this.vy += this.swarmSpread * Math.random() * Math.max(Math.min(y - this.y, 1), -1);
	this.vx = Math.max(Math.min(this.vx, this.maxVel), -this.maxVel);
	this.vy = Math.max(Math.min(this.vy, this.maxVel), -this.maxVel);
	this.x += this.vx;
	this.y += this.vy;

	this.draw(this.x, this.y);
};

//Draw a particle at the given coordinates
swarms.particle.prototype.draw = function(x, y){
	//Get the drawing object
	var c = document.getElementById('swarm_canvas');
	var ctx = c.getContext('2d');

	//Draw a simple circle
	ctx.beginPath();
	ctx.arc(x, y, (this.drawSize/2), 0, 2 * Math.PI, false);

	//Get the color from the color picker and fill the shape with that color
	var color = $('#color_select').spectrum('get').toRgbString();
	ctx.fillStyle = color;
	ctx.fill();
};

//Constructor for a swarm
//Takes a starting location, and the various properties derived from the sliders in the UI
swarms.swarm = function(startX, startY, swarmSpread, particleDrawSize, numParticles, particleMaxVelocity){
	this.numParticles = numParticles;
	this.location = {X: startX, Y: startY};
	this.particles = [];
	//Add particles to the swarm
	for (var i=0; i<this.numParticles; i++){
		this.particles.push(new swarms.particle(startX, startY, swarmSpread, particleDrawSize, particleMaxVelocity));
		this.particles[i].move(startX, startY);
	}
};

//For moving an entire swarm
swarms.swarm.prototype.move = function(x, y){
	this.location = {X: x, Y: y};
	for (var i=0; i < this.particles.length; i++){
		this.particles[i].move(x, y);
	}
};

//Returns the current location of the swarm as an object literal: {x,y}
swarms.swarm.prototype.getLocation = function(){
	return this.location;
};

//Angular controller for the drawing page
angular.module('swarmsApp').controller('SwarmsController', function ($scope) {
	//Is the side menu open?
	$scope.menuOpen = true;

	//Used for keeping track of the timer for animating
	$scope.animationTimer = null;
	
	//Stores current input state
	$scope.inputs = {};
	//Are we currently capturing input?
	$scope.inputs.inputCapture = false;
	//List of all active input coordinates (contains all x,y for every finger interacting on a tablet)
	$scope.inputs.coordinates = [];

	//My list of swarms
	$scope.swarms = [];
		
	//Model vars for UI sliders
	$scope.swarmSpread = 0.1;
	$scope.particleDrawSize = 3;
	$scope.particleCount = 10;
	$scope.particleMaxVelocity = 2;
	
	//Setup all the sliders and bind them to the scope vars above
	$('#particle_max_velocity').noUiSlider({
		range: [1, 10],
		start: $scope.particleMaxVelocity,
		step: 1,
		handles: 1
	}).change(function(){
		$scope.particleMaxVelocity = $('#particle_max_velocity').val();
		$scope.$apply();
	});

	$('#particle_count_slider').noUiSlider({
		range: [1, 100],
		start: $scope.particleCount,
		step: 1,
		handles: 1
	}).change(function () {
		$scope.particleCount = $('#particle_count_slider').val();
		$scope.$apply();
	});

	$('#particle_draw_size_slider').noUiSlider({
		range: [1, 15],
		start: $scope.particleDrawSize,
		handles: 1,
		step: 1
	}).change(function () {
		$scope.particleDrawSize = $('#particle_draw_size_slider').val();
		$scope.$apply();
	});

	$('#swarm_spread_slider').noUiSlider({
		range: [0.01, 1],
		handles: 1,
		step: 0.01,
		start: $scope.swarmSpread
	}).change(function () {
		$scope.swarmSpread = $('#swarm_spread_slider').val();
		$scope.$apply();
	});

	//Initialize the color selector widget
	$('#color_select').spectrum({
		flat: true,
		showButtons: false,
		showAlpha: true
	});

	//Resets the drawing canvas
	$scope.clear = function(){
		$scope.resetDimentions();
		$scope.swarms = [];
	};

	//Show or hide the side menu
	$scope.toggleMenu = function(){
		var w = $('.sidebarContent').width();
		w = -w;
		if ($scope.menu){
			$('.sidebar').animate({left:'0px'});
		}else{
			$('.sidebar').animate({left: w + 'px'});
		}
		$scope.menu = !$scope.menu;
	};

	//Resets the dimentions of the various page elements when the window is resized
	$scope.resetDimentions = function(){
		var newHeight = document.documentElement.clientHeight;
		$('.content').height(newHeight);
		$('.sidebarContent').height(newHeight);
		$('.sidebar').height(newHeight);
		$('.divider').height(newHeight);
		$('.container').height(newHeight);

		$('#swarm_canvas').height(newHeight);
		$('#swarm_canvas')[0].height = newHeight;
		 
		var newWidth = document.documentElement.clientWidth;
		$('#swarm_canvas').width(newWidth);
		$('#swarm_canvas')[0].width = newWidth;
	};

	//Bind the window resize event to the method above
	$( window ).resize($scope.resetDimentions);

	//Calculates the euclidian distance between two points
	$scope.getDistance = function(x1,y1,x2,y2){
		var d = ((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2));
		var ret = Math.sqrt(d);
		return ret;
	};

	$scope.resetInUse = function(){
		for (var j = 0; j < $scope.inputs.coordinates.length; j++){
			$scope.inputs.coordinates[j].inUse = false;
		}
	};

	//Move all the swarms 
	$scope.moveSwarms = function(){
		if ($scope.inputs.inputCapture){
			//Re-set inuse flag on each coordinate pair for a new move
			$scope.resetInUse();
			for (var i = 0; i < $scope.swarms.length; i++){
				var minIdx = -1;
				var minDistance = 9000;
				for (var j = 0; j < $scope.inputs.coordinates.length; j++){
					if (!$scope.inputs.coordinates[j].inUse){
						var distance = $scope.getDistance($scope.inputs.coordinates[j].X,
														  $scope.inputs.coordinates[j].Y,
														  $scope.swarms[i].getLocation().X,
														  $scope.swarms[i].getLocation().Y);
						if (distance < minDistance){
							minDistance = distance;
							minIdx = j;
						}
					}
				}
				if (minIdx >= 0){
					$scope.swarms[i].move($scope.inputs.coordinates[minIdx].X, $scope.inputs.coordinates[minIdx].Y);
					$scope.inputs.coordinates[minIdx].inUse = true;
				}
			}
		}
		setTimeout($scope.moveSwarms, 16);
	};

	//Handler for touchstart / mouse start events
	$scope.inputStart = function(e){
		e.preventDefault();

		//Get the new coordinates for teh input
		$scope.updateCoordinates(e);
		$scope.inputs.inputCapture = true;

		//Add swarms to match the number of inputs (i.e. fingers)
		for (var i = $scope.swarms.length; i < $scope.inputs.coordinates.length; i++){
			$scope.swarms.push(new swarms.swarm($scope.inputs.coordinates[i].X,
												$scope.inputs.coordinates[i].Y,
												$scope.swarmSpread,
												$scope.particleDrawSize,
												$scope.particleCount,
												$scope.particleMaxVelocity));
			$scope.moveSwarms();
		}

		//Set the animation timer running				
		if ($scope.animationTimer === null){
			$scope.animationTimer = setTimeout($scope.moveSwarms, 16);
		}
		$scope.$apply();
	};

	//Takes an input event and updates the list of active input coordinates
	$scope.updateCoordinates = function(e){
		$scope.inputs.coordinates = [];
		//If this is a mouse event...
		if ((e.type === 'mousemove') || (e.type === 'mousedown')) {
			$scope.inputs.coordinates[0] = {X: e.offsetX, Y: e.offsetY, inUse: false};
		//Or if this is a touch event....
		}else if ((e.type === 'touchmove') || (e.type === 'touchstart')) {
			var touches = e.originalEvent.touches;
			for (var i = 0; i < touches.length; i++){
				$scope.inputs.coordinates.push({X: touches[i].clientX, Y: touches[i].clientY, inUse: false});
			}
		}
		$scope.$apply();
	};

	//Fires when an input ceases
	$scope.inputEnd = function(e){
		e.preventDefault();
		if ((e.type === 'mouseup') || (e.originalEvent.touches.length === 0) ){
			$scope.inputs.inputCapture = false;
			$scope.$apply();
		}
	};
	
	//Resize the document elements when the page is ready
	$( document ).ready($scope.resetDimentions);
});

angular.module('swarmsApp').directive('drawable', function(){
	return function(scope){
		//Bind all the input events to their appropriate handlers
		$('#swarm_canvas').bind('mousemove', scope.updateCoordinates);
		$('#swarm_canvas').bind('mousedown', scope.inputStart);
		$('#swarm_canvas').bind('mouseup', scope.inputEnd);
		$('#swarm_canvas').bind('touchmove', scope.updateCoordinates);
		$('#swarm_canvas').bind('touchstart', scope.inputStart);
		$('#swarm_canvas').bind('touchend', scope.inputEnd);
	};
});