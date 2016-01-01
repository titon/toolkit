module.exports = function(config) {
    config.set({
        basePath: '.',

        frameworks: ['jasmine', 'browserify'],

        files: [
            'tests/helpers.js',
            'tests/**/*-test.js'
        ],

        exclude: [
            'src/app.js'
        ],

        preprocessors: {
            'src/**/*.js': ['browserify'],
            'tests/**/*-test.js': ['browserify']
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
            ignoreMissing: true,
            transform: [ ['babelify', require('./.babel.json')] ]
        }
    });
};
