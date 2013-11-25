/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Titon.Popover = Titon.Tooltip.create(function(nodes, options) {

    /** Custom options */
    this.options = this.setOptions(Titon.Popover.options, options);

    /** List of nodes to activate tooltip */
    this.nodes = $(nodes);

    /** Tooltip wrapper */
    this.element = this.createElement(this.options);

    /** Inner elements */
    this.elementHead = null;
    this.elementBody = null;

    /** Cached requests */
    this.cache = {};

    this.initialize();
});

Titon.Popover.options = {
    mode: 'click',
    ajax: false,
    position: 'topCenter',
    showLoading: true,
    showTitle: true,
    getTitle: 'title',
    getContent: 'data-popover',
    xOffset: 0,
    yOffset: 0,
    delay: 0,
    titleElement: '.popover-head',
    contentElement: '.popover-body',
    template: '<div class="popover">' +
        '<div class="popover-inner">' +
            '<div class="popover-head"></div>' +
            '<div class="popover-body"></div>' +
        '</div>' +
        '<div class="popover-arrow"></div>' +
    '</div>'
};

/**
 * Enable popovers on Elements collections by calling popover().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $('.js-popover').popover({
 *         ajax: false
 *     });
 *
 * @param {Object} [options]
 * @returns {jQuery}
 */
$.fn.popover = function(options) {
    var popover = new Titon.Popover(this, options);

    return this.each(function() {
        if (!this.$popover) {
            this.$popover = popover;
        }
    });
};

})(jQuery);