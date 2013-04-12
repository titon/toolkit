module.exports = function(grunt) {
	var _ = grunt.util._, // http://lodash.com/docs
		log = grunt.log;

	// Re-usable options
	var options = {
		jshint: {
			browser: true,
			mootools: true,
			globals: {
				Titon: true,
				Timers: true
			},
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
		}
	};

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
			css: ['ui/button.css'],
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
	var toPackage = grunt.option('package') ? grunt.option('package').split(',') : _.keys(manifest),
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
			if (key === 'provide') {
				value.forEach(addDependency);
			} else {
				dependencies[key] = _.union(dependencies[key] || [], value.map(function(v) {
					return 'src/' + key + '/' + v;
				}));
			}
		});
	}

	toPackage.forEach(addDependency);

	// Configure
	grunt.initConfig({
		// Package schema - https://npmjs.org/doc/json.html
		pkg: grunt.file.readJSON('package.json'),

		// JShint - http://jshint.com/docs/
		jshint: {
			src: {
				src: ['src/js/**/*.js'],
				options: options.jshint
			}
		}

		// CSSLint - https://github.com/stubbornella/csslint/wiki/Rules
		// Conflicts too much with SASS
	});

	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	//grunt.loadNpmTasks('grunt-contrib-watch');

	// Register tasks
	grunt.registerTask('validate', ['jshint']);
	grunt.registerTask('default', ['jshint']);//, ['concat', 'uglify']);
};