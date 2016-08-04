(function () {

    'use strict';

    // SET UP =================================================================
    var express = require('express'),
        app     = express(),
        morgan  = require('morgan'),
        port    = process.env.PORT || 3000;                   // set listener port


    // CONFIGURATION ==========================================================
    app.use(express.static(__dirname + '/public'));    // set static files loc
    app.use(morgan('dev'));                             // log rqsts to console


    // START APP ==============================================================
    app.listen(port, function () {
        console.log('Server listening on port ' + port);
    });

})();