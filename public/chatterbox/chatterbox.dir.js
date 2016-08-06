/*jslint white:true*/

(function () {
    
    'use strict';

    angular

        // start with a reference to the main app module
        .module('myApp')

        // define directive, injecting our 'calcFactory' service
        .directive('chatterboxDirective', ['calcFactory', function (calcFactory) {

            // our controller just links view bindings to factory methods
            var chatController = function () {
                var vm = this;
                vm.inBuffer = calcFactory.inBuffer;
                vm.chatter  = calcFactory.chatter;
            };
        
            return {
                restrict: 'AE',
                replace : true,
                templateUrl: 'chatterbox/chatterbox.tpl.html',
                controller  : chatController,
                controllerAs: 'vm'
            };
        
    }]);
    
})();