'use strict';

(function(karma) {
    // Disable Karma from running tests immediately
    karma.loaded = function() {};

    // Create a sandbox element
    var sandbox = document.createElement('div');
        sandbox.id = 'sandbox';

    document.body.appendChild(sandbox);

    // Configure SystemJS
    System.config({
        paths: {
            'lodash/*': '/base/node_modules/lodash/*',
            'tests-es6/*': '/base/tests-es6/*',
            '*': '/base/js-es6/*'
        },
        transpiler: 'babel',
        babelOptions: karma.config.babelOptions,
        defaultJSExtensions: true
    });

    // Loop over each test file and import it
    var started = false,
        files = [];

    Object.keys(karma.files).forEach(function(file) {
        if (file.match(/-test\.js$/i)) {
            files.push(file.replace('/base/', ''));
        }
    });

    // Run the tests
    Promise
        .all(files.map(function(module) {
            return System.import(module);
        }))
        .then(function() {
            if (!started) {
                karma.start();
                started = true;
            }
        });
})(__karma__);
