/*jslint white:true*/

(function () {
    
    'use strict';

    angular

        // start with a reference to the main app module
        .module('myApp')

        // define directive, injecting our 'calcFactory' service
        .directive('chatterboxDirective', function () {
        
            return {
                restrict: 'AE',
                replace : true,
                templateUrl: 'chatterbox/chatterbox.tpl.html'
            };
        
    });
    
})();