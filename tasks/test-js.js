'use strict';

var path = require('path'),
    // Processes
    Karma = require('karma').Server,
    // Helpers
    log = require('./helpers/log');

module.exports = function(command) {
    return new Promise(function(resolve) {
        log.title('test:js');
        log('Loading Karma configuration...');
        log('Running tests...');

        new Karma({
            configFile: path.join(process.cwd(), '.karmarc')
        }, resolve).start();
    });
};
