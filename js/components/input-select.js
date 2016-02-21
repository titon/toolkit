/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../toolkit',
    './input-wrapper',
    '../events/clickout',
    '../extensions/shown-selector',
    '../extensions/to-string'
], function($, Toolkit, Input) {

var InputSelect = Toolkit.InputSelect = Input.extend({
    name: 'InputSelect',
    version: '2.1.0',

    /**
     * Initialize the select.
     *
     * @param {jQuery} select
     * @param {Object} [options]
     */
    constructor: function(select, options) {

        if (!options.native) {
            this.addEvents([
                ['blur', 'element', 'hide'],
                ['clickout', 'dropdown', 'hide'],
                ['click', 'input', 'onToggle']
            ]);

            if (!this.multiple) {
                this.addEvent('keydown', 'window', 'onCycle');
            }

            // Build custom dropdown when not in native
            this.dropdown = this._buildDropdown();

            // Cant hide/invisible the real select or we lose focus/blur
            // So place it below .custom-input
            this.element.css('z-index', 1);
        }
    },

    /**
     * Hide the dropdown and remove active states.
     */
    hide: function() {
        if (!this.dropdown.is(':shown')) {
            return; // Vastly speeds up rendering time since click/out events aren't running
        }

        this.fireEvent('hiding');

        this.input.removeClass('is-active');

        this.dropdown.conceal();

        this.fireEvent('hidden');
    },

    /**
     * Show the dropdown and apply active states.
     */
    show: function() {
        this.fireEvent('showing');

        if (this.options.hideOpened) {
            $(this.ns('options', 'select')).each(function() {
                $(this).siblings('select').toolkit('inputSelect', 'hide');
            });
        }

        this.input.addClass('is-active');

        this.dropdown.reveal();

        this.fireEvent('shown');
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

        while (($.type(options[index]) === 'undefined') || options[index].disabled || (index === 0 && hideFirst)) {
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

        var options = this.element.find('option'),
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
        items.eq(index).parent().addClass(activeClass);

        this.index = index;
        this.element.change();
    },

}, {
    hideOpened: true,
    hideFirst: false,
    hideSelected: false
});

Toolkit.createPlugin('inputSelect', function(options) {
    return new InputSelect(this, options);
});

return InputSelect;
});
