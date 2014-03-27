/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

Toolkit.Pin = Toolkit.Component.extend(function(element, options) {
    this.component = 'Pin';
    this.version = '1.3.0';
    this.element = element = $(element);
    this.options = options = this.setOptions(options, element);
    this.elementHeight = null;
    this.elementTop = parseInt(element.css('top'), 10);
    this.parentHeight = null;
    this.parentTop = null;
    this.viewport = null;
    this.active = true;

    // Mark element as a pin
    element
        .attr('role', 'complementary')
        .addClass(Toolkit.vendor + 'pin')
        .addClass(options.animation);

    // Initialize events
    var throttle = options.throttle;

    this.events = {
        'scroll window': $.throttle(this.onScroll.bind(this), throttle),
        'resize window': $.throttle(this.onResize.bind(this), throttle),
        'ready document': 'onResize'
    };

    this.enable();
    this.fireEvent('init');
}, {

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

        this.elementHeight = this.element.outerHeight(true); // include margin
        this.parentHeight = parent.height(); // exclude padding
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

        var isFixed = options.fixed,
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
                .removeClass('is-pinned');

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

/**
 * Defines a component that can be instantiated through pin().
 */
Toolkit.create('pin', function(options) {
    return new Toolkit.Pin(this, options);
});