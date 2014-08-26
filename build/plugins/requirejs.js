const PLUGIN_NAME = 'toolkit-requirejs';

var gutil = require('gulp-util'),
    rjs = require('requirejs'),
    through = require('through'),
    buffer = require('buffer');

module.exports = function(paths, options) {
    var stream = through();

    gutil.log('Compiling...');

    // Pause the stream and wait for the file to be created
    stream.pause();

    rjs.optimize({
        out: function(response) {
            stream.write(new gutil.File({
                path: 'toolkit.js',
                contents: new buffer.Buffer(response)
            }));

            // Now we can resume the stream
            // We need to do this or else the Gulp chain will break
            stream.resume();

            // And end it before passing it on
            // And we need to do this so that task_stop events are triggered
            stream.end();
        },
        baseUrl: './js/',
        include: paths,
        optimize: 'none',
        useStrict: true,
        wrap: {
            start: "(function($) {\n'use strict';\n",
            end: "\n})(jQuery);"
        },
        onBuildWrite: function(module, path, contents) {
            contents = contents.trim(); // Remove wrapping white space
            contents = contents.replace(/^define\([^{]*?\{\n/, ''); // Remove opening define() statement
            contents = contents.replace(/\n{1,2}(return [a-zA-Z]+;\n)?\}\);$/, ''); // Remove closing statement and optional return

            if (module === 'core') {
                contents = contents.replace('%version%', options.version); // Add version
                contents = contents.replace('%build%', Date.now().toString(36)); // Add unique build hash
            }

            gutil.log("\t" + gutil.colors.green(module.replace('.js', '')));

            return contents;
        }
    }, null, function() {
        throw new gutil.PluginError(PLUGIN_NAME, 'Failed to compile RequireJS optimized file');
    });

    return stream;
};