/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

Toolkit.Mask = Toolkit.Component.extend(function(element, options) {
    this.component = 'Mask';
    this.version = '1.4.0';
    this.element = element = $(element);
    this.options = this.setOptions(options, element);

    // The mask element to overlay the target element
    this.mask = null;

    // The message element within the mask
    this.message = null;

    // Create the mask and message elements
    var maskClass = vendor + 'mask';

    // Add class and set relative positioning
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

    this.initialize();
}, {

    /**
     * Remove the mask element before destroying.
     */
    doDestroy: function() {
        this.mask.remove();
    },

    /**
     * Hide the mask and reveal the element.
     */
    hide: function() {
        this.mask.conceal();
        this.element.removeClass('is-masked');
        this.fireEvent('hide');
    },

    /**
     * Set the element to use as a mask and append it to the target element.
     * Apply optional classes, events, and styles dependent on implementation.
     *
     * @param {jQuery} mask
     */
    setMask: function(mask) {
        var options = this.options,
            message;

        // Prepare mask
        mask.addClass('hide').appendTo(this.element);

        if (this.element.is('body')) {
            mask.css('position', 'fixed');
        }

        if (options.revealOnClick) {
            mask.click(this.hide);
        }

        this.mask = mask;

        // Create message if it does not exist
        message = mask.find('> .' + vendor + 'mask-message');

        if (!message.length) {
            message = $('<div/>')
                .addClass(vendor + 'mask-message')
                .appendTo(mask);

            if (options.messageContent) {
                message.html(options.messageContent);
            }
        }

        this.message = message;
    },

    /**
     * Show the mask and conceal the element.
     */
    show: function() {
        this.mask.reveal();
        this.element.addClass('is-masked');
        this.fireEvent('show');
    },

    /**
     * Toggle between display states.
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
    messageContent: ''
});

/**
 * Defines a component that can be instantiated through mask().
 */
Toolkit.create('mask', function(options) {
    return new Toolkit.Mask(this, options);
});