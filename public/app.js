'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'myApp.calculatorApp'
]);
app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/calculator'});
}]);

// app.directive('theCalculator', function() {
//   return {
//     restrict: 'AE',
//     templateUrl: 'calculator/calculator.html',
//     replace: true
//   };
// });
