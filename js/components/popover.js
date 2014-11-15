define([
    'jquery',
    './tooltip',
    '../flags/vendor'
], function($, Toolkit, vendor) {

var TooltipPrototype = Toolkit.Tooltip.prototype;

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

        TooltipPrototype.constructor.call(this, nodes, options);
    },

    /**
     * {@inheritdoc}
     */
    reset: function() {
        TooltipPrototype.reset.call(this);

        if (this.node) {
            this.node.removeClass('is-active');
        }
    },

    /**
     * {@inheritdoc}
     */
    show: function() {
        TooltipPrototype.show.apply(this, arguments);

        if (this.node) {
            this.node.addClass('is-active');
        }
    }

}, {
    getContent: 'data-popover',
    template: '<div class="' + vendor + 'popover">' +
        '<div class="' + vendor + 'popover-inner">' +
            '<div class="' + vendor + 'popover-head" data-popover-header></div>' +
            '<div class="' + vendor + 'popover-body" data-popover-content></div>' +
        '</div>' +
        '<div class="' + vendor + 'popover-arrow"></div>' +
    '</div>'
});

Toolkit.create('popover', function(options) {
    return new Toolkit.Popover(this, options);
}, true);

return Toolkit;
});