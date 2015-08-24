'use strict';

var log = require('./log');

module.exports = function(options) {
    return function(content) {
        log('Cleaning output...');

        content = content.replace(/\/\*\*([\s\S]+?)\*\/(\n|$)/g, '\n'); // Replace docblocks
        content = content.replace(/\/\*[^!]([^*]+)\*\//g, ''); // Replace block comments
        content = content.replace(/ {4,}\n/g, ''); // Replace empty lines
        content = content.replace(/\n{3,}/g, '\n\n'); // Replace multi-lines

        return content;
    };
};
