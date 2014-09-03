define([
    'jquery'
], function($) {

/**
 * Return the markup of the element in the collection as a string.
 *
 * @returns {String}
 */
$.fn.toString = function() {
    return this.prop('outerHTML');
};

});