'use strict';

var fs = require('fs'),
    path = require('path');

/**
 * A custom node-sass importer that appends an "index.scss" to folder paths.
 *
 * @param {String} url
 * @param {String} prev
 * @param {Function} done
 */
module.exports = function(url, prev, done) {
    // If the import is not a relative path
    // We can assume that an absolute path is wanted
    if (url.charAt(0) !== '.') {
        url = path.join(process.cwd(), './src/', url);
    }

    fs.stat(url, function(error, stats) {
        if (stats && stats.isDirectory()) {
            done({ file: url + '/index.scss' });

        } else {
            done({ file: url + '.scss' });
        }
    });
};
