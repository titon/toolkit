'use strict';

var fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    tree = require('directory-tree').directoryTree,
    // Helpers
    log = require('./helpers/log');

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

module.exports = function(command) {
    var options = command.parent,
        locales = ['en'];

    log.title('titon:docs');
    log('Generating ' + chalk.gray(locales.join(', ')) + ' table of contents...');

    return Promise.all(locales.map(function(locale) {
        return new Promise(function(resolve) {
            return resolve(tree('docs/' + locale, ['.md']));
        });
    }))

    // Rebuild the trees object structure
    .then(function(trees) {
        log('Calcuating directory tree...');

        var buildTree = function(node) {
            var path = '/' + node.path.replace(/\\/g, '/'),
                url = path.replace('.md', ''),
                children = [],
                parentNode = {
                    title: node.name,
                    url: url,
                    path: path,
                    order: ORDER_MAP[url] || 50
                };

            // Rebuild children
            if (node.children && node.children.length) {
                node.children.forEach(function(child) {
                    var childNode = buildTree(child);

                    // Index file is used as the parent
                    if (
                        parentNode.url + '/index.md' === childNode.path ||
                        parentNode.url === '/' && childNode.path === '/index.md'
                    ) {
                        parentNode.path = childNode.path;

                    } else {
                        children.push(childNode);
                    }
                });
            }

            // Save the children
            if (children.length) {
                parentNode.children = children;
            }

            return parentNode;
        };

        return trees.map(function(node) {
            var rootNode = buildTree(node);
                rootNode.locale = node.name;

            return rootNode;
        });
    })

    // Parse markdown from files
    .then(function(trees) {
        log('Extracting markdown content...');

        var parseFile = function(node, basePath) {
            var lines = fs.readFileSync(basePath + node.path, 'utf8').split('\n'),
                chapters = [];

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
                        node.title = header;

                    // All other headers are a chapter in the file
                    } else {
                        size -= 2;

                        // Indent with spacing based on depth
                        while (size > 0) {
                            indent += '  ';
                            --size;
                        }

                        // Generate an HTML fragment
                        var hash = header.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9\-_]+/ig, '');

                        if (hash.charAt(0).match(/^\d$/)) {
                            hash = 'no-' + hash;
                        }

                        chapters.push({
                            title: indent + header,
                            hash: '#' + hash
                        });
                    }
                }
            });

            // Save the chapters
            if (chapters.length) {
                node.chapters = chapters;
            }

            // Parse children as well
            if (node.children && node.children.length) {
                node.children.map(function(child) {
                    return parseFile(child, basePath);
                });
            }

            return node;
        };

        return trees.map(function(node) {
            return parseFile(node, 'docs/' + node.locale);
        });
    })

    // Sort the children based on order
    .then(function(trees) {
        log('Ordering documentation...');

        var sortTree = function(node) {
            if (node.children && node.children.length) {
                node.children.sort(function(a, b) {
                    var x = a.order,
                        y = b.order,
                        x2 = a.title,
                        y2 = b.title;

                    /* eslint no-nested-ternary:0 */
                    return ((x < y) ? -1 : ((x > y) ? 1 : x2.localeCompare(y2)));
                });

                // Recursively sort as well
                node.children.map(function(child) {
                    return sortTree(child);
                });
            }

            return node;
        };

        return trees.map(function(node) {
            return sortTree(node);
        });
    })

    // Write the trees to a JSON file
    .then(function(trees) {
        return trees.map(function(node) {
            var toc = node.locale + '/toc.json';

            log('Saving ' + chalk.gray(toc));

            fs.writeFileSync('docs/' + toc, JSON.stringify(node, null, 4));

            return node;
        });
    });
};
