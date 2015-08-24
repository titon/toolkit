'use strict';

var log = require('./log');

module.exports = function prependBanner(options) {
    var pkg = options.package,
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
