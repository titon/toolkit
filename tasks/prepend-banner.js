'use strict';

module.exports = function(options) {
    var pkg = options.package,
        banner = [
            '/*! Titon Toolkit v' + pkg.version,
            pkg.license,
            pkg.homepage.replace('http://', '') + ' */'
        ];

    return function(content) {
        content = banner.join(' | ') + "\n\n" + content;

        return content;
    };
};
