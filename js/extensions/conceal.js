/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    './aria',
    './transitionend'
], function($) {

/**
 * Conceal the element by applying the hide class.
 * Should be used to trigger transitions and animations.
 *
 * @param {bool} [dontHide]
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