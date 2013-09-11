var compartment = require('compartment');

module.exports = function(grunt) {
	var _ = grunt.util._,
		graph = new compartment();

	graph.loadManifest(__dirname + '/manifest.json');
	graph.addTypes({
		js: 'src/js/mootools/',
		css: 'src/css/toolkit/',
		moo: ''
	});

	/**
	 * Determine which components we should package. Allow for optional theme to be appended.
	 *
	 * The --components parameter can be used to filter down components
	 * The --theme parameter can be used to include a theme
	 */
	var toPackage = grunt.option('components') ? grunt.option('components').split(',') : [],
		useTheme = grunt.option('theme') || null,
		categories = ['layout', 'component'];

	if (useTheme) {
		useTheme = 'theme-' + useTheme;

		if (!toPackage) {
			toPackage = _.keys(graph.manifest);
		}

		categories.push('theme');
		toPackage.push(useTheme);
	}

	/**
	 * Build the chain and generate all the paths we will need.
	 */
	graph.buildChain(toPackage, categories);

	var jsPaths = graph.getPaths('js'),
		jsUglifyPaths = {},
		jsConcatPaths = [],
		cssPaths = graph.getPaths('css');

	jsPaths.forEach(function(path) {
		var buildPath = path.replace(/src/g, 'build');

		jsConcatPaths.push(buildPath);
		jsUglifyPaths[buildPath] = path;
	});

	/**
	 * Generate the banner to place at the top of each file.
	 */
	function createBanner() {
		var comps = _.keys(graph.chain).join(', '),
			deps = graph.getPaths('moo').sort().join(', '),
			banner = "/*!\n" +
				" * Titon Toolkit v<%= pkg.version %>\n" +
				" * <%= pkg.copyright %> - <%= pkg.homepage %>\n" +
				" * <%= pkg.licenses[0].type %> - <%= pkg.licenses[0].url %>\n";

		if (comps) {
			banner += " * Components: " + comps + "\n";
		}

		if (deps) {
			banner += " * Dependencies: " + deps + "\n";
		}

		banner += " */\n";

		return banner;
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
					Titon: true,
					Timers: true,
					Cache: true
				},
				browser: true,
				mootools: true,
				// enforcing
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				noempty: true,
				quotmark: 'single',
				smarttabs: true,
				undef: true,
				unused: true,
				strict: true,
				trailing: true,
				// relaxing
				boss: true,
				scripturl: true
			},
			build: {
				src: ['src/js/**/*.js']
			}
		},

		// 2) Generate new CSS files before building
		// https://github.com/gruntjs/grunt-contrib-sass
		sass: {
			options: {
				style: 'compressed',
				compass: 'src/config.rb',
				trace: true
			},
			build: {
				files: [{
					expand: true,
					cwd: 'src/scss',
					src: '**/*.scss',
					dest: 'src/css',
					ext: '.css'
				}]
			}
		},

		// 3) Minify Javascript
		// http://lisperator.net/uglifyjs/
		uglify: {
			options: {
				report: 'min'
			},
			build: {
				files: jsUglifyPaths
			}
		},

		// 4) Combine the JS and CSS components into a single file
		// https://npmjs.org/package/grunt-contrib-concat
		concat: {
			options: {
				stripBanners: true,
				banner: createBanner(),
				separator: "\n"
			},
			build: {
				files: [
					{ src: cssPaths, dest: '<%= buildFile %>.min.css' },
					{ src: jsConcatPaths, dest: '<%= buildFile %>.min.js' }
				]
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
					'<%= buildFile %>.min.js': '<%= buildFile %>.min.js'
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
		}
	});

	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-string-replace');

	// Register tasks
	grunt.registerTask('validate', ['jshint']);
	grunt.registerTask('compile', ['sass', 'uglify']);
	grunt.registerTask('build', ['concat', 'string-replace']);
	grunt.registerTask('default', ['jshint', 'sass', 'uglify', 'concat', 'string-replace']);
};