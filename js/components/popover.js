/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    './tooltip',
    '../flags/namespace'
], function($, Toolkit, namespace) {

Toolkit.Popover = Toolkit.Tooltip.extend({
    name: 'Popover',
    version: '2.0.0',

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

        Toolkit.Tooltip.prototype.constructor.call(this, nodes, options);
    }

}, {
    getContent: 'data-popover',
    wrapperClass: function() {
        return namespace + 'popovers';
    },
    template: function() {
        return '<div class="' + namespace + 'popover">' +
            '<div class="' + namespace + 'popover-inner">' +
                '<div class="' + namespace + 'popover-head" data-popover-header></div>' +
                '<div class="' + namespace + 'popover-body" data-popover-content></div>' +
            '</div>' +
            '<div class="' + namespace + 'popover-arrow"></div>' +
        '</div>';
    }
});

Toolkit.createPlugin('popover', function(options) {
    return new Toolkit.Popover(this, options);
}, true);

return Toolkit;
});
