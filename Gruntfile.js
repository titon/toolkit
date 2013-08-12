module.exports = function(grunt) {
	var _ = grunt.util._, // http://lodash.com/docs
		log = grunt.log;

	// Component tree and dependencies
	var manifest = {
		// Layout
		base: {
			css: ['layout/base.css'],
			js: ['Titon.js', 'Component.js'],
			moo: ['Core', 'More/Class.Binds', 'More/Elements.From', 'More/Hash', 'More/Locale', 'More/Element.Shortcuts']
		},
		typography: {
			css: ['layout/typography.css'],
			require: ['base']
		},
		grid: {
			css: ['layout/grid.css'],
			require: ['base']
		},
		form: {
			css: ['layout/form.css'],
			require: ['base', 'grid']
		},
		code: {
			css: ['layout/code.css'],
			require: ['base']
		},
		table: {
			css: ['layout/table.css'],
			require: ['base']
		},
		// Components
		accordion: {
			css: ['modules/accordion.css'],
			js: ['modules/Accordion.js'],
			require: ['base']
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
		breadcrumbs: {
			css: ['ui/breadcrumbs.css'],
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
		cache: {
			js: ['class/Cache.js'],
			moo: ['Core', 'JSON']
		},
		dropdown: {
			css: ['ui/dropdown.css'],
			require: ['base', 'toggle']
		},
		flyout: {
			css: ['modules/flyout.css'],
			js: ['modules/Flyout.js'],
			moo: ['More/Array.Extras'],
			require: ['base', 'timers']
		},
		icon: {
			css: ['ui/icon.css'],
			require: ['base']
		},
		inputGroup: {
			css: ['layout/input-group.css'],
			require: ['form']
		},
		labelBadge: {
			css: ['ui/label-badge.css'],
			effects: ['ui/effects/label.css'],
			require: ['base']
		},
		lazyLoad: {
			css: ['ui/lazy-load.css'],
			js: ['utilities/LazyLoad.js'],
			require: ['base']
		},
		modal: {
			css: ['modules/modal.css'],
			js: ['modules/Modal.js'],
			moo: ['More/Drag'],
			effects: ['modules/effects/modal.css'],
			require: ['base', 'blackout']
		},
		pagination: {
			css: ['ui/pagination.css'],
			effects: ['ui/effects/pagination.css'],
			require: ['base', 'button']
		},
		pin: {
			css: ['ui/pin.css'],
			js: ['utilities/Pin.js'],
			require: ['base']
		},
		popover: {
			css: ['modules/popover.css'],
			js: ['modules/Popover.js'],
			effects: ['modules/effects/popover-tooltip.css'],
			require: ['base', 'tooltip']
		},
		tabs: {
			css: ['modules/tabs.css'],
			js: ['modules/Tabs.js'],
			effects: ['modules/effects/tabs.css'],
			require: ['base']
		},
		timers: {
			js: ['class/Timers.js'],
			moo: ['Core']
		},
		toggle: {
			js: ['utilities/Toggle.js'],
			require: ['base']
		},
		tooltip: {
			css: ['modules/tooltip.css'],
			js: ['modules/Tooltip.js'],
			moo: ['More/Element.Event.Pseudos', 'More/Element.Position'],
			effects: ['modules/effects/popover-tooltip.css'],
			require: ['base']
		},
		typeAhead: {
			css: ['modules/type-ahead.css'],
			js: ['modules/TypeAhead.js'],
			require: ['base', 'cache']
		},
		visual: {
			css: ['effects/visual.css'],
			require: ['base']
		}
	};

	var themes = {
		titon: 'themes/titon.css',
		tomorrowNight: 'themes/tomorrow-night.css'
	};

	/**
	 * Determine which components we should package.
	 *
	 * The --components= parameter can be used to filter down components.
	 * The --effects= parameter can be used to include component effects.
	 * The --theme= parameter can be used to include a theme.
	 */
	var toPackage = grunt.option('components') ? grunt.option('components').split(',') : _.keys(manifest),
		useEffects = grunt.option('effects') ? grunt.option('effects').split(',') : [],
		useTheme = grunt.option('theme') || null,
		dependencies = {};

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
				if (key !== 'moo') {
					value = value.map(function(v) {
						return 'src/' + key + '/' + v;
					});
				}

				dependencies[key] = _.union(dependencies[key] || [], value);
			}
		});

		toPackage = _.union([name], toPackage);
	}

	toPackage.forEach(addDependency);

	if (useTheme) {
		if (themes[useTheme]) {
			dependencies.css.push('src/css/' + themes[useTheme]);
		} else {
			log.error('Invalid theme: ' + useTheme);
		}
	}

	/**
	 * Map all the available source files for each task.
	 * We need to map tons of different paths since each task accepts a different format -.-
	 */
	var cssPaths = {
			build: dependencies.css,
			buildSass: {}
		},
		jsPaths = {
			build: [],
			buildUglify: {}
		};

	dependencies.css.forEach(function(path) {
		cssPaths.buildSass[path] = path.replace(/css/g, 'scss');
	});

	dependencies.js.forEach(function(path) {
		var buildPath = path.replace(/src/g, 'build');

		jsPaths.build.push(buildPath);
		jsPaths.buildUglify[buildPath] = path;
	});

	/**
	 * Configure grunt and all its tasks.
	 */
	function createBanner() {
		return "/*!\n" +
			" * Titon Toolkit v<%= pkg.version %>\n" +
			" * <%= pkg.copyright %> - <%= pkg.homepage %>\n" +
			" * <%= pkg.licenses[0].type %> - <%= pkg.licenses[0].url %>\n" +
			" * Components: " + toPackage.sort().join(', ') + "\n" +
			" * Dependencies: " + dependencies.moo.sort().join(', ') + "\n" +
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
					Timers: true,
					Cache: true
				},
				browser: true,
				mootools: true,
				// enforcing
				//camelcase: true,
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
				files: cssPaths.buildSass
			}
		},

		// 3) Minify Javascript (CSS was minified in step 2)
		// http://lisperator.net/uglifyjs/
		uglify: {
			options: {
				report: 'min'
			},
			build: {
				files: jsPaths.buildUglify
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
					{ src: cssPaths.build, dest: '<%= buildFile %>.min.css' },
					{ src: jsPaths.build, dest: '<%= buildFile %>.min.js' }
				]
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
		},

		// 6) Use Intern to run JS unit tests
		// https://github.com/theintern/intern/wiki/Using-Intern-with-Grunt
		intern: {
			build: {
				options: {
					config: '../../tests/intern'
				}
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
	grunt.registerTask('default', ['jshint', 'uglify', 'concat', 'compress']);
};