/* eslint strict: 0, no-var: 0 */

'use strict';

var log = require('./log'),
    Compartment = require('compartment');

module.exports = function generateGraph(type, options) {
    log('Generating dependency graph...');

    let graph = new Compartment();

    graph.manifest = options.manifest;

    // Add the file types to graph
    graph.addTypes({
        js: '',
        css: ''
    });

    // Build the chain and generate all the paths we will need
    graph.buildChain(options.modules || Object.keys(graph.manifest));

    return graph.getPaths(type);
};
