'use strict';

var pkg = require('./package.json'),
    rjs = require('./build/plugins/requirejs'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-ruby-sass'),
    clean = require('gulp-clean'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    prefixer = require('gulp-autoprefixer'),
    compartment = require('compartment'),
    options = gutil.env,
    banner = "/*! Titon Toolkit v<%= pkg.version %> | <%= pkg.licenses[0].type %> License | <%= pkg.homepage.replace('http://', '') %> */\n";

/**
 * Determine which components we should package.
 *
 * The --components parameter can be used to filter down components
 * The --[no-]normalize parameter will include or exclude normalize.css from the output
 */

var graph = new compartment();
    graph.loadManifest('./manifest.json');
    graph.addTypes({
        js: '', // Handled by RequireJS
        css: './scss/toolkit/'
    });

var toPackage = [],
    categories = ['layout', 'component'];

if (options.components) {
    toPackage = options.components.split(',');

} else {
    Object.keys(graph.manifest).forEach(function(key) {
        if (key === 'normalize') {
            return;
        }

        if (categories.indexOf(graph.manifest[key].category) >= 0) {
            toPackage.push(key);
        }
    });
}

if (options.normalize || !('normalize' in options)) {
    toPackage.unshift('normalize');
}

// Build the chain and generate all the paths we will need.
graph.buildChain(toPackage, categories);

var jsPaths = graph.getPaths('js'),
    cssPaths = graph.getPaths('css'),
    buildPath = options.dist ? './dist' : './build';

/**
 * Tasks to compile CSS and JavaScript files.
 */

gulp.task('css', function() {
    return gulp.src(cssPaths)

        // Unminified
        .pipe(sass({
            style: 'expanded',
            loadPath: ['./scss/', './scss/toolkit/', './scss/toolkit/mixins/']
        }))
        .pipe(concat('toolkit.css'))
        .pipe(prefixer('last 3 versions'))
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest(buildPath))

        // Minified
        .pipe(rename({ suffix: '.min' }))
        .pipe(minify())
        .pipe(gulp.dest(buildPath));
});

gulp.task('js', function() {
    return rjs(jsPaths, { version: pkg.version })
        .pipe(jshint())
        .pipe(jshint.reporter('default'))

        // Unminified
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest(buildPath))

        // Minified
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify({
            // `some` includes more than just ! comments
            preserveComments: function(node, comment) {
                return comment.value.match(/^!/);
            }
        }))
        .pipe(gulp.dest(buildPath));
});

gulp.task('default', ['css', 'js']);

gulp.task('watch', function() {
    gulp.watch('./js/**/*.js', ['js']);
    gulp.watch('./scss/**/*.scss', ['css']);
});