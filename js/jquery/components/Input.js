/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Input = Toolkit.Component.extend(function(element, options) {
        this.component = 'Input';
        this.version = '1.1.0';
        this.options = options = this.setOptions(options);
        this.element = element = this.setElement(element);

        if (options.checkbox) {
            element.find(options.checkbox).inputCheckbox(options);
        }

        if (options.radio) {
            element.find(options.radio).inputRadio(options);
        }

        if (options.select) {
            element.find(options.select).inputSelect(options);
        }

        this.fireEvent('init');
    }, {

        /**
         * Build the element to wrap custom inputs with.
         * Copy over the original class names.
         *
         * @returns {jQuery}
         */
        buildWrapper: function() {
            var wrapper = $('<div/>')
                .addClass(Toolkit.options.vendor + 'custom-input')
                .insertBefore(this.input)
                .append(this.input);

            if (this.options.copyClasses) {
                this.copyClasses(this.input, wrapper);
            }

            return wrapper;
        },

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
        }

    }, {
        checkbox: 'input:checkbox',
        radio: 'input:radio',
        select: 'select'
    });

    /**
     * Wraps a checkbox with a custom input.
     * Uses a label for checkbox toggling so no JavaScript events are required.
     */
    Toolkit.Input.Checkbox = Toolkit.Input.extend(function(checkbox, options) {
        this.component = 'Input.Checkbox';
        this.version = '1.1.0';

        // Custom options
        this.options = this.setOptions(options);

        // Base input
        this.input = $(checkbox);

        // Wrapping div
        this.wrapper = this.buildWrapper();

        // Custom input
        this.element = this.setElement(
            $('<label/>')
                .addClass(Toolkit.options.vendor + 'checkbox')
                .attr('for', this.input.attr('id'))
                .insertAfter(this.input), this.options);

        this.fireEvent('init');

    }, {}, {
        copyClasses: true
    });

    /**
     * Wraps a radio with a custom input.
     * Uses a label for radio toggling so no JavaScript events are required.
     */
    Toolkit.Input.Radio = Toolkit.Input.extend(function(radio, options) {
        this.component = 'Input.Radio';
        this.version = '1.1.0';

        // Custom options
        this.options = this.setOptions(options);

        // Base input
        this.input = $(radio);

        // Wrapping div
        this.wrapper = this.buildWrapper();

        // Custom input
        this.element = this.setElement(
            $('<label/>')
                .addClass(Toolkit.options.vendor + 'radio')
                .attr('for', this.input.attr('id'))
                .insertAfter(this.input), this.options);

        this.fireEvent('init');

    }, {}, {
        copyClasses: true
    });

    /**
     * Wraps a select dropdown with a custom input.
     * Supports native or custom dropdowns.
     */
    Toolkit.Input.Select = Toolkit.Input.extend(function(select, options) {
        this.component = 'Input.Select';
        this.version = '1.1.0';

        // Custom options
        this.options = options = this.setOptions(options);

        // Base input
        this.input = select = $(select);

        // Is it a multi-select
        this.multiple = select.prop('multiple');

        // Multiple selects must use native controls
        if (this.multiple && options.native) {
            return;
        }

        // Wrapping div
        this.wrapper = this.buildWrapper();

        // Custom input
        this.element = this.buildButton();

        // Custom dropdown
        this.dropdown = null;

        // Current index while cycling through options
        this.currentIndex = 0;

        // Set events
        this.input.change(this.__change.bind(this));

        if (!this.options.native) {
            this.buildDropdown();

            // Cant hide/invisible the real select or we lose focus/blur
            // So place it below .custom-input
            this.input
                .css('z-index', 1)
                .blur(this.hide.bind(this));

            this.dropdown.clickout(this.hide.bind(this));

            this.element
                .clickout(this.hide.bind(this))
                .click(this.__toggle.bind(this));
        }

        if (!this.multiple) {
            $(window).keydown(this.__cycle.bind(this));
        }

        // Trigger change immediately to update the label
        this.input.change();

        this.fireEvent('init');
    }, {

        /**
         * Build the element to represent the select button with label and arrow.
         *
         * @returns {jQuery}
         */
        buildButton: function() {
            var vendor = Toolkit.options.vendor,
                button = $('<div/>')
                    .addClass(vendor + 'select')
                    .append( $('<div/>').addClass(vendor + 'select-arrow').html(this.options.arrowContent) )
                    .append( $('<div/>').addClass(vendor + 'select-label').html(Toolkit.options.loadingMessage) )
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
        buildDropdown: function() {
            var vendor = Toolkit.options.vendor,
                select = this.input,
                options = this.options,
                buildOption = this.buildOption.bind(this),
                dropdown = $('<div/>').addClass(vendor + 'drop--down').addClass(vendor + 'select-options'),
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
                            self.currentIndex = index;
                        }

                        list.append( buildOption(option, index) );
                        index++;
                    });
                } else {
                    if (optgroup.prop('selected')) {
                        self.currentIndex = index;
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
                dropdown.addClass(Toolkit.options.isPrefix + 'multiple');
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
        buildOption: function(option, index) {
            var select = this.input,
                dropdown = this.dropdown,
                activeClass = Toolkit.options.isPrefix + 'active';

            // Create elements
            var li = $('<li/>'),
                content = option.text(),
                description;

            if (option.prop('selected')) {
                li.addClass(activeClass);
            }

            if (description = this.readValue(option, this.options.getDescription)) {
                content += ' <span class="' + Toolkit.options.vendor + 'drop-desc">' + description + '</span>';
            }

            var a = $('<a/>')
                .html(content)
                .attr('href', 'javascript:;');

            if (this.options.copyClasses) {
                this.copyClasses(option, li);
            }

            li.append(a);

            // Attach no events for disabled options
            if (option.prop('disabled')) {
                li.addClass(Toolkit.options.isPrefix + 'disabled');

                return li;
            }

            // Set events
            if (this.multiple) {
                a.click(function() {
                    if (option.prop('selected')) {
                        option.prop('selected', false);
                        $(this).parent().removeClass(activeClass);

                    } else {
                        option.prop('selected', true);
                        $(this).parent().addClass(activeClass);
                    }

                    select.change();
                });

            } else {
                var self = this;

                a.click(function() {
                    dropdown.find('li').removeClass(activeClass);
                    $(this).parent().addClass(activeClass);

                    self.hide();
                    self.currentIndex = index;

                    select.val(option.val());
                    select.change();
                });
            }

            return li;
        },

        /**
         * Hide the dropdown and remove active states.
         */
        hide: function() {
            this.element.removeClass(Toolkit.options.isPrefix + 'active');

            if (this.dropdown) {
                this.dropdown.conceal();
            }

            this.fireEvent('hide');
        },

        /**
         * Show the dropdown and apply active states.
         */
        show: function() {
            this.element.addClass(Toolkit.options.isPrefix + 'active');

            if (this.dropdown) {
                this.dropdown.reveal();
            }

            this.fireEvent('show');
        },

        /**
         * Event handler for select option changing.
         *
         * @private
         * @param {jQuery.Event} e
         */
        __change: function(e) {
            var select = $(e.target),
                options = select.find('option'),
                selected = [],
                label = [],
                self = this;

            // Fetch label from selected option
            options.each(function() {
                if (this.selected) {
                    selected.push( this );
                    label.push( self.readValue(this, self.options.getOptionLabel) || this.textContent );
                }
            });

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
            select.parent().find('.' + Toolkit.options.vendor + 'select-label')
                .text(label);

            this.fireEvent('change', [select.val(), selected]);
        },

        /**
         * Event handler for cycling through options with up and down keys.
         *
         * @private
         * @param {DOMEvent} e
         */
        __cycle: function(e) {
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
                activeClass = Toolkit.options.isPrefix + 'active',
                index = this.currentIndex;

            switch (e.keyCode) {
                case 13: // enter
                case 27: // esc
                    this.hide();
                return;
                case 38: // up
                    index = this.__loop(index, -1, options);
                break;
                case 40: // down
                    index = this.__loop(index, 1, options);
                break;
            }

            options.prop('selected', false);
            options[index].selected = true;

            items.parent().removeClass(activeClass);
            items.item(index).parent().addClass(activeClass);

            this.currentIndex = index;
            this.input.change();
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
        __loop: function(index, step, options) {
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
         * Event handler for toggling custom dropdown display.
         *
         * @private
         * @param {jQuery.Event} e
         */
        __toggle: function(e) {
            if (!this.enabled || this.input.prop('disabled')) {
                return;
            }

            if (this.dropdown.is(':shown')) {
                this.hide();
            } else {
                this.show();
            }
        }

    }, {
        copyClasses: true,
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
    Toolkit.createComponent('input', function(options) {
        return new Toolkit.Input(this, options);
    });

    Toolkit.createComponent('inputRadio', function(options) {
        return new Toolkit.Input.Radio(this, options);
    });

    Toolkit.createComponent('inputCheckbox', function(options) {
        return new Toolkit.Input.Checkbox(this, options);
    });

    Toolkit.createComponent('inputSelect', function(options) {
        return new Toolkit.Input.Select(this, options);
    });

})(jQuery);