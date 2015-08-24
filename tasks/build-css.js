'use strict';

var fs = require('fs'),
    path = require('path'),
    // Processes
    sass = require('node-sass'),
    prefixer = require('autoprefixer-core'),
    CleanCSS = require('clean-css'),
    // Helpers
    log = require('./helpers/log'),
    writeTo = require('./helpers/writeTo'),
    prependBanner = require('./helpers/prependBanner'),
    generateGraph = require('./helpers/generateGraph');

module.exports = function(command) {
    var options = command.parent;

    return new Promise(function(resolve) {
        log.title('build:css');

        resolve(generateGraph('css', options))
    })

    // Bundle modules
    .then(function(paths) {
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

        paths.forEach(function(value) {
            if (fs.existsSync(path.join(options.css, value))) {
                data.push('@import "' + value.replace('.scss', '') + '";');

                log(value, 1);
            }
        });

        log('');

        return data.join('\n');
    })

    // Render the Sass file
    .then(function(scss) {
        log('Transpiling Sass...');

        return new Promise(function(resolve, reject) {
            sass.render({
                data: scss,
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

        return new CleanCSS({
            advanced: true,
            debug: options.debug,
            keepSpecialComments: 1
        }).minify(css).styles;
    })

    // Save the minified file
    .then(writeTo('toolkit.min.css', options))

    // Finish task
    .then(function(css) {
        log.success('CSS compiled');

        return css;
    });
};
