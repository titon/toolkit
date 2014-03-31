/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

Toolkit.Input = Toolkit.Component.extend(function(element, options) {
    this.component = 'Input';
    this.version = '1.2.0';
    this.element = element = $(element);
    this.options = options = this.setOptions(options, element);

    if (options.checkbox) {
        element.find(options.checkbox).inputCheckbox(options);
    }

    if (options.radio) {
        element.find(options.radio).inputRadio(options);
    }

    if (options.select) {
        element.find(options.select).inputSelect(options);
    }

    this.enable();
    this.fireEvent('init');
}, {

    /**
     * Copy classes from one element to another, but do not copy .input classes.
     *
     * @param {jQuery} from
     * @param {jQuery} to
     */
    copyClasses: function(from, to) {
        var classes = ($(from).attr('class') || '').replace(/\binput\b/, '').trim();

        if (classes) {
            $(to).addClass(classes);
        }
    },

    /**
     * Build the element to wrap custom inputs with.
     * Copy over the original class names.
     *
     * @returns {jQuery}
     */
    _buildWrapper: function() {
        var input = this.input,
            wrapper = $('<div/>')
                .addClass(vendor + 'custom-input')
                .insertBefore(input)
                .append(input);

        if (this.options.copyClasses) {
            this.copyClasses(input, wrapper);
        }

        return wrapper;
    }

}, {
    copyClasses: true,
    checkbox: 'input:checkbox',
    radio: 'input:radio',
    select: 'select'
});

/**
 * Wraps a checkbox with a custom input.
 * Uses a label for checkbox toggling so no JavaScript events are required.
 */
Toolkit.InputCheckbox = Toolkit.Input.extend(function(checkbox, options) {
    this.component = 'InputCheckbox';
    this.version = '1.2.0';
    this.input = checkbox = $(checkbox);
    this.options = this.setOptions(options, checkbox);
    this.wrapper = this._buildWrapper();

    // Create custom input
    this.element = $('<label/>')
        .addClass(vendor + 'checkbox')
        .attr('for', checkbox.attr('id'))
        .insertAfter(checkbox);

    // Initialize events
    this.enable();
    this.fireEvent('init');
});

/**
 * Wraps a radio with a custom input.
 * Uses a label for radio toggling so no JavaScript events are required.
 */
Toolkit.InputRadio = Toolkit.Input.extend(function(radio, options) {
    this.component = 'InputRadio';
    this.version = '1.2.0';
    this.input = radio = $(radio);
    this.options = this.setOptions(options, radio);
    this.wrapper = this._buildWrapper();

    // Create custom input
    this.element = $('<label/>')
        .addClass(vendor + 'radio')
        .attr('for', radio.attr('id'))
        .insertAfter(radio);

    // Initialize events
    this.enable();
    this.fireEvent('init');
});

/**
 * Wraps a select dropdown with a custom input.
 * Supports native or custom dropdowns.
 */
Toolkit.InputSelect = Toolkit.Input.extend(function(select, options) {
    var events = {};

    this.component = 'InputSelect';
    this.version = '1.3.0';
    this.input = select = $(select);
    this.multiple = select.prop('multiple');
    this.options = options = this.setOptions(options, select);

    // Multiple selects must use native controls
    if (this.multiple && options.native) {
        return;
    }

    // Wrapping element
    this.wrapper = this._buildWrapper();

    // Button element to open the drop menu
    this.element = this._buildButton();

    // The custom drop menu
    this.dropdown = null;

    // Current option index when cycling with keyboard
    this.index = 0;

    // Initialize events
    events['change input'] = 'onChange';

    if (!options.native) {
        events['blur input'] = 'hide';
        events['clickout .' + vendor + 'select-options'] = 'hide';
        events['clickout element'] = 'hide';
        events['click element'] = 'onToggle';

        if (!this.multiple) {
            events['keydown window'] = 'onCycle';
        }

        // Build custom dropdown when not in native
        this._buildDropdown();

        // Cant hide/invisible the real select or we lose focus/blur
        // So place it below .custom-input
        this.input.css('z-index', 1);
    }

    this.events = events;

    this.enable();
    this.fireEvent('init');

    // Trigger change immediately to update the label
    this.input.change();
}, {

    /**
     * Hide the dropdown and remove active states.
     */
    hide: function() {
        this.element.removeClass('is-active');

        if (this.dropdown) {
            this.dropdown.conceal();
        }

        this.fireEvent('hide');
    },

    /**
     * Show the dropdown and apply active states.
     */
    show: function() {
        this.element.addClass('is-active');

        if (this.dropdown) {
            this.dropdown.reveal();
        }

        this.fireEvent('show');
    },

    /**
     * Build the element to represent the select button with label and arrow.
     *
     * @returns {jQuery}
     */
    _buildButton: function() {
        var button = $('<div/>')
            .addClass(vendor + 'select')
            .append( $('<div/>').addClass(vendor + 'select-arrow').html(this.options.arrowContent) )
            .append( $('<div/>').addClass(vendor + 'select-label').html(Toolkit.messages.loading) )
            .css('min-width', this.input.width())
            .insertAfter(this.input);

        // Hide the options be forcing a height on the select
        if (this.multiple) {
            this.input.css('max-height', button.height());
        }

        return button;
    },

    /**
     * Build the custom dropdown to hold a list of option items.
     *
     * @returns {jQuery}
     */
    _buildDropdown: function() {
        var select = this.input,
            options = this.options,
            buildOption = this._buildOption.bind(this),
            dropdown = $('<div/>')
                .addClass(vendor + 'drop ' + vendor + 'drop--down ' + vendor + 'select-options')
                .attr('role', 'listbox')
                .aria('multiselectable', this.multiple),
            list = $('<ul/>'),
            index = 0,
            self = this;

        this.dropdown = dropdown;

        select.children().each(function() {
            var optgroup = $(this);

            if (optgroup.prop('tagName').toLowerCase() === 'optgroup') {
                if (index === 0) {
                    options.hideFirst = false;
                }

                list.append(
                    $('<li/>')
                        .addClass(vendor + 'drop-heading')
                        .text(optgroup.attr('label'))
                );

                optgroup.children().each(function() {
                    var option = $(this);

                    if (optgroup.prop('disabled')) {
                        option.prop('disabled', true);
                    }

                    if (option.prop('selected')) {
                        self.index = index;
                    }

                    list.append( buildOption(option, index) );
                    index++;
                });
            } else {
                if (optgroup.prop('selected')) {
                    self.index = index;
                }

                list.append( buildOption(optgroup, index) );
                index++;
            }
        });

        if (options.hideSelected && !options.multiple) {
            dropdown.addClass('hide-selected');
        }

        if (options.hideFirst) {
            dropdown.addClass('hide-first');
        }

        if (this.multiple) {
            dropdown.addClass('is-multiple');
        }

        this.wrapper.append(dropdown.append(list));

        return dropdown;
    },

    /**
     * Build the list item to represent the select option.
     *
     * @param {jQuery} option
     * @param {Number} index
     * @returns {jQuery}
     */
    _buildOption: function(option, index) {
        var select = this.input,
            dropdown = this.dropdown,
            selected = option.prop('selected'),
            activeClass = 'is-active';

        // Create elements
        var li = $('<li/>'),
            content = option.text(),
            description;

        if (selected) {
            li.addClass(activeClass);
        }

        if (description = this.readValue(option, this.options.getDescription)) {
            content += ' <span class="' + vendor + 'drop-desc">' + description + '</span>';
        }

        var a = $('<a/>', {
            html: content,
            href: 'javascript:;',
            role: 'option'
        }).aria('selected', selected);

        if (this.options.copyClasses) {
            this.copyClasses(option, li);
        }

        li.append(a);

        // Attach no events for disabled options
        if (option.prop('disabled')) {
            li.addClass('is-disabled');
            a.aria('disabled', true);

            return li;
        }

        // Set events
        if (this.multiple) {
            a.click(function() {
                var self = $(this),
                    selected = false;

                if (option.prop('selected')) {
                    self.parent().removeClass(activeClass);

                } else {
                    selected = true;
                    self.parent().addClass(activeClass);
                }

                option.prop('selected', selected);
                self.aria('selected', selected);

                select.change();
            });

        } else {
            var self = this;

            a.click(function() {
                dropdown
                    .find('li').removeClass(activeClass).end()
                    .find('a').aria('selected', false);

                $(this)
                    .aria('selected', true)
                    .parent().addClass(activeClass);

                self.hide();
                self.index = index;

                select.val(option.val());
                select.change();
            });
        }

        return li;
    },

    /**
     * Loop through the options and determine the index to
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
     * @param {jQuery.Event} e
     */
    onChange: function(e) {
        var select = $(e.target),
            options = select.find('option'),
            opts = this.options,
            selected = [],
            label = [],
            self = this;

        // Fetch label from selected option
        options.each(function() {
            if (this.selected) {
                selected.push( this );
                label.push( self.readValue(this, opts.getOptionLabel) || this.textContent );
            }
        });

        // Reformat label if needed
        if (this.multiple) {
            var title = this.readValue(select, opts.getDefaultLabel),
                format = opts.multipleFormat,
                count = label.length;

            // Use default title if nothing selected
            if (!label.length && title) {
                label = title;

                // Display a counter for label
            } else if (format === 'count') {
                label = opts.countMessage
                    .replace('{count}', count)
                    .replace('{total}', options.length);

                // Display options as a list for label
            } else if (format === 'list') {
                var limit = opts.listLimit;

                label = label.splice(0, limit).join(', ');

                if (limit < count) {
                    label += ' ...';
                }
            }
        } else {
            label = label.join(', ');
        }

        // Set the label
        select.parent()
            .find('.' + vendor + 'select-label')
                .text(label);

        this.fireEvent('change', [select.val(), selected]);
    },

    /**
     * Event handler for cycling through options with up and down keys.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onCycle: function(e) {
        if (!this.dropdown.is(':shown')) {
            return;
        }

        if ($.inArray(e.keyCode, [38, 40, 13, 27]) >= 0) {
            e.preventDefault();
        } else {
            return;
        }

        var options = this.input.find('option'),
            items = this.dropdown.find('a'),
            activeClass = 'is-active',
            index = this.index;

        switch (e.keyCode) {
            case 13: // enter
            case 27: // esc
                this.hide();
            return;
            case 38: // up
                index = this._loop(index, -1, options);
            break;
            case 40: // down
                index = this._loop(index, 1, options);
            break;
        }

        options.prop('selected', false);
        options[index].selected = true;

        items.parent().removeClass(activeClass);
        items.item(index).parent().addClass(activeClass);

        this.index = index;
        this.input.change();
    },

    /**
     * Event handler for toggling custom dropdown display.
     *
     * @private
     */
    onToggle: function() {
        if (this.input.prop('disabled')) {
            return;
        }

        if (this.dropdown.is(':shown')) {
            this.hide();
        } else {
            this.show();
        }
    }

}, {
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