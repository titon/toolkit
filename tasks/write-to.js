'use strict';

var fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    // Tasks
    log = require('./log');

module.exports = function(filename, options) {
    return function(content) {
        // Resolve absolute build path
        var buildPath = path.resolve(options.buildPath);

        // Rename if RTL is enabled
        if (options.rtl) {
            filename = filename.replace('toolkit', 'toolkit-rtl');
        }

        log('Saving ' + chalk.gray(filename));

        return new Promise(function(resolve, reject) {
            fs.open(path.join(buildPath, filename), 'w', 666, function(error, file) {
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
