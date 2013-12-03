/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Toolkit.Input = Toolkit.Component.create(function(elements, options) {

    /** Custom options */
    this.options = this.setOptions(Toolkit.Input.options, options);

    /** List of form elements */
    this.elements = this.setElement(elements, this.options);

    /**
     * Replace specific form elements with custom replacements.
     */
    this.initialize = function() {
        this.fireEvent('init');

        var options = this.options,
            buildWrapper = this._buildWrapper,
            onChange = this.__change.bind(this);

        // Checkboxes
        if (options.checkbox) {
            this.elements.find(options.checkbox).each(function() {
                var el = $(this);

                el.wrap(buildWrapper(el));

                $('<label/>').addClass('checkbox')
                    .attr('for', el.attr('id'))
                    .insertAfter(el);
            });
        }

        // Radios
        if (options.radio) {
            this.elements.find(options.radio).each(function() {
                var el = $(this);

                el.wrap(buildWrapper(el));

                $('<label/>').addClass('radio')
                    .attr('for', el.attr('id'))
                    .insertAfter(el);
            });
        }

        // Selects
        if (options.select) {
            this.elements.find(options.select).each(function() {
                var el = $(this);

                if (this.multiple) {
                    return; // Do not style multi-selects
                }

                var label = this[this.selectedIndex] ? this[this.selectedIndex].textContent : '--',
                    width = el.outerWidth();

                el.wrap(buildWrapper(el));

                $('<div/>').addClass('select')
                    .append( $('<div/>').addClass('select-arrow').html('<span class="caret-down"></span>') )
                    .append( $('<div/>').addClass('select-label').text(label) )
                    .css('min-width', width)
                    .insertAfter(el);

                el.on('change', onChange);
            });
        }
    };

    /**
     * Build the element to wrap custom inputs with.
     * Copy over the original class names.
     *
     * @private
     * @param {jQuery} element
     * @returns {jQuery}
     */
    this._buildWrapper = function(element) {
        var div = $('<div/>').addClass('custom-input'),
            classes = (element.attr('class') || '').replace(/\binput\b/, '').trim();

        if (classes) {
            div.addClass(classes);
        }

        return div;
    };

    /**
     * Event handler for select option changing.
     *
     * @private
     * @param {Event} e
     */
    this.__change = function(e) {
        var select = e.currentTarget;

        if (select[select.selectedIndex]) {
            $(select).parent().find('.select-label')
                .text(select[select.selectedIndex].textContent);
        }
    };

    if (this.elements.length) {
        this.initialize();
    }
});

Toolkit.Input.options = {
    checkbox: 'input:checkbox',
    radio: 'input:radio',
    select: 'select'
};

/**
 * Enable custom inputs and selects within forms by calling input().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $('form').input({
 *         checkbox: true
 *     });
 *
 * @param {Object} [options]
 * @returns {jQuery}
 */
$.fn.input = function(options) {
    return this.each(function() {
        $(this).addData('toolkit.input', function() {
            return new Toolkit.Input(this, options);
        });
    });
};

})(jQuery);