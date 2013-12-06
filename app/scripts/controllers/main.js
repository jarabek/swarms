/*global $:false */
'use strict';

angular.module('swarmsApp').controller('SwarmsController', function ($scope) {
	$scope.mouse = {};
	$scope.mouse.mouseCapture = false;
	$scope.mouse.lastX = 0;
	$scope.mouse.lastY = 0;

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
		var x = e.offsetX;
		var y = e.offsetY;
		$scope.mouse.mouseX = x;
		$scope.mouse.mouseY = y;
		if ($scope.mouse.mouseCapture){
		  var c = document.getElementById('swarm_canvas');
		  var ctx = c.getContext('2d');
		  ctx.beginPath();
		  ctx.moveTo($scope.mouse.lastX,$scope.mouse.lastY);
		  ctx.lineTo(x,y);
		  ctx.stroke();
		}
		$scope.mouse.lastX = x;
		$scope.mouse.lastY = y;
		$scope.$apply();
	};

	$scope.clickDown = function(e){
		e.preventDefault();
		$scope.mouse.mouseCapture = true;
		$scope.mouse.mouseBtn = e.button;
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

	$scope.particle = function(x, y){
		this.x = x - 5 + Math.floor(Math.random() * 5);
		this.y = y - 5 + Math.floor(Math.random() * 5);
		this.vx = -2 + Math.floor(Math.random() * 2);
		this.vy = -2 + Math.floor(Math.random() * 2);
		this.maxVel = 2;
		this.linearity = 0.2;
		this.drawSize = 3;
	};

	$scope.particle.move = function(gx, gy){
		this.vx += this.linearity * Math.random() * Math.max(Math.min(gx - this.x, 1), -1);
		this.vy += this.linearity * Math.random() * Math.max(Math.min(gy - this.y, 1), -1);
		this.vx = Math.max(Math.min(this.vx, this.maxVel), -this.maxVel);
		this.vy = Math.max(Math.min(this.vy, this.maxVel), -this.maxVel);
		this.x += this.vx;
		this.y += this.vy;

	};

	$scope.swarm = [];
});