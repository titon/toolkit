define([
    'jquery'
], function($) {

/**
 * Bound a number between a min and max range.
 *
 * @param {Number} value
 * @param {Number} max
 * @param {Number} min
 * @returns {Number}
 */
$.bound = function(value, max, min) {
    min = min || 0;

    if (value >= max) {
        value = 0;
    } else if (value < min) {
        value = max - 1;
    }

    return value;
};

});