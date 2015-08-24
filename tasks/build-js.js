'use strict';

var fs = require('fs'),
    path = require('path'),
    // Processes
    Builder = require('systemjs-builder'),
    babel = require('babel-core'),
    uglify = require('uglify-js'),
    // Helpers
    log = require('./helpers/log'),
    writeTo = require('./helpers/write-to'),
    prependBanner = require('./helpers/prepend-banner');

module.exports = function(paths, options) {
    var babelOptions = JSON.parse(fs.readFileSync('.babelrc', 'utf8'));
    var builder = new Builder(options.jsPath, {
        paths: {
            'lodash/*': './node_modules/lodash/*',
        },
        transpiler: 'babel',
        babelOptions: babelOptions,
        defaultJSExtensions: true,
        sourceMaps: false
    });

    return new Promise(function(resolve, reject) {
        log.title('build:js');
        log('Bundling modules...');
        log('');

        var bundle = [];

        paths.forEach(function(path) {
            bundle.push(builder.trace(path));

            log(path, 1);
        });

        log('');

        return Promise.all(bundle)
            .then(function(trees) {
                resolve(trees);
            })
            .catch(function(error) {
                reject(error);
            });
    })

    // Calculate all the different trees and combine them into one
    .then(function(trees) {
        log('Calcuating dependency tree...');

        var masterTree = {};

        trees.forEach(function(tree) {
            Object.keys(tree).reverse().forEach(function(key) {
                masterTree[key] = masterTree[key] || tree[key] || null;
            });
        });

        return masterTree;
    })

    // Compile the code to Babel and combine
    .then(function(tree) {
        log('Transpiling Babel...');

        var source = [];

        babelOptions.externalHelpers = 'global';

        Object.keys(tree).forEach(function(dep) {
            var depPath = path.join(options.jsPath, dep);

            if (dep.indexOf('lodash') === 0) {
                depPath = path.join(options.rootPath, 'node_modules', dep);
            }

            source.push( babel.transformFileSync(depPath, babelOptions).code );
        });

        return source.join('\n\n');
    })

    // Wrap content with an IIFE
    .then(function(js) {
        log('Wrapping output...');

        return '(function(window, document) {\n' + js + '\n})(window, document);';
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
