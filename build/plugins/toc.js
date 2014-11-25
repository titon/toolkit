const PLUGIN_NAME = 'toolkit-toc';

var gutil = require('gulp-util'),
    through = require('through2'),
    fs = require('fs'),
    path = require('path');

function parseFolder(path, url) {
    var children = [],
        folders = [],
        files = [],
        title = '';

    // Gather the files and folders
    fs.readdirSync(path).forEach(function(file) {
        if (file === 'toc.json') {
            // Skip

        } else if (file.substr(-3) === '.md') {
            files.push(file);

        } else {
            folders.push(file);
        }
    });

    // Parse files first
    files.forEach(function(file) {
        if (file === 'index.md') {
            title = parseFile(path + '/index.md', '/').title;
        } else {
            children.push( parseFile(path + '/' + file, url + '/' + file) );
        }
    });

    // And folders last
    folders.forEach(function(folder) {
        children.push( parseFolder(path + '/' + folder, url + '/' + folder) );
    });

    return {
        title: title,
        url: url.replace('//', '/'),
        children: children
    }
}

function parseFile(path, url) {
    var lines = fs.readFileSync(path, 'utf8').split("\n"),
        chapters = [],
        title = '';

    // Prepare URL
    url = url.replace('//', '/').replace('.md', '');

    // Walk through and extract chapters
    lines.forEach(function(line) {
        var matches = line.match(/^(#{1,})/);

        if (matches && matches.length) {
            var header = line.replace(/#/g, '').replace('&', 'and').trim(),
                size = matches[0].length,
                indent = '';

            // Remove function arguments for the extensions page
            header = header.replace(/\([^\)]+\)/, '()');

            // Top level should be used as the title
            if (size === 1) {
                title = header;

            // All other headers are a chapter in the file
            } else {
                size -= 2;

                // Indent with spacing based on depth
                while (size > 0) {
                    indent += '  ';
                    --size;
                }

                chapters.push({
                    title: indent + header,
                    url: url + '#' + header.toLowerCase().replace(/\s/g, '-').replace('()', '').replace(':', '')
                });
            }
        }
    });

    return {
        title: title,
        url: url,
        chapters: chapters
    };
}

module.exports = function() {
    gutil.log(gutil.colors.yellow('Generating table of contents...'));

    return through.obj(function(file, enc, done) {
        var stats = fs.lstatSync(file.path);

        // We only want to process folders
        if (!stats.isDirectory()) {
            done();
            return;
        }

        var tree = parseFolder(file.path, '/');
            tree.locale = path.basename(file.path);

        //console.log(require('util').inspect(tree, true, 10));

        done();
    });
};