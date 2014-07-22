define([
    'jquery',
    './aria'
], function($) {

/**
 * Conceal the element by applying the hide class.
 * Should be used to trigger transitions and animations.
 *
 * @returns {jQuery}
 */
$.fn.conceal = function() {
    return this
        .removeClass('show')
        .addClass('hide')
        .aria('hidden', true);
};

});