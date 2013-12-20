/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Toolkit.Mask = new Class({
    Extends: Toolkit.Component,

    mask: null,

    initialize: function(element, options) {
        this.parent(options);
        this.setElement(element);

        // Don't apply to absolute, fixed or relative
        if (this.element.getStyle('position') === 'static') {
            this.element.setStyle('position', 'relative');
        }

        // Create the mask
        this.mask = new Element('div.' + Toolkit.options.vendor + 'mask')
            .addClass('hide')
            .inject(element, 'bottom');
    }
});

Element.implement('mask', function(options) {
    if (!this.$mask) {
        this.$mask = new Toolkit.Mask(this, options);
    }

    return this;
});

})();