require.config({
    baseUrl: '../',
    urlArgs: 'bust=' + Date.now(),
    paths: {
        jquery: 'node_modules/jquery/dist/jquery',
        mocha:  'node_modules/mocha/mocha',
        chai:   'node_modules/chai/chai',
        sinon:  'node_modules/sinon/lib/sinon'
    }
});

define(function(require) {
    require('jquery');
    require('mocha');
    require('sinon');

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
        'tests/components/component',
        'tests/components/accordion',
        'tests/components/blackout',
        //'tests/components/carousel',
        //'tests/components/drop',
        //'tests/components/flyout',
        'tests/components/input',
        //'tests/components/lazy-load',
        'tests/components/mask',
        //'tests/components/matrix',
        //'tests/components/modal',
        //'tests/components/off-canvas',
        'tests/components/pin',
        //'tests/components/popover',
        //'tests/components/showcase',
        //'tests/components/stalker',
        'tests/components/tab',
        //'tests/components/toast',
        //'tests/components/tooltip',
        //'tests/components/type-ahead',
    ], function() {
        if (window.mochaPhantomJS) {
            window.mochaPhantomJS.run();
        } else {
            window.mocha.run();
        }
    });
});