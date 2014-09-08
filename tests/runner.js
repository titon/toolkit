require.config({
    baseUrl: '../',
    urlArgs: 'bust=' + Date.now(),
    paths: {
        jquery: 'node_modules/jquery/dist/jquery',
        mocha:  'node_modules/mocha/mocha',
        chai:   'node_modules/chai/chai'
    }
});

define(function(require) {
    require('jquery');

    // Hacky way to setup the mocha object
    // But the mocha object was not returned from the require() call as we are using the browser version
    require('mocha');

    var mocha = window.mocha;
        mocha.setup('bdd');

    // The same applies to chai, but it works, so whatever!
    window.expect = require('chai').expect;

    // Run the tests
    require([
        'tests/core',
        'tests/class',
        'tests/base'
    ], function() {
        if (window.mochaPhantomJS) {
            window.mochaPhantomJS.run();
        } else {
            mocha.run();
        }
    });
});