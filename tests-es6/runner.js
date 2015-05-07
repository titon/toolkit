'use strict';

(function(karma) {
    // Disable Karma from running tests immediately
    karma.loaded = function() {};

    // Karma places all files in a base folder
    System.baseURL = '/base/js-es6/';

    // Define an alternate path for tests
    System.paths['tests-es6/*'] = '/base/tests-es6/*.js';

    // Use Babel for transpilation
    System.transpiler = 'babel';

    // Set the Babel configuration
    System.babelOptions = karma.config.babelOptions;

    // Loop over each test file and import it
    var TEST_REGEXP = /-test\.js$/i,
        started = false,
        files = [];

    Object.keys(karma.files).forEach(function(file) {
        if (TEST_REGEXP.test(file)) {
            files.push(file.replace('/base/', '').replace('.js', ''));
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
