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
	this.particles = [];
	for (var i=0; i<this.numParticles; i++){
		this.particles.push(new swarms.particle(startX, startY, swarmSpread, particleDrawSize, particleMaxVelocity));
		this.particles[i].move(startX, startY);
	}
};

swarms.swarm.prototype.move = function(x, y){
	for (var i=0; i < this.particles.length; i++){
		this.particles[i].move(x, y);
	}
};

angular.module('swarmsApp').controller('SwarmsController', function ($scope) {
	$scope.mouse = {};
	$scope.mouse.mouseCapture = false;
	$scope.mouse.lastX = 0;
	$scope.mouse.lastY = 0;
	$scope.swarms = [];
	$scope.animationTimer = null;
	$scope.swarmSpread = 0.1;
	$scope.particleDrawSize = 3;
	$scope.particleCount = 10;
	$scope.particleMaxVelocity = 2;
	$scope.menuOpen = true;

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

	$scope.move = function(e){
		$scope.mouse.lastX = e.offsetX;
		$scope.mouse.lastY = e.offsetY;
		$scope.$apply();
	};

	$scope.clickDown = function(e){
		e.preventDefault();
		$scope.mouse.mouseCapture = true;
		$scope.mouse.mouseBtn = e.button;
		if ($scope.swarms.length === 0){
			$scope.swarms.push(new swarms.swarm($scope.mouse.lastX,
												$scope.mouse.lastY,
												$scope.swarmSpread,
												$scope.particleDrawSize,
												$scope.particleCount,
												$scope.particleMaxVelocity));
		}
		var moveSwarms = function(){
			if ($scope.mouse.mouseCapture){
				for (var i = 0; i < $scope.swarms.length; i++){
					$scope.swarms[i].move($scope.mouse.lastX,$scope.mouse.lastY);
				}
			}
			setTimeout(moveSwarms, 16);
		};
		if ($scope.animationTimer === null){
			$scope.animationTimer = setTimeout(moveSwarms, 16);
		}
		$scope.$apply();
	};

	$scope.clickUp = function(e){
		e.preventDefault();
		$scope.mouse.mouseCapture = false;
		$scope.mouse.mouseBtn = 'None';
		$scope.$apply();
	};

	$('#swarm_canvas').bind('mousemove', $scope.move);
	$('#swarm_canvas').bind('mousedown', $scope.clickDown);
	$('#swarm_canvas').bind('mouseup', $scope.clickUp);
	
});
