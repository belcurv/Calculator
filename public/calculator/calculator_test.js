'use strict';

describe('CalculatorCtrl', function() {

  beforeEach(module('myApp.calculator'));

  describe('calculator controller', function(){

    it('should have empty properties', inject(function($controller) {
      //spec body
      var scope = {};
      var ctrl = $controller('CalculatorCtrl', {$scope: scope});
      
      expect(calc.inBuffer.regA).toBe('empty');
      expect(calc.inBuffer.regB).toBe('empty');
      expect(calc.inBuffer.regC).toBe('empty');
      expect(calc.inBuffer.opA).toBe('empty');
      expect(calc.inBuffer.opB).toBe('empty');

    }));

  });
});

