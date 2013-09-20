/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Titon.Pin = new Class({
    Extends: Titon.Component,
    Binds: ['_resize', '_scroll'],

    /** The current window width and height */
    viewport: null,

    /** Target and container sizes */
    elementSize: null,
    parentSize: null,

    /**
     * Default options.
     *
     *    animate     - (bool) Enable animation while scrolling
     *    position    - (string) What type of positioning to use: absolute, static, fixed
     *    location    - (string) Whether the pin should be located on the left or right of the parent
     *    xOffset     - (int) Additional margin on the X axis
     *    yOffset     - (int) Additional margin on the Y axis
     *    throttle    - (int) The amount in milliseconds to update pin location
     *    onScroll    - (function) Callback triggered when page is scrolled
     *    onResize    - (function) Callback triggered when page is resized
     */
    options: {
        animation: 'pin',
        location: 'right',
        xOffset: 0,
        yOffset: 0,
        throttle: 50,
        template: false,

        // Events
        onScroll: null,
        onResize: null
    },

    /**
     * Pin the element and enable events.
     *
     * @param {Element} element
     * @param {Object} [options]
     */
    initialize: function(element, options) {
        this.parent(options);
        this.setElement(element);

        if (!this.element) {
            return;
        }

        window.addEvent('resize:throttle(' + this.options.throttle + ')', this._resize);
        window.addEvent('domready', this._resize);

        this.fireEvent('init');
    },

    /**
     * Calculate the dimensions and offsets of the interacting elements.
     * Determine whether to pin or unpin.
     *
     * @private
     * @returns {Titon.Pin}
     */
    _resize: function() {
        this.viewport = window.getSize();
        this.elementSize = this.element.getCoordinates();
        this.parentSize = this.element.getParent().getCoordinates();

        // Enable pin if the parent is larger than the child
        if (this.parentSize.height >= (this.elementSize.height * 2)) {
            this.enable();
        } else {
            this.disable();
        }

        this.fireEvent('resize');

        return this;
    },

    /**
     * While the viewport is being scrolled, the element should move vertically along with it.
     * The element should also stay contained within the parent element.
     *
     * @private
     * @returns {Titon.Pin}
     */
    _scroll: function() {
        var options = this.options,
            eSize = this.elementSize,
            pSize = this.parentSize,
            wScroll = window.getScroll(),
            pos = {},
            x = 0,
            y = 0;

        // Scroll reaches the top or bottom of the parent
        if (wScroll.y > pSize.top) {
            x = options.xOffset;
            y = options.yOffset;

            var elementMaxPos = wScroll.y + eSize.height,
                parentMaxHeight = pSize.height + pSize.top;

            if (elementMaxPos >= parentMaxHeight) {
                y += (pSize.height - eSize.height);
            } else {
                y += (wScroll.y - pSize.top);
            }
        }

        // Position the element
        pos.position = 'absolute';
        pos[options.location] = x;
        pos.top = y;

        this.element.setStyles(pos);

        this.fireEvent('scroll');

        return this;
    },

    /**
     * Toggle activation events on and off.
     *
     * @private
     * @param {bool} on
     * @returns {Titon.Pin}
     */
    _toggleEvents: function(on) {
        if (!this.element) {
            return this;
        }

        if (on) {
            window.addEvent('scroll:throttle(' + this.options.throttle + ')', this._scroll);
        } else {
            window.removeEvent('scroll:throttle(' + this.options.throttle + ')', this._scroll);
        }

        return this;
    }.protect()

});

/**
 * Enable Element pinning by calling pin().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $('pin-id').pin({
 *         animate: true
 *     });
 *
 * @param {Object} [options]
 * @returns {Titon.Pin}
 */
Element.implement('pin', function(options) {
    if (this.$pin) {
        return this.$pin;
    }

    this.$pin = new Titon.Pin(this, options);

    return this.$pin;
});

})();