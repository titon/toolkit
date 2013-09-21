/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Titon.Popover = new Class({
    Extends: Titon.Tooltip,

    /** Default options */
    options: {
        delegate: '.js-popover',
        position: 'topCenter',
        getContent: 'data-popover',
        titleElement: '.popover-head',
        contentElement: '.popover-body',
        template: '<div class="popover">' +
            '<div class="popover-inner">' +
                '<div class="popover-head"></div>' +
                '<div class="popover-body"></div>' +
            '</div>' +
            '<div class="popover-arrow"></div>' +
        '</div>'
    },

    /**
     * Initialize the component by fetching elements and binding events.
     *
     * @param {String} query
     * @param {Object} [options]
     */
    initialize: function(query, options) {
        options = options || {};
        options.mode = 'click';
        options.follow = false;

        this.parent(query, options);
    }

});

/**
 * Enable popovers on Elements collections by calling popover().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $$('.js-popover').popover({
 *         ajax: false
 *     });
 *
 * @param {Object} [options]
 * @returns {Titon.Popover}
 */
Elements.implement('popover', function(options) {
    var popover = new Titon.Popover(this, options);

    return this.each(function(el) {
        if (!el.$popover) {
            el.$popover = popover;
        }
    });
});

})();