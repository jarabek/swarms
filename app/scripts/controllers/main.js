/*global $:false */
'use strict';


var swarms = {};

swarms.particle = function(x, y, swarmSpread, particleDrawSize, particleMaxVelocity){
	this.x = x - 50 + Math.floor(Math.random() * 50);
	this.y = y - 50 + Math.floor(Math.random() * 50);
	this.vx = -particleMaxVelocity + Math.floor(Math.random() * particleMaxVelocity);
	this.vy = -particleMaxVelocity + Math.floor(Math.random() * particleMaxVelocity);
	this.maxVel = particleMaxVelocity;
	this.swarmSpread = swarmSpread;
	this.drawSize = particleDrawSize;
};

swarms.particle.prototype.move = function(x, y){
	this.vx += this.swarmSpread * Math.random() * Math.max(Math.min(x - this.x, 1), -1);
	this.vy += this.swarmSpread * Math.random() * Math.max(Math.min(y - this.y, 1), -1);
	this.vx = Math.max(Math.min(this.vx, this.maxVel), -this.maxVel);
	this.vy = Math.max(Math.min(this.vy, this.maxVel), -this.maxVel);
	this.x += this.vx;
	this.y += this.vy;
	this.draw(this.x, this.y);
};

swarms.particle.prototype.draw = function(x, y){
	var c = document.getElementById('swarm_canvas');
	var ctx = c.getContext('2d');
	ctx.beginPath();
	ctx.arc(x, y, (this.drawSize/2), 0, 2 * Math.PI, false);
	var color = $('#color_select').spectrum('get').toRgbString();
	ctx.fillStyle = color;
	ctx.fill();
};

swarms.swarm = function(startX, startY, swarmSpread, particleDrawSize, numParticles, particleMaxVelocity){
	this.numParticles = numParticles;
	this.location = {X: startX, Y: startY};
	this.particles = [];
	for (var i=0; i<this.numParticles; i++){
		this.particles.push(new swarms.particle(startX, startY, swarmSpread, particleDrawSize, particleMaxVelocity));
		this.particles[i].move(startX, startY);
	}
};

swarms.swarm.prototype.move = function(x, y){
	this.location = {X: x, Y: y};
	for (var i=0; i < this.particles.length; i++){
		this.particles[i].move(x, y);
	}
};

swarms.swarm.prototype.getLocation = function(){
	return this.location;
};

angular.module('swarmsApp').controller('SwarmsController', function ($scope) {
	$scope.menuOpen = true;
	$scope.animationTimer = null;
	
	$scope.inputs = {};
	$scope.inputs.inputCapture = false;
	$scope.inputs.coordinates = [];
	$scope.swarms = [];
		
	//Model vars for UI sliders
	$scope.swarmSpread = 0.1;
	$scope.particleDrawSize = 3;
	$scope.particleCount = 10;
	$scope.particleMaxVelocity = 2;
	
	$('#particle_max_velocity').slider({
		min: 1,
		animate: true,
		max: 10,
		step: 1,
		value: $scope.particleMaxVelocity,
		slide: function (event, ui) {
			$scope.particleMaxVelocity = ui.value;
			$scope.$apply();
		}
	});

	$('#particle_count_slider').slider({
		min: 1,
		animate: true,
		max: 100,
		step: 1,
		value: $scope.particleCount,
		slide: function (event, ui) {
			$scope.particleCount = ui.value;
			$scope.$apply();
		}
	});

	$('#particle_draw_size_slider').slider({
		min: 1,
		animate: true,
		max: 15,
		step: 1,
		value: $scope.particleDrawSize,
		slide: function (event, ui) {
			$scope.particleDrawSize = ui.value;
			$scope.$apply();
		}
	});

	$('#swarm_spread_slider').slider({
		min: 0.01,
		animate: true,
		max: 1,
		step: 0.01,
		value: $scope.swarmSpread,
		slide: function (event, ui) {
			$scope.swarmSpread = ui.value;
			$scope.$apply();
		}
	});

	$('#color_select').spectrum({
		flat: true,
		showButtons: false,
		showAlpha: true
	});

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

	$scope.setDimentions = function(){
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

	$( document ).ready($scope.setDimentions);
	$( window ).resize($scope.setDimentions);

	$scope.getDistance = function(x1,y1,x2,y2){
		var d = ((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2));
		var ret = Math.sqrt(d);
		return ret;
	};

	$scope.inputMove = function(e){
		$scope.inputs.coordinates = [];
		if ((e.type === 'mousemove') || (e.type === 'mousedown')) {
			$scope.inputs.coordiantes[0] = {X: e.offsetX, Y: e.offsetY, inUse: false};
		}else if ((e.type === 'touchmove') || (e.type === 'touchstart')) {
			var touches = [];
			if (e.type === 'touchstart'){
				touches = e.originalEvent.changedTouches;
			} else if (e.type === 'touchmove'){
				touches = e.originalEvent.touches;
			}
			for (var i = 0; i < touches.length; i++){
				$scope.inputs.coordinates.push({X: touches[i].clientX, Y: touches[i].clientY, inUse: false});
			}
		}
		window.console.log('#inputs: ', $scope.inputs.coordinates.length);
		$scope.$apply();
	};

	$scope.moveSwarms = function(){
		if ($scope.inputs.inputCapture){
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

	$scope.inputStart = function(e){
		e.preventDefault();
		$scope.inputMove(e);

		$scope.inputs.inputCapture = true;
		
		for (var i = $scope.swarms.length; i < $scope.inputs.coordinates.length; i++){
			$scope.swarms.push(new swarms.swarm($scope.inputs.coordinates[i].X,
												$scope.inputs.coordinates[i].Y,
												$scope.swarmSpread,
												$scope.particleDrawSize,
												$scope.particleCount,
												$scope.particleMaxVelocity));
			$scope.moveSwarms();
		}
				
		if ($scope.animationTimer === null){
			$scope.animationTimer = setTimeout($scope.moveSwarms, 16);
		}
		$scope.$apply();
	};

	$scope.inputEnd = function(e){
		e.preventDefault();
		$scope.inputs.inputCapture = false;
		$scope.$apply();
	};

	$('#swarm_canvas').bind('mousemove', $scope.inputMove);
	$('#swarm_canvas').bind('mousedown', $scope.inputStart);
	$('#swarm_canvas').bind('mouseup', $scope.inputEnd);
	$('#swarm_canvas').bind('touchmove', $scope.inputMove);
	$('#swarm_canvas').bind('touchstart', $scope.inputStart);
	$('#swarm_canvas').bind('touchend', $scope.inputEnd);


});
