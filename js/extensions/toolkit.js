define([
    'jquery',
    '../core'
], function($, Toolkit) {

/**
 * Fetch the plugin instance from the jQuery collection.
 * If a method and arguments are defined, trigger a method on the instance.
 *
 * @param {String} plugin
 * @param {String} [method]
 * @param {Array} [args]
 * @returns {Function}
 */
$.fn.toolkit = function(plugin, method, args) {
    var selector = this.selector,
        instance = this.data('toolkit.' + plugin);

    // Check for the instance within the cache
    if (!instance && Toolkit.cache[plugin + '.' + selector]) {
        instance = Toolkit.cache[plugin + '.' + selector];
    }

    if (!instance) {
        return null;
    }

    // Trigger a method on the instance of method is defined
    if (method && instance[method]) {
        instance[method].apply(instance, $.makeArray(args));
    }

    return instance;
};

});