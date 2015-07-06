/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../toolkit',
    './input-wrapper'
], function($, Toolkit, Input) {

var InputCheckbox = Toolkit.InputCheckbox = Input.extend({
    name: 'InputCheckbox',
    version: '2.1.0',

    /**
     * Initialize the checkbox.
     *
     * @param {jQuery} checkbox
     * @param {Object} [options]
     */
    constructor: function(checkbox, options) {
        this.element = checkbox = $(checkbox);
        options = this.setOptions(options, checkbox);
        this.wrapper = this._buildWrapper();

        // Create custom input
        this.input = this.render(options.checkboxTemplate)
            .attr('for', checkbox.attr('id'))
            .insertAfter(checkbox);

        // Initialize events
        this.initialize();
    }

}, {
    checkboxTemplate: function(bem) {
        return '<label class="' + bem('checkbox') + '"></label>';
    }
});

Toolkit.createPlugin('inputCheckbox', function(options) {
    return new InputCheckbox(this, options);
});

return InputCheckbox;
});
