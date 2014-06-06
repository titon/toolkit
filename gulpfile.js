'use strict';

var pkg = require('./package.json'),
    gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-frep'),
    prefixer = require('gulp-autoprefixer'),
    compartment = require('compartment'),
    options = require('minimist')(process.argv.slice(2), {  default: { normalize: true } }),
    _ = require('lodash');

var banner = "/*! Titon Toolkit v<%= pkg.version %> | <%= pkg.licenses[0].type %> License | <%= pkg.homepage %> */\n";

/**
 * Determine which components we should package.
 *
 * The --components parameter can be used to filter down components
 * The --no-normalize parameter will exclude normalize.css from the output
 */

var graph = new compartment();
    graph.loadManifest('./manifest.json');
    graph.addTypes({
        js: './js/jquery/',
        css: './scss/toolkit/'
    });

// If --components is passed, whitelist the package
var toPackage = [],
    categories = ['layout', 'component'];

if (options.components) {
    toPackage = options.components.split(',');

} else {
    _.each(graph.manifest, function(value, key) {
        if (_.contains(categories, value.category)) {
            toPackage.push(key);
        }
    });
}

// If --no-normalize is passed, include or remove normalize from the output
var hasNormalize = _.contains(toPackage, 'normalize');

if (!options.normalize) {
    if (!hasNormalize) {
        toPackage.unshift('normalize');
    }
} else if (hasNormalize)  {
    toPackage = _.without(toPackage, 'normalize');
}

// Build the chain and generate all the paths we will need.
graph.buildChain(toPackage, categories);

var jsPaths = graph.getPaths('js'),
    cssPaths = graph.getPaths('css');

/**
 * Tasks to compile CSS and JavaScript files.
 */

var BUILD = './build';

gulp.task('clean', function () {
    return gulp.src(BUILD, { read: false })
        .pipe(clean());
});

gulp.task('css', function() {
    return gulp.src(cssPaths)
        .pipe(sass({
            style: 'nested',
            loadPath: ['./scss/', './scss/toolkit/', './scss/toolkit/mixins/']
        }))
        .pipe(concat('toolkit.css'))
        .pipe(prefixer('last 3 versions'))
        .pipe(gulp.dest(BUILD))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minify())
        .pipe(gulp.dest(BUILD));
});

gulp.task('js', function() {
    return gulp.src(jsPaths)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('toolkit.js'))
        .pipe(replace([
            { pattern: '%version%', replacement: pkg.version },
            { pattern: '%build%', replacement: Date.now().toString(36) }
        ]))
        .pipe(gulp.dest(BUILD))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(BUILD));
});

gulp.task('default', ['css', 'js']);