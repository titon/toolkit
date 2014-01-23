/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Toolkit.Mask = new Class({
    Extends: Toolkit.Component,

    options: {
    },

    mask: null,

    initialize: function(element, options) {
        this.parent(options);
        this.setElement(element);

        // Don't apply to absolute, fixed or relative
        if (this.element.getStyle('position') === 'static') {
            this.element.setStyle('position', 'relative');
        }

        this.element.addClass(Toolkit.options.vendor + 'maskable');

        // Find a mask or create it
        var maskClass = '.' + Toolkit.options.vendor + 'mask';

        this.mask = this.element.getElement(maskClass);

        if (this.mask) {
            this.mask.addClass('hide');
        } else {
            this.mask = new Element('div' + maskClass)
                .addClass('hide')
                .inject(element, 'bottom');
        }

        this.fireEvent('init');
    },

    hide: function() {
        this.mask.conceal();
        this.element.removeClass(Toolkit.options.isPrefix + 'masked');
    },

    show: function(node) {
        this.node = node;
        this.mask.reveal();
        this.element.addClass(Toolkit.options.isPrefix + 'masked');
    },

    toggle: function() {
        return this.mask.isShown() ? this.hide() : this.show();
    }

});

Element.implement('mask', function(options) {
    if (!this.$mask) {
        this.$mask = new Toolkit.Mask(this, options);
    }

    return this;
});

})();