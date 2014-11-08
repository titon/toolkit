define([
    'jquery',
    './component',
    '../flags/vendor',
    '../extensions/shown-selector'
], function($, Toolkit, vendor) {

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
            element.addClass('is-maskable');

            var position = element.css('position');

            if (!position || position === 'static') {
                element.css('position', 'relative');
            }
        }

        // Find a mask or create it
        var mask = element.find('> [data-mask]');

        if (!mask.length) {
            mask = $(options.template);
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
            .removeClass('is-maskable')
            .removeClass('is-masked')
            .css('position', '');
    },

    /**
     * Hide the mask and reveal the element.
     */
    hide: function() {
        this.fireEvent('hiding');

        this.mask.conceal();
        this.element.removeClass('is-masked');

        this.fireEvent('hidden');
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
        message = mask.find('[data-mask-message]');

        if (!message.length && options.messageContent) {
            message = $(options.messageTemplate)
                .html(options.messageContent)
                .appendTo(mask);
        }

        this.message = message;
    },

    /**
     * Show the mask and conceal the element.
     */
    show: function() {
        this.fireEvent('showing');

        this.mask.reveal();
        this.element.addClass('is-masked');

        this.fireEvent('shown');
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
    messageContent: '',
    template: '<div class="' + vendor + 'mask" data-mask></div>',
    messageTemplate: '<div class="' + vendor + 'mask-message" data-mask-message></div>'
});

Toolkit.create('mask', function(options) {
    return new Toolkit.Mask(this, options);
});

return Toolkit;
});