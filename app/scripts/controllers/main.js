/*global $:false */
'use strict';


var swarms = {};

swarms.particle = function(x, y){
	this.x = x - 5 + Math.floor(Math.random() * 5);
	this.y = y - 5 + Math.floor(Math.random() * 5);
	this.vx = -2 + Math.floor(Math.random() * 2);
	this.vy = -2 + Math.floor(Math.random() * 2);
	this.maxVel = 2;
	this.linearity = 0.1;
	this.drawSize = 3;
};

swarms.particle.prototype.move = function(gx, gy){
	this.vx += this.linearity * Math.random() * Math.max(Math.min(gx - this.x, 1), -1);
	this.vy += this.linearity * Math.random() * Math.max(Math.min(gy - this.y, 1), -1);
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
	ctx.arc(x, y, 1, 0, 2 * Math.PI, false);
	var color = $('#color_select').spectrum('get').toHexString();
	ctx.fillStyle = color;
	ctx.fill();
};

swarms.swarm = function(startX, startY){
	this.numParticles = 20;
	this.particles = [];
	this.maxVel = 2;

	this.x = startX;
	this.y = startY;
	this.vx =  -4 + Math.floor(Math.random() * 4);
	this.vy =  -4 + Math.floor(Math.random() * 4);

	for (var i=0; i<this.numParticles; i++){
		this.particles.push(new swarms.particle(this.x,this.y));
		this.particles[i].move(this.x,this.y);
	}
};

swarms.swarm.prototype.move = function(x, y){
	this.x = x;
	this.y = y;
	this.vx += -1 + Math.floor(Math.random());
	this.vy += -1 + Math.floor(Math.random());
	this.vx += Math.max(Math.min(this.vx, this.maxVel), -this.maxVel);
	this.vy += Math.max(Math.min(this.vy, this.maxVel), -this.maxVel);

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

	$('#spread_slider').slider({});

	$('#color_select').spectrum({
		flat: true,
		showButtons: false,
		preferredFormat: 'hex'
	});

	$scope.setDimentions = function(){
		var newHeight = document.documentElement.clientHeight;
		$('.content').height(newHeight);
		$('.sidebar').height(newHeight);
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
		$scope.swarms.push(new swarms.swarm($scope.mouse.lastX, $scope.mouse.lastY));
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
