'use strict';

(function(karma) {
    // Disable Karma from running tests immediately
    karma.loaded = function() {};

    // Create a sandbox element
    var sandbox = document.createElement('div');
        sandbox.id = 'sandbox';

    document.body.appendChild(sandbox);

    // Define paths
    System.paths['tests-es6/*'] = '/base/tests-es6/*';
    System.paths['*'] = '/base/js-es6/*';

    // Use Babel for transpilation
    System.transpiler = 'babel';

    // Set the Babel configuration
    System.babelOptions = karma.config.babelOptions;

    // Custom hook to append extension
    var normalize = System.normalize;

    System.normalize = function(name, parentName, parentAddress) {
        if (name !== 'babel' && name.substr(-3) !== '.js') {
            name += '.js';
        }

        return normalize.call(this, name, parentName, parentAddress);
    };

    // Loop over each test file and import it
    var TEST_REGEXP = /-test\.js$/i,
        started = false,
        files = [];

    Object.keys(karma.files).forEach(function(file) {
        if (TEST_REGEXP.test(file)) {
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
