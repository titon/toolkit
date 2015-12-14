/* eslint strict: 0, no-var: 0 */

'use strict';

var fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    // Helpers
    log = require('./log');

module.exports = function writeTo(filename, options) {
    return function(content) {
        // Rename if RTL is enabled
        if (options.rtl) {
            let parts = filename.split('.');

            parts[0] += '-rtl';

            filename = parts.join('.');
        }

        log('Saving ' + chalk.gray(filename));

        return new Promise(function(resolve, reject) {
            fs.writeFile(path.join(options.out, filename), content, function(error) {
                if (error) {
                    reject(error);
                } else {
                    resolve(content);
                }
            });
        });
    };
};
