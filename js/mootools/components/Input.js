/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

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
        this.element = element;
        this.options = options = this.inheritOptions(this.options, element);

        if (options.checkbox) {
            element.getElements(options.checkbox).inputCheckbox(options);
        }

        if (options.radio) {
            element.getElements(options.radio).inputRadio(options);
        }

        if (options.select) {
            element.getElements(options.select).inputSelect(options);
        }

        this.enable();
        this.fireEvent('init');
    },

    /**
     * Build the element to wrap custom inputs with.
     * Copy over the original class names.
     *
     * @param {Element} element
     * @returns {Toolkit.Input}
     */
    buildWrapper: function(element) {
        this.wrapper = new Element('div.' + Toolkit.vendor +'custom-input').wraps(element);

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
Toolkit.InputCheckbox = new Class({
    Extends: Toolkit.Input,

    /**
     * Wrap the checkbox with a custom element.
     *
     * @param {Element} checkbox
     * @param {Object} [options]
     */
    initialize: function(checkbox, options) {
        this.input = checkbox;
        this.setOptions(options, checkbox);
        this.buildWrapper(checkbox);

        this.element = new Element('label.' + Toolkit.vendor + 'checkbox')
            .set('for', checkbox.get('id'))
            .inject(checkbox, 'after');

        this.enable();
        this.fireEvent('init');
    }
});

/**
 * Wraps a radio with a custom input.
 * Uses a label for radio toggling so no JavaScript events are required.
 */
Toolkit.InputRadio = new Class({
    Extends: Toolkit.Input,

    /**
     * Wrap the radio with a custom element.
     *
     * @param {Element} radio
     * @param {Object} [options]
     */
    initialize: function(radio, options) {
        this.input = radio;
        this.setOptions(options, radio);
        this.buildWrapper(radio);

        this.element = new Element('label.' + Toolkit.vendor + 'radio')
            .set('for', radio.get('id'))
            .inject(radio, 'after');

        this.enable();
        this.fireEvent('init');
    }
});

/**
 * Wraps a select dropdown with a custom input.
 * Supports native or custom dropdowns.
 */
Toolkit.InputSelect = new Class({
    Extends: Toolkit.Input,
    Binds: ['buildOption', 'onChange', 'onCycle', 'onToggle'],

    /** Custom dropdown */
    dropdown: null,

    /** Is it a multi-select */
    multiple: false,

    /** Current index while cycling through options */
    index: 0,

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
        this.setOptions(options, select);

        // Multiple selects must use native controls
        this.multiple = select.multiple;

        if (select.multiple && this.options.native) {
            return;
        }

        var events = {
            'change input': 'onChange'
        };

        // Create custom elements
        this.buildWrapper(select);
        this.buildButton(select);

        // Custom dropdowns
        if (!this.options.native) {
            events['blur input'] = 'hide';
            events['clickout .' + Toolkit.vendor + 'drop.select-options'] = 'hide';
            events['clickout element'] = 'hide';
            events['click element'] = 'onToggle';

            if (!this.multiple) {
                events['keydown window'] = 'onCycle';
            }

            this.buildDropdown(select);

            // Cant hide/invisible the real select or we lose focus/blur
            // So place it below .custom-input
            select.setStyle('z-index', 1);
        }

        this.events = events;

        this.enable();
        this.fireEvent('init');

        // Trigger change immediately to update the label
        this.input.fireEvent('change', { target: select });
    },

    /**
     * Build the element to represent the select button with label and arrow.
     *
     * @param {Element} select
     * @returns {Toolkit.InputSelect}
     */
    buildButton: function(select) {
        var vendor = Toolkit.vendor;

        this.element = new Element('div.' + vendor + 'select')
            .grab(new Element('div.' + vendor + 'select-arrow').set('html', this.options.arrowContent))
            .grab(new Element('div.' + vendor + 'select-label').set('text', Toolkit.messages.loading))
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
     * @returns {Toolkit.InputSelect}
     */
    buildDropdown: function(select) {
        var vendor = Toolkit.vendor,
            options = this.options,
            buildOption = this.buildOption,
            dropdown = new Element('div.' + vendor + 'drop.' + vendor + 'drop--down.' + vendor + 'select-options'),
            list = new Element('ul'),
            index = 0;

        dropdown.set('role', 'listbox').aria('multiselectable', this.multiple);

        this.dropdown = dropdown;

        Array.from(select.children).each(function(optgroup) {
            if (optgroup.get('tag') === 'optgroup') {
                if (index === 0) {
                    options.hideFirst = false;
                }

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
                        this.index = index;
                    }

                    list.grab( buildOption(option, index) );
                    index++;
                }, this);
            } else {
                if (optgroup.selected) {
                    this.index = index;
                }

                list.grab( buildOption(optgroup, index) );
                index++;
            }
        }, this);

        if (options.hideSelected && !options.multiple) {
            dropdown.addClass('hide-selected');
        }

        if (options.hideFirst) {
            dropdown.addClass('hide-first');
        }

        if (select.multiple) {
            dropdown.addClass('is-multiple');
        }

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
            activeClass = 'is-active',
            selected = option.selected;

        // Create elements
        var li = new Element('li'),
            content = option.textContent,
            description;

        if (selected) {
            li.addClass(activeClass);
        }

        if (description = this.readValue(option, this.options.getDescription)) {
            content += ' <span class="' + Toolkit.vendor + 'drop-desc">' + description + '</span>';
        }

        var a = new Element('a')
            .set({
                html: content,
                href: 'javascript:;',
                role: 'option'
            })
            .aria('selected', selected);

        if (this.options.copyClasses) {
            this.copyClasses(option, li);
        }

        li.grab(a);

        // Attach no events for disabled options
        if (option.disabled) {
            li.addClass('is-disabled');
            a.aria('disabled', true);

            return li;
        }

        // Set events
        if (this.multiple) {
            a.addEvent('click', function() {
                var selected = false;

                if (option.selected) {
                    this.getParent().removeClass(activeClass);

                } else {
                    selected = true;
                    this.getParent().addClass(activeClass);
                }

                option.selected = selected;
                this.aria('selected', selected);

                select.fireEvent('change', { target: select });
            });

        } else {
            var self = this;

            a.addEvent('click', function() {
                dropdown.getElements('li').removeClass(activeClass);
                dropdown.getElements('a').aria('selected', false);

                this.getParent().addClass(activeClass);
                this.aria('selected', true);

                self.hide();
                self.index = index;

                select.set('value', option.value);
                select.fireEvent('change', { target: select });
            });
        }

        return li;
    },

    /**
     * Hide the dropdown and remove active states.
     *
     * @returns {Toolkit.InputSelect}
     */
    hide: function() {
        this.element.removeClass('is-active');

        if (this.dropdown) {
            this.dropdown.conceal();
        }

        this.fireEvent('hide');

        return this;
    },

    /**
     * Show the dropdown and apply active states.
     *
     * @returns {Toolkit.InputSelect}
     */
    show: function() {
        this.element.addClass('is-active');

        if (this.dropdown) {
            this.dropdown.reveal();
        }

        this.fireEvent('show');

        return this;
    },

    /**
     * Loop through the options and determine the index to select.
     * Skip over missing options, disabled options, or hidden options.
     *
     * @private
     * @param {Number} index
     * @param {Number} step
     * @param {jQuery} options
     * @returns {Number}
     */
    _loop: function(index, step, options) {
        var hideFirst = this.options.hideFirst;

        index += step;

        while ((typeof options[index] === 'undefined') || options[index].disabled || (index === 0 && hideFirst)) {
            index += step;

            if (index >= options.length) {
                index = 0;
            } else if (index < 0) {
                index = options.length - 1;
            }
        }

        return index;
    },

    /**
     * Event handler for select option changing.
     *
     * @private
     * @param {DOMEvent} e
     */
    onChange: function(e) {
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
        select.getParent().getElement('.' + Toolkit.vendor + 'select-label')
            .set('text', label);

        this.fireEvent('change', [select.get('value'), selected]);
    },

    /**
     * Event handler for cycling through options with up and down keys.
     *
     * @private
     * @param {DOMEvent} e
     */
    onCycle: function(e) {
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
            activeClass = 'is-active',
            index = this.index;

        switch (e.key) {
            case 'enter':
            case 'esc':
                this.hide();
            return;
            case 'up':
                index = this._loop(index, -1, options);
            break;
            case 'down':
                index = this._loop(index, 1, options);
            break;
        }

        options.set('selected', false);
        options[index].selected = true;

        items.getParent().removeClass(activeClass);
        items[index].getParent().addClass(activeClass);

        this.index = index;
        this.input.fireEvent('change', { target: this.input });
    },

    /**
     * Event handler for toggling custom dropdown display.
     *
     * @private
     * @param {DOMEvent} e
     */
    onToggle: function() {
        if (this.input.disabled) {
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
 * Define jQuery plugins that can be instantiated through
 * input() (triggers all 3), inputRadio(), inputCheckbox(), and inputSelect().
 */
Toolkit.create('input', function(options) {
    return new Toolkit.Input(this, options);
});

Toolkit.create('inputRadio', function(options) {
    return new Toolkit.InputRadio(this, options);
});

Toolkit.create('inputCheckbox', function(options) {
    return new Toolkit.InputCheckbox(this, options);
});

Toolkit.create('inputSelect', function(options) {
    return new Toolkit.InputSelect(this, options);
});