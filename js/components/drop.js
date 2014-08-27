define([
    'jquery',
    './component',
    '../events/clickout',
    '../extensions/shown-selector'
], function($, Toolkit) {

Toolkit.Drop = Toolkit.Component.extend({
    name: 'Drop',
    version: '1.4.0',

    /**
     * Initialize the drop.
     *
     * @param {jQuery} nodes
     * @param {Object} [options]
     */
    constructor: function(nodes, options) {
        this.nodes = $(nodes);
        this.options = this.setOptions(options);
        this.events = {
            'clickout document [data-drop-menu]': 'hide',
            'clickout document {selector}': 'hide',
            '{mode} document {selector}': 'onShow'
        };

        // Initialize
        this.initialize();
    },

    /**
     * Hide the opened element and remove active state.
     */
    hide: function() {
        var element = this.element;

        if (element && element.is(':shown')) {
            this.fireEvent('hiding');

            element.conceal();

            this.node
                .aria('toggled', false)
                .removeClass('is-active');

            this.fireEvent('hidden', [element, this.node]);
        }
    },

    /**
     * Open the target element and apply active state.
     *
     * @param {jQuery} node
     */
    show: function(node) {
        this.fireEvent('showing');

        this.element.reveal();

        this.node = node = $(node)
            .aria('toggled', true)
            .addClass('is-active');

        this.fireEvent('shown', [this.element, node]);
    },

    /**
     * When a node is clicked, grab the target from the attribute.
     * Validate the target element, then either display or hide.
     *
     * @param {jQuery.Event} e
     * @private
     */
    onShow: function(e) {
        e.preventDefault();

        var node = $(e.currentTarget),
            options = this.options,
            target = this.readValue(node, options.getTarget);

        if (!target || target.substr(0, 1) !== '#') {
            return;
        }

        // Hide previous drops
        if (options.hideOpened && this.node && !this.node.is(node)) {
            this.hide();
        }

        this.element = $(target);
        this.node = node;

        if (!this.element.is(':shown')) {
            this.show(node);
        } else {
            this.hide();
        }
    }

}, {
    mode: 'click',
    getTarget: 'data-drop',
    hideOpened: true
});

Toolkit.create('drop', function(options) {
    return new Toolkit.Drop(this, options);
}, true);

return Toolkit;
});