
'use strict';

angular.module('swarmsApp', [
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

