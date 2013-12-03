var compartment = require('compartment');

module.exports = function(grunt) {
    var _ = grunt.util._,
        graph = new compartment();

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
     */
    var toPackage = grunt.option('components') ? grunt.option('components').split(',') : [],
        useEffects =  grunt.option('effects') ? grunt.option('effects').split(',') : [],
        useTheme = grunt.option('theme') || null,
        categories = ['layout', 'component'];

    if (!toPackage.length) {
        _.each(graph.manifest, function(value, key) {
            if (value.category === 'layout' || value.category === 'component') {
                toPackage.push(key);
            }
        });
    }

    if (useTheme) {
        categories.push('theme');
        toPackage.push('theme-' + useTheme);
    }

    if (useEffects.length) {
        categories.push('effect');
        toPackage.push(useEffects.map(function(value) {
            return 'effect-' + value;
        }));
    }

    /**
     * Include or remove normalize from the output.
     */
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
        mooUglifyPaths = {},
        mooConcatPaths = [],
        jqUglifyPaths = {},
        jqConcatPaths = [],
        cssPaths = graph.getPaths('css');

    jsPaths.forEach(function(path) {
        var mooPath = path.replace('library', 'mootools'),
            jqPath = path.replace('library', 'jquery');

        mooConcatPaths.push('build/' + mooPath);
        mooUglifyPaths['build/' + mooPath] = mooPath;

        // jQuery doesn't have these files
        if (!_.contains(path, 'Cache.js') && !_.contains(path, 'Timers.js')) {
            jqConcatPaths.push('build/' + jqPath);
            jqUglifyPaths['build/' + jqPath] = jqPath;
        }
    });

    /**
     * Generate the banner to place at the top of each file.
     */
    function createBanner(hideDeps) {
        var comps = _.keys(graph.chain).join(','),
            banner = "/*!\n" +
                " * Titon Toolkit v<%= pkg.version %>\n" +
                " * <%= pkg.copyright %> - <%= pkg.homepage %>\n" +
                " * <%= pkg.licenses[0].type %> - <%= pkg.licenses[0].url %>\n";

        if (comps && !hideDeps) {
            banner += " * Components: " + comps + "\n";
        }

        banner += " */\n";

        return banner;
    }

    /**
     * Generate a list of file paths for the dist folder.
     */
    function prepareDistribution(css, jquery, mootools) {
        var list = {
            'dist/toolkit.min.css': css,
            'dist/toolkit-jquery.min.js': jquery,
            'dist/toolkit-mootools.min.js': mootools,
            'dist/jquery/toolkit.min.js': [jquery[0], jquery[1]],
            'dist/mootools/toolkit.min.js': [mootools[0], mootools[1]]
        }, name;

        jquery.forEach(function(path, index) {
            if (index <= 1) {
                return;
            }

            name = path.replace('build/js/jquery/components/', '').replace('.js', '.min.js').toLowerCase();
            list['dist/jquery/toolkit-' + name] = path;
        });

        mootools.forEach(function(path, index) {
            if (index <= 1) {
                return;
            }

            if (_.contains(path, 'class')) {
                name = path.replace('build/js/mootools/class/', 'class.').replace('.js', '.min.js').toLowerCase();
            } else {
                name = path.replace('build/js/mootools/components/', '').replace('.js', '.min.js').toLowerCase();
            }

            list['dist/mootools/toolkit-' + name] = path;
        });

        return list;
    }

    // Configure
    grunt.initConfig({
        // Package schema - https://npmjs.org/doc/json.html
        pkg: grunt.file.readJSON('package.json'),
        buildFile: 'build/<%= pkg.name.toLowerCase() %>-<%= pkg.version %>',

        // 1) Validate the Javascript source directory
        // http://jshint.com/docs/
        jshint: {
            options: {
                globals: {
                    Toolkit: true,
                    Timers: true,
                    Cache: true,
                    Jquery: true,
                    Zepto: true
                },
                browser: true,
                mootools: true,
                jquery: true,
                // enforcing
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                noempty: true,
                quotmark: 'single',
                undef: true,
                unused: 'vars',
                strict: true,
                trailing: true,
                // relaxing
                boss: true,
                scripturl: true
            },
            files: ['js/**/*.js']
        },

        // 2) Generate new CSS files before building
        // https://github.com/gruntjs/grunt-contrib-compass
        compass: {
            options: {
                config: 'config.rb',
                environment: 'production',
                outputStyle: 'compressed',
                trace: true
            },
            build: {},
            dist: {}
        },

        // 3) Minify Javascript
        // http://lisperator.net/uglifyjs/
        uglify: {
            options: {
                report: 'min'
            },
            build: {
                files: [jqUglifyPaths, mooUglifyPaths]
            },
            dist: {
                files: [jqUglifyPaths, mooUglifyPaths]
            }
        },

        // 4) Combine the JS and CSS components into a single file
        // https://npmjs.org/package/grunt-contrib-concat
        concat: {
            options: {
                banner: createBanner(),
                separator: "\n"
            },
            build: {
                files: [
                    { src: cssPaths, dest: '<%= buildFile %>.min.css' },
                    { src: jqConcatPaths, dest: '<%= buildFile %>-jquery.min.js' },
                    { src: mooConcatPaths, dest: '<%= buildFile %>-mootools.min.js' }
                ]
            },
            dist: {
                options: {
                    banner: createBanner(true)
                },
                files: prepareDistribution(cssPaths, jqConcatPaths, mooConcatPaths)
            }
        },

        // 5) Replace variables in files
        // https://npmjs.org/package/grunt-string-replace
        'string-replace': {
            options: {
                replacements: [
                    { pattern: '%version%', replacement: '<%= pkg.version %>' },
                    { pattern: '%build%', replacement: Date.now().toString(36) },
                    { pattern: /(\r?\n\r?\n)/g, replacement: "\n" },
                    { pattern: /\r?\n$/g, replacement: "" }
                ]
            },
            build: {
                files: {
                    '<%= buildFile %>.min.css': '<%= buildFile %>.min.css',
                    '<%= buildFile %>-jquery.min.js': '<%= buildFile %>-jquery.min.js',
                    '<%= buildFile %>-mootools.min.js': '<%= buildFile %>-mootools.min.js'
                }
            },
            dist: {
                files: {
                    'dist/toolkit.min.css': 'dist/toolkit.min.css',
                    'dist/toolkit-jquery.min.js': 'dist/toolkit-jquery.min.js',
                    'dist/toolkit-mootools.min.js': 'dist/toolkit-mootools.min.js',
                    'dist/jquery/toolkit.min.js': 'dist/jquery/toolkit.min.js',
                    'dist/mootools/toolkit.min.js': 'dist/mootools/toolkit.min.js'
                }
            }
        },

        // 6) Archive the files and docs into a zip
        // https://npmjs.org/package/grunt-contrib-compress
        compress: {
            options: {
                mode: 'zip',
                pretty: true,
                archive: '<%= buildFile %>.zip'
            },
            build: {
                files: [
                    { src: '*.css', dest: 'css/', cwd: 'build/', expand: true },
                    { src: '*.js', dest: 'js/', cwd: 'build/', expand: true },
                    { src: '*.md' }
                ]
            }
        },

        // Watch for changes
        watch: {
            scripts: {
                files: 'js/**/*.js',
                tasks: ['uglify:build']
            },
            styles: {
                files: 'scss/**/*.scss',
                tasks: ['compass:build']
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Register tasks
    grunt.registerTask('validate', ['jshint']);
    grunt.registerTask('dist', ['jshint', 'compass', 'uglify:dist', 'concat:dist', 'string-replace:dist']);
    grunt.registerTask('default', ['jshint', 'compass', 'uglify:build', 'concat:build', 'string-replace:build']);
};