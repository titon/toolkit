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
            select: 'select',
            copyClasses: true
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
            this.wrapper = new Element('div.' + Toolkit.options.vendor +'custom-input').wraps(element);

            if (this.options.copyClasses) {
                this.copyClasses(element, this.wrapper);
            }

            return this;
        },

        /**
         * Copy classes from one element to another, but do not copy .input classes.
         *
         * @param {Element} from
         * @param {Element} to
         * @returns {Toolkit.Input}
         */
        copyClasses: function(from, to) {
            var classes = (from.get('class') || '').replace(/\binput\b/, '').trim();

            if (classes) {
                to.addClass(classes);
            }

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
        Binds: ['buildOption', '__change', '__cycle', '__toggle'],

        /** Custom dropdown */
        dropdown: null,

        /** Is it a multi-select */
        multiple: false,

        /** Current index while cycling through options */
        currentIndex: 0,

        /** Default options */
        options: {
            native: false,
            multipleFormat: 'count', // count, list
            countMessage: '{count} of {total} selected',
            listLimit: 3,
            hideFirst: false,
            hideSelected: false,
            arrowContent: '<span class="caret-down"></span>',
            getDefaultLabel: 'title',
            getOptionLabel: 'title',
            getDescription: 'data-description'
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

            // Multiple selects must use native controls
            this.multiple = select.multiple;

            if (select.multiple && this.options.native) {
                return;
            }

            // Create custom elements
            this.buildWrapper(select);
            this.buildButton(select);

            // Custom dropdowns
            if (!this.options.native) {
                this.buildDropdown(select);

                // Cant hide/invisible the real select or we lose focus/blur
                // So place it below .custom-input
                select
                    .setStyle('z-index', 1)
                    .addEvent('blur', this.__hide);
            }

            this.bindEvents();
            this.fireEvent('init');
        },

        /**
         * Bind events.
         *
         * @returns {Toolkit.Input.Select}
         */
        bindEvents: function() {
            this.input.addEvent('change', this.__change);

            if (!this.options.native) {
                this.dropdown.addEvent('clickout', this.__hide);

                this.element
                    .addEvent('clickout', this.__hide)
                    .addEvent('click', this.__toggle);
            }

            if (!this.multiple) {
                window.addEvent('keydown', this.__cycle);
            }

            // Trigger change immediately to update the label
            this.input.fireEvent('change', { target: this.input });

            return this;
        },

        /**
         * Build the element to represent the select button with label and arrow.
         *
         * @param {Element} select
         * @returns {Toolkit.Input.Select}
         */
        buildButton: function(select) {
            var vendor = Toolkit.options.vendor;

            this.element = new Element('div.' + vendor + 'select')
                .grab(new Element('div.' + vendor + 'select-arrow').set('html', this.options.arrowContent))
                .grab(new Element('div.' + vendor + 'select-label').set('text', Toolkit.options.loadingMessage))
                .setStyle('min-width', select.getWidth())
                .inject(select, 'after');

            // Hide the options be forcing a height on the select
            if (this.multiple) {
                this.input.setStyle('max-height', this.element.getHeight());
            }

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
                options = this.options,
                buildOption = this.buildOption,
                dropdown = new Element('div.' + vendor + 'drop--down.' + vendor + 'select-options'),
                list = new Element('ul'),
                index = 0;

            if (options.hideSelected && !options.multiple) {
                dropdown.addClass('hide-selected');
            }

            if (select.multiple) {
                dropdown.addClass(Toolkit.options.isPrefix + 'multiple');
            }

            this.dropdown = dropdown;

            Array.from(select.children).each(function(optgroup) {
                if (optgroup.get('tag') === 'optgroup') {
                    list.grab(
                        new Element('li')
                            .addClass(vendor + 'drop-heading')
                            .set('text', optgroup.get('label'))
                    );

                    Array.from(optgroup.children).each(function(option) {
                        if (optgroup.disabled) {
                            option.disabled = true;
                        }

                        if (option.selected) {
                            this.currentIndex = index;
                        }

                        list.grab( buildOption(option, index) );
                        index++;
                    }, this);
                } else {
                    if (options.hideFirst && index === 0) {
                        return;
                    }

                    if (optgroup.selected) {
                        this.currentIndex = index;
                    }

                    list.grab( buildOption(optgroup, index) );
                    index++;
                }
            }, this);

            this.wrapper.grab(dropdown.grab(list));

            return this;
        },

        /**
         * Build the list item to represent the select option.
         *
         * @param {Element} option
         * @param {Number} index
         * @returns {Element}
         */
        buildOption: function(option, index) {
            var select = this.input,
                dropdown = this.dropdown,
                activeClass = Toolkit.options.isPrefix + 'active';

            // Create elements
            var li = new Element('li'),
                content = option.textContent,
                description;

            if (option.selected) {
                li.addClass(activeClass);
            }

            if (description = this.readValue(option, this.options.getDescription)) {
                content += ' <span class="' + Toolkit.options.vendor + 'drop-desc">' + description + '</span>';
            }

            var a = new Element('a')
                .set('html', content)
                .set('href', 'javascript:;');

            if (this.options.copyClasses) {
                this.copyClasses(option, li);
            }

            li.grab(a);

            // Attach no events for disabled options
            if (option.disabled) {
                li.addClass(Toolkit.options.isPrefix + 'disabled');

                return li;
            }

            // Set events
            if (this.multiple) {
                a.addEvent('click', function() {
                    if (option.selected) {
                        option.selected = false;
                        this.getParent().removeClass(activeClass);

                    } else {
                        option.selected = true;
                        this.getParent().addClass(activeClass);
                    }

                    select.fireEvent('change', { target: select });
                });

            } else {
                var self = this;

                a.addEvent('click', function() {
                    dropdown.getElements('li').removeClass(activeClass);
                    dropdown.conceal();

                    this.getParent().addClass(activeClass);
                    self.currentIndex = index;

                    select.set('value', option.value);
                    select.fireEvent('change', { target: select });
                });
            }

            return li;
        },

        /**
         * Hide the dropdown and remove active states.
         *
         * @returns {Toolkit.Input.Select}
         */
        hide: function() {
            this.element.removeClass(Toolkit.options.isPrefix + 'active');

            if (this.dropdown) {
                this.dropdown.conceal();
            }

            this.fireEvent('hide');

            return this;
        },

        /**
         * Show the dropdown and apply active states.
         *
         * @returns {Toolkit.Input.Select}
         */
        show: function() {
            this.element.addClass(Toolkit.options.isPrefix + 'active');

            if (this.dropdown) {
                this.dropdown.reveal();
            }

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
            var select = e.target,
                options = select.getElements('option'),
                selected = [],
                label = [];

            // Fetch label from selected option
            options.each(function(option) {
                if (option.selected) {
                    selected.push( option );
                    label.push( this.readValue(option, this.options.getOptionLabel) || option.textContent );
                }
            }, this);

            // Reformat label if needed
            if (this.multiple) {
                var title = this.readValue(select, this.options.getDefaultLabel),
                    format = this.options.multipleFormat,
                    count = label.length;

                // Use default title if nothing selected
                if (!label.length && title) {
                    label = title;

                // Display a counter for label
                } else if (format === 'count') {
                    label = this.options.countMessage
                        .replace('{count}', count)
                        .replace('{total}', options.length);

                // Display options as a list for label
                } else if (format === 'list') {
                    var limit = this.options.listLimit;

                    label = label.splice(0, limit).join(', ');

                    if (limit < count) {
                        label += ' ...';
                    }
                }
            } else {
                label = label.join(', ');
            }

            // Set the label
            select.getParent().getElement('.' + Toolkit.options.vendor + 'select-label')
                .set('text', label);

            this.fireEvent('change', [select.get('value'), selected]);
        },

        /**
         * Event handler for cycling through options with up and down keys.
         *
         * @private
         * @param {DOMEvent} e
         */
        __cycle: function(e) {
            if (!this.dropdown.isVisible()) {
                return;
            }

            if (['up', 'down', 'enter', 'esc'].contains(e.key)) {
                e.preventDefault();
            } else {
                return;
            }

            var options = this.input.getElements('option'),
                items = this.dropdown.getElements('a'),
                activeClass = Toolkit.options.isPrefix + 'active',
                index = this.currentIndex;

            switch (e.key) {
                case 'enter':
                case 'esc':
                    this.hide();
                    return;
                break;
                case 'up':
                    index--;

                    if (index < 0) {
                        index = options.length - 1;
                    }

                    while (options[index].disabled) {
                        index--;

                        if (index < 0) {
                            index = options.length - 1;
                        }
                    }
                break;
                case 'down':
                    index++;

                    if (index >= options.length) {
                        index = 0;
                    }

                    while (options[index].disabled) {
                        index++;

                        if (index >= options.length) {
                            index = 0;
                        }
                    }
                break;
            }

            options.set('selected', false);
            options[index].selected = true;

            items.getParent().removeClass(activeClass);
            items[index].getParent().addClass(activeClass);

            this.currentIndex = index;
            this.input.fireEvent('change', { target: this.input });
        },

        /**
         * Event handler for toggling custom dropdown display.
         *
         * @private
         * @param {DOMEvent} e
         */
        __toggle: function(e) {
            if (!this.enabled || this.input.disabled) {
                return;
            }

            if (this.dropdown.isShown()) {
                this.hide();
            } else {
                this.show();
            }
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