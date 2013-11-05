/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Titon.Input = new Class({
    Extends: Titon.Component,
    Binds: ['__change'],

    /** Default options */
    options: {
        checkbox: true,
        radio: true,
        select: true
    },

    /**
     * Initialize custom inputs on target forms.
     *
     * @param {Element} element
     * @param {Object} [options]
     */
    initialize: function(element, options) {
        this.parent(options);
        this.setElement(element);

        if (!this.element) {
            return;
        }

        this.bindEvents();
        this.fireEvent('init');
    },

    /**
     * Replace specific form elements with custom replacements.
     *
     * @returns {Titon.Input}
     */
    bindEvents: function() {
        var options = this.options,
            onChange = this.__change;

        // Checkboxes
        if (options.checkbox) {
            this.element.getElements('input[type="checkbox"]').each(function(el) {
                new Element('div.custom-input').wraps(el);
                new Element('label.checkbox')
                    .setProperty('for', el.get('id'))
                    .inject(el, 'after');
            });
        }

        // Radios
        if (options.radio) {
            this.element.getElements('input[type="radio"]').each(function(el) {
                new Element('div.custom-input').wraps(el);
                new Element('label.radio')
                    .setProperty('for', el.get('id'))
                    .inject(el, 'after');
            });
        }

        // Selects
        if (options.select) {
            this.element.getElements('select').each(function(el) {
                if (el.multiple) {
                    return; // Do not style multi-selects
                }

                var label = el[el.selectedIndex] ? el[el.selectedIndex].textContent : '--',
                    width = el.getWidth();

                new Element('div.custom-input').wraps(el);
                new Element('div.select')
                    .grab(new Element('div.select-arrow').set('html', '<span class="caret-down"></span>'))
                    .grab(new Element('div.select-label').set('text', label))
                    .setStyle('min-width', width)
                    .inject(el, 'after');

                el.addEvent('change', onChange);
            });
        }

        return this;
    },

    /**
     * Event handler for select option changing.
     *
     * @private
     * @param {DOMEvent} e
     */
    __change: function(e) {
        var select = e.target;

        if (select[select.selectedIndex]) {
            select.getParent().getElement('.select-label')
                .set('text', select[select.selectedIndex].textContent);
        }
    }

});

/**
 * Enable custom inputs and selects within forms by calling input().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $$('form').input({
 *         checkbox: true
 *     });
 *
 * @param {Object} [options]
 * @returns {Titon.Input}
 */
Element.implement('input', function(options) {
    if (!this.$input) {
        this.$input = new Titon.Input(this, options);
    }

    return this;
});

})();