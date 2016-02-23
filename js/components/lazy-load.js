/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../toolkit',
    './component',
    '../extensions/throttle'
], function($, Toolkit, Component) {

var LazyLoad = Toolkit.LazyLoad = Component.extend({
    name: 'LazyLoad',
    version: '2.1.0',

    /** Container to monitor scroll events on. */
    container: $(window),

    /**
     * Initialize the lazy load.
     *
     * @param {jQuery} container
     * @param {Object} [options]
     */
    constructor: function(container, options) {
        if (container.css('overflow') === 'auto') {
            this.container = container;
        }
    },

    /**
     * Verify that the item is within the current browser viewport.
     *
     * @param {jQuery} node
     * @returns {bool}
     */
    inViewport: function(node) {
        // Re-adjust the offset to match the parent container
        // is() fails when checking against window
        if (container[0] !== window) {
            var conOffset = container.offset();

            left -= conOffset.left;
            top -= conOffset.top;
        }
    }
});

return LazyLoad;
});
