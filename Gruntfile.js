var compartment = require('compartment');

module.exports = function(grunt) {
    var _ = grunt.util._,
        graph = new compartment(),
        banner = "/*! Titon Toolkit v<%= pkg.version %> | <%= pkg.licenses[0].type %> License | <%= pkg.homepage %> */\n";

    graph.loadManifest(__dirname + '/manifest.json');
    graph.addTypes({
        js: 'js/library/',
        css: 'css/toolkit/',
        moo: '',
        jquery: ''
    });

    /**
     * Determine which components we should package. Allow for optional theme to be appended.
     *
     * The --components parameter can be used to filter down components
     * The --effects parameter can be used to include effects styles
     * The --theme parameter can be used to include a theme
     * The --no-normalize parameter will exclude normalize.css from the output
     * The --demo parameter will include all files for demo debugging
     */
    var toPackage = grunt.option('components') ? grunt.option('components').split(',') : [],
        useEffects =  grunt.option('effects') ? grunt.option('effects').split(',') : [],
        useTheme = grunt.option('theme') || null,
        categories = ['layout', 'component'];

    // If --demo is passed, enable all components and effects
    if (grunt.option('demo')) {
        toPackage = [];
        useEffects = [];
        useTheme = null;
        categories.push('effect');
    }

    // If no components are defined, include all from the defined categories
    if (!toPackage.length) {
        _.each(graph.manifest, function(value, key) {
            if (_.contains(categories, value.category)) {
                toPackage.push(key);
            }
        });
    }

    // If --theme is passed, include the theme in the output
    if (useTheme) {
        categories.push('theme');
        toPackage.push('theme-' + useTheme);
    }

    // If --effects is passed, include the effects files in the package
    if (useEffects.length) {
        categories.push('effect');
        toPackage.push(useEffects.map(function(value) {
            return 'effect-' + value;
        }));
    }

    // If --no-normalize is passed, include or remove normalize from the output
    var hasNormalize = _.contains(toPackage, 'normalize');

    if (!grunt.option('no-normalize')) {
        if (!hasNormalize) {
            toPackage.unshift('normalize');
        }
    } else if (hasNormalize)  {
        toPackage = _.without(toPackage, 'normalize');
    }

    /**
     * Build the chain and generate all the paths we will need.
     */
    graph.buildChain(toPackage, categories);

    var jsPaths = graph.getPaths('js'),
        cssPaths = graph.getPaths('css'),
        mooPaths = jsPaths.map(function(path) {
            return path.replace('library', 'mootools');
        }),
        jqueryPaths = jsPaths.map(function(path) {
            return path.replace('library', 'jquery');
        }).filter(function(path) {
            return !_.contains(path, 'Cache.js') && !_.contains(path, 'Timers.js');
        }),
        scssPaths = [{
            expand: true,
            cwd: 'scss/',
            src: ['**/*.scss'],
            dest: 'css/',
            ext: '.css'
        }];

    // Configure
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // 1) Validate the Javascript source directory
        // http://jshint.com/docs/
        jshint: {
            options: grunt.file.readJSON('.jshintrc'),
            files: ['js/**/*.js']
        },

        // 2) Generate new CSS files before building
        // https://github.com/gruntjs/grunt-sass
        /*sass: {
            options: {
                outputStyle: 'compressed'
            },
            build: {
                options: {
                    outputStyle: 'nested'
                },
                files: scssPaths
            },
            dist: {
                files: scssPaths
            }
        },*/

        // https://github.com/gruntjs/grunt-contrib-sass
        sass: {
            options: {
                trace: true,
                style: 'compressed'
            },
            build: {
                options: {
                    style: 'nested'
                },
                files: scssPaths
            },
            dist: {
                files: scssPaths
            }
        },

        // 3) Combine the JS and CSS components into a single file
        // https://github.com/gruntjs/grunt-contrib-concat
        concat: {
            options: {
                banner: banner,
                separator: ''
            },
            build: {
                files: [
                    { src: cssPaths, dest: 'build/toolkit.min.css' },
                    { src: jqueryPaths, dest: 'build/toolkit-jquery.min.js' },
                    { src: mooPaths, dest: 'build/toolkit-mootools.min.js' }
                ]
            },
            dist: {
                files: [
                    { src: cssPaths, dest: 'dist/toolkit.min.css' },
                    { src: jqueryPaths, dest: 'dist/toolkit-jquery.min.js' },
                    { src: mooPaths, dest: 'dist/toolkit-mootools.min.js' }
                ]
            }
        },

        // 4) Minify Javascript using the concatenated file
        // http://lisperator.net/uglifyjs/
        uglify: {
            options: {
                report: 'min',
                preserveComments: false,
                banner: banner,
                enclose: {
                    window: 'window'
                }
            },
            build: {
                options: {
                    mangle: false,
                    compress: false,
                    beautify: true
                },
                files: {
                    'build/toolkit-jquery.min.js': 'build/toolkit-jquery.min.js',
                    'build/toolkit-mootools.min.js': 'build/toolkit-mootools.min.js'
                }
            },
            prod: {
                files: {
                    'build/toolkit-jquery.min.js': 'build/toolkit-jquery.min.js',
                    'build/toolkit-mootools.min.js': 'build/toolkit-mootools.min.js'
                }
            },
            dist: {
                files: {
                    'dist/toolkit-jquery.min.js': 'dist/toolkit-jquery.min.js',
                    'dist/toolkit-mootools.min.js': 'dist/toolkit-mootools.min.js'
                }
            }
        },

        // 4) Apply auto prefixing to CSS properties
        // https://github.com/nDmitry/grunt-autoprefixer
        autoprefixer: {
            options: {
                browsers: ['last 3 versions'],
                map: false
            },
            build: {
                files: {
                    'build/toolkit.min.css': 'build/toolkit.min.css'
                }
            },
            dist: {
                files: {
                    'dist/toolkit.min.css': 'dist/toolkit.min.css'
                }
            }
        },

        // 5) Replace variables in files
        // https://npmjs.org/package/grunt-string-replace
        'string-replace': {
            options: {
                replacements: [
                    { pattern: '%version%', replacement: '<%= pkg.version %>' },
                    { pattern: '%build%', replacement: Date.now().toString(36) }
                ]
            },
            build: {
                files: {
                    'build/toolkit.min.css': 'build/toolkit.min.css',
                    'build/toolkit-jquery.min.js': 'build/toolkit-jquery.min.js',
                    'build/toolkit-mootools.min.js': 'build/toolkit-mootools.min.js'
                }
            },
            dist: {
                files: {
                    'dist/toolkit.min.css': 'dist/toolkit.min.css',
                    'dist/toolkit-jquery.min.js': 'dist/toolkit-jquery.min.js',
                    'dist/toolkit-mootools.min.js': 'dist/toolkit-mootools.min.js'
                }
            }
        },

        // Watch for changes
        watch: {
            scripts: {
                files: 'js/**/*.js',
                tasks: ['newer:concat:build', 'uglify:build']
            },
            styles: {
                files: 'scss/**/*.scss',
                tasks: ['sass:build', 'concat:build', 'autoprefixer:build']
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-newer');

    // Register tasks
    grunt.registerTask('validate', ['jshint']);
    grunt.registerTask('distribute', ['jshint', 'sass:dist', 'concat:dist', 'uglify:dist', 'autoprefixer:dist', 'string-replace:dist']);
    grunt.registerTask('production', ['jshint', 'sass:dist', 'concat:build', 'uglify:prod', 'autoprefixer:build', 'string-replace:build']);
    grunt.registerTask('default', ['jshint', 'sass:build', 'concat:build', 'uglify:build', 'autoprefixer:build', 'string-replace:build']);
};