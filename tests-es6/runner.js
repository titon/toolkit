(function(karma) {
    'use strict';

    // Disable Karma from running tests immediately
    karma.loaded = function() {};

    // Karma places all files in a base folder
    System.baseURL = '/base/';

    // Use Babel for transpilation
    System.transpiler = 'babel';

    // Loop over each test file and import it
    var TEST_REGEXP = /-test\.js$/i,
        files = [],
        started = false;

    Object.keys(karma.files).forEach(function(file) {
        if (TEST_REGEXP.test(file)) {
            files.push(file
                .replace('/base/', '')
                .replace('.js', ''));
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
