'use strict';

var fs = require('fs');

/**
 * A custom node-sass importer that appends an "index.scss" to folder paths.
 *
 * @param {String} url
 * @param {String} prev
 * @param {Function} done
 */
module.exports = function(url, prev, done) {
    fs.stat('./src/' + url, function(error, stats) {
        if (stats && stats.isDirectory()) {
            done({ file: url + '/index.scss' });

        } else {
            done({ file: url + '.scss' });
        }
    });
};
