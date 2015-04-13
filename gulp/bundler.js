const PLUGIN_NAME = 'toolkit-bundler';

var gutil = require('gulp-util'),
    through = require('through2'),
    Builder = require('systemjs-builder'),
    buffer = require('buffer'),
    fs = require('fs');

module.exports = function(paths, options) {
    gutil.log(gutil.colors.yellow('Compiling JS...'));

    var stream = through.obj();

    new Builder({
        baseURL: './js-es6/',

        // Set babel runtime
        paths: {
            babel: '../node_modules/babel/node_modules/babel-core/browser.js'
        },

        // Define the bundle dependencies
        bundles: {
            toolkit: paths.map(function(path) {
                return path.replace('.js', '');
            })
        },

        // Configure babel
        transpiler: 'babel',
        babelOptions: JSON.parse(fs.readFileSync('./.babelrc'))
    })
    .build('toolkit', {
        runtime: false,
        minify: false,
        mangle: false,
        sourceMaps: false
    })
    .then(function(response) {
        stream.write(new gutil.File({
            path: 'toolkit.js',
            contents: new buffer.Buffer(response.source)
        }));

        stream.end();
    })
    .catch(function(error) {
        throw new gutil.PluginError(PLUGIN_NAME, 'Failed to compile SystemJS bundle file');
    });

    return stream;
};
