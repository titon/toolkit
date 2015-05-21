const PLUGIN_NAME = 'toolkit-requirejs';

var gutil = require('gulp-util'),
    through = require('through2'),
    rjs = require('requirejs'),
    buffer = require('buffer');

module.exports = function(paths, options) {
    gutil.log(gutil.colors.yellow('Compiling JS...'));

    var stream = through.obj();

    // Include the API in the build regardless of what plugins are filtered
    paths.push('flags/index.js');
    paths.push('events/index.js');
    paths.push('extensions/index.js');

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
        skipSemiColonInsertion: true,
        wrap: {
            start: "(function($, window, document) {\n'use strict';\n",
            end: "\n})(jQuery, window, document);"
        },
        onBuildWrite: function(module, path, contents) {
            var lines = contents.split("\n");
                lines.splice(0, 5); // Remove opening docblock

            contents = lines.join("\n").trim(); // Remove wrapping white space
            contents = contents.replace(/^define\([^{]*?\{\n/, ''); // Remove opening define() statement
            contents = contents.replace(/\n{1,2}(?:return [a-zA-Z\.]+;\n)?\}\);\n?$/, ''); // Remove closing statement and optional return

            if (module === 'toolkit') {
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
