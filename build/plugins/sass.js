const PLUGIN_NAME = 'toolkit-sass';

var gutil = require('gulp-util'),
    through = require('through2'),
    fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn;

module.exports = function(options) {
    gutil.log(gutil.colors.yellow('Transpiling CSS...'));

    return through.obj(function(file, enc, done) {
        var self = this,
            inputPath = file.path,
            outputPath = inputPath.replace('.scss', '.css');

        // Output sass to a temp file
        var sass = spawn('sass', [
            inputPath,
            outputPath,
            '--style=' + options.style,
            '--sourcemap=none',
            '--load-path=' + file.base,
            '--scss',
            '--unix-newlines'
        ]);

        gutil.log("\t" + gutil.colors.blue(inputPath
            .replace(file.cwd, '') // Remove base folder from path
            .replace('/scss/', '') // And the scss folder for normalize
            .replace('toolkit/', '') // And the toolkit folder for everything else
            .replace('.scss', '')));

        sass.on('error', function(error) {
            self.emit('error', new gutil.PluginError(PLUGIN_NAME, error));
        });

        sass.on('close', function(code) {
            if (code > 0) {
                self.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Exited with error code ' + code));
                return;
            }

            // Read the temp file contents
            self.push(new gutil.File({
                base: file.base,
                path: outputPath,
                contents: fs.readFileSync(outputPath)
            }));

            // And then delete it
            fs.unlink(outputPath);

            done();
        });
    });
};
