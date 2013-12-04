/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Toolkit.Input = new Class({
    Extends: Toolkit.Component,
    Binds: ['__change'],

    /** Default options */
    options: {
        checkbox: 'input[type="checkbox"]',
        radio: 'input[type="radio"]',
        select: 'select'
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
     * @returns {Toolkit.Input}
     */
    bindEvents: function() {
        var options = this.options,
            vendor = Toolkit.options.vendor,
            buildWrapper = this._buildWrapper,
            onChange = this.__change;

        // Checkboxes
        if (options.checkbox) {
            this.element.getElements(options.checkbox).each(function(el) {
                buildWrapper(el).wraps(el);

                new Element('label.' + vendor +'checkbox')
                    .setProperty('for', el.get('id'))
                    .inject(el, 'after');
            });
        }

        // Radios
        if (options.radio) {
            this.element.getElements(options.radio).each(function(el) {
                buildWrapper(el).wraps(el);

                new Element('label.' + vendor +'radio')
                    .setProperty('for', el.get('id'))
                    .inject(el, 'after');
            });
        }

        // Selects
        if (options.select) {
            this.element.getElements(options.select).each(function(el) {
                if (el.multiple) {
                    return; // Do not style multi-selects
                }

                var label = el[el.selectedIndex] ? el[el.selectedIndex].textContent : '--',
                    width = el.getWidth();

                buildWrapper(el).wraps(el);

                new Element('div.' + vendor +'select')
                    .grab(new Element('div.' + vendor +'select-arrow').set('html', '<span class="caret-down"></span>'))
                    .grab(new Element('div.' + vendor +'select-label').set('text', label))
                    .setStyle('min-width', width)
                    .inject(el, 'after');

                el.addEvent('change', onChange);
            });
        }

        return this;
    },

    /**
     * Build the element to wrap custom inputs with.
     * Copy over the original class names.
     *
     * @private
     * @param {Element} element
     * @returns {Element}
     */
    _buildWrapper: function(element) {
        var div = new Element('div.' + Toolkit.options.vendor +'custom-input'),
            classes = (element.get('class') || '').replace(/\binput\b/, '').trim();

        if (classes) {
            div.addClass(classes);
        }

        return div;
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
            select.getParent().getElement('.' + Toolkit.options.vendor +'select-label')
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
 * @returns {Toolkit.Input}
 */
Element.implement('input', function(options) {
    if (!this.$input) {
        this.$input = new Toolkit.Input(this, options);
    }

    return this;
});

})();