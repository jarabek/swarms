'use strict';

//Main routing and config for angula
angular.module('swarmsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    //Basic routing for this app
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'SwarmsController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

