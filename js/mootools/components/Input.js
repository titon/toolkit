/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

    Toolkit.Input = new Class({
        Extends: Toolkit.Component,

        /** Wrapping div */
        wrapper: null,

        /** Base input */
        input: null,

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

            if (options.checkbox) {
                this.element.getElements(options.checkbox).checkbox(options);
            }

            if (options.radio) {
                this.element.getElements(options.radio).radio(options);
            }

            if (options.select) {
                this.element.getElements(options.select).select(options);
            }

            return this;
        },

        /**
         * Build the element to wrap custom inputs with.
         * Copy over the original class names.
         *
         * @param {Element} element
         * @returns {Toolkit.Input}
         */
        buildWrapper: function(element) {
            var div = new Element('div.' + Toolkit.options.vendor +'custom-input'),
                classes = (element.get('class') || '').replace(/\binput\b/, '').trim();

            if (classes) {
                div.addClass(classes);
            }

            div.wraps(element);

            this.wrapper = div;

            return this;
        }
    });

    /**
     * Wraps a checkbox with a custom input.
     * Uses a label for checkbox toggling so no JavaScript events are required.
     */
    Toolkit.Input.Checkbox = new Class({
        Extends: Toolkit.Input,

        /**
         * Wrap the checkbox with a custom element.
         *
         * @param {Element} checkbox
         * @param {Object} [options]
         */
        initialize: function(checkbox, options) {
            this.input = checkbox;
            this.setOptions(options);

            this.buildWrapper(checkbox);

            this.setElement(
                new Element('label.' + Toolkit.options.vendor + 'checkbox')
                    .setProperty('for', checkbox.get('id'))
                    .inject(checkbox, 'after')
            );

            this.fireEvent('init');
        }
    });

    /**
     * Wraps a radio with a custom input.
     * Uses a label for radio toggling so no JavaScript events are required.
     */
    Toolkit.Input.Radio = new Class({
        Extends: Toolkit.Input,

        /**
         * Wrap the radio with a custom element.
         *
         * @param {Element} radio
         * @param {Object} [options]
         */
        initialize: function(radio, options) {
            this.input = radio;
            this.setOptions(options);

            this.buildWrapper(radio);

            this.setElement(
                new Element('label.' + Toolkit.options.vendor + 'radio')
                    .setProperty('for', radio.get('id'))
                    .inject(radio, 'after')
            );

            this.fireEvent('init');
        }
    });

    /**
     * Wraps a select dropdown with a custom input.
     * Supports native or custom dropdowns.
     */
    Toolkit.Input.Select = new Class({
        Extends: Toolkit.Input,
        Binds: ['_buildOption', '__change', '__toggle'],

        /** Custom button */
        button: null,

        /** Custom dropdown */
        dropdown: null,

        /** Default options */
        options: {
            multiple: false,
            dropdown: true,
            arrowContent: '<span class="caret-down"></span>',
            defaultLabel: ''
        },

        /**
         * Wrap the select with a custom element.
         *
         * @param {Element} select
         * @param {Object} [options]
         */
        initialize: function(select, options) {
            this.input = select;
            this.setOptions(options);

            // Do not style multi-selects
            if (select.multiple && !this.options.multiple) {
                return;
            }

            // Create custom elements
            this.buildWrapper(select);
            this.buildButton(select);

            // Custom dropdowns
            if (this.options.dropdown) {
                this.buildDropdown(select);

                // Trigger focus on the real select when the custom button is clicked
                this.button.addEvent('click', function(e) {
                    e.preventDefault();

                    select.fireEvent('focus', { target: select });
                });

                select
                    // Open the dropdown when the real select gets/loses focus via label
                    .addEvent('focus', this.__toggle)
                    .addEvent('blur', this.__hide)

                    // Cant hide/invisible the real select or we lose focus/blur
                    // So place it below .custom-input
                    .setStyle('z-index', 1);
            }

            // All change events behave the same
            select.addEvent('change', this.__change);
        },

        /**
         * Build the element to represent the select button with label and arrow.
         *
         * @param {Element} select
         * @returns {Toolkit.Input.Select}
         */
        buildButton: function(select) {
            var vendor = Toolkit.options.vendor;

            this.button = new Element('div.' + vendor + 'select')
                .grab(new Element('div.' + vendor + 'select-arrow').set('html', this.options.arrowContent))
                .grab(new Element('div.' + vendor + 'select-label').set('text', this.options.defaultLabel || select[select.selectedIndex].textContent))
                .setStyle('min-width', select.getWidth())
                .inject(select, 'after');

            return this;
        },

        /**
         * Build the custom dropdown to hold a list of option items.
         *
         * @param {Element} select
         * @returns {Toolkit.Input.Select}
         */
        buildDropdown: function(select) {
            var vendor = Toolkit.options.vendor,
                buildOption = this.buildOption.bind(this),
                dropdown = new Element('ul.' + vendor + 'drop--down');

            this.dropdown = dropdown;

            Array.from(select.children).each(function(optgroup) {
                if (optgroup.get('tag') === 'optgroup') {
                    dropdown.grab(
                        new Element('li')
                            .addClass(vendor + 'drop-heading')
                            .set('text', optgroup.get('label'))
                    );

                    Array.from(optgroup.children).each(function(option) {
                        dropdown.grab( buildOption(option) );
                    });
                } else {
                    dropdown.grab( buildOption(optgroup) );
                }
            });

            this.wrapper.grab(dropdown);

            return this;
        },

        /**
         * Build the list item to represent the select option.
         *
         * @param {Element} option
         * @returns {Element}
         */
        buildOption: function(option) {
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
                    dropdown.conceal();
                    dropdown.getElements('li').removeClass(activeClass);

                    this.getParent().addClass(activeClass);

                    select.set('value', option.value);
                    select.fireEvent('change', { target: select });
                });

            return li.grab(a);
        },

        /**
         * Hide the dropdown and remove active states.
         *
         * @returns {Toolkit.Input.Select}
         */
        hide: function() {
            this.button.removeClass(Toolkit.options.isPrefix + 'active');
            this.dropdown.conceal();
            this.fireEvent('hide');

            return this;
        },

        /**
         * Show the dropdown and apply active states.
         *
         * @returns {Toolkit.Input.Select}
         */
        show: function() {
            this.button.addClass(Toolkit.options.isPrefix + 'active');
            this.dropdown.reveal();
            this.fireEvent('show');

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
                select.getParent().getElement('.' + Toolkit.options.vendor + 'select-label')
                    .set('text', select[select.selectedIndex].textContent);
            }

            select.fireEvent('blur', { target: select });

            this.fireEvent('change');
        },

        /**
         * Event handler for toggling custom dropdown display.
         *
         * @private
         * @param {DOMEvent} e
         */
        __toggle: function(e) {
            if (!this.enabled || this.select.disabled) {
                return;
            }

            this.dropdown.isShown() ? this.hide() : this.show();
        }
    });

    /**
     * Enable custom inputs and selects within forms by calling input().
     * An object of options can be passed as the 1st argument.
     *
     * @example
     *     $$('form').input();
     *     $$('input[type="radio"]').radio();
     *     $$('input[type="checkbox"]').checkbox();
     *     $$('select').select();
     *
     * @param {Object} [options]
     * @returns {Element}
     */
    Element.implement({
        input: function(options) {
            new Toolkit.Input(this, options);

            return this;
        },
        radio: function(options) {
            if (!this.$radio) {
                this.$radio = new Toolkit.Input.Radio(this, options);
            }

            return this;
        },
        checkbox: function(options) {
            if (!this.$checkbox) {
                this.$checkbox = new Toolkit.Input.Checkbox(this, options);
            }

            return this;
        },
        select: function(options) {
            if (!this.$select) {
                this.$select = new Toolkit.Input.Select(this, options);
            }

            return this;
        }
    });

})();