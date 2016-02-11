/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../toolkit',
    './component',
    '../events/swipe'
], function($, Toolkit, Component) {

var OffCanvas = Toolkit.OffCanvas = Component.extend({
    name: 'OffCanvas',
    version: '2.0.0',

    /** The parent container. */
    container: null,

    /** The primary content wrapper. */
    primary: null,

    /** Secondary sibling sidebars. */
    secondary: null,

    /** The side the primary sidebar is located. */
    side: 'left',

    /** The opposite of `side`. */
    opposite: 'right',

    /** Will be true once document ready has triggered. We must use a flag as it can be called multiple times. */
    _loaded: false,

    /**
     * Initialize off canvas.
     *
     * @param {jQuery} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {

        // Initialize events
        this.addEvents([
            ['ready', 'document', 'onReady'],
            ['resize', 'window', 'onResize']
        ]);

        if (options.selector) {
            this.addEvent('click', 'document', 'toggle', options.selector);
        }

    },

    /**
     * Hide the sidebar and reset the container.
     */
    hide: function() {
        if (this.options.stopScroll) {
            $('body').removeClass('no-scroll');
        }
    },

    /**
     * Show the sidebar and squish the container to make room for the sidebar.
     * If hideOthers is true, hide other open sidebars.
     */
    show: function() {
        var options = this.options;

        if (options.stopScroll) {
            $('body').addClass('no-scroll');
        }

    },

    /**
     * Toggle between show and hide states.
     */
    toggle: function() {
        if (this.element.hasClass('is-expanded')) {
            this.hide();
        } else {
            this.show();
        }
    },

    /**
     * On page load, immediately display the sidebar.
     * Remove transitions from the sidebar and container so there is no page jumping.
     * Also disable `hideOthers` so multiple sidebars can be displayed on load.
     *
     * @private
     */
    onReady: function() {
        if (!this.options.openOnLoad || this._loaded) {
            return;
        }

        var sidebar = this.element,
            inner = this.primary,
            transClass = 'no-transition';

        sidebar.addClass(transClass);
        inner.addClass(transClass);

        this.show();

        // Transitions will still occur unless we place in a timeout
        setTimeout(function() {
            sidebar.removeClass(transClass);
            inner.removeClass(transClass);
        }, 15); // IE needs a minimum of 15

        this._loaded = true;
    },

}, {
    selector: '',
    animation: 'push',
    openOnLoad: false,
    hideOthers: true,
    stopScroll: true,
    swipe: Toolkit.isTouch
});

Toolkit.createPlugin('offCanvas', function(options) {
    return new OffCanvas(this, options);
});

return OffCanvas;
});
