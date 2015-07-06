/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../toolkit',
    './component'
], function($, Toolkit, Component) {

var Input = Toolkit.Input = Component.extend({
    name: 'Input',
    version: '2.1.0',

    /** The custom input element. */
    input: null,

    /** The element that wraps the custom input. */
    wrapper: null,

    /**
     * Initialize the input.
     *
     * @param {jQuery} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {
        element = this.setElement(element);
        options = this.setOptions(options, element);

        if (options.checkbox) {
            element.find(options.checkbox).inputCheckbox(options);
        }

        if (options.radio) {
            element.find(options.radio).inputRadio(options);
        }

        if (options.select) {
            element.find(options.select).inputSelect(options);
        }

        this.initialize();
    },

    /**
     * Remove the wrapper before destroying.
     */
    destructor: function() {
        var options = this.options,
            element = this.element;

        if (this.name === 'Input') {
            if (options.checkbox) {
                element.find(options.checkbox).each(function() {
                    $(this).toolkit('inputCheckbox', 'destroy');
                });
            }

            if (options.radio) {
                element.find(options.radio).each(function() {
                    $(this).toolkit('inputRadio', 'destroy');
                });
            }

            if (options.select) {
                element.find(options.select).each(function() {
                    $(this).toolkit('inputSelect', 'destroy');
                });
            }

        // Check for the wrapper as some inputs may be initialized but not used.
        // Multi-selects using native controls for example.
        } else if (this.wrapper) {
            this.wrapper.replaceWith(element);
            element.removeAttr('style');
        }
    },

    /**
     * Copy classes from one element to another, but do not copy `filterClasses` classes.
     *
     * @param {jQuery} from
     * @param {jQuery} to
     */
    copyClasses: function(from, to) {
        var classes = ($(from).attr('class') || '').replace(this.options.filterClasses, '').trim();

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
        var input = this.element,
            wrapper = this.render(this.options.template)
                .insertBefore(input)
                .append(input);

        if (this.options.copyClasses) {
            this.copyClasses(input, wrapper);
        }

        return wrapper;
    }

}, {
    copyClasses: true,
    filterClasses: /\binput\b/,
    checkbox: 'input:checkbox',
    radio: 'input:radio',
    select: 'select',
    template: function(bem) {
        return '<div class="' + bem('custom-input') + '"></div>';
    }
});

Toolkit.createPlugin('input', function(options) {
    return new Input(this, options);
});

return Input;
});
