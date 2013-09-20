/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Titon.Pin = function(element, options) {

    /** Custom options */
    this.options = Titon.setOptions($.fn.pin.options, options);

    /** Element to pin */
    this.element = Titon.setElement(element, this.options);

    /** The current window width and height */
    this.viewport = null;

    /** Target and container sizes */
    this.elementHeight = null;
    this.parentHeight = null;
    this.parentTop = null;

    /** Is the component enabled? */
    this.enabled = true;

    /**
     * Initialize events.
     */
    this.initialize = function() {
        $(window).on('scroll', this.__scroll.bind(this));
        $(window).on('resize', this.__resize.bind(this));
        $(document).ready(this.__resize.bind(this));
    };

    /**
     * Disable component.
     *
     * @returns {Titon.Pin}
     */
    this.disable = function() {
        this.enabled = false;

        return this;
    };

    /**
     * Enable component.
     *
     * @returns {Titon.Pin}
     */
    this.enable = function() {
        this.enabled = true;

        return this;
    };

    /**
     * Calculate the dimensions and offsets of the interacting elements.
     * Determine whether to pin or unpin.
     *
     * @private
     * @param {Event} e
     */
    this.__resize = function(e) {
        var win = $(window);

        this.viewport = {
            width: win.width(),
            height: win.height()
        };

        this.elementHeight = this.element.outerHeight();
        this.parentHeight = this.element.parent().outerHeight();
        this.parentTop = this.element.parent().offset().top;

        // Enable pin if the parent is larger than the child
        if (this.parentHeight >= (this.elementHeight * 2)) {
            this.enable();
        } else {
            this.disable();
        }
    };

    /**
     * While the viewport is being scrolled, the element should move vertically along with it.
     * The element should also stay contained within the parent element.
     *
     * @private
     * @param {Event} e
     */
    this.__scroll = function(e) {
        if (!this.enabled) {
            return;
        }

        var options = this.options,
            eHeight = this.elementHeight,
            pHeight = this.parentHeight,
            pTop = this.parentTop,
            scrollTop = $(window).scrollTop(),
            pos = {},
            x = 0,
            y = 0;

        // Scroll reaches the top or bottom of the parent
        if (scrollTop > pTop) {
            x = options.xOffset;
            y = options.yOffset;

            var elementMaxPos = scrollTop + eHeight,
                parentMaxHeight = pHeight + pTop;

            if (elementMaxPos >= parentMaxHeight) {
                y += (pHeight - eHeight);
            } else {
                y += (scrollTop - pTop);
            }
        }

        // Position the element
        pos.position = 'absolute';
        pos[options.location] = x;
        pos.top = y;

        this.element.css(pos);
    };

    // Initialize the class only if the element exists
    if (this.element.length) {
        this.initialize();
    }
};

/**
 * Enable Element pinning by calling pin().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $('#pin-id').pin({
 *         throttle: 100
 *     });
 *
 * @param {Object} [options]
 * @returns {Titon.Pin}
 */
$.fn.pin = function(options) {
    return this.each(function() {
        if (this.$pin) {
            return this.$pin;
        }

        this.$pin = new Titon.Pin(this, options);

        return this.$pin;
    });
};

$.fn.pin.options = {
    className: '',
    animation: 'pin',
    location: 'right',
    xOffset: 0,
    yOffset: 0,
    throttle: 50,
    template: false
};

})(jQuery);