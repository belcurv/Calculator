'use strict';

angular.module('myApp.calculatorApp', [
  'ngRoute'
]);

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/calculator', {
    templateUrl: 'calculator/calculator.html',
    controller: 'CalculatorCtrl',
  });
}])

.controller('CalculatorCtrl', function('calcFactory') {
  var self = this;

  self.greeting = 'You are in the calculator!';
});
