## Calculator

Simple calculator made with AngularJS served by Node/Express

## Notes

#### Where are the controllers?

There's no need for a main controller since literally all the logic resides in the calculator directive:

`/public/calculator/calculator.dir.js`

#### What's the mother module (app.js) doing?

Very little - it just initializes the app.  There's no need for routing, other modules or other special dependencies.

#### Jay's edits

1.  merged deps and dev-deps.  Just deps.  Use angular.js during dev b/c error messages are more intelligible.  Switch to angular.min.js for production code.

2.  got rid of ngRoute.  You're not doing any routing do there's no need to add complexity to all this.  What you really want is a directive.

3.  refactored calculator controller and markup into a **directive** template and declaration.  Mostly copy/paste, but:

    * all previous controller logic is unchanged, except I switched to 'vm' instead of 'self'
    
    * the previous controller is collected inside a function (`var calcController = function () {};`), which is referenced in the directive declaration object returned at the bottom.

    * the change to 'vm' and 'controllerAs' requires prefixing calculator template methods and bindings with 'vm.'
    
    * using the directive means we replace `<div ng-view></div>` with `<calc-directive></calc-directive>` in the view (index.html).
    
4.  Man, that calculator logic is crazy.

5.  Added a `.gitignore` file to stop tracking & pushing node_modules

6.  merged `notes.txt` with this README file!