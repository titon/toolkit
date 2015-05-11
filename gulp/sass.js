const PLUGIN_NAME = 'toolkit-sass';

var gutil = require('gulp-util'),
    through = require('through2'),
    sass = require('node-sass'),
    buffer = require('buffer');

module.exports = function(options) {
    gutil.log(gutil.colors.yellow('Transpiling CSS...'));

    return through.obj(function(file, enc, done) {
        var self = this,
            inputPath = file.path,
            outputPath = inputPath.replace('.scss', '.css');

        sass.render({
            file: inputPath,
            outputStyle: options.style,
            sourceComments: false,
            sourceMap: false,
            indentedSyntax: true
        }, function(error, response) {
            if (error) {
                throw new gutil.PluginError(PLUGIN_NAME,
                    error.message + ' [' + error.file + ':' + error.line + ':' + error.column + ']');

            } else {
                gutil.log("\t" + gutil.colors.blue(inputPath
                    .replace(file.cwd, '')      // Remove base folder from path
                    .replace(/\\/g, '/')        // Fix Windows paths
                    .replace('/scss/', '')      // And the scss folder for normalize
                    .replace('toolkit/', '')    // And the toolkit folder for everything else
                    .replace('.scss', '')));

                // Read the temp file contents
                self.push(new gutil.File({
                    base: file.base,
                    path: outputPath,
                    contents: new buffer.Buffer(response.css)
                }));

                done();
            }
        });
    });
};
