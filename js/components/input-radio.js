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

var InputRadio = Toolkit.InputRadio = Input.extend({
    name: 'InputRadio',
    version: '2.1.0',

    /**
     * Initialize the radio.
     *
     * @param {jQuery} radio
     * @param {Object} [options]
     */
    constructor: function(radio, options) {
        this.element = radio = $(radio);
        options = this.setOptions(options, radio);
        this.wrapper = this._buildWrapper();

        // Create custom input
        this.input = this.render(options.radioTemplate)
            .attr('for', radio.attr('id'))
            .insertAfter(radio);

        // Initialize events
        this.initialize();
    }

}, {
    radioTemplate: function(bem) {
        return '<label class="' + bem('radio') + '"></label>';
    }
});

Toolkit.createPlugin('inputRadio', function(options) {
    return new InputRadio(this, options);
});

return InputRadio;
});
