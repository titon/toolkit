const PLUGIN_NAME = 'toolkit-requirejs';

var gutil = require('gulp-util'),
    through = require('through2'),
    rjs = require('requirejs'),
    buffer = require('buffer');

module.exports = function(paths, options) {
    gutil.log(gutil.colors.yellow('Compiling JS...'));

    var stream = through.obj();

    rjs.optimize({
        out: function(response) {
            stream.write(new gutil.File({
                path: 'toolkit.js',
                contents: new buffer.Buffer(response)
            }));

            stream.end();
        },
        baseUrl: './js/',
        include: paths,
        optimize: 'none',
        useStrict: true,
        wrap: {
            start: "(function($, window, document) {\n'use strict';\n",
            end: "\n})(jQuery, window, document);"
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