'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.calculatorApp',
])

  .controller('mainController', function($scope, $route, $routeParams, $location) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
  })

  .controller('CalculatorCtrl', function($scope, $routeParams) {
    $scope.name = "CalculatorCtrl";
    $scope.params = $routeParams;
  })

  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'calculator/calculator.html',
        controller: 'CalculatorCtrl',
      })
      .when('/calculator', {
        templateUrl: 'calculator/calculator.html',
        controller: 'CalculatorCtrl',
      })
  });
