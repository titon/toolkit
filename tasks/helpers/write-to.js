'use strict';

var fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    // Helpers
    log = require('./log');

module.exports = function(filename, options) {
    return function(content) {
        // Rename if RTL is enabled
        if (options.rtl) {
            var parts = filename.split('.');
                parts[0] += '-rtl';

            filename = parts.join('.');
        }

        log('Saving ' + chalk.gray(filename));

        return new Promise(function(resolve, reject) {
            fs.open(path.join(options.buildPath, filename), 'w', 666, function(error, file) {
                if (error) {
                    reject(error);
                    return;
                }

                fs.write(file, content, 0, 'utf8', function(error) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(content);
                    }
                });
            });
        });
    };
};
