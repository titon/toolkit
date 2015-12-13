/* eslint strict: 0, no-var: 0 */

'use strict';

var log = require('./log');

module.exports = function prependBanner(options) {
    let pkg = options.package,
        banner = [
            '/*! Titon Toolkit v' + pkg.version,
            pkg.license,
            pkg.homepage.replace('http://', '') + ' */'
        ];

    return function(content) {
        log('Prepending banner...');

        content = banner.join(' | ') + '\n\n' + content;

        return content;
    };
};
