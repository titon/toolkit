'use strict';

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    compartment = require('compartment');

var graph = new compartment();
    graph.loadManifest('./manifest.json');
    graph.addTypes({
        js: 'js/jquery/',
        css: 'css/toolkit/'
    });

var banner = "/*! Titon Toolkit v<%= pkg.version %> | <%= pkg.licenses[0].type %> License | <%= pkg.homepage %> */\n";

gulp.task('default', function() {
    gulp.src('./scss/**/*.scss')
        .pipe(sass({
            loadPath: ['./scss/', './scss/toolkit/', './scss/toolkit/mixins/']
        }))
        .pipe(gulp.dest('./css/'));
});