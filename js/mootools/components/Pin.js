/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

Toolkit.Pin = new Class({
    Extends: Toolkit.Component,
    Binds: ['onResize', 'onScroll'],

    /** The current window width and height */
    viewport: null,

    /** Target and container sizes */
    elementSize: null,
    parentSize: null,

    /** Default values */
    elementTop: null,

    /** Is the pin active? */
    active: true,

    /** Default options */
    options: {
        location: 'right',
        xOffset: 0,
        yOffset: 0,
        throttle: 50,
        fixed: false,
        calculate: false,
        lock: true
    },

    /**
     * Initialize the component by fetching elements and binding events.
     *
     * @param {Element} element
     * @param {Object} [options]
     */
    initialize: function(element, options) {
        this.parent(options);
        this.element = element;
        this.options = this.inheritOptions(this.options, element);

        // Set defaults
        element
            .set('role', 'complementary')
            .addClass(Toolkit.vendor + 'pin')
            .addClass(options.animation);

        this.elementTop = element.getStyle('top').toInt();

        // Initialize events
        var events,
            throttle = this.options.throttle;

        this.events = events = {
            'ready document': 'onResize'
        };

        events['scroll:throttle(' + throttle + ') window'] = 'onScroll';
        events['resize:throttle(' + throttle + ') window'] = 'onResize';

        this.enable();
        this.fireEvent('init');
    },

    /**
     * Calculate the dimensions and offsets of the interacting elements.
     *
     * @returns {Toolkit.Pin}
     */
    calculate: function() {
        var options = this.options;

        this.viewport = window.getSize();
        this.elementSize = this.element.getCoordinates();
        this.parentSize = this.element.getParent(options.context).getCoordinates();

        // Disable pin if element is larger than the viewport
        if (options.lock && this.elementSize.height >= this.viewport.y) {
            this.active = false;

        // Enable pin if the parent is larger than the child
        } else {
            this.active = (this.element.isVisible() && this.parentSize.height > this.elementSize.height);
        }

        return this;
    },

    /**
     * Pin the element along the vertical axis while staying contained within the parent.
     */
    pin: function() {
        if (this.options.calculate) {
            this.calculate();
        }

        if (!this.active) {
            return;
        }

        var options = this.options,
            isFixed = options.fixed,
            eSize = this.elementSize,
            eTop = this.elementTop,
            pSize = this.parentSize,
            wScroll = window.getScroll(),
            pos = {},
            x = options.xOffset,
            y = 0;

        // Scroll is above the parent, remove pin inline styles
        if (wScroll.y < pSize.top) {
            this.element
                .removeProperty('style')
                .removeClass('is-pinned');

            return;
        }

        // Don't extend out the bottom
        var elementMaxPos = wScroll.y + eSize.height,
            parentMaxHeight = pSize.height + pSize.top;

        // Swap positioning of the fixed menu once it reaches the parent borders
        if (isFixed) {
            if (elementMaxPos >= parentMaxHeight) {
                y = 'auto';

                pos.position = 'absolute';
                pos.bottom = 0;
            } else {
                pos.position = 'fixed';
                pos.bottom = 'auto';
            }

        // Stop positioning absolute menu once it exits the parent
        } else {
            pos.position = 'absolute';

            if (elementMaxPos >= parentMaxHeight) {
                y += (pSize.height - eSize.height);

            } else {
                y += (wScroll.y - pSize.top) + options.yOffset;
            }

            // Don't go lower than default top
            if (eTop && y < eTop) {
                y = eTop;
            }
        }

        pos[options.location] = x;
        pos.top = y;

        this.element
            .setStyles(pos)
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

});

/**
 * Defines a component that can be instantiated through pin().
 */
Toolkit.create('pin', function(options) {
    return new Toolkit.Pin(this, options);
});