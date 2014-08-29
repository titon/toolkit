define([
    'jquery',
    './aria',
    './transitionend'
], function($) {

/**
 * Conceal the element by applying the hide class.
 * Should be used to trigger transitions and animations.
 *
 * @param {bool} dontHide
 * @returns {jQuery}
 */
$.fn.conceal = function(dontHide) {
    if (this.hasClass('show') && !dontHide) {
        this.transitionend(function() {
            $(this).hide();
        });
    }

    return this
        .removeClass('show')
        .addClass('hide')
        .aria('hidden', true);
};

});