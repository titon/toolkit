/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

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
        this.element = element;
        this.options = this.inheritOptions(this.options, element);

        var vendor = Toolkit.vendor,
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

        this.enable();
        this.fireEvent('init');
    },

    /**
     * Hide the mask and reveal the element.
     *
     * @returns {Toolkit.Mask}
     */
    hide: function() {
        this.mask.conceal();
        this.element.removeClass('is-masked');
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
            element.addEvent('click', this.onHide);
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
        this.node = node;
        this.mask.reveal();
        this.element.addClass('is-masked');
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
 * Defines a component that can be instantiated through mask().
 */
Toolkit.create('mask', function(options) {
    return new Toolkit.Mask(this, options);
});