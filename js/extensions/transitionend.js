/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../flags/transitionend'
], function($, transitionEnd) {

/**
 * Set a `transitionend` event. If the element has no transition set, trigger the callback immediately.
 *
 * @param {Object} data
 * @param {Function} [fn]
 * @returns {jQuery}
 */
$.fn.transitionend = function(data, fn) {
    if (arguments.length > 0) {
        this.one(transitionEnd, null, data, fn);

        // No transition defined so trigger callback immediately
        var duration = this.css("transition-duration");

        if (duration === "0s" || $.type(duration) === 'undefined') {
            this.trigger(transitionEnd);
        }
    } else {
        this.trigger(transitionEnd);
    }

    return this;
};

});