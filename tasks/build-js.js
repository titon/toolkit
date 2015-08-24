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
    cleanOutput = require('./helpers/cleanOutput'),
    prependBanner = require('./helpers/prependBanner'),
    generateGraph = require('./helpers/generateGraph');

module.exports = function(command) {
    var babelOptions = JSON.parse(fs.readFileSync('.babelrc', 'utf8')),
        options = command.parent;

    return new Promise(function(resolve) {
        log.title('build:js');

        resolve(generateGraph('js', options));
    })

    // Bundle modules
    .then(function(paths) {
        log('Bundling modules...');
        log('');

        var tree = {};

        paths.forEach(function(module) {
            var absPath = path.join(options.js, module);

            if (fs.existsSync(absPath)) {
                depTree.toList(absPath, options.js).forEach(function(item) {
                    tree[item] = true;
                });

                log(module, 1);
            }
        });

        log('');

        return Object.keys(tree);
    })

    // Compile the code to Babel and combine
    .then(function(tree) {
        log('Transpiling Babel...');

        babelOptions.externalHelpers = 'global';

        // Import the Babel helpers
        var source = [
            'var global = {};',
            fs.readFileSync('node_modules/babel-core/external-helpers.js'),
            'var babelHelpers = global.babelHelpers;',
        ];

        // Import each dependency
        tree.forEach(function(dep) {
            source.push( babel.transformFileSync(dep, babelOptions).code );
        });

        return source.join('\n\n');
    })

    // Clean up the output
    .then(cleanOutput(options))

    // Wrap content with an IIFE
    .then(function(js) {
        log('Wrapping output...');

        return [
            '(function(window, document) {',
            '"use strict";',
            js,
            '})(window, document);'
        ].join('\n');
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
    .then(function(js) {
        log.success('JavaScript compiled');

        return js;
    });
};
