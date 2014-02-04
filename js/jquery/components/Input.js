/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Input = Toolkit.Component.create(function(element, options) {
        this.component = 'Input';
        this.version = '0.0.0';

        /** Custom options */
        this.options = this.setOptions(Toolkit.Input.options, options);

        /** List of form elements */
        this.element = this.setElement(element, this.options);

        this.initialize();
    });

    Toolkit.Input.options = {
        checkbox: 'input:checkbox',
        radio: 'input:radio',
        select: 'select'
    };

    var Input = Toolkit.Input.prototype;

    /**
     * Replace specific form elements with custom replacements.
     */
    Input.initialize = function() {
        if (!this.element) {
            return;
        }

        var options = this.options;

        if (options.checkbox) {
            this.element.find(options.checkbox).checkbox(options);
        }

        if (options.radio) {
            this.element.find(options.radio).radio(options);
        }

        if (options.select) {
            this.element.find(options.select).select(options);
        }

        this.fireEvent('init');
    };

    /**
     * Build the element to wrap custom inputs with.
     * Copy over the original class names.
     *
     * @returns {jQuery}
     */
    Input.buildWrapper = function() {
        var wrapper = $('<div/>')
            .addClass(Toolkit.options.vendor + 'custom-input')
            .insertBefore(this.input)
            .append(this.input);

        if (this.options.copyClasses) {
            this.copyClasses(this.input, wrapper);
        }

        return wrapper;
    };

    /**
     * Copy classes from one element to another, but do not copy .input classes.
     *
     * @param {jQuery} from
     * @param {jQuery} to
     * @returns {Toolkit.Input}
     */
    Input.copyClasses = function(from, to) {
        var classes = ($(from).attr('class') || '').replace(/\binput\b/, '').trim();

        if (classes) {
            $(to).addClass(classes);
        }

        return this;
    };

    /**
     * Wraps a checkbox with a custom input.
     * Uses a label for checkbox toggling so no JavaScript events are required.
     */
    Toolkit.Input.Checkbox = Toolkit.Input.create(function(checkbox, options) {
        this.component = 'Input.Checkbox';
        this.version = '0.0.0';

        /** Custom options */
        this.options = this.setOptions(Toolkit.Input.Checkbox.options, options);

        /** Base input */
        this.input = $(checkbox);

        /** Wrapping div */
        this.wrapper = this.buildWrapper();

        /** Custom input */
        this.element = this.setElement(
            $('<label/>')
                .addClass(Toolkit.options.vendor + 'checkbox')
                .attr('for', this.input.attr('id'))
                .insertAfter(this.input), this.options);

        this.fireEvent('init');
    });

    Toolkit.Input.Checkbox.options = {
        copyClasses: true
    };

    /**
     * Wraps a radio with a custom input.
     * Uses a label for radio toggling so no JavaScript events are required.
     */
    Toolkit.Input.Radio = Toolkit.Input.create(function(radio, options) {
        this.component = 'Input.Radio';
        this.version = '0.0.0';

        /** Custom options */
        this.options = this.setOptions(Toolkit.Input.Radio.options, options);

        /** Base input */
        this.input = $(radio);

        /** Wrapping div */
        this.wrapper = this.buildWrapper();

        /** Custom input */
        this.element = this.setElement(
            $('<label/>')
                .addClass(Toolkit.options.vendor + 'radio')
                .attr('for', this.input.attr('id'))
                .insertAfter(this.input), this.options);

        this.fireEvent('init');
    });

    Toolkit.Input.Radio.options = {
        copyClasses: true
    };

    /**
     * Wraps a select dropdown with a custom input.
     * Supports native or custom dropdowns.
     */
    Toolkit.Input.Select = Toolkit.Input.create(function(select, options) {
        this.component = 'Input.Select';
        this.version = '0.0.0';

        /** Custom options */
        this.options = this.setOptions(Toolkit.Input.Select.options, options);

        /** Base input */
        this.input = $(select);

        /** Is it a multi-select */
        this.multiple = this.input.prop('multiple');

        // Multiple selects must use native controls
        if (this.multiple && this.options.native) {
            return;
        }

        /** Wrapping div */
        this.wrapper = this.buildWrapper();

        /** Custom input */
        this.element = this.buildButton();

        /** Custom dropdown */
        this.dropdown = null;

        /** Current index while cycling through options */
        this.currentIndex = 0;

        this.initialize();
    });

    Toolkit.Input.Select.options = {
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
    };

    var Select = Toolkit.Input.Select.prototype;

    /**
     * Wrap the select with a custom element.
     */
    Select.initialize = function() {
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
    };

    /**
     * Build the element to represent the select button with label and arrow.
     *
     * @returns {jQuery}
     */
    Select.buildButton = function() {
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
    };

    /**
     * Build the custom dropdown to hold a list of option items.
     *
     * @returns {Toolkit.Input.Select}
     */
    Select.buildDropdown = function() {
        var vendor = Toolkit.options.vendor,
            select = this.input,
            options = this.options,
            buildOption = this.buildOption.bind(this),
            dropdown = $('<div/>').addClass(vendor + 'drop--down').addClass(vendor + 'select-options'),
            list = $('<ul/>'),
            index = 0,
            self = this;

        if (options.hideSelected && !options.multiple) {
            dropdown.addClass('hide-selected');
        }

        if (select.multiple) {
            dropdown.addClass(Toolkit.options.isPrefix + 'multiple');
        }

        this.dropdown = dropdown;

        select.children().each(function() {
            var optgroup = $(this);

            if (optgroup.prop('tagName').toLowerCase() === 'optgroup') {
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
                if (options.hideFirst && index === 0) {
                    return;
                }

                if (optgroup.prop('selected')) {
                    self.currentIndex = index;
                }

                list.append( buildOption(optgroup, index) );
                index++;
            }
        });

        this.wrapper.append(dropdown.append(list));

        return this;
    };

    /**
     * Build the list item to represent the select option.
     *
     * @param {jQuery} option
     * @param {Number} index
     * @returns {jQuery}
     */
    Select.buildOption = function(option, index) {
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
    };

    /**
     * Hide the dropdown and remove active states.
     *
     * @returns {Toolkit.Input.Select}
     */
    Select.hide = function() {
        this.element.removeClass(Toolkit.options.isPrefix + 'active');

        if (this.dropdown) {
            this.dropdown.conceal();
        }

        this.fireEvent('hide');

        return this;
    };

    /**
     * Show the dropdown and apply active states.
     *
     * @returns {Toolkit.Input.Select}
     */
    Select.show = function() {
        this.element.addClass(Toolkit.options.isPrefix + 'active');

        if (this.dropdown) {
            this.dropdown.reveal();
        }

        this.fireEvent('show');

        return this;
    };

    /**
     * Event handler for select option changing.
     *
     * @private
     * @param {Event} e
     */
    Select.__change = function(e) {
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

        this.fireEvent('change', [select.get('value'), selected]);
    };

    /**
     * Event handler for cycling through options with up and down keys.
     *
     * @private
     * @param {DOMEvent} e
     */
    Select.__cycle = function(e) {
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
            case 40: // down
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

        options.prop('selected', false);
        options[index].selected = true;

        items.parent().removeClass(activeClass);
        items.item(index).parent().addClass(activeClass);

        this.currentIndex = index;
        this.input.change();
    };

    /**
     * Event handler for toggling custom dropdown display.
     *
     * @private
     * @param {Event} e
     */
    Select.__toggle = function(e) {
        if (!this.enabled || this.input.prop('disabled')) {
            return;
        }

        if (this.dropdown.is(':shown')) {
            this.hide();
        } else {
            this.show();
        }
    };

    /**
     * Enable custom inputs and selects within forms by calling input().
     * An object of options can be passed as the 1st argument.
     *
     * @example
     *     $('form').input();
     *     $('input:radio').radio();
     *     $('input:checkbox').checkbox();
     *     $('select').select();
     *
     * @param {Object} [options]
     * @returns {jQuery}
     */
    $.fn.input = function(options) {
        return this.each(function() {
            new Toolkit.Input(this, options);
        });
    };

    $.fn.radio = function(options) {
        return this.each(function() {
            $(this).addData('toolkit.input.radio', function() {
                return new Toolkit.Input.Radio(this, options);
            });
        });
    };

    $.fn.checkbox = function(options) {
        return this.each(function() {
            $(this).addData('toolkit.input.checkbox', function() {
                return new Toolkit.Input.Checkbox(this, options);
            });
        });
    };

    $.fn.select = function(options) {
        return this.each(function() {
            $(this).addData('toolkit.input.select', function() {
                return new Toolkit.Input.Select(this, options);
            });
        });
    };

})(jQuery);