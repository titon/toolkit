/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Mask = Toolkit.Component.create(function(element, options) {
        this.component = 'Mask';
        this.version = '0.0.0';

        /** Custom options */
        this.options = this.setOptions(Toolkit.Mask.options, options);

        /** Matrix wrapper */
        this.element = this.setElement(element, this.options);

        /** The transparent mask that covers the element */
        this.mask = null;

        /** Element that displays a message within the mask */
        this.message = null;

        this.initialize();
    });

    Toolkit.Mask.options = {
        revealOnClick: false,
        messageContent: '',
        messageElement: '.mask-message'
    };

    var Mask = Toolkit.Mask.prototype;

    /**
     * Initialize on the element and create the mask element.
     */
    Mask.initialize = function() {
        var element = this.element,
            vendor = Toolkit.options.vendor,
            maskClass = vendor + 'mask';

        // Only apply to static elements
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

        this.fireEvent('init');
    };

    /**
     * Hide the mask and reveal the element.
     *
     * @returns {Toolkit.Mask}
     */
    Mask.hide = function() {
        this.mask.conceal();
        this.element.removeClass(Toolkit.options.isPrefix + 'masked');
        this.fireEvent('hide');

        return this;
    };

    /**
     * Set the element to use as a mask and append it to the target element.
     * Apply optional classes, events, and styles dependent on implementation.
     *
     * @param {jQuery} element
     * @returns {Toolkit.Mask}
     */
    Mask.setMask = function(element) {
        var options = this.options;

        element.addClass('hide').appendTo(this.element);

        if (this.element.is('body')) {
            element.css('position', 'fixed')
        }

        if (options.revealOnClick) {
            element.click(this.hide.bind(this));
        }

        this.mask = element;
        this.message = element.find('> ' + options.messageElement);

        // Create message if it does not exist
        if (!this.message.length) {
            this.message = $('<div/>')
                .addClass(options.messageElement.substr(1))
                .appendTo(element);

            if (options.messageContent) {
                this.message.html(options.messageContent);
            }
        }

        return this;
    };

    /**
     * Show the mask and conceal the element.
     *
     * @param {Element} [node]
     * @returns {Toolkit.Mask}
     */
    Mask.show = function(node) {
        if (!this.enabled) {
            return this;
        }

        this.node = node;
        this.mask.reveal();
        this.element.addClass(Toolkit.options.isPrefix + 'masked');
        this.fireEvent('show');

        return this;
    };

    /**
     * Toggle between display states,
     *
     * @returns {Toolkit.Mask}
     */
    Mask.toggle = function() {
        return this.mask.is(':shown') ? this.hide() : this.show();
    };

    /**
     * Enable Element masking by calling mask() on a target element.
     * An object of options can be passed as the 1st argument.
     *
     * @example
     *     $('#target-element').mask();
     *
     * @param {Object} [options]
     * @returns {jQuery}
     */
    $.fn.mask = function(options) {
        return this.each(function() {
            $(this).addData('toolkit.mask', function() {
                return new Toolkit.Mask(this, options);
            });
        });
    };

})(jQuery);