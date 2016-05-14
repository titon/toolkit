const PLUGIN_NAME = 'toolkit-phantomjs';

var gutil = require('gulp-util'),
    through = require('through2'),
    spawn = require('child_process').spawn;

module.exports = function(options) {
    gutil.log(gutil.colors.yellow('Running PhantomJS...'));

    // Get the stream
    var stream = through.obj();

    // Run Mocha + PhantomJS
    var phantom = spawn('./node_modules/.bin/mocha-phantomjs', [
        // '--reporter=' + options.reporter,
        './tests/runner.html'
    ]);

    phantom.stdout.pipe(process.stdout);
    phantom.stderr.pipe(process.stderr);

    phantom.on('error', function(error) {
        stream.emit('error', new gutil.PluginError(PLUGIN_NAME, error));
    });

    // Stop the stream
    stream.end();

    return stream;
};
