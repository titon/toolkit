/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Pin = Toolkit.Component.extend(function(element, options) {
        this.component = 'Pin';
        this.version = '1.0.0';
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
            .addClass(Toolkit.options.vendor + 'pin')
            .addClass(options.animation);

        // Initialize events
        var throttle = options.throttle;

        this.events = {
            'scroll window': throttle ? $.throttle(this.onScroll.bind(this), throttle) : 'onScroll',
            'resize window': throttle ? $.throttle(this.onResize.bind(this), throttle) : 'onResize',
            'ready document': 'calculate'
        };

        this.enable();
        this.fireEvent('init');
    }, {

        /**
         * Calculate the dimensions and offsets of the interacting elements.
         */
        calculate: function() {
            var win = $(window),
                parent = this.options.context ? this.element.parents(this.options.context) : this.element.parent();

            this.viewport = {
                width: win.width(),
                height: win.height()
            };

            this.elementHeight = this.element.outerHeight();
            this.parentHeight = parent.outerHeight();
            this.parentTop = parent.offset().top;

            // Enable pin if the parent is larger than the child
            this.active = (this.parentHeight > this.elementHeight);
        },

        /**
         * Determine whether to pin or unpin.
         *
         * @private
         */
        onResize: function() {
            this.calculate();
            this.fireEvent('resize');
        },

        /**
         * While the viewport is being scrolled, the element should move vertically along with it.
         * The element should also stay contained within the parent element.
         *
         * @private
         */
        onScroll: function() {
            if (this.options.calculate) {
                this.calculate();
            }

            if (!this.active || this.element.is(':hidden')) {
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
                y = 0,
                isPrefix = Toolkit.options.isPrefix;

            // Scroll is above the parent, remove pin inline styles
            if (scrollTop < pTop) {
                this.element
                    .removeAttr('style')
                    .removeClass(isPrefix + 'pinned');

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
                .addClass(isPrefix + 'pinned');

            this.fireEvent('scroll');
        }

    }, {
        location: 'right',
        xOffset: 0,
        yOffset: 0,
        throttle: 50,
        fixed: false,
        calculate: false
    });

    /**
     * Defines a component that can be instantiated through pin().
     */
    Toolkit.createComponent('pin', function(options) {
        return new Toolkit.Pin(this, options);
    });

})(jQuery);