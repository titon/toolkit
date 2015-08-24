'use strict';

var fs = require('fs'),
    path = require('path'),
    // Processes
    depTree = require('dependency-tree'),
    babel = require('babel-core'),
    uglify = require('uglify-js'),
    // Helpers
    log = require('./helpers/log'),
    writeTo = require('./helpers/writeTo'),
    prependBanner = require('./helpers/prependBanner');

module.exports = function(paths, options) {
    var babelOptions = JSON.parse(fs.readFileSync('.babelrc', 'utf8'));

    return new Promise(function(resolve) {
        log.title('build:js');
        log('Bundling modules...');
        log('');

        var tree = {};

        paths.forEach(function(module) {
            depTree.toList(path.join(options.js, module), options.js).forEach(function(item) {
                tree[item] = true;
            });

            log(module, 1);
        });

        log('');
        resolve(Object.keys(tree));
    })

    // Compile the code to Babel and combine
    .then(function(tree) {
        log('Transpiling Babel...');

        var source = [];

        babelOptions.externalHelpers = 'global';

        tree.forEach(function(dep) {
            var depPath = dep; //path.join(options.jsPath, dep);

            if (dep.indexOf('lodash') === 0) {
                depPath = path.join(process.cwd(), 'node_modules', dep);
            }

            source.push( babel.transformFileSync(depPath, babelOptions).code );
        });

        return source.join('\n\n');
    })

    // Clean up the output
    .then(function(js) {
        log('Trimming output...');

        js = js.replace(/\/\*\*([\s\S]+?)\*\/(\n|$)/g, ''); // Replace docblocks
        js = js.replace(/\/\*[^!]([^*]+)\*\//g, ''); // Replace block comments
        js = js.replace(/ {4}\n/g, ''); // Replace empty lines
        js = js.replace(/\n{3,}/g, '\n\n'); // Replace multi-lines

        return js;
    })

    // Wrap content with an IIFE
    .then(function(js) {
        log('Wrapping output...');

        return '(function(window, document) {\n\'use strict\';\n' + js + '\n})(window, document);';
    })

    // Prepend the banner
    .then(prependBanner(options))

    // Save the unminified file
    .then(writeTo('toolkit.js', options))

    // Minify the JS
    .then(function(js) {
        log('Minifying JS...');

        return uglify.minify(js, {
            fromString: true,
            mangle: true,
            output: {
                beautify: false,
                comments: /titon/i
            },
            compress: {
                unsafe: true,
            }
        }).code;
    })

    // Save the minified file
    .then(writeTo('toolkit.min.js', options))

    // Finish task
    .then(function() {
        log.success('JavaScript compiled');
    });
};
