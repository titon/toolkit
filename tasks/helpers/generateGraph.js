'use strict';

var log = require('./log'),
    Compartment = require('compartment');

module.exports = function generateGraph(type, options) {
    log('Generating dependency graph...');

    var graph = new Compartment();
        graph.manifest = options.manifest;

    // Add the file types to graph
    graph.addTypes({
        js: '',
        css: ''
    });

    // Build the chain and generate all the paths we will need
    graph.buildChain(options.modules);

    return graph.getPaths(type);
};
