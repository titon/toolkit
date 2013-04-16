module.exports = function(grunt) {
	var _ = grunt.util._, // http://lodash.com/docs
		log = grunt.log;

	// Component tree and dependencies
	var manifest = {
		base: {
			css: ['base.css'],
			js: ['Titon.js', 'Module.js']
		},
		alert: {
			css: ['ui/alert.css'],
			require: ['base']
		},
		blackout: {
			css: ['modules/blackout.css'],
			js: ['modules/Blackout.js'],
			require: ['base']
		},
		button: {
			css: ['ui/button.css'],
			require: ['base']
		},
		buttonGroup: {
			css: ['ui/button-group.css'],
			effects: ['ui/effects/button-group.css'],
			require: ['button']
		},
		flyout: {
			css: ['modules/flyout.css'],
			js: ['modules/Flyout.js'],
			require: ['base', 'timers']
		},
		icon: {
			css: ['ui/icon.css'],
			require: ['base']
		},
		labelBadge: {
			css: ['ui/label-badge.css'],
			effects: ['ui/effects/label.css'],
			require: ['base']
		},
		lazyLoad: {
			js: ['utilities/LazyLoad.js'],
			require: ['base']
		},
		modal: {
			css: ['modules/modal.css'],
			js: ['modules/Modal.js'],
			require: ['base']
		},
		pagination: {
			css: ['ui/pagination.css'],
			effects: ['ui/effects/pagination.css'],
			require: ['base', 'button']
		},
		popover: {
			css: ['modules/popover.css'],
			js: ['modules/Popover.js'],
			require: ['base', 'tooltip']
		},
		tabs: {
			css: ['modules/tabs.css'],
			js: ['modules/Tabs.js'],
			effects: ['modules/effects/tabs.css'],
			require: ['base']
		},
		timers: {
			js: ['class/Timers.js']
		},
		tooltip: {
			css: ['modules/tooltip.css'],
			js: ['modules/Tooltip.js'],
			require: ['base']
		},
		visual: {
			css: ['effects/visual.css'],
			require: ['base']
		}
	};

	// Determine which files we should package
	var toPackage = grunt.option('components') ? grunt.option('components').split(',') : _.keys(manifest),
		useEffects = grunt.option('effects') ? grunt.option('effects').split(',') : toPackage,
		dependencies = {};

	toPackage.forEach(addDependency);

	// Helper functions
	function addDependency(name) {
		if (!manifest[name]) {
			log.error('Invalid component: ' + name);
		}

		var component = manifest[name];

		if (component.require) {
			component.require.forEach(addDependency);
			delete component.require;
		}

		_.forOwn(component, function(value, key) {
			if (key === 'effects') {
				if (!_.contains(useEffects, name)) {
					return;
				}

				key = 'css';
			}

			if (key === 'provide') {
				value.forEach(addDependency);

			} else {
				dependencies[key] = _.union(dependencies[key] || [], value.map(function(v) {
					return 'src/' + key + '/' + v;
				}));
			}
		});

		toPackage = _.union([name], toPackage);
	}

	function mapSass(css) {
		var map = {};

		css.forEach(function(path) {
			map[path] = path.replace(/css/g, 'scss');
		});

		return map;
	}

	function createBanner() {
		return "/*!\n" +
			" * Titon Toolkit v<%= pkg.version %>\n" +
			" * <%= pkg.copyright %> - <%= pkg.homepage %>\n" +
			" * <%= pkg.licenses[0].type %> - <%= pkg.licenses[0].url %>\n" +
			" * Components: " + toPackage.join(', ') + "\n" +
			" */\n";
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
					Timers: true
				},
				browser: true,
				mootools: true,
				// enforcing
				camelcase: true,
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
				boss: true
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
				compass: 'src/config.rb'
			},
			build: {
				files: mapSass(dependencies.css)
			}
		},

		// 3) Combine the JS and CSS components into a single file
		// https://npmjs.org/package/grunt-contrib-concat
		concat: {
			options: {
				banner: createBanner(),
				separator: ""
			},
			build: {
				files: [
					{ src: dependencies.css, dest: '<%= buildFile %>.min.css' },
					{ src: dependencies.js, dest: '<%= buildFile %>.min.js' }
				]
			}
		},

		// 4) Minify Javascript (CSS was minified in step 2)
		// http://lisperator.net/uglifyjs/
		uglify: {
			options: {
				report: 'min',
				banner: createBanner()
			},
			build: {
				files: {
					'<%= buildFile %>.min.js': '<%= buildFile %>.min.js'
				}
			}
		},

		// 5) Archive the files and docs into a zip
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

	// Register tasks
	grunt.registerTask('validate', ['jshint']);
	grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'compress']);
};