/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../toolkit',
    './tooltip'
], function($, Toolkit, Tooltip) {

var Popover = Toolkit.Popover = Tooltip.extend({
    name: 'Popover',
    version: '2.1.3',

    /**
     * Initialize the popover.
     *
     * @param {jQuery} nodes
     * @param {Object} [options]
     */
    constructor: function(nodes, options) {
        options = options || {};
        options.mode = 'click'; // Click only
        options.follow = false; // Disable mouse follow

        Tooltip.prototype.constructor.call(this, nodes, options);
    }

}, {
    getContent: 'data-popover',
    wrapperClass: function(bem) {
        return bem('popovers');
    },
    template: function(bem) {
        return '<div class="' + bem('popover') + '">' +
            '<div class="' + bem('popover', 'inner') + '">' +
                '<div class="' + bem('popover', 'head') + '" data-popover-header></div>' +
                '<div class="' + bem('popover', 'body') + '" data-popover-content></div>' +
            '</div>' +
            '<div class="' + bem('popover', 'arrow') + '"></div>' +
        '</div>';
    }
});

Toolkit.createPlugin('popover', function(options) {
    return new Popover(this, options);
}, true);

return Popover;
});
