const PLUGIN_NAME = 'toolkit-toc';

var gutil = require('gulp-util'),
    through = require('through2'),
    fs = require('fs'),
    path = require('path');

// Handles the ordering of files
var ORDER_MAP = {
    '/setup': 1,
    '/setup/getting-started': 1,
    '/setup/installing': 2,
    '/setup/tool-integration': 3,
    '/setup/custom-builds': 4,
    '/setup/demos': 5,
    '/development': 2,
    '/development/js': 1,
    '/development/js/usage': 1,
    '/development/js/toolkit': 2,
    '/development/js/class': 3,
    '/development/js/base': 4,
    '/development/js/component': 5,
    '/development/js/no-conflict': 6,
    '/development/js/extensions': 7,
    '/development/js/conventions': 8,
    '/development/css': 2,
    '/development/css/base': 1,
    '/development/css/philosophies': 2,
    '/development/css/prefixing': 3,
    '/development/css/reserved': 4,
    '/development/sass': 3,
    '/development/sass/usage': 1,
    '/development/sass/variables': 2,
    '/development/sass/mixins': 3,
    '/development/sass/functions': 4,
    '/components': 3,
    '/components/component': 1,
    '/support': 4,
    '/support/compatibility': 1,
    '/support/comparison': 2,
    '/support/contributing': 3,
    '/support/changelog': 4,
    '/support/license': 5,
    '/releases': 5,
    '/migrations': 6
};

function parseFolder(path, url) {
    var children = [],
        folders = [],
        files = [],
        title = '';

    // Prepare URL
    url = url.replace('//', '/');

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

    // Then sort the children by order and title
    children = children.sort(function(a, b) {
        var x = a.order,
            y = b.order,
            x2 = a.title,
            y2 = b.title;

        return ((x < y) ? -1 : ((x > y) ? 1 : x2.localeCompare(y2)));
    });

    return {
        title: title,
        url: url,
        order: ORDER_MAP[url] || 50,
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
                    url: url + formatHash(header)
                });
            }
        }
    });

    return {
        title: title,
        url: url,
        order: ORDER_MAP[url] || 100,
        chapters: chapters
    };
}

function formatHash(hash) {
    hash = hash.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9\-_]+/ig, '');

    if (/^\d$/.test(hash.charAt(0))) {
        hash = 'no-' + hash;
    }

    return '#' + hash;
}

module.exports = function() {
    gutil.log(gutil.colors.yellow('Generating table of contents...'));

    return through.obj(function(file, enc, done) {

        // We only want to process folders
        if (file.path.substr(-3) === '.md') {
            done();
            return;
        }

        // Generate a tree
        var tree = parseFolder(file.path, '/');
            tree.locale = path.basename(file.path);

        // Output the file as JSON
        fs.writeFileSync(file.path + '/toc.json', JSON.stringify(tree, null, 4));

        done();
    });
};
