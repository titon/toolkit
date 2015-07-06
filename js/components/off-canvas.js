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
        element = this.setElement(element).attr('role', 'complementary').conceal();
        options = this.setOptions(options, element);

        var animation = options.animation;

        // Touch devices cannot use squish
        if (Toolkit.isTouch && animation === 'squish') {
            options.animation = animation = 'push';
        }

        // Cannot have multiple non-overlayed or non-squished sidebars open
        if (animation !== 'on-top' && animation !== 'squish') {
            options.hideOthers = true;
        }

        // Setup container
        this.container = element.parent().addClass(animation);
        this.primary = element.siblings('[data-offcanvas-content]').attr('role', 'main');
        this.secondary = element.siblings('[data-offcanvas-sidebar]');

        // Determine the side
        this.side = element.data('offcanvas-sidebar') || 'left';
        this.opposite = (this.side === 'left') ? 'right' : 'left';

        // Initialize events
        this.addEvents([
            ['ready', 'document', 'onReady'],
            ['resize', 'window', 'onResize']
        ]);

        if (options.swipe) {
            if (this.side === 'left') {
                this.addEvents([
                    ['swipeleft', 'element', 'hide'],
                    ['swiperight', 'container', 'onSwipe']
                ]);
            } else {
                this.addEvents([
                    ['swipeleft', 'container', 'onSwipe'],
                    ['swiperight', 'element', 'hide']
                ]);
            }
        }

        if (options.selector) {
            this.addEvent('click', 'document', 'toggle', options.selector);
        }

        this.initialize();
    },

    /**
     * Hide sidebar when destroying.
     */
    destructor: function() {
        this.hide();
    },

    /**
     * Hide the sidebar and reset the container.
     */
    hide: function() {
        this.fireEvent('hiding');

        this.container.removeClass('move-' + this.opposite);

        this.element
            .conceal()
            .removeClass('is-expanded')
            .aria('expanded', false);

        if (this.options.stopScroll) {
            $('body').removeClass('no-scroll');
        }

        this.fireEvent('hidden');
    },

    /**
     * Show the sidebar and squish the container to make room for the sidebar.
     * If hideOthers is true, hide other open sidebars.
     */
    show: function() {
        var options = this.options;

        if (options.hideOthers) {
            this.secondary.each(function() {
                var sidebar = $(this);

                if (sidebar.hasClass('is-expanded')) {
                    sidebar.toolkit('offCanvas', 'hide');
                }
            });
        }

        this.fireEvent('showing');

        this.container.addClass('move-' + this.opposite);

        this.element
            .reveal()
            .addClass('is-expanded')
            .aria('expanded', true);

        if (options.stopScroll) {
            $('body').addClass('no-scroll');
        }

        this.fireEvent('shown');
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

    /**
     * Triggered when the page is resized.
     *
     * @private
     */
    onResize: function() {
        this.fireEvent('resize');
    },

    /**
     * When swiping on the container, don't trigger a show if we are trying to hide a sidebar.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onSwipe: function(e) {
        e.preventDefault();

        var target = $(e.target),
            selector = '[data-offcanvas-sidebar]';

        if (target.is(selector) || target.parents(selector).length) {
            return;
        }

        this.show();
    }

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
