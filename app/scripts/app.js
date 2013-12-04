/*global $:false */
'use strict';

var swarms = angular.module('swarmsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'SwarmsController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

swarms.controller('SwarmsController', function($scope){
  window.console.log($scope);
  var setDimentions = function(){
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

  $( document ).ready(setDimentions);
  $( window ).resize(setDimentions);

  var mouseCapture = false;
  var lastX = null;
  var lastY = null;

  var move = function(e){
    var x = e.offsetX;
    var y = e.offsetY;
    $('#x').val(x);
    $('#y').val(y);
    if (mouseCapture){
      var c = document.getElementById('swarm_canvas');
      var ctx = c.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(lastX,lastY);
      ctx.lineTo(x,y);
      ctx.stroke();
    }
    lastX = x;
    lastY = y;
  };

  var clickDown = function(e){
    e.preventDefault();
    mouseCapture = true;
    $('#button').val(e.button);
  };

  var clickUp = function(e){
    e.preventDefault();
    mouseCapture = false;
    $('#button').val('None');
  };

  $('#swarm_canvas').bind('mousemove', move);
  $('#swarm_canvas').bind('mousedown', clickDown);
  $('#swarm_canvas').bind('mouseup', clickUp);

});

