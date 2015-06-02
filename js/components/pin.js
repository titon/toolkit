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
], function($, Toolkit) {

Toolkit.Pin = Toolkit.Component.extend({
    name: 'Pin',
    version: '2.0.0',

    /** Will the element be pinned? */
    active: true,

    /** Outer height of the element. */
    elementHeight: null,

    /** The initial top value to reset to. */
    elementTop: 0,

    /** Inner height of the parent element. */
    parentHeight: null,

    /** The top value of the parent to compare against. */
    parentTop: null,

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

        this.elementTop = parseInt(element.css('top'), 10);

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
        setTimeout(function() {
            this.element
                .removeAttr('style')
                .removeClass('is-pinned');
        }.bind(this), 15);
    },

    /**
     * Calculate the dimensions and offsets of the interacting elements.
     */
    calculate: function() {
        var win = $(window),
            options = this.options,
            parent = options.context ? this.element.parents(options.context) : this.element.parent();

        this.viewport = {
            width: win.width(),
            height: win.height()
        };

        this.elementHeight = this.element.outerHeight(true); // Include margin
        this.parentHeight = parent.height(); // Exclude padding
        this.parentTop = parent.offset().top;

        // Disable pin if element is larger than the viewport
        if (options.lock && this.elementHeight >= this.viewport.height) {
            this.active = false;

        // Enable pin if the parent is larger than the child
        } else {
            this.active = (this.element.is(':visible') && this.parentHeight > this.elementHeight);
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
            scrollTop = $(window).scrollTop(),
            pos = {},
            x = options.xOffset,
            y = 0;

        // Scroll is above the parent, remove pin inline styles
        if (scrollTop < pTop) {
            this.element
                .removeAttr('style')
                .removeClass('is-pinned');

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

            } else {
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
            if (eTop && y < eTop) {
                y = eTop;
            }
        }

        pos[options.location] = x;
        pos.top = y;

        this.element
            .css(pos)
            .addClass('is-pinned');
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
    return new Toolkit.Pin(this, options);
});

return Toolkit.Pin;
});
