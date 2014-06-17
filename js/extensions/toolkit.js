define([
    'jquery',
    '../core'
], function($, Toolkit) {

/**
 * Fetch the component instance from the jQuery collection.
 * If a method and arguments are defined, trigger a method on the instance.
 *
 * @param {String} component
 * @param {String} [method]
 * @param {Array} [args]
 * @returns {Function}
 */
$.fn.toolkit = function(component, method, args) {
    var selector = this.selector,
        instance = this.data('toolkit.' + component);

    // Check for the instance within the cache
    if (!instance && Toolkit.cache[component + '.' + selector]) {
        instance = Toolkit.cache[component + '.' + selector];
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