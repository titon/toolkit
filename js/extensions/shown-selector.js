define([
    'jquery'
], function($) {

/**
 * Used for CSS animations and transitions.
 *
 * @param {jQuery} obj
 * @returns {bool}
 */
$.expr[':'].shown = function(obj) {
    return ($(obj).css('visibility') !== 'hidden');
};

});