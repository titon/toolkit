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

var Pin = Toolkit.Pin = Component.extend({
    name: 'Pin',
    version: '2.1.7',

    /** Will the element be pinned? */
    active: true,

    /** Outer height of the element. */
    elementHeight: null,

    /** The top offset value in the DOM. */
    elementTop: 0,

    /** Inner height of the parent element. */
    parentHeight: null,

    /** The top offset value of the parent in the DOM. */
    parentTop: null,

    /** Whether the element is currently pinned or not. */
    pinned: false,

    /** The element top value defined in the CSS. */
    initialTop: 0,

    /** The width and height of the viewport. Will update on resize. */
    viewport: {},

    /**
     * Initialize the pin.
     *
     * @param {jQuery} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {
        element = this.setElement(element);
        options = this.setOptions(options, element);

        // Setup classes and ARIA
        element
            .attr('role', 'complementary')
            .addClass(options.animation);

        // Determine before calculations
        var initialTop = element[0].style.top; // jQuery sometimes returns auto

        this.initialTop = (initialTop === 'auto') ? 0 : parseInt(initialTop, 10);
        this.elementTop = element.offset().top;

        // Initialize events
        var throttle = options.throttle;

        this.addEvents([
            ['scroll', 'window', $.throttle(this.onScroll.bind(this), throttle)],
            ['resize', 'window', $.throttle(this.onResize.bind(this), throttle)],
            ['ready', 'document', 'onResize']
        ]);

        this.initialize();
    },

    /**
     * Remove inline styles before destroying.
     */
    destructor: function() {
        this.active = false;

        // Need to be in a timeout or they won't be removed
        setTimeout(this.unpin.bind(this), 15);
    },

    /**
     * Calculate the dimensions and offsets of the interacting elements.
     */
    calculate: function() {
        var win = $(window),
            options = this.options,
            element = this.element,
            parent = options.context ? element.parents(options.context) : element.parent();

        this.viewport = {
            width: win.width(),
            height: win.height()
        };

        this.elementHeight = element.outerHeight(true); // Include margin
        this.parentHeight = parent.height(); // Exclude padding
        this.parentTop = parent.offset().top;

        // Disable pin if element is larger than the viewport
        if (options.lock && this.elementHeight >= this.viewport.height) {
            this.active = false;

        // Enable pin if the parent is larger than the child
        } else {
            this.active = (element.is(':visible') && this.parentHeight > this.elementHeight);
        }
    },

    /**
     * Pin the element along the vertical axis while staying contained within the parent.
     */
    pin: function() {
        var options = this.options;

        if (options.calculate) {
            this.calculate();
        }

        if (!this.active) {
            return;
        }

        var eHeight = this.elementHeight,
            eTop = this.elementTop,
            pHeight = this.parentHeight,
            pTop = this.parentTop,
            cssTop = this.initialTop,
            scrollTop = $(window).scrollTop(),
            pos = {},
            x = options.xOffset,
            y = 0;

        // Scroll is above the parent, remove pin inline styles
        if (scrollTop < pTop || scrollTop === 0) {
            if (this.pinned) {
                this.unpin();
            }

            return;
        }

        // Don't extend out the bottom
        var elementMaxPos = scrollTop + eHeight,
            parentMaxHeight = pHeight + pTop;

        // Swap positioning of the fixed menu once it reaches the parent borders
        if (options.fixed) {
            if (elementMaxPos >= parentMaxHeight) {
                y = 'auto';

                pos.position = 'absolute';
                pos.bottom = 0;

            } else if (scrollTop >= eTop) {
                y = options.yOffset;

                pos.position = 'fixed';
                pos.bottom = 'auto';
            }

        // Stop positioning absolute menu once it exits the parent
        } else {
            pos.position = 'absolute';

            if (elementMaxPos >= parentMaxHeight) {
                y += (pHeight - eHeight);

            } else {
                y += (scrollTop - pTop) + options.yOffset;
            }

            // Don't go lower than default top
            if (cssTop && y < cssTop) {
                y = cssTop;
            }
        }

        pos[options.location] = x;
        pos.top = y;

        this.element
            .css(pos)
            .addClass('is-pinned');

        this.pinned = true;

        this.fireEvent('pinned');
    },

    /**
     * Reset the element to its original state.
     */
    unpin: function() {
        this.element
            .removeAttr('style')
            .removeClass('is-pinned');

        this.pinned = false;

        this.fireEvent('unpinned');
    },

    /**
     * Determine whether to pin or unpin.
     *
     * @private
     */
    onResize: function() {
        this.calculate();
        this.pin();
        this.fireEvent('resize');
    },

    /**
     * While the viewport is being scrolled, the element should move vertically along with it.
     * The element should also stay contained within the parent element.
     *
     * @private
     */
    onScroll: function() {
        this.pin();
        this.fireEvent('scroll');
    }

}, {
    location: 'right',
    xOffset: 0,
    yOffset: 0,
    throttle: 50,
    fixed: false,
    calculate: false,
    lock: true
});

Toolkit.createPlugin('pin', function(options) {
    return new Pin(this, options);
});

return Pin;
});
