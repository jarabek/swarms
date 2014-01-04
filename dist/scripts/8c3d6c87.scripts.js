"use strict";angular.module("swarmsApp",["ngCookies","ngResource","ngSanitize","ngRoute"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"SwarmsController"}).otherwise({redirectTo:"/"})}]);var swarms={};swarms.particle=function(a,b,c,d,e){this.x=a-50+Math.floor(50*Math.random()),this.y=b-50+Math.floor(50*Math.random()),this.vx=-e+Math.floor(Math.random()*e),this.vy=-e+Math.floor(Math.random()*e),this.maxVel=e,this.swarmSpread=c,this.drawSize=d},swarms.particle.prototype.move=function(a,b){this.vx+=this.swarmSpread*Math.random()*Math.max(Math.min(a-this.x,1),-1),this.vy+=this.swarmSpread*Math.random()*Math.max(Math.min(b-this.y,1),-1),this.vx=Math.max(Math.min(this.vx,this.maxVel),-this.maxVel),this.vy=Math.max(Math.min(this.vy,this.maxVel),-this.maxVel),this.x+=this.vx,this.y+=this.vy,this.draw(this.x,this.y)},swarms.particle.prototype.draw=function(a,b){var c=document.getElementById("swarm_canvas"),d=c.getContext("2d");d.beginPath(),d.arc(a,b,this.drawSize/2,0,2*Math.PI,!1);var e=$("#color_select").spectrum("get").toRgbString();d.fillStyle=e,d.fill()},swarms.swarm=function(a,b,c,d,e,f){this.numParticles=e,this.location={X:a,Y:b},this.particles=[];for(var g=0;g<this.numParticles;g++)this.particles.push(new swarms.particle(a,b,c,d,f)),this.particles[g].move(a,b)},swarms.swarm.prototype.move=function(a,b){this.location={X:a,Y:b};for(var c=0;c<this.particles.length;c++)this.particles[c].move(a,b)},swarms.swarm.prototype.getLocation=function(){return this.location},angular.module("swarmsApp").controller("SwarmsController",["$scope",function(a){a.menuOpen=!0,a.animationTimer=null,a.inputs={},a.inputs.inputCapture=!1,a.inputs.coordinates=[],a.swarms=[],a.swarmSpread=.1,a.particleDrawSize=3,a.particleCount=10,a.particleMaxVelocity=2,$("#particle_max_velocity").noUiSlider({range:[1,10],start:a.particleMaxVelocity,step:1,handles:1}).change(function(){a.particleMaxVelocity=$("#particle_max_velocity").val(),a.$apply()}),$("#particle_count_slider").noUiSlider({range:[1,100],start:a.particleCount,step:1,handles:1}).change(function(){a.particleCount=$("#particle_count_slider").val(),a.$apply()}),$("#particle_draw_size_slider").noUiSlider({range:[1,15],start:a.particleDrawSize,handles:1,step:1}).change(function(){a.particleDrawSize=$("#particle_draw_size_slider").val(),a.$apply()}),$("#swarm_spread_slider").noUiSlider({range:[.01,1],handles:1,step:.01,start:a.swarmSpread}).change(function(){a.swarmSpread=$("#swarm_spread_slider").val(),a.$apply()}),$("#color_select").spectrum({showButtons:!1,showAlpha:!0}),a.clear=function(){a.resetDimentions(),a.swarms=[]},a.toggleMenu=function(){var b=$(".sidebarContent").width();b=-b,a.menu?$(".sidebar").animate({left:"0px"}):$(".sidebar").animate({left:b+"px"}),a.menu=!a.menu},a.resetDimentions=function(){var a=document.documentElement.clientHeight;$(".content").height(a),$(".sidebarContent").height(a),$(".sidebar").height(a),$(".divider").height(a),$(".container").height(a),$("#swarm_canvas").height(a),$("#swarm_canvas")[0].height=a;var b=document.documentElement.clientWidth;$("#swarm_canvas").width(b),$("#swarm_canvas")[0].width=b},$(window).resize(a.clear),a.getDistance=function(a,b,c,d){var e=(a-c)*(a-c)+(b-d)*(b-d),f=Math.sqrt(e);return f},a.resetInUse=function(){for(var b=0;b<a.inputs.coordinates.length;b++)a.inputs.coordinates[b].inUse=!1},a.moveSwarms=function(){if(a.inputs.inputCapture){a.resetInUse();for(var b=0;b<a.swarms.length;b++){for(var c=-1,d=9e3,e=0;e<a.inputs.coordinates.length;e++)if(!a.inputs.coordinates[e].inUse){var f=a.getDistance(a.inputs.coordinates[e].X,a.inputs.coordinates[e].Y,a.swarms[b].getLocation().X,a.swarms[b].getLocation().Y);d>f&&(d=f,c=e)}c>=0&&(a.swarms[b].move(a.inputs.coordinates[c].X,a.inputs.coordinates[c].Y),a.inputs.coordinates[c].inUse=!0)}}setTimeout(a.moveSwarms,16)},a.inputStart=function(b){b.preventDefault(),a.updateCoordinates(b),a.inputs.inputCapture=!0;for(var c=a.swarms.length;c<a.inputs.coordinates.length;c++)a.swarms.push(new swarms.swarm(a.inputs.coordinates[c].X,a.inputs.coordinates[c].Y,a.swarmSpread,a.particleDrawSize,a.particleCount,a.particleMaxVelocity)),a.moveSwarms();null===a.animationTimer&&(a.animationTimer=setTimeout(a.moveSwarms,16)),a.$apply()},a.updateCoordinates=function(b){if(a.inputs.coordinates=[],"mousemove"===b.type||"mousedown"===b.type)a.inputs.coordinates[0]={X:b.offsetX,Y:b.offsetY,inUse:!1};else if("touchmove"===b.type||"touchstart"===b.type)for(var c=b.originalEvent.touches,d=0;d<c.length;d++)a.inputs.coordinates.push({X:c[d].clientX,Y:c[d].clientY,inUse:!1});a.$apply()},a.inputEnd=function(b){b.preventDefault(),("mouseup"===b.type||0===b.originalEvent.touches.length)&&(a.inputs.inputCapture=!1,a.$apply())},$(document).ready(a.resetDimentions)}]),angular.module("swarmsApp").directive("drawable",function(){return function(a){$("#swarm_canvas").bind("mousemove",a.updateCoordinates),$("#swarm_canvas").bind("mousedown",a.inputStart),$("#swarm_canvas").bind("mouseup",a.inputEnd),$("#swarm_canvas").bind("touchmove",a.updateCoordinates),$("#swarm_canvas").bind("touchstart",a.inputStart),$("#swarm_canvas").bind("touchend",a.inputEnd)}});