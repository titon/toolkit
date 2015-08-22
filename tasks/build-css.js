'use strict';

var fs = require('fs'),
    path = require('path'),
    // Processes
    sass = require('node-sass'),
    prefixer = require('autoprefixer-core'),
    cleanCss = require('clean-css'),
    // Tasks
    writeTo = require('./write-to'),
    prependBanner = require('./prepend-banner');

module.exports = function(paths, options) {
    return new Promise(function(resolve, reject) {
        var data = ['@charset "UTF-8";', '@import "common";'],
            includePath = path.resolve(options.cssPath);

        // Generate a fake inline Sass file to use for rendering
        paths.forEach(function(path) {
            path = path.replace(/\\/g, '/').replace('.scss', '');

            data.push('@import "' + path + '";');

            console.log("\t" + path);
        });

        // Render the Sass file
        sass.render({
            data: data.join("\n"),
            includePaths: [includePath],
            outputStyle: 'expanded',
            sourceComments: false,
            sourceMap: false,
            indentWidth: 4
        }, function(error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(response.css.toString());
            }
        });
    })

    // Clean up the output
    .then(function(css) {
        css = css.replace(/\/\*\*([\s\S]+?)\*\/\n/g, ''); // Replace docblocks
        css = css.replace(/\/\*[^!]([^*]+)\*\//g, ''); // Replace block comments
        css = css.replace(/ {4}\n/g, ''); // Replace empty lines
        css = css.replace(/\n{3,}/g, "\n\n"); // Replace multi-lines

        return css;
    })

    // Apply prefixes using autoprefixer
    .then(function(css) {

        // Autoprefixer throws warnings for not using PostCSS
        // Make it shut up, for shame
        var warn = console.warn;
        console.warn = function() {};

        return prefixer({ browsers: ['last 3 versions'] }).process(css)
            .then(function(response) {
                console.warn = warn;
                return response.css;
            })
            .catch(function(error) {
                throw new Error(error);
            });
    })

    // Prepend the banner
    .then(prependBanner(options))

    // Save the unminified file
    .then(writeTo('toolkit.css', options))

    // Minify the CSS
    .then(function(css) {
        return new cleanCss({
            advanced: true,
            debug: options.debug,
            keepSpecialComments: 1
        }).minify(css).styles;
    })

    // Save the minified file
    .then(writeTo('toolkit.min.css', options));
};
