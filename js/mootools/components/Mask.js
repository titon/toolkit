/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Toolkit.Mask = new Class({
    Extends: Toolkit.Component,

    /** The transparent mask that covers the element */
    mask: null,

    /** Element that displays a message within the mask */
    message: null,

    /** Default options */
    options: {
        revealOnClick: false,
        messageContent: '',
        messageElement: '.mask-message'
    },

    /**
     * Initialize on the element and create the mask element.
     *
     * @param {Element} element
     * @param {Object} [options]
     */
    initialize: function(element, options) {
        this.parent(options);
        this.setElement(element);

        var vendor = Toolkit.options.vendor,
            maskClass = '.' + vendor + 'mask';

        // Only apply to static elements
        if (element !== document.body) {
            element.addClass(vendor + 'maskable');

            if (element.getStyle('position') === 'static') {
                element.setStyle('position', 'relative');
            }
        }

        // Find a mask or create it
        this.setMask(element.getElement('> ' + maskClass) || new Element('div' + maskClass));

        this.fireEvent('init');
    },

    /**
     * Hide the mask and reveal the element.
     *
     * @returns {Toolkit.Mask}
     */
    hide: function() {
        this.mask.conceal();
        this.element.removeClass(Toolkit.options.isPrefix + 'masked');
        this.fireEvent('hide');

        return this;
    },

    /**
     * Set the element to use as a mask and append it to the target element.
     * Apply optional classes, events, and styles dependent on implementation.
     *
     * @param {Element} element
     * @returns {Toolkit.Mask}
     */
    setMask: function(element) {
        var options = this.options;

        element.addClass('hide').inject(this.element, 'bottom');

        if (this.element === document.body) {
            element.setStyle('position', 'fixed');
        }

        if (options.revealOnClick) {
            element.addEvent('click', this.__hide);
        }

        this.mask = element;
        this.message = element.getElement('> ' + options.messageElement);

        // Create message if it does not exist
        if (!this.message) {
            this.message = new Element('div' + options.messageElement).inject(element, 'bottom');

            if (options.messageContent) {
                this.message.set('html', options.messageContent);
            }
        }

        return this;
    },

    /**
     * Show the mask and conceal the element.
     *
     * @param {Element} [node]
     * @returns {Toolkit.Mask}
     */
    show: function(node) {
        if (!this.enabled) {
            return this;
        }

        this.node = node;
        this.mask.reveal();
        this.element.addClass(Toolkit.options.isPrefix + 'masked');
        this.fireEvent('show');

        return this;
    },

    /**
     * Toggle between display states,
     *
     * @returns {Toolkit.Mask}
     */
    toggle: function() {
        return this.mask.isShown() ? this.hide() : this.show();
    }

});

/**
 * Enable Element masking by calling mask() on a target element.
 * An object of options can be passed as the 1st argument.
 *
 * @example
 *     $('target-element').mask();
 *
 * @param {Object} [options]
 * @returns {Element}
 */
Element.implement('mask', function(options) {
    if (!this.$mask) {
        this.$mask = new Toolkit.Mask(this, options);
    }

    return this;
});

})();