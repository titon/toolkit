module.exports = function(config) {
    config.set({
        basePath: '.',

        frameworks: ['jasmine', 'browserify'],

        files: [
            'tests-3.0/helpers.js',
            'tests-3.0/**/*-test.js'
        ],

        exclude: [
            'js-3.0/app.js'
        ],

        preprocessors: {
            'js-3.0/**/*.js': ['browserify'],
            'tests-3.0/**/*-test.js': ['browserify']
        },

        reporters: ['progress'],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: false,

        browsers: ['Chrome'], //, 'Firefox', (process.platform === 'win32' ? 'IE' : 'Safari')],

        singleRun: true,

        browserify: {
            debug: true,
            extensions: ['.js', '.jsx'],
            ignoreMissing: true,
            transform: [ ['babelify', require('./.babel.json')] ]
        }
    });
};
