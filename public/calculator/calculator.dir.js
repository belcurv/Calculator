/*jslint white:true*/

(function () {
    
    'use strict';

    angular

        // start with a reference to the main app module
        .module('myApp')

        // define directive, injecting our 'calcFactory' service
        .directive('calcDirective', ['calcFactory', function (calcFactory) {

            // our controller just links view bindings to factory methods
            var calcController = function () {
                var vm = this;
                vm.inBuffer = calcFactory.inBuffer;
                vm.chatter  = calcFactory.chatter;
            };
            
            // all directives return an object (DDO)
            return {
                restrict    : 'AE',
                templateUrl : 'calculator/calculator.tpl.html',
                replace     : true,
                controller  : calcController,
                controllerAs: 'vm'
            };
                
        }]);

})();