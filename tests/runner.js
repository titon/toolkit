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
    require('mocha');

    // Hacky way to setup the mocha object
    // But the mocha object was not returned from the require() call as we are using the browser version
    window.mocha.setup('bdd');

    // The same applies to chai, but it works, so whatever!
    window.expect = require('chai').expect;

    // Run the tests
    require([
        'tests/core',
        'tests/class',
        'tests/base',
        'tests/events',
        'tests/extensions',
        'tests/components/accordion',
        'tests/components/blackout'
    ], function() {
        if (window.mochaPhantomJS) {
            window.mochaPhantomJS.run();
        } else {
            window.mocha.run();
        }
    });
});