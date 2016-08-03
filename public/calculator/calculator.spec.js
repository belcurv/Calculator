/* This doesn't fucking work at all, because you don't
 * know what the fuck is $scope, this, self, calc, or ctrl
*/
'use strict';

describe('CalculatorCtrl', function() {
  var Calc;

  beforeEach(angular.mock.module('myApp.calculatorApp'));

  beforeEach(inject(function(_$controller_) {
    Calc = _$controller_;
  }));

  it('1+1=2', function() {
    expect(1+1).toEqual(0);
  });
  it('Calc', function() {
    expect(Calc).toBeDefined();
  });

});









//  describe('calc.inBuffer', function(){
//
//    it('should have empty properties', inject(function($controller) {
//      //spec body
//      var scope = {};
//      var controller = $controller('CalculatorCtrl', {$scope: scope});
//      
//      expect(calc.inBuffer.regA).toEqual('empty');
//      expect(calc.inBuffer.regB).toEqual('empty');
//      expect(calc.inBuffer.regC).toEqual('empty');
//      expect(calc.inBuffer.opA).toEqual('empty');
//      expect(calc.inBuffer.opB).toEqual('empty');
//
//    }));
//
//  });

