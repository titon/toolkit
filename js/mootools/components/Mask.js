/**
 * @copyright   2010-2014, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
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
        selector: '',
        revealOnClick: false,
        messageContent: ''
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
        this.options = options = this.inheritOptions(this.options, element);

        var maskClass = '.' + vendor + 'mask';

        // Only apply to static elements
        if (element !== document.body) {
            element.addClass(vendor + 'mask-target');

            if (element.getStyle('position') === 'static') {
                element.setStyle('position', 'relative');
            }
        }

        // Find a mask or create it
        this.setMask(element.getElement('> ' + maskClass) || new Element('div' + maskClass));

        if (options.selector) {
            this.events = {};
            this.events['click document ' + options.selector] = 'toggle';
        }

        this.enable();
        this.fireEvent('init');
    },

    /**
     * Remove the mask element before destroying.
     */
    doDestroy: function() {
        this.mask.dispose();
        this.element
            .removeClass(vendor + 'mask-target')
            .removeClass('is-masked')
            .setStyle('position', '');
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
        this.message = element.getElement('> .' + vendor + 'mask-message');

        // Create message if it does not exist
        if (!this.message) {
            this.message = new Element('div.' + vendor + 'mask-message').inject(element, 'bottom');

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
     * Toggle between display states.
     *
     * @returns {Toolkit.Mask}
     */
    toggle: function() {
        return this.mask.isShown() ? this.hide() : this.show();
    }

});

Toolkit.create('mask', function(options) {
    return new Toolkit.Mask(this, options);
});