'use strict';

var fs = require('fs'),
    path = require('path'),
    // Processes
    sass = require('node-sass'),
    prefixer = require('autoprefixer-core'),
    cleanCss = require('clean-css'),
    // Helpers
    log = require('./helpers/log'),
    writeTo = require('./helpers/write-to'),
    prependBanner = require('./helpers/prepend-banner');

module.exports = function(paths, options) {
    return new Promise(function(resolve, reject) {
        log.title('build:css');

        // Generate a fake inline Sass file to use for rendering
        var data = ['@charset "UTF-8";', '@import "common";'];

        // Prepend namespace
        if (options.namespace) {
            log('Prepending namespace...');

            data.push('$toolkit: map-merge($toolkit, ("namespace": "' + options.namespace + '"));');
        }

        // Enable RTL mode
        if (options.rtl) {
            log('Enabling RTL mode...');

            data.push('$toolkit: map-merge($toolkit, ("text-direction": rtl));');
        }

        // Import selected modules
        log('Bundling modules...');
        log('');

        paths.forEach(function(path) {
            data.push('@import "' + path.replace('.scss', '') + '";');

            log(path, 1);
        });

        // Render the Sass file
        log('Transpiling Sass...', 0, 1);

        sass.render({
            data: data.join('\n'),
            includePaths: [options.css],
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
        log('Trimming output...');

        css = css.replace(/\/\*\*([\s\S]+?)\*\/\n/g, ''); // Replace docblocks
        css = css.replace(/\/\*[^!]([^*]+)\*\//g, ''); // Replace block comments
        css = css.replace(/ {4}\n/g, ''); // Replace empty lines
        css = css.replace(/\n{3,}/g, '\n\n'); // Replace multi-lines

        return css;
    })

    // Apply prefixes using autoprefixer
    .then(function(css) {
        log('Applying prefixes...');

        // Autoprefixer throws warnings for not using PostCSS
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
        log('Minifying CSS...');

        return new cleanCss({
            advanced: true,
            debug: options.debug,
            keepSpecialComments: 1
        }).minify(css).styles;
    })

    // Save the minified file
    .then(writeTo('toolkit.min.css', options))

    // Finish task
    .then(function() {
        log.success('CSS compiled');
    });
};
