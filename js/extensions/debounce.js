define([
    'jquery'
], function($) {

/**
 * Delays the execution of a function till the duration has completed.
 *
 * @param {Function} func
 * @param {Number} [threshold]
 * @returns {Function}
 */
$.debounce = function(func, threshold) {
    var timeout;

    return function() {
        var context = this, args = arguments;

        clearTimeout(timeout);

        timeout = setTimeout(function() {
            timeout = null;

            func.apply(context, args);
        }, threshold || 150);
    };
};

});