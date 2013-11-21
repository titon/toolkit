/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Titon.Pin = Titon.Component.create(function(element, options) {

    /** Custom options */
    this.options = this.setOptions($.fn.pin.options, options);

    /** Element to pin */
    this.element = this.setElement(element, this.options);

    /** The current window width and height */
    this.viewport = null;

    /** Target and container sizes */
    this.elementHeight = null;
    this.elementTop = null;

    this.parentHeight = null;
    this.parentTop = null;

    /** Is the component enabled? */
    this.enabled = true;

    /**
     * Initialize the component by fetching elements and binding events.
     */
    this.initialize = function() {
        this.element.addClass('pin');
        this.elementTop = parseInt(this.element.css('top'), 10);

        $(window).on('scroll', $.throttle(this.__scroll.bind(this), this.options.throttle));
        $(window).on('resize', $.throttle(this.__resize.bind(this), this.options.throttle));
        $(document).ready(this.__resize.bind(this));

        this.fireEvent('init');
    };

    /**
     * Calculate the dimensions and offsets of the interacting elements.
     *
     * @returns {Titon.Pin}
     */
    this.calculate = function() {
        var win = $(window),
            parent = this.element.parents(this.options.context);

        this.viewport = {
            width: win.width(),
            height: win.height()
        };

        this.elementHeight = this.element.outerHeight();
        this.parentHeight = parent.outerHeight();
        this.parentTop = parent.offset().top;

        return this;
    };

    /**
     * Determine whether to pin or unpin.
     *
     * @private
     */
    this.__resize = function() {
        this.calculate();

        // Enable pin if the parent is larger than the child
        if (this.parentHeight >= this.elementHeight) {
            this.enable();
        } else {
            this.disable();
        }

        this.fireEvent('resize');
    };

    /**
     * While the viewport is being scrolled, the element should move vertically along with it.
     * The element should also stay contained within the parent element.
     *
     * @private
     */
    this.__scroll = function() {
        if (this.options.calculate) {
            this.calculate();
        }

        if (!this.enabled || this.element.is(':hidden')) {
            return;
        }

        var options = this.options,
            isFixed = options.fixed,
            eHeight = this.elementHeight,
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
                .addClass('is-pinned');

            return;
        }

        // Don't extend out the bottom
        var elementMaxPos = scrollTop + eHeight,
            parentMaxHeight = pHeight + pTop;

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

        this.fireEvent('scroll');
    };

    if (this.element.length) {
        this.initialize();
    }
});

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
 * @returns {jQuery}
 */
$.fn.pin = function(options) {
    return this.each(function() {
        if (!this.$pin) {
            this.$pin = new Titon.Pin(this, options);
        }
    });
};

$.fn.pin.options = {
    animation: '',
    location: 'right',
    xOffset: 0,
    yOffset: 0,
    throttle: 50,
    fixed: false,
    calculate: false,
    context: null
};

})(jQuery);