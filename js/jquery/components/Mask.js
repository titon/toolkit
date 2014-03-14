/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Mask = Toolkit.Component.extend(function(element, options) {
        this.component = 'Mask';
        this.version = '1.2.0';
        this.element = element = $(element);
        this.options = this.setOptions(options, element);
        this.mask = null;
        this.message = null;

        // Create the mask and message elements
        var vendor = Toolkit.options.vendor,
            maskClass = vendor + 'mask';

        if (!element.is('body')) {
            element.addClass(vendor + 'maskable');

            if (element.css('position') === 'static') {
                element.css('position', 'relative');
            }
        }

        // Find a mask or create it
        var mask = element.find('> .' + maskClass);

        if (!mask.length) {
            mask = $('<div/>').addClass(maskClass);
        }

        this.setMask(mask);
        this.enable();
        this.fireEvent('init');
    }, {

        /**
         * Hide the mask and reveal the element.
         */
        hide: function() {
            this.mask.conceal();
            this.element.removeClass(Toolkit.options.isPrefix + 'masked');
            this.fireEvent('hide');
        },

        /**
         * Set the element to use as a mask and append it to the target element.
         * Apply optional classes, events, and styles dependent on implementation.
         *
         * @param {jQuery} mask
         */
        setMask: function(mask) {
            var options = this.options;

            mask.addClass('hide').appendTo(this.element);

            if (this.element.is('body')) {
                mask.css('position', 'fixed');
            }

            if (options.revealOnClick) {
                mask.click(this.hide.bind(this));
            }

            this.mask = mask;
            this.message = mask.find('> ' + options.messageElement);

            // Create message if it does not exist
            if (!this.message.length) {
                this.message = $('<div/>')
                    .addClass(options.messageElement.substr(1))
                    .appendTo(mask);

                if (options.messageContent) {
                    this.message.html(options.messageContent);
                }
            }
        },

        /**
         * Show the mask and conceal the element.
         *
         * @param {Element} [node]
         */
        show: function(node) {
            this.node = node;
            this.mask.reveal();
            this.element.addClass(Toolkit.options.isPrefix + 'masked');
            this.fireEvent('show');
        },

        /**
         * Toggle between display states,
         */
        toggle: function() {
            if (this.mask.is(':shown')) {
                this.hide();
            } else {
                this.show();
            }
        }

    }, {
        revealOnClick: false,
        messageContent: '',
        messageElement: '.mask-message'
    });

    /**
     * Defines a component that can be instantiated through mask().
     */
    Toolkit.createComponent('mask', function(options) {
        return new Toolkit.Mask(this, options);
    });

})(jQuery);