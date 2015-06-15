/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../toolkit',
    './component',
    '../extensions/shown-selector'
], function($, Toolkit, Component) {

var Mask = Toolkit.Mask = Component.extend({
    name: 'Mask',
    version: '2.0.0',

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
        element = this.setElement(element);
        options = this.setOptions(options, element);

        // Add class and set relative positioning
        if (!element.is('body')) {
            element.addClass('is-maskable');

            var position = element.css('position');

            if (!position || position === 'static') {
                element.css('position', 'relative');
            }
        }

        // Find a mask or create it
        var mask = element.find('> ' + this.ns());

        if (!mask.length) {
            mask = this.render(options.template);
        }

        this.setMask(mask);

        if (options.selector) {
            this.addEvent('click', 'document', 'toggle', options.selector);
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
            mask.click(this.hide.bind(this));
        }

        this.mask = mask;

        // Create message if it does not exist
        message = mask.find(this.ns('message'));

        if (!message.length && options.messageContent) {
            message = this.render(options.messageTemplate)
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
    template: function(bem) {
        return '<div class="' + bem('mask') + '" data-mask></div>';
    },
    messageTemplate: function(bem) {
        return '<div class="' + bem('mask', 'message') + '" data-mask-message></div>';
    }
});

Toolkit.createPlugin('mask', function(options) {
    return new Mask(this, options);
});

return Mask;
});
