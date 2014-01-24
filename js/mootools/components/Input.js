/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Toolkit.Input = new Class({
    Extends: Toolkit.Component,

    /** Wrapping custom input */
    wrapper: null,

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
        var options = this.options;

        // Checkboxes
        if (options.checkbox) {
            this.element.getElements(options.checkbox).each(function(el) {
                el.$checkbox = new Toolkit.Input.Checkbox(el, options);
            });
        }

        // Radios
        if (options.radio) {
            this.element.getElements(options.radio).each(function(el) {
                el.$radio = new Toolkit.Input.Radio(el, options);
            });
        }

        // Selects
        if (options.select) {
            this.element.getElements(options.select).each(function(el) {
                if (el.multiple && !options.multiple) {
                    return; // Do not style multi-selects
                }

                el.$select = new Toolkit.Input.Select(el, options);
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

        div.wraps(element);

        this.wrapper = div;

        return div;
    }

});

Toolkit.Input.Checkbox = new Class({
    Extends: Toolkit.Input,

    /** Base checkbox */
    checkbox: null,

    /**
     * Wrap the checkbox with a custom element.
     *
     * @param {Element} checkbox
     * @param {Object} options
     */
    initialize: function(checkbox, options) {
        this.setOptions(options);

        this.checkbox = checkbox;

        this._buildWrapper(checkbox);

        this.setElement(
            new Element('label.' + Toolkit.options.vendor + 'checkbox')
                .setProperty('for', checkbox.get('id'))
                .inject(checkbox, 'after')
        );
    }
});

Toolkit.Input.Radio = new Class({
    Extends: Toolkit.Input,

    /** Base radio */
    radio: null,

    /**
     * Wrap the radio with a custom element.
     *
     * @param {Element} radio
     * @param {Object} options
     */
    initialize: function(radio, options) {
        this.setOptions(options);

        this.radio = radio;

        this._buildWrapper(radio);

        this.setElement(
            new Element('label.' + Toolkit.options.vendor + 'radio')
                .setProperty('for', radio.get('id'))
                .inject(radio, 'after')
        );
    }
});

Toolkit.Input.Select = new Class({
    Extends: Toolkit.Input,
    Binds: ['_buildOption', '__change'],

    /** Base select */
    select: null,

    /** Custom button */
    button: null,

    /** Custom dropdown */
    dropdown: null,

    /** Options */
    options: {
        multiple: false,
        dropdown: true
    },

    initialize: function(select, options) {
        this.setOptions(options);
        this.select = select;

        // Create custom elements
        this._buildWrapper(select);
        this._buildButton(select);

        // Custom dropdowns
        if (this.options.dropdown) {
            this._buildDropdown(select);

            this.button.addEvent('click', this.__show);

            select
                .addEvent('focus', this.__show)
                .addEvent('blur', this.__show)

                // Cant hide/invisible or we lose focus/blur
                .setStyle('z-index', 1);
        }

        select.addEvent('change', this.__change);
    },

    /**
     * Build the element to represent the select button with label and arrow.
     *
     * @private
     * @param {Element} select
     * @returns {Element}
     */
    _buildButton: function(select) {
        var vendor = Toolkit.options.vendor;

        return this.button = new Element('div.' + vendor + 'select')
            .grab(new Element('div.' + vendor + 'select-arrow').set('html', '<span class="caret-down"></span>'))
            .grab(new Element('div.' + vendor + 'select-label').set('text', select[select.selectedIndex].textContent))
            .setStyle('min-width', select.getWidth())
            .inject(select, 'after');
    },

    /**
     * Build the custom dropdown to hold a list of option items.
     *
     * @private
     * @param {Element} select
     * @returns {Element}
     */
    _buildDropdown: function(select) {
        var vendor = Toolkit.options.vendor,
            buildOption = this._buildOption,
            dropdown = new Element('ul.' + vendor + 'dropdown');

        this.dropdown = dropdown;
        this.wrapper.grab(dropdown);

        Array.from(select.children).each(function(optgroup) {
            if (optgroup.get('tag') === 'optgroup') {
                dropdown.grab(
                    new Element('li')
                        .addClass(vendor + 'dropdown-heading')
                        .set('text', optgroup.get('label'))
                );

                Array.from(optgroup.children).each(function(option) {
                    dropdown.grab( buildOption(option) );
                });
            } else {
                dropdown.grab( buildOption(optgroup) );
            }
        });

        return dropdown;
    },

    /**
     * Build the list item to represent the select option.
     *
     * @private
     * @param {Element} option
     * @returns {Element}
     */
    _buildOption: function(option) {
        var select = this.select,
            dropdown = this.dropdown,
            activeClass = Toolkit.options.isPrefix + 'active';

        // Create elements
        var li = new Element('li');

        if (option.selected) {
            li.addClass(activeClass);
        }

        var a = new Element('a')
            .set('text', option.textContent)
            .set('href', 'javascript:;')
            .addEvent('click', function() {
                select.set('value', option.value);
                select.fireEvent('change', { target: select });

                dropdown.conceal();
                dropdown.getElements('li').removeClass(activeClass);

                this.getParent().addClass(activeClass);
            });

        return li.grab(a);
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
            select.getParent().getElement('.' + Toolkit.options.vendor + 'select-label')
                .set('text', select[select.selectedIndex].textContent);
        }
    },

    /**
     * Event handler for toggling custom dropdown display.
     *
     * @private
     * @param {DOMEvent} e
     */
    __show: function(e) {
        if (this.select.disabled) {
            return;
        }

        var dropdown = this.dropdown;

        if (dropdown.isShown()) {
            dropdown.conceal();
        } else {
            dropdown.reveal();
        }

        this.button.toggleClass('is-active');
    }
});

/**
 * Enable custom inputs and selects within forms by calling input().
 * An object of options can be passed as the 1st argument.
 *
 * @example
 *     $$('form').input();
 *
 * @param {Object} [options]
 * @returns {Element}
 */
Element.implement('input', function(options) {
    if (!this.$input) {
        this.$input = new Toolkit.Input(this, options);
    }

    return this;
});

})();