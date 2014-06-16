define([
    './component',
    '../extensions/shown-selector'
], function(Toolkit) {

Toolkit.Mask = Toolkit.Component.extend({
    name: 'Mask',
    version: '1.4.0',

    /** Mask element used for overlaying. */
    mask: null,

    /** Message element found within the mask. */
    message: null,

    /**
     * Initialize the mask.
     *
     * @param {jQuery} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {
        this.element = element = $(element);
        this.options = options = this.setOptions(options, element);

        // Add class and set relative positioning
        if (!element.is('body')) {
            element.addClass(Toolkit.vendor + 'mask-target');

            if (element.css('position') === 'static') {
                element.css('position', 'relative');
            }
        }

        // Find a mask or create it
        var maskClass = Toolkit.vendor + 'mask',
            mask = element.find('> .' + maskClass);

        if (!mask.length) {
            mask = $('<div/>').addClass(maskClass);
        }

        this.setMask(mask);

        if (options.selector) {
            this.events['click document ' + options.selector] = 'toggle';
        }

        this.initialize();
    },

    /**
     * Remove the mask element before destroying.
     */
    destructor: function() {
        this.mask.remove();
        this.element
            .removeClass(Toolkit.vendor + 'mask-target')
            .removeClass('is-masked')
            .css('position', '');
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
            mask.click(this.hide.bind(this));
        }

        this.mask = mask;

        // Create message if it does not exist
        message = mask.find('> .' + Toolkit.vendor + 'mask-message');

        if (!message.length) {
            message = $('<div/>')
                .addClass(Toolkit.vendor + 'mask-message')
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
    selector: '',
    revealOnClick: false,
    messageContent: ''
});

Toolkit.create('mask', function(options) {
    return new Toolkit.Mask(this, options);
});

return Toolkit;
});