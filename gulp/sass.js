const PLUGIN_NAME = 'toolkit-sass';

var gutil = require('gulp-util'),
    through = require('through2'),
    buffer = require('buffer'),
    sass = require('node-sass'),
    path = require('path'),
    fs = require('fs');

module.exports = function(paths, options) {
    gutil.log(gutil.colors.yellow('Transpiling CSS...'));

    var data = ['@charset "UTF-8";', '@import "common";'],
        stream = through.obj(),
        includePath = path.normalize(__dirname + '/../scss-3.0/');

    // Generate a fake inline Sass file to use for rendering
    paths.forEach(function(path) {
        if (fs.existsSync(includePath + path)) {
            path = path.replace(/\\/g, '/').replace('.scss', '');

            gutil.log("\t" + gutil.colors.blue(path));

            data.push('@import "' + path + '";');
        }
    });

    // Render the Sass file and pipe its output
    sass.render({
        data: data.join("\n"),
        includePaths: [includePath],
        outputStyle: options.style,
        sourceComments: false,
        sourceMap: false,
        indentWidth: 4
    }, function(error, response) {
        if (error) {
            throw new gutil.PluginError(PLUGIN_NAME,
                error.message + ' [' + error.file + ':' + error.line + ':' + error.column + ']');

        } else {
            var contents = response.css.toString();
                contents = contents.replace(/\/\*\*([\s\S]+?)\*\/\n/g, ''); // Replace docblocks
                contents = contents.replace(/\/\*[^!]([^*]+)\*\//g, ''); // Replace block comments
                contents = contents.replace(/ {4}\n/g, ''); // Replace empty lines
                contents = contents.replace(/\n{3,}/g, "\n\n"); // Replace multi-lines

            stream.write(new gutil.File({
                path: 'toolkit.css',
                contents: new buffer.Buffer(contents.trim())
            }));

            stream.end();
        }
    });

    return stream;
};
